import { internal } from "../_generated/api";
import { httpAction } from "../_generated/server";

export const handlePolarWebhook = httpAction(async (ctx, request) => {
  let body: string;
  try {
    body = await request.text();
  } catch {
    return new Response("Bad Request", { status: 400 });
  }

  const webhookId = request.headers.get("webhook-id") ?? "";
  const webhookTimestamp = request.headers.get("webhook-timestamp") ?? "";
  const webhookSignature = request.headers.get("webhook-signature") ?? "";

  try {
    await ctx.runAction(internal.webhooks.polar.handleWebhook, {
      body,
      webhookId,
      webhookTimestamp,
      webhookSignature,
    });
    return new Response(null, { status: 200 });
  } catch (err) {
    console.error("Polar webhook error", err);
    return new Response("Server Error", { status: 500 });
  }
});
