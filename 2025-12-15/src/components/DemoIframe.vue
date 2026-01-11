<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  url: string;
}>();

const finalUrl = computed<string | undefined>(() => {
  if (props.url.startsWith("http")) {
    return props.url;
  }
  const demoBaseUrl = import.meta.env.VITE_DEMO_BASE_URL;
  if (!demoBaseUrl) {
    return;
  }

  return `${demoBaseUrl}${props.url}`;
});
</script>

<template>
  <iframe v-if="finalUrl" class="size-full" :src="finalUrl" />
  <div v-else>demo base url is not set. Please set it in .env file.</div>
</template>

<style scoped></style>
