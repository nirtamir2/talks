# Slidev Sandpack Addon Design

- Date: 2026-07-11
- Status: Conversation design approved; written review pending

## Summary

Extract the React Three Fiber talk's live-code playground into a reusable, public Slidev addon named `slidev-addon-sandpack`. The addon will turn a small Markdown syntax into stepped, multi-file CodeSandbox Sandpack demos with an editor and live preview.

The addon will use Slidev's public preparser API and a real Markdown-it token stream. It will not parse Markdown structure with regular expressions. It will also provide typed, named presets so a deck or another npm package can reuse dependencies, scaffold files, and UI defaults.

The package will be MIT licensed, publishable to npm, discoverable through the `slidev-addon` keyword, and prepared for a submission to Slidev's curated addon gallery.

## Context

The current implementation lives in `2025-12-15/src` and is coupled to one talk:

- `setup/preparser.ts` recognizes `@@@` regions and `tsx sandpack` fences with two regular expressions.
- Fence attributes are parsed by splitting on whitespace.
- Files are grouped by an explicit `index` and serialized as HTML-escaped JSON inside a generated `<React>` element.
- `react-components/FilesPlayground.tsx` injects a React entry point, CSS, package manifest, and React Three Fiber dependencies.
- The installed `slidev-addon-react` discovers components only from the consuming deck's `react-components` directory, so moving the TSX file into another addon would not work by itself.
- The active `slides.md` contains large generated payloads, while the readable source syntax remains in `draft.md`.

The existing preparser already calls `definePreparserSetup`. The refactor is therefore about replacing the handwritten Markdown and attribute parsing, creating a stable public contract, and separating reusable Sandpack behavior from talk-specific configuration.

## Goals

- Author live-code demos primarily as readable Markdown.
- Support multiple files and multiple progressive steps.
- Use CodeSandbox's official `@codesandbox/sandpack-react` components.
- Let steps inherit files so authors only repeat changed or added files.
- Provide typed, named presets for dependencies, scaffold files, and UI defaults.
- Work without `slidev-addon-react` or consumer-root React component discovery.
- Produce useful build-time errors for invalid authoring and configuration.
- Package, document, test, and release the addon as a public npm package.
- Migrate the existing talk to consume the workspace addon without overwriting unrelated user edits.

## Non-goals for Version 1

- A general-purpose Markdown or MDX runtime.
- Arbitrary HTML or prose inside a Sandpack block.
- Deleting an inherited file from a later step.
- Persisting live edits after navigating away from a step.
- Supporting non-Sandpack execution backends.
- Overriding a deck's layouts, theme, or wildcard global styles.
- Automatically publishing to npm or opening the Slidev gallery pull request without valid external credentials.

## Authoring Contract

`@@@` is the only custom block delimiter. Everything inside it uses ordinary fenced code blocks, formatter-stable Markdown comments, and Slidev's established `[title]` syntax for code-block titles. Inside this addon, that title is deliberately interpreted as the Sandpack filename. This interpretation does not require Slidev's optional code-group or Comark features.

````md
@@@

```tsx [App.tsx]
export default function App() {
  return <h1>Step one</h1>;
}
```

<!-- sandpack:step -->

```tsx [Card.tsx]
export function Card() {
  return <div>New file</div>;
}
```

```tsx [App.tsx]
import { Card } from "./Card";

export default function App() {
  return <Card />;
}
```

@@@
````

The rules are:

1. A matching `@@@` pair defines one demo.
2. A top-level `<!-- sandpack:step -->` Markdown comment inside the demo starts the next step.
3. Each step must contain at least one fenced code block.
4. Each fence must have a `[filename]`. The fence language is retained for editor and display metadata. `App.tsx`, `/App.tsx`, and `./App.tsx` normalize to `/App.tsx`. Duplicate slashes are collapsed. An empty resulting path, interior `.` or `..` segments, backslashes, NUL bytes, query strings, and fragments are rejected. Duplicate detection runs after normalization.
5. The first file declared in a step becomes that step's active file.
6. A step begins with the fully resolved files from the previous step, then replaces or adds the files it declares.
7. Duplicate filenames within one step are an authoring error.
8. Blank lines and Markdown comments are allowed. Other Markdown nodes inside the block are rejected so accidental content is not silently discarded.
9. Code containing `@@@` or `<!-- sandpack:step -->` is safe because Markdown-it keeps it inside the fence token.
10. Multiple demos may appear on one slide.

