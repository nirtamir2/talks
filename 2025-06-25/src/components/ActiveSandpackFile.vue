<script setup lang="ts">
import { useSandpack } from "sandpack-vue3";
import { computed } from "vue";

const props = defineProps<{
  index: number;
}>();
const { sandpack } = useSandpack();
// Same like in setup preparser.ts
const slotName = computed(() => {
  const activeFileName = sandpack.activeFile
    .replaceAll(".", "_")
    .replace("/", "");
  return `index_${props.index}_filename_${activeFileName}`;
});
</script>
<template>
  <div class="flex w-full appearance-none flex-wrap gap-2 pb-4">
    <template v-for="visibleFile in sandpack.visibleFiles" :key="visibleFile">
      <button
        class="appearance-none p-2"
        :class="[visibleFile === sandpack.activeFile && 'border-b']"
        @click="sandpack.setActiveFile(visibleFile)"
      >
        {{ visibleFile.replace("/", "") }}
      </button>
    </template>
  </div>

  <slot :name="slotName" />
  <pre class="shiki shiki-themes vitesse-dark vitesse-light slidev-code h-full overflow-auto"><code>{{
    sandpack.files[sandpack.activeFile].code }}</code></pre>
</template>
