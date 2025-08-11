## Technical Phone Screen MVP (Voice-First with ElevenLabs)

### Overview
Build an MVP that simulates a realistic, engineer-led technical phone screen for senior candidates (mid coaching mode available) using a voice agent (ElevenLabs for TTS, modern STT). Focus on high-signal evaluation areas that fit voice-first interactions without requiring a coding IDE.

### Recommendation (What to focus on)
- **Yes**: Center the MVP on a technical phone screen (not recruiter, not HM-only). 
- **Scope**: Prioritize debugging walkthroughs, code comprehension/refactor reasoning, and practical scenario Q&A about APIs, data models, reliability, performance, and rollout trade-offs.
- **Defer**: Pure live coding-by-voice in v1 (awkward UX, lower fidelity vs. editor). Add optional code runner later.

### Why this aligns with attached JDs
- **Arcjet**: Ownership, performance, and DX → probe debugging skill, perf budgets, rollouts.
- **Railway**: GraphQL + Temporal workflows, infra orchestration → scenario Q&A, failure modes.
- **PostHog**: Product-engineering, autonomy → code review + product impact trade-offs.
- **OpenRouter**: Edge/Workers, scaling → latency/cost trade-offs, rate limiting, observability.

---

## Ideal Customer Profile (ICP)

- **Primary ICP — Senior engineers actively interviewing (voice-first prep)**
  - **Roles**: Product Engineer, Full‑Stack, Platform/Infra (4–12 years experience)
  - **Targets**: Product-led startups (20–300 headcount) and growth tech (e.g., Arcjet/Railway/PostHog/OpenRouter peers)
  - **Stage**: In an active loop with a technical phone screen within 2–8 weeks
  - **Pain points**: ambiguous phone screens; weak feedback; time-boxed prep; anxiety about debugging/design probes vs. pure coding
  - **Jobs-to-be-done**: realistic, voice-led mock screen; JD-calibrated scenarios; concrete rubric with “what to fix next”
  - **Buying triggers**: interview scheduled; referral from peers/Discord/LinkedIn; past rejection at phone screen
  - **Willingness to pay**: $49–$149 per 30–40 min session including transcript, rubric, and action plan
  - **Success signal**: improved confidence; clear improvement bullets; pass rate on subsequent screens

- **Secondary ICP (near-term expansion)**
  - Mid engineers leveling up to the senior bar
  - Senior/Staff ICs changing domains (web → edge/infra/analytics) seeking targeted scenario drills
  - Career coaches/bootcamps wanting realistic technical phone screens for clients (B2B2C)
  - Small startup hiring managers seeking calibration rubrics and candidate coaching (B2B later)

- **Out of scope for MVP**
  - Entry-level/DSA-only prep (requires editor-based live coding focus)
  - Enterprise interview platforms needing ATS integration and compliance on day one

## MVP: Detailed Specification

### Session framing (candidate-facing)
- “30–40 min technical phone screen. Expect debugging/comprehension of short snippets and practical system questions tied to the JD, not live coding.”
- Inputs: pasted JD, target bar (Senior default | Mid coaching), role domain (web, infra, edge, analytics), and candidate focus areas.

### Flow & Sections

#### A. Background depth warm-up (≈ 5 minutes)
- **Objective**: Rapidly calibrate scope/ownership and surface relevant past systems.
- **Agent prompts**:
  - “Walk me through a recent system you owned end-to-end. What was the goal, scale, key constraints, and your specific role?”
  - “What were the performance or reliability targets, and how did you measure them?”
- **What good looks like**: Clear articulation of scope, constraints, success metrics, trade-offs considered, and measurable impact.
- **Rubric anchors**:
  - 2 = Vague responsibilities; lacks metrics. 
  - 4 = Concrete scope, metrics, trade-offs.

#### B. Code comprehension & debugging (≈ 15–20 minutes)
- **Objective**: Assess ability to read, diagnose, and improve unfamiliar code quickly—high signal for mid/senior.
- **Artifacts**: 2–3 short snippets (60–120 lines each max), tailored to JD:
  - Web/Full‑Stack baseline: auth/session + RBAC middleware; API errors/pagination; caching & rate limiting; queues/retries; SQL correctness/transactions; logging/metrics/tracing; feature flags; background jobs.
- **Agent interaction pattern**:
  1) Read snippet summary aloud; offer to read lines on request. 
  2) Ask: “Where are the biggest risks or bugs? What would you change first?”
  3) Drill down: “How would you test that fix? What edge cases?”
