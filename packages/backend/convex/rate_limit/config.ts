import { HOUR, MINUTE, RateLimiter } from "@convex-dev/rate-limiter";
import { components } from "../_generated/api";

export const limiterConfig = {
  startSetup: { kind: "token bucket", rate: 4, period: MINUTE, capacity: 4 },
  createSession: { kind: "fixed window", rate: 12, period: HOUR },
  analyzeSession: {
    kind: "token bucket",
    rate: 2,
    period: MINUTE,
    capacity: 2,
  },
  getConversationToken: {
    kind: "token bucket",
    rate: 20,
    period: MINUTE,
    capacity: 10,
  },
  startActive: { kind: "token bucket", rate: 30, period: MINUTE, capacity: 15 },
  endSession: { kind: "token bucket", rate: 30, period: MINUTE, capacity: 15 },
  createCheckout: { kind: "fixed window", rate: 12, period: HOUR },
} as const;

export type RateLimitName = keyof typeof limiterConfig;

export const rateLimiter = new RateLimiter(
  components.rateLimiter,
  limiterConfig,
);
