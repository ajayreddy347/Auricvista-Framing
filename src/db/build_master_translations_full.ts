import fs from 'fs';
import path from 'path';
import { translations as curr } from '../translations';

// Extract base dictionaries
const en: Record<string, string> = { ...curr['en'] };
const kn: Record<string, string> = { ...curr['kn'] };
const hi: Record<string, string> = { ...curr['hi'] };
const te: Record<string, string> = { ...curr['te'] };
const ta: Record<string, string> = { ...curr['ta'] };
const ml: Record<string, string> = { ...curr['ml'] };
const bn: Record<string, string> = { ...curr['bn'] };
const mr: Record<string, string> = { ...curr['mr'] };
const gu: Record<string, string> = { ...curr['gu'] };
const pa: Record<string, string> = { ...curr['pa'] };
const or_dict: Record<string, string> = { ...curr['or'] };
const as_dict: Record<string, string> = { ...curr['as'] };
const ur: Record<string, string> = { ...curr['ur'] };

// Add farmer & post produce keys to EN
const newFarmerKeys: Record<string, string> = {
  'farmer.addNewProduce': 'Add Produce',
  'farmer.totalCropsListed': 'Total Produce Listed',
  'farmer.availableStock': 'Available Stock',
  'farmer.ordersToHarvest': 'Orders to Harvest',
  'farmer.completedDeliveries': 'Completed Deliveries',
  'farmer.averagePatronScore': 'Average Customer Rating',
  'farmer.verifiedPatronRatings': 'Verified Customer Reviews',
  'farmer.speakProblem': 'Speak Your Problem',
  'farmer.speakProblemSubtitle': 'Tell Auric Arohi AI what is happening in your field.',
  'farmer.speakProblemDesc': 'Speak naturally in your native language. AI will diagnose crop symptoms and explain simple remedies in the same language.',
  'farmer.recording': 'Recording... Tap to Analyze',
  'farmer.tapAndSpeak': 'Tap & Speak Problem',
  'farmer.orTypeProblem': 'Or type your crop problem here (e.g., tomato leaves turning yellow)...',
  'farmer.analyzingCrop': 'Analyzing Crop Symptoms with Agronomy AI...',
  'farmer.adviceTitle': 'Agronomic Diagnosis & Remediation',
  'farmer.kvkNote': 'Consult your nearest Krishi Vigyan Kendra (KVK) if symptoms persist.',
  'farmer.nonChemicalNote': 'All recommendations are non-chemical and safe for organic certification.',
  'farmer.speechNotSupported': 'Voice recognition is not supported in this browser. You can type your problem below.',
  'farmer.voiceIssue': 'Sorry, I could not hear that clearly. Please tap and speak again or type below.',
  'farmer.micPermission': 'Microphone permission is required to speak.',
  'farmer.myCropsTab': 'My Crops & Produce',
  'farmer.customerOrdersTab': 'Customer Orders',
  'farmer.patronRatingsTab': 'Customer Reviews',
  'farmer.farmLocationTab': 'Farm Coordinates & Map',
  'farmer.searchCrops': 'Search crops by name or category...',
  'farmer.inStock': 'In Stock',
  'farmer.lowStock': 'Low Stock',
  'farmer.soldOut': 'Sold Out',
  'farmer.noCropsYet': 'No Produce Listed Yet',
  'farmer.noCropsSub': 'Add your fresh dawn-harvested crops so regional buyers can purchase them directly.',
  'farmer.addFirstCrop': 'Add First Produce',
  'farmer.pricePerUnit': 'Price per Unit',
  'farmer.availableQuantity': 'Available Quantity',
  'farmer.availableToSell': 'Available to sell',
  'farmer.editProduceTitle': 'Edit Produce Stock & Price',
  'farmer.changePriceOrStock': 'Update your direct selling price and stock in real time.',
  'farmer.noOrdersYet': 'No Incoming Orders',
  'farmer.noOrdersSub': 'New customer orders for your harvest will appear here for preparation and delivery.',
  'farmer.orderNum': 'Order #',
  'farmer.customer': 'Customer',
  'farmer.destination': 'Destination',
  'farmer.currentStep': 'Current Step',
  'farmer.stepPlacedExpl': 'Customer placed direct harvest order in PostgreSQL.',
  'farmer.stepHarvestingExpl': 'Farmer is gathering and packing fresh harvest at the farm.',
  'farmer.stepDispatchedExpl': 'Order is in transit with verified delivery dispatch.',
  'farmer.stepDeliveredExpl': 'Customer safely received fresh harvest.',
  'farmer.startHarvestBtn': 'Start Dawn Harvest',
  'farmer.markDispatchedBtn': 'Mark as Dispatched',
  'farmer.customerReviewsCount': 'customer reviews verified',
  'common.cancel': 'Cancel',
  'common.saveChanges': 'Save Changes',
  'common.saving': 'Saving...',
  'common.farmerId': 'Farmer ID',
  'post.title': 'Post New Produce',
  'post.subtitle': 'List your morning harvest directly on Auric Arohi for regional customers.',
  'post.cropName': 'Crop / Produce Name',
  'post.category': 'Category',
  'post.pricePerUnit': 'Price per Unit (₹)',
  'post.quantity': 'Total Available Quantity',
  'post.description': 'Produce Description & Cultivation Details',
  'post.descPlaceholder': 'Describe how this crop was cultivated, soil health, variety, etc.',
  'post.generateDescAi': 'Generate AI Description',
  'post.generatingDesc': 'Generating AI Description...',
  'post.aiDescSuccess': 'AI harvest story generated successfully!',
  'post.errorName': 'Please enter a valid crop name.',
  'post.errorNameFirst': 'Please enter a crop name first to generate an AI description.',
  'post.errorPrice': 'Please enter a valid price greater than 0.',
  'post.errorQuantity': 'Please enter a valid quantity of at least 1.',
  'post.errorLocation': 'Please provide the farm cultivation location.',
  'post.errorHarvestDate': 'Please provide the harvest date.',
  'post.errorDescription': 'Please provide cultivation details or use AI description.',
  'post.submit': 'Publish Produce to Marketplace',
  'post.publishing': 'Publishing Produce...',
  'post.success': 'Produce listing created and synchronized with PostgreSQL!',
};

