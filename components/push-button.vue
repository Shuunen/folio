<script setup lang="ts">
import { localePath } from '../utils/translate.utils'

defineProps<{
  text: string
  to?: string
}>()
</script>

<template>
  <!-- eslint-disable sonar/no-vue-bypass-sanitization -->
  <a class="app-button relative block cursor-pointer overflow-hidden rounded-lg border-2 border-solid border-current bg-accent-500 p-0 text-center align-middle text-sm font-semibold uppercase tracking-widest text-white no-underline hover:bg-accent-600 focus:outline-none dark:bg-accent-300 dark:text-primary-800 dark:hover:bg-accent-400"
    :data-text="text" :href="to?.includes('://') ? to : localePath(to ?? '')" rel="noopener noreferrer"
    :target="to?.includes('://') ? '_blank' : '_self'">
    <span class="block align-middle">
      {{ text }}
    </span>
  </a>
</template>

<style scoped>
/* Winona button from https://codepen.io/michealjroberts/pen/ExjYKXL credits to Michael Roberts */

.app-button {
  transition: border-color 0.3s, background-color 0.3s;
  transition-timing-function: cubic-bezier(0.2, 1, 0.3, 1);
}

.app-button::after {
  content: attr(data-text);
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
  transform: translate3d(0, 25%, 0);
}

.app-button::after,
.app-button>span {
  padding: 1em 2em;
  transition: transform 0.3s, opacity 0.3s;
  transition-timing-function: cubic-bezier(0.2, 1, 0.3, 1);
}

.app-button:hover::after {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}

.app-button:hover>span {
  opacity: 0;
  transform: translate3d(0, -25%, 0);
}
</style>
