<script setup lang="ts">
const props = defineProps<{
  data: unknown;
}>();
</script>

<template>
  <pre class="max-h-full overflow-auto">{{
    JSON.stringify(props.data, null, 2)
  }}</pre>
</template>
