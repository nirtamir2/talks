import { definePreparserSetup } from '@slidev/types'

export default definePreparserSetup(() => {
  return [
    {
      transformSlide(content, frontmatter) {
        // Find all sandpack blocks wrapped in @@@
        const sandpackRegex = /@@@\s*\n((?:```tsx sandpack[^\n]*\n[\s\S]*?\n```\s*)+)@@@/g;
        
        return content.replaceAll(sandpackRegex, (match, blocksContent) => {
          // Parse individual code blocks within the sandpack group
          const blockRegex = /```tsx sandpack(?:\s+([^\n]*))?\n([\s\S]*?)```/g;
          const files = [];
          let blockMatch;
          
          while ((blockMatch = blockRegex.exec(blocksContent)) !== null) {
            const [, attributes = '', code] = blockMatch;
            
            // Parse attributes
            const attrs = parseAttributes(attributes);
            const filename = attrs.file || 'App.tsx';
            const hidden = attrs.hidden !== undefined;
            
            // Create file object
            const fileObj = {
              [String(filename)]: {
                code: code.trim(),
                hidden
              }
            };
          
            
            files.push(fileObj);
          }
          
          // Generate the Playground component
          const filesJson = String.raw`${JSON.stringify(files)}`.replaceAll('"', '&quot;');
          return `<FilesPlayground :files="${filesJson}"/>`;
        });
      }
    }
  ];
});

function parseAttributes(attributeString: string): Record<string, string | boolean> {
  const attrs: Record<string, string | boolean> = {};
  
  if (!attributeString.trim()) {
    return attrs;
  }
  
  // Parse key=value pairs and standalone flags
  const parts = attributeString.trim().split(/\s+/);
  
  for (const part of parts) {
    if (part.includes('=')) {
      const [key, ...valueParts] = part.split('=');
      let value = valueParts.join('=');
      
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      // Convert numeric strings to numbers for index
      attrs[key] = key === 'index' && /^\d+$/.test(value) ? value : value;
    } else {
      // Standalone attribute (like 'hidden')
      attrs[part] = true;
    }
  }
  
  return attrs;
}