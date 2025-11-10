import { definePreparserSetup } from "@slidev/types";
import { html } from "code-tag";

type FileObject = {
  index: number;
  data: Record<
    string,
    {
      code: string;
      hidden: boolean;
      active: boolean;
      attrs: Record<string, unknown>;
      blocksContent: string;
    }
  >;
};

interface ParsedAttributes {
  [key: string]: unknown; // Allow any other attributes
  file?: string;
  index?: number;
  hidden?: boolean;
  active?: boolean;
}

const SANDPACK_BLOCK_REGEX =
  /@@@\s*\n((?:```tsx sandpack[^\n]*\n[\s\S]*?\n```\s*)+)@@@/g;
// eslint-disable-next-line sonarjs/slow-regex, regexp/no-super-linear-backtracking
const CODE_BLOCK_REGEX = /```tsx sandpack(?:\s+([^\n]*))?\n([\s\S]*?)```/g;

export default definePreparserSetup(() => {
  return [
    {
      name: "sandpack @@@",
      async transformSlide(content) {
        return content.replaceAll(SANDPACK_BLOCK_REGEX, transformSandpackBlock);
      },
    },
  ];
});

function transformSandpackBlock(match: string, blocksContent: string): string {
  const files = mergeByIndex(extractFilesFromBlocks(blocksContent));
  const filesJson = JSON.stringify(files).replaceAll('"', "&quot;");
  
  // const templates = files
  //   .flatMap((file, index) => {
  //     return Object.entries(file).map(([filename, data]) => {
  //       const codeWithTags = `\`\`\`tsx\n${data.code}\n\`\`\`\n`;
  //       return html`
  //         <template
  //           v-slot:index_${String(index)}_filename_${filename.replaceAll(
  //             ".",
  //             "_",
  //           )}
  //         >
  //           ${codeWithTags}
  //         </template>
  //       `;
  //     });
  //   })
  //   .join("\n");

  return html`<FilesPlayground :files="${filesJson}"> </FilesPlayground> `;
}

function createFileObject(
  attributes: string,
  code: string,
  blocksContent: string,
): FileObject {
  const attrs = parseAttributes(attributes);
  const filename = attrs.file || "App.tsx";
  const hidden = attrs.hidden !== undefined;
  const active = attrs.active !== undefined;
  const index = attrs.index ?? 0;

  return {
    index,
    data: {
      [filename]: {
        code: code.trim(),
        hidden,
        active,
        attrs,
        blocksContent,
      },
    },
  };
}

function extractFilesFromBlocks(blocksContent: string): Array<FileObject> {
  return [...blocksContent.matchAll(CODE_BLOCK_REGEX)].map(
    ([, attributes = "", code]) =>
      createFileObject(attributes, code, blocksContent),
  );
}

function parseAttributes(attributeString: string): ParsedAttributes {
  const attrs: ParsedAttributes = {};

  if (!attributeString.trim()) {
    return attrs;
  }

  const parts = attributeString.trim().split(/\s+/);

  for (const part of parts) {
    if (part.includes("=")) {
      const [key, ...valueParts] = part.split("=");
      let value = valueParts.join("=");

      // Remove surrounding quotes
      if (isQuoted(value)) {
        value = value.slice(1, -1);
      }

      attrs[key] = value;
    } else {
      // Standalone flag attribute
      attrs[part] = true;
    }
  }

  return attrs;
}

function isQuoted(value: string): boolean {
  return (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  );
}

interface Item<T> {
  index: number;
  data: T;
}

function mergeByIndex<T extends Record<string, unknown>>(
  items: Array<Item<T>>,
): Array<T | undefined> {
  const result: Array<T | undefined> = [];

  for (const item of items) {
    const { index, data } = item;
    result[index] =
      result[index] == null ? { ...data } : { ...result[index], ...data };
  }

  return result;
}
