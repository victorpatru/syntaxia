"use node";
import {
  validateEvent,
  WebhookVerificationError,
} from "@polar-sh/sdk/webhooks";
import type { OrderData } from "@syntaxia/shared";
import { v } from "convex/values";
import { internal } from "../_generated/api";
import { internalAction } from "../_generated/server";
import { env } from "../env";

export const handleWebhook = internalAction({
  args: {
    body: v.string(),
    webhookId: v.string(),
    webhookTimestamp: v.string(),
    webhookSignature: v.string(),
  },
  returns: v.null(),
  handler: async (
    ctx,
    { body, webhookId, webhookTimestamp, webhookSignature },
  ) => {
    const headers: Record<string, string> = {
      "webhook-id": webhookId,
      "webhook-timestamp": webhookTimestamp,
      "webhook-signature": webhookSignature,
    };

    let event: { type: string; data: unknown };
    try {
      event = validateEvent(body, headers, env.POLAR_WEBHOOK_SECRET);
    } catch (err) {
      if (err instanceof WebhookVerificationError) {
        throw err;
      }
      throw err;
    }

    // Idempotency: skip if processed
    if (webhookId) {
      const processed = await ctx.runQuery(
        internal.webhooks.events.isEventProcessed,
        {
          eventId: webhookId,
        },
      );
      if (processed) return null;
    }

    if (event.type === "order.paid") {
      const orderData = event.data as OrderData;
      const { id: orderId, productId, metadata } = orderData;
      const clerkUserId = metadata?.clerkUserId;

      if (clerkUserId && productId && orderId) {
        const productCredits: Record<string, number> = {
          [env.POLAR_PRODUCT_ID_1_SESSION]: 15,
          [env.POLAR_PRODUCT_ID_3_SESSIONS]: 45,
          [env.POLAR_PRODUCT_ID_5_SESSIONS]: 75,
        };
        const credits = productCredits[productId];
        if (credits) {
          await ctx.runMutation(internal.credits.creditAccount, {
            clerkUserId,
            orderId,
            credits,
          });
        } else {
          console.log("Product ID does not match expected value");
        }
      } else {
        console.log("Missing required fields:", {
          hasClerkUserId: !!clerkUserId,
          hasProductId: !!productId,
          hasOrderId: !!orderId,
        });
      }
    }

    if (webhookId) {
      console.log("Marking event as processed:", {
        webhookId,
        eventType: event.type,
      });
      await ctx.runMutation(internal.webhooks.events.markEventProcessed, {
        eventId: webhookId,
        eventType: event.type || "unknown",
        source: "polar",
      });
    }

    return null;
  },
});