- **Sample probes**:
  - “What are the failure modes across service boundaries?”
  - “Where would you add observability? Which signals?”
  - “What are the perf hotspots? How would you validate?”
- **Scoring dimensions**: correctness, prioritization, testability, clarity, complexity control.
- **Anchor examples**:
  - 2 = Superficial comments, misses root cause, proposes risky changes.
  - 3 = Identifies key issue but partial fixes; limited test strategy.
  - 4 = Diagnoses root cause, proposes minimal, testable fix with risks noted.

#### C. Scenario Q&A (design-lite) tied to the JD (≈ 10–15 minutes)
- **Objective**: Evaluate breadth, trade-off fluency, and pragmatic design thinking without whiteboarding.
- **Tracks**
  - MVP default: Web/Full‑Stack baseline topics (auth flows, robustness patterns, rollout/observability).
  - Phase 1+: Specialized packs added based on telemetry: GraphQL/Temporal workflows, analytics pipelines, edge/worker patterns.
- **Agent interaction pattern**:
  - Start broad (“Design a rate limiter for X with Y constraints”).
  - Follow-ups based on answers (“What do you cache?”, “How to prevent thundering herd?”, “How do you roll back?”).
- **Scoring dimensions**: problem scoping, trade-offs, correctness, operationalization (rollout, observability), communication.
- **Anchor examples**:
  - 2 = Unstructured, misses constraints, hand-waves trade-offs.
  - 4 = Structured, constraint-led design, explicit trade-offs, rollout/obs plan.

#### D. Wrap-up & immediate feedback (≈ 2–5 minutes)
- **Objective**: Reinforce learning and next steps.
- **Agent outputs (spoken + written)**:
  - 3–5 concrete improvement bullets tied to rubric.
  - 3 tailored practice prompts for next session.
  - One recommended reading or exercise per weak area.

### Output & Reporting
- **Transcript** with timestamped highlights of strong/weak moments.
- **Rubric scores** (1–4 per dimension) with anchor-backed comments.
- **Action plan**: prioritized next steps; 3 follow-up practice prompts; links to baseline or applicable specialized packs (when enabled).
- **Export**: shareable PDF/Markdown summary; JSON for programmatic review.

### JD Conditioning (how prompts become role-specific)
1) Parse JD for competencies (e.g., auth robustness, caching, queues, SQL correctness; optionally GraphQL/Temporal, analytics, edge if enabled).
2) Map primarily to the Web/Full‑Stack baseline templates (question banks + snippets); if usage signals warrant, select from specialized packs.
3) Calibrate difficulty by level (mid vs. senior) with deeper trade-off follow-ups for senior.

### Rubric (detailed)
- Communication & clarity (1–4): structure, precision, avoids hand-waving.
- Debugging & diagnosis (1–4): root-cause focus, minimal viable fix, testability.
- Breadth & trade-offs (1–4): constraints-first, explicit trade-off reasoning.
- Operationalization (1–4): rollout, observability, oncall realities, failure modes.
- Product sense (1–4): user/impact awareness where applicable.

### Voice UX & Interaction
- Turn-taking: enable barge-in; keep questions concise; allow interjections.
- Pacing: medium TTS speed; chunk prompts; summarize branches.
- STT resilience: partial results streaming; confirm critical details (“Did you say…?”).

---

## UI screens & flows (wireframe draft)

High-level, voice-first with on-screen content. Use Shadcn/Radix in TanStack Start; Convex for data/functions.

### 1) Setup (Landing)

```
┌────────────────────────────────────────────────────────────┐
│ Header: Logo | Start                                       │
├────────────────────────────────────────────────────────────┤
│ JD (textarea)                                              │
│ Target bar [Senior|Mid (coaching)]  Domain [Web/DX|Infra|Analytics|Edge]   │
│ [ Start Mock Session ]   [ View Sample Report ]            │
└────────────────────────────────────────────────────────────┘
```
- Action: create Convex `session` → route to `/session/$id`.

### 2) Live Session (A–D)

```
┌──────────────────────────────────────────────────────────────┐
│ A  B  C  D  (active) | 00:32 | Speaking 🔊 | [End] [Mute]     │
├───────────────┬───────────────────────────┬───────────────────┤
│ Transcript    │ Code/Logs Viewer          │ Rubric & Notes    │
│ Agent ▸ ...   │ ┌───────────────────────┐ │ Comm ○○○●         │
│ You   ▸ ...   │ │ code + line numbers   │ │ Debug ○○●○         │
│ [Barge-in]    │ │ highlighted ranges     │ │ Notes [Add]       │
│               │ └───────────────────────┘ │ [Mark moment]     │
└───────────────┴───────────────────────────┴───────────────────┘
│ Footer: tips • network • section status                      │
└──────────────────────────────────────────────────────────────┘
```
- Center highlights driven by `clientTools` (e.g., `show_snippet`, `highlight_lines`).

