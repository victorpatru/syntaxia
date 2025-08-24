import { internal } from "../_generated/api";
import { httpAction } from "../_generated/server";
import { env } from "../env";
import { verifyClerkWebhook } from "../utils/webhooks";

export const handleClerkWebhook = httpAction(async (ctx, request) => {
  const event = await verifyClerkWebhook(request, env.CLERK_WEBHOOK_SECRET);

  if (!event) {
    return new Response("Error occured", { status: 400 });
  }

  await ctx.runMutation(internal.webhooks.clerk.ingestEvent, { event });

  return new Response(null, { status: 200 });
});
