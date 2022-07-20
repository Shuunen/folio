<template>
  <div class="photo-gallery not-prose flex flex-wrap gap-4">
    <a
      v-for="{ label, src, size, thumb }, index in images"
      :key="'photo-' + index"
      :href="src"
      :data-lg-size="size"
    >
      <img :alt="label" :src="thumb ?? guessThumb(src)" class="h-60" />
    </a>
  </div>
</template>

<script lang="ts">
import lightGallery from 'lightgallery'
import lgThumbnail from 'lightgallery/plugins/thumbnail'
import lgVideo from 'lightgallery/plugins/video'
import lgZoom from 'lightgallery/plugins/zoom'
import { defineComponent } from 'vue'

interface Image {
  label: string
  src: string
  size: string
  thumb: string
}

export default defineComponent({
  props: {
    images: {
      type: Array as () => Image[],
      required: true,
    },
  },
  mounted () {
    this.initLightGallery()
  },
  methods: {
    initLightGallery () {
      lightGallery(this.$el, {
        plugins: [lgZoom, lgThumbnail, lgVideo],
        thumbnail: true,
        licenseKey: 'B71019E7-24F2485D-9D04849F-4F8C909F',
      })
    },
    guessThumb (source: string) {
      return source.replace(/(.+)\.(jpg|gif|png)$/, '$1-thumb.$2')
    },
  },
})
</script>

<style>
@import url("lightgallery/css/lightgallery.css");
@import url("lightgallery/css/lg-thumbnail.css");
@import url("lightgallery/css/lg-zoom.css");
@import url("lightgallery/css/lg-video.css");
</style>
