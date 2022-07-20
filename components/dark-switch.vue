<template>
  <button @click="doSwitch()">
    <dark-mode class="link" :title="isDark ? 'Switch to sun mode' : 'Bring the night'" :theme="isDark ? 'outline' : 'filled'" />
  </button>
</template>


<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  data: () => ({
    isDark: typeof localStorage === 'undefined' || localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches),
  }),
  mounted () {
    this.applyState()
  },
  methods: {
    applyState () {
      if (typeof localStorage !== 'undefined') localStorage.setItem('color-theme', this.isDark ? 'dark' : 'light')
      document.documentElement.classList.toggle('dark', this.isDark)
    },
    doSwitch () {
      this.isDark = !this.isDark
      this.applyState()
    },
  },
})
</script>
