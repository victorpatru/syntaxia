import { type } from "arktype";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalMutation, internalQuery, mutation } from "./_generated/server";
import { waitlistSchema } from "./validation";

// Public mutation for form submission
export const submitToWaitlist = mutation({
  args: {
    email: v.string(),
    experience: v.string(),
    techStack: v.array(v.string()),
    jobSearchStatus: v.string(),
    companyStage: v.array(v.string()),
    turnstileToken: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Validate with ArkType
    const result = waitlistSchema(args);
    if (result instanceof type.errors) {
      throw new Error(`Validation failed: ${result.summary}`);
    }

    const data = result; // now fully typed and validated

    // 2. Normalize email
    const email = data.email.trim().toLowerCase();

    // 3. Check for duplicate submission
    const existing = await ctx.db
      .query("waitlist")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existing) {
      // Silent duplicate handling - return success to avoid leaking info
      return { success: true, message: "Thank you for your interest!" };
    }

    // 4. Save to database
    const id = await ctx.db.insert("waitlist", {
      email,
      experience: data.experience,
      techStack: data.techStack,
      jobSearchStatus: data.jobSearchStatus,
      companyStage: data.companyStage,
      submittedAt: Date.now(),
      notionSynced: false,
    });

    // 5. Schedule Notion sync (fire and forget)
    await ctx.scheduler.runAfter(0, internal.notion.syncToNotion, { id });

    return {
      success: true,
      message: "Thank you for joining our waitlist!",
    };
  },
});

// Internal query to get submission by ID
export const getSubmission = internalQuery({
  args: { id: v.id("waitlist") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

// Internal mutation to mark submission as synced
export const markSynced = internalMutation({
  args: { id: v.id("waitlist") },
  handler: async (ctx, { id }) => {
    await ctx.db.patch(id, { notionSynced: true });
  },
});

// Internal query to get submission by email
export const getSubmissionByEmail = internalQuery({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    return await ctx.db
      .query("waitlist")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
  },
});

// Internal mutation to create submission
export const createSubmission = internalMutation({
  args: {
    email: v.string(),
    experience: v.string(),
    techStack: v.array(v.string()),
    jobSearchStatus: v.string(),
    companyStage: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("waitlist", {
      email: args.email,
      experience: args.experience,
      techStack: args.techStack,
      jobSearchStatus: args.jobSearchStatus,
      companyStage: args.companyStage,
      submittedAt: Date.now(),
      notionSynced: false,
    });
  },
});
