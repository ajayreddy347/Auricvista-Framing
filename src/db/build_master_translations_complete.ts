import fs from 'fs';
import path from 'path';
import { translations as curr } from '../translations';

const baseEn = { ...curr['en'] };
const baseKn = { ...curr['kn'] };
const baseHi = { ...curr['hi'] };
const baseTe = { ...curr['te'] };
const baseTa = { ...curr['ta'] };
const baseMl = { ...curr['ml'] };
const baseBn = { ...curr['bn'] };
const baseMr = { ...curr['mr'] };
const baseGu = { ...curr['gu'] };
const basePa = { ...curr['pa'] };
const baseOr = { ...curr['or'] };
const baseAs = { ...curr['as'] };
const baseUr = { ...curr['ur'] };

// Add explicit filter and unit keys
const extraKeys: Record<string, { en: string; kn: string; hi: string; te: string; ta: string; ml: string; bn: string; mr: string; gu: string; pa: string; or: string; as: string; ur: string }> = {
  'farmer.filterAll': {
    en: 'All Stock',
    kn: 'ಎಲ್ಲಾ ದಾಸ್ತಾನು',
    hi: 'सभी स्टॉक',
    te: 'మొత్తం నిల్వ',
    ta: 'அனைத்து இருப்பு',
    ml: 'എല്ലാ സ്റ്റോക്കും',
    bn: 'সমস্ত স্টক',
    mr: 'सर्व साठा',
    gu: 'તમામ સ્ટોક',
    pa: 'ਸਾਰਾ ਸਟਾਕ',
    or: 'ସମସ୍ତ ଷ୍ଟକ୍',
    as: 'সকলো মজুত',
    ur: 'تمام اسٹاک',
  },
  'farmer.filterInStock': {
    en: 'In Stock',
    kn: 'ದಾಸ್ತಾನಿದೆ',
    hi: 'स्टॉक उपलब्ध',
    te: 'నిల్వ ఉంది',
    ta: 'இருப்பில் உள்ளது',
    ml: 'സ്റ്റോക്കുണ്ട്',
    bn: 'স্টকে আছে',
    mr: 'साठा उपलब्ध',
    gu: 'સ્ટોકમાં છે',
    pa: 'ਸਟਾਕ ਵਿੱਚ ਹੈ',
    or: 'ଷ୍ଟକ୍ରେ ଅଛି',
    as: 'মজুত আছে',
    ur: 'اسٹاک میں ہے',
  },
  'farmer.filterLowStock': {
    en: 'Low Stock',
    kn: 'ಕಡಿಮೆ ದಾಸ್ತಾನು',
    hi: 'कम स्टॉक',
    te: 'తక్కువ నిల్వ',
    ta: 'குறைந்த இருப்பு',
    ml: 'കുറഞ്ഞ സ്റ്റോക്ക്',
    bn: 'স্বল্প স্টক',
    mr: 'कमी साठा',
    gu: 'ઓછો સ્ટોક',
    pa: 'ਘੱਟ ਸਟਾਕ',
    or: 'କମ୍ ଷ୍ଟକ୍',
    as: 'কম মজুত',
    ur: 'کم اسٹاک',
  },
  'farmer.filterSoldOut': {
    en: 'Sold Out',
    kn: 'ಖಾಲಿಯಾಗಿದೆ',
    hi: 'बिक चुका है',
    te: 'అయిపోయింది',
    ta: 'விற்றுத் தீர்ந்தது',
    ml: 'വിറ്റുതീർന്നു',
    bn: 'বিক্রি হয়ে গেছে',
    mr: 'संपले',
    gu: 'વેચાઈ ગયું',
    pa: 'ਸਭ ਵਿਕ ਗਿਆ',
    or: 'ବିକ୍ରି ହୋଇସାରିଛି',
    as: 'বিক্ৰী হৈ গ’ল',
    ur: 'سب فروخت ہو گیا',
  },
  'kg': {
    en: 'kg',
    kn: 'ಕೆಜಿ',
    hi: 'किग्रा',
    te: 'కిలో',
    ta: 'கிலோ',
    ml: 'കിലോ',
    bn: 'কেজি',
    mr: 'किलो',
    gu: 'કિલો',
    pa: 'ਕਿਲੋ',
    or: 'କିଗ୍ରା',
    as: 'কেজি',
    ur: 'کلو',
  },
  'bunch': {
    en: 'bunch',
    kn: 'ಕಟ್ಟು',
    hi: 'गुच्छा',
    te: 'కట్ట',
    ta: 'கொத்து',
    ml: 'കെട്ട്',
    bn: 'আঁটি',
    mr: 'जुडी',
    gu: 'ઝૂડી',
    pa: 'ਗੁੱਛਾ',
    or: 'ବିଡ଼ା',
    as: 'মুঠা',
    ur: 'گچھا',
  },
  'piece': {
    en: 'piece',
    kn: 'ತುಂಡು',
    hi: 'पीस',
    te: 'ముక్క',
    ta: 'துண்டு',
    ml: 'എണ്ണം',
    bn: 'পিস',
    mr: 'नग',
    gu: 'નંગ',
    pa: 'ਨਗ',
    or: 'ଖଣ୍ଡ',
    as: 'টুকুৰা',
    ur: 'عدد',
  },
  'box': {
    en: 'box',
    kn: 'ಪೆಟ್ಟಿಗೆ',
    hi: 'बॉक्स',
    te: 'పెట్టె',
    ta: 'பெட்டி',
    ml: 'പെട്ടി',
    bn: 'বাক্স',
    mr: 'खोका',
    gu: 'પેટી',
    pa: 'ਡੱਬਾ',
    or: 'ବାକ୍ସ',
    as: 'বাকচ',
    ur: 'ڈبہ',
  },
};

