import { internal } from "../_generated/api";
import { httpAction } from "../_generated/server";
import { env } from "../env";
import { verifyClerkWebhook } from "../utils/webhooks";

export const handleClerkWebhook = httpAction(async (ctx, request) => {
  const result = await verifyClerkWebhook(request, env.CLERK_WEBHOOK_SECRET);

  if (!result) {
    return new Response("Error occured", { status: 400 });
  }

  const { event, eventId } = result;
  await ctx.runMutation(internal.webhooks.clerk.handleWebhook, {
    event,
    eventId,
  });

  return new Response(null, { status: 200 });
});
