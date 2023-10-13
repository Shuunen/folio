<script setup lang="ts">
import { pickOne, slugify } from 'shuutils'
import { ref } from 'vue'
import { cv } from '../data/cv'

const tailwindColors = ['text-blue-400', 'text-cyan-300', 'text-cyan-500', 'text-emerald-300', 'text-emerald-500', 'text-fuchsia-300', 'text-green-300', 'text-green-500', 'text-indigo-400', 'text-lime-300', 'text-lime-600', 'text-orange-300', 'text-orange-400', 'text-pink-400', 'text-purple-400', 'text-purple-500', 'text-red-400', 'text-sky-300', 'text-sky-600', 'text-teal-300', 'text-teal-500', 'text-yellow-300', 'text-yellow-400']
const colorByTag: Record<string, string> = {}
const selectedTag = ref('')

function dateToMonthYear (input?: string) {
  const date = input === undefined ? new Date() : new Date(input)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

function getColorForTag (tag: string) {
  const id = slugify(tag.replace(/\s/gu, ''))
  if (selectedTag.value !== '' && selectedTag.value !== tag) return 'text-gray-400 opacity-50'
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (colorByTag[id] === undefined) colorByTag[id] = pickOne(tailwindColors.filter(color => !Object.values(colorByTag).includes(color))) ?? 'white'
  return colorByTag[id]
}

function selectTag (tag: string) {
  selectedTag.value = selectedTag.value === tag ? '' : tag
}
</script>

<template>
  <div class="not-prose flex flex-col items-center justify-center">
    <div class="app-date">{{ dateToMonthYear() }}</div>
    <template v-for="(work, index) in cv.work" :key="work.id">
      <div class="app-line" />
      <div class="flex overflow-hidden rounded-lg shadow-2xl" :class="[index % 2 === 0 ? '' : 'flex-row-reverse text-right']" :data-id="work.id">
        <div class="flex h-[230px] w-[410px] flex-col justify-around overflow-hidden bg-gradient-to-tr from-primary-200 to-primary-400">
          <photo-gallery :nb-to-show="1" :photos="work.photos" />
        </div>
        <div class="flex w-[414px] flex-col justify-center  bg-white/50 px-7 py-4 dark:bg-black/50">
          <div class="font-bold" title="Compagnies">{{ work.company }}</div>
          <div title="Position">{{ work.position }}</div>
          <div class="mt-3 flex flex-wrap gap-x-4 gap-y-2" :class="[index % 2 === 0 ? '' : 'justify-end']">
            <button v-for="tag in work.keywords" :key="tag" class="app-tag" :class="getColorForTag(tag)" type="button" @click="() => selectTag(tag)"
              @keypress="() => selectTag(tag)">{{ tag }}</button>
          </div>
        </div>
      </div>
      <div class="app-line" />
      <div class="app-date">{{ dateToMonthYear(work.startDate) }}</div>
    </template>
  </div>
</template>

<style scoped>
.app-date {
  @apply text-2xl font-thin px-5 py-2 shadow-xl;
}
.app-line {
  @apply h-16 w-1 bg-white/50 dark:bg-black/50;
}
.app-tag {
  @apply px-2 py-1 text-xs font-bold border-current rounded border brightness-75 dark:brightness-125 dark:contrast-75 hover:filter dark:hover:brightness-125 hover:brightness-90;
}
</style>
