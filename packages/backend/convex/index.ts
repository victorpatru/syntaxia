import { Doc } from "./_generated/dataModel";

// Re-export the generated API
export { api, internal } from "./_generated/api";

// Re-export commonly used types
export type { Doc, Id } from "./_generated/dataModel";

// Export specific document types for frontend use
export type InterviewSession = Doc<"interview_sessions">;
export type User = Doc<"users">;
export type CreditTransaction = Doc<"credits_log">;
