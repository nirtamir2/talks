<script setup lang="ts">
const props = defineProps<{
  data: unknown;
}>();
</script>

<template>
  <pre class="overflow-auto max-h-full">{{ JSON.stringify(props.data, null, 2) }}</pre>
</template>
