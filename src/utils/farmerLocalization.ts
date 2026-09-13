import { LanguageCode } from '../translations';
import { FarmerProfileData } from '../components/FarmerProfileModal';

export interface VerifiedFarmerConfig extends FarmerProfileData {
  userId: string;
  email: string;
  phone: string;
  bio: string;
}

export const VERIFIED_FARMERS_DIRECTORY: VerifiedFarmerConfig[] = [
  {
    id: 'ravi-kumar',
    userId: 'usr-ravi-kumar',
    farmerId: 'AV-FARM-1001',
    name: 'Ravi Kumar',
    role: 'Farmer',
    location: 'Chikkaballapur, Karnataka',
    experience: '18 years',
    specialty: 'Organic Vegetables & Native Roots',
    acreage: '14 Acres Certified Natural',
    initials: 'RK',
    highlightBadge: 'Master Grower',
    email: 'ravi.kumar@auricvista.farm',
    phone: '+91 98450 12890',
    bio: 'Pioneer of chemical-free heirloom vegetable cultivation in the fertile red loam soil of Chikkaballapur.',
  },
  {
    id: 'lakshmi-devi',
    userId: 'usr-lakshmi-devi',
    farmerId: 'AV-FARM-1002',
    name: 'Lakshmi Devi',
    role: 'Farmer',
    location: 'Kolar, Karnataka',
    experience: '12 years',
    specialty: 'Hydroponic Greens & Exotic Melons',
    acreage: '8 Acres Precision Soil',
    initials: 'LD',
    highlightBadge: 'Zero Pesticide Pioneer',
    email: 'lakshmi.devi@auricvista.farm',
    phone: '+91 94480 34120',
    bio: 'Specializes in nutrient-rich cold-water hydroponics and naturally ripened table fruits.',
  },
  {
    id: 'suresh-naidu',
    userId: 'usr-suresh-naidu',
    farmerId: 'AV-FARM-1003',
    name: 'Suresh Naidu',
    role: 'Farmer',
    location: 'Hosur Agro Ridge, Tamil Nadu',
    experience: '22 years',
    specialty: 'Heritage Millets, Pulses & Native Grains',
    acreage: '26 Acres Ancestral Farm',
    initials: 'SN',
    highlightBadge: 'Heritage Cultivator',
    email: 'suresh.naidu@auricvista.farm',
    phone: '+91 98860 78234',
    bio: 'Preserves native drought-resistant millet seeds and unpolished heirloom lentils without synthetic chemicals.',
  },
  {
    id: 'nitin-patil',
    userId: 'usr-nitin-patil',
    farmerId: 'AV-FARM-1004',
    name: 'Nitin Patil',
    role: 'Farmer',
    location: 'Ratnagiri & Mahabaleshwar, Maharashtra',
    experience: '25 years',
    specialty: 'GI-Tagged Alphonso Mangoes & Coastal Berries',
    acreage: '30 Acres Coastal Laterite Soil',
    initials: 'NP',
    highlightBadge: 'GI Tagged Specialist',
    email: 'nitin.patil@auricvista.farm',
    phone: '+91 98220 54321',
    bio: 'Award-winning Alphonso grower adhering strictly to tree-ripened, calcium-carbide-free harvesting.',
  },
  {
    id: 'balwinder-singh',
    userId: 'usr-balwinder-singh',
    farmerId: 'AV-FARM-1005',
    name: 'Balwinder Singh',
    role: 'Farmer',
    location: 'Ludhiana, Punjab',
    experience: '30 years',
    specialty: 'Organic Golden Wheat & Long-Grain Grains',
    acreage: '45 Acres Alluvial Soil',
    initials: 'BS',
    highlightBadge: 'Grain Champion',
    email: 'balwinder.singh@auricvista.farm',
    phone: '+91 98140 67890',
    bio: 'Dedicated to soil microbiology restoration and non-GMO high-protein wheat and aromatic long-grain paddy.',
  },
  {
    id: 'kavita-patel',
    userId: 'usr-kavita-patel',
    farmerId: 'AV-FARM-1006',
    name: 'Kavita Patel',
    role: 'Farmer',
    location: 'Unjha & Junagadh, Gujarat',
    experience: '15 years',
    specialty: 'Sun-Dried Cumin, Garlic & Cold-Pressed Groundnut Oil',
    acreage: '18 Acres Saurashtra Black Soil',
    initials: 'KP',
    highlightBadge: 'Spice Guild Master',
    email: 'kavita.patel@auricvista.farm',
    phone: '+91 98790 12345',
    bio: 'Produces export-quality unadulterated essential spices and single-origin wood-pressed edible oils.',
  },
  {
    id: 'mathew-joseph',
    userId: 'usr-mathew-joseph',
    farmerId: 'AV-FARM-1007',
    name: 'Mathew Joseph',
    role: 'Farmer',
    location: 'Wayanad & Idukki, Kerala',
    experience: '20 years',
    specialty: 'High-Altitude Spices & Virgin Coconut Oil',
    acreage: '22 Acres High Range Agro-Forest',
    initials: 'MJ',
    highlightBadge: 'Rainforest Certified',
    email: 'mathew.joseph@auricvista.farm',
    phone: '+91 94470 98765',
    bio: 'Cultivates biodiversity-shaded spices in the misty Western Ghats under strict organic permaculture.',
  },
  {
    id: 'rameshwar-lal',
    userId: 'usr-rameshwar-lal',
    farmerId: 'AV-FARM-1008',
    name: 'Rameshwar Lal',
    role: 'Farmer',
    location: 'Nagaur & Jodhpur, Rajasthan',
    experience: '28 years',
    specialty: 'Aromatic Coriander, Methi & Desert Pulses',
    acreage: '35 Acres Arid Organic Soil',
    initials: 'RL',
    highlightBadge: 'Desert Farming Hero',
    email: 'rameshwar.lal@auricvista.farm',
    phone: '+91 94140 45678',
    bio: 'Harnesses traditional water harvesting to grow intensely fragrant desert spices and drought-hardy millets.',
  },
  {
    id: 'venkatesh-rao',
    userId: 'usr-venkatesh-rao',
    farmerId: 'AV-FARM-1009',
    name: 'Venkatesh Rao',
    role: 'Farmer',
    location: 'Guntur & Tenali, Andhra Pradesh',
    experience: '16 years',
    specialty: 'Direct Farm Chillies, Fresh Curry Leaves & Pulses',
    acreage: '20 Acres Krishna River Basin',
    initials: 'VR',
    highlightBadge: 'Delta Harvest Leader',
    email: 'venkatesh.rao@auricvista.farm',
    phone: '+91 98480 33445',
    bio: 'Supplies high-heat chemical-free chillies and fragrant culinary greens nurtured by rich river sediment.',
  },
  {
    id: 'gurpreet-chahal',
    userId: 'usr-gurpreet-chahal',
    farmerId: 'AV-FARM-1010',
    name: 'Gurpreet Chahal',
    role: 'Farmer',
    location: 'Shimla & Solan, Himachal Pradesh',
    experience: '19 years',
    specialty: 'High-Altitude Apples & Cold-Climate Vegetables',
    acreage: '16 Acres Mountain Terrace',
    initials: 'GC',
    highlightBadge: 'Himalayan Orchardist',
    email: 'gurpreet.chahal@auricvista.farm',
    phone: '+91 98160 88990',
    bio: 'Mountain-stream irrigated snow-climate apples and tender winter pods picked at peak sugar content.',
  },
  {
    id: 'subhash-mondal',
    userId: 'usr-subhash-mondal',
    farmerId: 'AV-FARM-1011',
    name: 'Subhash Mondal',
    role: 'Farmer',
    location: 'Sundarbans, West Bengal',
    experience: '24 years',
    specialty: 'Ethical Wild Mangrove Honey & Native Rice',
    acreage: '12 Acres Forest Fringe',
    initials: 'SM',
    highlightBadge: 'Bio-Heritage Guardian',
    email: 'subhash.mondal@auricvista.farm',
    phone: '+91 98300 22334',
    bio: 'Harvests unfiltered, unheated wild raw honey directly from mangrove floral blooms in the Sundarbans biosphere.',
  },
  {
    id: 'arunachalam-murugan',
    userId: 'usr-arunachalam-murugan',
    farmerId: 'AV-FARM-1012',
    name: 'Arunachalam Murugan',
    role: 'Farmer',
    location: 'Pollachi & Coimbatore, Tamil Nadu',
    experience: '21 years',
    specialty: 'Nutrient-Dense Coconuts, Moringa & Hill Roots',
    acreage: '28 Acres Foothill Loam',
    initials: 'AM',
    highlightBadge: 'Tree-Crop Specialist',
    email: 'arunachalam.murugan@auricvista.farm',
    phone: '+91 94430 77889',
    bio: 'Tender sweet coconuts and high-protein moringa pods cultivated with natural composting and drip irrigation.',
  },
  {
    id: 'pradip-deshmukh',
    userId: 'usr-pradip-deshmukh',
    farmerId: 'AV-FARM-1013',
    name: 'Pradip Deshmukh',
    role: 'Farmer',
    location: 'Nashik & Kolhapur, Maharashtra',
    experience: '26 years',
    specialty: 'Storage Onions, Table Grapes & Artisanal Jaggery',
    acreage: '32 Acres Sahyadri Foothill',
    initials: 'PD',
    highlightBadge: 'Agri-Processing Leader',
    email: 'pradip.deshmukh@auricvista.farm',
    phone: '+91 98230 11223',
    bio: 'Known for high-dry-matter storage onions, sweet table grapes, and preservative-free solid sugarcane jaggery.',
  },
  {
    id: 'ghulam-mir',
    userId: 'usr-ghulam-mir',
    farmerId: 'AV-FARM-1015',
    name: 'Ghulam Hassan Mir',
    role: 'Farmer',
    location: 'Pampore & Sopore, Jammu & Kashmir',
    experience: '35 years',
    specialty: 'GI-Tagged Pampore Saffron & Kashmiri Walnuts',
    acreage: '10 Acres Karewa Soil',
    initials: 'GM',
    highlightBadge: 'Heritage Saffron Master',
    email: 'ghulam.mir@auricvista.farm',
    phone: '+91 94190 66778',
    bio: 'Fourth-generation saffron grower picking purple crocus flowers by hand during the autumn dawn harvest.',
  },
];

