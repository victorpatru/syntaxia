import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";

/** Supported webhook event types */
export const webhookEventTypes = v.union(
  v.literal("user.created"),
  v.literal("user.updated"),
  v.literal("user.deleted"),
  v.literal("unknown"),
);

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
  },
  returns: v.null(),
  async handler(ctx, { eventId, eventType, clerkUserId }) {
    await ctx.db.insert("webhook_events", {
      eventId,
      eventType,
      processedAt: Date.now(),
      clerkUserId,
    });
    return null;
  },
});
