import type { UserJSON } from "@clerk/backend";
import { v } from "convex/values";
import type { Doc } from "./_generated/dataModel";
import {
  internalMutation,
  internalQuery,
  type QueryCtx,
  query,
} from "./_generated/server";
import { computePrimaryEmail } from "./utils/clerk";

/** Get the current user (null if not authenticated) */
export const currentUser = query({
  args: {},
  returns: v.union(v.null(), v.any()),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
      .unique();
  },
});

/** Webhook: Create or update user from Clerk */
export const updateOrCreateUser = internalMutation({
  args: { clerkUser: v.any() },
  returns: v.null(),
  async handler(ctx, { clerkUser }: { clerkUser: UserJSON }) {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", clerkUser.id))
      .unique();

    const baseUserData = {
      clerkUserId: clerkUser.id,
      firstName: clerkUser.first_name || undefined,
      lastName: clerkUser.last_name || undefined,
      email: computePrimaryEmail(clerkUser) ?? undefined,
      imageUrl: clerkUser.image_url || undefined,
      createdAt: clerkUser.created_at,
      lastActiveAt: clerkUser.last_active_at || undefined,
    };

    if (existing) {
      await ctx.db.patch(existing._id, baseUserData);
    } else {
      await ctx.db.insert("users", {
        ...baseUserData,
        credits: 0,
      });
    }
    return null;
  },
});

/** Webhook: Delete user from Clerk */
export const deleteUser = internalMutation({
  args: { id: v.string() },
  returns: v.null(),
  async handler(ctx, { id }) {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", id))
      .unique();

    if (user) {
      await ctx.db.delete(user._id);
    }
    return null;
  },
});

export const getUserIdByClerk = internalQuery({
  args: { clerkUserId: v.string() },
  returns: v.union(v.id("users"), v.null()),
  handler: async (ctx, { clerkUserId }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", clerkUserId))
      .unique();
    return user?._id ?? null;
  },
});

/** Helper: Get current user or throw error */
export async function requireUser(ctx: QueryCtx): Promise<Doc<"users">> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
    .unique();

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}