/**
 * Resolve farmer configuration from produce listing, farmer ID, or farmer name
 */
export function findFarmerByListingOrName(farmerName?: string, farmerId?: string): FarmerProfileData {
  if (farmerId) {
    const cleanFid = farmerId.toUpperCase().trim();
    const found = VERIFIED_FARMERS_DIRECTORY.find((f) => f.farmerId.toUpperCase() === cleanFid || f.userId === farmerId);
    if (found) return found;
  }

  if (farmerName) {
    const lower = farmerName.toLowerCase().trim();
    const found = VERIFIED_FARMERS_DIRECTORY.find((f) => {
      const fName = f.name.toLowerCase();
      const fFirst = fName.split(' ')[0];
      return lower.includes(fName) || fName.includes(lower) || lower.includes(fFirst);
    });
    if (found) return found;
  }

  // Sensible default fallback
  return VERIFIED_FARMERS_DIRECTORY[0];
}

// =========================================================================
// MULTILINGUAL DICTIONARIES FOR FARMER DETAILS
// =========================================================================

const ROLE_TRANSLATIONS: Record<string, Record<LanguageCode, string>> = {
  'Farmer': {
    en: 'Farmer',
    kn: 'ರೈತ (ಕೃಷಿಕ)',
    hi: 'किसान',
    te: 'రైతు',
    ta: 'விவசாயி',
    ml: 'കർഷകൻ',
    bn: 'কৃষক',
    mr: 'शेतकरी',
    gu: 'ખેડૂત',
    pa: 'ਕਿਸਾਨ',
    or: 'କୃଷକ',
    as: 'কৃষক',
    ur: 'کسان',
  },
  'Verified Direct Grower': {
    en: 'Verified Direct Grower',
    kn: 'ದೃಢೀಕೃತ ನೇರ ಕೃಷಿಕ',
    hi: 'सत्यापित प्रत्यक्ष उत्पादक',
    te: 'ధృవీకరించబడిన ప్రత్యక్ష రైతు',
    ta: 'சரிபார்க்கப்பட்ட நேரடி விவசாயி',
    ml: 'സ്ഥിരീകരിച്ച നേരിട്ടുള്ള കർഷകൻ',
    bn: 'যাচাইকৃত সরাসরি চাষী',
    mr: 'सत्यापित थेट उत्पादक',
    gu: 'પ્રમાણિત સીધા ઉત્પાદક',
    pa: 'ਪ੍ਰਮਾਣਿਤ ਸਿੱਧੇ ਉਤਪਾਦਕ',
    or: 'ପ୍ରମାଣିତ ପ୍ରତ୍ୟକ୍ଷ ଚାଷୀ',
    as: 'প্ৰমাণিত পোনপটীয়া খেতিয়ক',
    ur: 'تصدیق شدہ براہ راست کاشتکار',
  },
};

