// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://darayaq.de",
  vite: { plugins: [tailwindcss()] },
  integrations: [
    mdx(),
    sitemap({
      changefreq: "weekly",
      priority: 0.5,
    }),
  ],
  experimental: {
    staticImportMetaEnv: true,
  },
});
