import type { WebhookEvent } from "@clerk/backend";
import { v } from "convex/values";
import { internal } from "../_generated/api";
import { internalMutation } from "../_generated/server";

export const handleWebhook = internalMutation({
  args: { event: v.any() },
  returns: v.null(),
  async handler(ctx, { event }: { event: WebhookEvent }) {
    const eventId = event.data.id as string;

    const existingEvent = await ctx.db
      .query("webhook_events")
      .withIndex("by_event_id", (q) => q.eq("eventId", eventId))
      .unique();
    const alreadyProcessed = existingEvent !== null;

    if (alreadyProcessed) {
      console.log("Event already processed, skipping:", eventId, event.type);
      return null;
    }

    switch (event.type) {
      case "user.created":
      case "user.updated": {
        const subject = event.data.id as string;
        const existingUserId = await ctx.runQuery(
          internal.users.getUserIdByClerk,
          { clerkUserId: subject },
        );
        if (existingUserId && event.type === "user.created") {
          console.warn("Overwriting user", subject, "with", event.data);
        }
        await ctx.runMutation(internal.users.updateOrCreateUser, {
          clerkUser: event.data,
        });

        await ctx.runMutation(internal.webhooks.events.markEventProcessed, {
          eventId: subject,
          eventType: event.type,
          clerkUserId: subject,
          source: "clerk",
        });
        break;
      }
      case "user.deleted": {
        const subject = event.data.id as string;
        await ctx.runMutation(internal.users.deleteUser, { id: subject });

        await ctx.runMutation(internal.webhooks.events.markEventProcessed, {
          eventId: subject,
          eventType: event.type,
          clerkUserId: subject,
          source: "clerk",
        });
        break;
      }
      default: {
        console.log("ignored Clerk webhook event", event.type);
      }
    }

    return null;
  },
});
