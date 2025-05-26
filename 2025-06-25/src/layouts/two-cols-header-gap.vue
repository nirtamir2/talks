<!--
  Usage:
```md
---
layout: two-cols-header-gap
---
This spans both
::left::
# Left
This shows on the left
::right::
# Right
This shows on the right
::bottom::
This shows at the bottom, aligned to the end (bottom) of the grid
```
<!-- https://github.com/slidevjs/slidev/blob/main/packages/client/layouts/two-cols-header.vue -->
-->

<script setup lang="ts">
const props = defineProps({
  class: {
    type: String,
  },
  layoutClass: {
    type: String,
  },
});
</script>

<template>
  <div
    class="slidev-layout two-cols-header-gap h-full w-full"
    :class="layoutClass"
  >
    <div class="col-header">
      <slot />
    </div>
    <div class="col-left" :class="props.class">
      <slot name="left" />
    </div>
    <div class="col-right" :class="props.class">
      <slot name="right" />
    </div>
    <div class="col-bottom" :class="props.class">
      <slot name="bottom" />
    </div>
  </div>
</template>

<style scoped>
.two-cols-header-gap {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: auto 1fr;
  gap: 2rem;
}

.col-header {
  grid-area: 1 / 1 / 2 / 3;
}
.col-left {
  grid-area: 2 / 1 / 3 / 2;
}
.col-right {
  grid-area: 2 / 2 / 3 / 3;
}
.col-bottom {
  align-self: end;
  grid-area: 3 / 1 / 3 / 3;
}
</style>
