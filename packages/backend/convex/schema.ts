import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkUserId: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),
    lastActiveAt: v.optional(v.number()),
  })
    .index("by_clerk_id", ["clerkUserId"])
    .index("by_email", ["email"]),

  webhook_events: defineTable({
    eventId: v.string(),
    eventType: v.union(
      v.literal("user.created"),
      v.literal("user.updated"),
      v.literal("user.deleted"),
      v.literal("unknown"),
    ),
    processedAt: v.number(),
    clerkUserId: v.optional(v.string()),
  }).index("by_event_id", ["eventId"]),

  waitlist: defineTable({
    email: v.string(),
    experience: v.string(),
    techStack: v.array(v.string()),
    jobSearchStatus: v.string(),
    companyStage: v.array(v.string()),
    submittedAt: v.number(),
    notionSynced: v.boolean(),
  }).index("by_email", ["email"]),
});
