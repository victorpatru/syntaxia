import { Polar } from "@polar-sh/sdk";
import { v } from "convex/values";
import {
  type ActionCtx,
  action,
  internalMutation,
  type QueryCtx,
  query,
} from "./_generated/server";
import { env } from "./env";
import { requireUser } from "./users";

export const balance = query(async (ctx: QueryCtx): Promise<number> => {
  const user = await requireUser(ctx);
  return user.credits ?? 0;
});

export const availablePackages = query(
  async (): Promise<
    Array<{ id: string; credits: number; price: string; description: string }>
  > => {
    const packs: Array<{
      id: string;
      credits: number;
      price: string;
      description: string;
    }> = [];

    if (env.POLAR_PRODUCT_ID_CREDITS_15) {
      packs.push({
        id: env.POLAR_PRODUCT_ID_CREDITS_15,
        credits: 15,
        price: "39.99 USD",
        description: "One-time pack",
      });
    }

    return packs;
  },
);

export const createCheckout = action({
  args: { packageId: v.string() },
  returns: v.object({ url: v.string() }),
  handler: async (ctx: ActionCtx, { packageId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

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

    return { url: checkout.url };
  },
});

export const addCredits = internalMutation({
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
