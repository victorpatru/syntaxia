import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";

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
