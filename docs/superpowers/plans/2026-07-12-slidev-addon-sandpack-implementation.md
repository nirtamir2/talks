# Implementation Plan: Slidev Sandpack Addon

## Overview

Implement the approved `slidev-addon-sandpack` design as a public, MIT-licensed workspace package; prove its parser, preset, runtime, packaging, and release contracts; migrate the React Three Fiber talk; and leave npm publication plus the Slidev gallery submission ready for the owner's external credentials.

The work follows test-driven, vertical slices. Every behavior task starts with a failing focused test, adds the smallest implementation that passes, and runs the package checkpoint before the next slice.

## Architecture Decisions

- `setup/preparser.ts` uses only Slidev's public `definePreparserSetup` API.
- Markdown-it plus `markdown-it-container` owns Markdown structure; the addon never regex-parses whole Markdown blocks.
- `<!-- sandpack:step -->` is the formatter-stable step marker.
- `sandpack.config.ts` defines typed, named presets loaded with a direct `jiti` dependency.
- Parsed demos become serializable `_sandpackDemos` frontmatter plus small component references.
- The addon owns a Vue-to-React bridge and uses official `@codesandbox/sandpack-react`; it does not depend on `slidev-addon-react`.
- Public helpers compile to `dist`; Slidev convention files remain package assets.
- Runtime imports are explicitly owned: Markdown-it/container, `jiti`, Sandpack, and required Slidev/Vue helpers are direct dependencies; React and React DOM are peers plus test/build dependencies.
- The package is `slidev-addon-sandpack@0.1.0`, MIT licensed, and release-ready with npm provenance.
- The user's existing unrelated edits in `2025-12-15/src/slides.md` remain preserved throughout migration.

## Dependency Graph

```text
Workspace package scaffold
  └─ Public types and path contract
      ├─ Markdown container compiler
      └─ Preset resolver and config loader
          └─ Slidev preparser adapter and watch integration
              ├─ React Sandpack renderer
              │   └─ Stepped interaction and accessibility
              └─ Vue bridge and Vite integration
                  └─ Example deck and packed-package smoke test
                      └─ Existing-talk migration
                          └─ Public docs, release automation, and final audit
```

## Phase 1: Package and Compiler Foundation

### Task 1: Scaffold the publishable workspace package

**Description:** Add the workspace entry, package manifest, TypeScript configuration, package-level MIT license, and lockfile dependencies required for an independently testable addon package.

**Acceptance criteria:**

- [ ] pnpm recognizes `slidev-addon-sandpack` under `packages/*`.
- [ ] The manifest has the agreed initial name/version, engines, repository directory, keywords, scripts, restrictive publish intent, and explicit direct/peer/dev dependency ownership.
- [ ] The workspace lockfile resolves every declared dependency without relying on an undeclared root dependency.

**Verification:**

- [ ] `pnpm install --lockfile-only`
- [ ] `pnpm --filter slidev-addon-sandpack list --depth 0`
- [ ] Programmatically validate the manifest's name, version, license, repository directory, keywords, engines, peers, and publish access.

**Dependencies:** None

**Files likely touched:**

- `pnpm-workspace.yaml`
- `pnpm-lock.yaml`
- `packages/slidev-addon-sandpack/package.json`
- `packages/slidev-addon-sandpack/tsconfig.json`
- `packages/slidev-addon-sandpack/LICENSE`

**Estimated scope:** Medium

### Task 2: Define public contracts and canonical virtual paths

**Description:** Add the public config/preset/runtime types, `defineSandpackConfig`, and the canonical Sandpack filename/entry normalizer before parser behavior depends on them.

**Acceptance criteria:**

- [ ] Valid preset objects infer correctly through `defineSandpackConfig`, and an external TypeScript consumer imports only documented public paths.
- [ ] `App.tsx`, `/App.tsx`, and `./App.tsx` normalize identically.
- [ ] Traversal-like, backslash, query, fragment, NUL, and duplicate aliases are rejected with addon-prefixed errors.

