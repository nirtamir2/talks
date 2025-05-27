<script setup lang="ts">
import { useSandpack } from "sandpack-vue3";
import { computed } from "vue";

const { sandpack } = useSandpack();
const props = defineProps<{
  index: number;
}>();

const slotName = computed(() => {
  return `index_${props.index}_filename_${sandpack.activeFile.replaceAll(".", "_").replace("/", "")}`;
});
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
        {{ visibleFile.replace("/", "") }}
      </button>
    </template>
  </div>
  <slot :name="slotName" />

  <!-- <pre
    class="shiki shiki-themes vitesse-dark vitesse-light slidev-code h-full overflow-auto"
  ><code>{{
        sandpack.files[sandpack.activeFile].code }}</code></pre> -->
</template>
