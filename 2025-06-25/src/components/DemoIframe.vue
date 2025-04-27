<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  url: string
}>()

const demoBaseUrl = computed<string | undefined>(() => {
  const demoBaseUrl = import.meta.env.VITE_DEMO_BASE_URL
  if (!demoBaseUrl) {
    return undefined
  }
  return demoBaseUrl
})
</script>

<template>
  <iframe
      v-if="demoBaseUrl"
      height="100%"
      :src="`${demoBaseUrl}${props.url}`"
      width="100%"
  />
  <div v-else>
    demo base url is not set. Please set it in .env file.
  </div>
</template>

<style scoped>
</style>