The default preset is selected with a plain `@@@`. A named preset is selected by adding its name to the opening delimiter:

````md
@@@ physics

```tsx [App.tsx]
export default function App() {
  return <Physics />;
}
```

@@@
````

The step marker is a standard HTML comment, so generic Markdown previews hide it and formatters preserve it. Generic editors still recognize the code fences; Slidev-aware tooling also recognizes `[filename]`. A horizontal rule is intentionally not used because Prettier normalizes `***` to `---`, which Slidev can interpret as a slide separator before the addon runs.

## Preset API

Deck-level presets live in `sandpack.config.ts` beside the deck's entry Markdown file. The public `defineSandpackConfig` helper provides inference and validation-friendly types.

```ts
import { defineSandpackConfig } from "slidev-addon-sandpack";

export default defineSandpackConfig({
  defaultPreset: "r3f",
  presets: {
    r3f: {
      template: "react-ts",
      dependencies: {
        three: "^0.176.0",
        "@react-three/fiber": "^9.1.2",
        "@react-three/drei": "^10.0.7",
      },
      files: {
        "/index.tsx": {
          source: "./sandpack/r3f/index.tsx",
          hidden: true,
        },
        "/styles.css": {
          source: "./sandpack/r3f/styles.css",
          hidden: true,
        },
      },
      layout: {
        editorSize: 65,
        previewSize: 35,
      },
    },
    physics: {
      extends: "r3f",
      dependencies: {
        "@react-three/rapier": "^2.1.0",
      },
    },
  },
});
```

The public configuration model is deliberately smaller than `SandpackProviderProps`:

```ts
interface SandpackConfig {
  defaultPreset?: string;
  presets?: Record<string, SandpackPreset>;
}

interface SandpackPreset {
  extends?: string;
  template?: SandpackPredefinedTemplate;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  files?: Record<string, SandpackPresetFile>;
  entry?: string;
  layout?: SandpackLayoutOptions;
}

interface SandpackLayoutOptions {
  editorSize?: number;
  previewSize?: number;
  defaultMode?: "edit" | "read";
  height?: string;
  minHeight?: string;
}

type SandpackPresetFile =
  | string
  | {
      code?: string;
      source?: string | URL;
      hidden?: boolean;
      readOnly?: boolean;
    };
```

For an object file, exactly one of `code` and `source` must be present. A string `source` path is resolved relative to `sandpack.config.ts` and read at build time. A shared preset package can use `new URL('./file.tsx', import.meta.url)` so its source files resolve relative to that package rather than the consuming deck. URL sources must use the `file:` protocol.

Preset resolution is deterministic:

1. Choose the name from `@@@ name`, then the deck's `defaultPreset`, then the built-in `react-ts` default. A name may refer to a custom preset or directly to a Sandpack built-in template.
2. Resolve a single-parent `extends` chain. An `extends` value may likewise refer to a custom preset or terminate at a built-in template.
3. Apply the Sandpack built-in template.
4. Merge each parent and child preset in order.
5. Add the current demo step's inherited and authored files.

`dependencies`, `devDependencies`, and `files` merge by key, with the child winning. Scalar settings replace their parent. Layout fields merge one level deep. Unknown parents and cyclic chains fail at build time.

Preset file keys and `entry` use the same canonical Sandpack-path rules as authored filenames. If `entry` is omitted, Sandpack uses the selected built-in template's default. If `entry` is present, the addon passes it to `customSetup.entry` and validates that every resolved step provides that file through preset or authored files.

The compiler does not materialize Sandpack's built-in template files. At runtime, `template` selects the built-in project and the resolved addon `files` prop overrides template files by canonical path, matching Sandpack's documented behavior. A child preset replaces an entire parent file descriptor at the same path. An authored fence also replaces the entire preset descriptor for that path and makes the file visible and editable; hidden/read-only scaffold metadata is not retained accidentally after an author explicitly overrides the file.

