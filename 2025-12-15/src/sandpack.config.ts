import { defineSandpackConfig } from "slidev-addon-sandpack";

export default defineSandpackConfig({
  defaultPreset: "r3f",
  presets: {
    r3f: {
      template: "react-ts",
      dependencies: {
        "@react-three/drei": "^10.0.7",
        "@react-three/fiber": "^9.1.2",
        "react-dom": "^19.0.0",
        "react-scripts": "^4.0.0",
        react: "^19.0.0",
        three: "^0.176.0",
      },
      devDependencies: {
        "@types/react": "^19.0.0",
        "@types/react-dom": "^19.0.0",
        "@types/three": "^0.176.0",
        typescript: "^4.0.0",
      },
      entry: "/index.tsx",
      files: {
        "/index.tsx": {
          source: "./sandpack/index.tsx",
          hidden: true,
        },
        "/styles.css": {
          source: "./sandpack/styles.css",
          hidden: true,
          readOnly: true,
        },
      },
      layout: {
        defaultMode: "edit",
        editorSize: 70,
        height: "100%",
        minHeight: "360px",
        previewSize: 30,
      },
    },
    "r3f-physics": {
      extends: "r3f",
      dependencies: {
        "@react-three/rapier": "^2.1.0",
      },
    },
  },
});
