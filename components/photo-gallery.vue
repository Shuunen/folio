<script setup lang="ts">
import lightGallery from 'lightgallery'
import { onMounted, ref } from 'vue'

interface Image {
  label: string
  src: string
  size: string
  thumb: string
}

defineProps<{
  images: Image[]
}>()

const wrapper = ref<HTMLElement>()

function initLightGallery (): void {
  if (!wrapper.value) throw new Error('no wrapper found for lightgallery')
  lightGallery(wrapper.value, {
    thumbnail: true, // eslint-disable-line @typescript-eslint/naming-convention
    licenseKey: 'B71019E7-24F2485D-9D04849F-4F8C909F',
  })
}

function guessThumb (source: string): string {
  // eslint-disable-next-line regexp/no-super-linear-move
  return source.replace(/(?<name>.+)\.(?=(?:gif|jpg|png)$)/u, '$<name>-thumb.')
}

onMounted(initLightGallery)
</script>

<template>
  <div ref="wrapper" class="app-photo-gallery not-prose flex flex-wrap gap-4">
    <a v-for="{ label, src, size, thumb }, index in images" :key="`photo-${index}`" :href="src" :data-lg-size="size">
      <img :alt="label" :src="thumb ?? guessThumb(src)" class="h-60" />
    </a>
  </div>
</template>

<!-- eslint-disable-next-line vue-scoped-css/enforce-style-type -->
<style>
@import url("lightgallery/css/lightgallery.css");
@import url("lightgallery/css/lg-thumbnail.css");
@import url("lightgallery/css/lg-zoom.css");
@import url("lightgallery/css/lg-video.css");
</style>
