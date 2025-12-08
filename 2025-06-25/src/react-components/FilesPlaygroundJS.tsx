import { useState } from "react";
import type { SandpackProps } from "@codesandbox/sandpack-react";
import { SandpackPreview, SandpackProvider } from "@codesandbox/sandpack-react";

export default function FilesPreviewJS(props: {
  files: Array<SandpackProps["files"]>;
}) {
  const [index, setIndex] = useState(0);
  const [isEditMode, setIsEditMode] = useState(true);
  const currentFiles = props.files[index];

  const files = {
    ...currentFiles,
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
          three: "^0.176.0",
        },
        devDependencies: {
          typescript: "^4.0.0",
        },
        main: "/index.ts",
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
      <SandpackProvider theme="dark" template="vanilla-ts" files={files}>
        <SandpackPreview showOpenInCodeSandbox={false} className="h-full" />
      </SandpackProvider>
    </div>
  );
}
