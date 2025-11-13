<script setup lang="ts">
import { createHighlighter } from 'shiki';
import { computed } from "vue";

const props = defineProps<{
  code: string;
}>();

// `createHighlighter` is async, it initializes the internal and
// loads the themes and languages specified.
const highlighter = await createHighlighter({
  themes: ['vitesse-dark'],
  langs: ['typescript', "tsx"],
})

const code = computed(() => highlighter.codeToHtml(props.code, {
  lang: "tsx",
  theme: 'vitesse-dark'
}))

</script>
<template>
  <div v-html="code"></div>
</template>
