import type { Id } from "../_generated/dataModel";
import type { ActionCtx, MutationCtx } from "../_generated/server";
import { env } from "../env";
import { type RateLimitName, rateLimiter } from "./config";

type RateCtx = ActionCtx | MutationCtx;

export type CheckRateLimitResult =
  | { ok: true }
  | { ok: false; retryAfterMs: number };

export async function checkRateLimit(
  ctx: RateCtx,
  name: RateLimitName,
  key: string | Id<"users">,
  count: number = 1,
): Promise<CheckRateLimitResult> {
  // Skip rate limiting in development
  if (env.CONVEX_ENV === "development") {
    return { ok: true };
  }

  // console.log(`[RATE_LIMIT] Checking ${name} for key: ${key}, count: ${count}`);
  const status = await rateLimiter.limit(ctx, name, { key, count });
  // console.log(
  //   `[RATE_LIMIT] ${name} result: ${status.ok ? "ALLOWED" : "BLOCKED"} (retryAfter: ${status.retryAfter || 0}ms)`,
  // );
  return status.ok
    ? { ok: true as const }
    : { ok: false as const, retryAfterMs: status.retryAfter };
}

export async function enforceRateLimitOrThrow(
  ctx: RateCtx,
  name: RateLimitName,
  key: string | Id<"users">,
  count: number = 1,
): Promise<void> {
  // Skip rate limiting in development
  if (env.CONVEX_ENV === "development") {
    return;
  }

  await rateLimiter.limit(ctx, name, { key, count, throws: true });
}
