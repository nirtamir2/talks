import nirtamir2 from "@nirtamir2/eslint-config";

export default nirtamir2(
  {
    vue: true,
    react: false,
    typescript: {
      // tsconfigPath: "tsconfig.json",
    },
    tailwindcss: {
      entryPoint: "src/globals.css",
    },
    // formatters: {
    //   css: true,
    //   markdown: true,
    //   slidev: {
    //     files: ["*/src/slides.md"],
    //   },
    // },
    ignores: [
      "**/demo/eslint/**",
      "**/routeTree.gen.ts",
      "**/dist-stale/**",
      "**/.vinxi/**",
      "**/.output/**",
    ],
  },
  [
    {
      rules: {
        "better-tailwindcss/no-unregistered-classes": "off",
      },
    },
    {
      // Lint rules inside code snippets in markdown files
      files: ["**/slides.md/**"],
      rules: {
        "sonarjs/no-commented-code": "off",
        "sonarjs/unused-import": "off",
        "sonarjs/no-unused-vars": "off",
        "sonarjs/no-dead-store": "off",
        "antfu/no-top-level-await": "off",
        // For Effect code
        "unicorn/throw-new-error": "off",
      },
    },
  ],
);
