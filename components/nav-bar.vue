<template>
  <div>
    <nav class="mb-24">
      <div class="mx-auto">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center justify-between w-full">
            <a class="link relative flex flex-row flex-shrink-0" href="/">
              <span class="-left-9 absolute text-3xl">▷&nbsp;</span>Romain.cloud
            </a>
            <div class="md:block hidden">
              <div class="flex ml-10 space-x-4">
                <a v-for="entry, index in entries" :key="'entry-' + index" class="link" :href="`/${entry.url ?? entry.label.toLowerCase()}`">
                  {{ entry.label }}
                </a>
                <dark-switch />
              </div>
            </div>
          </div>
          <div class="block">
            <div class="md:ml-6 flex items-center ml-4"></div>
          </div>
          <div class="md:hidden flex -mr-2">
            <button>
              <hamburger-button size="32" theme="outline" @click="opened = !opened" />
            </button>
          </div>
        </div>
      </div>
      <div class="md:hidden">
        <div class="sm:px-3 flex flex-col gap-4 text-right">
          <a v-for="entry, index in entries" :key="'entry-' + index" class="link" :href="`/${entry.url ?? entry.label.toLowerCase()}`">
            {{ entry.label }}
          </a>
        </div>
      </div>
    </nav>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

interface Entry {
  label: string
  url?: string
}

export default defineComponent({
  data: () => ({
    entries: [] as Entry[], // [{ label: 'About' }, { label: 'Work' }, { label: 'Contact' }] as Entry[],
    opened: false,
  }),
})
</script>
