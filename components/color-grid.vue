<template>
  <div class="grid grid-cols-3">
    <div v-for="n in [900, 800, 700, 600, 500, 400, 300, 200, 100]" :key="'color-' + n" class="flex flex-row items-center justify-center h-16"
         :class="[`bg-${name}-${n}`, n > 400 ? 'text-white' : 'text-black']">
      {{ name }}-{{ n }}
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    name: {
      type: String,
      required: true,
    },
  },
})
</script>
