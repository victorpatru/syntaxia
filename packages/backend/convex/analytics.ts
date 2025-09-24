"use node";

import { v } from "convex/values";
import { PostHog } from "posthog-node";
import { internalAction } from "./_generated/server";
import { env } from "./env";

/**
 * Track an analytics event to PostHog
 */
export const trackEvent = internalAction({
  args: {
    distinctId: v.string(),
    event: v.string(),
    properties: v.optional(v.record(v.string(), v.any())),
  },
  returns: v.null(),
  handler: async (_ctx, args) => {
    try {
      const client = new PostHog(env.POSTHOG_API_KEY, {
        host: env.POSTHOG_HOST,
      });

      const { currentUrl, ...otherProperties } = args.properties || {};
      const eventProperties = {
        ...otherProperties,
        ...(currentUrl && { $current_url: currentUrl }),
      };

      client.capture({
        distinctId: args.distinctId,
        event: args.event,
        properties: eventProperties,
      });

      await client.shutdown();
    } catch (error) {
      console.error("Failed to track analytics event:", error);
      console.error("Event details:", {
        event: args.event,
        distinctId: args.distinctId,
        properties: args.properties,
      });
    }

    return null;
  },
});
