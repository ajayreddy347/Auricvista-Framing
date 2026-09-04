import fs from 'fs';
import path from 'path';
import { translations as curr } from '../translations';

const audioKeys: Record<string, Record<string, string>> = {
  'farmer.speakingAloud': {
    en: 'Speaking Answer Aloud 🔊',
    kn: 'ಧ್ವನಿ ಮೂಲಕ ಉತ್ತರಿಸಲಾಗುತ್ತಿದೆ 🔊',
    hi: 'उत्तर बोलकर सुनाया जा रहा है 🔊',
    te: 'సమాధానం ధ్వని రూపంలో చెప్పబడుతోంది 🔊',
    ta: 'பதில் குரல் வழியே ஒலிக்கிறது 🔊',
    ml: 'ശബ്ദത്തിൽ ഉത്തരം നൽകുന്നു 🔊',
    bn: 'উত্তর পড়ে শোনানো হচ্ছে 🔊',
    mr: 'उत्तर वाचून दाखवले जात आहे 🔊',
    gu: 'જવાબ બોલીને સંભળાવવામાં આવી રહ્યો છે 🔊',
    pa: 'ਜਵਾਬ ਬੋਲ ਕੇ ਸੁਣਾਇਆ ਜਾ ਰਿਹਾ ਹੈ 🔊',
    or: 'ଉତ୍ତର ପଢ଼ି ଶୁଣାଯାଉଛି 🔊',
    as: 'উত্তৰটো পঢ়ি শুনোৱা হৈছে 🔊',
    ur: 'جواب بول کر سنایا جا رہا ہے 🔊',
  },
  'farmer.replayVoice': {
    en: 'Replay Voice 🔊',
    kn: 'ಮತ್ತೆ ಆಲಿಸಿ 🔊',
    hi: 'पुनः सुनें 🔊',
    te: 'మళ్లీ వినండి 🔊',
    ta: 'மீண்டும் கேட்கவும் 🔊',
    ml: 'വീണ്ടും കേൾക്കുക 🔊',
    bn: 'আবার শুনুন 🔊',
    mr: 'पुन्हा ऐका 🔊',
    gu: 'ફરી સાંભળો 🔊',
    pa: 'ਦੁਬਾਰਾ ਸੁਣੋ 🔊',
    or: 'ପୁଣି ଶୁଣନ୍ତୁ 🔊',
    as: 'পুনৰ শুনক 🔊',
    ur: 'دوبارہ سنیں 🔊',
  },
  'farmer.stopAudio': {
    en: 'Stop',
    kn: 'ನಿಲ್ಲಿಸಿ',
    hi: 'रोकें',
    te: 'ఆపండి',
    ta: 'நிறுத்து',
    ml: 'നിർത്തുക',
    bn: 'থামান',
    mr: 'थांबवा',
    gu: 'રોકો',
    pa: 'ਰੋਕੋ',
    or: 'ବନ୍ଦ କରନ୍ତୁ',
    as: 'বন্ধ কৰক',
    ur: 'روکیں',
  },
};

const languages = ['en', 'kn', 'hi', 'te', 'ta', 'ml', 'bn', 'mr', 'gu', 'pa', 'or', 'as', 'ur'] as const;

for (const [key, langMap] of Object.entries(audioKeys)) {
  for (const lang of languages) {
    if (curr[lang]) {
      curr[lang][key] = langMap[lang] || langMap['en'];
    }
  }
}

// Write index.ts
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
  en: ${JSON.stringify(curr.en, null, 2)},
  kn: ${JSON.stringify(curr.kn, null, 2)},
  hi: ${JSON.stringify(curr.hi, null, 2)},
  te: ${JSON.stringify(curr.te, null, 2)},
  ta: ${JSON.stringify(curr.ta, null, 2)},
  ml: ${JSON.stringify(curr.ml, null, 2)},
  bn: ${JSON.stringify(curr.bn, null, 2)},
  mr: ${JSON.stringify(curr.mr, null, 2)},
  gu: ${JSON.stringify(curr.gu, null, 2)},
  pa: ${JSON.stringify(curr.pa, null, 2)},
  or: ${JSON.stringify(curr.or, null, 2)},
  as: ${JSON.stringify(curr.as, null, 2)},
  ur: ${JSON.stringify(curr.ur, null, 2)},
};
`;

fs.writeFileSync(path.join(process.cwd(), 'src/translations/index.ts'), fileContent, 'utf-8');
console.log('Successfully added audio translation keys across all 13 languages!');
