<!-- eslint-disable no-console -->
<!-- eslint-disable vue/no-ref-object-destructure -->
<!-- eslint-disable etc/no-commented-out-code -->
<script setup lang="ts">
import { computed, ref } from 'vue'

const theme = ref('dark')
const isDark = computed(() => theme.value === 'dark')

function setTheme (value: string): void {
  // console.info('theme is now', value)
  theme.value = value
  if (typeof document !== 'undefined') document.documentElement.classList.toggle('dark', isDark.value)
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
    <dark-mode class="app-link" :theme="isDark ? 'outline' : 'filled'" :title="isDark ? 'Switch to sun mode' : 'Bring the night'" />
  </button>
</template>