const BADGE_TRANSLATIONS: Record<string, Record<LanguageCode, string>> = {
  'Master Grower': {
    en: 'Master Grower',
    kn: 'ಮುಖ್ಯ ಬೆಳೆಗಾರ',
    hi: 'मास्टर ग्रोवर',
    te: 'మాస్టర్ గ్రోవర్',
    ta: 'முதன்மை விவசாயி',
    ml: 'മാസ്റ്റർ ഗ്രോവർ',
    bn: 'মাস্টার চাষী',
    mr: 'मास्टर ग्रोवर',
    gu: 'માસ્ટર ગ્રોઅર',
    pa: 'ਮਾਸਟਰ ਗਰੋਅਰ',
    or: 'ମାଷ୍ଟର ଚାଷୀ',
    as: 'মাস্টাৰ খেতিয়ক',
    ur: 'ماہر کاشتکار',
  },
  'Zero Pesticide Pioneer': {
    en: 'Zero Pesticide Pioneer',
    kn: 'ಕೀಟನಾಶಕ-ಮುಕ್ತ ಪ್ರವರ್ತಕ',
    hi: 'शून्य कीटनाशक अग्रणी',
    te: 'జీరో పురుగుమందుల మార్గదర్శి',
    ta: 'பூச்சிக்கொல்லி இல்லா முன்னோடி',
    ml: 'കീടനാശിനി രഹിത പയനിയർ',
    bn: 'কীটনাশকমুক্ত অগ্রদূত',
    mr: 'शून्य कीटकनाशक प्रणेते',
    gu: 'શૂન્ય જંતુનાશક પ્રણેતા',
    pa: 'ਜ਼ੀਰੋ ਕੀਟਨਾਸ਼ਕ ਪਾਇਨੀਅਰ',
    or: 'ଶୂନ କୀଟନାଶକ ଅଗ୍ରଦୂତ',
    as: 'কীটনাশকমুক্ত অগ্ৰদূত',
    ur: 'صفر کیڑے مار ادویات کا علمبردار',
  },
  'Heritage Cultivator': {
    en: 'Heritage Cultivator',
    kn: 'ಪಾರಂಪರಿಕ ಕೃಷಿಕ',
    hi: 'पारंपरिक कृषक',
    te: 'వారసత్వ వ్యవసాయదారుడు',
    ta: 'பாரம்பரிய சாகுபடியாளர்',
    ml: 'പാരമ്പര്യ കർഷകൻ',
    bn: 'ঐতিহ্যবাহী চাষী',
    mr: 'पारंपरिक शेतकरी',
    gu: 'વારસાગત ખેડૂત',
    pa: 'ਪਰੰਪਰਾਗਤ ਕਾਸ਼ਤਕਾਰ',
    or: 'ପାରମ୍ପରିକ ଚାଷୀ',
    as: 'ঐতিহ্যমণ্ডিত খেতিয়ক',
    ur: 'روایتی کاشتکار',
  },
  'GI Tagged Specialist': {
    en: 'GI Tagged Specialist',
    kn: 'ಭೌಗೋಳಿಕ ಗುರುತು (GI) ತಜ್ಞ',
    hi: 'जीआई टैग विशेषज्ञ',
    te: 'జీఐ ట్యాగ్ స్పెషలిస్ట్',
    ta: 'ஜிஐ குறிச்சொல் நிபுணர்',
    ml: 'ജിഐ ടാഗ് സ്പെഷ്യലിസ്റ്റ്',
    bn: 'জিআই ট্যাগ বিশেষজ্ঞ',
    mr: 'जीआय टॅग तज्ञ',
    gu: 'જીઆઈ ટેગ સ્પેશિયાલિસ્ટ',
    pa: 'ਜੀਆਈ ਟੈਗ ਸਪੈਸ਼ਲਿਸਟ',
    or: 'ଜିଆଇ ଟ୍ୟାଗ୍ ବିଶେଷଜ୍ଞ',
    as: 'জিআই টেগ বিশেষজ্ঞ',
    ur: 'جی آئی ٹیگ کا ماہر',
  },
  'Grain Champion': {
    en: 'Grain Champion',
    kn: 'ಧಾನ್ಯ ಕೃಷಿ ಚಾಂಪಿಯನ್',
    hi: 'अन्न व अनाज चैंपियन',
    te: 'ధాన్యాల చాంపియన్',
    ta: 'தானிய சாம்பியன்',
    ml: 'ധാന്യ ചാമ്പ്യൻ',
    bn: 'শস্য চ্যাম্পিয়ন',
    mr: 'धान्य चॅम्पियन',
    gu: 'ધાન્ય ચેમ્પિયન',
    pa: 'ਅਨਾਜ ਚੈਂਪੀਅਨ',
    or: 'ଶସ୍ୟ ଚାମ୍ପିଅନ୍',
    as: 'শস্য চেম্পিয়ন',
    ur: 'غلہ چیمپیئن',
  },
  'Spice Guild Master': {
    en: 'Spice Guild Master',
    kn: 'ಮಸಾಲೆ ಗಿಲ್ಡ್ ಮಾಸ್ಟರ್',
    hi: 'मसाला संघ प्रमुख',
    te: 'మసాలా గిల్డ్ మాస్టర్',
    ta: 'மசாலா நிபுணர்',
    ml: 'സുഗന്ധവ്യഞ്ജന മാസ്റ്റർ',
    bn: 'মসলা গিল্ড মাস্টার',
    mr: 'मसाला संघ प्रमुख',
    gu: 'મસાલા ગિલ્ડ માસ્ટર',
    pa: 'ਮਸਾਲਾ ਗਿਲਡ ਮਾਸਟਰ',
    or: 'ମସଲା ଗିଲ୍ଡ ମାଷ୍ଟର',
    as: 'মচলা বিশেষজ্ঞ',
    ur: 'مسالہ گلڈ ماسٹر',
  },
  'Rainforest Certified': {
    en: 'Rainforest Certified',
    kn: 'ಮಳೆಕಾಡು ಪ್ರಮಾಣೀಕೃತ',
    hi: 'वर्षावन प्रमाणित',
    te: 'వర్షారణ్య ధృవీకృతం',
    ta: 'மழைக்காடு சான்றளிக்கப்பட்டது',
    ml: 'റെയിൻഫോറസ്റ്റ് സാക്ഷ്യപ്പെടുത്തിയത്',
    bn: 'রেইনফরেস্ট প্রত্যয়িত',
    mr: 'रेनफॉरेस्ट प्रमाणित',
    gu: 'રેઈનફોરેસ્ટ પ્રમાણિત',
    pa: 'ਰੇਨਫੋਰੈਸਟ ਪ੍ਰਮਾਣਿਤ',
    or: 'ରେନଫରେଷ୍ଟ ପ୍ରମାଣିତ',
    as: 'ৰেইনফৰেষ্ট প্ৰমাণিত',
    ur: 'بارانی جنگل تصدیق شدہ',
  },
  'Desert Farming Hero': {
    en: 'Desert Farming Hero',
    kn: 'ಮರುಭೂಮಿ ಕೃಷಿ ವೀರ',
    hi: 'मरुभूमि कृषि नायक',
    te: 'ఎడారి వ్యవసాయ వీరుడు',
    ta: 'பாலைவன விவசாய நாயகன்',
    ml: 'മരുഭൂമി കാർഷിക ഹീറോ',
    bn: 'মরুভূমি চাষের নায়ক',
    mr: 'वाळवंटी कृषी नायक',
    gu: 'રણ પ્રદેશ ખેતી હીરો',
    pa: 'ਰੇਗਿਸਤਾਨੀ ਖੇਤੀ ਹੀਰੋ',
    or: 'ମରୁଭୂମି ଚାଷ ନାୟକ',
    as: 'মৰুভূমি কৃষি নায়ক',
    ur: 'صحرائی کاشتکاری کا ہیرو',
  },
  'Delta Harvest Leader': {
    en: 'Delta Harvest Leader',
    kn: 'ಡೆಲ್ಟಾ ಕೊಯ್ಲು ನಾಯಕ',
    hi: 'डेल्टा फसल नायक',
    te: 'డెల్టా పంట లీడర్',
    ta: 'டெல்டா அறுவடை தலைவர்',
    ml: 'ഡെൽറ്റ വിളവെടുപ്പ് ലീഡർ',
    bn: 'ডেল্টা শস্য নেতা',
    mr: 'त्रिभुज प्रदेश पीक नेते',
    gu: 'ડેલ્ટા પાક લીડર',
    pa: 'ਡੈਲਟਾ ਫਸਲ ਆਗੂ',
    or: 'ଡେଲ୍ଟା ଫସଲ ନେତା',
    as: 'ডেল্টা শস্য নেতা',
    ur: 'ڈیلٹا فصل کا رہنما',
  },
  'Himalayan Orchardist': {
    en: 'Himalayan Orchardist',
    kn: 'ಹಿಮಾಲಯನ್ ತೋಟಗಾರ',
    hi: 'हिमालयी फलोद्यान विशेषज्ञ',
    te: 'హిమాలయన్ ఆర్చర్డిస్ట్',
    ta: 'இமயமலை பழத்தோட்டக்காரர்',
    ml: 'ഹിമാലയൻ പഴത്തോട്ടക്കാരൻ',
    bn: 'হিমালয় ফলচাষী',
    mr: 'हिमालयीन फळबाग तज्ञ',
    gu: 'હિમાલયન ફળબાગ નિષ્ણાત',
    pa: 'ਹਿਮਾਲੀਅਨ ਬਾਗਬਾਨ',
    or: 'ହିମାଳୟ ଫଳବଗିଚା ବିଶେଷଜ୍ଞ',
    as: 'হিমালয়ান ফলখেতিয়ক',
    ur: 'ہمالیائی باغبان',
  },
  'Bio-Heritage Guardian': {
    en: 'Bio-Heritage Guardian',
    kn: 'ಜೈವಿಕ ಪರಂಪರೆ ರಕ್ಷಕ',
    hi: 'जैव-विरासत संरक्षक',
    te: 'జీవ వైవిధ్య వారసత్వ రక్షకుడు',
    ta: 'உயிரியல் பாரம்பரிய பாதுகாவலர்',
    ml: 'ജൈവ പൈതൃക സംരക്ഷകൻ',
    bn: 'জৈব ঐতিহ্য রক্ষক',
    mr: 'जैव वारसा संरक्षक',
    gu: 'જૈવ વારસો રક્ષક',
    pa: 'ਜੈਵ-ਵਿਰਾਸਤ ਰਖਵਾਲਾ',
    or: 'ଜୈବ-ଐତିହ୍ୟ ସଂରକ୍ଷକ',
    as: 'জৈৱ-ঐতিহ্য ৰক্ষক',
    ur: 'حیاتیاتی ورثے کا محافظ',
  },
  'Tree-Crop Specialist': {
    en: 'Tree-Crop Specialist',
    kn: 'ವೃಕ್ಷ-ಬೆಳೆ ತಜ್ಞ',
    hi: 'वृक्ष-फसल विशेषज्ञ',
    te: 'వృక్ష పంటల నిపుణుడు',
    ta: 'மரப்பயிர் நிபுணர்',
    ml: 'വൃക്ഷവിള സ്പെഷ്യലിസ്റ്റ്',
    bn: 'বৃক্ষ-শস্য বিশেষজ্ঞ',
    mr: 'झाड-पीक तज्ञ',
    gu: 'વૃક્ષ-પાક નિષ્ણાત',
    pa: 'ਦਰੱਖਤ ਫਸਲ ਮਾਹਿਰ',
    or: 'ବୃକ୍ଷ ଫସଲ ବିଶେଷଜ୍ଞ',
    as: 'বৃক্ষ-শস্য বিশেষজ্ঞ',
    ur: 'درختی فصل کا ماہر',
  },
  'Agri-Processing Leader': {
    en: 'Agri-Processing Leader',
    kn: 'ಕೃಷಿ-ಸಂಸ್ಕರಣಾ ನಾಯಕ',
    hi: 'कृषि-प्रसंस्करण अग्रणी',
    te: 'వ్యవసాయ ప్రాసెసింగ్ లీడర్',
    ta: 'வேளாண் பதப்படுத்துதல் தலைவர்',
    ml: 'കാർഷിക സംസ്കരണ ലീഡർ',
    bn: 'কৃষি প্রক্রিয়াকরণ নেতা',
    mr: 'कृषी-प्रक्रिया नेते',
    gu: 'કૃષિ-પ્રોસેસિંગ લીડર',
    pa: 'ਖੇਤੀ ਪ੍ਰੋਸੈਸਿੰਗ ਆਗੂ',
    or: 'କୃଷି-ପ୍ରକ୍ରିୟାକରଣ ନେତା',
    as: 'কৃষি প্ৰক্ৰিয়াকৰণ নেতা',
    ur: 'زرعی پروسیسنگ لیڈر',
  },
  'Heritage Saffron Master': {
    en: 'Heritage Saffron Master',
    kn: 'ಪಾರಂಪರಿಕ ಕೇಸರಿ ತಜ್ಞ',
    hi: 'विरासत केसर मास्टर',
    te: 'వారసత్వ కుంకుమపువ్వు మాస్టర్',
    ta: 'பாரம்பரிய குங்குமப்பூ மாஸ்டர்',
    ml: 'പാരമ്പര്യ കുങ്കുമപ്പൂ മാസ്റ്റർ',
    bn: 'ঐতিহ্যবাহী জাফরান ওস্তাদ',
    mr: 'पारंपरिक केशर तज्ञ',
    gu: 'વારસાગત કેસર માસ્ટર',
    pa: 'ਵਿਰਾਸਤੀ ਕੇਸਰ ਮਾਸਟਰ',
    or: 'ଐତିହ୍ୟ କେଶର ମାଷ୍ଟର',
    as: 'ঐতিহাসিক কেশৰ বিশেষজ্ঞ',
    ur: 'روایتی زعفران ماسٹر',
  },
  'Direct Producer': {
    en: 'Direct Producer',
    kn: 'ನೇರ ಉತ್ಪಾದಕ',
    hi: 'प्रत्यक्ष उत्पादक',
    te: 'ప్రత్యక్ష ఉత్పత్తిదారు',
    ta: 'நேரடி உற்பத்தியாளர்',
    ml: 'നേരിട്ടുള്ള ഉത്പാദകൻ',
    bn: 'সরাসরি উৎপাদক',
    mr: 'थेट उत्पादक',
    gu: 'સીધા ઉત્પાદક',
    pa: 'ਸਿੱਧਾ ਉਤਪਾਦਕ',
    or: 'ପ୍ରତ୍ୟକ୍ଷ ଉତ୍ପାଦକ',
    as: 'পোনপটীয়া উৎপাদক',
    ur: 'براہ راست پیدا کنندہ',
  },
};

