<!-- eslint-disable no-console -->
<!-- eslint-disable vue/no-ref-object-destructure -->
<!-- eslint-disable etc/no-commented-out-code -->
<script setup lang="ts">
import { DarkMode } from '@icon-park/vue-next'
import { computed, ref } from 'vue'
import { isBrowser } from '../utils/browser.utils'
import { $t } from '../utils/translate.utils'

const theme = ref('dark')
const isDark = computed(() => theme.value === 'dark')

function setTheme (value: string): void {
  // console.info('theme is now', value)
  theme.value = value
  if (isBrowser) document.documentElement.classList.toggle('dark', isDark.value)
}

function doSwitch (): void {
  setTheme(isDark.value ? 'light' : 'dark')
}

// eslint-disable-next-line vue/no-ref-object-reactivity-loss
setTheme(theme.value)
// watchState('theme', () => { setTheme(state.theme) })
</script>

<template>
  <button type="button" @click="doSwitch">
    <DarkMode class="app-link text-2xl" :theme="isDark ? 'outline' : 'filled'"
      :title="isDark ? $t('general.use-light-theme') : $t('general.use-dark-theme')" />
  </button>
</template>
