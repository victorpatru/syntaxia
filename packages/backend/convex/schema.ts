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
  })
    .index("by_user", ["userId"])
    .index("by_order_id", ["orderId"]),
});
