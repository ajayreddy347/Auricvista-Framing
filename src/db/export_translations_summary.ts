import fs from 'fs';
import path from 'path';

const content = fs.readFileSync(path.join(process.cwd(), 'src/translations/index.ts'), 'utf-8');
const lines = content.split('\n');

console.log(`Total lines in index.ts: ${lines.length}`);
lines.forEach((line, idx) => {
  if (line.match(/^\s*(en|kn|hi|te|ta|ml|bn|mr|gu|pa|or|as|ur):\s*\{/)) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
