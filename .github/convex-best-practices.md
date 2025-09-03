# Convex Best Practices Reference

This document contains the official Convex best practices that should be checked during code review.

## 1. Await all Promises ⚠️ CRITICAL

**Why?** Missing await can cause unexpected behavior or missed error handling.

**Examples:**
```typescript
// ❌ WRONG
ctx.db.patch(id, data); // Missing await!
ctx.scheduler.runAfter(1000, internal.func, {}); // Missing await!

// ✅ CORRECT
await ctx.db.patch(id, data);
await ctx.scheduler.runAfter(1000, internal.func, {});
const result = await ctx.runMutation(internal.func, args);
```

**Detection:** Look for `ctx.db.*`, `ctx.runQuery`, `ctx.runMutation`, `ctx.scheduler.*` without `await` keyword (check 2-3 lines before for multi-line statements).

## 2. Avoid .filter on database queries ⚡ PERFORMANCE

**Why?** Use indexes instead of filtering for better performance on large datasets.

**Examples:**
```typescript
// ❌ WRONG
const results = ctx.db.query("messages")
  .filter((q) => q.eq(q.field("author"), "Tom"))
  .collect();

// ✅ CORRECT - Use index
const results = await ctx.db.query("messages")
  .withIndex("by_author", (q) => q.eq("author", "Tom"))
  .collect();

// ✅ CORRECT - Filter in code for small datasets
const allMessages = await ctx.db.query("messages").collect();
const results = allMessages.filter((m) => m.author === "Tom");
```

## 3. Only use .collect with small result sets ⚡ PERFORMANCE

**Why?** Large .collect() calls waste bandwidth and can cause conflicts.

**Examples:**
```typescript
// ❌ WRONG - Potentially unbounded
const allMovies = await ctx.db.query("movies").collect();

// ✅ CORRECT - Use pagination
const movies = await ctx.db.query("movies")
  .order("desc")
  .paginate(paginationOptions);

// ✅ CORRECT - Use limits with "99+" pattern
const movies = await ctx.db.query("movies").take(100);
const count = movies.length === 100 ? "99+" : movies.length.toString();
```

## 4. Check for redundant indexes ⚡ PERFORMANCE

**Why?** Composite indexes make single-field indexes redundant.

**Examples:**
```typescript
// ❌ WRONG - Redundant indexes
.index("by_team", ["team"])              // Redundant!
.index("by_team_and_user", ["team", "user"])

// ✅ CORRECT - Single composite index
.index("by_team_and_user", ["team", "user"]) // Handles both cases
```

## 5. Use argument validators for all public functions 🔒 SECURITY

**Why?** Public functions need validation against malicious input.

**Examples:**
```typescript
// ❌ WRONG - No validators
export const updateMessage = mutation({
  handler: async (ctx, { id, update }) => { ... }
});

// ✅ CORRECT - Proper validators
export const updateMessage = mutation({
  args: {
    id: v.id("messages"),
    update: v.object({
      body: v.optional(v.string()),
      author: v.optional(v.string()),
    }),
  },
  handler: async (ctx, { id, update }) => { ... }
});
```

## 6. Use access control for all public functions 🔒 SECURITY

**Why?** Prevent unauthorized access to your functions.

**Examples:**
```typescript
// ❌ WRONG - No access control
export const updateTeam = mutation({
  args: { id: v.id("teams"), update: v.object({...}) },
  handler: async (ctx, { id, update }) => {
    await ctx.db.patch(id, update); // Anyone can update any team!
  },
});

// ✅ CORRECT - Proper access control
export const updateTeam = mutation({
  args: { id: v.id("teams"), update: v.object({...}) },
  handler: async (ctx, { id, update }) => {
    const user = await ctx.auth.getUserIdentity();
    if (user === null) {
      throw new Error("Unauthorized");
    }
    const isTeamMember = /* check if user is a member */;
    if (!isTeamMember) {
      throw new Error("Unauthorized");
    }
    await ctx.db.patch(id, update);
  },
});
```

## 7. Only schedule internal functions 🔒 SECURITY

**Why?** Public functions in schedulers can be exploited.

**Examples:**
```typescript
// ❌ WRONG - Scheduling public function
await ctx.scheduler.runAfter(1000, api.notifications.send, {});

// ✅ CORRECT - Schedule internal function
await ctx.scheduler.runAfter(1000, internal.notifications.send, {});
```

## 8. No direct ctx.db access in actions 🔒 ARCHITECTURE

**Why?** Actions should not directly access the database.

**Examples:**
```typescript
// ❌ WRONG - Direct db access in action
export const processData = action({
  handler: async (ctx, args) => {
    const data = await ctx.db.get(id); // Not allowed!
  },
});

// ✅ CORRECT - Use queries/mutations
export const processData = action({
  handler: async (ctx, args) => {
    const data = await ctx.runQuery(internal.getData, { id });
  },
});
```

## 9. Minimize ctx.runAction() calls ⚡ PERFORMANCE

**Why?** Use helper functions instead of unnecessary action calls.

## 10. Avoid sequential ctx.runQuery/runMutation in actions ⚡ PERFORMANCE

**Why?** Multiple calls can cause race conditions.

## 11. Minimize ctx.runQuery/runMutation in queries/mutations ⚡ PERFORMANCE

**Why?** Helper functions have less overhead.

## 12. Always include returns validator ⚠️ QUALITY

**Why?** Better type safety and documentation.

**Examples:**
```typescript
// ❌ WRONG - Missing returns validator
export const getUser = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// ✅ CORRECT - Include returns validator
export const getUser = query({
  args: { id: v.id("users") },
  returns: v.union(v.object({...}), v.null()),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
```

## 13. Use v.int64() instead of deprecated v.bigint() ⚠️ QUALITY

## 14. Add "use node" directive for Node.js actions ⚠️ QUALITY

**Examples:**
```typescript
// ✅ CORRECT - Node.js action
"use node";
import fs from "fs";

export const processFile = action({
  handler: async (ctx, args) => {
    // Node.js code here
  },
});
```

## 15. Use proper TypeScript types for Convex IDs ⚠️ QUALITY

**Examples:**
```typescript
// ❌ WRONG - Using string
function getUser(userId: string) { ... }

// ✅ CORRECT - Using proper ID type
function getUser(userId: Id<"users">) { ... }
```
