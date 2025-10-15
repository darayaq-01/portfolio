// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from "@tailwindcss/vite";
console.log('xxxxx>', import.meta.env.PUBLIC_TOKEN_GITHUB);

// https://astro.build/config
export default defineConfig({
    site: 'https://darayaq.de',
    vite: {    plugins: [tailwindcss()],  },
    integrations: [mdx(), sitemap(), ],
    experimental: {
        staticImportMetaEnv: true,
    }
});