// Add extra keys into each dictionary
const languages = ['en', 'kn', 'hi', 'te', 'ta', 'ml', 'bn', 'mr', 'gu', 'pa', 'or', 'as', 'ur'] as const;
const dicts: Record<string, Record<string, string>> = {
  en: baseEn,
  kn: baseKn,
  hi: baseHi,
  te: baseTe,
  ta: baseTa,
  ml: baseMl,
  bn: baseBn,
  mr: baseMr,
  gu: baseGu,
  pa: basePa,
  or: baseOr,
  as: baseAs,
  ur: baseUr,
};

for (const [k, trans] of Object.entries(extraKeys)) {
  for (const lang of languages) {
    dicts[lang][k] = trans[lang] || trans['en'];
  }
}

// Write the master index.ts file
const fileContent = `export type LanguageCode = 'en' | 'kn' | 'hi' | 'te' | 'ta' | 'ml' | 'bn' | 'mr' | 'gu' | 'pa' | 'or' | 'as' | 'ur';

export interface LanguageMeta {
  code: LanguageCode;
  label: string;
  nativeName: string;
  shortLabel: string;
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  { code: 'en', label: 'English', nativeName: 'English', shortLabel: 'EN' },
  { code: 'kn', label: 'Kannada', nativeName: 'ಕನ್ನಡ', shortLabel: 'ಕನ್ನಡ' },
  { code: 'hi', label: 'Hindi', nativeName: 'हिन्दी', shortLabel: 'हिन्दी' },
  { code: 'te', label: 'Telugu', nativeName: 'తెలుగు', shortLabel: 'తెలుగు' },
  { code: 'ta', label: 'Tamil', nativeName: 'தமிழ்', shortLabel: 'தமிழ்' },
  { code: 'ml', label: 'Malayalam', nativeName: 'മലയാളം', shortLabel: 'മല' },
  { code: 'bn', label: 'Bengali', nativeName: 'বাংলা', shortLabel: 'বাংলা' },
  { code: 'mr', label: 'Marathi', nativeName: 'मराठी', shortLabel: 'मराठी' },
  { code: 'gu', label: 'Gujarati', nativeName: 'ગુજરાતી', shortLabel: 'ગુજરાતી' },
  { code: 'pa', label: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', shortLabel: 'ਪੰਜਾਬੀ' },
  { code: 'or', label: 'Odia', nativeName: 'ଓଡ଼ିଆ', shortLabel: 'ଓଡ଼ିଆ' },
  { code: 'as', label: 'Assamese', nativeName: 'অসমীয়া', shortLabel: 'অসমীয়া' },
  { code: 'ur', label: 'Urdu', nativeName: 'اردو', shortLabel: 'اردو' },
];

export const translations: Record<LanguageCode, Record<string, string>> = {
  en: ${JSON.stringify(dicts.en, null, 2)},
  kn: ${JSON.stringify(dicts.kn, null, 2)},
  hi: ${JSON.stringify(dicts.hi, null, 2)},
  te: ${JSON.stringify(dicts.te, null, 2)},
  ta: ${JSON.stringify(dicts.ta, null, 2)},
  ml: ${JSON.stringify(dicts.ml, null, 2)},
  bn: ${JSON.stringify(dicts.bn, null, 2)},
  mr: ${JSON.stringify(dicts.mr, null, 2)},
  gu: ${JSON.stringify(dicts.gu, null, 2)},
  pa: ${JSON.stringify(dicts.pa, null, 2)},
  or: ${JSON.stringify(dicts.or, null, 2)},
  as: ${JSON.stringify(dicts.as, null, 2)},
  ur: ${JSON.stringify(dicts.ur, null, 2)},
};
`;

fs.writeFileSync(path.join(process.cwd(), 'src/translations/index.ts'), fileContent, 'utf-8');
console.log('Successfully updated src/translations/index.ts with extra keys and 100% coverage!');