const SPECIALTY_TRANSLATIONS: Record<string, Record<LanguageCode, string>> = {
  'Organic Vegetables & Native Roots': {
    en: 'Organic Vegetables & Native Roots',
    kn: 'ಸಾವಯವ ತರಕಾರಿಗಳು ಮತ್ತು ದೇಸಿ ಗೆಡ್ಡೆಗಳು',
    hi: 'जैविक सब्जियां और देसी कंदमूल',
    te: 'సేంద్రీయ కూరగాయలు మరియు దేశీ దుంపలు',
    ta: 'இயற்கை காய்கறிகள் மற்றும் நாட்டு கிழங்குகள்',
    ml: 'ഓർഗാനിക് പച്ചക്കറികളും നാടൻ കിഴങ്ങുകളും',
    bn: 'জৈব শাকসবজি এবং দেশীয় মূল',
    mr: 'सेंद्रिय भाज्या आणि गावरान कंदमुळे',
    gu: 'ઓર્ગેનિક શાકભાજી અને દેશી કંદમૂળ',
    pa: 'ਜੈਵਿਕ ਸਬਜ਼ੀਆਂ ਅਤੇ ਦੇਸੀ ਜੜ੍ਹਾਂ',
    or: 'ଜୈବିକ ପନିପରିବା ଏବଂ ଦେଶୀ କନ୍ଦମୂଳ',
    as: 'জৈৱিক শাক-পাচলি আৰু থলুৱা আলু',
    ur: 'نامیاتی سبزیاں اور روایتی جڑیں',
  },
  'Hydroponic Greens & Exotic Melons': {
    en: 'Hydroponic Greens & Exotic Melons',
    kn: 'ಹೈಡ್ರೋಪೋನಿಕ್ ಸೊಪ್ಪುಗಳು ಮತ್ತು ವಿದೇಶಿ ಕರಬೂಜ',
    hi: 'हाइड्रोपोनिक पत्तेदार साग और खरबूजे',
    te: 'హైడ్రోపోనిక్ ఆకుకూరలు మరియు మెలన్లు',
    ta: 'ஹைட்ரோபோனிக் கீரைகள் மற்றும் முலாம் பழங்கள்',
    ml: 'ഹൈഡ്രോപോണിക് ചീരകളും തണ്ണിമത്തനും',
    bn: 'হাইড্রোপনিক শাক এবং তরমুজ',
    mr: 'हायड्रोपोनिक पालेभाज्या आणि खरबूज',
    gu: 'હાઈડ્રોપોનિક ભાજી અને તરબૂચ-ટેટી',
    pa: 'ਹਾਈਡ੍ਰੋਪੋਨਿਕ ਸਾਗ ਅਤੇ ਵਿਦੇਸ਼ੀ ਖ਼ਰਬੂਜ਼ੇ',
    or: 'ହାଇଡ୍ରୋପୋନିକ୍ ଶାଗ ଏବଂ ତରଭୁଜ',
    as: 'হাইড্ৰ’পনিক শাক আৰু বিদেশী খৰবুজা',
    ur: 'ہائیڈروپونک ساگ اور خربوزے',
  },
  'Heritage Millets, Pulses & Native Grains': {
    en: 'Heritage Millets, Pulses & Native Grains',
    kn: 'ಸಿರಿಧಾನ್ಯಗಳು, ಕಾಳುಗಳು ಮತ್ತು ದೇಸಿ ಧಾನ್ಯಗಳು',
    hi: 'पारंपरिक मिलेट्स, दालें और देसी अनाज',
    te: 'వారసత్వ చిరుధాన్యాలు, పప్పులు మరియు దేశీ ధాన్యాలు',
    ta: 'பாரம்பரிய சிறுதானியங்கள், பருப்புகள் மற்றும் நாட்டு தானியங்கள்',
    ml: 'പാരമ്പര്യ ചെറുധാന്യങ്ങൾ, പയറുവർഗ്ഗങ്ങൾ, നാടൻ ധാന്യങ്ങൾ',
    bn: 'ঐতিহ্যবাহী বাজরা, ডাল এবং দেশি শস্য',
    mr: 'पारंपरिक भरडधान्ये, डाळी आणि देशी धान्य',
    gu: 'પરંપરાગત બાજરી, કઠોળ અને દેશી અનાજ',
    pa: 'ਵਿਰਾਸਤੀ ਬਾਜਰੇ, ਦਾਲਾਂ ਅਤੇ ਦੇਸੀ ਅਨਾਜ',
    or: 'ପାରମ୍ପରିକ ମିଲେଟ୍ସ, ଡାଲି ଏବଂ ଦେଶୀ ଶସ୍ୟ',
    as: 'পৰম্পৰাগত মিলেট, ডালি আৰু থলুৱা শস্য',
    ur: 'روایتی باجرا، دالیں اور دیسی اناج',
  },
  'GI-Tagged Alphonso Mangoes & Coastal Berries': {
    en: 'GI-Tagged Alphonso Mangoes & Coastal Berries',
    kn: 'ಜಿಐ-ಟ್ಯಾಗ್ ಆಲ್ಫೋನ್ಸೋ ಮಾವಿನಹಣ್ಣುಗಳು ಮತ್ತು ಹಣ್ಣುಗಳು',
    hi: 'जीआई टैग अल्फोंसो आम और तटीय फल',
    te: 'జీఐ-ట్యాగ్ ఆల్ఫోన్సో మామిడి మరియు తీరప్రాంత పండ్లు',
    ta: 'ஜிஐ குறியிடப்பட்ட அல்போன்சா மாம்பழங்கள் மற்றும் பழங்கள்',
    ml: 'ജിഐ ടാഗ് ചെയ്ത അൽഫോൻസോ മാങ്ങകളും സരസഫലങ്ങളും',
    bn: 'জিআই ট্যাগযুক্ত আলফনসো আম এবং বেরি',
    mr: 'जीआय टॅग हापूस आंबे आणि सागरी बेरी',
    gu: 'જીઆઈ ટેગ હાફૂસ કેરી અને દરિયાકાંઠાના ફળો',
    pa: 'ਜੀਆਈ ਟੈਗ ਅਲਫੋਂਸੋ ਅੰਬ ਅਤੇ ਤੱਟਵਰਤੀ ਬੇਰ',
    or: 'ଜିଆଇ ଟ୍ୟାଗ୍ ଆଲଫୋନସୋ ଆମ୍ବ ଏବଂ ଫଳ',
    as: 'জিআই টেগযুক্ত আলফনচো আম আৰু উপকূলীয় ফল',
    ur: 'جی آئی ٹیگ شدہ الفانسو آم اور ساحلی پھل',
  },
  'Organic Golden Wheat & Long-Grain Grains': {
    en: 'Organic Golden Wheat & Long-Grain Grains',
    kn: 'ಸಾವಯವ ಶರ್ಬತಿ ಗೋಧಿ ಮತ್ತು ಉದ್ದ ಧಾನ್ಯದ ಅಕ್ಕಿ',
    hi: 'जैविक शरबती गेहूं और बासमती चावल',
    te: 'సేంద్రీయ గోల్డెన్ గోధుమ మరియు బాస్మతి ధాన్యాలు',
    ta: 'இயற்கை தங்க கோதுமை மற்றும் பாசுமதி தானியங்கள்',
    ml: 'ഓർഗാനിക് ഗോതമ്പും ബസുമതി അരിയും',
    bn: 'জৈব সোনালী গম এবং বাসমতি চাল',
    mr: 'सेंद्रिय शरबती गहू आणि बासमती तांदूळ',
    gu: 'ઓર્ગેનિક શરબતી ઘઉં અને બાસમતી ચોખા',
    pa: 'ਜੈਵਿਕ ਸ਼ਰਬਤੀ ਕਣਕ ਅਤੇ ਲੰਬੇ ਦਾਣੇ ਵਾਲਾ ਬਾਸਮਤੀ',
    or: 'ଜୈବିକ ସୁନା ଗହମ ଏବଂ ବାସୁମତୀ ଚାଉଳ',
    as: 'জৈৱিক সোণালী ঘেঁহু আৰু বাচমতী চাউল',
    ur: 'نامیاتی گندم اور طویل دانہ باسمتی چاول',
  },
  'Sun-Dried Cumin, Garlic & Cold-Pressed Groundnut Oil': {
    en: 'Sun-Dried Cumin, Garlic & Cold-Pressed Groundnut Oil',
    kn: 'ಬಿಸಿಲಿನಲ್ಲಿ ಒಣಗಿಸಿದ ಜೀರಿಗೆ, ಬೆಳ್ಳುಳ್ಳಿ ಮತ್ತು ಕಡಲೆಕಾಯಿ ಎಣ್ಣೆ',
    hi: 'धूप में सूखा जीरा, लहसुन और कच्ची घानी मूंगफली तेल',
    te: 'ఎండబెట్టిన జీలకర్ర, వెల్లుల్లి మరియు వేరుశెనగ నూనె',
    ta: 'வெயிலில் உலர்த்திய சீரகம், பூண்டு மற்றும் கடலை எண்ணெய்',
    ml: 'ഉണക്കിയ ജീരകം, വെളുത്തുള്ളി, ശുദ്ധമായ നിലക്കടല എണ്ണ',
    bn: 'রোদে শুকানো জিরা, রসুন এবং কাঠের ঘানির চিনাবাদাম তেল',
    mr: 'उन्हात वाळवलेले जिरे, लसूण आणि लाकडी घाण्याचे शेंगदाणा तेल',
    gu: 'સૂર્યપ્રકાશમાં સૂકવેલું જીરું, લસણ અને લાકડાની ઘાણીનું સિંગતેલ',
    pa: 'ਧੁੱਪੇ ਸੁੱਕਿਆ ਜੀਰਾ, ਲਸਣ ਅਤੇ ਕੱਚੀ ਘਾਣੀ ਮੂੰਗਫਲੀ ਦਾ ਤੇਲ',
    or: 'ଖରାରେ ଶୁଖିଲା ଜିରା, ରସୁଣ ଏବଂ ଚିନାବାଦାମ ତେଲ',
    as: 'ৰ’দত শুকোৱা জিৰা, নহৰু আৰু চিনা বাদামৰ তেল',
    ur: 'دھوپ میں سوکھا زیرہ، لہسن اور کولہو کا مونگ پھلی کا تیل',
  },
  'High-Altitude Spices & Virgin Coconut Oil': {
    en: 'High-Altitude Spices & Virgin Coconut Oil',
    kn: 'ಎತ್ತರದ ಪ್ರದೇಶದ ಮಸಾಲೆಗಳು ಮತ್ತು ವರ್ಜಿನ್ ಕೊಬ್ಬರಿ ಎಣ್ಣೆ',
    hi: 'पहाड़ी मसाले और शुद्ध वर्जिन नारियल तेल',
    te: 'ఎత్తైన కొండల సుగంధ ద్రవ్యాలు మరియు వర్జిన్ కొబ్బరి నూనె',
    ta: 'மலைப்பகுதி மசாலாக்கள் மற்றும் தூய தேங்காய் எண்ணெய்',
    ml: 'ഉയർന്ന മലയോര സുഗന്ധവ്യഞ്ജനങ്ങളും കന്യാ വെളിച്ചെണ്ണയും',
    bn: 'পাহাড়ি মসলা এবং খাঁটি ভার্জিন নারকেল তেল',
    mr: 'डोंगराळ भागातील मसाले आणि व्हर्जिन खोबरेल तेल',
    gu: 'પહાડી મસાલા અને શુદ્ધ વર્જિન નાળિયેર તેલ',
    pa: 'ਪਹਾੜੀ ਮਸਾਲੇ ਅਤੇ ਵਰਜਿਨ ਨਾਰੀਅਲ ਦਾ ਤੇਲ',
    or: 'ପାହାଡ଼ିଆ ମସଲା ଏବଂ ଶୁଦ୍ଧ ନଡ଼ିଆ ତେଲ',
    as: 'পাহাৰীয়া মচলা আৰু খাঁটি নাৰিকলৰ তেল',
    ur: 'پہاڑی مصالحہ جات اور ورجن ناریل کا تیل',
  },
  'Aromatic Coriander, Methi & Desert Pulses': {
    en: 'Aromatic Coriander, Methi & Desert Pulses',
    kn: 'ಸುಗಂಧ ಕೊತ್ತಂಬರಿ, ಮೆಂತ್ಯ ಮತ್ತು ಮರುಭೂಮಿ ಕಾಳುಗಳು',
    hi: 'सुगंधित धनिया, मेथी और मरुस्थलीय दालें',
    te: 'సువాసనగల ధనియాలు, మెంతులు మరియు ఎడారి పప్పులు',
    ta: 'நறுமண கொத்தமல்லி, வெந்தயம் மற்றும் பாலைவன பருப்புகள்',
    ml: 'സുഗന്ധമുള്ള മല്ലി, ഉലുവ, മരുഭൂമി പയറുകൾ',
    bn: 'সুগন্ধি ধনে, মেথি এবং মরুভূমির ডাল',
    mr: 'सुवासिक धणे, मेथी आणि वाळवंटी डाळी',
    gu: 'સુગંધિત ધાણા, મેથી અને રણ વિસ્તારના કઠોળ',
    pa: 'ਸੁਗੰਧਿਤ ਧਨੀਆ, ਮੇਥੀ ਅਤੇ ਰੇਗਿਸਤਾਨੀ ਦਾਲਾਂ',
    or: 'ସୁଗନ୍ଧିତ ଧନିଆ, ମେଥି ଏବଂ ମରୁଭୂମି ଡାଲି',
    as: 'সুগন্ধী ধনিয়া, মেথি আৰু মৰুভূমিৰ ডালি',
    ur: 'خوشبودار دھنیا، میتھی اور صحرائی دالیں',
  },
  'Direct Farm Chillies, Fresh Curry Leaves & Pulses': {
    en: 'Direct Farm Chillies, Fresh Curry Leaves & Pulses',
    kn: 'ನೇರ ತೋಟದ ಮೆಣಸಿನಕಾಯಿ, ಕರಿಬೇವಿನ ಸೊಪ್ಪು ಮತ್ತು ಕಾಳುಗಳು',
    hi: 'खेत की सीधी मिर्च, ताज़ा करी पत्ता और दालें',
    te: 'తోట మిర్చి, తాజా కరివేపాకు మరియు పప్పులు',
    ta: 'பண்ணை மிளகாய், புதிய கறிவேப்பிலை மற்றும் பருப்புகள்',
    ml: 'തോട്ടത്തിലെ മുളക്, കറിവേപ്പില, പയറുകൾ',
    bn: 'সরাসরি ক্ষেতের মরিচ, তাজা কারিপাতা এবং ডাল',
    mr: 'शेतातील मिरच्या, ताजी कढीपत्ता आणि डाळी',
    gu: 'ખેતરનાં મરચાં, તાજો મીઠો લીમડો અને કઠોળ',
    pa: 'ਖੇਤਾਂ ਦੀਆਂ ਮਿਰਚਾਂ, ਤਾਜ਼ੀ ਕੜੀ ਪੱਤਾ ਅਤੇ ਦਾਲਾਂ',
    or: 'ବାଡ଼ିରୁ ଲଙ୍କା, ସତେଜ ଭୃସଙ୍ଗ ପତ୍ର ଏବଂ ଡାଲି',
    as: 'পথাৰৰ জলকীয়া, সতেজ নৰসিংহ পাত আৰু ডালি',
    ur: 'کھیت کی تازی مرچیں، کڑی پتہ اور دالیں',
  },
  'High-Altitude Apples & Cold-Climate Vegetables': {
    en: 'High-Altitude Apples & Cold-Climate Vegetables',
    kn: 'ಹಿಮಾಲಯನ್ ಸೇಬುಗಳು ಮತ್ತು ಶೀತ ಹವಾಮಾನದ ತರಕಾರಿಗಳು',
    hi: 'पहाड़ी सेब और शीतकालीन ताज़ा सब्जियां',
    te: 'హిమాలయన్ ఆపిల్స్ మరియు శీతాకాల కూరగాయలు',
    ta: 'மலை ஆப்பிள்கள் மற்றும் குளிர் காலநிலை காய்கறிகள்',
    ml: 'ഹൈറേഞ്ച് ആപ്പിളും ശീതകാല പച്ചക്കറികളും',
    bn: 'হিমালয়ের আপেল এবং শীতকালীন শাকসবজি',
    mr: 'पर्वतीय सफरचंद आणि थंड हवेच्या भाज्या',
    gu: 'પહાડી સફરજન અને શિયાળુ શાકભાજી',
    pa: 'ਪਹਾੜੀ ਸੇਬ ਅਤੇ ਠੰਢੇ ਮੌਸਮ ਦੀਆਂ ਸਬਜ਼ੀਆਂ',
    or: 'ହିମାଳୟ ସେଓ ଏବଂ ଶୀତଦିନିଆ ପନିପରିବା',
    as: 'পাহাৰীয়া আপেল আৰু শীতকালীন শাক-পাচলি',
    ur: 'پہاڑی سیب اور سرد موسم کی سبزیاں',
  },
  'Ethical Wild Mangrove Honey & Native Rice': {
    en: 'Ethical Wild Mangrove Honey & Native Rice',
    kn: 'ಕಾಡಿನ ಶುದ್ಧ ಜೇನುತುಪ್ಪ ಮತ್ತು ದೇಸಿ ಸಾಂಪ್ರದಾಯಿಕ ಅಕ್ಕಿ',
    hi: 'जंगल का शुद्ध शहद और पारंपरिक देसी चावल',
    te: 'అడవి తేనె మరియు దేశీయ పురాతన బియ్యం',
    ta: 'காட்டு தேன் மற்றும் பாரம்பரிய நாட்டு அரிசி',
    ml: 'ശുദ്ധമായ കാട്ടുതേനും പരമ്പരാഗത നാടൻ അരിയും',
    bn: 'সুন্দরবনের খাঁটি বুনো মধু এবং দেশি চাল',
    mr: 'नैसर्गिक रानमध आणि पारंपरिक देशी तांदूळ',
    gu: 'જંગલનું શુદ્ધ મધ અને પરંપરાગત દેશી ચોખા',
    pa: 'ਜੰਗਲੀ ਸ਼ੁੱਧ ਸ਼ਹਿਦ ਅਤੇ ਦੇਸੀ ਚੌਲ',
    or: 'ଜଙ୍ଗଲୀ ପ୍ରାକୃତିକ ମହୁ ଏବଂ ଦେଶୀ ଚାଉଳ',
    as: 'জংঘলী খাঁটি মৌ আৰু থলুৱা চাউল',
    ur: 'جنگلی خالص شہد اور دیسی چاول',
  },
  'Nutrient-Dense Coconuts, Moringa & Hill Roots': {
    en: 'Nutrient-Dense Coconuts, Moringa & Hill Roots',
    kn: 'ಪೌಷ್ಟಿಕ ಎಳನೀರು, ಮುರುಂಗಕಾಯಿ ಮತ್ತು ಬೆಟ್ಟದ ಗೆಡ್ಡೆಗಳು',
    hi: 'पौष्टिक नारियल, सहजन की फली और पहाड़ी कंद',
    te: 'పోషక కొబ్బరికాయలు, మునగకాయలు మరియు దుంపలు',
    ta: 'சத்துமிக்க தேங்காய், முருங்கைக்காய் மற்றும் மலைக்கிழங்குகள்',
    ml: 'ഇളനീർ, മുരിങ്ങക്ക, നാടൻ കിഴങ്ങുകൾ',
    bn: 'পুষ্টিকর ডাব-নারকেল, সজনে ডাঁটা এবং পাহাড়ি মূল',
    mr: 'पौष्टिक नारळ, शेवगा शेंगा आणि डोंगराळ कंदमुळे',
    gu: 'પૌષ્ટિક નાળિયેર, સરગવો અને પહાડી કંદમૂળ',
    pa: 'ਪੌਸ਼ਟਿਕ ਨਾਰੀਅਲ, ਸੁਹਾਂਜਣਾ ਫਲੀਆਂ ਅਤੇ ਪਹਾੜੀ ਜੜ੍ਹਾਂ',
    or: 'ପୌଷ୍ଟିକ ନଡ଼ିଆ, ସଜନା ଛୁଇଁ ଏବଂ ପାହାଡ଼ି କନ୍ଦ',
    as: 'পুষ্টিকৰ নাৰিকল, চজিনা আৰু পাহাৰীয়া আলু',
    ur: 'غذائیت سے بھرپور ناریل، سہنجن کی پھلیاں اور جڑیں',
  },
  'Storage Onions, Table Grapes & Artisanal Jaggery': {
    en: 'Storage Onions, Table Grapes & Artisanal Jaggery',
    kn: 'ಬಾಳಿಕೆ ಬರುವ ಈರುಳ್ಳಿ, ದ್ರಾಕ್ಷಿ ಮತ್ತು ಸಾವಯವ ಬೆಲ್ಲ',
    hi: 'टिकाऊ प्याज, मीठे अंगूर और पारंपरिक गुड़',
    te: 'నిల్వ ఉల్లిపాయలు, ద్రాక్ష మరియు స్వచ్ఛమైన బెల్లం',
    ta: 'சேமிப்பு வெங்காயம், திராட்சை மற்றும் பாரம்பரிய வெல்லம்',
    ml: 'സവാള, മുന്തിരി, ശുദ്ധമായ നാടൻ ശർക്കര',
    bn: 'সংরক্ষণযোগ্য পেঁয়াজ, আঙুর এবং খাঁটি দেশি গুড়',
    mr: 'टिकाऊ कांदे, गोड द्राक्षे आणि सेंद्रिय गूळ',
    gu: 'સંગ્રહક્ષમ ડુંગળી, મીઠી દ્રાક્ષ અને ઓર્ગેનિક ગોળ',
    pa: 'ਟਿਕਾਊ ਪਿਆਜ਼, ਮਿੱਠੇ ਅੰਗੂਰ ਅਤੇ ਦੇਸੀ ਗੁੜ',
    or: 'ସଂରକ୍ଷଣଯୋଗ୍ୟ ପିଆଜ, ଅଙ୍ଗୁର ଏବଂ ଦେଶୀ ଗୁଡ଼',
    as: 'সংৰক্ষণযোগ্য পিয়াঁজ, আঙুৰ আৰু থলুৱা গুৰ',
    ur: 'پائیدار پیاز، میٹھے انگور اور دیسی گڑ',
  },
  'GI-Tagged Pampore Saffron & Kashmiri Walnuts': {
    en: 'GI-Tagged Pampore Saffron & Kashmiri Walnuts',
    kn: 'ಜಿಐ-ಟ್ಯಾಗ್ ಕಾಶ್ಮೀರಿ ಕೇಸರಿ ಮತ್ತು ವಾಲ್ನಟ್ಸ್',
    hi: 'जीआई टैग पाम्पोर केसर और कश्मीरी अखरोट',
    te: 'జీఐ-ట్యాగ్ కాశ్మీరీ కుంకుమపువ్వు మరియు అక్రూట్లు',
    ta: 'ஜிஐ குறியிட்ட காஷ்மீர் குங்குமப்பூ மற்றும் அக்ரூட்',
    ml: 'ജിഐ ടാഗ് ചെയ്ത കശ്മീരി കുങ്കുമപ്പൂവും വാൽനട്ടും',
    bn: 'জিআই ট্যাগযুক্ত কাশ্মীরি জাফরান এবং আখরোট',
    mr: 'जीआय टॅग काश्मिरी केशर आणि काश्मिरी अक्रोड',
    gu: 'જીઆઈ ટેગ કાશ્મીરી કેસર અને અખરોટ',
    pa: 'ਜੀਆਈ ਟੈਗ ਕਸ਼ਮੀਰੀ ਕੇਸਰ ਅਤੇ ਅਖ਼ਰੋਟ',
    or: 'ଜିଆଇ ଟ୍ୟାଗ୍ କାଶ୍ମୀରୀ କେଶର ଏବଂ ଅଖରୋଟ',
    as: 'জিআই টেগযুক্ত কাশ্মিৰী কেশৰ আৰু আখৰোট',
    ur: 'جی آئی ٹیگ پامپور زعفران اور کشمیری اخروٹ',
  },
};

