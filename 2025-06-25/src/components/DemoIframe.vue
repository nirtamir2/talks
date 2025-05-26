<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  url: string;
}>();

const demoBaseUrl = computed<string | undefined>(() => {
  const demoBaseUrl = import.meta.env.VITE_DEMO_BASE_URL;
  if (!demoBaseUrl) {
    return;
  }
  return demoBaseUrl;
});
</script>

<template>
  <iframe
    v-if="demoBaseUrl"
    class="size-full"
    :src="`${demoBaseUrl}${props.url}`"
  />
  <div v-else>demo base url is not set. Please set it in .env file.</div>
</template>

<style scoped></style>
