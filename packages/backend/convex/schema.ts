import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    username: v.optional(v.string()),
    image: v.optional(v.string()),
    imageId: v.optional(v.id("_storage")),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_email", ["email"]),
});
