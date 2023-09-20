<script setup lang="ts">
import { sleep } from 'shuutils'
import { ref, useSlots } from 'vue'

const slots = useSlots()
const list = slots.default?.() ?? []
const [first] = list
if (!first) throw new Error('You need to provide at least one child to this component')
// @ts-expect-error missing type definition
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, no-underscore-dangle
const name: string = first.type.__name
const properties = first.props ?? {}

const isCopying = ref(false)

async function copyCode () {
  isCopying.value = true
  // eslint-disable-next-line sonarjs/no-nested-template-literals
  const code = `<${name} ${Object.keys(properties).map(property => `${property}="${properties[property]}"`).join(' ')} />`
  void navigator.clipboard.writeText(code)
  await sleep(300) // eslint-disable-line @typescript-eslint/no-magic-numbers
  isCopying.value = false
}
</script>

<template>
  <div>
    <pre class="relative flex transition-colors duration-300"
      :class="{ 'bg-slate-700': isCopying }"><button class="absolute right-5 top-4 text-2xl text-slate-300 hover:text-slate-50" type="button" @click="copyCode"><icon-copy  theme="outline" /></button>&lt;<span class="text-green-300">{{ name }}</span> <div v-for="prop in Object.keys(properties)" :key="prop"><span class="ml-3 text-purple-300">{{ prop }}</span>="<span class="text-blue-300">{{ properties[prop] }}</span>"</div> /&gt;</pre>
    <slot />
  </div>
</template>

