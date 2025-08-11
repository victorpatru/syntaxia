import { createEnv } from "@t3-oss/env-core";
import { type } from "arktype";

export const env = createEnv({
  server: {
    CONVEX_SITE_URL: type("string.url"),
    POLAR_ORGANIZATION_TOKEN: type("string>=1"),
    POLAR_WEBHOOK_SECRET: type("string>=1"),
    SITE_URL: type("string.url"),
  },
  runtimeEnv: {
    CONVEX_SITE_URL: process.env.CONVEX_SITE_URL,
    POLAR_ORGANIZATION_TOKEN: process.env.POLAR_ORGANIZATION_TOKEN,
    POLAR_WEBHOOK_SECRET: process.env.POLAR_WEBHOOK_SECRET,
    SITE_URL: process.env.SITE_URL,
  },
  skipValidation: !process.env.VALIDATE_ENV,
});
