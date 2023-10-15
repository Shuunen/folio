<script setup lang="ts">
import { useRoute } from 'vitepress'
import { computed } from 'vue'
import { $t, localePath } from '../utils/translate.utils'

defineProps<{
  pages: string[]
}>()

const actual = computed(() => {
  const page = useRoute().path.split('.')[0]?.slice(1)
  return page === '' ? 'index' : page
})
</script>

<template>
  <div>
    <!-- eslint-disable sonar/no-vue-bypass-sanitization -->
    <nav class="mb-12 md:mb-24">
      <div class="mx-auto">
        <div class="flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <a class="app-link relative -order-2 ml-8 flex shrink-0 flex-row items-center md:ml-0 md:mr-auto" href="/">
            <span class="absolute -left-9 text-3xl">▷&nbsp;</span>Romain.cloud
          </a>
          <div class="w-full md:hidden"></div>
          <a v-for="page, index in pages" :key="`entry-${index}`" class="app-link" :class="page === actual ? 'active' : ''" :href="localePath(page)">
            {{ $t(`pages.${page}`) }}
          </a>
          <dark-switch class="-order-1 ml-auto md:order-1 md:ml-0" />
        </div>
      </div>
    </nav>
  </div>
</template>

