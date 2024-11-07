import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import { defineConfig } from 'astro/config'
import svgr from 'vite-plugin-svgr'

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind()],
  redirects: {
    '/': '/en',
  },
  vite: {
    plugins: [svgr()],
  },
})
