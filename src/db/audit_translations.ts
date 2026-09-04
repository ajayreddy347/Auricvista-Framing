import { translations, SUPPORTED_LANGUAGES, LanguageCode } from '../translations';

console.log('\n================================================================================');
console.log('AURIC AROHI — 13-LANGUAGE TRANSLATION COVERAGE AUDIT');
console.log('================================================================================\n');

const allKeys = Object.keys(translations['en']);
console.log(`Total Keys in English dictionary: ${allKeys.length}\n`);

SUPPORTED_LANGUAGES.forEach((lang) => {
  const dict = translations[lang.code as LanguageCode] || {};
  const keysInLang = Object.keys(dict);
  const missingKeys = allKeys.filter((k) => !dict[k] || dict[k].trim() === '');
  const pct = ((keysInLang.length / allKeys.length) * 100).toFixed(1);

  console.log(`[${lang.code.toUpperCase().padEnd(3)}] ${lang.nativeName.padEnd(14)} (${lang.label.padEnd(12)}): ${keysInLang.length}/${allKeys.length} keys (${pct}%) - Missing: ${missingKeys.length}`);
  if (missingKeys.length > 0) {
    console.log(`     Sample missing keys:`, missingKeys.slice(0, 5).join(', '));
  }
});