**Verification:**

- [ ] `pnpm --filter slidev-addon-sandpack test --run paths types`
- [ ] `pnpm --filter slidev-addon-sandpack typecheck`

**Dependencies:** Task 1

**Files likely touched:**

- `packages/slidev-addon-sandpack/src/types.ts`
- `packages/slidev-addon-sandpack/src/paths.ts`
- `packages/slidev-addon-sandpack/src/index.ts`
- `packages/slidev-addon-sandpack/test/paths.test.ts`
- `packages/slidev-addon-sandpack/test/types.test-d.ts`

**Estimated scope:** Medium

### Task 3: Compile formatter-stable Markdown demos

**Description:** Parse `@@@` containers, optional preset names, backtick/tilde fenced files, comments, exact step markers, nested paths, spaces, and delimiter-like code through real Markdown-it tokens.

**Acceptance criteria:**

- [ ] Single/multiple demos and single/multiple steps compile in source order with the first file active.
- [ ] Unclosed/nested containers, empty steps, duplicate files, missing filenames, and unexpected Markdown fail clearly.
- [ ] Only Markdown-it token line ranges belonging to a demo are replaced; all bytes outside those ranges remain unchanged.

**Verification:**

- [ ] `pnpm --filter slidev-addon-sandpack test --run parser`
- [ ] Format a representative fixture twice with `prettier-plugin-slidev` and confirm no `---` is introduced inside the demo.
- [ ] Assert byte-identical source before, between, and after multiple replaced containers.

**Dependencies:** Task 2

**Files likely touched:**

- `packages/slidev-addon-sandpack/src/parser.ts`
- `packages/slidev-addon-sandpack/test/parser.test.ts`
- `packages/slidev-addon-sandpack/test/fixtures/demo.md`

**Estimated scope:** Medium

### Task 4: Resolve presets and source-backed files

**Description:** Implement deterministic built-in/custom preset selection, single-parent inheritance, merge semantics, source loading, entry validation, and serializable step inheritance.

**Acceptance criteria:**

- [ ] Built-in template names, custom presets, inheritance, dependency maps, layout defaults, and authored file overrides resolve exactly as specified.
- [ ] String sources resolve from the deck config and `file:` URLs retain a shared package's origin.
- [ ] Unknown/cyclic presets, invalid source descriptors, missing files, invalid panel sizes, and missing custom entries fail before runtime.

**Verification:**

- [ ] `pnpm --filter slidev-addon-sandpack test --run presets config`
- [ ] `pnpm --filter slidev-addon-sandpack typecheck`

**Dependencies:** Tasks 2 and 3

**Files likely touched:**

- `packages/slidev-addon-sandpack/src/presets.ts`
- `packages/slidev-addon-sandpack/src/config.ts`
- `packages/slidev-addon-sandpack/test/presets.test.ts`
- `packages/slidev-addon-sandpack/test/config.test.ts`

**Estimated scope:** Medium

### Task 5: Integrate the Slidev preparser and development watcher

**Description:** Compile raw demos into serializable frontmatter, adapt that compiler through Slidev's public preparser API, load config asynchronously, and restart Slidev when config/source-backed files change.

**Acceptance criteria:**

- [ ] `async transformSlide` appends multiple demos to `_sandpackDemos` and returns stable component references.
- [ ] A user `_sandpackDemos` collision fails rather than overwriting data.
- [ ] Direct `jiti` loading, prefixed contextual errors, config/template cache clearing, dev-server restarts, and fresh production loads follow the approved contract.

**Verification:**

- [ ] `pnpm --filter slidev-addon-sandpack test --run compiler setup`
- [ ] `pnpm --filter slidev-addon-sandpack typecheck`

**Dependencies:** Task 4

**Files likely touched:**

- `packages/slidev-addon-sandpack/src/compiler.ts`
- `packages/slidev-addon-sandpack/setup/preparser.ts`
- `packages/slidev-addon-sandpack/setup/vite-plugins.ts`
- `packages/slidev-addon-sandpack/test/compiler.test.ts`
- `packages/slidev-addon-sandpack/test/preparser.test.ts`

