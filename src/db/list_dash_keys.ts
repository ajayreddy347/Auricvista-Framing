import { translations } from '../translations';

const en = translations['en'];
const dashKeys = Object.keys(en).filter(k => k.startsWith('dash.') || k.startsWith('post.') || k.startsWith('farmer.'));

console.log(`Total Dashboard & Farmer keys in en: ${dashKeys.length}`);
dashKeys.forEach(k => {
  console.log(`  ${k}: "${en[k]}"`);
});
