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
  ignores: ["**/demo/eslint/**"],
});
