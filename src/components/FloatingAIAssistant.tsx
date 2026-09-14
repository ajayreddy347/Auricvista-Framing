import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bot,
  Sparkles,
  X,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  User,
  AlertCircle,
  Wheat,
  RotateCcw,
  CheckCircle2,
  Cpu,
  Trash2,
  ShoppingBag,
  Carrot,
  Apple,
  Flame,
  Sprout,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  MapPin,
  Tag,
  Package,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useProduce, ProduceListing } from '../context/ProduceContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getProduceImage } from '../utils/produceImages';
import { getLocalizedProduceName, getLocalizedCategory, getLocalizedUnit } from '../utils/produceLocalization';
import { ProductImage } from './ProductImage';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  recommendedProduce?: ProduceListing[];
  isError?: boolean;
  retryQuery?: string;
}

export const FloatingAIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, t } = useLanguage();
  const { listings } = useProduce();
  const { user, userRole } = useAuth();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [loadingStep, setLoadingStep] = useState<'idle' | 'understanding' | 'searching' | 'preparing'>('idle');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputFieldRef = useRef<HTMLInputElement>(null);

  // 1. Keyboard Escape Key Support & Global Window Trigger Support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => {
      setIsOpen(true);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('auricarohi:open-ai', handleCustomOpen);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('auricarohi:open-ai', handleCustomOpen);
    };
  }, [isOpen]);

  // 2. Prevent underlying page scroll when AI Assistant modal is open on small screens
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Language speech codes for Web Speech API
  const langSpeechCodes: Record<string, string> = {
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

  // Quick Customer & Farmer prompts
  const quickPrompts = useMemo(() => {
    return [
      {
        id: 'veg',
        icon: Carrot,
        label: language === 'kn' ? '🥬 ತಾಜಾ ತರಕಾರಿಗಳು' : language === 'hi' ? '🥬 ताज़ी सब्जियां' : '🥬 Fresh Vegetables',
        query:
          language === 'kn'
            ? 'ಪ್ರಸ್ತುತ ಲಭ್ಯವಿರುವ ತಾಜಾ ತರಕಾರಿಗಳು ಮತ್ತು ಅವುಗಳ ದರವನ್ನು ತೋರಿಸಿ.'
            : language === 'hi'
            ? 'वर्तमान में उपलब्ध ताज़ी सब्जियां और उनके मूल्य बताएं।'
            : 'Show me fresh vegetables currently available and their prices.',
      },
      {
        id: 'fruits',
        icon: Apple,
        label: language === 'kn' ? '🍎 ಹಣ್ಣುಗಳು' : language === 'hi' ? '🍎 ताज़े फल' : '🍎 Available Fruits',
        query:
          language === 'kn'
            ? 'ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಯಾವ ಸಾವಯವ ಹಣ್ಣುಗಳು ಲಭ್ಯವಿವೆ?'
            : language === 'hi'
            ? 'मंडी में कौन-कौन से जैविक फल उपलब्ध हैं?'
            : 'What fresh fruits are available in the marketplace?',
      },
      {
        id: 'budget',
        icon: TrendingUp,
        label: language === 'kn' ? '💰 ₹150 ಒಳಗಿನ ಬೆಳೆಗಳು' : language === 'hi' ? '💰 ₹150 से कम में' : '💰 Under ₹150',
        query:
          language === 'kn'
            ? '₹150 ಅಥವಾ ಅದಕ್ಕಿಂತ ಕಡಿಮೆ ದರದಲ್ಲಿರುವ ಬೆಳೆಗಳನ್ನು ತೋರಿಸಿ.'
            : language === 'hi'
            ? '₹150 या उससे कम कीमत वाले उत्पाद दिखाएं।'
            : 'Find produce under ₹150 per kg/unit.',
      },
      {
        id: 'spices',
        icon: Flame,
        label: language === 'kn' ? '🌶️ ಸಾವಯವ ಸಾಂಬಾರ' : language === 'hi' ? '🌶️ जैविक मसाले' : '🌶️ Spices & Seasonings',
        query:
          language === 'kn'
            ? 'ಯಾವ ರೈತರು ಅರಿಶಿನ ಮತ್ತು ಕೇಸರಿ ಮುಂತಾದ ಸಾಂಬಾರ ಪದಾರ್ಥಗಳನ್ನು ಮಾರಾಟ ಮಾಡುತ್ತಿದ್ದಾರೆ?'
            : language === 'hi'
            ? 'कौन से किसान हल्दी व केसर जैसे मसाले बेच रहे हैं?'
            : 'Which verified farmers are selling spices and seasonings like Turmeric and Saffron?',
      },
      {
        id: 'recipes',
        icon: Sparkles,
        label: language === 'kn' ? '🍲 ಅಡುಗೆ & ಬಳಕೆ ಸಲಹೆ' : language === 'hi' ? '🍲 व्यंजन व पाक विधि' : '🍲 Recipe & Cooking Tips',
        query:
          language === 'kn'
            ? 'ತಾಜಾ ಪಾಲಕ್ ಸೊಪ್ಪಿನಿಂದ ಯಾವ ರುಚಿಕರ ಅಡುಗೆಗಳನ್ನು ಮಾಡಬಹುದು ಮತ್ತು ಅದನ್ನು ಹೇಗೆ ಸಂರಕ್ಷಿಸಿಡಬೇಕು?'
            : language === 'hi'
            ? 'ताज़ी पालक से कौन से स्वादिष्ट व्यंजन बनाए जा सकते हैं और इसे कैसे सुरक्षित रखें?'
            : 'What dishes can I cook with fresh baby spinach and how should I store it to keep it fresh?',
      },
      {
        id: 'track',
        icon: Package,
        label: language === 'kn' ? '📦 ಆರ್ಡರ್ ಟ್ರ್ಯಾಕಿಂಗ್' : language === 'hi' ? '📦 ऑर्डर ट्रैकिंग' : '📦 Track My Order',
        query:
          language === 'kn'
            ? 'ನನ್ನ ಆರ್ಡರ್ ಸ್ಥಿತಿಯನ್ನು ಹೇಗೆ ಟ್ರ್ಯಾಕ್ ಮಾಡಬೇಕು?'
            : language === 'hi'
            ? 'मैं अपने ऑर्डर की स्थिति कैसे ट्रैक कर सकता हूँ?'
            : 'How can I track my farm harvest order from harvest to delivery?',
      },
    ];
  }, [language]);
  useEffect(() => {
    const welcomeGreetings: Record<string, string> = {
      en: '🌾 Welcome to Auric Arohi AI! I can help you discover fresh produce directly from verified Indian farmers, suggest seasonal picks, share cooking tips, or guide your orders.',
      kn: '🌾 ಆರಿಕ್ ಆರೋಹಿ AI ಸಹಾಯಕಕ್ಕೆ ಸ್ವಾಗತ! ತಾಜಾ ಬೆಳೆಗಳನ್ನು ಹುಡುಕಲು, ದರಗಳನ್ನು ಪರಿಶೀಲಿಸಲು, ಅಡುಗೆ ವಿಧಾನಗಳನ್ನು ತಿಳಿಯಲು ಅಥವಾ ಆರ್ಡರ್ ಟ್ರ್ಯಾಕ್ ಮಾಡಲು ನಾನು ಸಹಾಯ ಮಾಡುತ್ತೇನೆ.',
      hi: '🌾 ऑरिक आरोही एआई सहायक में आपका स्वागत है! मैं सीधे भारतीय किसानों से ताज़ी उपज खोजने, मौसमी सुझाव देने और आपके ऑर्डर की जानकारी में मदद कर सकता हूँ।',
      te: '🌾 ఆరిక్ ఆరోహి AI సహాయకుడికి స్వాగతం! తాజా పంటల వివరాలు, ధరలు, వంటకాల చిట్కాలు లేదా మీ ఆర్డర్లను ట్రాక్ చేయడానికి నేను సహాయం చేస్తాను.',
      ta: '🌾 ஆரிக் ஆரோஹி AI உதவியாளருக்கு வரவேற்கிறோம்! விவசாயிகளின் புதிய விளைபொருட்களைக் கண்டறியவும், சமையல் குறிப்புகளைப் பெறவும் நான் உதவுகிறேன்.',
      ml: '🌾 ഓറിക് ആരോഹി AI സഹായിയിലേക്ക് സ്വാഗതം! കർഷകരിൽ നിന്ന് പുതിയ വിളകൾ കണ്ടെത്താനും വിലകൾ അറിയാനും ഓർഡറുകൾ പരിശോധിക്കാനും ഞാൻ സഹായിക്കാം.',
      bn: '🌾 অরিক আরোহী এআই-তে স্বাগতম! আমি আপনাকে যাচাইকৃত কৃষকদের কাছ থেকে তাজা পণ্য খুঁজে পেতে, রান্নার টিপস পেতে বা অর্ডার ট্র্যাক করতে সাহায্য করতে পারি।',
      mr: '🌾 ऑरिक आरोही एआय मध्ये आपले स्वागत आहे! मी तुम्हाला थेट शेतकऱ्यांकडून ताजी फळे व भाजीपाला शोधण्यात आणि शेती सल्ल्यात मदत करू शकतो.',
      gu: '🌾 ઑરિક આરોહી AI માં આપનું સ્વાગત છે! હું તમને સીધા ખેડૂતો પાસેથી તાજી ઉપજ શોધવામાં અને રસોઈ કે ખેતી સલાહમાં મદદ કરી શકું છું.',
      pa: '🌾 ਔਰਿਕ ਆਰੋਹੀ ਏਆਈ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ! ਮੈਂ ਪ੍ਰਮਾਣਿਤ ਕਿਸਾਨਾਂ ਤੋਂ ਤਾਜ਼ੀ ਉਪਜ ਲੱਭਣ ਅਤੇ ਖੇਤੀ ਦੇ ਸੁਝਾਵਾਂ ਵਿੱਚ ਤੁਹਾਡੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ।',
      or: '🌾 ଅରିକ ଆରୋହୀ AI କୁ ସ୍ୱାଗତ! ମୁଁ ଆପଣଙ୍କୁ ଚାଷୀଙ୍କ ଠାରୁ ସତେଜ ଫସଲ ଖୋଜିବା ଏବଂ ଚାଷ ସମ୍ବନ୍ଧୀୟ ସୂଚନା ପାଇଁ ସାହାଯ୍ୟ କରିପାରିବି।',
      as: '🌾 অৰিক আৰোহী AI লৈ স্বাগতম! মই আপোনাক কৃষকসকলৰ পৰা সতেজ শাক-পাচলি বিচাৰি পোৱাত আৰু কৃষি পৰামৰ্শত সহায় কৰিব পাৰোঁ।',
      ur: '🌾 اورک آروہی اے آئی میں خوش آمدید! میں تصدیق شدہ کسانوں سے تازہ فصلیں تلاش کرنے، قیمتیں معلوم کرنے اور کاشتکاری سے متعلق سوالات میں آپ کی مدد کر سکتا ہوں۔',
    };

    setMessages((prev) => {
      // Welcome message appears ONLY when chat is first opened / empty
      if (prev.length === 0) {
        return [
          {
            id: 'msg-welcome',
            sender: 'ai',
            text: welcomeGreetings[language] || welcomeGreetings.en,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ];
      }
      // If only the initial welcome message exists, update its translation
      if (prev.length === 1 && prev[0].id === 'msg-welcome') {
        return [
          {
            ...prev[0],
            text: welcomeGreetings[language] || welcomeGreetings.en,
          },
        ];
      }
      // Never repeat or overwrite existing user conversation
      return prev;
    });
  }, [language]);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loadingStep, isOpen]);

  // Handle Speech Recognition
  const handleToggleVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError('Speech recognition is not supported in this browser. Please type your question.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = langSpeechCodes[language] || 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setLiveTranscript('');
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setLiveTranscript(transcript);
        if (event.results[0].isFinal) {
          setInputText(transcript);
          handleProcessQuery(transcript);
          setIsListening(false);
        }
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        setSpeechError(`Voice input issue: ${event.error}`);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
      setSpeechError('Microphone permission required.');
    }
  };

  // Text-To-Speech response output
  const handleSpeakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const cleanText = text.replace(/[*_#`]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = langSpeechCodes[language] || 'en-IN';
    utterance.rate = 0.95;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Natural, user-friendly failure message without technical jargon
  const getFriendlyErrorMessage = (lang: string): string => {
    switch (lang) {
      case 'kn':
        return 'ಈ ಸಮಯದಲ್ಲಿ ಪ್ರತಿಕ್ರಿಯಿಸಲು ಸ್ವಲ್ಪ ಸಮಸ್ಯೆಯಾಗಿದೆ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಮತ್ತೊಮ್ಮೆ ಕೇಳಿ.';
      case 'hi':
        return 'इस समय उत्तर देने में थोड़ी परेशानी हो रही है। कृपया अपना सवाल दोबारा पूछें।';
      case 'te':
        return 'ప్రస్తుతం స్పందించడంలో సమస్య ఉంది. దయచేసి మీ ప్రశ్నను మళ్లీ అడగండి.';
      case 'ta':
        return 'தற்போது பதிலளிப்பதில் சிக்கல் ஏற்பட்டுள்ளது. தயவுசெய்து உங்கள் கேள்வியை மீண்டும் கேட்கவும்.';
      case 'mr':
        return 'या वेळी प्रतिसाद देण्यात थोडी अडचण येत आहे. कृपया आपला प्रश्न पुन्हा विचारा.';
      case 'bn':
        return 'এই মুহূর্তে উত্তর দিতে কিছুটা সমস্যা হচ্ছে। অনুগ্রহ করে আপনার প্রশ্নটি আবার জিজ্ঞাসা করুন।';
      case 'gu':
        return 'આ સમયે જવાબ આપવામાં થોડી સમસ્યા આવી રહી છે. કૃપા કરીને તમારો પ્રશ્ન ફરી પૂછો.';
      case 'ur':
        return 'اس وقت جواب دینے میں دشواری ہو رہی ہے۔ براہ کرم اپنا سوال دوبارہ پوچھیں۔';
      default:
        return "I'm having trouble connecting right now. Please try asking your question again.";
    }
  };

  // Intelligent query processor calling unified Auric AI platform backend
  const handleProcessQuery = async (queryText: string) => {
    if (!queryText.trim() || loadingStep !== 'idle') return;

    const trimmedQuery = queryText.trim();
    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: trimmedQuery,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoadingStep('understanding');

    let searchTimer: ReturnType<typeof setTimeout> | null = setTimeout(() => {
      setLoadingStep('searching');
    }, 450);

    // 25-second client timeout ensures Auric AI never hangs indefinitely while allowing rich generations
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => {
      abortController.abort();
    }, 25000);

    try {
      const res = await fetch('/api/auric-ai-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortController.signal,
        body: JSON.stringify({
          prompt: trimmedQuery,
          language,
          history: messages.slice(-6).map((m) => ({ sender: m.sender, text: m.text })),
          context: {
            userRole: userRole || user?.role || 'customer',
            userName: user?.name,
            farmerProduce: user?.mainCrops,
            farmerLocation: user?.location,
          },
        }),
      });

      if (!res.ok) {
        throw new Error(`Request returned non-200 status: ${res.status}`);
      }

      const data = await res.json();
      let matchedProduce: ProduceListing[] = [];

      if (Array.isArray(data.recommendedProduce) && data.recommendedProduce.length > 0) {
        matchedProduce = data.recommendedProduce
          .map((p: any) => {
            if (!p) return null;
            const pName = (p.name || '').toLowerCase();
            const found = (listings || []).find(
              (l) => l && (l.id === p.id || (l.name && l.name.toLowerCase() === pName))
            );
            return found || p;
          })
          .filter(Boolean);
      }

      const aiMsg: Message = {
        id: `msg-${Date.now()}`,
        sender: 'ai',
        text: data.reply || getFriendlyErrorMessage(language),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedProduce: matchedProduce.slice(0, 4),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.warn('AI assist request encountered an issue or timed out:', err);

      // Safe, natural-language error message without ANY technical words
      const friendlyError = getFriendlyErrorMessage(language);

      const aiMsg: Message = {
        id: `msg-${Date.now()}`,
        sender: 'ai',
        text: friendlyError,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
        retryQuery: trimmedQuery,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      clearTimeout(timeoutId);
      if (searchTimer) {
        clearTimeout(searchTimer);
        searchTimer = null;
      }
      // Guaranteed clearing of loading state on BOTH success and error
      setLoadingStep('idle');
    }
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom Right) */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-3.5 sm:p-4 rounded-full bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#b89120] text-[#0a0a0a] shadow-[0_0_35px_rgba(212,175,55,0.45)] border border-[#ffffff]/40 flex items-center gap-2.5 cursor-pointer hover:brightness-110 active:scale-95"
          title="Ask Auric Arohi AI (Press anytime)"
          aria-label="Ask Auric Arohi AI Assistant"
        >
          <Bot className="w-5 sm:w-6 h-5 sm:h-6 text-[#0a0a0a]" />
          <span className="font-serif font-bold text-xs uppercase tracking-wider hidden sm:inline">
            Ask Auric AI
          </span>
          <span className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse" />
        </motion.button>
      )}

      {/* Floating Chat Panel & Backdrop Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Dark Backdrop for Mobile / Outside Click Dismissal */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[998]"
              aria-hidden="true"
            />

            {/* Viewport-Constrained Sticky Panel */}
            <div className="fixed inset-x-2 bottom-2 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[460px] z-[999] flex flex-col justify-end pointer-events-none">
              <motion.div
                initial={{ opacity: 0, y: 25, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 25, scale: 0.96 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-[88vh] sm:h-[620px] max-h-[calc(100vh-2rem)] bg-[#0e0d0b] border-2 border-[#d4af37]/60 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden backdrop-blur-2xl pointer-events-auto ring-1 ring-[#fae69e]/30"
              >
                {/* ========================================================================= */}
                {/* 1. STICKY ALWAYS-VISIBLE HEADER WITH GUARANTEED ACCESSIBLE CLOSE (X) BTN  */}
                {/* ========================================================================= */}
                <div className="sticky top-0 z-30 p-3.5 sm:p-4 bg-gradient-to-r from-[#1c170e] via-[#14110b] to-[#0e0d0b] border-b border-[#d4af37]/30 flex items-center justify-between shrink-0 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#8a6b18] flex items-center justify-center text-[#0a0a0a] shadow-[0_0_15px_rgba(212,175,55,0.4)] shrink-0">
                      <Bot className="w-5 h-5 text-[#0a0a0a]" />
                    </div>
                    <div>
                      <h3 className="font-serif text-sm sm:text-base font-bold text-[#fcfbf7] flex items-center gap-1.5 leading-none">
                        <span>Auric Arohi AI</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" />
                      </h3>
                      <p className="text-[10px] font-mono text-[#aba79c] mt-0.5 truncate max-w-[200px] sm:max-w-[260px]">
                        {t('ai.shoppingAssistant', 'Indian Agricultural Shopping Assistant')}
                      </p>
                    </div>
                  </div>

                  {/* Top-Right Action Controls with Prominent X Button */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setMessages([])}
                      className="p-2 rounded-xl text-[#8e8b82] hover:text-[#fae69e] hover:bg-white/5 transition-colors cursor-pointer"
                      title="Clear Chat History"
                      aria-label="Clear Chat History"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* PROMINENT HIGH-CONTRAST CLOSE BUTTON */}
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="p-2 sm:px-2.5 rounded-xl bg-white/10 hover:bg-[#d4af37] text-[#fcfbf7] hover:text-[#0a0a0a] border border-white/15 hover:border-[#fae69e] transition-all cursor-pointer flex items-center gap-1 shadow-sm active:scale-95"
                      title="Close Assistant (Esc)"
                      aria-label="Close Assistant"
                    >
                      <X className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-[10px] font-mono font-bold hidden sm:inline">ESC</span>
                    </button>
                  </div>
                </div>

                {/* ========================================================================= */}
                {/* 2. QUICK PROMPTS STRIP                                                   */}
                {/* ========================================================================= */}
                <div className="p-2 bg-[#14110c] border-b border-[#d4af37]/15 overflow-x-auto no-scrollbar flex items-center gap-1.5 shrink-0">
                  {quickPrompts.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleProcessQuery(p.query)}
                      className="px-2.5 py-1 rounded-xl bg-[#1e1910] hover:bg-[#2c2414] border border-[#d4af37]/30 text-[11px] font-sans text-[#fae69e] whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <p.icon className="w-3 h-3 text-[#d4af37]" />
                      <span>{p.label}</span>
                    </button>
                  ))}
                </div>

                {/* ========================================================================= */}
                {/* 3. ONLY THIS SCROLLS: CHAT MESSAGES CONTAINER                            */}
                {/* ========================================================================= */}
                <div className="flex-1 overflow-y-auto min-h-0 p-3.5 sm:p-4 space-y-3.5 font-sans text-xs">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[88%] p-3.5 rounded-2xl leading-relaxed ${
                          msg.sender === 'user'
                            ? 'bg-gradient-to-r from-[#d4af37] to-[#c2981f] text-[#0a0a0a] font-medium rounded-tr-none shadow-md'
                            : 'bg-[#16130e] border border-[#d4af37]/30 text-[#fcfbf7] rounded-tl-none space-y-2.5'
                        }`}
                      >
                        <div
                          className={`whitespace-pre-line text-xs sm:text-[13px] ${language === 'ur' ? 'text-right font-sans' : ''}`}
                          dir={language === 'ur' ? 'rtl' : 'ltr'}
                        >
                          {msg.text}
                        </div>

                        {/* Produce Cards Embedded Inside AI Chat Response */}
                        {msg.recommendedProduce && msg.recommendedProduce.length > 0 && (
                          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#d4af37]/20">
                            {msg.recommendedProduce.map((prod) => (
                              <div
                                key={prod.id}
                                onClick={() => {
                                  setIsOpen(false);
                                  navigate('/marketplace');
                                }}
                                className="p-2 rounded-xl bg-[#0e0d0a] border border-[#d4af37]/30 hover:border-[#fae69e] transition-all cursor-pointer flex flex-col justify-between space-y-1 group"
                              >
                                <div className="h-16 rounded-lg overflow-hidden bg-[#18140e]">
                                  <ProductImage
                                     src={getProduceImage(prod)}
                                     alt={prod.name}
                                     productName={prod.name}
                                     category={prod.category}
                                     size="xs"
                                     className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                   />
                                </div>
                                <div className="font-serif font-bold text-[11px] text-[#fcfbf7] truncate">
                                  {getLocalizedProduceName(prod.name, language)}
                                </div>
                                <div className="text-[9px] font-mono text-[#8e8b82] truncate">
                                  👨🌾 {prod.farmerName}
                                </div>
                                <div className="text-[10px] font-mono font-bold text-[#fae69e]">
                                  ₹{prod.pricePerUnit}/{getLocalizedUnit(prod.unit, language)}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Speaker & Retry Controls on AI Messages */}
                        {msg.sender === 'ai' && (
                          <div className="flex items-center justify-between pt-1 border-t border-[#d4af37]/15 text-[10px] font-mono text-[#8e8b82]">
                            <span>{msg.timestamp}</span>
                            <div className="flex items-center gap-2">
                              {msg.isError && msg.retryQuery && (
                                <button
                                  type="button"
                                  onClick={() => handleProcessQuery(msg.retryQuery!)}
                                  className="inline-flex items-center gap-1 text-[#fae69e] hover:text-[#d4af37] p-1 rounded hover:bg-white/5 cursor-pointer underline underline-offset-2 transition-colors"
                                  title="Try again"
                                >
                                  <RotateCcw className="w-3 h-3" />
                                  <span>Try again</span>
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleSpeakText(msg.text)}
                                className="inline-flex items-center gap-1 text-[#d4af37] hover:text-[#fae69e] p-1 rounded hover:bg-white/5 cursor-pointer"
                                title="Listen to response"
                              >
                                {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-[#f87171]" /> : <Volume2 className="w-3.5 h-3.5" />}
                                <span>{isSpeaking ? 'Mute' : 'Listen'}</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Real-time Thinking HUD */}
                  {loadingStep !== 'idle' && (
                    <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#14120c] border border-[#d4af37]/30 text-[#fae69e] text-xs font-mono animate-pulse">
                      <Bot className="w-4 h-4 text-[#d4af37] animate-spin" />
                      <span>
                        {loadingStep === 'understanding'
                          ? 'Understanding your question...'
                          : loadingStep === 'searching'
                          ? 'Checking fresh harvests & verified farmers...'
                          : 'Preparing helpful response...'}
                      </span>
                    </div>
                  )}

                  {liveTranscript && (
                    <div className="p-2.5 rounded-xl bg-[#1c180e] border border-[#d4af37]/40 text-xs font-mono text-[#fae69e] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#ef4444] animate-ping" />
                      <span className="italic">"{liveTranscript}"</span>
                    </div>
                  )}

                  {speechError && (
                    <div className="p-2.5 rounded-xl bg-[#241010] border border-[#f87171]/40 text-xs font-mono text-[#f87171] flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{speechError}</span>
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </div>

                {/* ========================================================================= */}
                {/* 4. PINNED BOTTOM INPUT BAR                                               */}
                {/* ========================================================================= */}
                <div className="sticky bottom-0 z-30 p-3 sm:p-4 bg-[#120f0a] border-t border-[#d4af37]/25 shrink-0">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleProcessQuery(inputText);
                    }}
                    className="flex items-center gap-2"
                  >
                    <div className="relative flex-1">
                      <input
                        ref={inputFieldRef}
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder={t('ai.placeholder', 'Ask about crops, prices, cooking tips or orders...')}
                        className="w-full pl-3.5 pr-10 py-3 rounded-2xl bg-[#1a160f] border border-[#d4af37]/40 text-xs text-[#fcfbf7] placeholder-[#7a766e] focus:outline-none focus:border-[#fae69e] focus:ring-1 focus:ring-[#fae69e] shadow-inner"
                      />
                      <button
                        type="button"
                        onClick={handleToggleVoice}
                        className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-xl transition-all cursor-pointer ${
                          isListening
                            ? 'bg-[#ef4444] text-white animate-pulse shadow-[0_0_10px_#ef4444]'
                            : 'text-[#d4af37] hover:text-[#fae69e] hover:bg-white/5'
                        }`}
                        title={isListening ? 'Stop Voice Recording' : 'Speak Your Query (13 Languages)'}
                        aria-label="Voice Input"
                      >
                        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={!inputText.trim()}
                      className="p-3 rounded-2xl bg-gradient-to-r from-[#fae69e] to-[#d4af37] text-[#0a0a0a] disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer shrink-0"
                      title="Send Query"
                      aria-label="Send Query"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
