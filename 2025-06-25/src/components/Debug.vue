<script setup lang="ts">
const props = defineProps<{
  data: unknown;
}>();
</script>

<template>
  <pre>{{ JSON.stringify(props.data, null, 2) }}</pre>
</template>