**Estimated scope:** Medium

### Checkpoint A: Compiler foundation

- [ ] All focused and package tests pass.
- [ ] Package type-check and build pass.
- [ ] Parser fixtures remain unchanged after Slidev Prettier formatting.
- [ ] Review staged diff before the runtime slice.

## Phase 2: Runtime and Package Integration

### Task 6: Render one accessible Sandpack demo end to end

**Description:** Build the first vertical runtime slice with official Sandpack provider/editor/preview components, scoped styling, preset custom setup, and a contained React error boundary.

**Acceptance criteria:**

- [ ] A compiled one-step demo renders its active file, editor, and preview with preset dependencies/entry.
- [ ] Hidden/read-only preset files and authored overrides map correctly to Sandpack.
- [ ] Renderer failures produce the contained addon error state.

**Verification:**

- [ ] `pnpm --filter slidev-addon-sandpack test --run renderer`
- [ ] `pnpm --filter slidev-addon-sandpack typecheck`

**Dependencies:** Task 5

**Files likely touched:**

- `packages/slidev-addon-sandpack/src/renderer.tsx`
- `packages/slidev-addon-sandpack/styles/sandpack.css`
- `packages/slidev-addon-sandpack/test/renderer.test.tsx`
- `packages/slidev-addon-sandpack/test/setup.ts`
- `packages/slidev-addon-sandpack/vitest.config.ts`

**Estimated scope:** Medium

### Task 7: Add stepped interaction and keyboard-safe presentation UX

**Description:** Add previous/next navigation, canonical step resets, edit/read-only mode, sizing, announcements, focus behavior, and keyboard isolation across every interactive descendant.

**Acceptance criteria:**

- [ ] Navigation clamps at boundaries and changing steps restores the authored snapshot.
- [ ] Controls have accessible names/state and keyboard events do not trigger Slidev while focus is inside the demo.
- [ ] Default and configured dimensions prevent collapse without global talk styles.

**Verification:**

- [ ] `pnpm --filter slidev-addon-sandpack test --run renderer accessibility`
- [ ] Manual keyboard pass in the example deck.

**Dependencies:** Task 6

**Files likely touched:**

- `packages/slidev-addon-sandpack/src/renderer.tsx`
- `packages/slidev-addon-sandpack/styles/sandpack.css`
- `packages/slidev-addon-sandpack/test/renderer.test.tsx`

**Estimated scope:** Medium

### Task 8: Bridge Slidev/Vue to the addon-owned React renderer

**Description:** Add the auto-registered Vue component, direct React mounting, lifecycle updates/unmounting, and Vite React deduplication without consumer-root discovery.

**Acceptance criteria:**

- [ ] The Vue bridge mounts, updates, and unmounts one React root cleanly.
- [ ] No `slidev-addon-react` dependency or `/react-components` glob is required.
- [ ] Vite deduplicates React and React DOM without discarding existing deck configuration.

**Verification:**

- [ ] `pnpm --filter slidev-addon-sandpack test --run bridge`
- [ ] `pnpm --filter slidev-addon-sandpack typecheck`

**Dependencies:** Tasks 6 and 7

**Files likely touched:**

- `packages/slidev-addon-sandpack/components/SandpackLiveDemo.vue`
- `packages/slidev-addon-sandpack/setup/vite-plugins.ts`
- `packages/slidev-addon-sandpack/test/bridge.test.ts`
- `packages/slidev-addon-sandpack/src/renderer-entry.ts`

**Estimated scope:** Medium

### Task 9: Create the executable example deck

**Description:** Add a local addon preview deck covering default and named presets, multiple files, inherited steps, source-backed scaffolds, and runtime controls.

**Acceptance criteria:**

- [ ] `addons: [./]` loads the addon with no consumer-specific setup.
- [ ] The example demonstrates the complete public Markdown and preset API.
- [ ] A production Slidev build completes without parser or runtime import errors.

