# Interview Flow Implementation Roadmap

> This roadmap translates the high-level plan from `interview-implementation-plan.md` into concrete, trackable steps that wire Gemini 2.5 Pro, Convex, and ElevenLabs Conversational AI into the Syntaxia app.
>
> Packages & docs were validated via Context7 MCP for accuracy.

---

## 0 ️⃣ Prerequisites

- [ ] **Install SDKs (Bun)**

  ```bash
  bun add @google/genai               # Gemini 2.5 Pro
  bun add @elevenlabs/elevenlabs-js   # Voice & conversational-AI
  bun add convex @convex-dev/react-query
  ```
- [ ] **Environment variables** (add to `.env` & deployment settings)

  | Key | Purpose |
  |-----|---------|
  | `GEMINI_API_KEY`       | Gemini 2.5 Pro access (`@google/genai`) |
  | `ELEVENLABS_API_KEY`   | ElevenLabs JS SDK |
  | `CONVEX_URL`           | Convex deployment (client) |

---

## 1 ️⃣ Convex • Session Schema & API layer

| Checkpoint | Task | Notes |
|------------|------|-------|
| [ ] 1.1 | **Define `interview_sessions` table** (<docs 90–103>) in `packages/backend/convex/schema.ts` | id, userId, status, jobDescription, questions[], transcript[], scores[] |
| [ ] 1.2 | **Create queries & mutations** (`packages/backend/convex/`)  
`interview:create`, `interview:updateStatus`, `interview:appendTranscript`, `interview:setScores` | Use Convex `mutation` helpers. |
| [ ] 1.3 | **Expose HTTP endpoint**  
`POST /api/interview/create` → returns `sessionId` | Thin wrapper → calls `interview:create` mutation. |

> Quick-start reference: `npx convex dev` (Context7 snippet: *Start Convex Dev Deployment*).

---

## 2 ️⃣ Gemini • Job Description Parsing

| Checkpoint | Task | Notes |
|------------|------|-------|
| [ ] 2.1 | **Endpoint:** `POST /api/interview/parse-job` | Body: `{ sessionId, jobDescription }` |
| [ ] 2.2 | **Gemini call** using `@google/genai`  
```ts
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
```
| [ ] 2.3 | **Prompt template**  
“Extract role, seniority, tech-stack, and generate 8 competency-based questions …” | Use `generateContent` (`Quickstart` snippet). |
| [ ] 2.4 | **Persist parsed output** → `interview:updateStatus` + `questions` | Status from `setup` → `active`. |

---

## 3 ️⃣ ElevenLabs • Live Interview

| Checkpoint | Task | Notes |
|------------|------|-------|
| [ ] 3.1 | **Endpoint:** `POST /api/interview/voice` (stream) | Auth header: `xi-api-key` or SDK client. |
| [ ] 3.2 | **Initialize SDK**  | ```ts
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
const el = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });
``` |
| [ ] 3.3 | **Stream Q&A**  
Use `textToSpeech.stream` for questions &  `speechToSpeech.stream` for responses if needed. | Snippet: *Stream Audio in Real-Time*. |
| [ ] 3.4 | **Append transcript entries** to Convex (`interview:appendTranscript`) | Include speaker + timestamp. |

---

## 4 ️⃣ Gemini • Post-Interview Analysis

| Checkpoint | Task | Notes |
|------------|------|-------|
| [ ] 4.1 | **Trigger:** client calls `GET /api/interview/report?sessionId=` on interview exit | |
| [ ] 4.2 | **Gemini summarization + scoring**  
`generateContent` with full transcript passed as `contents` | Use `systemInstruction` to return JSON (skills, scores, suggestions). |
| [ ] 4.3 | **Store scores** via Convex mutation | Status → `complete`. |

---

## 5 ️⃣ Frontend Routes ( TanStack Start )

| Checkpoint | Route | Data source |
|------------|-------|------------|
| [ ] 5.1 | `/interview` (JobDescriptionInput) | Local state → POST `parse-job` |
| [ ] 5.2 | `/interview/setup` (LoadingTerminal) | Poll session until `active` |
| [ ] 5.3 | `/interview/session/$id` (InterviewSession) | Stream audio & transcript |
| [ ] 5.4 | `/interview/analysis/$id` (LoadingTerminal) | Poll until `complete` |
| [ ] 5.5 | `/interview/report/$id` (InterviewReport) | Convex query `interview:getReport` |

Wrap each client component in `<Suspense>`; fetch via loaders (SSR-streaming).

---

## 6 ️⃣ Observability & Error Handling

- Convex mutation returns → handle expected errors (e.g., quota exceeded).
- ElevenLabs streams: implement `onError` to retry once.
- Gemini errors: surface friendly message, store in Convex `errors` field.

---

## 7 ️⃣ Testing & Success Criteria

- [ ] End-to-end happy-path Cypress test: create session → finish → see report.
- [ ] Voice latency ≤ 1 s (average roundtrip).
- [ ] Report accuracy manually validated (≥ 80 % relevant feedback).
- [ ] Mobile viewport passes Lighthouse ≥ 90 performance.

---

### Reference Snippets (Context7)

- **Gemini Quick-start** – `/googleapis/js-genai` ➜ `generateContent`, `stream`.
- **Convex Dev** – `/get-convex/convex-backend` ➜ `npx convex dev`, schema examples.
- **ElevenLabs Streaming** – `/elevenlabs/elevenlabs-js` ➜ `textToSpeech.stream`.

---

> Keep this checklist up-to-date during development. When a checkpoint is implemented, tick the box and link to the relevant PR/commit.
