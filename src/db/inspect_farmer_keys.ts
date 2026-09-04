import { translations } from '../translations';

const en = translations['en'];
const kn = translations['kn'];
const hi = translations['hi'];

const farmerKeys = Object.keys(en).filter(k => k.startsWith('farmer.'));
console.log(`Total farmer. keys: ${farmerKeys.length}`);
farmerKeys.forEach(k => {
  console.log(`\nKey: ${k}`);
  console.log(`  EN: "${en[k]}"`);
  console.log(`  KN: "${kn[k] || 'MISSING'}"`);
  console.log(`  HI: "${hi[k] || 'MISSING'}"`);
});