**Verification:**

- [ ] `pnpm --filter slidev-addon-sandpack build:example`
- [ ] Open the example in a real browser and exercise editor, preview, files, and steps.

**Dependencies:** Task 8

**Files likely touched:**

- `packages/slidev-addon-sandpack/example/slides.md`
- `packages/slidev-addon-sandpack/example/sandpack.config.ts`
- `packages/slidev-addon-sandpack/example/templates/index.tsx`
- `packages/slidev-addon-sandpack/example/templates/styles.css`
- `packages/slidev-addon-sandpack/package.json`

**Estimated scope:** Medium

### Task 10: Build exports and prove the packed tarball

**Description:** Compile public helpers/runtime declarations, restrict publish contents, then install the actual tarball outside the workspace and build Slidev across the supported compatibility matrix.

**Acceptance criteria:**

- [ ] Package exports and style-preserving `sideEffects` resolve only built files and declared Slidev assets, including from an external TypeScript consumer.
- [ ] The tarball contains every required component/setup/dist/style/doc/license file and excludes tests, fixtures, source-backed templates, and unrelated monorepo files.
- [ ] Tarball-only consumers cover Slidev 52.1/current and React 18/19 without hoisting; the claimed Node floor is retained only if that actual Slidev/Vite build passes.

**Verification:**

- [ ] `pnpm --filter slidev-addon-sandpack build`
- [ ] `pnpm --filter slidev-addon-sandpack test:pack`
- [ ] `npm pack --dry-run --json` from the addon directory

**Dependencies:** Task 9

**Files likely touched:**

- `packages/slidev-addon-sandpack/tsconfig.build.json`
- `packages/slidev-addon-sandpack/package.json`
- `packages/slidev-addon-sandpack/scripts/test-pack.mjs`
- `packages/slidev-addon-sandpack/test/fixture/slides.md`
- `packages/slidev-addon-sandpack/test/fixture/package.json`

**Estimated scope:** Medium

### Checkpoint B: Runtime and package

- [ ] Unit, component, bridge, and integration tests pass.
- [ ] Example deck works in a real browser.
- [ ] Workspace and packed-tarball Slidev builds pass.
- [ ] Packed file list and peer ownership are reviewed.

## Phase 3: Existing Talk Migration

### Task 11: Wire the workspace addon and talk presets

**Description:** Install the workspace package for the monorepo, activate it in the talk headmatter, and move React Three Fiber/Rapier scaffolding into typed named presets.

**Acceptance criteria:**

- [ ] Slidev resolves `slidev-addon-sandpack` from the workspace.
- [ ] `r3f` and `physics` presets reproduce the legacy `/index.tsx`, `/styles.css`, R3F/Rapier dependencies, entry, hidden files, and panel defaults exactly.
- [ ] Existing unrelated `slides.md` positioning changes remain present.

**Verification:**

- [ ] `pnpm install`
- [ ] `pnpm --filter react-three-fiber-talk exec slidev build --out .slidev-addon-smoke`

**Dependencies:** Task 10

**Files likely touched:**

- `2025-12-15/src/package.json`
- `pnpm-lock.yaml`
- `2025-12-15/src/slides.md`
- `2025-12-15/src/sandpack.config.ts`
- `2025-12-15/src/sandpack/r3f/index.tsx`

**Estimated scope:** Medium

### Task 12: Migrate both generated demos with parity checks

**Description:** Before editing, extract and hash the active embedded payloads; then reconstruct readable source, preserve explicit active-file behavior by fence order, compact sparse indexes, and compare every resolved new snapshot to the legacy data.

**Acceptance criteria:**

- [ ] Both generated `<React is="FilesPlayground">` payloads become readable `@@@` demos with exact step comments.
- [ ] Resolved file contents, order, active file, dependencies, and preview behavior match the legacy demos.
- [ ] Any unsupported legacy deletion stops migration explicitly rather than changing behavior silently.

