import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    CONVEX_SITE_URL: z.url(),
    POLAR_ORGANIZATION_TOKEN: z.string().min(1),
    POLAR_WEBHOOK_SECRET: z.string().min(1),
    POLAR_PRODUCT_ID_CREDITS_15: z.string().min(1),
    APP_URL: z.url(),
    CLERK_WEBHOOK_SECRET: z.string().min(1),
    CLERK_JWT_ISSUER_DOMAIN: z.string().min(1),
    POLAR_ENVIRONMENT: z.enum(["sandbox", "production"]).default("sandbox"),
    AI_GATEWAY_API_KEY: z.string().min(1).optional(),
    ELEVENLABS_API_KEY: z.string().min(1),
    ELEVENLABS_VOICE_ID: z.string().min(1),
    ELEVENLABS_AGENT_ID: z.string().min(1),
  },
  runtimeEnv: {
    CONVEX_SITE_URL: process.env.CONVEX_SITE_URL,
    POLAR_ORGANIZATION_TOKEN: process.env.POLAR_ORGANIZATION_TOKEN,
    POLAR_WEBHOOK_SECRET: process.env.POLAR_WEBHOOK_SECRET,
    POLAR_PRODUCT_ID_CREDITS_15: process.env.POLAR_PRODUCT_ID_CREDITS_15,
    APP_URL: process.env.APP_URL,
    CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET,
    CLERK_JWT_ISSUER_DOMAIN: process.env.CLERK_JWT_ISSUER_DOMAIN,
    POLAR_ENVIRONMENT: process.env.POLAR_ENVIRONMENT,
    AI_GATEWAY_API_KEY: process.env.AI_GATEWAY_API_KEY,
    ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY,
    ELEVENLABS_VOICE_ID: process.env.ELEVENLABS_VOICE_ID,
    ELEVENLABS_AGENT_ID: process.env.ELEVENLABS_AGENT_ID,
  },
  skipValidation: !process.env.VALIDATE_ENV,
});
