import fs from 'fs';
import path from 'path';
import { translations as curr } from '../translations';

const nativeStatusTranslations: Record<string, Record<string, string>> = {
  'order.placed': {
    en: 'Placed',
    kn: 'ಸ್ವೀಕರಿಸಲಾಗಿದೆ',
    hi: 'ऑर्डर दर्ज',
    te: 'ఆర్డర్ స్వీకరించబడింది',
    ta: 'ஆர்டர் பெறப்பட்டது',
    ml: 'ഓർഡർ ലഭിച്ചു',
    bn: 'অর্ডার গৃহীত',
    mr: 'ऑर्डर मिळाली',
    gu: 'ઓર્ડર મળ્યો',
    pa: 'ਆਰਡਰ ਪ੍ਰਾਪਤ ਹੋਇਆ',
    or: 'ଅର୍ଡର ଗ୍ରହଣ କରାଗଲା',
    as: 'অৰ্ডাৰ লাভ হ’ল',
    ur: 'آرڈر موصول ہوا',
  },
  'order.harvesting': {
    en: 'Harvesting',
    kn: 'ಕೊಯ್ಲು ಹಂತದಲ್ಲಿದೆ',
    hi: 'कटाई जारी',
    te: 'పంట కోత దశలో ఉంది',
    ta: 'அறுவடை செய்யப்படுகிறது',
    ml: 'വിളവെടുക്കുന്നു',
    bn: 'ফসল কাটা হচ্ছে',
    mr: 'कापणी सुरू आहे',
    gu: 'લણણી ચાલુ છે',
    pa: 'ਵਾਢੀ ਜਾਰੀ ਹੈ',
    or: 'ଅମଳ ଚାଲିଛି',
    as: 'শস্য চপোৱা হৈছে',
    ur: 'کٹائی جاری ہے',
  },
  'order.dispatched': {
    en: 'Dispatched',
    kn: 'ರವಾನಿಸಲಾಗಿದೆ',
    hi: 'भेज दिया गया',
    te: 'రవాణా చేయబడింది',
    ta: 'அனுப்பப்பட்டது',
    ml: 'അയച്ചു',
    bn: 'পাঠানো হয়েছে',
    mr: 'पाठवले आहे',
    gu: 'રવાના થઈ ગયું',
    pa: 'ਰਵਾਨਾ ਕਰ ਦਿੱਤਾ ਗਿਆ',
    or: 'ପଠାଯାଇଛି',
    as: 'প্ৰেৰণ কৰা হৈছে',
    ur: 'روانہ کر دیا گیا',
  },
  'order.delivered': {
    en: 'Delivered',
    kn: 'ತಲುಪಿಸಲಾಗಿದೆ',
    hi: 'डिलीवर हो गया',
    te: 'డెలివరీ చేయబడింది',
    ta: 'டெலிவரி செய்யப்பட்டது',
    ml: 'ഡെലിവറി ചെയ്തു',
    bn: 'ডেলিভারি হয়েছে',
    mr: 'पोहोचवले आहे',
    gu: 'ડિલિવર થઈ ગયું',
    pa: 'ਡਿਲੀਵਰ ਹੋ ਗਿਆ',
    or: 'ପହଞ୍ଚିସାରିଛି',
    as: 'বিতৰণ কৰা হ’ল',
    ur: 'پہنچا دیا گیا',
  },
  'order.cancelled': {
    en: 'Cancelled',
    kn: 'ರದ್ದುಗೊಳಿಸಲಾಗಿದೆ',
    hi: 'रद्द कर दिया गया',
    te: 'రద్దు చేయబడింది',
    ta: 'ரத்து செய்யப்பட்டது',
    ml: 'റദ്ദാക്കി',
    bn: 'বাতিল হয়েছে',
    mr: 'रद्द केले',
    gu: 'રદ કરવામાં આવ્યું',
    pa: 'ਰੱਦ ਕਰ ਦਿੱਤਾ ਗਿਆ',
    or: 'ବାତିଲ୍ ହୋଇଛି',
    as: 'বাতিল কৰা হ’ল',
    ur: 'منسوخ کر دیا گیا',
  },
};

const languages = ['en', 'kn', 'hi', 'te', 'ta', 'ml', 'bn', 'mr', 'gu', 'pa', 'or', 'as', 'ur'] as const;

for (const [key, langMap] of Object.entries(nativeStatusTranslations)) {
  for (const lang of languages) {
    if (curr[lang]) {
      curr[lang][key] = langMap[lang] || langMap['en'];
    }
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
console.log('Successfully updated status native translations for all 13 languages!');