**Verification:**

- [ ] Run a focused legacy-vs-new snapshot comparison test.
- [ ] Build the talk and inspect both demos in a real browser.
- [ ] `git diff` confirms the user's unrelated slide edits remain intact.

**Dependencies:** Task 11

**Files likely touched:**

- `2025-12-15/src/slides.md`
- `packages/slidev-addon-sandpack/test/migration.test.ts`
- `packages/slidev-addon-sandpack/test/fixtures/legacy-demos.json`

**Estimated scope:** Medium

### Task 13: Remove only obsolete local Sandpack code

**Description:** Delete the replaced preparser/playground implementation and prune dependencies only after repository searches and builds prove they are unused elsewhere.

**Acceptance criteria:**

- [ ] No talk-local parser or playground consumer remains.
- [ ] `slidev-addon-react` remains because unrelated React components still consume it; shared dependencies stay whenever another workspace consumer exists.
- [ ] Root/talk type-checks and builds pass after every deletion group.

**Verification:**

- [ ] `rg -n "FilesPlayground|ActiveSandpackFile|sandpack-vue3|slidev-addon-react" --glob '!pnpm-lock.yaml'`
- [ ] `pnpm type-check`
- [ ] Build the migrated talk again.

**Dependencies:** Task 12

**Files likely touched:**

- `2025-12-15/src/setup/preparser.ts`
- `2025-12-15/src/react-components/FilesPlayground.tsx`
- `2025-12-15/src/components/FilesPlayground.vue`
- `2025-12-15/src/components/ActiveSandpackFile.vue`
- `package.json`

**Estimated scope:** Medium

### Checkpoint C: Migration

- [ ] Legacy/new snapshot tests pass.
- [ ] The talk builds and both demos work in a browser.
- [ ] Unrelated user changes are still present.
- [ ] No dependency or file is removed merely because it looks adjacent.

## Phase 4: Public Documentation and Release Readiness

### Task 14: Write npm-facing documentation and license artifacts

**Description:** Produce the package README, detailed preset guide, MIT license, changelog, and gallery-ready metadata using the executable example as the source of truth.

**Acceptance criteria:**

- [ ] README covers installation, activation, syntax, steps, presets, compatibility, caveats, privacy/network behavior, troubleshooting, and migration.
- [ ] `docs/presets.md` documents inheritance, merge rules, source URLs, and shareable preset packages.
- [ ] MIT license, changelog, package links, keywords, and gallery object all match the package name and repository directory.

**Verification:**

- [ ] Every documented command is executed or checked against the example fixture.
- [ ] `pnpm exec prettier --check packages/slidev-addon-sandpack/**/*.{md,json}`
- [ ] `npm pack --dry-run --json` includes all public docs and license files.

**Dependencies:** Checkpoint C

**Files likely touched:**

- `packages/slidev-addon-sandpack/README.md`
- `packages/slidev-addon-sandpack/docs/presets.md`
- `packages/slidev-addon-sandpack/LICENSE`
- `packages/slidev-addon-sandpack/CHANGELOG.md`
- `packages/slidev-addon-sandpack/package.json`

**Estimated scope:** Medium

### Task 15: Add CI and provenance-enabled release automation

**Description:** Add package-focused CI and a guarded GitHub-release workflow that rebuilds, retests, verifies the tag/version, and publishes the packed package with npm provenance.

**Acceptance criteria:**

- [ ] CI uses immutable formatting/lint checks and runs types, tests, example build, tarball inspection, and isolated builds at the minimum/current Slidev and React 18/19 combinations.
- [ ] Release automation rechecks npm's current trusted-publishing requirements, uses a supported Node/npm pair, requires `id-token: write`, validates the release tag against `package.json`, and publishes the already verified tarball publicly with provenance.
- [ ] No npm secret is committed; trusted publishing/token setup is documented as an owner prerequisite.

**Verification:**

- [ ] Validate workflow YAML and inspect permissions/triggers.
- [ ] Run the same package commands locally in CI order.
- [ ] Dry-run the version/tag guard and `npm publish --dry-run` path.

