import { Polar } from "@polar-sh/sdk";
import { v } from "convex/values";
import {
  type ActionCtx,
  action,
  internalMutation,
  query,
} from "./_generated/server";
import { env } from "./env";
import { checkRateLimit } from "./rate_limit/helpers";
import { requireUser } from "./users";

export const getBalance = query({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const user = await requireUser(ctx);
    return user.credits ?? 0;
  },
});

export const getAvailablePackages = query({
  args: {},
  returns: v.array(
    v.object({
      id: v.string(),
      credits: v.number(),
      price: v.string(),
      description: v.string(),
    }),
  ),
  handler: async () => {
    const packages: Array<{
      id: string;
      credits: number;
      price: string;
      description: string;
    }> = [];

    if (env.POLAR_PRODUCT_ID_CREDITS_15) {
      packages.push({
        id: env.POLAR_PRODUCT_ID_CREDITS_15,
        credits: 15,
        price: "39.99 USD",
        description: "One-time pack",
      });
    }

    return packages;
  },
});

export const createCheckout = action({
  args: { packageId: v.string() },
  returns: v.union(
    v.object({
      success: v.literal(true),
      url: v.string(),
    }),
    v.object({
      success: v.literal(false),
      error: v.string(),
      retryAfterMs: v.optional(v.number()),
    }),
  ),
  handler: async (ctx: ActionCtx, { packageId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const ALLOWED_PACKAGE_IDS = new Set(
      [env.POLAR_PRODUCT_ID_CREDITS_15].filter(Boolean),
    );
    if (!ALLOWED_PACKAGE_IDS.has(packageId)) {
      return {
        success: false as const,
        error: "Invalid packageId",
      };
    }

    const limit = await checkRateLimit(ctx, "createCheckout", identity.subject);
    if (!limit.ok) {
      return {
        success: false as const,
        error: "Too many attempts. Please try again later.",
        retryAfterMs: limit.retryAfterMs,
      };
    }

    const polar = new Polar({
      accessToken: env.POLAR_ORGANIZATION_TOKEN,
      server: env.POLAR_ENVIRONMENT,
    });

    const checkout = await polar.checkouts.create({
      products: [packageId],
      externalCustomerId: identity.subject,
      customerEmail: identity.email,
      metadata: { clerkUserId: identity.subject },
      successUrl: `${env.APP_URL}/credits?checkout_id={CHECKOUT_ID}`,
    });

    return {
      success: true as const,
      url: checkout.url,
    };
  },
});

export const creditAccount = internalMutation({
  args: {
    clerkUserId: v.string(),
    orderId: v.string(),
    credits: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, { clerkUserId, orderId, credits }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", clerkUserId))
      .unique();
    if (!user) throw new Error("User not found");

    const existing = await ctx.db
      .query("credits_log")
      .withIndex("by_order_id", (q) => q.eq("orderId", orderId))
      .unique();
    if (existing) return null;

    await ctx.db.insert("credits_log", {
      userId: user._id,
      amount: credits,
      reason: "polar:order.paid",
      orderId,
    });

    // Update user's balance
    await ctx.db.patch(user._id, {
      credits: (user.credits ?? 0) + credits,
    });

    return null;
  },
});

export const debitAccount = internalMutation({
  args: {
    sessionId: v.id("interview_sessions"),
    amount: v.optional(v.number()),
  },
  returns: v.null(),
  handler: async (ctx, { sessionId, amount = 15 }) => {
    const session = await ctx.db.get(sessionId);
    if (!session) throw new Error("Session not found");

    const user = await ctx.db.get(session.userId);
    if (!user) throw new Error("User not found");

    // Guard: already marked as charged
    if (session.chargeCommittedAt) {
      console.log(
        `Session ${sessionId} already charged at ${session.chargeCommittedAt}`,
      );
      return null;
    }

    const existingCharge = await ctx.db
      .query("credits_log")
      .withIndex("by_session_reason", (q) =>
        q.eq("sessionId", sessionId).eq("reason", "session:debit"),
      )
      .unique();

    if (existingCharge) {
      console.log(`Session ${sessionId} already charged`);
      return null;
    }

    const currentBalance = user.credits ?? 0;
    if (currentBalance < amount) {
      throw new Error(`Insufficient credits: ${currentBalance} < ${amount}`);
    }

    await ctx.db.insert("credits_log", {
      userId: user._id,
      amount: -amount,
      reason: "session:debit",
      sessionId,
    });

    await ctx.db.patch(user._id, {
      credits: currentBalance - amount,
    });

    // Mark session as charged atomically within the same transaction
    await ctx.db.patch(sessionId, {
      chargeCommittedAt: Date.now(),
      updatedAt: Date.now(),
    });

    console.log(
      `Debited ${amount} credits from user ${user._id} for session ${sessionId}`,
    );
    return null;
  },
});
