// @ts-check

import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],

  env: {
    schema: {
      PUBLIC_CONVEX_URL: envField.string({
        context: "client",
        access: "public",
      }),
      PUBLIC_APP_URL: envField.string({
        context: "client",
        access: "public",
      }),
    },
  },
  vite: {
    // @ts-expect-error - Tailwind CSS Vite plugin type compatibility issue with Astro
    plugins: [tailwindcss()],
  },
});
