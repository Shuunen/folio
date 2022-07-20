<template>
  <div class="layout bg-gradient-to-br from-white to-accent-100 dark:from-primary-700 dark:to-primary-900 flex flex-col w-full min-h-screen p-3">
    <div class="layout--bg bg-gradient-to-tl from-white to-accent-100 dark:from-primary-700 dark:to-primary-900 relative flex flex-grow pt-12">
      <div class="layout--bg-texture bg-[url('/assets/textures/nnnoise.svg')] opacity-10 absolute inset-0 z-0"></div>
      <div class="layout--container flex flex-col lg:min-w-[900px] lg:prose-xl dark:prose-invert relative z-10 mx-auto prose">
        <nav-bar />
        <Content class="layout--content flex-grow" />
        <footer-bar />
      </div>
    </div>
  </div>
</template>
