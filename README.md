# Folio

[![GitHub license](https://img.shields.io/github/license/shuunen/folio.svg?color=success)](https://github.com/Shuunen/folio/blob/master/LICENSE)

[![Libraries.io](https://img.shields.io/librariesio/github/shuunen/folio.svg)](https://libraries.io/github/Shuunen/folio)
[![Mozilla HTTP Observatory Grade](https://img.shields.io/mozilla-observatory/grade/rrl-folio.netlify.app.svg?publish)](https://observatory.mozilla.org/analyze/rrl-folio.netlify.app)
[![LGTM Grade](https://img.shields.io/lgtm/grade/javascript/github/Shuunen/folio.svg)](https://lgtm.com/projects/g/Shuunen/folio/)
[![Website](https://img.shields.io/website/https/rrl-folio.netlify.app.svg)](https://rrl-folio.netlify.app)
[![BCH compliance](https://bettercodehub.com/edge/badge/Shuunen/folio?branch=master)](https://bettercodehub.com/)

> This is my personal promoting / landing / minimalist page.

![logo](pages/assets/icons/logo.svg)

## Todo

Bring back `state.ts` :

```ts
import { createState, storage } from 'shuutils'

export const { state, watchState } = createState({
  theme: typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
}, storage)
```

Bring back `logger.ts` :

```ts
import { Logger } from 'shuutils'

export const logger = new Logger()
```

Bring back `dark-switch.vue` :

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { logger } from '../src/logger'
import { state, watchState } from '../src/state'

const theme = ref(state.theme)
const isDark = computed(() => theme.value === 'dark')

function setTheme (value: string): void {
  logger.info('theme is now', value)
  theme.value = value
  if (typeof document !== 'undefined') document.documentElement.classList.toggle('dark', isDark.value)
}

function doSwitch (): void {
  state.theme = isDark.value ? 'light' : 'dark'
}

setTheme(state.theme)
watchState('theme', () => { setTheme(state.theme) })
</script>

<template>
  <button type="button" @click="doSwitch">
    <dark-mode class="link" :title="isDark ? 'Switch to sun mode' : 'Bring the night'" :theme="isDark ? 'outline' : 'filled'" />
  </button>
</template>
```

## Thanks

- [Dependency-cruiser](https://github.com/sverweij/dependency-cruiser) : handy tool to validate and visualize dependencies
- [Eslint](https://eslint.org) : super tool to find & fix problems
- [Feather Icons](https://feathericons.com) : nice looking svg icons
- [Github](https://github.com) : for all their great work year after year, pushing OSS forward
- [Gtmetrix](https://gtmetrix.com) : great tool to check & monitor websites performances
- [IconPark](https://iconpark.oceanengine.com/official): nice svg icons
- [Netlify](https://netlify.com) : awesome company that offers hosting for OSS
- [Nnnoise](https://fffuel.co) : sexy svg noise texture generator
- [Repo-checker](https://github.com/Shuunen/repo-checker) : eslint cover /src code and this tool the rest ^^
- [Shields.io](https://shields.io) : super platform centralizing badges
- [Shuutils](https://github.com/Shuunen/shuutils) : collection of pure JS utils
- [TailwindCss](https://tailwindcss.com) : awesome lib to produce maintainable style
- [Vite](https://github.com/vitejs/vite) : super fast frontend tooling
- [Vue](https://vuejs.org) : when I need a front framework, this is the one I choose <3
- [Web App Manifest Generator](https://app-manifest.firebaseapp.com) : generate manifest.json easily

## Notes

This project does not need demo.
