import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    CONVEX_SITE_URL: z.url(),
    POLAR_ORGANIZATION_TOKEN: z.string().min(1),
    POLAR_WEBHOOK_SECRET: z.string().min(1),
    APP_URL: z.url(),
    WEB_URL: z.url(),
    CLERK_WEBHOOK_SECRET: z.string().min(1),
    CLERK_JWT_ISSUER_DOMAIN: z.string().min(1),
    NOTION_API_KEY: z.string().min(1),
    NOTION_DATABASE_ID: z.string().min(1),
    TURNSTILE_SECRET_KEY: z.string().min(1),
  },
  runtimeEnv: {
    CONVEX_SITE_URL: process.env.CONVEX_SITE_URL,
    POLAR_ORGANIZATION_TOKEN: process.env.POLAR_ORGANIZATION_TOKEN,
    POLAR_WEBHOOK_SECRET: process.env.POLAR_WEBHOOK_SECRET,
    APP_URL: process.env.APP_URL,
    WEB_URL: process.env.WEB_URL,
    CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET,
    CLERK_JWT_ISSUER_DOMAIN: process.env.CLERK_JWT_ISSUER_DOMAIN,
    NOTION_API_KEY: process.env.NOTION_API_KEY,
    NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID,
    TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
  },
  skipValidation: !process.env.VALIDATE_ENV,
});
