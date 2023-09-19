<template>
  <div class="app-layout flex min-h-screen w-full flex-col bg-gradient-to-br from-white to-accent-100 p-3 dark:from-primary-700 dark:to-primary-900">
    <div class="app-layout--bg relative flex grow bg-gradient-to-tl from-white to-accent-100 pt-12 dark:from-primary-700 dark:to-primary-900">
      <div class="app-layout--bg-texture absolute inset-0 z-0 bg-[url('/assets/textures/nnnoise.svg')] opacity-10"></div>
      <div class="app-layout--container prose relative z-10 mx-auto flex flex-col dark:prose-invert lg:prose-xl lg:min-w-[900px]">
        <nav-bar />
        <Content class="app-layout--content grow" />
        <footer-bar />
      </div>
    </div>
  </div>
</template>
