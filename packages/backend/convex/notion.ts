"use node";

import { Client } from "@notionhq/client";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalAction } from "./_generated/server";
import { env } from "./env";

// Internal action to sync to Notion
export const syncToNotion = internalAction({
  args: { id: v.id("waitlist") },
  handler: async (ctx, { id }) => {
    try {
      // Get the submission
      const submission = await ctx.runQuery(internal.waitlist.getSubmission, {
        id,
      });
      if (!submission) {
        console.error(`Submission ${id} not found`);
        return;
      }

      // Skip if already synced
      if (submission.notionSynced) {
        return;
      }

      // Get environment variables
      const notionApiKey = env.NOTION_API_KEY;
      const notionDatabaseId = env.NOTION_DATABASE_ID;

      // Initialize Notion client
      const notion = new Client({
        auth: notionApiKey,
      });

      // Create page in Notion database using SDK
      await notion.pages.create({
        parent: { database_id: notionDatabaseId },
        properties: {
          Email: {
            email: submission.email,
          },
          Experience: {
            select: { name: submission.experience },
          },
          "Tech Stack": {
            multi_select: submission.techStack.map((tech) => ({
              name: tech,
            })),
          },
          "Job Search Status": {
            select: { name: submission.jobSearchStatus },
          },
          "Company Stage": {
            multi_select: submission.companyStage.map((stage) => ({
              name: stage,
            })),
          },
          "Submitted At": {
            date: { start: new Date(submission.submittedAt).toISOString() },
          },
        },
      });

      // Mark as synced
      await ctx.runMutation(internal.waitlist.markSynced, { id });
      console.log(`Successfully synced submission ${id} to Notion`);
    } catch (error) {
      console.error(`Error syncing submission ${id} to Notion:`, error);
      // Note: In production, you might want to implement retry logic here
    }
  },
});
