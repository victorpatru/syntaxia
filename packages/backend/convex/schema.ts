import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { webhookEventTypes, webhookSources } from "./types/webhooks";

export default defineSchema({
  users: defineTable({
    clerkUserId: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),
    lastActiveAt: v.optional(v.number()),
    credits: v.optional(v.number()),
  })
    .index("by_clerk_id", ["clerkUserId"])
    .index("by_email", ["email"]),

  webhook_events: defineTable({
    eventId: v.string(),
    eventType: webhookEventTypes,
    processedAt: v.number(),
    clerkUserId: v.optional(v.string()),
    source: v.optional(webhookSources),
  }).index("by_event_id", ["eventId"]),

  credits_log: defineTable({
    userId: v.id("users"),
    amount: v.number(),
    reason: v.string(),
    orderId: v.optional(v.string()),
    sessionId: v.optional(v.id("interview_sessions")),
  })
    .index("by_user", ["userId"])
    .index("by_order_id", ["orderId"])
    .index("by_session", ["sessionId"])
    .index("by_session_reason", ["sessionId", "reason"]),

  interview_sessions: defineTable({
    userId: v.id("users"),
    status: v.union(
      v.literal("setup"),
      v.literal("active"),
      v.literal("analyzing"),
      v.literal("complete"),
      v.literal("failed"),
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
    completedAt: v.optional(v.number()),
    jobDescription: v.string(),
    experienceLevel: v.optional(
      v.union(v.literal("mid"), v.literal("senior"), v.literal("staff")),
    ),
    domainTrack: v.optional(
      v.union(
        v.literal("web"),
        v.literal("infrastructure"),
        v.literal("analytics"),
        v.literal("edge"),
      ),
    ),
    detectedSkills: v.optional(v.array(v.string())),
    questions: v.optional(
      v.array(
        v.object({
          id: v.string(),
          text: v.string(),
          type: v.string(),
          difficulty: v.number(),
          expectedDuration: v.optional(v.number()),
          tags: v.optional(v.array(v.string())),
          followUps: v.optional(v.array(v.string())),
        }),
      ),
    ),
    currentQuestionIndex: v.optional(v.number()),
    highlights: v.optional(
      v.array(
        v.object({
          id: v.string(),
          timestamp: v.number(),
          type: v.union(
            v.literal("strength"),
            v.literal("improvement"),
            v.literal("concern"),
          ),
          text: v.string(),
          analysis: v.string(),
          transcriptId: v.string(),
        }),
      ),
    ),
    scores: v.optional(
      v.object({
        overall: v.number(),
        technical: v.number(),
        communication: v.number(),
        problemSolving: v.number(),
        comments: v.object({
          strengths: v.array(v.string()),
          improvements: v.array(v.string()),
          nextSteps: v.array(v.string()),
        }),
      }),
    ),
    duration: v.optional(v.number()),
    elevenlabsSessionId: v.optional(v.string()),
    elevenlabsConversationId: v.optional(v.string()),
    reportGeneratedAt: v.optional(v.number()),
    chargeCommittedAt: v.optional(v.number()),
    startedAt: v.optional(v.number()),
    micOnAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_user_status", ["userId", "status"]),
});
