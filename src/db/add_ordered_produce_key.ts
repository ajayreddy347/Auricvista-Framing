import fs from 'fs';
import path from 'path';
import { translations as curr, SUPPORTED_LANGUAGES } from '../translations';

const orderedKey: Record<string, string> = {
  en: "Ordered Produce",
  kn: "ಆರ್ಡರ್ ಮಾಡಿದ ಉತ್ಪನ್ನಗಳು",
  hi: "ऑर्डर की गई उपज",
  te: "ఆర్డర్ చేసిన ఉత్పత్తులు",
  ta: "ஆர்டர் செய்யப்பட்ட விளைபொருட்கள்",
  ml: "ഓർഡർ ചെയ്ത ഉൽപ്പന്നങ്ങൾ",
  bn: "অর্ডারকৃত ফসল",
  mr: "ऑर्डर केलेली पिके",
  gu: "ઓર્ડર કરેલ ઉત્પાદન",
  pa: "ਆਰਡਰ ਕੀਤੇ ਉਤਪਾਦ",
  or: "ଅର୍ଡର ହୋଇଥିବା ଫସଲ",
  as: "অৰ্ডাৰ কৰা শস্য",
  ur: "آرڈر کی گئی پیداوار",
};

const languages = ['en', 'kn', 'hi', 'te', 'ta', 'ml', 'bn', 'mr', 'gu', 'pa', 'or', 'as', 'ur'] as const;

for (const lang of languages) {
  if (curr[lang]) {
    curr[lang]['farmer.orderedProduce'] = orderedKey[lang];
  }
}

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
console.log('Successfully updated translations with farmer.orderedProduce!');
