<script setup lang="ts">
import {   SandpackProvider,Sandpack,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,  } from 'sandpack-vue3';
import { ref } from 'vue'

const props = defineProps<{
    code: string
}>()

const files = ref({
        "/App.tsx": props.code,
        "/package.json": {
            hidden: true,
            code: JSON.stringify({
        dependencies: {
          "react-dom": "^19.0.0",
          "react-scripts": "^4.0.0",
          react: "^19.0.0",
         "@react-three/drei": "^10.0.7",
         "@react-three/fiber": "^9.1.2",
         "three": "^0.176.0",
        },
        devDependencies: {
          "@types/react": "^19.0.0",
          "@types/react-dom": "^19.0.0",         
          "@types/three": "^0.176.0",
          typescript: "^4.0.0",
        },
        main: "/index.tsx",
    }
      )
        },
  },  
);



</script>

<template>
    <div @keydown.stop @keyup.stop class="">
        <Sandpack :showOpenInCodeSandbox="false" theme="dark" template="react-ts" :files="files" :options="{
          editorHeight: 500, // default - 300
          editorWidthPercentage: 70, // default - 50
    }"  />
    <!-- <SandpackProvider  >
        <SandpackLayout >
          <SandpackCodeEditor />
          <SandpackPreview :showOpenInCodeSandbox="false" />
    </SandpackLayout>
  </SandpackProvider> -->
    </div>
</template>

<style>
.dark {
    /* --sp-layout-height: 500px; */
}
</style>   