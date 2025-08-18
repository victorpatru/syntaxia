import type { WebhookEvent } from "@clerk/backend";
import { type } from "arktype";
import { httpRouter } from "convex/server";
import { Webhook } from "svix";
import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";
import { env } from "./env";
import { waitlistSchema } from "./validation";

// HTTP endpoint for waitlist submissions
const handleWaitlistSubmission = httpAction(async (ctx, request) => {
  // CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": env.WEB_URL,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // Handle preflight request
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  // Only allow POST requests
  if (request.method !== "POST") {
    return new Response("Method not allowed", {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    const body = await request.json();

    // Validate the data
    const result = waitlistSchema(body);
    if (result instanceof type.errors) {
      return new Response(
        JSON.stringify({
          error: "Validation failed",
          details: result.summary,
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        },
      );
    }

    // Verify Turnstile token
    const turnstileResponse = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: env.TURNSTILE_SECRET_KEY || "",
          response: result.turnstileToken,
        }),
      },
    );

    const turnstileResult = await turnstileResponse.json();
    if (!turnstileResult.success) {
      return new Response(
        JSON.stringify({ error: "Turnstile verification failed" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        },
      );
    }

    // Submit to waitlist (call the internal version directly)
    const data = result;
    const email = data.email.trim().toLowerCase();

    // Check for duplicate submission by email
    const existing = await ctx.runQuery(
      internal.waitlist.getSubmissionByEmail,
      {
        email,
      },
    );

    if (!existing) {
      // Create new submission
      const id = await ctx.runMutation(internal.waitlist.createSubmission, {
        email,
        experience: data.experience,
        techStack: data.techStack,
        jobSearchStatus: data.jobSearchStatus,
        companyStage: data.companyStage,
      });

      // Schedule Notion sync
      await ctx.scheduler.runAfter(0, internal.notion.syncToNotion, { id });
    }

    const submissionResult = {
      success: true,
      message: "Thank you for joining our waitlist!",
    };

    return new Response(JSON.stringify(submissionResult), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error("Waitlist submission error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }
});

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
    case "user.created":
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

      await ctx.runMutation(internal.webhooks.markEventProcessed, {
        eventId: event.data.id as string,
        eventType: event.type,
        clerkUserId: event.data.id,
      });
      break;
    }
    case "user.deleted": {
      const id = event.data.id as string;
      await ctx.runMutation(internal.users.deleteUser, { id });

      await ctx.runMutation(internal.webhooks.markEventProcessed, {
        eventId: id,
        eventType: event.type,
        clerkUserId: id,
      });
      break;
    }
    default: {
      console.log("ignored Clerk webhook event", event.type);
    }
  }
  return new Response(null, {
    status: 200,
  });
});

const http = httpRouter();

// Waitlist submission endpoint
http.route({
  path: "/waitlist",
  method: "POST",
  handler: handleWaitlistSubmission,
});

// Handle OPTIONS for CORS preflight
http.route({
  path: "/waitlist",
  method: "OPTIONS",
  handler: handleWaitlistSubmission,
});

// Clerk webhook endpoint
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
