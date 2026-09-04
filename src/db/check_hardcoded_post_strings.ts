import fs from 'fs';
import path from 'path';

const content = fs.readFileSync(path.join(process.cwd(), 'src/pages/PostProducePage.tsx'), 'utf-8');
const lines = content.split('\n');

console.log('Scanning PostProducePage.tsx for raw strings...');
lines.forEach((line, idx) => {
  const trimmed = line.trim();
  if (
    trimmed.startsWith('<span>') ||
    trimmed.startsWith('<p>') ||
    trimmed.startsWith('<h3>') ||
    trimmed.startsWith('<h2>') ||
    trimmed.startsWith('<h1>') ||
    trimmed.startsWith('<button') ||
    trimmed.startsWith('<label')
  ) {
    if (!trimmed.includes('t(') && !trimmed.includes('{') && !trimmed.includes('/>') && trimmed.length > 10) {
      console.log(`Line ${idx + 1}: ${trimmed}`);
    }
  }
});
console.log('Scan complete.');
