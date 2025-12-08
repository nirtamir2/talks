import { Suspense, useState } from "react";
import type { SandpackProps } from "@codesandbox/sandpack-react";
import {
  SandpackCodeEditor,
  SandpackPreview,
  SandpackProvider,
  useSandpack,
} from "@codesandbox/sandpack-react";
import clsx from "clsx";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { createHighlighter } from "shiki";

export default function FilesPreview(props: {
  files: Array<SandpackProps["files"]>;
}) {
  const [index, setIndex] = useState(0);
  const [isEditMode, setIsEditMode] = useState(true);
  const currentFiles = props.files[index];

  const files = {
    ...currentFiles,
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
  };

  function handleGoNext() {
    setIndex((index) => Math.min(index + 1, props.files.length - 1));
  }

  function handleGoBack() {
    setIndex((index) => Math.max(index - 1, 0));
  }

  function handleToggleEditMode() {
    setIsEditMode((isEditMode) => !isEditMode);
  }

  return (
    <>
      {props.files.length > 1 ? (
        <div className="absolute left-0 top-0 z-10 flex w-full items-center justify-center">
          <div className="rounded-t-2 flex items-center justify-center gap-2 px-2 py-1 text-xs">
            <button
              className="flex size-4 items-center justify-center rounded-full border"
              onClick={handleGoBack}
            >
              -
            </button>
            {index + 1} / {props.files.length}
            <button
              className="flex size-4 items-center justify-center rounded-full border"
              onClick={handleGoNext}
            >
              +
            </button>
            <button
              className="flex size-4 items-center justify-center rounded-full border"
              onClick={handleToggleEditMode}
            >
              {isEditMode ? "V" : "E"}
            </button>
          </div>
        </div>
      ) : null}

      <div
        className="flex size-full"
        onKeyDown={(e) => {
          e.stopPropagation();
        }}
        onKeyUp={(e) => {
          e.stopPropagation();
        }}
      >
        <style>
          {`
        .sp-wrapper {
  width: 100%;
}
`}
        </style>
        <SandpackProvider theme="dark" template="react-ts" files={files}>
          <PanelGroup direction="horizontal" className="flex size-full">
            <Panel defaultSize={70} className="h-full">
              {isEditMode ? (
                <SandpackCodeEditor className="h-full" />
              ) : (
                <ActiveSandpackFile index={index}>
                  {/* <template v-for="(_, name) in $slots" :key="name" #[name]>
              <slot :name="name" />
            </template> */}
                </ActiveSandpackFile>
              )}
            </Panel>
            <PanelResizeHandle className="w-1" />
            <Panel defaultSize={30} className="h-full">
              <SandpackPreview
                showOpenInCodeSandbox={false}
                className="h-full"
              />
            </Panel>
          </PanelGroup>
        </SandpackProvider>
      </div>
    </>
  );
}

function ActiveSandpackFile(props: { index: number }) {
  const { sandpack } = useSandpack();
  // Same like in setup preparser.ts
  const activeFileName = sandpack.activeFile
    .replaceAll(".", "_")
    .replace("/", "");

  const slotName = `index_${props.index}_filename_${activeFileName}`;

  return (
    <div className="flex h-full w-full appearance-none flex-wrap gap-2 pb-4">
      {sandpack.visibleFiles.map((visibleFile) => (
        <button
          key={visibleFile}
          className={clsx(
            "appearance-none p-2",
            visibleFile === sandpack.activeFile && "border-b",
          )}
          onClick={() => sandpack.setActiveFile(visibleFile)}
        >
          {visibleFile.replace("/", "")}
        </button>
      ))}
      <Suspense>
        <SyntaxHighlight code={sandpack.files[sandpack.activeFile].code} />
      </Suspense>
    </div>
  );
}

async function SyntaxHighlight(props: { code: string }) {
  // `createHighlighter` is async, it initializes the internal and
  // loads the themes and languages specified.
  const highlighter = await createHighlighter({
    themes: ["vitesse-dark"],
    langs: ["typescript", "tsx"],
  });

  const code = highlighter.codeToHtml(props.code, {
    lang: "tsx",
    theme: "vitesse-dark",
  });

  return <div className="size-full" dangerouslySetInnerHTML={{ __html: code }} />;
}
