// @ts-check

import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],

  vite: {
    // @ts-expect-error - Tailwind CSS Vite plugin type compatibility issue with Astro
    plugins: [tailwindcss()],
  },
});