Object.assign(en, newFarmerKeys);

// Full list of keys
const allKeys = Object.keys(en);
console.log(`Master Keys Count: ${allKeys.length}`);

// Function to fill missing keys from fallback language
function fillLanguage(langDict: Record<string, string>, fallbackDict: Record<string, string>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const k of allKeys) {
    result[k] = langDict[k] || fallbackDict[k] || en[k];
  }
  return result;
}

const finalKn = fillLanguage(kn, en);
const finalHi = fillLanguage(hi, en);
const finalTe = fillLanguage(te, en);
const finalTa = fillLanguage(ta, en);
const finalMl = fillLanguage(ml, en);
const finalBn = fillLanguage(bn, hi);
const finalMr = fillLanguage(mr, hi);
const finalGu = fillLanguage(gu, hi);
const finalPa = fillLanguage(pa, hi);
const finalOr = fillLanguage(or_dict, hi);
const finalAs = fillLanguage(as_dict, finalBn);
const finalUr = fillLanguage(ur, hi);

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
  en: ${JSON.stringify(en, null, 2)},
  kn: ${JSON.stringify(finalKn, null, 2)},
  hi: ${JSON.stringify(finalHi, null, 2)},
  te: ${JSON.stringify(finalTe, null, 2)},
  ta: ${JSON.stringify(finalTa, null, 2)},
  ml: ${JSON.stringify(finalMl, null, 2)},
  bn: ${JSON.stringify(finalBn, null, 2)},
  mr: ${JSON.stringify(finalMr, null, 2)},
  gu: ${JSON.stringify(finalGu, null, 2)},
  pa: ${JSON.stringify(finalPa, null, 2)},
  or: ${JSON.stringify(finalOr, null, 2)},
  as: ${JSON.stringify(finalAs, null, 2)},
  ur: ${JSON.stringify(finalUr, null, 2)},
};
`;

fs.writeFileSync(path.join(process.cwd(), 'src/translations/index.ts'), fileContent, 'utf-8');
console.log('Successfully generated complete 13-language index.ts with 100% key coverage!');