Presets are plain typed objects, so a separate npm package can export one and multiple decks can import it into their own `sandpack.config.ts`.

The compiled runtime model is serializable and contains no filesystem paths or config functions:

```ts
interface SandpackDemo {
  presetName: string;
  template: SandpackPredefinedTemplate;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  entry?: string;
  layout: Required<SandpackLayoutOptions>;
  steps: SandpackDemoStep[];
}

interface SandpackDemoStep {
  files: Record<string, SandpackFile>;
  activeFile: string;
}
```

Panel sizes are relative percentages. Each value must be between 1 and 99. When one size is provided, the other is its complement; when both are provided, they must total 100.

## Architecture

The addon has four bounded parts.

### 1. Slidev Preparser Adapter

`setup/preparser.ts` is the only Slidev-specific parsing entry point. It uses `definePreparserSetup` from `@slidev/types`, loads `sandpack.config.ts` once per deck entry with a direct `jiti` dependency and disabled module caching, and supplies an `async transformSlide` extension matching Slidev 52.1's public type.

It imports only public Slidev APIs. It does not use `PreparserExtensionLoader` or other Slidev internals.

`setup/vite-plugins.ts` watches `sandpack.config.ts` and every source-backed preset file. A change clears the addon config cache and restarts the Slidev server so parser output cannot become stale. Production builds always load a fresh config.

### 2. Markdown and Preset Compiler

The compiler is framework-independent TypeScript:

- Markdown-it parses each slide.
- `markdown-it-container` is configured with `@` as the marker and accepts an optional preset name after the opening marker.
- The compiler walks container, fence, and HTML-comment tokens rather than matching Markdown with regular expressions.
- A small, tested fence-info helper extracts only the language and bracketed filename from an already parsed fence token. It is not a general Markdown parser.
- The compiler resolves presets and step inheritance into serializable `SandpackDemo` objects.
- Parsed demos are stored in a namespaced internal frontmatter property, `_sandpackDemos`.
- Each source container is replaced with a small component reference such as `<SandpackLiveDemo :demo="$frontmatter._sandpackDemos[0]" />`.

Keeping the model in frontmatter eliminates HTML entity escaping and large JSON attributes in `slides.md`.

If a slide already defines `_sandpackDemos`, transformation fails rather than overwriting user data. Otherwise, the compiler initializes one array, appends every demo on that slide in source order, and generates references with matching indexes.

Slidev recommends Markdown transformers for most custom syntax and warns that preparsers can affect editor integrations. This addon intentionally uses the preparser because it must compile a whole, slide-scoped source container into structured data, mutate that slide's frontmatter, and remove the source fences before Slidev's normal code-block transforms run. The README will disclose the editor-integration caveat and that installing or updating preparser code requires fully stopping and starting Slidev.

### 3. Slidev/Vue Bridge

`components/SandpackLiveDemo.vue` is auto-registered by Slidev. It owns a local DOM mount and mounts the addon-owned React renderer with `createRoot`.

The bridge imports the renderer directly from the addon. It does not rely on `slidev-addon-react`, `import.meta.glob('/react-components')`, or files in the consuming deck.

The bridge updates the React root when its serializable `demo` prop changes and unmounts cleanly with the slide component.

### 4. React Sandpack Renderer

The React renderer uses the official `@codesandbox/sandpack-react` provider, editor, and preview components. It:

- Shows an accessible file tab bar, Sandpack editor/read-only view, preview, and step controls.
- Uses labeled previous/next buttons and announces the current step.
- Clamps navigation at the first and last steps.
- Remounts Sandpack when the selected authored step changes, restoring that step's canonical snapshot.
- Allows live edits within the current step and updates the preview immediately.
- Stops presentation-navigation keyboard events while focus is anywhere inside the addon's interactive root.
- Uses scoped addon classes and CSS variables instead of wildcard global theme styles.
- Uses the preset's dependency maps through Sandpack custom setup rather than generating a `/package.json` file for every demo.
- Hides preset scaffold files by default when their metadata requests it.

The package will deduplicate React and React DOM in its Vite setup. It will not require a second addon in the consumer's headmatter.