### 3) Report

```
┌────────────────────────────────────────────────────────────┐
│ Report: Session #123                                       │
├────────────────────────────────────────────────────────────┤
│ Scores: Comm ▣ Debug ▣ Breadth ▣ Ops ▣ Product ▣          │
│ Highlights (jump to transcript/code)                       │
│ Action Plan (3–5 bullets)                                  │
│ Follow-up Prompts (3)                                      │
│ [Download PDF] [Download JSON] [Book another session]      │
└────────────────────────────────────────────────────────────┘
```

### 4) Sessions list

```
┌──────────────────────────────────────────────┐
│ My Sessions                                  │
├──────────────────────────────────────────────┤
│ #  Date       Track    Score   Report        │
│ 1  2025-08-08 Edge     3.6     [View]        │
│ 2  2025-08-05 Web/DX   3.8     [View]        │
└──────────────────────────────────────────────┘
```

### 5) Checkout (minimal)
- Plans: €25 Single, €69 Three‑Pack (default). Stripe Checkout or payment link.

### Routes & components (TanStack Start)
- Routes: `/` (Setup), `/session/$id`, `/report/$id`, `/sessions`, `/checkout`.
- Components: `SessionHeader`, `TranscriptPanel`, `SnippetViewer`, `RubricPanel`.

### Convex functions (MVP)
- `sessions.create({ jd, level, domain })`
- `sessions.appendTranscript({ id, turn })`
- `sessions.saveScore({ id, rubric })`
- `sessions.finalize({ id, report })`
- `snippets.getByDomain({ domain })`

### Empty/error states
- No JD → disable Start. Mic blocked → permissions modal. Network drop → resume.

## Success Criteria (MVP validation)
- 10–20 paid sessions from senior candidates within 2 weeks (mid via coaching mode).
- Post-session CSAT ≥ 4.5/5; ≥ 40% intent to repurchase for a new JD/company.
- Top feedback themes: “felt realistic” and “I know what to fix now.”

## Technical Stack (v1)
- **TTS**: ElevenLabs.
- **STT**: Whisper or Deepgram (streaming).
- **LLM**: reliable, rubric-driven prompts with low variance.
- **Orchestration**: small Node/TS service; session state; webhook for recording.
- **Data**: transcript + scores; no code uploads in v1 (snippets are curated).

## Risks & Mitigations
- Expectation of live coding → set expectations clearly; provide editor-based add-on later.
- Generic feel → strong JD conditioning + domain packs; dynamic follow-ups keyed to answers.
- Monotony → maintain a bank of varied snippets; rotate scenarios.

## Roadmap (post-MVP)
- v1.1: Optional in-browser code runner with unit tests; per-JD snippet packs.
- v1.2: Interviewer personas (strict vs. coaching); deeper analytics; calibration mode.
- v1.3: Team (B2B) mode with hiring rubrics and calibrated score normalization.

---

## Appendix: Example JD-Calibrated Prompts

### Arcjet (Web/DX)
- “Identify auth/session risks in this middleware; propose a minimal, testable fix.”
- “How would you roll out a new rate limiter with minimal risk across regions?”

### Railway (GraphQL/Temporal)
- “Where should resolver boundaries end? What belongs in a workflow activity?”
- “How do you guarantee idempotency and retries without duplicating side effects?”

### PostHog (Analytics)
- “Design an event ingestion path with experimentation guardrails and backfills.”
- “What’s your plan for metrics, alerts, and dashboards to detect regressions?”

### OpenRouter (Edge/Workers)
- “Design a rate limiter at the edge: caching, token bucket placement, cold start trade-offs.”
- “Walk through an observability plan to correlate latency spikes with provider routing.”


<<'PATCH'
*** Begin Patch
*** Update File: docs/technical-phone-screen-mvp.md
@@
 ## Appendix: Example JD-Calibrated Prompts
@@
 - “Walk through an observability plan to correlate latency spikes with provider routing.”

---

## Ideal Customer Profile (ICP)

