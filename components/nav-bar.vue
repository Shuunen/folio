<script setup lang="ts">
import { ref } from 'vue'
import { $t, localePath } from '../utils/translate.utils'

defineProps<{
  pages: string[]
}>()

const opened = ref(false)

function toggle () {
  opened.value = !opened.value
}
</script>

<template>
  <div>
    <!-- eslint-disable sonar/no-vue-bypass-sanitization -->
    <nav class="mb-24">
      <div class="mx-auto">
        <div class="flex h-16 items-center justify-between">
          <div class="flex w-full items-center justify-between">
            <a class="app-link relative ml-8 flex shrink-0 flex-row items-center md:ml-0" href="/">
              <span class="absolute -left-9 text-3xl">▷&nbsp;</span>Romain.cloud
            </a>
            <div class="hidden md:block">
              <div class="ml-10 flex space-x-4">
                <a v-for="page, index in pages" :key="`entry-${index}`" class="app-link" :href="localePath(page)">
                  {{ $t(`pages.${page}`) }}
                </a>
                <dark-switch />
              </div>
            </div>
          </div>
          <div class="block">
            <div class="ml-4 flex items-center md:ml-6"></div>
          </div>
          <div class="-mr-2 flex md:hidden">
            <button type="button">
              <icon-hamburger size="32" theme="outline" @click="toggle" />
            </button>
          </div>
        </div>
      </div>
      <div class="md:hidden">
        <div class="flex flex-col gap-4 text-right sm:px-3">
          <a v-for="page, index in pages" :key="`entry-${index}`" class="app-link" :href="localePath(page)">
            {{ $t(`pages.${page}`) }}
          </a>
        </div>
      </div>
    </nav>
  </div>
</template>

