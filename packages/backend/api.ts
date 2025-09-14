import { type FunctionReference, anyApi } from "convex/server";
import { type GenericId as Id } from "convex/values";

export const api: PublicApiType = anyApi as unknown as PublicApiType;
export const internal: InternalApiType = anyApi as unknown as InternalApiType;

export type PublicApiType = {
  credits: {
    getBalance: FunctionReference<
      "query",
      "public",
      Record<string, never>,
      number
    >;
    getAvailablePackages: FunctionReference<
      "query",
      "public",
      Record<string, never>,
      Array<{ credits: number; description: string; id: string; price: string }>
    >;
    createCheckout: FunctionReference<
      "action",
      "public",
      { packageId: string },
      | { success: true; url: string }
      | { error: string; retryAfterMs?: number; success: false }
    >;
  };
  sessions: {
    getSession: FunctionReference<
      "query",
      "public",
      { sessionId: Id<"interview_sessions"> },
      null | {
        _creationTime: number;
        _id: Id<"interview_sessions">;
        chargeCommittedAt?: number;
        completedAt?: number;
        createdAt: number;
        currentQuestionIndex?: number;
        detectedSkills?: Array<string>;
        domainTrack?: "web" | "infrastructure" | "analytics" | "edge";
        duration?: number;
        elevenlabsConversationId?: string;
        elevenlabsSessionId?: string;
        experienceLevel?: "mid" | "senior" | "staff";
        failureCode?:
          | "AUTH"
          | "UNAUTHORIZED"
          | "NOT_FOUND"
          | "CREDITS"
          | "RATE_LIMIT"
          | "PARSE"
          | "UNKNOWN";
        failureMessage?: string;
        highlights?: Array<{
          analysis: string;
          id: string;
          text: string;
          timestamp: number;
          transcriptId: string;
          type: "strength" | "improvement" | "concern";
        }>;
        jobDescription: string;
        micOnAt?: number;
        questions?: Array<{
          difficulty: number;
          expectedDuration?: number;
          followUps?: Array<string>;
          id: string;
          tags?: Array<string>;
          text: string;
          type: string;
        }>;
        reportGeneratedAt?: number;
        scores?: {
          comments: {
            improvements: Array<string>;
            nextSteps: Array<string>;
            strengths: Array<string>;
          };
          communication: number;
          overall: number;
          problemSolving: number;
          technical: number;
        };
        startedAt?: number;
        status: "setup" | "active" | "analyzing" | "complete" | "failed";
        updatedAt: number;
        userId: Id<"users">;
      }
    >;
    getCurrentSession: FunctionReference<
      "query",
      "public",
      Record<string, never>,
      null | {
        _creationTime: number;
        _id: Id<"interview_sessions">;
        chargeCommittedAt?: number;
        completedAt?: number;
        createdAt: number;
        currentQuestionIndex?: number;
        detectedSkills?: Array<string>;
        domainTrack?: "web" | "infrastructure" | "analytics" | "edge";
        duration?: number;
        elevenlabsConversationId?: string;
        elevenlabsSessionId?: string;
        experienceLevel?: "mid" | "senior" | "staff";
        failureCode?:
          | "AUTH"
          | "UNAUTHORIZED"
          | "NOT_FOUND"
          | "CREDITS"
          | "RATE_LIMIT"
          | "PARSE"
          | "UNKNOWN";
        failureMessage?: string;
        highlights?: Array<{
          analysis: string;
          id: string;
          text: string;
          timestamp: number;
          transcriptId: string;
          type: "strength" | "improvement" | "concern";
        }>;
        jobDescription: string;
        micOnAt?: number;
        questions?: Array<{
          difficulty: number;
          expectedDuration?: number;
          followUps?: Array<string>;
          id: string;
          tags?: Array<string>;
          text: string;
          type: string;
        }>;
        reportGeneratedAt?: number;
        scores?: {
          comments: {
            improvements: Array<string>;
            nextSteps: Array<string>;
            strengths: Array<string>;
          };
          communication: number;
          overall: number;
          problemSolving: number;
          technical: number;
        };
        startedAt?: number;
        status: "setup" | "active" | "analyzing" | "complete" | "failed";
        updatedAt: number;
        userId: Id<"users">;
      }
    >;
    createSessionValidated: FunctionReference<
      "action",
      "public",
      { jobDescription: string },
      | { sessionId: Id<"interview_sessions">; success: true }
      | { error: string; retryAfterMs?: number; success: false }
    >;
    startSetup: FunctionReference<
      "action",
      "public",
      { sessionId: Id<"interview_sessions"> },
      | {
          detectedSkills: Array<string>;
          domainTrack: "web" | "infrastructure" | "analytics" | "edge";
          experienceLevel: "mid" | "senior" | "staff";
          questions: Array<{
            difficulty: number;
            expectedDuration?: number;
            followUps?: Array<string>;
            id: string;
            tags?: Array<string>;
            text: string;
            type: string;
          }>;
          success: true;
        }
      | {
          code:
            | "AUTH"
            | "UNAUTHORIZED"
            | "NOT_FOUND"
            | "CREDITS"
            | "RATE_LIMIT"
            | "PARSE"
            | "UNKNOWN";
          error: string;
          retryAfterMs?: number;
          success: false;
        }
    >;
    getUserBalance: FunctionReference<
      "query",
      "public",
      { sessionId: Id<"interview_sessions"> },
      number
    >;
    startActive: FunctionReference<
      "mutation",
      "public",
      { micOnAt?: number; sessionId: Id<"interview_sessions"> },
      | { sessionId: Id<"interview_sessions">; startedAt: number }
      | { error: string; retryAfterMs?: number; success: false }
    >;
    endSession: FunctionReference<
      "mutation",
      "public",
      {
        elevenlabsConversationId?: string;
        sessionId: Id<"interview_sessions">;
      },
      | { duration: number; sessionId: Id<"interview_sessions"> }
      | { error: string; retryAfterMs?: number; success: false }
    >;
    getConversationToken: FunctionReference<
      "action",
      "public",
      { sessionId: Id<"interview_sessions"> },
      | { conversationToken: string }
      | { error: string; retryAfterMs?: number; success: false }
    >;
    analyzeSession: FunctionReference<
      "action",
      "public",
      { sessionId: Id<"interview_sessions"> },
      | null
      | {
          highlights: Array<{
            analysis: string;
            id: string;
            text: string;
            timestamp: number;
            transcriptId: string;
            type: "strength" | "improvement" | "concern";
          }>;
          scores: {
            comments: {
              improvements: Array<string>;
              nextSteps: Array<string>;
              strengths: Array<string>;
            };
            communication: number;
            overall: number;
            problemSolving: number;
            technical: number;
          };
        }
      | { error: string; retryAfterMs?: number; success: false }
    >;
    getCompletedSessionsList: FunctionReference<
      "query",
      "public",
      {
        paginationOpts: {
          cursor: string | null;
          endCursor?: string | null;
          id?: number;
          maximumBytesRead?: number;
          maximumRowsRead?: number;
          numItems: number;
        };
      },
      {
        continueCursor: string;
        isDone: boolean;
        page: Array<{
          _id: Id<"interview_sessions">;
          createdAt: number;
          duration?: number;
          scores?: { overall: number };
          status: "complete";
        }>;
      }
    >;
  };
  users: {
    currentUserId: FunctionReference<
      "query",
      "public",
      Record<string, never>,
      null | Id<"users">
    >;
    getCurrentUserProfile: FunctionReference<
      "query",
      "public",
      Record<string, never>,
      null | {
        credits: number;
        isWelcomeEligible: boolean;
        userId: Id<"users">;
      }
    >;
  };
};
export type InternalApiType = {};
