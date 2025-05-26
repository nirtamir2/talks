<script setup lang="ts">
import { useSandpack } from "sandpack-vue3";
const { sandpack } = useSandpack()

</script>
<template>
    <div >{{ sandpack.visibleFiles }}</div>
    <pre>{{ sandpack.files[sandpack.activeFile].code }}</pre>
</template>