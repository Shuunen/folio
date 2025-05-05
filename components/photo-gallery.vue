<script setup lang="ts">
import lightGallery from 'lightgallery'
import lgThumbnail from 'lightgallery/plugins/thumbnail'
import lgZoom from 'lightgallery/plugins/zoom'
import { onMounted, ref } from 'vue'
import type { Photo } from '../data/types'

defineProps<{
  nbToShow?: number
  photos: Readonly<Photo[]>
}>()

const wrapper = ref<HTMLElement>()

function initLightGallery () {
  if (!wrapper.value) throw new Error('no wrapper found for lightgallery')
  lightGallery(wrapper.value, {
    plugins: [lgZoom, lgThumbnail],
    mode: 'lg-fade', // https://www.lightgalleryjs.com/demos/transitions/
    thumbnail: true, // eslint-disable-line @typescript-eslint/naming-convention
    licenseKey: 'B71019E7-24F2485D-9D04849F-4F8C909F',
  })
}

function guessThumb (source: string) {
  // eslint-disable-next-line regexp/no-super-linear-move
  return handlePublicScheme(source).replace(/(?<name>.+)\.(?=(?:gif|jpg|png)$)/u, '$<name>-thumb.')
}

function handlePublicScheme (source = '') {
  return source.replace(/^public:\//u, '/')
}

onMounted(initLightGallery)
</script>

<template>
  <div ref="wrapper" class="app-photo-gallery not-prose flex flex-wrap gap-4">
    <!-- eslint-disable sonar/no-vue-bypass-sanitization -->
    <a v-for="{ label, src, size, thumb }, index in photos" :key="`photo-${index}`" class="overflow-hidden w-full"
      :class="[nbToShow && nbToShow <= index ? 'hidden' : '']" :data-lg-size="size" :href="handlePublicScheme(src)">
      <img :alt="label" class="w-full h-60 object-cover object-top transition-transform duration-1000 hover:scale-110"
        :src="handlePublicScheme(thumb) ?? guessThumb(src)" />
    </a>
  </div>
</template>

<!-- eslint-disable-next-line vue-scoped-css/enforce-style-type, vue/enforce-style-attribute -->
<style>
@import url("lightgallery/css/lightgallery.css");
@import url("lightgallery/css/lg-thumbnail.css");
@import url("lightgallery/css/lg-zoom.css");
@import url("lightgallery/css/lg-video.css");
</style>
