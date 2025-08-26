import { v } from "convex/values";

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
