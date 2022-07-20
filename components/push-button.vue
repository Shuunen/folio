<template>
  <a :href="to"
     class="button button--winona hover:bg-accent-600 dark:hover:bg-accent-400 focus:outline-none bg-accent-500 dark:bg-accent-300 dark:text-primary-800 relative block p-0 overflow-hidden text-sm font-semibold tracking-widest text-center text-white no-underline uppercase align-middle border-2 border-current border-solid rounded-lg cursor-pointer"
     :data-text="text">
    <span class="block align-middle">
      {{ text }}
    </span>
  </a>
</template>

<script lang="ts">
import { defineComponent } from 'vue'


export default defineComponent({
  props: {
    text: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
  },
})
</script>


<style>
/* Winona button from https://codepen.io/michealjroberts/pen/ExjYKXL credits to Michael Roberts
 */
.button--winona {
  transition: border-color 0.3s, background-color 0.3s;
  transition-timing-function: cubic-bezier(0.2, 1, 0.3, 1);
}

.button--winona::after {
  content: attr(data-text);
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
  transform: translate3d(0, 25%, 0);
}

.button--winona::after,
.button--winona>span {
  padding: 1em 2em;
  transition: transform 0.3s, opacity 0.3s;
  transition-timing-function: cubic-bezier(0.2, 1, 0.3, 1);
}

.button--winona:hover::after {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}

.button--winona:hover>span {
  opacity: 0;
  transform: translate3d(0, -25%, 0);
}
</style>
