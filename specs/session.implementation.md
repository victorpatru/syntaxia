## Session Implementation Plan (sequenced, independent tasks)

Each task is scoped to be implemented and tested independently. Favor Bun, Convex, and TanStack Router patterns already in the repo.

Checklist usage:
- Toggle the checkbox under each section to mark completion: `[ ]` → `[x]`
- Optionally append a short note or PR/commit link after the checkbox line

### 1) Data model and env wiring
- [x] Complete
- Add `interview_sessions` table in `packages/backend/convex/schema.ts` (fields per `specs/session.md`).
- Ensure `packages/backend/convex/env.ts` has: `AI_GATEWAY_API_KEY`, `ELEVENLABS_API_KEY`, `ELEVENLABS_VOICE_ID`, `APP_URL`.
- Verify types compile (Convex codegen).

### 2) Credits: debit mutation
- [x] Complete
- In `packages/backend/convex/credits.ts` add `internalMutation debit({ sessionId, amount=15 })`.
- Extend `credits_log` schema with optional `sessionId` index.
- Implement idempotency per `sessionId` (do not double charge).

### 3) Sessions module (create/get)
- [x] Complete
- New file: `packages/backend/convex/sessions.ts`.
- Implement `create` (auth, concurrency guard, insert doc, return id).
- Implement `get` (by id) with auth check.

### 4) JD parse (startSetup)
- [x] Complete
- Implement `startSetup` (action):
  - Guard credits ≥ 15.
  - Call Gemini 2.5 Pro via AI SDK (Google provider) to parse JD → `questions` (MinimalQuestion[]), `detectedSkills`, derived `experienceLevel` and `domainTrack`.
  - Persist results to session.

### 5) Activate session and charging (startActive/ensureCharge)
- [x] Complete
- Implement `startActive` (mutation): set `status=active`, `startedAt = micOnAt ?? now`.
- Schedule `ensureCharge` at T+120s to call `credits.debit` if not yet charged.
- Implement `ensureCharge` (internal) idempotently.

### 6) End session (end)
- [x] Complete
- Implement `end` (mutation): finalize duration; call `ensureCharge`; set `status=analyzing`.

### 7) Analyze (analyze)
- [x] Complete
- Implement `analyze` (action):
  - Fetch transcript from ElevenLabs using `elevenlabsConversationId`.
  - Call Gemini 2.5 Pro to produce scores, highlights, recommendations.
  - Persist report; set `status=complete`, `reportGeneratedAt`.

### 8) UI wiring — start page
- [x] Complete
- In `apps/app/src/routes/_authed/interview/index.tsx`:
  - Replace local UUID with `sessions.create`.
  - Navigate to `/interview/setup?sessionId=...`.

### 9) UI wiring — setup page
- [x] Complete
- In `apps/app/src/routes/_authed/interview/setup.tsx`:
  - Call `sessions.startSetup(sessionId)` on mount.
  - Poll `sessions.get` until `questions` present.
  - Navigate to `/interview/session/$sessionId`.

### 10) UI wiring — live session
- [x] Complete (ElevenLabs integration pending step 13)
- In `apps/app/src/routes/_authed/interview/session/$sessionId.tsx`:
  - On mic-ON, call `sessions.startActive({ sessionId, micOnAt: Date.now() })`.
  - Initialize ElevenLabs `useConversation.startSession` with `dynamicVariables` from session.
  - Auto-end timer at 15:00 or user action → call `sessions.end` and go to analysis.

### 11) UI wiring — analysis loader
- [x] Complete
- In `apps/app/src/routes/_authed/interview/analysis/$sessionId.tsx`:
  - Trigger `sessions.analyze` once; poll `sessions.get` until `status=complete`.
  - Navigate to `/interview/report/$sessionId`.

### 12) UI wiring — report page
- [x] Complete
- In `apps/app/src/routes/_authed/interview/report/$sessionId.tsx`:
  - Load session via `sessions.get`; render stored report fields.

### 13) ElevenLabs agent setup (manual)
- [x] Complete
- Configure agent per `## ElevenLabs Agent Configuration (UI checklist)` in `specs/session.md`.
- Private agent recommended; obtain `conversationToken` server-side.
- Added ElevenLabs React SDK integration with direct connection for optimal performance.

### 14) Guards and UX polish
- [x] Complete
- Block start if `credits.balance < 15`; show prompt to purchase credits.
- If an existing non-complete session exists, redirect to it from start page.
- Error surfaces: toast + retry on parse/analyze failures (single retry).
- Added Sonner toast notifications with retry functionality and improved UX messaging.

### 15) Testing pass
- [ ] Complete
- Unit test credits debit idempotency.
- Happy path E2E (fake JD → setup → session start/end → analysis → report).
- Edge cases: end before 120s (no charge), disconnect/reconnect during session.

### 16) Deployment checklist
- [ ] Complete
- Verify env vars in hosting.
- ElevenLabs agent: confirm dynamic variables resolve; first message greeting.
- Confirm Convex scheduled job (ensureCharge) runs in target env.