- **Primary ICP — Mid/Senior engineers actively interviewing (voice-first prep)**
  - **Roles**: Product Engineer, Full‑Stack, Platform/Infra (4–12 years experience)
  - **Targets**: Product-led startups (20–300 headcount) and growth tech (e.g., Arcjet/Railway/PostHog/OpenRouter peers)
  - **Stage**: In an active loop with a technical phone screen within 2–8 weeks
  - **Pain points**: ambiguous phone screens; weak feedback; time-boxed prep; anxiety about debugging/design probes vs. pure coding
  - **Jobs-to-be-done**: realistic, voice-led mock screen; JD-calibrated scenarios; concrete rubric with “what to fix next”
  - **Buying triggers**: interview scheduled; referral from peers/Discord/LinkedIn; past rejection at phone screen
  - **Willingness to pay**: $49–$149 per 30–40 min session including transcript, rubric, and action plan
  - **Success signal**: improved confidence; clear improvement bullets; pass rate on subsequent screens

- **Secondary ICP (near-term expansion)**
  - Senior/Staff ICs changing domains (web → edge/infra/analytics) seeking targeted scenario drills
  - Career coaches/bootcamps wanting realistic technical phone screens for clients (B2B2C)
  - Small startup hiring managers seeking calibration rubrics and candidate coaching (B2B later)

- **Out of scope for MVP**
  - Entry-level/DSA-only prep (requires editor-based live coding focus)
  - Enterprise interview platforms needing ATS integration and compliance on day one

## MVP: Detailed Specification

### Session framing (candidate-facing)
- “30–40 min technical phone screen. Expect debugging/comprehension of short snippets and practical system questions tied to the JD, not live coding.”
- Inputs: pasted JD, target seniority (mid/senior), role domain (web, infra, edge, analytics), and candidate focus areas.

### Flow & Sections

#### A. Background depth warm-up (≈ 5 minutes)
- **Objective**: Rapidly calibrate scope/ownership and surface relevant past systems.
- **Agent prompts**:
  - “Walk me through a recent system you owned end-to-end. What was the goal, scale, key constraints, and your specific role?”
  - “What were the performance or reliability targets, and how did you measure them?”
- **What good looks like**: Clear articulation of scope, constraints, success metrics, trade-offs considered, and measurable impact.
- **Rubric anchors**:
  - 2 = Vague responsibilities; lacks metrics. 
  - 4 = Concrete scope, metrics, trade-offs.

#### B. Code comprehension & debugging (≈ 15–20 minutes)
- **Objective**: Assess ability to read, diagnose, and improve unfamiliar code quickly—high signal for mid/senior.
- **Artifacts**: 2–3 short snippets (60–120 lines each max), tailored to JD:
  - Arcjet-style: auth/session middleware; rate limiting; perf pitfalls.
  - Railway-style: GraphQL resolver boundaries; Temporal workflow idempotency.
  - PostHog-style: event ingestion handler; feature flag rollout guardrails.
  - OpenRouter-style: edge worker with request routing, caching, and rate limit.
- **Agent interaction pattern**:
  1) Read snippet summary aloud; offer to read lines on request. 
  2) Ask: “Where are the biggest risks or bugs? What would you change first?”
  3) Drill down: “How would you test that fix? What edge cases?”
- **Sample probes**:
  - “What are the failure modes across service boundaries?”
  - “Where would you add observability? Which signals?”
  - “What are the perf hotspots? How would you validate?”
- **Scoring dimensions**: correctness, prioritization, testability, clarity, complexity control.
- **Anchor examples**:
  - 2 = Superficial comments, misses root cause, proposes risky changes.
  - 3 = Identifies key issue but partial fixes; limited test strategy.
  - 4 = Diagnoses root cause, proposes minimal, testable fix with risks noted.

#### C. Scenario Q&A (design-lite) tied to the JD (≈ 10–15 minutes)
- **Objective**: Evaluate breadth, trade-off fluency, and pragmatic design thinking without whiteboarding.
- **Domain tracks** (pick 1 based on JD):
  - Web/DX (Arcjet): auth flows, rate limiting, perf budgets, rollout strategies.
  - Infra/Workflows (Railway): Temporal idempotency, retries/backoff, DLQs.
  - Analytics (PostHog): event schema, backfills, experimentation guardrails, privacy.
  - Edge/Workers (OpenRouter): rate limiting at edge, caching policy, latency vs. cost.
- **Agent interaction pattern**:
  - Start broad (“Design a rate limiter for X with Y constraints”).
  - Follow-ups based on answers (“What do you cache?”, “How to prevent thundering herd?”, “How do you roll back?”).
- **Scoring dimensions**: problem scoping, trade-offs, correctness, operationalization (rollout, observability), communication.
- **Anchor examples**:
  - 2 = Unstructured, misses constraints, hand-waves trade-offs.
  - 4 = Structured, constraint-led design, explicit trade-offs, rollout/obs plan.

