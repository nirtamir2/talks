<script setup lang="ts">
import { useSandpack } from "sandpack-vue3";

const { sandpack } = useSandpack();
</script>
<template>
  <div class="flex w-full appearance-none flex-wrap gap-2 pb-4">
    <template
      v-if="sandpack.visibleFiles.length > 1"
      v-for="visibleFile in sandpack.visibleFiles"
    >
      <button
        :class="[
          'appearance-none p-2',
          visibleFile === sandpack.activeFile && 'border-b',
        ]"
        @click="sandpack.setActiveFile(visibleFile)"
      >
        {{ visibleFile }}
      </button>
    </template>
  </div>
  <pre
    class="shiki shiki-themes vitesse-dark vitesse-light slidev-code h-full overflow-auto"
  ><code>{{
        sandpack.files[sandpack.activeFile].code }}</code></pre>
</template>
