import { v } from "convex/values";

export const StatusValidator = v.union(
  v.literal("setup"),
  v.literal("active"),
  v.literal("analyzing"),
  v.literal("complete"),
  v.literal("failed"),
);

export const FailureCodeValidator = v.union(
  v.literal("AUTH"),
  v.literal("UNAUTHORIZED"),
  v.literal("NOT_FOUND"),
  v.literal("CREDITS"),
  v.literal("RATE_LIMIT"),
  v.literal("PARSE"),
  v.literal("UNKNOWN"),
);

export const ExperienceLevelValidator = v.union(
  v.literal("junior"),
  v.literal("mid"),
  v.literal("senior"),
  v.literal("staff"),
);

export const DomainTrackValidator = v.union(
  v.literal("web"),
  v.literal("infrastructure"),
  v.literal("analytics"),
  v.literal("edge"),
);

export const QuestionValidator = v.object({
  id: v.string(),
  text: v.string(),
  type: v.string(),
  difficulty: v.number(),
  expectedDuration: v.optional(v.number()),
  tags: v.optional(v.array(v.string())),
  followUps: v.optional(v.array(v.string())),
});

export const HighlightValidator = v.object({
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
});

export const ScoresValidator = v.object({
  overall: v.number(),
  technical: v.number(),
  communication: v.number(),
  problemSolving: v.number(),
  comments: v.object({
    strengths: v.array(v.string()),
    improvements: v.array(v.string()),
    nextSteps: v.array(v.string()),
  }),
});

export const SessionValidator = v.object({
  _id: v.id("interview_sessions"),
  _creationTime: v.number(),
  userId: v.id("users"),
  status: StatusValidator,
  mode: v.optional(v.union(v.literal("technical"), v.literal("behavioral"))),
  createdAt: v.number(),
  updatedAt: v.number(),
  completedAt: v.optional(v.number()),
  jobDescription: v.string(),
  failureCode: v.optional(FailureCodeValidator),
  failureMessage: v.optional(v.string()),
  experienceLevel: v.optional(ExperienceLevelValidator),
  domainTrack: v.optional(DomainTrackValidator),
  behavioralCategory: v.optional(
    v.union(
      v.literal("Conflict"),
      v.literal("Leadership"),
      v.literal("Failure"),
      v.literal("Ownership"),
      v.literal("Success"),
    ),
  ),
  behavioralQuestion: v.optional(v.string()),
  detectedSkills: v.optional(v.array(v.string())),
  questions: v.optional(v.array(QuestionValidator)),
  currentQuestionIndex: v.optional(v.number()),
  highlights: v.optional(v.array(HighlightValidator)),
  scores: v.optional(ScoresValidator),
  duration: v.optional(v.number()),
  elevenlabsSessionId: v.optional(v.string()),
  elevenlabsConversationId: v.optional(v.string()),
  reportGeneratedAt: v.optional(v.number()),
  chargeCommittedAt: v.optional(v.number()),
  startedAt: v.optional(v.number()),
  micOnAt: v.optional(v.number()),
});
