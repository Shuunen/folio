<script setup lang="ts">
import { Copy } from '@icon-park/vue-next'
import { FwbTab as Tab, FwbTabs as Tabs, FwbToast as Toast } from 'flowbite-vue'
import { sleep } from 'shuutils'
import { ref, useSlots } from 'vue'

const slots = useSlots()
const list = slots.default?.() ?? []
const [first] = list
if (!first) throw new Error('You need to provide at least one child to this component')
// @ts-expect-error missing type definition
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, no-underscore-dangle, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
const name: string = first.type.__file?.match(/\/(?<name>[\w-]+)\.vue/iu)?.groups?.name ?? ''
const properties = first.props ?? {}

const activeTab = ref('first')
const isCopying = ref(false)
const showToast = ref(false)

async function copyCode () {
  isCopying.value = true
  showToast.value = true
  // eslint-disable-next-line sonarjs/no-nested-template-literals
  const code = `<${name} ${Object.keys(properties).map(property => `${property}="${properties[property]}"`).join(' ')} />`
  void navigator.clipboard.writeText(code)
  await sleep(200) // eslint-disable-line @typescript-eslint/no-magic-numbers
  isCopying.value = false
  await sleep(2000) // eslint-disable-line @typescript-eslint/no-magic-numbers
  showToast.value = false
}
</script>

<template>
  <div class="app-code-showcase not-prose">
    <Toast class="fixed bottom-5 right-5 transition-all duration-200" :class="[showToast ? 'translate-y-0 opacity-100' : 'translate-x-52 opacity-0']"
      type="success">
      Code copied to clipboard !
    </Toast>
    <Tabs v-model="activeTab" class="pt-5" variant="underline"> <!-- class appends to content DIV for all tabs -->
      <Tab name="first" title="Render">
        <slot />
      </Tab>
      <Tab name="second" title="Code">
        <pre class="relative flex overflow-auto rounded-lg px-5 py-4 transition-colors duration-300"
          :class="{ 'bg-slate-700': isCopying, 'bg-slate-900': !isCopying }"><button class="absolute right-5 top-5 text-2xl text-slate-300 transition-transform duration-200 hover:text-slate-50" :class="{ 'scale-75': isCopying, 'hover:scale-110': !isCopying }" type="button" @click="copyCode"><Copy theme="outline" /></button>&lt;<span class="text-green-300">{{ name }}</span> <div v-for="prop in Object.keys(properties)" :key="prop"><span class="ml-3 text-purple-300">{{ prop }}</span>="<span class="text-blue-300">{{ properties[prop] }}</span>"</div> /&gt;</pre>
      </Tab>
    </Tabs>
  </div>
</template>

<!-- eslint-disable-next-line vue-scoped-css/enforce-style-type, vue/enforce-style-attribute -->
<style>
.app-code-showcase + .app-code-showcase {
  @apply mt-10;
}
</style>
