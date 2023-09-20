<script setup lang="ts">
import { useData } from 'vitepress'
const { frontmatter } = useData()
</script>

<template>
  <div class="app-layout flex min-h-screen w-full flex-col bg-gradient-to-br from-white to-accent-100 p-3 dark:from-primary-700 dark:to-primary-900">
    <div class="app-layout--bg relative flex grow bg-gradient-to-tl from-white to-accent-100 pt-12 dark:from-primary-700 dark:to-primary-900">
      <div class="app-layout--bg-texture absolute inset-0 z-0 bg-[url('/assets/textures/nnnoise.svg')] opacity-10"></div>
      <div class="prose relative z-10 mx-auto flex flex-col px-6 dark:prose-invert md:prose-lg lg:prose-xl lg:min-w-[900px]">
        <nav-bar />
        <div class="flex grow flex-col" :class="{ 'justify-center': frontmatter.verticallyCentered }">
          <pre v-if="frontmatter.debug">{{ frontmatter }}</pre>
          <Content />
          <div class="flex flex-col gap-6 md:flex-row">
            <push-button v-for="link in frontmatter.links" :key="link.label" class="w-fit" :text="link.label" :to="link.to" />
          </div>
        </div>
        <footer-bar />
      </div>
    </div>
  </div>
</template>
