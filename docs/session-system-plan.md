# Session Token Interview Flow – Implementation Plan

> Scope: implement **session-only** logic (purchase & consumption of a single 15- or 30-minute token), following the simple flow requested:
>
> 1. Paste JD → create `session` linked to an **unused token**.
> 2. Show warning modal that starting consumes the whole token.
> 3. Processing page (mock for now).
> 4. Live interview until user ends or timer elapses.
> 5. Auto-end or manual end – remaining minutes are discarded.
> 6. Redirect to report page.
>
> Non-goals: transcripts, Gemini parsing, billing hooks, cron registration details. Those live in other docs.

---

## 0️⃣ Pre-req

- Packages already in roadmap (`convex`, `@convex-dev/crons`, ElevenLabs, etc.).
- Convex component: `@convex-dev/crons` installed & `app.use(crons)` in `convex/convex.config.ts`.

---

## 1️⃣ Data Schema (Convex)

> Two simple models supported:
> * **Token model** (one token → one interview).  
> * **Credits model** (1 credit = 1 minute; session consumes `maxMinutes` at start).
>
> You can run either or keep both for future flexibility.

`convex/schema.ts`
```ts
import { defineSchema, v } from "convex/schema";

export default defineSchema({
  // CREDIT BALANCE — OPTIONAL ALTERNATIVE TO TOKENS
  user_credits: {
    userId: v.string(),
    credits: v.number(),       // total remaining minutes for the user
    updatedAt: v.number(),
  },

  // Purchase tokens (one-shot session) – default path
  session_tokens: {
    userId: v.string(),
    type: v.union(v.literal("15"), v.literal("30")), // minutes
    status: v.union(v.literal("unused"), v.literal("used")),
    purchasedAt: v.number(),
  },

  interview_sessions: {
    userId: v.string(),
    // Either tokenId (token model) _or_ we simply store required minutes when using credits.
    tokenId: v.optional(v.id("session_tokens")),
    maxMinutes: v.number(),
    startTime: v.optional(v.number()),
    lastActivity: v.optional(v.number()),
    endTime: v.optional(v.number()),
    status: v.union(v.literal("created"), v.literal("active"), v.literal("ended")),
    jobDescription: v.string(),
  },
});
```

**If you prefer credits**: skip `session_tokens` and during `sessions.start` deduct `maxMinutes` from `user_credits`:

```ts
await ctx.db.patch(creditRow._id, {
  credits: creditRow.credits - s.maxMinutes,
  updatedAt: Date.now(),
});
```

An up-front balance check (`credits >= required`) replaces the "unused token" lookup in `sessions.create`.

---

## 2️⃣ Convex Functions

`convex/sessions.ts`
```ts
import { mutation, query, internalMutation } from "convex/server";
import { v } from "convex/values";
import { Crons } from "@convex-dev/crons";
import { internal } from "./_generated/api";
import { components } from "./_generated/api";

const crons = new Crons(components.crons);

// 2.1 Create session (JD pasted, no token consumed yet)
export const create = mutation({
  args: { jobDescription: v.string() },
  handler: async (ctx, { jobDescription }) => {
    const userId = ctx.auth.getUserIdentity()?.subject ?? "anon";

    // Find 1 unused token (prefer 15-min)
    const token = await ctx.db
      .query("session_tokens")
      .filter(q => q.eq(q.field("userId"), userId))
      .filter(q => q.eq(q.field("status"), "unused"))
      .first();
    if (!token) throw "No available tokens";

    const id = ctx.db.insert("interview_sessions", {
      userId,
      tokenId: token._id,
      maxMinutes: token.type === "15" ? 15 : 30,
      status: "created",
      jobDescription,
    });
    return id;
  },
});

// 2.2 Start session – user clicks Continue after warning
export const start = mutation({
  args: { sessionId: v.id("interview_sessions") },
  handler: async (ctx, { sessionId }) => {
    const s = await ctx.db.get(sessionId);
    if (!s || s.status !== "created") throw "Invalid session";

    // Mark token used & session active
    ctx.db.patch(s.tokenId, { status: "used" });
    ctx.db.patch(sessionId, {
      status: "active",
      startTime: Date.now(),
      lastActivity: Date.now(),
    });

    // Schedule an auto-close cron (one-shot) at cutoff time
    await crons.register(
      ctx,
      { kind: "interval", ms: s.maxMinutes * 60_000 },
      internal.sessions.autoEnd,
      { sessionId },
      `autoEnd-${sessionId}`
    );
  },
});

// 2.3 Heartbeat – call every 20-30 s or onMessage
export const heartbeat = mutation({
  args: { sessionId: v.id("interview_sessions") },
  handler: (ctx, { sessionId }) =>
    ctx.db.patch(sessionId, { lastActivity: Date.now() }),
});

// 2.4 Manual end (user clicks End)
export const end = mutation({
  args: { sessionId: v.id("interview_sessions") },
  handler: (ctx, { sessionId }) => internal.sessions.autoEnd(ctx, { sessionId }),
});

// 2.5 Internal cron target
export const autoEnd = internalMutation({
  args: { sessionId: v.id("interview_sessions") },
  handler: async (ctx, { sessionId }) => {
    const s = await ctx.db.get(sessionId);
    if (!s || s.status === "ended") return;
    ctx.db.patch(sessionId, { status: "ended", endTime: Date.now() });
  },
});
```

Notes:
* We register a **one-shot interval cron** equal to `maxMinutes` when session starts; it calls `autoEnd` exactly once.
* Manual `end` re-uses the same internal mutation so logic is unified.

---

## 3️⃣ Frontend Flow (TanStack Start)

| Route | Component | Action |
|-------|-----------|--------|
| `/` | `JobDescriptionInput` | `sessions.create` → `sessionId` → navigate `confirm/$id` |
| `/confirm/$id` | `StartWarning` modal | Shows “Consumes full 15/30 min”. Buttons: Cancel (delete row) / Start → `sessions.start` then navigate `