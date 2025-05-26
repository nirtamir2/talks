export default {
  plugins: [
    "prettier-plugin-slidev",
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss", // must come last
  ],
  // @see https://github.com/tailwindlabs/prettier-plugin-tailwindcss#resolving-your-tailwind-configuration
  //   tailwindConfig: "./tailwind.config.ts",
  // @see https://github.com/trivago/prettier-plugin-sort-imports
  importOrder: [
    "^react$",
    "<THIRD_PARTY_MODULES>",
    // Internal modules
    "^@talks/(.*)$",
    // TypeScript TSConfig path aliases
    "^@/(.*)$",
    // Relative imports
    "^[./]",
  ],
  importOrderSortSpecifiers: true,
  overrides: [
    {
      files: ["slides.md", "pages/*.md"],
      options: {
        parser: "slidev",
        plugins: ["prettier-plugin-slidev"],
      },
    },
    {
      files: "*.svg",
      options: {
        parser: "html",
      },
    },
  ],
};
