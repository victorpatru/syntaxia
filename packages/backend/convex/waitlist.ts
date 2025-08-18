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
    // Normalize email for consistent querying
    const normalizedEmail = email.toLowerCase().trim();
    return await ctx.db
      .query("waitlist")
      .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
      .first();
  },
});

// Internal mutation to create submission with duplicate check
export const createSubmission = internalMutation({
  args: {
    email: v.string(),
    experience: v.string(),
    techStack: v.array(v.string()),
    jobSearchStatus: v.string(),
    companyStage: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    // Normalize email - this handles the race condition atomically
    const email = args.email.toLowerCase().trim();

    // Check for existing submission in the same transaction
    const existing = await ctx.db
      .query("waitlist")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    if (existing !== null) {
      // Return the existing submission ID instead of creating a duplicate
      return existing._id;
    }

    // Insert new submission with normalized email
    return await ctx.db.insert("waitlist", {
      email, // Already normalized
      experience: args.experience,
      techStack: args.techStack,
      jobSearchStatus: args.jobSearchStatus,
      companyStage: args.companyStage,
      submittedAt: Date.now(),
      notionSynced: false,
    });
  },
});
