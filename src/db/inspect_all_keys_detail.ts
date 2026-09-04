import fs from 'fs';
import { translations } from '../translations';

const en = translations['en'];
const kn = translations['kn'];
const hi = translations['hi'];

const allKeys = Object.keys(en);
console.log(`Total Keys: ${allKeys.length}`);

// Group by category
const groups: Record<string, string[]> = {};
allKeys.forEach((k) => {
  const prefix = k.split('.')[0];
  if (!groups[prefix]) groups[prefix] = [];
  groups[prefix].push(k);
});

console.log('Key breakdown by prefix:');
Object.entries(groups).forEach(([prefix, keys]) => {
  console.log(`  ${prefix.padEnd(15)}: ${keys.length} keys`);
});
