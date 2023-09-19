<script setup lang="ts">
defineProps<{
  name: {
    required: true
    type: string
  }
}>()
</script>

<template>
  <!-- eslint-disable tailwindcss/no-custom-classname -->
  <div class="grid grid-cols-3">
    <div v-for="n in [900, 800, 700, 600, 500, 400, 300, 200, 100]" :key="`color-${n}`" class="flex h-16 flex-row items-center justify-center"
      :class="[`bg-${name}-${n}`, n > 400 ? 'text-white' : 'text-black']">
      {{ name }}-{{ n }}
    </div>
  </div>
</template>

