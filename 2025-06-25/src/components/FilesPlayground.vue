<script setup lang="ts">
import type { SandpackProps } from "sandpack-vue3";
import {
  SandpackCodeEditor,
  SandpackPreview,
  SandpackProvider,
  defaultDark,
} from "sandpack-vue3";
import { computed, ref } from "vue";
import { Panel, PanelGroup, PanelResizeHandle } from "vue-resizable-panels";
import ActiveSandpackFile from "./ActiveSandpackFile.vue";

const props = defineProps<{
  files: Array<SandpackProps["files"]>;
}>();

const index = ref(0);

const isEditMode = ref(true);

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

function handleGoNext() {
  index.value = (index.value + 1) % props.files.length;
}

function handleGoBack() {
  index.value = Math.max((index.value - 1) % props.files.length, 0);
}

function handleToggleEditMode() {
  isEditMode.value = !isEditMode.value;
}
</script>

<template>
  <div
    v-if="props.files.length > 1"
    class="absolute left-0 top-0 z-10 flex w-full items-center justify-center"
  >
    <div
      class="rounded-t-2 flex items-center justify-center gap-2 px-2 py-1 text-xs"
    >
      <button
        class="flex size-4 items-center justify-center rounded-full border"
        @click="handleGoBack"
      >
        -
      </button>
      {{ index + 1 }} / {{ props.files.length }}
      <button
        class="flex size-4 items-center justify-center rounded-full border"
        @click="handleGoNext"
      >
        +
      </button>
      <button
        class="flex size-4 items-center justify-center rounded-full border"
        @click="handleToggleEditMode"
      >
        {{ isEditMode ? "V" : "E" }}
      </button>
    </div>
  </div>
  <div class="flex size-full" @keydown.stop @keyup.stop>
    <SandpackProvider :theme="defaultDark" template="react-ts" :files="files">
      <PanelGroup direction="horizontal" class="flex size-full">
        <Panel :default-size="70" class="h-full">
          <SandpackCodeEditor v-if="isEditMode" class="h-full" />
          <ActiveSandpackFile v-else :index="index" class="h-full">
            <template v-for="(_, name) in $slots" :key="name" #[name]>
              <slot :name="name" />
            </template>
          </ActiveSandpackFile>
        </Panel>
        <PanelResizeHandle class="w-1" />
        <Panel :default-size="30" class="h-full">
          <SandpackPreview :show-open-in-code-sandbox="false" class="h-full">
          </SandpackPreview>
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

<style global>
.sp-wrapper {
  width: 100%;
}
</style>
