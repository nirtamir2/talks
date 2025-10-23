import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  slidev: {
    vue: {
      template: {
        compilerOptions: {
          // treat all tags with a dash as custom elements
          isCustomElement: (tag) => {
            return tag.includes("react-");
          },
        },
      },
    },
    // markdown: {
    //   /* markdown-it options */
    //   markdownItSetup(md) {
    //     /* custom markdown-it plugins */
    //     md.use(MyPlugin)
    //   },
    // },
    /* options for other plugins */
  },
});
