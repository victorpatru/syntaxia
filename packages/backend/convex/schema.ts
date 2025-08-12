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
});
