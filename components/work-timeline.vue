<script setup lang="ts">
import { Airplay, ArrowLeft, BarCode, Basketball, CategoryManagement, Dollar, EnergySocket, FileQuestion, HospitalFour, Iphone, MessageEmoji, Palace, PhoneOne, ReadBook, Seedling, Shield, TagOne, Voice } from '@icon-park/vue-next'
import { pickOne, slugify } from 'shuutils'
import { ref } from 'vue'
import { cv } from '../data/cv'
import { logger } from '../utils/logger.utils'
import { $t } from '../utils/translate.utils'

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
  if (colorByTag[id] !== undefined) return colorByTag[id]
  const list = tailwindColors.filter(color => !Object.values(colorByTag).includes(color))
  colorByTag[id] = pickOne(list.length > 0 ? list : ['white'])
  return colorByTag[id]
}

function selectTag (tag: string) {
  selectedTag.value = selectedTag.value === tag ? '' : tag
}

// eslint-disable-next-line max-statements, complexity, sonarjs/cognitive-complexity
function iconForSector (sector: string) {
  if (sector === 'finance') return Dollar
  if (sector === 'energy') return EnergySocket
  if (sector === 'health') return HospitalFour
  if (sector === 'sport') return Basketball
  if (sector === 'savings-management') return CategoryManagement
  if (sector === 'matriculation') return BarCode
  if (sector === 'insurance') return Shield
  if (sector === 'environment') return Seedling
  if (sector === 'mobile') return Iphone
  if (sector === 'mobile-payment') return Iphone
  if (sector === 'telecoms') return PhoneOne
  if (sector === 'press') return ReadBook
  if (sector === 'retail') return TagOne
  if (sector === 'media') return Airplay
  if (sector === 'government') return Palace
  if (sector === 'ai') return MessageEmoji
  if (sector === 'voice') return Voice
  logger.warn(`No icon for sector ${sector}`)
  return FileQuestion
}
</script>

<template>
  <div class="not-prose flex flex-col items-center justify-center">
    <div class="app-date">{{ dateToMonthYear() }}</div>
    <template v-for="(work, index) in cv.work" :key="work.id">
      <div class="app-line" />
      <div class="grid w-full overflow-hidden rounded-lg shadow-2xl md:flex md:w-auto" :class="[index % 2 === 0 ? '' : 'flex-row-reverse text-right']"
        :data-id="work.id">
        <div class="flex h-[230px] flex-col justify-around overflow-hidden bg-gradient-to-tr from-primary-200 to-primary-400 md:w-[410px]">
          <photo-gallery :nb-to-show="1" :photos="work.photos" />
        </div>
        <div
          class="relative flex flex-col justify-center gap-2 from-white/70 p-7 dark:from-black/60 dark:to-black/20 md:w-[414px] md:gap-0.5 md:px-7 md:py-4"
          :class="[index % 2 === 0 ? 'bg-gradient-to-r' : 'bg-gradient-to-l']">
          <div class="group flex items-center gap-2 text-primary-400 dark:text-accent-300"
            :class="[index % 2 === 0 ? 'flex-row-reverse justify-end' : 'justify-end']">
            <span class="app-helper">{{ $t('work-timeline.business-sectors') }}</span>
            <ArrowLeft class="app-helper" :class="[index % 2 === 0 ? '' : 'rotate-180']" />
            <component :is="iconForSector(sector)" v-for="sector in work.sectors" :key="sector" class="m-1 cursor-help"
              :title="$t(`sectors.${sector}`)" />
          </div>
          <div class="group flex items-center gap-2 font-bold" :class="[index % 2 === 0 ? 'flex-row-reverse justify-end' : 'justify-end']">
            <span class="app-helper">{{ $t('work-timeline.compagnies') }}</span>
            <ArrowLeft class="app-helper" :class="[index % 2 === 0 ? '' : 'rotate-180']" />
            <div class="whitespace-nowrap">{{ work.company }}</div>
          </div>
          <div class="group flex items-center gap-2" :class="[index % 2 === 0 ? 'flex-row-reverse justify-end' : 'justify-end']">
            <span class="app-helper">{{ $t('work-timeline.position') }}</span>
            <ArrowLeft class="app-helper" :class="[index % 2 === 0 ? '' : 'rotate-180']" />
            <div class="whitespace-nowrap">{{ $t(`positions.${work.position}`) }}</div>
          </div>
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
@reference "tailwindcss";

.app-date {
  @apply text-3xl font-thin px-5 py-2 shadow-xl;
}
.app-line {
  @apply h-16 w-1 bg-white/50 dark:bg-black/50;
}
.app-tag {
  @apply px-2 py-1 text-xs font-bold border-current rounded border brightness-75 dark:brightness-125 dark:contrast-75 hover:filter dark:hover:brightness-125 hover:brightness-90;
}
.app-helper {
  @apply hidden md:block text-sm italic opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-4 transition-all duration-300 ease-in-out;
}
</style>
