import type { Id } from "../_generated/dataModel";
import type { ActionCtx, MutationCtx } from "../_generated/server";
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
  const status = await rateLimiter.limit(ctx, name, { key, count });
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
  await rateLimiter.limit(ctx, name, { key, count, throws: true });
}
