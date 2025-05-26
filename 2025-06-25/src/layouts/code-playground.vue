<script setup lang="ts">
import { useSlideContext } from '@slidev/client'

const { $frontmatter } = useSlideContext()

</script>
<template>
  <Playground :code="$frontmatter.code" />
  <slot></slot>
</template>