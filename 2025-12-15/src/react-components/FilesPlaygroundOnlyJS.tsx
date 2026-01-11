import type { SandpackProps } from "@codesandbox/sandpack-react";
import { SandpackPreview, SandpackProvider } from "@codesandbox/sandpack-react";

export default function FilesPlaygroundOnlyJS(props: {
  files: Array<SandpackProps["files"]>;
}) {
  const currentFiles = props.files[0];

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
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
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

.sp-code-editor {
  --sp-font-size: 18px;
  --sp-font-lineHeight: 20px;
}
`}
      </style>
      <SandpackProvider theme="dark" template="vanilla-ts" files={files}>
        <SandpackPreview showOpenInCodeSandbox={false} className="h-full" />
      </SandpackProvider>
    </div>
  );
}
