import {
  BEHAVIORAL_QUESTION_BANK,
  type BehavioralCategory,
} from "@syntaxia/shared";
import { generateObject } from "ai";
import { v } from "convex/values";
import { z } from "zod";
import { internal } from "./_generated/api";
import { action, internalMutation } from "./_generated/server";
import { env } from "./env";
import { checkRateLimit } from "./rate_limit/helpers";
import { requireUser } from "./users";
import { HighlightValidator, ScoresValidator } from "./validators";

const AnalysisResponseSchema = z.object({
  scores: z.object({
    overall: z.number().min(1).max(10),
    technical: z.number().min(1).max(10),
    communication: z.number().min(1).max(10),
    problemSolving: z.number().min(1).max(10),
    comments: z.object({
      strengths: z.array(z.string()),
      improvements: z.array(z.string()),
      nextSteps: z.array(z.string()),
    }),
  }),
  highlights: z.array(
    z.object({
      id: z.string(),
      timestamp: z.number(),
      type: z.enum(["strength", "improvement", "concern"]),
      text: z.string(),
      analysis: z.string(),
      transcriptId: z.string(),
    }),
  ),
});

export const createSessionValidated = action({
  args: {
    category: v.union(
      v.literal("Conflict"),
      v.literal("Leadership"),
      v.literal("Failure"),
      v.literal("Ownership"),
      v.literal("Success"),
    ),
  },
  returns: v.union(
    v.object({
      success: v.literal(true),
      sessionId: v.id("interview_sessions"),
    }),
    v.object({
      success: v.literal(false),
      error: v.string(),
      retryAfterMs: v.optional(v.number()),
    }),
  ),
  handler: async (ctx, { category }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { success: false as const, error: "Not authenticated" };
    }

    const limit = await checkRateLimit(
      ctx,
      "createBehavioralSession",
      identity.subject,
    );
    if (!limit.ok) {
      return {
        success: false as const,
        error: "Too many attempts. Please try again later.",
        retryAfterMs: limit.retryAfterMs,
      };
    }

    const sessionId = await ctx.runMutation(
      internal.behavioral._createSession,
      {
        category,
      },
    );
    return { success: true as const, sessionId };
  },
});

export const _createSession = internalMutation({
  args: {
    category: v.union(
      v.literal("Conflict"),
      v.literal("Leadership"),
      v.literal("Failure"),
      v.literal("Ownership"),
      v.literal("Success"),
    ),
  },
  returns: v.id("interview_sessions"),
  handler: async (ctx, { category }) => {
    const user = await requireUser(ctx);

    const existing = await ctx.db
      .query("interview_sessions")
      .withIndex("by_user_status", (q) =>
        q.eq("userId", user._id).eq("status", "setup"),
      )
      .first();
    if (existing) {
      throw new Error("You already have an active interview session");
    }

    const now = Date.now();
    const questions = BEHAVIORAL_QUESTION_BANK[category as BehavioralCategory];
    const selected = questions[Math.floor(Math.random() * questions.length)];

    const sessionId = await ctx.db.insert("interview_sessions", {
      userId: user._id,
      status: "setup",
      mode: "behavioral",
      createdAt: now,
      updatedAt: now,
      jobDescription: "", // not used for behavioral
      experienceLevel: "mid",
      domainTrack: "web",
      behavioralCategory: category as BehavioralCategory,
      behavioralQuestion: selected,
      questions: [
        {
          id: "behavioral-1",
          text: selected,
          type: "behavioral",
          difficulty: 2,
          tags: ["behavioral", category],
        },
      ],
      currentQuestionIndex: 0,
    });
    return sessionId;
  },
});

