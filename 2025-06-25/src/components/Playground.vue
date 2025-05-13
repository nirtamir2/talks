<script setup lang="ts">
import { Sandpack } from 'sandpack-vue3'
import { ref } from 'vue'

const props = defineProps<{
  code: string
}>()

const files = ref({
  '/App.tsx': props.code,
  '/package.json': {
    hidden: true,
    code: JSON.stringify({
      dependencies: {
        'react-dom': '^19.0.0',
        'react-scripts': '^4.0.0',
        'react': '^19.0.0',
        '@react-three/drei': '^10.0.7',
        '@react-three/fiber': '^9.1.2',
        'three': '^0.176.0',
      },
      devDependencies: {
        '@types/react': '^19.0.0',
        '@types/react-dom': '^19.0.0',
        '@types/three': '^0.176.0',
        'typescript': '^4.0.0',
      },
      main: '/index.tsx',
    }),
  },
})
</script>

<template>
  <div class="" @keydown.stop @keyup.stop>
    <Sandpack
      :show-open-in-code-sandbox="false"
      theme="dark"
      template="react-ts"
      :files="files"
      :options="{
        editorHeight: 500, // default - 300
        editorWidthPercentage: 70, // default - 50
      }"
    />
    <!--    <SandpackProvider :files="files" theme="dark" template="react-ts" :options="{}"> -->
    <!--      <SandpackLayout style="height: 500px" > -->
    <!--        <SandpackCodeEditor  /> -->
    <!--        <SandpackPreview :show-open-in-code-sandbox="false" /> -->
    <!--      </SandpackLayout> -->
    <!--    </SandpackProvider> -->
  </div>
</template>
