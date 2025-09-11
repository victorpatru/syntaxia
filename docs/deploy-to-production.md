# Syntaxia Production Deployment SOP (Convex + Vercel with Turborepo)

This SOP describes how to deploy the Syntaxia monorepo to production:
- Backend: Convex (production deployment)
- Frontend Apps: Vercel (Turborepo-aware) for `apps/web` (Astro) and `apps/app` (TanStack Start)
- No staging environment

Use Bun for all local commands. Vercel’s Turborepo support will detect and build only the changed workspaces.

---

## 1) Prerequisites
- Vercel account with Git provider connected to this repo
- Convex account and CLI (`bunx convex --version`)
- Domains chosen:
  - WEB: `syntaxia.com`
  - APP: `app.syntaxia.com`
- Clerk project for authentication
- Polar account (for payments) with product IDs
- Turnstile site key (optional if used)

---

## 2) Convex: Create/Attach Production Deployment
1. Login and link:
   ```bash
   bunx convex login
   bunx convex init  # if not initialized locally
   ```
2. Create a production deployment (once):
   ```bash
   cd packages/backend
   bunx convex deploy --prod
   ```
3. Note the Convex production URL. You’ll set it as `VITE_CONVEX_URL` (for `@app`) and optionally `PUBLIC_CONVEX_URL` (for `@web`).

### Convex required environment variables
File reference: `packages/backend/convex/env.ts`
Set these in Convex (Dashboard → Settings → Environment Variables):
- CONVEX_SITE_URL: `https://<your-convex-deployment>.convex.cloud`
- APP_URL: `https://app.syntaxia.com`
- CONVEX_ENV: `production`
- CLERK_WEBHOOK_SECRET: from Clerk webhook signing secret
- CLERK_JWT_ISSUER_DOMAIN: e.g. `syntaxia.clerk.accounts.dev` or your custom domain
- POLAR_ORGANIZATION_TOKEN
- POLAR_WEBHOOK_SECRET
- POLAR_PRODUCT_ID_1_SESSION
- POLAR_PRODUCT_ID_3_SESSIONS
- POLAR_PRODUCT_ID_5_SESSIONS
- POLAR_ENVIRONMENT: `production`
- ELEVENLABS_API_KEY
- ELEVENLABS_AGENT_ID
- AI_GATEWAY_API_KEY (optional)
- GOOGLE_GENERATIVE_AI_API_KEY (optional)

4. Seed/init (optional if you have an init function):
   ```bash
   bun run -C packages/backend seed
   ```

### Convex webhooks (HTTP Routes)
File reference: `packages/backend/convex/http.ts`
- Clerk Webhook: `POST /webhook/clerk`
- Polar Webhook: `POST /webhook/polar`

Configure external services to call these Convex endpoints (Convex Dashboard → HTTP routes shows full URLs).

---

## 3) Vercel: Turborepo-aware Project Setup
Vercel can import the root of the monorepo and create separate Projects per app directory using “Monorepo” detection. Create two Vercel Projects from the same repo:

- Project A: `@syntaxia/web`
  - Root Directory: `apps/web`
  - Build Command: `bun install && bun run build`
  - Output Directory: `dist`
  - Framework Preset: Astro

- Project B: `@syntaxia/app`
  - Root Directory: `apps/app`
  - Build Command: `bun install && bun run build`
  - Output: Vercel Build Output API (Nitro .output) – detected automatically by TanStack Start/Nitro
  - Framework Preset: Other / Node

Ensure Vercel is using Bun (Project Settings → Build & Development Settings → Package Manager).

### Shared Monorepo settings
- Link repo once at the monorepo root.
- Vercel will cache `node_modules` and Turborepo artifacts to speed up builds.
- No need for a custom pipeline; Vercel + Turborepo handle workspace isolation.

---

## 4) App-specific Environment Variables (Vercel)

### apps/app (TanStack Start)
Set in Vercel Project B (Production):
- VITE_CONVEX_URL: Convex production deployment URL
- CLERK_PUBLISHABLE_KEY
- CLERK_SECRET_KEY

Optional:
- Any app-specific flags or URLs as needed by your routes/components

### apps/web (Astro)
Set in Vercel Project A (Production):
- PUBLIC_CONVEX_URL (optional, if landing needs to call Convex)
- PUBLIC_APP_URL: `https://app.syntaxia.com` (recommended so CTAs link to the app)

Note: Astro config already declares `PUBLIC_CONVEX_URL`. Add `PUBLIC_APP_URL` to `astro.config.mjs` if not present.

---

## 5) External Service Configuration

### Clerk
- Allowed origins/redirects: add `https://syntaxia.com` and `https://app.syntaxia.com`
- JWT Template named `convex` (used in `apps/app/src/routes/__root.tsx` for `auth.getToken({ template: "convex" })`)
- Webhooks: point to Convex `POST /webhook/clerk`, copy the signing secret into Convex `CLERK_WEBHOOK_SECRET`

### Polar
- Webhook to Convex `POST /webhook/polar`
- Use production product IDs for: 1/3/5 session packages
- Copy secrets into Convex env

---

## 6) Domains & Routing
- Assign `syntaxia.com` to Project A (`apps/web`)
- Assign `app.syntaxia.com` to Project B (`apps/app`)
- In `@web`, ensure CTAs point to the app:
  - Prefer using `PUBLIC_APP_URL` and constructing links like `${PUBLIC_APP_URL}/login`

---

## 7) Deployment Steps (End-to-End)
1. Push main branch to trigger Vercel builds (Turborepo caches speed this up).
2. Verify Convex production deployment exists and envs are set.
3. Configure Vercel Projects A and B with envs above.
4. Configure Clerk & Polar webhooks to Convex.
5. Assign domains in Vercel (Project Settings → Domains).
6. Redeploy both Vercel projects to apply envs.

---

## 8) Go-Live Checklist
- Web (`syntaxia.com`)
  - Loads without console errors
  - CTAs link to `https://app.syntaxia.com/login`
- App (`app.syntaxia.com`)
  - Clerk sign-in/sign-up works
  - Convex client connects (no 401s); queries and mutations succeed
- Webhooks
  - Clerk webhook deliveries are 2xx in dashboard
  - Polar webhook deliveries are 2xx and credits flow works
- Payments/Flows
  - Prices use production Polar product IDs
  - Post-checkout redirect uses `APP_URL`
- Observability
  - Convex dashboard function health has no errors

---

## 9) Rollback & Recovery
- Vercel: Re-deploy previous successful build for `@web` or `@app`
- Convex: Re-deploy previous version if needed
- Keep a backup of changed env vars before modifications

---

## 10) Notes
- Use Bun locally: `bun i`, `bun run -C apps/web build`, `bun run -C apps/app build`
- Do not start dev servers from automation; run locally as needed
- Turborepo config (`turbo.json`) is respected by Vercel to optimize builds
