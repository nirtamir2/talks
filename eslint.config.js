import nirtamir2 from "@nirtamir2/eslint-config";

export default nirtamir2({
  vue: true,
  react: false,
  typescript: {
    // tsconfigPath: "tsconfig.json",
  },
  // formatters: {
  //   css: true,
  //   markdown: true,
  //   slidev: {
  //     files: ["*/src/slides.md"],
  //   },
  // },
  ignores: ["**/demo/eslint/**", "**/routeTree.gen.ts", ],
}, [
  {
    rules: {
      "tailwindcss/no-custom-classname": "off",
    }
  },
  {
    // Lint rules inside code snippets in markdown files
    files: ["**/slides.md/**"],
    rules: {
      "sonarjs/no-commented-code": "off",
      "sonarjs/unused-import": "off",
      "sonarjs/no-unused-vars": "off",
      "sonarjs/no-dead-store": "off",
    }
  },
]);
