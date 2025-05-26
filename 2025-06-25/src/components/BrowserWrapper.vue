<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    background?: string;
    maxHeight?: boolean;
  }>(),
  {
    background: "#ffffff",
    maxHeight: false,
  },
);
</script>

<template>
  <div class="browser-window" :class="{ '!h-120': props.maxHeight }">
    <div class="browser-header">
      <div class="browser-buttons">
        <div class="minimize-btn" />
        <div class="maximize-btn" />
        <div class="close-btn" />
      </div>
    </div>
    <div
      class="browser-content"
      :style="`background-color: ${props.background};`"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped>
/* Browser window */
.browser-window {
  @apply max-h-120 h-full w-full overflow-hidden rounded-md border border-gray-300 shadow-md;
}

/* Browser header */
.browser-header {
  @apply flex items-center justify-end bg-gray-800 p-2 text-white;
}

/* Browser control buttons (right aligned) */
.browser-buttons {
  @apply flex space-x-2;
}

.close-btn {
  @apply h-3 w-3 rounded-full bg-red-500;
}

.minimize-btn {
  @apply h-3 w-3 rounded-full bg-yellow-500;
}

.maximize-btn {
  @apply h-3 w-3 rounded-full bg-green-500;
}

/* Browser content with scrollable area */
.browser-content {
  @apply h-full max-h-full min-h-24 overflow-y-auto overflow-x-hidden text-gray-700;
}
</style>
