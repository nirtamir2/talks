<script setup lang="ts">
import {   SandpackProvider,
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
    <SandpackProvider theme="dark" template="react-ts" :files="files" >
        <SandpackLayout :height="1500" >
          <SandpackCodeEditor />
          <SandpackPreview :showOpenInCodeSandbox="false" />
    </SandpackLayout>
  </SandpackProvider>
    </div>
</template>