/**
 * Localizes farmer role string
 */
export function getLocalizedFarmerRole(role: string, lang: LanguageCode): string {
  if (!role) return '';
  if (lang === 'en') return role;
  if (ROLE_TRANSLATIONS[role] && ROLE_TRANSLATIONS[role][lang]) {
    return ROLE_TRANSLATIONS[role][lang];
  }
  return role;
}

/**
 * Localizes experience string (e.g. "18 years" or "12+ Years Natural Soil Cultivation")
 */
export function getLocalizedExperience(exp: string, lang: LanguageCode): string {
  if (!exp) return '';
  if (lang === 'en') return exp;

  const match = exp.match(/(\d+)\+?\s*years?/i);
  if (match) {
    const num = match[1];
    const unitMap: Record<LanguageCode, string> = {
      en: `${num} years`,
      kn: `${num} ವರ್ಷಗಳ ಅನುಭವ`,
      hi: `${num} वर्षों का अनुभव`,
      te: `${num} సంవత్సరాల అనుభవం`,
      ta: `${num} ஆண்டுகள் அனுபவம்`,
      ml: `${num} വർഷത്തെ അനുഭവം`,
      bn: `${num} বছরের অভিজ্ঞতা`,
      mr: `${num} वर्षांचा अनुभव`,
      gu: `${num} વર્ષોનો અનુભવ`,
      pa: `${num} ਸਾਲਾਂ ਦਾ ਤਜਰਬਾ`,
      or: `${num} ବର୍ଷର ଅଭିଜ୍ଞତା`,
      as: `${num} বছৰৰ অভিজ্ঞতা`,
      ur: `${num} سال کا تجربہ`,
    };
    return unitMap[lang] || exp;
  }
  return exp;
}