**Dependencies:** Task 14

**Files likely touched:**

- `.github/workflows/slidev-addon-ci.yml`
- `.github/workflows/slidev-addon-release.yml`
- `packages/slidev-addon-sandpack/package.json`

**Estimated scope:** Medium

### Task 16: Perform final quality, browser, and publication audit

**Description:** Review the full diff, run all verification, exercise the example and migrated talk in real browsers, and prepare the exact external publication/gallery handoff.

**Acceptance criteria:**

- [ ] No correctness, accessibility, security, packaging, or over-engineering findings remain unresolved.
- [ ] Full workspace/package/talk verification passes from a clean install state.
- [ ] The final handoff rechecks the live Slidev gallery schema and includes npm/trusted-publisher steps plus the exact PR object; external actions run only when credentials and repository state permit.

**Verification:**

- [ ] Run immutable package-scoped Prettier and ESLint checks, root/package type-checks, all addon tests, the example build, and the migrated talk build.
- [ ] `pnpm --filter slidev-addon-sandpack test:pack`
- [ ] Browser smoke tests for the example and both migrated demos

**Dependencies:** Task 15

**Files likely touched:** None unless review finds an issue

**Estimated scope:** Medium

### Checkpoint D: Complete

- [ ] Every task acceptance criterion is satisfied.
- [ ] All verification commands pass without relying on unstaged user changes.
- [ ] Public docs and packed contents match actual behavior.
- [ ] Branch is ready for review, release configuration, npm publication, and Slidev gallery submission.

## Risks and Mitigations

| Risk                                              | Impact | Mitigation                                                                                                               |
| ------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------ |
| Slidev preparser/editor integrations diverge      | High   | Use only public APIs, keep syntax formatter-stable, document the caveat, and test minimum/current Slidev versions.       |
| React is duplicated in a consumer                 | High   | Peer React 18/19, Vite dedupe, and test actual packed consumers for both majors.                                         |
| Declared Node support exceeds Slidev/Vite reality | High   | Run the isolated build on the claimed minimum and raise `engines.node` plus docs to the lowest proven version if needed. |
| Sandpack networking makes tests flaky             | Medium | Mock Sandpack in component tests; reserve network use for manual browser smoke tests.                                    |
| Config/source edits become stale in dev           | Medium | Disable config module cache, watch all inputs, and restart Slidev on changes.                                            |
| Migration silently changes demo snapshots         | High   | Treat active payloads as authoritative, compare resolved snapshots, and fail on unsupported deletion.                    |
| npm name is claimed before release                | Medium | Recheck immediately before publish; fall back to `@nirtamir2/slidev-addon-sandpack` only with owner approval.            |
| Root AGPL license creates ambiguity               | Medium | Ship an explicit package-level MIT license and matching npm metadata.                                                    |
| Gallery listing cannot precede npm publication    | Low    | Prepare the exact gallery object and submit after the public package/repository are reachable.                           |

## Project-wide Definition of Done

- Behavior is covered by focused tests written before implementation.
- Package and public API type-check without root-hoisted undeclared dependencies.
- Example and migrated talk build with Slidev.
- Interactive behavior is verified in a real browser.
- Package tarball is installed and built in isolation.
- The Node, Slidev, and React compatibility claims are all exercised by the tarball matrix.
- Formatting, linting, tests, type-checks, and builds pass.
- Public documentation matches executable examples.
- User-owned unrelated changes remain preserved and unstaged unless explicitly included.
- No secrets, tokens, generated build output, or unrelated refactors enter the commit history.
- Release and gallery steps that require external credentials are clearly identified and safely gated.

## Open Questions

No product questions remain. The approved design fixes the package name, MIT license, Markdown syntax, preset model, runtime architecture, documentation, and release target. The exact Node floor is an evidence gate: retain Node 18 only if the isolated Slidev/Vite build proves it; otherwise publish the lowest tested version.
