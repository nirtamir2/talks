import { useState } from "react";
import type { SandpackProps } from "@codesandbox/sandpack-react";
import { SandpackPreview, SandpackProvider } from "@codesandbox/sandpack-react";

export default function Preview(props: {
  files: Array<SandpackProps["files"]>;
}) {
  const [index, setIndex] = useState(0);
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

  return (
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
        <SandpackPreview showOpenInCodeSandbox={false} className="h-full" />
      </SandpackProvider>
    </div>
  );
}
