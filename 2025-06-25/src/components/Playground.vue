<script setup lang="ts">
import type { SandpackProps } from "sandpack-vue3";
import { SandpackPreview, SandpackProvider, defaultDark } from "sandpack-vue3";
import { computed, ref } from "vue";

const props = defineProps<{
  files: Array<SandpackProps["files"]>;
}>();

const index = ref(0);

const currentFiles = computed(() => props.files[index.value]);

const files = computed(() => ({
  ...currentFiles.value,
  "/index.tsx": {
    code: `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

import App from "./App";
import React from "react";

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);`,
    hidden: true,
  },
  "/styles.css": {
    code: `body {
  margin: 0;
  padding: 0;
  }

  #root {
    width: 100vw;
    height: 100vh;
  }
  
  `,
    hidden: true,
  },
  "/package.json": {
    hidden: true,
    code: JSON.stringify({
      dependencies: {
        "react-dom": "^19.0.0",
        "react-scripts": "^4.0.0",
        react: "^19.0.0",
        "@react-three/drei": "^10.0.7",
        "@react-three/fiber": "^9.1.2",
        "@react-three/rapier": "^2.1.0",
        three: "^0.176.0",
      },
      devDependencies: {
        "@types/react": "^19.0.0",
        "@types/react-dom": "^19.0.0",
        "@types/three": "^0.176.0",
        typescript: "^4.0.0",
      },
      main: "/index.tsx",
    }),
  },
}));
</script>

<template>
  <div class="flex size-full" @keydown.stop @keyup.stop>
    <SandpackProvider :theme="defaultDark" template="react-ts" :files="files">
      <SandpackPreview :show-open-in-code-sandbox="false" class="h-full">
      </SandpackPreview>
    </SandpackProvider>
  </div>
</template>

<style global>
.sp-wrapper {
  width: 100%;
}
</style>
