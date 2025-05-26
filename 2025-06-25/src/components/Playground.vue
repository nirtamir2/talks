<script setup lang="ts">
import {
  SandpackCodeEditor,
  SandpackPreview,
  SandpackProvider,
} from "sandpack-vue3";
import { computed, ref } from "vue";
import { Panel, PanelGroup, PanelResizeHandle } from "vue-resizable-panels";

const props = defineProps<{
  code: string | Array<string>;
}>();

const index = ref(0);
const currentCode = computed(() =>
  Array.isArray(props.code) ? props.code[index.value] : props.code,
);
const files = ref({
  "/App.tsx": currentCode,

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
});

function handleGoNext() {
  index.value = (index.value + 1) % props.code.length;
}

function handleGoBack() {
  index.value = Math.max((index.value - 1) % props.code.length, 0);
}
</script>

<template>
  <div
    v-if="Array.isArray(props.code) && props.code.length > 1"
    class="mb-4 flex items-center justify-center gap-2"
  >
    <button
      class="flex size-5 items-center justify-center rounded-full border"
      @click="handleGoBack"
    >
      -
    </button>
    {{ index + 1 }} / {{ props.code.length }}
    <button
      class="flex size-5 items-center justify-center rounded-full border"
      @click="handleGoNext"
    >
      +
    </button>
  </div>
  <div class="" @keydown.stop @keyup.stop>
    <SandpackProvider template="react-ts" :files="files">
      <PanelGroup direction="horizontal">
        <Panel :default-size="20">
          <SandpackCodeEditor />
        </Panel>
        <PanelResizeHandle />
        <Panel :default-size="20">
          <SandpackPreview :show-open-in-code-sandbox="false" />
        </Panel>
      </PanelGroup>
    </SandpackProvider>
    <!--    <SandpackProvider :files="files" theme="dark" template="react-ts" :options="{}"> -->
    <!--      <SandpackLayout style="height: 500px" > -->
    <!--        <SandpackCodeEditor  /> -->
    <!--        <SandpackPreview :show-open-in-code-sandbox="false" /> -->
    <!--      </SandpackLayout> -->
    <!--    </SandpackProvider> -->
  </div>
</template>
