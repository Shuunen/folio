// @ts-check
import { defineConfig } from 'astro/config'

// https://astro.build/config
// oxlint-disable-next-line no-default-export -- astro requires the config to be the default export
export default defineConfig({
  // dist/resumes is owned by the json-resume renderer, keep the site output beside it
  outDir: './dist/site',
})
