import * as fs from 'fs';
import * as glob from 'glob';
import { parse } from '@typescript-eslint/typescript-estree';

// Glob through the file tree for files ending in .ai.ts
const files = glob.sync("**/*.ai.ts");

let outputContent = '';

files.forEach((file) => {
  const content = fs.readFileSync(file, 'utf8');
  
  // Use AST to parse the TypeScript file
  const ast = parse(content, { loc: true });
  
  // Find the default export in the AST
  const defaultExportNode = ast.body.find(
    (node: any) => node.type === 'ExportDefaultDeclaration'
  );

  // Check if a default export was found
  if (!defaultExportNode) {
    console.warn(`No default export in file ${file}`);
    return;
  }

  // Extract the default export name
  const defaultExportName = defaultExportNode.declaration.name;

  // Append this to the output file content
  outputContent += `export type ${defaultExportName}_ai = Parameters<typeof ${defaultExportName}>[0] extends Edge<infer T> ? T : never;\n`;
});

// Write to the output file
fs.writeFileSync('output.ts', outputContent);

console.log('Completed.');
