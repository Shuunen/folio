<script setup lang="ts">
import { useRoute } from 'vitepress'
import { computed } from 'vue'
import { getPage } from '../utils/browser.utils'
import { $t, localePath } from '../utils/translate.utils'

defineProps<{
  pages: string[]
}>()

const actual = computed(() => getPage(useRoute().path))
</script>

<template>
  <div>
    <!-- eslint-disable sonar/no-vue-bypass-sanitization -->
    <nav class="mb-12 md:mb-24">
      <div class="mx-auto">
        <div class="flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <a class="app-link relative ml-10 mr-auto flex shrink-0 flex-row items-center md:ml-0" :href="localePath('')">
            <span class="absolute -left-9 text-3xl">▷&nbsp;</span>
            <span class="hidden sm:block">Romain.cloud</span>
          </a>
          <a v-for="page, index in pages" :key="`entry-${index}`" class="app-link"
            :class="[page === actual ? 'app-link--active' : '', `app-link--${page}`]" :href="localePath(page)">
            {{ $t(`pages.${page}`) }}
          </a>
          <dark-switch />
        </div>
      </div>
    </nav>
  </div>
</template>

<style scoped>
@media (max-width: 400px) {
  .app-link--index {
    @apply hidden;
  }
}
</style>

