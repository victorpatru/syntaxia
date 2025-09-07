import type { UserJSON } from "@clerk/backend";
import { v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";
import {
  internalMutation,
  internalQuery,
  type QueryCtx,
  query,
} from "./_generated/server";
import { computePrimaryEmail } from "./utils/clerk";

/** Get the current user ID (null if not authenticated) */
export const currentUserId = query({
  args: {},
  returns: v.union(v.null(), v.id("users")),
  handler: async (ctx): Promise<Id<"users"> | null> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await getUserByClerkId(ctx, identity.subject);

    return user?._id ?? null;
  },
});

/** Webhook: Create or update user from Clerk */
export const updateOrCreateUser = internalMutation({
  args: { clerkUser: v.any() },
  returns: v.null(),
  async handler(ctx, { clerkUser }: { clerkUser: UserJSON }) {
    const existing = await getUserByClerkId(ctx, clerkUser.id);

    const baseUserPatch = {
      clerkUserId: clerkUser.id,
      firstName: clerkUser.first_name || undefined,
      lastName: clerkUser.last_name || undefined,
      email: computePrimaryEmail(clerkUser) ?? undefined,
      imageUrl: clerkUser.image_url || undefined,
      lastActiveAt: clerkUser.last_active_at || undefined,
    };

    if (existing) {
      await ctx.db.patch(existing._id, baseUserPatch);
    } else {
      await ctx.db.insert("users", {
        ...baseUserPatch,
        createdAt: clerkUser.created_at,
        credits: 0,
      });
    }
    return null;
  },
});

/** Webhook: Delete user from Clerk */
export const deleteUser = internalMutation({
  args: { clerkUserId: v.string() },
  returns: v.null(),
  async handler(ctx, { clerkUserId }) {
    const user = await getUserByClerkId(ctx, clerkUserId);

    if (user) {
      await ctx.db.delete(user._id);
    }
    return null;
  },
});

/** Helper: Get user by Clerk ID */
async function getUserByClerkId(ctx: QueryCtx, clerkUserId: string) {
  return await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", clerkUserId))
    .unique();
}

export const getUserIdByClerk = internalQuery({
  args: { clerkUserId: v.string() },
  returns: v.union(v.id("users"), v.null()),
  handler: async (ctx, { clerkUserId }) => {
    const user = await getUserByClerkId(ctx, clerkUserId);
    return user?._id ?? null;
  },
});

/** Helper: Get current user or throw error */
export async function requireUser(ctx: QueryCtx): Promise<Doc<"users">> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }

  const user = await getUserByClerkId(ctx, identity.subject);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}
