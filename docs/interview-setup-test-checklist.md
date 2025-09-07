### Interview Setup & Failure Handling Test Checklist

Use this checklist to verify the session creation, setup, failure flows, and guard behaviors.

#### Prerequisites
- [ ] Prerequisites completed
- Have two test users (User A and User B)
- Access to Convex Dashboard (to adjust credits, inspect docs)
- Ability to temporarily adjust rate limit thresholds (optional)
- For happy path: ensure User A has ≥ 15 credits

### 1) Happy path: create + setup
- [x] Completed
- Visit `/interview`
- Paste a realistic JD (> 50 characters)
- Ensure balance ≥ 15 credits
- Click `./start-interview`
- Confirm navigation to `/interview/setup?sessionId=...`
- Confirm automatic setup progress and eventual redirect to `/interview/session/{id}`

### 2) Unauthorized getSession (User B accessing User A session)
- [x] Completed
- As User A, create a session; copy its `sessionId`
- Log out; log in as User B
- Visit `/interview/setup?sessionId={A}` → should redirect to `/interview` (no crash)
- Visit `/interview/setup-failed?sessionId={A}` → page should render generic failure (no crash)

### 3) Credits failure flow
- [x] Completed
- Set User A credits < 15 in Convex Dashboard
- From `/interview`, start with valid JD
- Confirm brief visit to `/interview/setup`, then redirect to `/interview/setup-failed?sessionId=...`
- Confirm failure `code: CREDITS` and `./buy-credits` CTA
- Click `./edit-description` → routes to `/interview` with same `sessionId` in search
- Increase credits to ≥ 15
- Click `./retry-setup` → routes to `/interview/setup` and proceeds normally

### 4) Rate limit handling
- [x] Completed
- Rapidly trigger `./start-interview` to hit createSession rate limit (or temporarily lower thresholds)
- Expect rate-limit toast with humanized retry time; no navigation
- With an existing session, re-trigger on `/interview/setup` to hit startSetup rate limit
- Expect redirect to `/interview/setup-failed` and toast displayed

### 5) Parse failure path
- [x] Completed
- Temporarily disrupt model calls (e.g., block the model endpoint locally)
- Start setup; confirm redirect to `/interview/setup-failed` with `code: PARSE`
- Click `./start-new` → should navigate back to `/interview` to create a fresh session

### 6) Fresh session creation
- [x] Completed ins unchanged
- Confirm new session gets a fresh ID when created

### 7) Navigation consistency
- [x] Completed
- Manually visit `/interview/setup?sessionId={failedSessionId}`
- Confirm it parses and navigates using `{ to, search }` to `/interview/setup-failed?sessionId=...` (no full-URL serialization issues)

### 8) Type, lint, build checks (optional)
- [ ] Completed
- `bun run typecheck` succeeds
- `bun run lint` succeeds

### 9) Convex console checks (optional)
- [ ] Completed
- Call `sessions.getSession` with a sessionId that does not belong to current user → returns `null` (no throw)
- Call `sessions.resetSetup` with your own sessionId → returns `{ success: true }`
- Call `sessions.resetSetup` with another user’s sessionId → throws `Unauthorized`

### 10) Scheduled purge (optional)
- [ ] Completed
- Call `internal.sessions.purgeIfFailed` manually (for a failed, uncharged session)
- Confirm document is deleted

### 11) Watch-fors (during runs)
- [ ] Completed
- No uncaught errors in browser console on unauthorized/failed routes
- Rate limit toasts show with correct retry time
- Redirects between `/interview/setup` and `/interview/setup-failed` are correct
- Redirect from setup to session occurs after questions are ready