Keyboard isolation applies while focus is anywhere inside the addon's interactive root, including file tabs, step buttons, editor, preview controls, and resize handles. Events outside that root continue to drive Slidev navigation.

The bridge root defaults to `width: 100%`, `height: 100%`, and `min-height: 360px`. Preset layout options add `height` and `minHeight` CSS-length overrides so a demo remains visible in an auto-height layout without depending on the talk's existing `.slidev-react-container` rule.

`@codesandbox/sandpack-react` is a direct dependency. `react` and `react-dom` are declared as compatible peer dependencies (`>=18 <20`) and as development dependencies for this package's own build and tests. The addon Vite setup deduplicates both modules. The isolated-package test verifies peer installation and runs against the supported React majors, so consumers do not receive a hidden second React root.

## Package Layout

```text
packages/slidev-addon-sandpack/
├── components/
│   └── SandpackLiveDemo.vue
├── docs/
│   └── presets.md
├── example/
│   ├── sandpack.config.ts
│   ├── slides.md
│   └── templates/
├── setup/
│   ├── preparser.ts
│   └── vite-plugins.ts
├── src/
│   ├── config.ts
│   ├── index.ts
│   ├── parser.ts
│   ├── presets.ts
│   ├── renderer.tsx
│   └── types.ts
├── test/
├── CHANGELOG.md
├── LICENSE
├── README.md
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

The workspace will add `packages/*`. Public helper exports and declarations will be built to `dist`; Slidev convention files under `components/` and `setup/` remain package assets. The published `files` allowlist includes only runtime assets, declarations, documentation, and the license.

## Error Contract

Build-time errors begin with `[slidev-addon-sandpack]` and include the closest available source context, container ordinal, and a corrective message.

Errors include:

- Unclosed or nested `@@@` containers.
- Empty demos or empty steps.
- Non-fence Markdown content inside a demo.
- Missing or duplicate filenames.
- Unknown preset names or parents.
- Cyclic preset inheritance.
- A preset file with neither or both of `code` and `source`.
- Missing or unreadable source files.
- Invalid dependency values or panel sizes.
- A user-supplied `_sandpackDemos` frontmatter key that collides with the addon's internal payload.

The preparser API does not provide a reliable per-import source filename or slide index to `transformSlide`, so diagnostics will not fabricate one. Imported-slide errors will use the root entry path supplied by Slidev plus the local container context.

At runtime, configuration is already validated. The component shows a contained error state if the React renderer or Sandpack provider fails, without breaking the rest of the slide deck.

## Testing and Verification

### Unit tests

- Real Markdown-it parsing of containers, fences, ordinary comments, and exact `<!-- sandpack:step -->` markers.
- Backtick and tilde fences, longer fence markers, and code containing delimiter-like text.
- Multiple demos per slide.
- Filename extraction, including spaces and nested paths.
- Canonical filename aliases, invalid traversal-like paths, and duplicate aliases.
- Step inheritance and first-file active selection.
- Duplicate names, empty steps, unexpected Markdown, and unclosed containers.
- Preset merging, file loading, missing parents, and cycle detection.
- Stable transformed output with no inline JSON payload.
- Formatter stability through `prettier-plugin-slidev` without introducing `---` inside a demo.
- Public type inference for `defineSandpackConfig`.

### Component tests

- Step navigation and boundary behavior.
- Canonical reset when changing steps.
- Editor/read-only toggling.
- Accessible labels, focus behavior, and keyboard-event isolation.
- Vue bridge mount, update, and unmount behavior.
- React error-boundary and Vue bridge failure isolation.

Sandpack networking is mocked in component tests; unit tests do not depend on CodeSandbox availability.

### Integration tests

- Build the example deck against the workspace addon.
- Pack the addon, install the tarball into an isolated fixture, and run `slidev build` there.
- Test both the minimum supported Slidev version (`52.1.0`) and the current compatible Slidev release in CI.
- Inspect the packed file list and fail on missing runtime assets or unintended source files.
- Run linting, formatting checks, TypeScript checks, unit tests, component tests, and the integration build before release.

## Documentation

The npm-facing `README.md` will contain:

- Purpose and screenshot or short demo.
- npm, pnpm, yarn, and bun installation commands.
- Slidev `addons` configuration.
- A minimal single-step example.
- Progressive steps with `<!-- sandpack:step -->`.
- Multi-file examples.
- Named preset selection with `@@@ preset-name`.
- Configuration reference.
- Compatibility, limitations, and troubleshooting.
- The preparser/editor-integration caveat, full-restart requirement after addon setup changes, and runtime network/privacy behavior of the CodeSandbox bundler.
- Migration from the original `sandpack index=... file=...` syntax.
- Development and contribution instructions.

`docs/presets.md` will cover reusable presets in depth, including inheritance, source-backed files, merge semantics, publishing a preset package, and React Three Fiber/Rapier examples.

The package's example deck is executable documentation and doubles as the integration fixture.

## Public Package and Release Standards

The initial package name is `slidev-addon-sandpack`, which was unclaimed on npm when this design was written. The initial release version is `0.1.0`.

The package manifest will include:

- `name`, `version`, `description`, `type`, `exports`, `types`, and a restrictive `files` list.
- MIT `license` and an explicit package-level MIT `LICENSE` for the addon directory, distinct from the repository's root AGPL license.
- `keywords` containing at least `slidev`, `slidev-addon`, `sandpack`, `codesandbox`, `live-code`, and `presentation`.
- `engines.node: ">=18.0.0"` and `engines.slidev: ">=52.1.0"`.
- Repository metadata with the monorepo `directory` field, plus homepage and issue URLs.
- `publishConfig.access: "public"`.
- Explicit dependencies and peer dependencies, including React ownership; no reliance on accidental root hoisting.
- A side-effects declaration that preserves required component styles.

The release workflow will:

1. Require all CI checks.
2. Verify the packed tarball in an isolated Slidev fixture.
3. Publish from a versioned GitHub release with npm provenance and public access.
4. Generate or update the changelog according to semantic versioning.

Trusted publishing or an npm token must be configured by the package owner before the first release.

Slidev discovery has two paths:

- The npm package name and `slidev-addon` keyword make the package discoverable from the gallery's npm search.
- After the npm package and public repository exist, submit a pull request adding `slidev-addon-sandpack` to `docs/.vitepress/addons.ts` in `slidevjs/slidev`. The entry includes the complete current community schema: `id`, `name`, `description`, `tags`, `author`, and `repo`.

## Migration of the Existing Talk

The implementation will:

1. Add the addon as a workspace package and dependency, and add `slidev-addon-sandpack` to the entry headmatter's `addons` list.
2. Define the React Three Fiber and physics presets in the talk's `sandpack.config.ts`.
3. Treat the active generated payloads in `slides.md` as the authoritative behavior. Use their embedded `blocksContent` plus `draft.md` only as reconstruction aids, then replace the two generated `<React is="FilesPlayground" ...>` payloads with readable `@@@`, fenced-file, and `<!-- sandpack:step -->` syntax.
4. Keep the user's unrelated positioning changes in `slides.md` intact.
5. Reorder fences where necessary so the first file preserves each legacy step's explicit `active` file.
6. Compare every resolved new step with the corresponding legacy snapshot. Sparse legacy indexes are compacted in ascending order. If a legacy step intentionally omits a previously present file, migration stops with an explicit unsupported-deletion report rather than silently retaining it.
7. Run a browser smoke comparison of both migrated demos before deleting local code.
8. Remove the talk-local Sandpack preparser and playground files only after searches and builds confirm they have no remaining consumers.
9. Retain `slidev-addon-react` if other talk components still require it.
10. Remove root dependencies only when they are no longer used elsewhere in the monorepo.

## References

- Slidev preparser: https://sli.dev/custom/config-parser
- Writing Slidev addons: https://sli.dev/guide/write-addon
- Slidev addon gallery: https://sli.dev/resources/addon-gallery
- Slidev gallery source list: https://github.com/slidevjs/slidev/blob/main/docs/.vitepress/addons.ts
- Slidev code groups and `[title]` syntax: https://sli.dev/features/code-groups
- Sandpack: https://sandpack.codesandbox.io/