export const startSetup = action({
  args: { sessionId: v.id("interview_sessions") },
  returns: v.union(
    v.object({
      success: v.literal(true),
    }),
    v.object({
      success: v.literal(false),
      error: v.string(),
      retryAfterMs: v.optional(v.number()),
    }),
  ),
  handler: async (ctx, { sessionId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { success: false as const, error: "Not authenticated" };
    }

    const limit = await checkRateLimit(
      ctx,
      "behavioralStartSetup",
      identity.subject,
    );
    if (!limit.ok) {
      return {
        success: false as const,
        error: "Too many attempts. Please try again later.",
        retryAfterMs: limit.retryAfterMs,
      };
    }

    const { session, resolvedUserId, balance } = await ctx.runQuery(
      internal.sessions.getSessionDataForSetup,
      { sessionId, clerkUserId: identity.subject },
    );
    if (!session || session.mode !== "behavioral") {
      return { success: false as const, error: "Session not found" };
    }
    if (!resolvedUserId || session.userId !== resolvedUserId) {
      return { success: false as const, error: "Unauthorized" };
    }
    if (balance < 15) {
      await ctx.runMutation(internal.sessions.markFailed, {
        sessionId,
        code: "CREDITS" as const,
        message:
          "Insufficient credits. Need at least 15 credits to start an interview.",
      });
      return {
        success: false as const,
        error:
          "Insufficient credits. Need at least 15 credits to start an interview.",
      };
    }

    // Nothing to parse for behavioral; ensure fields exist and return
    return { success: true as const };
  },
});

export const analyzeSession = action({
  args: { sessionId: v.id("interview_sessions") },
  returns: v.union(
    v.null(),
    v.object({
      scores: ScoresValidator,
      highlights: v.array(HighlightValidator),
    }),
    v.object({
      success: v.literal(false),
      error: v.string(),
      retryAfterMs: v.optional(v.number()),
    }),
  ),
  handler: async (ctx, { sessionId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const limit = await checkRateLimit(
      ctx,
      "behavioralAnalyzeSession",
      identity.subject,
    );
    if (!limit.ok) {
      return {
        success: false as const,
        error: "Too many attempts. Please try again later.",
        retryAfterMs: limit.retryAfterMs,
      };
    }

    const session = await ctx.runQuery(internal.sessions.getInternal, {
      sessionId,
    });
    if (
      !session ||
      session.status !== "analyzing" ||
      session.mode !== "behavioral"
    ) {
      throw new Error("Session not ready for analysis");
    }

    try {
      let transcript = "No transcript available";
      if (session.elevenlabsConversationId) {
        try {
          const transcriptResponse = await fetch(
            `https://api.elevenlabs.io/v1/convai/conversations/${session.elevenlabsConversationId}`,
            { headers: { "xi-api-key": env.ELEVENLABS_API_KEY } },
          );
          if (transcriptResponse.ok) {
            const transcriptData = await transcriptResponse.json();
            transcript =
              transcriptData.conversation_summary ||
              "Transcript retrieved successfully";
          }
        } catch {}
      }

      if ((session.duration || 0) < 120) {
        await ctx.runMutation(internal.sessions.markCompleteWithoutScores, {
          sessionId,
        });
        return null;
      }

      const { object: analysisResult } = await generateObject({
        model: "google/gemini-2.5-flash",
        schema: AnalysisResponseSchema,
        prompt: `Analyze this behavioral interview answer using the STAR framework. Provide numeric scores compatible with our app (overall, technical, communication, problemSolving) where:\n- "technical" approximates STAR quality/structure\n- "problemSolving" reflects clarity of actions and reasoning\n\nSTAR Focus:\n- Situation: clarity of context\n- Task: clear objective or problem\n- Action: specific actions taken, ownership, decisions\n- Result: measurable outcome and reflection\n\nTranscript:\n${transcript}\n\nQuestion:\n${session.behavioralQuestion}\n\nProvide:\n1) Scores (1-10): overall, technical, communication, problemSolving\n2) Up to 10 highlights with timestamps (strengths/improvements)\n3) Actionable next steps\n`,
      });

      await ctx.runMutation(internal.sessions.markComplete, {
        sessionId,
        scores: analysisResult.scores,
        highlights: analysisResult.highlights,
      });
      return analysisResult;
    } catch {
      await ctx.runMutation(internal.sessions.markFailed, { sessionId });
      return {
        success: false as const,
        error: "Failed to analyze interview. Please try again.",
      };
    }
  },
});