/**
 * Localizes acreage string (e.g. "14 Acres Certified Natural")
 */
export function getLocalizedAcreage(acreage: string, lang: LanguageCode): string {
  if (!acreage) return '';
  if (lang === 'en') return acreage;

  const match = acreage.match(/(\d+)\s*acres?/i);
  if (match) {
    const num = match[1];
    const acreMap: Record<LanguageCode, string> = {
      en: `${num} Acres Certified Natural`,
      kn: `${num} ಎಕರೆ ನೈಸರ್ಗಿಕ ಮಣ್ಣು`,
      hi: `${num} एकड़ प्रमाणित प्राकृतिक खेत`,
      te: `${num} ఎకరాల సహజ భూమి`,
      ta: `${num} ஏக்கர் இயற்கை மண்`,
      ml: `${num} ഏക്കർ സ്വാഭാവിക മണ്ണ്`,
      bn: `${num} একর সার্টিফায়েড প্রাকৃতিক জমি`,
      mr: `${num} एकर प्रमाणित नैसर्गिक जमीन`,
      gu: `${num} એકર પ્રમાણિત કુદરતી જમીન`,
      pa: `${num} ਏਕੜ ਪ੍ਰਮਾਣਿਤ ਕੁਦਰਤੀ ਖੇਤ`,
      or: `${num} ଏକର ପ୍ରାକୃତିକ ଚାଷ ଜମି`,
      as: `${num} একৰ প্ৰাকৃতিক খেতিপথাৰ`,
      ur: `${num} ایکڑ قدرتی مٹی`,
    };
    return acreMap[lang] || acreage;
  }
  return acreage;
}

/**
 * Localizes farmer highlight badges
 */
export function getLocalizedHighlightBadge(badge: string, lang: LanguageCode): string {
  if (!badge) return '';
  if (lang === 'en') return badge;
  if (BADGE_TRANSLATIONS[badge] && BADGE_TRANSLATIONS[badge][lang]) {
    return BADGE_TRANSLATIONS[badge][lang];
  }
  return badge;
}

/**
 * Localizes farmer specialty string
 */
export function getLocalizedSpecialty(spec: string, lang: LanguageCode): string {
  if (!spec) return '';
  if (lang === 'en') return spec;
  if (SPECIALTY_TRANSLATIONS[spec] && SPECIALTY_TRANSLATIONS[spec][lang]) {
    return SPECIALTY_TRANSLATIONS[spec][lang];
  }

  for (const [key, map] of Object.entries(SPECIALTY_TRANSLATIONS)) {
    if (spec.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(spec.toLowerCase())) {
      if (map[lang]) return map[lang];
    }
  }

  return spec;
}
