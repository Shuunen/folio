import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import { defineConfig } from 'astro/config'
import svgr from 'vite-plugin-svgr'

// https://astro.build/config
export default defineConfig({
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr'],
  },
  integrations: [react(), tailwind()],
  vite: {
    plugins: [svgr()],
  },
})
