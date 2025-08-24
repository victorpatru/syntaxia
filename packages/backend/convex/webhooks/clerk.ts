import type { WebhookEvent } from "@clerk/backend";
import { v } from "convex/values";
import { internal } from "../_generated/api";
import { internalMutation } from "../_generated/server";

export const ingestEvent = internalMutation({
  args: { event: v.any() },
  returns: v.null(),
  async handler(ctx, { event }: { event: WebhookEvent }) {
    const eventId = (event.data as any).id as string;

    const alreadyProcessed = await ctx.runQuery(
      internal.webhooks.events.isEventProcessed,
      { eventId },
    );

    if (alreadyProcessed) {
      console.log("Event already processed, skipping:", eventId, event.type);
      return null;
    }

    switch (event.type) {
      case "user.created":
      case "user.updated": {
        const subject = (event.data as any).id as string;
        const existingUser = await ctx.runQuery(internal.users.getUser, {
          subject,
        });
        if (existingUser && event.type === "user.created") {
          console.warn("Overwriting user", subject, "with", event.data);
        }
        await ctx.runMutation(internal.users.updateOrCreateUser, {
          clerkUser: event.data,
        });

        await ctx.runMutation(internal.webhooks.events.markEventProcessed, {
          eventId: subject,
          eventType: event.type,
          clerkUserId: subject,
        });
        break;
      }
      case "user.deleted": {
        const subject = (event.data as any).id as string;
        await ctx.runMutation(internal.users.deleteUser, { id: subject });

        await ctx.runMutation(internal.webhooks.events.markEventProcessed, {
          eventId: subject,
          eventType: event.type,
          clerkUserId: subject,
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