#### D. Wrap-up & immediate feedback (≈ 2–5 minutes)
- **Objective**: Reinforce learning and next steps.
- **Agent outputs (spoken + written)**:
  - 3–5 concrete improvement bullets tied to rubric.
  - 3 tailored practice prompts for next session.
  - One recommended reading or exercise per weak area.

### Output & Reporting
- **Transcript** with timestamped highlights of strong/weak moments.
- **Rubric scores** (1–4 per dimension) with anchor-backed comments.
- **Action plan**: prioritized next steps; 3 follow-up practice prompts; links to domain packs.
- **Export**: shareable PDF/Markdown summary; JSON for programmatic review.

### JD Conditioning (how prompts become role-specific)
1) Parse JD for competencies (e.g., GraphQL, Temporal, Edge Workers, perf budgets).
2) Map to domain pack templates (question banks + snippets).
3) Calibrate to the senior bar; mid coaching mode provides additional scaffolding and hints.

### Rubric (detailed)
- Communication & clarity (1–4): structure, precision, avoids hand-waving.
- Debugging & diagnosis (1–4): root-cause focus, minimal viable fix, testability.
- Breadth & trade-offs (1–4): constraints-first, explicit trade-off reasoning.
- Operationalization (1–4): rollout, observability, oncall realities, failure modes.
- Product sense (1–4): user/impact awareness where applicable.

- Note: Scoring is senior-calibrated; mid coaching mode provides guidance to reach this bar.

### Voice UX & Interaction
- Turn-taking: enable barge-in; keep questions concise; allow interjections.
- Pacing: medium TTS speed; chunk prompts; summarize branches.
- STT resilience: partial results streaming; confirm critical details (“Did you say…?”).

---

## Success Criteria (MVP validation)
- 10–20 paid sessions from mid/senior candidates within 2 weeks.
- Post-session CSAT ≥ 4.5/5; ≥ 40% intent to repurchase for a new JD/company.
- Top feedback themes: “felt realistic” and “I know what to fix now.”

## Technical Stack (v1)
- **TTS**: ElevenLabs.
- **STT**: Whisper or Deepgram (streaming).
- **LLM**: reliable, rubric-driven prompts with low variance.
- **Orchestration**: small Node/TS service; session state; webhook for recording.
- **Data**: transcript + scores; no code uploads in v1 (snippets are curated).

## Risks & Mitigations
- Expectation of live coding → set expectations clearly; provide editor-based add-on later.
- Generic feel → strong JD conditioning + domain packs; dynamic follow-ups keyed to answers.
- Monotony → maintain a bank of varied snippets; rotate scenarios.

## Roadmap (post-MVP)
- v1.1: Optional in-browser code runner with unit tests; per-JD snippet packs.
- v1.2: Interviewer personas (strict vs. coaching); deeper analytics; calibration mode.
- v1.3: Team (B2B) mode with hiring rubrics and calibrated score normalization.

---

## Appendix: Example JD-Calibrated Prompts

### Arcjet (Web/DX)
- “Identify auth/session risks in this middleware; propose a minimal, testable fix.”
- “How would you roll out a new rate limiter with minimal risk across regions?”

### Railway (GraphQL/Temporal)
- “Where should resolver boundaries end? What belongs in a workflow activity?”
- “How do you guarantee idempotency and retries without duplicating side effects?”

### PostHog (Analytics)
- “Design an event ingestion path with experimentation guardrails and backfills.”
- “What’s your plan for metrics, alerts, and dashboards to detect regressions?”

### OpenRouter (Edge/Workers)
- “Design a rate limiter at the edge: caching, token bucket placement, cold start trade-offs.”
- “Walk through an observability plan to correlate latency spikes with provider routing.”



## Acronyms

- **ICP**: Ideal Customer Profile
- **JD**: Job Description
- **STT**: Speech-to-Text
- **TTS**: Text-to-Speech
- **ConvAI**: Conversational AI (ElevenLabs agents)
- **CSAT**: Customer Satisfaction score (typically 1–5)
- **CAC**: Customer Acquisition Cost
- **ARPU**: Average Revenue Per User
- **JTBD**: Jobs To Be Done
- **WTP**: Willingness To Pay
- **A/B test**: Split test of two variants
- **SSR**: Server-Side Rendering
- **UI**: User Interface
- **DMs**: Direct Messages
- **B2B / B2B2C**: Business-to-Business / Business-to-Business-to-Consumer
- **ATS**: Applicant Tracking System
- **DLQ**: Dead Letter Queue
- **v1**: Version 1
