import fs from 'fs';
import path from 'path';

function scanDirectory(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        scanDirectory(filePath, fileList);
      }
    } else if (/\.(tsx|ts|jsx|js)$/.test(file)) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const kannadaRegex = /[\u0C80-\u0CFF]/;

const srcFiles = scanDirectory(path.join(process.cwd(), 'src'));
console.log(`Scanning ${srcFiles.length} files in src/ for hardcoded Kannada characters...\n`);

const results: Record<string, Array<{ line: number; text: string }>> = {};

for (const file of srcFiles) {
  // We expect Kannada inside translation dictionaries (e.g. translations/ or lang files)
  const isTranslationFile = file.includes('translations') || file.includes('languages');
  
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');

  lines.forEach((lineText, idx) => {
    if (kannadaRegex.test(lineText)) {
      const relPath = path.relative(process.cwd(), file);
      if (!results[relPath]) {
        results[relPath] = [];
      }
      results[relPath].push({ line: idx + 1, text: lineText.trim() });
    }
  });
}

for (const [file, occurrences] of Object.entries(results)) {
  console.log(`📄 ${file} (${occurrences.length} lines with Kannada):`);
  occurrences.slice(0, 8).forEach((occ) => {
    console.log(`   Line ${occ.line}: ${occ.text.substring(0, 100)}`);
  });
  if (occurrences.length > 8) {
    console.log(`   ... and ${occurrences.length - 8} more lines`);
  }
  console.log('');
}
