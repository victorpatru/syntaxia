# Interview Flow • Sub-Plan for Steps 1 & 2

> **Scope**: Deep-dive into Step 1 (Convex Session Backend) and Step 2 (Gemini Job Parsing).  
> All code references were cross-checked with Context7 MCP documentation:
> • Convex: `/get-convex/convex-backend`  
> • Gemini: `/googleapis/js-genai`  
> (snippet links inline)

---

## Step 1  — Convex Session Backend

### 1.1 Schema Definition

`packages/backend/convex/schema.ts`
```ts
import { defineSchema, v } from "convex/schema";

export default defineSchema({
  interview_sessions: {
    // Primary key (Convex adds _id by default)
    userId: v.string(),
    jobDescription: v.string(),
    status: v.union(v.literal("setup"), v.literal("active"), v.literal("analyzing"), v.literal("complete")),
    questions: v.optional(v.array(v.object({
      question: v.string(),
      followUp: v.optional(v.string()),
    }))),
    transcript: v.optional(v.array(v.object({
      speaker: v.union(v.literal("interviewer"), v.literal("candidate")),
      text: v.string(),
      ts: v.number(),
    }))),
    scores: v.optional(v.any()),  // JSON blob from Gemini analysis
    createdAt: v.number(),
  },
});
```
> Convex types follow Context7 *defineSchema* pattern (see **“Start Convex Dev Deployment”** snippet).

### 1.2 Queries & Mutations

`packages/backend/convex/interview.ts`
```ts
import { mutation, query } from "convex/server";
import { v } from "convex/values";

export const create = mutation({
  args: { userId: v.string(), jobDescription: v.string() },
  handler: async (ctx, { userId, jobDescription }) => {
    const sessionId = ctx.db.insert("interview_sessions", {
      userId,
      jobDescription,
      status: "setup",
      createdAt: Date.now(),
    });
    return sessionId;
  },
});

export const updateStatus = mutation({
  args: { sessionId: v.id("interview_sessions"), status: v.string() },
  handler: (ctx, { sessionId, status }) => ctx.db.patch(sessionId, { status }),
});

export const appendTranscript = mutation({
  args: { sessionId: v.id("interview_sessions"), entry: v.any() },
  handler: (ctx, { sessionId, entry }) => ctx.db.patch(sessionId, {
    transcript: v.literalAppend(entry),
  }),
});

export const get = query({
  args: { sessionId: v.id("interview_sessions") },
  handler: (ctx, { sessionId }) => ctx.db.get(sessionId),
});
```

### 1.3 HTTP Wrappers (Bun / TanStack Start API Routes)

`apps/app/src/api/interview/create.ts`
```ts
import { api } from "convex/_generated/server";
import { action } from "convex/actions";

export const POST = action(async ({ request, ctx }) => {
  const { userId, jobDescription } = await request.json();
  const id = await api.interview.create(ctx, { userId, jobDescription });
  return Response.json({ sessionId: id });
});
```

> Use **Convex HTTP Action Example** pattern (Context7 snippet: *Install and Run Convex HTTP Action App*).

### 1.4 Client Integration

```tsx
import { useQuery, useMutation } from "convex/react";

const { sessionId } = await createInterview({ jobDescription });
const session = useQuery("interview:get", { sessionId });
```

---

## Step 2  — Gemini Job Description Parsing

### 2.1 Client Setup

```ts
import { GoogleGenAI } from "@google/genai";

export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
```
> Validated with **“Quickstart: Generate Content with Gemini”** snippet.

### 2.2 Prompt Design

```ts
const prompt = `You are an HR technical recruiter.
Given the following job description, extract:
- role title
- seniority
- required technologies (array)
- 8 behavioural + technical interview questions (array)
Return **strict JSON** matching this TypeScript type:
interface ParsedJD { role: string; seniority: string; techStack: string[]; questions: string[] }`;
```

### 2.3 Parsing Function (Server-Side Action)

`apps/app/src/api/interview/parse-job.ts`
```ts
import { ai } from "../../../lib/gemini";
import { api } from "convex/_generated/server";
import { z } from "zod";

export const POST = async ({ request, ctx }) => {
  const { sessionId, jobDescription } = await request.json();

  const response = await ai.models.generateContent({
    model: "gemini-2.5-pro",  // Context7 supports this alias
    contents: [`${prompt}\n---\n${jobDescription}`],
    config: { systemInstruction: "Return JSON only" },
  });

  const parsed = JSON.parse(response.text) as ParsedJD;

  await api.interview.updateStatus(ctx, {
    sessionId,
    status: "active",
  });
  await api.interview.patch(ctx, {
    sessionId,
    questions: parsed.questions,
  });

  return Response.json(parsed);
};
```
> Uses **`generateContent`** per Context7 docs; parses JSON deterministically.

### 2.4 Error Handling & Validation

- Wrap `JSON.parse` with `zod` (`z.object({...})`) to guarantee schema.
- On Gemini API error → `updateStatus(sessionId,"error")` + surface to UI.

### 2.5 Unit Test Stub

```ts
import { test, expect } from "bun:test";
import { handler } from "../parse-job";

test("Gemini parsing returns questions", async () => {
  const fakeJD = "We are hiring a Senior Full-Stack Engineer with React & Node.js…";
  const resp = await handler({ json: () => ({ sessionId: "S1", jobDescription: fakeJD }) });
  const data = await resp.json();
  expect(data.questions.length).toBe(8);
});
```

---

## Next Steps After 2️⃣

1. Wire ElevenLabs (stream) once `questions` exist.  
2. Front-end route `/interview/setup` polls until status `active`.

---

### Context7 Snippet Index

| Snippet | Source |
|---------|--------|
| **Convex Start Dev Deployment** | `/get-convex/convex-backend` |
| **Gemini Quickstart** | `/googleapis/js-genai` |
| **Stream Audio in Real-Time** | `/elevenlabs/elevenlabs-js` |

> Keep this file updated as implementation progresses.
