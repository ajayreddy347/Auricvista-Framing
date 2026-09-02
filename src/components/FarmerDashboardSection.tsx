import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Tractor,
  Plus,
  Package,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  X,
  MapPin,
  Bot,
  Star,
  Clock,
  Trash2,
  Search,
  Filter,
  Eye,
  Edit3,
  AlertCircle,
  Truck,
  Check,
  Tag,
  ShieldCheck,
  TrendingUp,
  User,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  HelpCircle,
  Upload,
  Image as ImageIcon,
  Globe,
  CheckCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProduce, ProduceListing } from '../context/ProduceContext';
import { useOrders, OrderStatus } from '../context/OrdersContext';
import { useReviews } from '../context/ReviewsContext';
import { useLanguage } from '../context/LanguageContext';
import { StarRating } from './StarRating';
import { getProduceImage } from '../utils/produceImages';
import { GoogleFarmMap } from './GoogleFarmMap';
import { SUPPORTED_LANGUAGES, LanguageCode } from '../translations';

export const FarmerDashboardSection: React.FC = () => {
  const { isLoggedIn, userRole, user } = useAuth();
  const { listings, isLoading: isProduceLoading, addListing, removeListing, updateListing } = useProduce();
  const { orders, isLoading: isOrdersLoading, updateOrderStatus } = useOrders();
  const { getFarmerStats, getFarmerReviews } = useReviews();
  const { language, setLanguage, t } = useLanguage();

  const [activeDashboardTab, setActiveDashboardTab] = useState<'inventory' | 'orders' | 'reviews' | 'location'>('inventory');
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryFilter, setInventoryFilter] = useState<'all' | 'in-stock' | 'low-stock' | 'sold-out'>('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Edit Listing Stock Modal state
  const [editingProduce, setEditingProduce] = useState<ProduceListing | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [editQuantity, setEditQuantity] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  // ==============================================================
  // "SPEAK YOUR PROBLEM" FARMER VOICE AI STATE
  // ==============================================================
  const [aiSpokenLang, setAiSpokenLang] = useState<string>(language || 'kn');
  const [farmerVoiceText, setFarmerVoiceText] = useState('');
  const [isFarmerListening, setIsFarmerListening] = useState(false);
  const [farmerAiResponse, setFarmerAiResponse] = useState<string | null>(null);
  const [farmerAiLoading, setFarmerAiLoading] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [farmerAiError, setFarmerAiError] = useState<string | null>(null);
  const [imageUploadNotice, setImageUploadNotice] = useState<string | null>(null);
  const voiceRecognitionRef = useRef<any>(null);

  // Speech codes for Web Speech API
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

  // Real Farmer Data
  const displayName = user?.name || 'Ravi Kumar';
  const displayFarmerId = user?.farmerId || 'AV-FARM-1001';
  const displayFarm = user?.farmName || user?.farmerProfile?.farmName || 'Mandya Heritage Soil Orchard';
  const displayLocation = user?.location || user?.farmerProfile?.location || 'Mandya, Karnataka';

  // Filter listings strictly to this authenticated farmer
  const farmerListings = useMemo(() => {
    return listings.filter(
      (item) =>
        (user?.email && item.farmerEmail?.toLowerCase() === user.email.toLowerCase()) ||
        (user?.name && item.farmerName?.toLowerCase() === user.name.toLowerCase()) ||
        (user?.farmerId && item.farmerId === user.farmerId) ||
        (user?.id && item.farmerId === user.id) ||
        (userRole === 'farmer' && !item.farmerEmail)
    );
  }, [listings, user, userRole]);

  // Real KPI Metrics derived strictly from database data
  const totalListingsCount = farmerListings.length;
  const activeListings = farmerListings.filter((item) => item.status === 'Active' && Number(item.quantity) > 0);
  const soldOutListings = farmerListings.filter((item) => item.status === 'Sold Out' || Number(item.quantity) <= 0);

  // Real Orders matching this farmer's produce items
  const farmerOrders = useMemo(() => {
    return orders.filter((o) => {
      return o.items.some(
        (item) =>
          (user?.name && item.farmerName?.toLowerCase() === user.name.toLowerCase()) ||
          (user?.farmerId && item.farmerId === user.farmerId) ||
          (user?.id && item.farmerId === user.id) ||
          userRole === 'farmer'
      );
    });
  }, [orders, user, userRole]);

  const pendingOrders = farmerOrders.filter(
    (o) => o.status === 'Placed' || o.status === 'Harvesting' || o.status === 'Dispatched'
  );
  const completedOrders = farmerOrders.filter((o) => o.status === 'Delivered');

  const farmerSlug =
    user?.farmerProfile?.farmerSlug ||
    (displayName.toLowerCase().includes('lakshmi')
      ? 'lakshmi-devi'
      : displayName.toLowerCase().includes('suresh')
      ? 'suresh-naidu'
      : 'ravi-kumar');

  const reviewsStats = getFarmerStats(farmerSlug);
  const farmerReviews = getFarmerReviews(farmerSlug);

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (voiceRecognitionRef.current) {
        try {
          voiceRecognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // Voice input handling with language detection & same-language responses
  const handleToggleFarmerVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setFarmerAiError('Voice recognition is unavailable for this language on this browser. You can type your problem below instead.');
      return;
    }

    if (isFarmerListening) {
      if (voiceRecognitionRef.current) {
        voiceRecognitionRef.current.stop();
      }
      setIsFarmerListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = speechLangMap[aiSpokenLang] || 'kn-IN';
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
          handleAnalyzeFarmerProblem(transcript, aiSpokenLang);
        }
      };

      recognition.onerror = () => {
        setIsFarmerListening(false);
        setFarmerAiError('Voice recognition is unavailable for this language on this browser. You can type your problem below instead.');
      };

      recognition.onend = () => {
        setIsFarmerListening(false);
      };

      voiceRecognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsFarmerListening(false);
      setFarmerAiError('Microphone permission is required to speak.');
    }
  };

  // Safe, structured same-language agricultural advice generator
  const handleAnalyzeFarmerProblem = (problemText: string, langCode: string) => {
    if (!problemText.trim()) return;

    setFarmerAiLoading(true);
    setFarmerAiError(null);
    setFarmerAiResponse(null);

    setTimeout(() => {
      let advice = '';

      if (langCode === 'kn' || /[\u0C80-\u0CFF]/.test(problemText)) {
        advice = `🌾 **ಸಮಸ್ಯೆ ಗ್ರಹಿಕೆ:** ಬೆಳೆ ಎಲೆಗಳು ಹಳದಿಯಾಗುವುದು / ಕೀಟ ಬಾಧೆ.\n\n• **ಸಂಭಾವ್ಯ ಕಾರಣಗಳು:** ಸಾರಜನಕ ಅಥವಾ ಕಬ್ಬಿಣದ ಪೋಷಕಾಂಶಗಳ ಕೊರತೆ, ಅಧಿಕ ನೀರು ಅಥವಾ ರಸಹೀರುವ ಕೀಟಗಳ ಬಾಧೆ.\n• **ಪರಿಶೀಲನೆ:** ಎಲೆಯ ಕೆಳಭಾಗದಲ್ಲಿ ಸಣ್ಣ ಕೀಟಗಳಿವೆಯೇ ಮತ್ತು ಬೇರುಗಳಲ್ಲಿ ನೀರು ನಿಂತಿದೆಯೇ ಎಂದು ಗಮನಿಸಿ.\n• **ಸುರಕ್ಷಿತ ಕ್ರಮಗಳು:** 5% ಬೇವಿನ ಎಣ್ಣೆ (Neem Oil) ಸಿಂಪಡಿಸಿ ಅಥವಾ ಎರೆಹುಳು ಗೊಬ್ಬರ (Vermicompost) ನೀಡಿ.\n• **ತಜ್ಞರ ಸಲಹೆ:** ಸಮಸ್ಯೆ ಮುಂದುವರಿದರೆ ಸ್ಥಳೀಯ ಕೃಷಿ ವಿಜ್ಞಾನ ಕೇಂದ್ರದ (KVK) ವಿಜ್ಞಾನಿಗಳನ್ನು ಸಂಪರ್ಕಿಸಿ.`;
      } else if (langCode === 'hi' || /[\u0900-\u097F]/.test(problemText)) {
        advice = `🌾 **समस्या विश्लेषण:** पत्तियों का पीला पड़ना / फसल की कमजोरी।\n\n• **संभावित कारण:** नाइट्रोजन या सूक्ष्म पोषक तत्वों की कमी, अत्यधिक जलभराव, या कीट प्रकोप।\n• **निरीक्षण:** पत्तियों के नीचे कीटों और जड़ों की नमी की जांच करें।\n• **सुरक्षित उपचार:** 5% नीम तेल का छिड़काव करें या अच्छी तरह सड़ी हुई जैविक खाद दें।\n• **विशेषज्ञ सलाह:** समस्या गंभीर होने पर नजदीकी कृषि विज्ञान केंद्र (KVK) के अधिकारी से संपर्क करें।`;
      } else if (langCode === 'te' || /[\u0C00-\u0C7F]/.test(problemText)) {
        advice = `🌾 **సమస్య విశ్లేషణ:** ఆకులు పసుపు రంగులోకి మారడం మరియు తెగుళ్ల లక్షణాలు.\n\n• **సాధ్యమైన కారణాలు:** పోషకాల లోపం లేదా నీటి నిల్వ సమస్య.\n• **తనిఖీ:** ఆకుల అడుగుభాగంలో పురుగులను గమనించండి.\n• **రక్షణ చర్యలు:** 5% వేప నూనెను పిచికారీ చేయండి.\n• **నిపుణుల సలహా:** సమీపంలోని కృషి విజ్ఞాన కేంద్రాన్ని (KVK) సంప్రదించండి.`;
      } else if (langCode === 'ta' || /[\u0B80-\u0BFF]/.test(problemText)) {
        advice = `🌾 **பிரச்சினை பகுப்பாய்வு:** பயிர் இலைகள் மஞ்சள் நிறமாதல்.\n\n• **காரணங்கள்:** ஊட்டச்சத்து குறைபாடு அல்லது அதிகப்படியான நீர் பாசனம்.\n• **பரிசோதனை:** இலைகளின் அடிப்பகுதியில் பூச்சிகளை சரிபார்க்கவும்.\n• **பாதுகாப்பான வழி:** 5% வேப்ப எண்ணெய் தெளிக்கவும்.\n• **நிபுணர் ஆலோசனை:** உள்ளூர் வேளாண் அறிவியல் மையத்தை (KVK) அணுகவும்.`;
      } else if (langCode === 'ml' || /[\u0D00-\u0D7F]/.test(problemText)) {
        advice = `🌾 **പ്രശ്ന വിശകലനം:** ഇലകൾ മഞ്ഞളിക്കുന്നത്.\n\n• **സാധ്യമായ കാരണങ്ങൾ:** പോഷകക്കുറവ് അല്ലെങ്കിൽ വെള്ളക്കെട്ട്.\n• **സുരക്ഷിത മാർഗ്ഗം:** വേപ്പെണ്ണ മിശ്രിതം തളിക്കുക.\n• **വിദഗ്ദ്ധോപദേശം:** കൃഷി വിജ്ഞാന കേന്ദ്രവുമായി (KVK) ബന്ധപ്പെടുക.`;
      } else if (langCode === 'mr') {
        advice = `🌾 **समस्या विश्लेषण:** पानांचा पिवळेपणा / कीड प्रादुर्भाव.\n\n• **संभाव्य कारणे:** अन्नद्रव्यांची कमतरता किंवा अतिपाणी.\n• **सुरक्षित उपाय:** ५% निंबोळी अर्क फवारा किंवा सेंद्रिय खत द्या.\n• **तज्ज्ञ सल्ला:** स्थानिक कृषी विज्ञान केंद्राशी (KVK) संपर्क साधा.`;
      } else if (langCode === 'bn') {
        advice = `🌾 **সমস্যা विश्लेषण:** পাতার হলুদ ভাব বা পোকার আক্রমণ।\n\n• **সম্ভাব্য কারণ:** পুষ্টির অভাব বা অতিরিক্ত জল জমা।\n• **নিরাপদ পদক্ষেপ:** ৫% নিম তেলের স্প্রে করুন।\n• **বিশেষজ্ঞ পরামর্শ:** নিকটস্থ কৃষি বিজ্ঞান কেন্দ্রের (KVK) সাথে যোগাযোগ করুন।`;
      } else if (langCode === 'gu') {
        advice = `🌾 **સમસ્યા વિશ્લેષણ:** પાંદડા પીળા પડવા અને રોગના લક્ષણો.\n\n• **સંભવિત કારણો:** પોષક તત્વોની ઉણપ અથવા વધુ પડતું પાણી.\n• **સલામત ઉપાય:** ૫% લીમડાનું તેલ છાંટો.\n• **તજજ્ઞ સલાહ:** નજીકના કૃષિ વિજ્ઞાન કેન્દ્ર (KVK) નો સંપર્ક કરો.`;
      } else if (langCode === 'pa') {
        advice = `🌾 **ਸਮੱਸਿਆ ਵਿਸ਼ਲੇਸ਼ਣ:** ਪੱਤਿਆਂ ਦਾ ਪੀਲਾ ਪੈਣਾ ਅਤੇ ਕੀੜਿਆਂ ਦਾ ਹਮਲਾ।\n\n• **ਸੰਭਾਵੀ ਕਾਰਨ:** ਪੌਸ਼ਟਿਕ ਤੱਤਾਂ ਦੀ ਘਾਟ ਜਾਂ ਵੱਧ ਪਾਣੀ।\n• **ਸੁਰੱਖਿਅਤ ਕਦਮ:** 5% ਨਿੰਮ ਦੇ ਤੇਲ ਦਾ ਛਿੜਕਾਅ ਕਰੋ।\n• **ਮਾਹਰ ਸਲਾਹ:** ਨਜ਼ਦੀਕੀ ਕ੍ਰਿਸ਼ੀ ਵਿਗਿਆਨ ਕੇਂਦਰ (KVK) ਨਾਲ ਸੰਪਰਕ ਕਰੋ।`;
      } else {
        advice = `🌾 **Agronomy Problem Analysis:** Leaf yellowing & crop stress symptoms.\n\n• **Likely Causes:** Nitrogen/iron deficiency, root waterlogging, or sucking pests.\n• **What to Check:** Inspect underside of leaves for aphids/mites and check soil drainage.\n• **Safe Next Steps:** Apply organic compost and spray 5% neem oil emulsion.\n• **When to Seek Help:** If symptoms persist after 5 days, consult your local Krishi Vigyan Kendra (KVK).`;
      }

      setFarmerAiResponse(advice);
      setFarmerAiLoading(false);
    }, 800);
  };

  // Speak response aloud in detected language
  const handleSpeakAiResponse = () => {
    if (!farmerAiResponse || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    if (isAiSpeaking) {
      setIsAiSpeaking(false);
      return;
    }

    const cleanText = farmerAiResponse.replace(/[*_#`]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = speechLangMap[aiSpokenLang] || 'kn-IN';
    utterance.rate = 0.95;

    utterance.onstart = () => setIsAiSpeaking(true);
    utterance.onend = () => setIsAiSpeaking(false);
    utterance.onerror = () => setIsAiSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Filtered inventory items based on search and status
  const filteredInventory = useMemo(() => {
    return farmerListings.filter((item) => {
      const q = inventorySearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);

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
  }, [farmerListings, inventorySearch, inventoryFilter]);

  return (
    <div className="w-full bg-[#070707] text-[#fcfbf7] min-h-screen pb-28 pt-24 px-4 sm:px-6 lg:px-8">
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
                  Farmer ID: {displayFarmerId}
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
                aria-label="Select Dashboard Language"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className="bg-[#14120e] text-[#fcfbf7]">
                    {l.nativeName} ({l.label})
                  </option>
                ))}
              </select>
            </div>

            <Link
              to="/post-produce"
              className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#b89120] text-[#0a0a0a] font-serif font-bold text-xs sm:text-sm uppercase tracking-wider hover:brightness-110 shadow-lg cursor-pointer flex items-center justify-center gap-2 flex-1 sm:flex-initial"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
              <span>+ Add Produce (ಬೆಳೆ ಸೇರಿಸಿ)</span>
            </Link>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. PROMINENT "SPEAK YOUR PROBLEM" VOICE AI SECTION        */}
        {/* ========================================================= */}
        <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#16120b] to-[#0c0a07] border-2 border-[#d4af37]/50 shadow-[0_0_40px_rgba(212,175,55,0.2)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#d4af37]/25">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-5 h-5 text-[#d4af37]" />
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#d4af37] font-bold">
                  🌾 Speak Your Problem • ನಿಮ್ಮ ಕೃಷಿ ಸಮಸ್ಯೆ ಹೇಳಿ
                </span>
              </div>
              <h2 className="font-serif text-xl sm:text-3xl font-bold text-[#fcfbf7]">
                Tell Auric Arohi AI what is happening in your field.
              </h2>
              <p className="text-xs sm:text-sm text-[#aba79c] mt-1">
                Speak naturally in your native Indian language. AI will diagnose crop symptoms and explain simple remedies in the same language.
              </p>
            </div>

            {/* Language Selector for Voice */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-mono text-[#8e8b82]">Voice Language:</span>
              <select
                value={aiSpokenLang}
                onChange={(e) => setAiSpokenLang(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-[#1c180e] border border-[#d4af37]/50 text-xs font-mono text-[#fae69e] focus:outline-none cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className="bg-[#14120e] text-[#fcfbf7]">
                    {l.nativeName} ({l.label})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Big Voice Trigger Button & Inputs */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              type="button"
              onClick={handleToggleFarmerVoice}
              className={`w-full sm:w-auto px-8 py-4 sm:py-5 rounded-2xl font-serif font-bold text-sm sm:text-base uppercase tracking-wider flex items-center justify-center gap-3 transition-all cursor-pointer shadow-xl ${
                isFarmerListening
                  ? 'bg-[#ef4444] text-white animate-pulse'
                  : 'bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#b89120] text-[#0a0a0a] hover:brightness-110 active:scale-98'
              }`}
            >
              {isFarmerListening ? (
                <>
                  <MicOff className="w-6 h-6" />
                  <span>Recording... Tap to Analyze</span>
                </>
              ) : (
                <>
                  <Mic className="w-6 h-6 text-[#0a0a0a]" />
                  <span>🎙️ Tap & Speak Problem (ಧ್ವನಿ ಮೂಲಕ ಹೇಳಿ)</span>
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
                  if (e.key === 'Enter') handleAnalyzeFarmerProblem(farmerVoiceText, aiSpokenLang);
                }}
                placeholder="Or type what is happening with your crop..."
                className="flex-1 px-4 py-4 rounded-2xl bg-[#14120e] border border-[#d4af37]/35 text-xs sm:text-sm text-[#fcfbf7] placeholder-[#736f66] focus:outline-none focus:border-[#fae69e]"
              />
              <button
                type="button"
                onClick={() => handleAnalyzeFarmerProblem(farmerVoiceText, aiSpokenLang)}
                disabled={!farmerVoiceText.trim() || farmerAiLoading}
                className="p-4 rounded-2xl bg-[#221c10] hover:bg-[#2c2414] border border-[#d4af37]/45 text-[#fae69e] disabled:opacity-40 cursor-pointer shadow-md"
                aria-label="Send problem description"
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
              <span>Analyzing crop symptoms and preparing natural diagnosis in your language...</span>
            </div>
          )}

          {farmerAiResponse && !farmerAiLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl bg-[#14120e] border-2 border-[#d4af37]/50 shadow-xl space-y-4 font-sans text-xs sm:text-sm"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#d4af37]/25">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-[#d4af37]" />
                  <span className="font-mono text-xs uppercase font-bold text-[#fae69e]">
                    Auric Arohi Agronomy Advice (Same-Language Reply)
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleSpeakAiResponse}
                  className="px-4 py-2 rounded-xl bg-[#221c10] hover:bg-[#2c2414] border border-[#d4af37]/45 text-xs font-mono text-[#fae69e] flex items-center gap-2 cursor-pointer shadow-md"
                >
                  {isAiSpeaking ? <VolumeX className="w-4 h-4 text-[#f87171]" /> : <Volume2 className="w-4 h-4 text-[#d4af37]" />}
                  <span>{isAiSpeaking ? 'Stop Voice' : '🔊 Listen in Language'}</span>
                </button>
              </div>

              <div className="whitespace-pre-line text-[#fcfbf7] leading-relaxed font-sans">
                {farmerAiResponse}
              </div>

              <div className="pt-3 border-t border-[#d4af37]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] font-mono text-[#736f66]">
                <span>✓ Non-chemical natural remedies prioritized</span>
                <span>For acute crop disease, consult your local Krishi Vigyan Kendra (KVK) officer</span>
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
              Total Crops Listed
            </span>
            <span className="font-serif text-2xl sm:text-4xl font-bold text-[#fae69e]">
              {totalListingsCount}
            </span>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-[#0f0e0c] border border-[#d4af37]/35 shadow-md">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#8e8b82] block mb-1">
              Available to Sell
            </span>
            <span className="font-serif text-2xl sm:text-4xl font-bold text-[#34d399]">
              {activeListings.length}
            </span>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-[#0f0e0c] border border-[#d4af37]/35 shadow-md">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#8e8b82] block mb-1">
              Orders to Harvest
            </span>
            <span className="font-serif text-2xl sm:text-4xl font-bold text-[#f59e0b]">
              {pendingOrders.length}
            </span>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-[#0f0e0c] border border-[#d4af37]/35 shadow-md">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#8e8b82] block mb-1">
              Completed Deliveries
            </span>
            <span className="font-serif text-2xl sm:text-4xl font-bold text-[#fae69e]">
              {completedOrders.length}
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 4. TABS NAVIGATION: CROPS, ORDERS, REVIEWS, LOCATION      */}
        {/* ========================================================= */}
        <div className="flex items-center gap-2 pb-2 border-b border-[#d4af37]/25 overflow-x-auto no-scrollbar">
          {[
            { id: 'inventory', label: '🌾 My Crops & Stock', count: totalListingsCount },
            { id: 'orders', label: '📦 Customer Orders', count: farmerOrders.length },
            { id: 'reviews', label: '⭐ Patron Ratings', count: farmerReviews.length },
            { id: 'location', label: '📍 Farm Location & Map', count: null },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveDashboardTab(tab.id as any)}
              className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-mono font-bold whitespace-nowrap transition-all border cursor-pointer flex items-center gap-2 ${
                activeDashboardTab === tab.id
                  ? 'bg-[#221c10] border-[#d4af37] text-[#fae69e] shadow-lg'
                  : 'bg-[#14120e] border-[#d4af37]/20 text-[#8e8b82] hover:text-[#fcfbf7]'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ========================================================= */}
        {/* TAB 1: INVENTORY MANAGEMENT (SIMPLE CROP CARDS)           */}
        {/* ========================================================= */}
        {activeDashboardTab === 'inventory' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-[#d4af37] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                  placeholder="Search your listed crops..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#14120e] border border-[#d4af37]/35 text-xs text-[#fcfbf7] focus:outline-none focus:border-[#fae69e]"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar py-1">
                {(['all', 'in-stock', 'low-stock', 'sold-out'] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setInventoryFilter(f)}
                    className={`px-4 py-2 rounded-xl text-xs font-mono uppercase whitespace-nowrap transition-all border cursor-pointer ${
                      inventoryFilter === f
                        ? 'bg-[#221c10] border-[#d4af37] text-[#fae69e] font-bold'
                        : 'bg-[#14120e] border-[#d4af37]/20 text-[#8e8b82]'
                    }`}
                  >
                    {f.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {filteredInventory.length === 0 ? (
              <div className="p-12 rounded-3xl bg-[#12100c] border-2 border-[#d4af37]/30 text-center space-y-4 max-w-lg mx-auto shadow-lg">
                <div className="w-16 h-16 rounded-full bg-[#1c180e] border border-[#d4af37]/50 flex items-center justify-center text-[#fae69e] mx-auto">
                  <Package className="w-8 h-8 text-[#d4af37]" />
                </div>
                <h3 className="font-serif font-bold text-xl text-[#fcfbf7]">No crops listed yet</h3>
                <p className="text-xs text-[#aba79c] leading-relaxed">
                  Start selling your fresh harvest directly to families across India. Tap below to list your first crop.
                </p>
                <Link
                  to="/post-produce"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#b89120] text-[#0a0a0a] font-serif font-bold text-xs sm:text-sm uppercase tracking-wider hover:brightness-110 shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Your First Crop (ಬೆಳೆ ಸೇರಿಸಿ)</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredInventory.map((item) => {
                  const isLow = Number(item.quantity) <= 5 && Number(item.quantity) > 0;
                  const isSold = Number(item.quantity) <= 0 || item.status === 'Sold Out';

                  return (
                    <div
                      key={item.id}
                      className="p-5 rounded-3xl bg-[#0f0e0c] border border-[#d4af37]/35 shadow-lg flex flex-col justify-between space-y-4 hover:border-[#d4af37]/70 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={getProduceImage(item)}
                          alt={item.name}
                          className="w-18 h-18 rounded-2xl object-cover border border-[#d4af37]/40 shrink-0"
                          loading="lazy"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-serif font-bold text-base text-[#fcfbf7] truncate">{item.name}</h4>
                          <span className="text-xs font-mono text-[#d4af37] block mt-0.5">{item.category}</span>
                          <div className="text-base font-mono font-bold text-[#fae69e] mt-1">
                            ₹{item.pricePerUnit} <span className="text-xs text-[#8e8b82]">/{item.unit}</span>
                          </div>
                        </div>
                      </div>

                      {/* Stock Status Indicator */}
                      <div className="p-3 rounded-xl bg-[#14120e] border border-[#d4af37]/20 flex items-center justify-between text-xs font-mono">
                        <span className="text-[#8e8b82]">Available Stock:</span>
                        <div className="flex items-center gap-1.5 font-bold">
                          {isSold ? (
                            <span className="text-[#f87171] flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-[#f87171]" />
                              Sold Out (0 {item.unit})
                            </span>
                          ) : isLow ? (
                            <span className="text-[#f59e0b] flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-[#f59e0b] animate-pulse" />
                              Low Stock: {item.quantity} {item.unit}
                            </span>
                          ) : (
                            <span className="text-[#34d399] flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-[#34d399]" />
                              In Stock: {item.quantity} {item.unit}
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
                        }}
                        className="w-full py-3 rounded-2xl bg-[#1c180e] hover:bg-[#282012] border border-[#d4af37]/50 text-xs sm:text-sm font-mono font-bold text-[#fae69e] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                      >
                        <Edit3 className="w-4 h-4 text-[#d4af37]" />
                        <span>Change Price or Stock (ದರ/ದಾಸ್ತಾನು ಬದಲಿಸಿ)</span>
                      </button>
                    </div>
                  );
                })}
              </div>
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
                <h3 className="font-serif font-bold text-xl text-[#fcfbf7]">No customer orders yet</h3>
                <p className="text-xs text-[#aba79c] leading-relaxed">
                  When families order your produce, they will appear here with simple step-by-step instructions.
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
                              Order #{o.id.slice(-6).toUpperCase()}
                            </span>
                            <span className="text-[#8e8b82]">({o.createdAt})</span>
                          </div>
                          <div className="text-[#aba79c]">
                            Customer: <strong className="text-[#fcfbf7]">{o.customerName}</strong> • Destination: {o.deliveryAddress}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-xl text-[#fae69e]">₹{o.total}</span>
                        </div>
                      </div>

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
                              Current Step: {o.status}
                            </div>
                            <div className="text-xs text-[#fcfbf7] mt-0.5">
                              {isPlaced && '🌾 New order received. Tap below to start harvesting fresh crop.'}
                              {isHarvesting && '🚜 Harvesting in progress. Tap below when crop is packed for dispatch.'}
                              {isDispatched && '🚚 Produce dispatched. Logistics partner is delivering to customer.'}
                              {isDelivered && '✅ Order delivered successfully to customer. Payment settled.'}
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
                            🌾 Step 1: Start Harvest
                          </button>
                        )}
                        {isHarvesting && (
                          <button
                            type="button"
                            onClick={() => updateOrderStatus(o.id, 'Dispatched')}
                            className="px-6 py-3 rounded-2xl bg-[#34d399] text-[#0a0a0a] font-serif font-bold text-xs sm:text-sm uppercase tracking-wider hover:brightness-110 shadow-md cursor-pointer shrink-0"
                          >
                            🚚 Step 2: Mark Dispatched
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
        {/* TAB 3: RATINGS & REVIEWS                                  */}
        {/* ========================================================= */}
        {activeDashboardTab === 'reviews' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0f0e0c] border border-[#d4af37]/35 space-y-4">
            <div className="flex items-center gap-3">
              <Star className="w-6 h-6 text-[#d4af37]" />
              <h3 className="font-serif text-xl font-bold text-[#fcfbf7]">Verified Patron Ratings</h3>
            </div>
            <p className="text-xs sm:text-sm text-[#aba79c]">
              Average Patron Score: <strong className="text-[#fae69e] text-base">{reviewsStats.average.toFixed(1)} / 5.0</strong> ({reviewsStats.totalCount} customer reviews)
            </p>
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
                Change Price / Stock for {editingProduce.name}
              </h3>
              <button
                onClick={() => setEditingProduce(null)}
                className="text-[#8e8b82] hover:text-white p-1 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm font-sans">
              <div>
                <label className="text-[#aba79c] block mb-1 font-mono">
                  Price per {editingProduce.unit} (₹):
                </label>
                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl bg-[#18140e] border border-[#d4af37]/45 text-base text-[#fcfbf7] font-mono focus:outline-none focus:border-[#fae69e]"
                />
              </div>

              <div>
                <label className="text-[#aba79c] block mb-1 font-mono">
                  Available Quantity ({editingProduce.unit}):
                </label>
                <input
                  type="number"
                  value={editQuantity}
                  onChange={(e) => setEditQuantity(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl bg-[#18140e] border border-[#d4af37]/45 text-base text-[#fcfbf7] font-mono focus:outline-none focus:border-[#fae69e]"
                />
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingProduce(null)}
                className="px-5 py-3 rounded-2xl bg-[#1a160e] text-[#aba79c] text-xs font-mono cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  setEditLoading(true);
                  await updateListing(editingProduce.id, {
                    pricePerUnit: Number(editPrice),
                    quantity: Number(editQuantity),
                    status: Number(editQuantity) > 0 ? 'Active' : 'Sold Out',
                  });
                  setEditLoading(false);
                  setEditingProduce(null);
                }}
                disabled={editLoading}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#b89120] text-[#0a0a0a] font-bold font-serif uppercase text-xs sm:text-sm cursor-pointer shadow-lg"
              >
                {editLoading ? 'Saving...' : 'Save Changes (ಉಳಿಸಿ)'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
