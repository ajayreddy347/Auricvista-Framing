import { translations, SUPPORTED_LANGUAGES, LanguageCode } from '../translations';

console.log('================================================================================');
console.log('FULL TRANSLATION AUDIT ACROSS ALL 13 LANGUAGES');
console.log('================================================================================\n');

const enKeys = Object.keys(translations.en);
console.log(`Total Keys in English base: ${enKeys.length}\n`);

let allPass = true;

for (const langMeta of SUPPORTED_LANGUAGES) {
  const code = langMeta.code as LanguageCode;
  const dict = translations[code] || {};
  const currentKeys = Object.keys(dict);
  const missingKeys = enKeys.filter(k => !dict[k] || dict[k].trim() === '');

  const percent = ((currentKeys.length / enKeys.length) * 100).toFixed(1);
  console.log(`[${code.toUpperCase().padEnd(3)}] ${langMeta.nativeName.padEnd(14)} (${langMeta.label.padEnd(12)}): ${currentKeys.length}/${enKeys.length} keys (${percent}%) - Missing: ${missingKeys.length}`);
  
  if (missingKeys.length > 0) {
    allPass = false;
    console.log(`     Missing sample: ${missingKeys.slice(0, 5).join(', ')}`);
  }
}

console.log('\n================================================================================');
if (allPass) {
  console.log('✅ ALL 13 LANGUAGES PASS 100% WITH ZERO MISSING KEYS!');
} else {
  console.log('❌ SOME LANGUAGES HAVE MISSING KEYS');
}
console.log('================================================================================\n');
