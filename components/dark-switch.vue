<!-- eslint-disable no-console -->
<!-- eslint-disable vue/no-ref-object-destructure -->
<!-- eslint-disable etc/no-commented-out-code -->
<script setup lang="ts">
import { DarkMode } from '@icon-park/vue-next'
import { computed, ref } from 'vue'
import { isBrowser } from '../utils/browser.utils'
import { state } from '../utils/state.utils'
import { $t } from '../utils/translate.utils'

const theme = ref(state.theme)
const isDark = computed(() => theme.value === 'dark')

function setTheme (value: string) {
  theme.value = value
  state.theme = value
  if (isBrowser) document.documentElement.classList.toggle('dark', isDark.value)
}

function doSwitch () {
  setTheme(isDark.value ? 'light' : 'dark')
}

setTheme(state.theme)
</script>

<template>
  <button type="button" @click="doSwitch">
    <DarkMode class="app-link text-2xl" :theme="isDark ? 'outline' : 'filled'"
      :title="isDark ? $t('general.use-light-theme') : $t('general.use-dark-theme')" />
  </button>
</template>
