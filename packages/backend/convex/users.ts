import type { UserJSON } from "@clerk/backend";
import { v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";
import { internalMutation, type QueryCtx, query } from "./_generated/server";
import { computePrimaryEmail } from "./utils/clerk";

/** Get the current user (null if not authenticated) */
export const currentUser = query(async (ctx: QueryCtx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;

  return await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
    .unique();
});

/** Webhook: Create or update user from Clerk */
export const updateOrCreateUser = internalMutation({
  args: { clerkUser: v.any() },
  async handler(ctx, { clerkUser }: { clerkUser: UserJSON }) {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", clerkUser.id))
      .unique();

    const userData = {
      clerkUserId: clerkUser.id,
      firstName: clerkUser.first_name || undefined,
      lastName: clerkUser.last_name || undefined,
      email: computePrimaryEmail(clerkUser) ?? undefined,
      imageUrl: clerkUser.image_url || undefined,
      createdAt: clerkUser.created_at,
      lastActiveAt: clerkUser.last_active_at || undefined,
      credits: existing?.credits ?? 0,
    };

    if (existing) {
      await ctx.db.patch(existing._id, userData);
    } else {
      await ctx.db.insert("users", userData);
    }
  },
});

/** Webhook: Delete user from Clerk */
export const deleteUser = internalMutation({
  args: { id: v.string() },
  async handler(ctx, { id }) {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", id))
      .unique();

    if (user) {
      await ctx.db.delete(user._id);
    }
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
