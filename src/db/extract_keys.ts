import fs from 'fs';
import path from 'path';

const files = [
  'src/components/FarmerDashboardSection.tsx',
  'src/pages/FarmerDashboardPage.tsx',
  'src/pages/PostProducePage.tsx',
  'src/components/AIQualityInspector.tsx',
];

const foundKeys = new Set<string>();

files.forEach(file => {
  const content = fs.readFileSync(path.join(process.cwd(), file), 'utf-8');
  const matches = content.matchAll(/t\(\s*['"]([^'"]+)['"]/g);
  for (const match of matches) {
    foundKeys.add(match[1]);
  }
});

console.log(`Found ${foundKeys.size} distinct translation keys in Farmer Dashboard files:`);
Array.from(foundKeys).sort().forEach(k => console.log('  ', k));
