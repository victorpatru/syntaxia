import { v } from "convex/values";
import { internalMutation, internalQuery } from "../_generated/server";

/** Supported webhook event types */
export const webhookEventTypes = v.union(
  // Clerk events
  v.literal("user.created"),
  v.literal("user.updated"),
  v.literal("user.deleted"),
  // Polar events
  v.literal("order.paid"),
  v.literal("unknown"),
);

export const webhookSources = v.union(v.literal("clerk"), v.literal("polar"));

/** Check if a webhook event has already been processed. */
export const isEventProcessed = internalQuery({
  args: { eventId: v.string() },
  returns: v.boolean(),
  async handler(ctx, { eventId }) {
    const existingEvent = await ctx.db
      .query("webhook_events")
      .withIndex("by_event_id", (q) => q.eq("eventId", eventId))
      .unique();
    return existingEvent !== null;
  },
});

/** Mark a webhook event as processed. */
export const markEventProcessed = internalMutation({
  args: {
    eventId: v.string(),
    eventType: webhookEventTypes,
    clerkUserId: v.optional(v.string()),
    source: v.optional(webhookSources),
  },
  returns: v.null(),
  async handler(ctx, { eventId, eventType, clerkUserId, source }) {
    await ctx.db.insert("webhook_events", {
      eventId,
      eventType,
      processedAt: Date.now(),
      clerkUserId,
      source,
    });
    return null;
  },
});
