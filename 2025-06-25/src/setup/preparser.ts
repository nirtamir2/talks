import { definePreparserSetup } from "@slidev/types";

type FileObject = Record<
  string,
  {
    code: string;
    hidden: boolean;
  }
>;

interface ParsedAttributes {
  [key: string]: string | boolean | undefined;
  file?: string;
  hidden?: boolean;
}

const SANDPACK_BLOCK_REGEX =
  /@@@\s*\n((?:```tsx sandpack[^\n]*\n[\s\S]*?\n```\s*)+)@@@/g;
// eslint-disable-next-line sonarjs/slow-regex, regexp/no-super-linear-backtracking
const CODE_BLOCK_REGEX = /```tsx sandpack(?:\s+([^\n]*))?\n([\s\S]*?)```/g;

export default definePreparserSetup(() => {
  return [
    {
      async transformSlide(content) {
        return content.replaceAll(SANDPACK_BLOCK_REGEX, transformSandpackBlock);
      },
    },
  ];
});

function transformSandpackBlock(_match: string, blocksContent: string): string {
  const files = extractFilesFromBlocks(blocksContent);
  const filesJson = JSON.stringify(files).replaceAll('"', "&quot;");
  // eslint-disable-next-line github/unescaped-html-literal
  return `<FilesPlayground :files="${filesJson}"/>`;
}

function createFileObject(attributes: string, code: string): FileObject {
  const attrs = parseAttributes(attributes);
  const filename = attrs.file || "App.tsx";
  const hidden = attrs.hidden !== undefined;

  return {
    [filename]: {
      code: code.trim(),
      hidden,
    },
  };
}

function extractFilesFromBlocks(blocksContent: string): Array<FileObject> {
  return [...blocksContent.matchAll(CODE_BLOCK_REGEX)].map(
    ([, attributes = "", code]) => createFileObject(attributes, code),
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
