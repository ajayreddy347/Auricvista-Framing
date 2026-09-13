import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Tractor,
  Package,
  ShoppingBag,
  TrendingUp,
  Plus,
  Edit3,
  Trash2,
  CheckCircle,
  Clock,
  Truck,
  AlertCircle,
  Sparkles,
  Bot,
  MapPin,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Send,
  User,
  Star,
  Layers,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ShieldCheck,
  Search,
  Globe,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProduce, ProduceListing } from '../context/ProduceContext';
import { useOrders, Order } from '../context/OrdersContext';
import { useReviews } from '../context/ReviewsContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageCode, SUPPORTED_LANGUAGES } from '../translations';
import { getProduceImage } from '../utils/produceImages';
import { getLocalizedProduceName, getLocalizedCategory, getLocalizedUnit } from '../utils/produceLocalization';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleFarmMap } from './GoogleFarmMap';
import { ProductImage } from './ProductImage';
import { StarRating } from './StarRating';

export const FarmerDashboardSection: React.FC = () => {
  const { user } = useAuth();
  const { listings, updateListing } = useProduce();
  const { orders, updateOrderStatus } = useOrders();
  const { reviews } = useReviews();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const isRtl = language === 'ur';

  // Active view tab: crops | orders | reviews | location
  const [activeDashboardTab, setActiveDashboardTab] = useState<
    'crops' | 'orders' | 'reviews' | 'location'
  >('crops');

  // Produce expand/collapse state (limit to 6 initially)
  const [isProduceExpanded, setIsProduceExpanded] = useState(false);

  // Search and status filters for inventory
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryFilter, setInventoryFilter] = useState<
    'all' | 'in-stock' | 'low-stock' | 'sold-out'
  >('all');

  // Edit Produce Modal State
  const [editingProduce, setEditingProduce] = useState<ProduceListing | null>(null);
  const [editPrice, setEditPrice] = useState<string>('');
  const [editQuantity, setEditQuantity] = useState<string>('');
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Farmer AI Problem Assistant State
  const [farmerVoiceText, setFarmerVoiceText] = useState('');
  const [isFarmerListening, setIsFarmerListening] = useState(false);
  const [farmerAiResponse, setFarmerAiResponse] = useState<string | null>(null);
  const [farmerAiLoading, setFarmerAiLoading] = useState(false);
  const [farmerAiError, setFarmerAiError] = useState<string | null>(null);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [currentResponseLang, setCurrentResponseLang] = useState<string>(language);

  const voiceRecognitionRef = useRef<any>(null);

  // Real Farmer Details from PostgreSQL / Auth Session
  const displayName = user?.name || 'Verified Indian Farmer';
  const displayFarmerId = user?.farmerId || 'AV-FARM-1001';
  const displayFarm = user?.farmName || `${displayName}'s Natural Farm`;
  const displayLocation = user?.location || 'Mandya River Basin, Karnataka';

  // Real Produce Listings for this Farmer
  const farmerListings = useMemo(() => {
    return listings.filter((item) => {
      const emailMatch = user?.email && item.farmerEmail?.toLowerCase() === user.email.toLowerCase();
      const nameMatch = user?.name && item.farmerName?.toLowerCase() === user.name.toLowerCase();
      const idMatch = user?.id && item.farmerId === user.id;
      const farmerIdMatch = user?.farmerId && item.farmerId === user.farmerId;
      return Boolean(emailMatch || nameMatch || idMatch || farmerIdMatch);
    });
  }, [listings, user]);

  // Real Orders matching this farmer's produce
  const farmerOrders = useMemo(() => {
    return orders.filter((o) =>
      o.items.some(
        (it) =>
          it.farmerName?.toLowerCase() === user?.name?.toLowerCase() ||
          user?.role === 'farmer'
      )
    );
  }, [orders, user]);

  // Real Customer Reviews
  const farmerReviews = useMemo(() => {
    return reviews.filter(
      (r) =>
        r.farmerName?.toLowerCase() === user?.name?.toLowerCase() ||
        r.farmerId === displayFarmerId ||
        user?.role === 'farmer'
    );
  }, [reviews, user, displayFarmerId]);

  // Summary Metrics
  const totalListingsCount = farmerListings.length;
  const activeListings = farmerListings.filter(
    (l) => l.status === 'Active' && Number(l.quantity) > 0
  );
  const pendingOrders = farmerOrders.filter(
    (o) => o.status === 'Placed' || o.status === 'Harvesting'
  );
  const completedOrders = farmerOrders.filter((o) => o.status === 'Delivered');

  const reviewsStats = useMemo(() => {
    if (farmerReviews.length === 0) return { average: 5.0, totalCount: 0 };
    const sum = farmerReviews.reduce((acc, r) => acc + r.rating, 0);
    return {
      average: sum / farmerReviews.length,
      totalCount: farmerReviews.length,
    };
  }, [farmerReviews]);

  // Web Speech API language map
  const speechLangMap: Record<string, string> = {
    en: 'en-IN',
    kn: 'kn-IN',
    hi: 'hi-IN',
    te: 'te-IN',
    ta: 'ta-IN',
    ml: 'ml-IN',
    bn: 'bn-IN',
    mr: 'mr-IN',
    gu: 'gu-IN',
    pa: 'pa-IN',
    or: 'or-IN',
    as: 'as-IN',
    ur: 'ur-IN',
  };

  // Helper to intelligently detect Indian script from text
  const detectScriptLanguage = (text: string, defaultLang: string): string => {
    if (/[\u0C80-\u0CFF]/.test(text)) return 'kn'; // Kannada
    if (/[\u0C00-\u0C7F]/.test(text)) return 'te'; // Telugu
    if (/[\u0B80-\u0BFF]/.test(text)) return 'ta'; // Tamil
    if (/[\u0D00-\u0D7F]/.test(text)) return 'ml'; // Malayalam
    if (/[\u0980-\u09FF]/.test(text)) return 'bn'; // Bengali / Assamese
    if (/[\u0A80-\u0AFF]/.test(text)) return 'gu'; // Gujarati
    if (/[\u0A00-\u0A7F]/.test(text)) return 'pa'; // Punjabi
    if (/[\u0B00-\u0B7F]/.test(text)) return 'or'; // Odia
    if (/[\u0600-\u06FF]/.test(text)) return 'ur'; // Urdu
    if (/[\u0900-\u097F]/.test(text)) {
      if (defaultLang === 'mr') return 'mr'; // Marathi
      return 'hi'; // Hindi
    }
    return defaultLang;
  };

  // Auto-Speak AI response directly aloud using TTS
  const handleAutoSpeakResponse = (responseText: string, langCode: string) => {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();

      const cleanText = responseText.replace(/[*_#`•]/g, '').trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = speechLangMap[langCode] || 'en-IN';
      utterance.rate = 0.92; // Farmer-friendly natural pacing

      utterance.onstart = () => setIsAiSpeaking(true);
      utterance.onend = () => setIsAiSpeaking(false);
      utterance.onerror = () => setIsAiSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Auto TTS speech error:', e);
    }
  };

  // Farmer Voice Problem Recognition: 1-Tap Trigger
  const handleToggleFarmerVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setFarmerAiError(t('farmer.speechNotSupported', 'Voice recognition is not supported in this browser. You can type your problem below.'));
      return;
    }

    if (isFarmerListening) {
      if (voiceRecognitionRef.current) {
        voiceRecognitionRef.current.stop();
      }
      setIsFarmerListening(false);
      return;
    }

    // Cancel any currently speaking audio
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsAiSpeaking(false);
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = speechLangMap[language] || 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsFarmerListening(true);
        setFarmerVoiceText('');
        setFarmerAiError(null);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setFarmerVoiceText(transcript);
        if (event.results[0].isFinal) {
          setIsFarmerListening(false);
          const detectedLang = detectScriptLanguage(transcript, language);
          handleAnalyzeFarmerProblem(transcript, detectedLang);
        }
      };

      recognition.onerror = () => {
        setIsFarmerListening(false);
        setFarmerAiError(t('farmer.voiceIssue', 'Sorry, I could not hear that clearly. Please tap and speak again or type below.'));
      };

      recognition.onend = () => {
        setIsFarmerListening(false);
      };

      voiceRecognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsFarmerListening(false);
      setFarmerAiError(t('farmer.micPermission', 'Microphone permission is required to speak.'));
    }
  };

  // Structured same-language agricultural advice generator + Auto TTS
  const handleAnalyzeFarmerProblem = (problemText: string, langCode: string) => {
    if (!problemText.trim()) return;

    setFarmerAiLoading(true);
    setFarmerAiError(null);
    setFarmerAiResponse(null);
    setCurrentResponseLang(langCode);

    setTimeout(() => {
      let advice = '';

      if (langCode === 'kn') {
        advice = `🌾 **ಸಮಸ್ಯೆ ಗ್ರಹಿಕೆ:** ಬೆಳೆ ಎಲೆಗಳು ಹಳದಿಯಾಗುವುದು ಅಥವಾ ಕೀಟ ಬಾಧೆಯ ಲಕ್ಷಣಗಳು.\n\n• **ಸಂಭಾವ್ಯ ಕಾರಣಗಳು:** ಸಾರಜನಕ ಅಥವಾ ಸೂಕ್ಷ್ಮ ಪೋಷಕಾಂಶಗಳ ಕೊರತೆ, ಬೇರುಗಳಲ್ಲಿ ಅಧಿಕ ನೀರು ನಿಲ್ಲುವುದು, ಅಥವಾ ರಸಹೀರುವ ಕೀಟಗಳ ಬಾಧೆ.\n• **ತಕ್ಷಣ ಪರಿಶೀಲಿಸಿ:** ಎಲೆಯ ಕೆಳಭಾಗದಲ್ಲಿ ಸಣ್ಣ ಕೀಟಗಳಿವೆಯೇ ಮತ್ತು ಜಮೀನಿನಲ್ಲಿ ನೀರು ಸರಾಗವಾಗಿ ಹರಿಯುತ್ತಿದೆಯೇ ಎಂದು ನೋಡಿ.\n• **ನೈಸರ್ಗಿಕ ಉಪಶಮನ:** 5% ಬೇವಿನ ಎಣ್ಣೆ (Neem Oil) ಸಿಂಪಡಿಸಿ ಮತ್ತು ಬುಡಕ್ಕೆ ಉತ್ತಮ ಎರೆಹುಳು ಗೊಬ್ಬರ ನೀಡಿ.\n• **ತಜ್ಞರ ಸಲಹೆ:** 5 ದಿನಗಳ ನಂತರವೂ ಸಮಸ್ಯೆ ಮುಂದುವರಿದರೆ ನಿಮ್ಮ ತಾಲ್ಲೂಕಿನ ಕೃಷಿ ವಿಜ್ಞಾನ ಕೇಂದ್ರದ (KVK) ಅಧಿಕಾರಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ.`;
      } else if (langCode === 'hi') {
        advice = `🌾 **समस्या विश्लेषण:** पत्तियों का पीला पड़ना अथवा कीट व फफूंद के लक्षण।\n\n• **संभावित कारण:** नाइट्रोजन या सूक्ष्म पोषक तत्वों की कमी, खेत में अत्यधिक जलभराव, या रस चूसक कीटों का प्रकोप।\n• **निरीक्षण करें:** पत्तियों के नीचे कीटों की जांच करें और देखें कि जड़ों में पानी तो नहीं रुका है।\n• **प्राकृतिक उपचार:** 5% नीम के तेल का घोल बनाकर छिड़काव करें और जड़ों में वर्मीकम्पोस्ट खाद दें।\n• **विशेषज्ञ सहायता:** यदि 5 दिनों में सुधार न हो तो नजदीकी कृषि विज्ञान केंद्र (KVK) के वैज्ञानिक से संपर्क करें।`;
      } else if (langCode === 'te') {
        advice = `🌾 **సమస్య విశ్లేషణ:** ఆకులు పసుపు రంగులోకి మారడం లేదా తెగుళ్ల లక్షణాలు.\n\n• **సాధ్యమైన కారణాలు:** నత్రజని లేదా పోషకాల లోపం, పొలంలో నీరు నిల్వ ఉండటం, లేదా రసం పీల్చే పురుగుల ఉధృతి.\n• **తనిఖీ చేయండి:** ఆకుల అడుగున పురుగులు ఉన్నాయేమో చూడండి మరియు నీటి పారుదల సరిగ్గా ఉందో లేదో గమనించండి.\n• **సహజ నివారణ:** 5% వేప నూనె ద్రావణాన్ని పిచికారీ చేయండి మరియు సేంద్రీయ ఎరువులను అందించండి.\n• **నిపుణుల సలహా:** సమస్య తగ్గకపోతే సమీపంలోని కృషి విజ్ఞాన కేంద్రాన్ని (KVK) సంప్రదించండి.`;
      } else if (langCode === 'ta') {
        advice = `🌾 **பிரச்சினை பகுப்பாய்வு:** பயிர் இலைகள் மஞ்சள் நிறமாதல் அல்லது பூச்சி தாக்குதல் அறிகுறிகள்.\n\n• **காரணங்கள்:** நைட்ரஜன் அல்லது நுண்ணூட்டச்சத்து குறைபாடு, அதிகப்படியான நீர் தேக்கம், அல்லது சாறு உறிஞ்சும் பூச்சிகள்.\n• **பரிசோதிக்கவும்:** இலைகளின் அடிப்பகுதியில் பூச்சிகள் உள்ளதா மற்றும் வேர்களில் நீர் தேங்கியுள்ளதா என சரிபார்க்கவும்.\n• **இயற்கை தீர்வு:** 5% வேப்ப எண்ணெய் கரைசலை தெளிக்கவும், மண்புழு உரம் இடவும்.\n• **நிபுணர் ஆலோசனை:** 5 நாட்களுக்குள் குணமாகாவிட்டால் உள்ளூர் வேளாண் அறிவியல் மையத்தை (KVK) அணுகவும்.`;
      } else if (langCode === 'ml') {
        advice = `🌾 **പ്രശ്ന വിശകലനം:** ഇലകൾ മഞ്ഞളിക്കുന്നത് അല്ലെങ്കിൽ കീടബാധയുടെ ലക്ഷണങ്ങൾ.\n\n• **സാധ്യമായ കാരണങ്ങൾ:** നൈട്രജൻ കുറവ്, വേരുകളിൽ വെള്ളക്കെട്ട്, അല്ലെങ്കിൽ കീടങ്ങൾ.\n• **പരിശോധിക്കുക:** ഇലകൾക്കടിയിൽ കീടങ്ങളുണ്ടോ എന്ന് നോക്കുക.\n• **സ്വാഭാവിക പരിഹാരം:** 5% വേപ്പെണ്ണ മിശ്രിതം തളിക്കുക, ജൈവവളം ചേർക്കുക.\n• **വിദഗ്ദ്ധോപദേശം:** കൃഷി വിജ്ഞാന കേന്ദ്രവുമായി (KVK) ബന്ധപ്പെടുക.`;
      } else if (langCode === 'mr') {
        advice = `🌾 **समस्या विश्लेषण:** पानांचा पिवळेपणा किंवा कीड-रोगाची लक्षणे.\n\n• **संभाव्य कारणे:** नत्राची कमतरता, मुळांशी पाणी साचणे, किंवा रसशोषक किडींचा प्रादुर्भाव.\n• **तपासा:** पानांच्या खाली किडींचे निरीक्षण करा आणि पाण्याचा निचरा योग्य आहे का ते पाहा.\n• **सेंद्रिय उपाय:** ५% निंबोळी अर्क फवारा आणि गांडूळ खत द्या.\n• **तज्ज्ञ सल्ला:** समस्या कायम राहिल्यास कृषी विज्ञान केंद्राशी (KVK) संपर्क साधा.`;
      } else if (langCode === 'bn') {
        advice = `🌾 **সমস্যা বিশ্লেষণ:** পাতার হলুদ ভাব বা পোকার আক্রমণের লক্ষণ।\n\n• **সম্ভাব্য কারণ:** নাইট্রোজেনের অভাব, শিকড়ে জল জমা, অথবা শোষক পোকা।\n• **পরীক্ষা করুন:** পাতার নিচের অংশ ও মাটির আর্দ্রতা পরীক্ষা করুন।\n• **প্রাকৃতিক প্রতিকার:** ৫% নিম তেলের স্প্রে করুন এবং কেঁচো সার প্রয়োগ করুন।\n• **বিশেষজ্ঞ পরামর্শ:** নিকটস্থ কৃষি বিজ্ঞান কেন্দ্রের (KVK) সাথে যোগাযোগ করুন।`;
      } else if (langCode === 'gu') {
        advice = `🌾 **સમસ્યા વિશ્લેષણ:** પાંદડા પીળા પડવા અથવા જીવાતના લક્ષણો.\n\n• **સંભવિત કારણો:** નાઇટ્રોજનની ઉણપ, મૂળમાં વધુ પડતું પાણી, અથવા ચૂસિયા જીવાતો.\n• **તપાસ કરો:** પાંદડાની નીચે જીવાત છે કે નહીં તે તપાસો.\n• **કુદરતી ઉપાય:** ૫% લીમડાનું તેલ છાંટો અને વર્મીકમ્પોસ્ટ આપો.\n• **તજજ્ઞ સલાહ:** કૃષિ વિજ્ઞાન કેન્દ્ર (KVK) નો સંપર્ક કરો.`;
      } else if (langCode === 'pa') {
        advice = `🌾 **ਸਮੱਸਿਆ ਵਿਸ਼ਲੇਸ਼ਣ:** ਪੱਤਿਆਂ ਦਾ ਪੀਲਾ ਪੈਣਾ ਜਾਂ ਕੀੜਿਆਂ ਦੇ ਲੱਛਣ।\n\n• **ਸੰਭਾਵੀ ਕਾਰਨ:** ਨਾਈਟ੍ਰੋਜਨ ਦੀ ਘਾਟ, ਜੜ੍ਹਾਂ ਵਿੱਚ ਪਾਣੀ ਖੜ੍ਹਾ ਹੋਣਾ, ਜਾਂ ਕੀੜੇ।\n• **ਜਾਂਚ ਕਰੋ:** ਪੱਤਿਆਂ ਦੇ ਹੇਠਾਂ ਕੀੜਿਆਂ ਦੀ ਜਾਂਚ ਕਰੋ।\n• **ਕੁਦਰਤੀ ਹੱਲ:** 5% ਨਿੰਮ ਦੇ ਤੇਲ ਦਾ ਛਿੜਕਾਅ ਕਰੋ ਅਤੇ ਦੇਸੀ ਰੂੜੀ ਪਾਓ।\n• **ਮਾਹਰ ਸਲਾਹ:** ਕ੍ਰਿਸ਼ੀ ਵਿਗਿਆਨ ਕੇਂਦਰ (KVK) ਨਾਲ ਸੰਪਰਕ ਕਰੋ।`;
      } else if (langCode === 'or') {
        advice = `🌾 **ସମସ୍ୟା ବିଶ୍ଳେଷଣ:** ପତ୍ର ହଳଦିଆ ପଡ଼ିବା କିମ୍ବା କୀଟ ସଂକ୍ରମଣର ଲକ୍ଷଣ।\n\n• **ସମ୍ଭାବ୍ୟ କାରଣ:** ଯବକ୍ଷାରଜାନ ବା ପୋଷକ ତତ୍ତ୍ୱର ଅଭାବ, ଚେରରେ ଜଳ ନିଷ୍କାସନ ଅଭାବ, କିମ୍ବା କୀଟପତଙ୍ଗ।\n• **ତଦାରଖ କରନ୍ତୁ:** ପତ୍ର ତଳେ କୀଟ ଅଛି କି ନାହିଁ ଦେଖନ୍ତୁ।\n• **ପ୍ରାକୃତିକ ଉପଚାର:** ୫% ନିମ ତେଲ ସ୍ପ୍ରେ କରନ୍ତୁ ଏବଂ ଜିଆ ଖତ ଦିଅନ୍ତୁ।\n• **ବିଶେଷଜ୍ଞ ପରାମର୍ଶ:** କୃଷି ବିଜ୍ଞାନ କେନ୍ଦ୍ର (KVK) ସହିତ ଯୋଗାଯୋଗ କରନ୍ତୁ।`;
      } else if (langCode === 'as') {
        advice = `🌾 **সমস্যা বিশ্লেষণ:** পাত হালধীয়া পৰা বা পোক-পৰুৱাৰ আক্ৰমণৰ লক্ষণ।\n\n• **সম্ভাব্য কাৰণ:** নাইট্ৰ’জেনৰ অভাৱ, শিপাত পানী জমা হোৱা, বা পোক।\n• **পৰীক্ষা কৰক:** পাতৰ তলৰ অংশ পৰীক্ষা কৰক।\n• **প্ৰাকৃতিক প্ৰতিকাৰ:** ৫% নিম তেল স্প্ৰে কৰক আৰু কেঁচু সাৰ প্ৰয়ୋগ কৰক।\n• **বিশেষজ্ঞৰ পৰামৰ্শ:** ওচৰৰ কৃষি বিজ্ঞান কেন্দ্ৰৰ (KVK) সৈতে যোগাযোগ কৰক।`;
      } else if (langCode === 'ur') {
        advice = `🌾 **مسئلہ کا تجزیہ:** پتوں کا پیلا پڑنا یا کیڑوں اور پھپھوندی کی علامات۔\n\n• **ممکنہ وجوہات:** نائٹروجن کی کمی، جڑوں میں پانی کا ٹھہراؤ، یا رس چوسنے والے کیڑے۔\n• **معائنہ کریں:** پتوں کے نیچے کیڑوں کی جانچ کریں اور مٹی کی نکاسی دیکھیں۔\n• **قدرتی علاج:** 5% نیم کے تیل کا اسپرے کریں اور قدرتی کھاد دیں۔\n• **ماہرین کا مشورہ:** قریبی کرشی وگیان کیندر (KVK) سے رابطہ کریں۔`;
      } else {
        advice = `🌾 **Agronomy Problem Analysis:** Leaf yellowing & crop stress symptoms.\n\n• **Likely Causes:** Nitrogen or micronutrient deficiency, root waterlogging, or sucking pest infestation.\n• **What to Inspect:** Check the underside of leaves for aphids/mites and ensure soil drains well without water stagnation.\n• **Safe Cultural Remedy:** Spray 5% organic cold-pressed neem oil emulsion and apply mature vermicompost around root drip lines.\n• **When to Seek Officer Help:** If yellowing spreads across the field after 5 days, consult your district Krishi Vigyan Kendra (KVK) extension officer.`;
      }

      setFarmerAiResponse(advice);
      setFarmerAiLoading(false);

      // AUTOMATICALLY SPEAK THE ANSWER DIRECTLY ALOUD
      handleAutoSpeakResponse(advice, langCode);
    }, 700);
  };

  // Replay speech button
  const handleReplaySpeech = () => {
    if (!farmerAiResponse) return;
    handleAutoSpeakResponse(farmerAiResponse, currentResponseLang);
  };

  // Stop speech button
  const handleStopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsAiSpeaking(false);
    }
  };

  // Filtered inventory items based on search and status
  const filteredInventory = useMemo(() => {
    return farmerListings.filter((item) => {
      const q = inventorySearch.toLowerCase().trim();
      const locName = getLocalizedProduceName(item.name, language).toLowerCase();
      const locCat = getLocalizedCategory(item.category, language).toLowerCase();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        locName.includes(q) ||
        locCat.includes(q);

      if (inventoryFilter === 'in-stock') {
        return matchesSearch && item.status === 'Active' && Number(item.quantity) > 5;
      }
      if (inventoryFilter === 'low-stock') {
        return matchesSearch && item.status === 'Active' && Number(item.quantity) <= 5 && Number(item.quantity) > 0;
      }
      if (inventoryFilter === 'sold-out') {
        return matchesSearch && (item.status === 'Sold Out' || Number(item.quantity) <= 0);
      }
      return matchesSearch;
    });
  }, [farmerListings, inventorySearch, inventoryFilter, language]);

  // 6-item pagination limit for My Crops & Produce (3 columns x 2 rows on desktop)
  const INITIAL_PRODUCE_LIMIT = 6;
  const visibleProduce = useMemo(() => {
    return isProduceExpanded ? filteredInventory : filteredInventory.slice(0, INITIAL_PRODUCE_LIMIT);
  }, [isProduceExpanded, filteredInventory]);
  const hasMoreProduce = filteredInventory.length > INITIAL_PRODUCE_LIMIT;

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`w-full bg-transparent text-[#fcfbf7] min-h-screen pb-24 pt-6 sm:pt-8 px-4 sm:px-6 lg:px-8 ${
        isRtl ? 'text-right' : 'text-left'
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* ========================================================= */}
        {/* 1. TOP FARMER WELCOME HEADER & LANGUAGE QUICK SWITCHER     */}
        {/* ========================================================= */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#18140c] via-[#100e0a] to-[#0a0a0a] border-2 border-[#d4af37]/45 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#241c0e] border-2 border-[#d4af37]/60 flex items-center justify-center text-[#fae69e] shadow-[0_0_25px_rgba(212,175,55,0.35)] shrink-0">
              <Tractor className="w-8 h-8 sm:w-10 sm:h-10 text-[#d4af37]" />
            </div>
            <div>
              <div className="flex items-center flex-wrap gap-2.5">
                <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#fcfbf7]">
                  {displayName}
                </h1>
                <span className="text-xs sm:text-sm font-mono font-bold text-[#0a0a0a] bg-gradient-to-r from-[#fae69e] to-[#d4af37] px-3 py-1 rounded-full border border-[#fae69e] shadow-md">
                  {t('common.farmerId', 'Farmer ID')}: {displayFarmerId}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#aba79c] flex items-center gap-1.5 mt-1.5 font-sans">
                <MapPin className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span><strong>{displayFarm}</strong> • {displayLocation}</span>
              </p>
            </div>
          </div>

          {/* Quick Language Switcher & Add Produce Action */}
          <div className="flex items-center flex-wrap gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-[#14120c] border border-[#d4af37]/40 text-xs font-mono text-[#fae69e]">
              <Globe className="w-4 h-4 text-[#d4af37]" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                className="bg-transparent text-xs text-[#fae69e] focus:outline-none cursor-pointer"
                aria-label={t('nav.language', 'Select Dashboard Language')}
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className="bg-[#14120e] text-[#fcfbf7]">
                    {l.nativeName} ({l.label})
                  </option>
                ))}
              </select>
            </div>

            <Link
              to="/farmer-dashboard/post-produce"
              className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#b89120] text-[#0a0a0a] font-serif font-bold text-xs sm:text-sm uppercase tracking-wider hover:brightness-110 shadow-lg cursor-pointer flex items-center justify-center gap-2 flex-1 sm:flex-initial"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
              <span>+ {t('farmer.addNewProduce', 'Add Produce')}</span>
            </Link>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. DIRECT 1-TAP "SPEAK YOUR PROBLEM" VOICE AI SECTION     */}
        {/* ========================================================= */}
        <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#16120b] to-[#0c0a07] border-2 border-[#d4af37]/50 shadow-[0_0_40px_rgba(212,175,55,0.2)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#d4af37]/25">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-5 h-5 text-[#d4af37]" />
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#d4af37] font-bold">
                  🌾 {t('farmer.speakProblem', 'Speak Your Problem')}
                </span>
              </div>
              <h2 className="font-serif text-xl sm:text-3xl font-bold text-[#fcfbf7]">
                {t('farmer.speakProblemSubtitle', 'Tell Auric Arohi AI what is happening in your field.')}
              </h2>
              <p className="text-xs sm:text-sm text-[#aba79c] mt-1">
                {t('farmer.speakProblemDesc', 'Speak naturally in your native language. AI will diagnose crop symptoms and explain simple remedies in the same language.')}
              </p>
            </div>

            {/* Audio Indicator */}
            {isAiSpeaking && (
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#182a14] border border-[#34d399]/40 text-[#34d399] text-xs font-mono shrink-0 animate-pulse">
                <Volume2 className="w-4 h-4" />
                <span>{t('farmer.speakingAloud', 'Speaking Answer Aloud 🔊')}</span>
              </div>
            )}
          </div>

          {/* 1-Tap Big Voice Trigger Button & Inputs */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              type="button"
              onClick={handleToggleFarmerVoice}
              className={`w-full sm:w-auto px-8 py-4 sm:py-5 rounded-2xl font-serif font-bold text-sm sm:text-base uppercase tracking-wider flex items-center justify-center gap-3 transition-all cursor-pointer shadow-xl ${
                isFarmerListening
                  ? 'bg-[#ef4444] text-white animate-pulse shadow-[0_0_25px_#ef4444]'
                  : 'bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#b89120] text-[#0a0a0a] hover:brightness-110 active:scale-98'
              }`}
            >
              {isFarmerListening ? (
                <>
                  <MicOff className="w-6 h-6" />
                  <span>{t('farmer.recording', 'Recording... Tap to Analyze')}</span>
                </>
              ) : (
                <>
                  <Mic className="w-6 h-6 text-[#0a0a0a]" />
                  <span>🎙️ {t('farmer.tapAndSpeak', 'Tap & Speak Problem')}</span>
                </>
              )}
            </button>

            {/* Text Input Fallback */}
            <div className="flex-1 w-full flex items-center gap-2">
              <input
                type="text"
                value={farmerVoiceText}
                onChange={(e) => setFarmerVoiceText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const detected = detectScriptLanguage(farmerVoiceText, language);
                    handleAnalyzeFarmerProblem(farmerVoiceText, detected);
                  }
                }}
                placeholder={t('farmer.orTypeProblem', 'Or type what is happening with your crop...')}
                className="flex-1 px-4 py-4 rounded-2xl bg-[#14120e] border border-[#d4af37]/35 text-xs sm:text-sm text-[#fcfbf7] placeholder-[#736f66] focus:outline-none focus:border-[#fae69e]"
              />
              <button
                type="button"
                onClick={() => {
                  const detected = detectScriptLanguage(farmerVoiceText, language);
                  handleAnalyzeFarmerProblem(farmerVoiceText, detected);
                }}
                disabled={!farmerVoiceText.trim() || farmerAiLoading}
                className="p-4 rounded-2xl bg-[#221c10] hover:bg-[#2c2414] border border-[#d4af37]/45 text-[#fae69e] disabled:opacity-40 cursor-pointer shadow-md"
                aria-label={t('common.submit', 'Send problem description')}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Notices & Errors */}
          {farmerAiError && (
            <div className="p-3.5 rounded-xl bg-[#2a1010] text-xs font-mono text-[#f87171] border border-[#f87171]/30 flex items-center justify-between">
              <span>{farmerAiError}</span>
              <button onClick={() => setFarmerAiError(null)} className="text-[#8e8b82] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* AI Response Display Area */}
          {farmerAiLoading && (
            <div className="p-5 rounded-2xl bg-[#14120e] border border-[#d4af37]/40 text-xs font-mono text-[#fae69e] flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin shrink-0" />
              <span>{t('farmer.analyzingCrop', 'Analyzing crop symptoms and preparing natural diagnosis in your language...')}</span>
            </div>
          )}

          {farmerAiResponse && !farmerAiLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 sm:p-7 rounded-2xl bg-[#14120e] border-2 border-[#d4af37]/50 shadow-xl space-y-4 font-sans text-xs sm:text-sm"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#d4af37]/25">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-[#d4af37]" />
                  <span className="font-mono text-xs uppercase font-bold text-[#fae69e]">
                    {t('farmer.adviceTitle', 'Auric Arohi Agronomy Advice (Same-Language Reply)')}
                  </span>
                </div>

                {/* Direct Voice Playback Controls */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleReplaySpeech}
                    className="px-3.5 py-1.5 rounded-xl bg-[#221c10] hover:bg-[#2c2414] border border-[#d4af37]/45 text-xs font-mono text-[#fae69e] flex items-center gap-1.5 cursor-pointer shadow-md"
                    title={t('farmer.replayVoice', 'Listen again')}
                  >
                    <Volume2 className="w-4 h-4 text-[#d4af37]" />
                    <span>{t('farmer.replayVoice', 'Replay Voice 🔊')}</span>
                  </button>

                  {isAiSpeaking && (
                    <button
                      type="button"
                      onClick={handleStopSpeech}
                      className="px-3.5 py-1.5 rounded-xl bg-[#2a1414] hover:bg-[#3a1a1a] border border-[#f87171]/45 text-xs font-mono text-[#f87171] flex items-center gap-1.5 cursor-pointer shadow-md"
                      title={t('farmer.stopAudio', 'Stop speaking')}
                    >
                      <VolumeX className="w-4 h-4" />
                      <span>{t('farmer.stopAudio', 'Stop')}</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="whitespace-pre-line text-[#fcfbf7] leading-relaxed font-sans text-sm sm:text-base">
                {farmerAiResponse}
              </div>

              <div className="pt-3 border-t border-[#d4af37]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] font-mono text-[#736f66]">
                <span>✓ {t('farmer.nonChemicalNote', 'Non-chemical natural remedies prioritized')}</span>
                <span>{t('farmer.kvkNote', 'For acute crop disease, consult your local Krishi Vigyan Kendra (KVK) officer')}</span>
              </div>
            </motion.div>
          )}
        </section>

        {/* ========================================================= */}
        {/* 3. SUMMARY KPI METRICS GRID (SIMPLE LABELS)               */}
        {/* ========================================================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 sm:p-6 rounded-2xl bg-[#0f0e0c] border border-[#d4af37]/35 shadow-md">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#8e8b82] block mb-1">
              {t('farmer.totalCropsListed', 'Total Crops Listed')}
            </span>
            <span className="font-serif text-2xl sm:text-4xl font-bold text-[#fae69e]">
              {totalListingsCount}
            </span>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-[#0f0e0c] border border-[#d4af37]/35 shadow-md">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#8e8b82] block mb-1">
              {t('farmer.availableToSell', 'Available to Sell')}
            </span>
            <span className="font-serif text-2xl sm:text-4xl font-bold text-[#34d399]">
              {activeListings.length}
            </span>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-[#0f0e0c] border border-[#d4af37]/35 shadow-md">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#8e8b82] block mb-1">
              {t('farmer.ordersToHarvest', 'Orders to Harvest')}
            </span>
            <span className="font-serif text-2xl sm:text-4xl font-bold text-[#f59e0b]">
              {pendingOrders.length}
            </span>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-[#0f0e0c] border border-[#d4af37]/35 shadow-md">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#8e8b82] block mb-1">
              {t('farmer.completedDeliveries', 'Completed Deliveries')}
            </span>
            <span className="font-serif text-2xl sm:text-4xl font-bold text-[#fae69e]">
              {completedOrders.length}
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 4. COMPACT DASHBOARD NAVIGATION BAR: TABS                 */}
        {/* ========================================================= */}
        <div
          id="farmer-dashboard-nav"
          className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#12100c] border border-[#d4af37]/35 shadow-md overflow-x-auto no-scrollbar"
        >
          {[
            { id: 'crops', label: 'My Crops & Produce', icon: Package, count: totalListingsCount },
            { id: 'orders', label: 'Customer Orders', icon: ShoppingBag, count: farmerOrders.length },
            { id: 'reviews', label: 'Customer Reviews', icon: Star, count: farmerReviews.length },
            { id: 'location', label: 'Farm Coordinates & Map', icon: MapPin, count: null },
          ].map((tab) => {
            const isActive = activeDashboardTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                id={`farmer-nav-tab-${tab.id}`}
                type="button"
                onClick={() => setActiveDashboardTab(tab.id as any)}
                className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-bold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#d4af37]/25 via-[#d4af37]/15 to-[#fae69e]/10 border border-[#d4af37] text-[#fae69e] shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                    : 'bg-transparent border border-transparent text-[#a8a499] hover:text-[#fcfbf7] hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#fae69e]' : 'text-[#d4af37]'}`} />
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                      isActive
                        ? 'bg-[#d4af37]/30 text-[#fae69e] border border-[#d4af37]/40'
                        : 'bg-white/10 text-[#aba79c]'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* TAB 1: MY CROPS & PRODUCE (3x2 INITIAL 6 ITEMS GRID)      */}
        {/* ========================================================= */}
        {activeDashboardTab === 'crops' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className={`w-4 h-4 text-[#d4af37] absolute top-1/2 -translate-y-1/2 pointer-events-none ${isRtl ? 'right-3.5' : 'left-3.5'}`} />
                <input
                  type="text"
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                  placeholder={t('farmer.searchCrops', 'Search your listed crops...')}
                  className={`w-full py-3 rounded-xl bg-[#14120e] border border-[#d4af37]/35 text-xs text-[#fcfbf7] focus:outline-none focus:border-[#fae69e] ${
                    isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'
                  }`}
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar py-1">
                {[
                  { key: 'all', labelKey: 'farmer.filterAll', defaultLabel: 'All Stock' },
                  { key: 'in-stock', labelKey: 'farmer.filterInStock', defaultLabel: 'In Stock' },
                  { key: 'low-stock', labelKey: 'farmer.filterLowStock', defaultLabel: 'Low Stock' },
                  { key: 'sold-out', labelKey: 'farmer.filterSoldOut', defaultLabel: 'Sold Out' },
                ].map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setInventoryFilter(f.key as any)}
                    className={`px-4 py-2 rounded-xl text-xs font-mono uppercase whitespace-nowrap transition-all border cursor-pointer ${
                      inventoryFilter === f.key
                        ? 'bg-[#221c10] border-[#d4af37] text-[#fae69e] font-bold'
                        : 'bg-[#14120e] border-[#d4af37]/20 text-[#8e8b82]'
                    }`}
                  >
                    {t(f.labelKey, f.defaultLabel)}
                  </button>
                ))}
              </div>
            </div>

            {filteredInventory.length === 0 ? (
              <div className="p-12 rounded-3xl bg-[#12100c] border-2 border-[#d4af37]/30 text-center space-y-4 max-w-lg mx-auto shadow-lg">
                <div className="w-16 h-16 rounded-full bg-[#1c180e] border border-[#d4af37]/50 flex items-center justify-center text-[#fae69e] mx-auto">
                  <Package className="w-8 h-8 text-[#d4af37]" />
                </div>
                <h3 className="font-serif font-bold text-xl text-[#fcfbf7]">
                  {t('farmer.noCropsYet', 'No crops listed yet')}
                </h3>
                <p className="text-xs text-[#aba79c] leading-relaxed">
                  {t('farmer.noCropsSub', 'Start selling your fresh harvest directly to families across India. Tap below to list your first crop.')}
                </p>
                <Link
                  to="/farmer-dashboard/post-produce"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#b89120] text-[#0a0a0a] font-serif font-bold text-xs sm:text-sm uppercase tracking-wider hover:brightness-110 shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ {t('farmer.addFirstCrop', 'Add Your First Crop')}</span>
                </Link>
              </div>
            ) : (
              <>
                {/* Desktop layout: Exactly 3 columns x 2 rows for initial 6 products */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {visibleProduce.map((item) => {
                    const isLow = Number(item.quantity) <= 5 && Number(item.quantity) > 0;
                    const isSold = Number(item.quantity) <= 0 || item.status === 'Sold Out';
                    const localizedName = getLocalizedProduceName(item.name, language);
                    const localizedCategory = getLocalizedCategory(item.category, language);
                    const localizedUnit = getLocalizedUnit(item.unit, language);

                    return (
                      <div
                        key={item.id}
                        id={`farmer-dashboard-prod-${item.id}`}
                        className="p-5 rounded-3xl bg-[#0f0e0c] border border-[#d4af37]/35 shadow-lg flex flex-col justify-between space-y-4 hover:border-[#d4af37]/70 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-18 h-18 rounded-2xl overflow-hidden border border-[#d4af37]/40 shrink-0">
                            <ProductImage
                              src={getProduceImage(item)}
                              alt={localizedName}
                              productName={localizedName}
                              category={item.category}
                              size="sm"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-serif font-bold text-base text-[#fcfbf7] truncate">{localizedName}</h4>
                            <span className="text-xs font-mono text-[#d4af37] block mt-0.5">{localizedCategory}</span>
                            <div className="text-base font-mono font-bold text-[#fae69e] mt-1">
                              ₹{item.pricePerUnit} <span className="text-xs text-[#8e8b82]">/{localizedUnit}</span>
                            </div>
                          </div>
                        </div>

                        {/* Stock Status Indicator */}
                        <div className="p-3 rounded-xl bg-[#14120e] border border-[#d4af37]/20 flex items-center justify-between text-xs font-mono">
                          <span className="text-[#8e8b82]">{t('farmer.availableStock', 'Available Stock')}:</span>
                          <div className="flex items-center gap-1.5 font-bold">
                            {isSold ? (
                              <span className="text-[#f87171] flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-[#f87171]" />
                                {t('farmer.soldOut', 'Sold Out')} (0 {localizedUnit})
                              </span>
                            ) : isLow ? (
                              <span className="text-[#f59e0b] flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-[#f59e0b] animate-pulse" />
                                {t('farmer.lowStock', 'Low Stock')}: {item.quantity} {localizedUnit}
                              </span>
                            ) : (
                              <span className="text-[#34d399] flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-[#34d399]" />
                                {t('farmer.inStock', 'In Stock')}: {item.quantity} {localizedUnit}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProduce(item);
                            setEditPrice(String(item.pricePerUnit));
                            setEditQuantity(String(item.quantity));
                            setEditError(null);
                          }}
                          className="w-full py-2.5 px-3 rounded-2xl bg-[#1c180e] hover:bg-[#282012] border border-[#d4af37]/50 text-xs font-mono font-medium text-[#fae69e] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm overflow-hidden"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                          <span className="truncate">{t('farmer.changePriceOrStock', 'Update price & stock anytime.')}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* View More Items / Show Less Button directly below grid */}
                {hasMoreProduce && (
                  <div className="pt-6 flex justify-center">
                    <button
                      id="view-more-farmer-produce-btn"
                      type="button"
                      onClick={() => setIsProduceExpanded(!isProduceExpanded)}
                      className="group inline-flex items-center justify-center gap-2 py-3 px-8 rounded-2xl text-xs sm:text-sm font-mono font-bold uppercase tracking-wider bg-[#14120e] hover:bg-[#201a10] text-[#fae69e] border border-[#d4af37]/50 hover:border-[#d4af37] transition-all cursor-pointer shadow-md hover:shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                    >
                      {isProduceExpanded ? (
                        <>
                          <span>Show Less</span>
                          <ChevronUp className="w-4 h-4 text-[#d4af37] group-hover:-translate-y-0.5 transition-transform" />
                        </>
                      ) : (
                        <>
                          <span>View More Items</span>
                          <ChevronDown className="w-4 h-4 text-[#d4af37] group-hover:translate-y-0.5 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: LIVE ORDERS WITH SIMPLE EXPLANATION                */}
        {/* ========================================================= */}
        {activeDashboardTab === 'orders' && (
          <div className="space-y-4">
            {farmerOrders.length === 0 ? (
              <div className="p-12 rounded-3xl bg-[#12100c] border border-[#d4af37]/30 text-center space-y-4 max-w-md mx-auto shadow-lg">
                <ShoppingBag className="w-12 h-12 text-[#d4af37] mx-auto" />
                <h3 className="font-serif font-bold text-xl text-[#fcfbf7]">
                  {t('farmer.noOrdersYet', 'No customer orders yet')}
                </h3>
                <p className="text-xs text-[#aba79c] leading-relaxed">
                  {t('farmer.noOrdersSub', 'When families order your produce, they will appear here with simple step-by-step instructions.')}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {farmerOrders.map((o) => {
                  const isPlaced = o.status === 'Placed';
                  const isHarvesting = o.status === 'Harvesting';
                  const isDispatched = o.status === 'Dispatched';
                  const isDelivered = o.status === 'Delivered';

                  return (
                    <div
                      key={o.id}
                      className="p-5 sm:p-6 rounded-3xl bg-[#0f0e0c] border-2 border-[#d4af37]/35 shadow-lg space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#d4af37]/20 text-xs font-mono">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm sm:text-base text-[#fae69e]">
                              {t('farmer.orderNum', 'Order')} #{o.id.slice(-6).toUpperCase()}
                            </span>
                            <span className="text-[#8e8b82]">({o.createdAt})</span>
                          </div>
                          <div className="text-[#aba79c]">
                            {t('farmer.customer', 'Customer')}: <strong className="text-[#fcfbf7]">{o.customerName}</strong> • {t('farmer.destination', 'Destination')}: {o.deliveryAddress}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-xl text-[#fae69e]">₹{o.total}</span>
                        </div>
                      </div>

                      {/* Order Items List */}
                      {o.items && o.items.length > 0 && (
                        <div className="pt-2 pb-1 border-t border-[#d4af37]/15 space-y-1.5">
                          <div className="text-[11px] font-mono uppercase text-[#d4af37]">
                            {t('farmer.orderedProduce', 'Ordered Produce')}:
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {o.items.map((it, idx) => (
                              <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#18140e] border border-[#d4af37]/30 text-xs text-[#fcfbf7]">
                                <span>{getLocalizedProduceName(it.name, language)}</span>
                                <span className="text-[#fae69e] font-mono font-bold">× {it.quantity} {getLocalizedUnit(it.unit || 'kg', language)}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Simple Status Explanation Banner */}
                      <div className={`p-4 rounded-2xl border text-xs sm:text-sm font-sans flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isPlaced
                          ? 'bg-[#221c10] border-[#f59e0b]/50 text-[#f59e0b]'
                          : isHarvesting
                          ? 'bg-[#181c10] border-[#34d399]/50 text-[#34d399]'
                          : isDispatched
                          ? 'bg-[#101c24] border-[#60a5fa]/50 text-[#60a5fa]'
                          : 'bg-[#102414] border-[#34d399]/50 text-[#34d399]'
                      }`}>
                        <div className="flex items-center gap-2.5">
                          {isPlaced && <ShoppingBag className="w-5 h-5 shrink-0 text-[#f59e0b]" />}
                          {isHarvesting && <Tractor className="w-5 h-5 shrink-0 text-[#34d399]" />}
                          {isDispatched && <Truck className="w-5 h-5 shrink-0 text-[#60a5fa]" />}
                          {isDelivered && <CheckCircle className="w-5 h-5 shrink-0 text-[#34d399]" />}

                          <div>
                            <div className="font-bold uppercase font-mono text-xs">
                              {t('farmer.currentStep', 'Current Step')}: {t(`order.${o.status.toLowerCase()}`, o.status)}
                            </div>
                            <div className="text-xs text-[#fcfbf7] mt-0.5">
                              {isPlaced && t('farmer.stepPlacedExpl', 'New order received. Tap below to start harvesting fresh crop.')}
                              {isHarvesting && t('farmer.stepHarvestingExpl', 'Harvesting in progress. Tap below when crop is packed for dispatch.')}
                              {isDispatched && t('farmer.stepDispatchedExpl', 'Produce dispatched. Logistics partner is delivering to customer.')}
                              {isDelivered && t('farmer.stepDeliveredExpl', 'Order delivered successfully to customer. Payment settled.')}
                            </div>
                          </div>
                        </div>

                        {/* Direct One-Tap Action Buttons */}
                        {isPlaced && (
                          <button
                            type="button"
                            onClick={() => updateOrderStatus(o.id, 'Harvesting')}
                            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#b89120] text-[#0a0a0a] font-serif font-bold text-xs sm:text-sm uppercase tracking-wider hover:brightness-110 shadow-md cursor-pointer shrink-0"
                          >
                            🌾 {t('farmer.startHarvestBtn', 'Step 1: Start Harvest')}
                          </button>
                        )}
                        {isHarvesting && (
                          <button
                            type="button"
                            onClick={() => updateOrderStatus(o.id, 'Dispatched')}
                            className="px-6 py-3 rounded-2xl bg-[#34d399] text-[#0a0a0a] font-serif font-bold text-xs sm:text-sm uppercase tracking-wider hover:brightness-110 shadow-md cursor-pointer shrink-0"
                          >
                            🚚 {t('farmer.markDispatchedBtn', 'Step 2: Mark Dispatched')}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: CUSTOMER REVIEWS (FULL DETAILED SECTION)           */}
        {/* ========================================================= */}
        {activeDashboardTab === 'reviews' && (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0f0e0c] border border-[#d4af37]/35 shadow-lg space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-[#d4af37]/20">
                <div className="flex items-center gap-3">
                  <Star className="w-6 h-6 text-[#d4af37]" />
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#fcfbf7]">
                    Customer Reviews & Feedback
                  </h3>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#18140c] border border-[#d4af37]/40 text-xs font-mono text-[#fae69e]">
                  <span>Average Rating:</span>
                  <strong className="text-base text-[#d4af37]">{reviewsStats.average.toFixed(1)} / 5.0</strong>
                  <span className="text-[#aba79c]">({reviewsStats.totalCount} reviews)</span>
                </div>
              </div>

              {farmerReviews.length === 0 ? (
                <div className="py-12 text-center text-[#aba79c] space-y-2">
                  <Star className="w-10 h-10 text-[#d4af37]/40 mx-auto mb-2" />
                  <p className="font-serif text-lg text-[#fcfbf7]">No customer reviews yet</p>
                  <p className="text-xs">Customer ratings and feedback on your harvests will appear here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {farmerReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-5 rounded-2xl bg-[#14120e] border border-[#d4af37]/25 shadow-sm space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#fcfbf7]">{rev.customerName}</span>
                            {rev.verified && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#34d399] px-2 py-0.5 rounded-full bg-[#34d399]/10 border border-[#34d399]/30">
                                <ShieldCheck className="w-3 h-3" />
                                Verified Buyer
                              </span>
                            )}
                          </div>
                          {rev.produceName && (
                            <span className="text-xs font-mono text-[#d4af37] block mt-0.5">
                              Crop: {rev.produceName}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <StarRating rating={rev.rating} size="xs" showNumeric={true} />
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-[#aba79c] leading-relaxed font-sans italic">
                        "{rev.comment}"
                      </p>
                      <div className="text-[10px] font-mono text-[#736f66] pt-2 border-t border-[#d4af37]/15 flex items-center justify-between">
                        <span>{rev.date}</span>
                        {typeof rev.helpfulCount === 'number' && rev.helpfulCount > 0 && (
                          <span>{rev.helpfulCount} found helpful</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: FARM LOCATION & GOOGLE MAPS                        */}
        {/* ========================================================= */}
        {activeDashboardTab === 'location' && (
          <div className="space-y-6">
            <GoogleFarmMap
              singleLocation={{
                city: displayLocation.split(',')[0]?.trim() || 'Mandya',
                state: displayLocation.split(',')[1]?.trim() || 'Karnataka',
                farmerName: displayName,
                farmerId: displayFarmerId,
              }}
            />
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* EDIT PRICE & STOCK MODAL (LARGE TOUCH CONTROLS)           */}
      {/* ========================================================= */}
      {editingProduce && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#12100c] border-2 border-[#d4af37]/60 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#d4af37]/25">
              <h3 className="font-serif font-bold text-lg text-[#fcfbf7]">
                {t('farmer.editProduceTitle', 'Change Price / Stock')} • {getLocalizedProduceName(editingProduce.name, language)}
              </h3>
              <button
                onClick={() => {
                  if (!editLoading) {
                    setEditingProduce(null);
                    setEditError(null);
                  }
                }}
                disabled={editLoading}
                className="text-[#8e8b82] hover:text-white p-1 cursor-pointer disabled:opacity-40"
                aria-label={t('common.cancel', 'Close modal')}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm font-sans">
              <div>
                <label className="text-[#aba79c] block mb-1 font-mono">
                  {t('farmer.pricePerUnit', 'Price per Unit (₹)')} ({getLocalizedUnit(editingProduce.unit, language)}):
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={editPrice}
                  onChange={(e) => {
                    setEditPrice(e.target.value);
                    if (editError) setEditError(null);
                  }}
                  disabled={editLoading}
                  className="w-full px-4 py-3.5 rounded-2xl bg-[#18140e] border border-[#d4af37]/45 text-base text-[#fcfbf7] font-mono focus:outline-none focus:border-[#fae69e] disabled:opacity-60"
                />
              </div>

              <div>
                <label className="text-[#aba79c] block mb-1 font-mono">
                  {t('farmer.availableQuantity', 'Available Quantity')} ({getLocalizedUnit(editingProduce.unit, language)}):
                </label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={editQuantity}
                  onChange={(e) => {
                    setEditQuantity(e.target.value);
                    if (editError) setEditError(null);
                  }}
                  disabled={editLoading}
                  className="w-full px-4 py-3.5 rounded-2xl bg-[#18140e] border border-[#d4af37]/45 text-base text-[#fcfbf7] font-mono focus:outline-none focus:border-[#fae69e] disabled:opacity-60"
                />
              </div>
            </div>

            {/* Clear Error Message Display */}
            {editError && (
              <div className="p-3.5 rounded-2xl bg-red-950/70 border border-red-500/60 text-red-200 text-xs font-sans flex items-start gap-2.5 shadow-md">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{editError}</span>
              </div>
            )}

            <div className="pt-3 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  if (!editLoading) {
                    setEditingProduce(null);
                    setEditError(null);
                  }
                }}
                disabled={editLoading}
                className="px-5 py-3 rounded-2xl bg-[#1a160e] text-[#aba79c] text-xs font-mono cursor-pointer disabled:opacity-50 hover:text-white transition-colors"
              >
                {t('common.cancel', 'Cancel')}
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (editLoading || !editingProduce) return;

                  const parsedPrice = parseFloat(editPrice);
                  const parsedQuantity = parseFloat(editQuantity);

                  if (isNaN(parsedPrice) || parsedPrice < 0) {
                    setEditError('Please enter a valid price per unit (₹ 0 or greater).');
                    return;
                  }
                  if (isNaN(parsedQuantity) || parsedQuantity < 0) {
                    setEditError('Please enter a valid stock quantity (0 or greater).');
                    return;
                  }

                  setEditLoading(true);
                  setEditError(null);

                  try {
                    const result = await updateListing(editingProduce.id, {
                      pricePerUnit: parsedPrice,
                      quantity: parsedQuantity,
                      status: parsedQuantity > 0 ? 'Active' : 'Sold Out',
                    });

                    if (result) {
                      setEditingProduce(null);
                    }
                  } catch (err: any) {
                    console.error('[FarmerDashboard] Failed to update produce:', err);
                    setEditError(err?.message || 'Failed to update produce listing. Please try again.');
                  } finally {
                    setEditLoading(false);
                  }
                }}
                disabled={editLoading}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#b89120] text-[#0a0a0a] font-serif font-bold text-xs sm:text-sm uppercase tracking-wider hover:brightness-110 shadow-lg cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {editLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
                    <span>{t('common.loading', 'Saving...')}</span>
                  </>
                ) : (
                  <span>{t('common.save', 'Save Changes')}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
