import type { WebhookEvent } from "@clerk/backend";
import { httpRouter } from "convex/server";
import { Webhook } from "svix";
import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";
import { env } from "./env";

const handleClerkWebhook = httpAction(async (ctx, request) => {
  const event = await validateRequest(request);
  if (!event) {
    return new Response("Error occured", {
      status: 400,
    });
  }

  const alreadyProcessed = await ctx.runQuery(
    internal.webhooks.isEventProcessed,
    {
      eventId: event.data.id as string,
    },
  );

  if (alreadyProcessed) {
    console.log(
      "Event already processed, skipping:",
      event.data.id,
      event.type,
    );
    return new Response(null, { status: 200 });
  }

  switch (event.type) {
    case "user.created": // intentional fallthrough
    case "user.updated": {
      const existingUser = await ctx.runQuery(internal.users.getUser, {
        subject: event.data.id,
      });
      if (existingUser && event.type === "user.created") {
        console.warn("Overwriting user", event.data.id, "with", event.data);
      }
      console.log("creating/updating user", event.data.id);
      await ctx.runMutation(internal.users.updateOrCreateUser, {
        clerkUser: event.data,
      });

      // Mark event as processed
      await ctx.runMutation(internal.webhooks.markEventProcessed, {
        eventId: event.data.id as string,
        eventType: event.type,
        clerkUserId: event.data.id,
      });
      break;
    }
    case "user.deleted": {
      // Clerk docs say this is required, but the types say optional?
      const id = event.data.id!;
      await ctx.runMutation(internal.users.deleteUser, { id });

      // Mark event as processed
      await ctx.runMutation(internal.webhooks.markEventProcessed, {
        eventId: id,
        eventType: event.type,
        clerkUserId: id,
      });
      break;
    }
    default: {
      console.log("ignored Clerk webhook event", event.type);
      // Mark unknown events as processed too to avoid repeated processing
      await ctx.runMutation(internal.webhooks.markEventProcessed, {
        eventId: event.data.id as string,
        eventType: "unknown",
        clerkUserId: event.data.id,
      });
    }
  }
  return new Response(null, {
    status: 200,
  });
});

const http = httpRouter();
http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: handleClerkWebhook,
});

async function validateRequest(
  req: Request,
): Promise<WebhookEvent | undefined> {
  const payloadString = await req.text();

  const svixHeaders = {
    "svix-id": req.headers.get("svix-id")!,
    "svix-timestamp": req.headers.get("svix-timestamp")!,
    "svix-signature": req.headers.get("svix-signature")!,
  };
  const wh = new Webhook(env.CLERK_WEBHOOK_SECRET);
  let evt: Event | null = null;
  try {
    evt = wh.verify(payloadString, svixHeaders) as Event;
  } catch (_) {
    console.log("error verifying");
    return;
  }

  return evt as unknown as WebhookEvent;
}

export default http;
