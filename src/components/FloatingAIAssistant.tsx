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

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  recommendedProduce?: ProduceListing[];
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

  // Initial welcome greeting
  useEffect(() => {
    const welcomeGreetings: Record<string, string> = {
      en: '🌾 Welcome to Auric Arohi AI! I can help you discover fresh produce directly from verified Indian farmers, suggest seasonal picks, share cooking tips, or guide your orders.',
      kn: '🌾 ಆರಿಕ್ ಆರೋಹಿ AI ಸಹಾಯಕಕ್ಕೆ ಸ್ವಾಗತ! ತಾಜಾ ಬೆಳೆಗಳನ್ನು ಹುಡುಕಲು, ದರಗಳನ್ನು ಪರಿಶೀಲಿಸಲು, ಅಡುಗೆ ವಿಧಾನಗಳನ್ನು ತಿಳಿಯಲು ಅಥವಾ ಆರ್ಡರ್ ಟ್ರ್ಯಾಕ್ ಮಾಡಲು ನಾನು ಸಹಾಯ ಮಾಡುತ್ತೇನೆ.',
      hi: '🌾 ऑरिक आरोही एआई सहायक में आपका स्वागत है! मैं सीधे भारतीय किसानों से ताज़ी उपज खोजने, मौसमी सुझाव देने और आपके ऑर्डर की जानकारी में मदद कर सकता हूँ।',
      te: '🌾 ఆరిక్ ఆరోహి AI సహాయకుడికి స్వాగతం! తాజా పంటల వివరాలు, ధరలు, వంటకాల చిట్కాలు లేదా మీ ఆర్డర్లను ట్రాక్ చేయడానికి నేను సహాయం చేస్తాను.',
      ta: '🌾 ஆரிக் ஆரோஹி AI உதவியாளருக்கு வரவேற்கிறோம்! விவசாயிகளின் புதிய விளைபொருட்களைக் கண்டறியவும், சமையல் குறிப்புகளைப் பெறவும் நான் உதவுகிறேன்.',
      ml: '🌾 ഓറിക് ആരോഹി AI സഹായിയിലേക്ക് സ്വാഗതം! കർഷകരിൽ നിന്ന് പുതിയ വിളകൾ കണ്ടെത്താനും വിലകൾ അറിയാനും ഓർഡറുകൾ പരിശോധിക്കാനും ഞാൻ സഹായിക്കാം.',
    };

    setMessages([
      {
        id: 'msg-welcome',
        sender: 'ai',
        text: welcomeGreetings[language] || welcomeGreetings.en,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
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

  // Intelligent real-data query processor
  const handleProcessQuery = async (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: queryText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoadingStep('understanding');

    const q = queryText.toLowerCase().trim();

    setTimeout(() => {
      setLoadingStep('searching');
    }, 400);

    setTimeout(() => {
      setLoadingStep('preparing');
    }, 800);

    setTimeout(() => {
      let responseText = '';
      let matchedProduce: ProduceListing[] = [];

      // 1. Vegetables query
      if (q.includes('veg') || q.includes('ತರಕಾರಿ') || q.includes('सब्जी') || q.includes('கூறுகாய') || q.includes('tomato') || q.includes('potato') || q.includes('onion') || q.includes('carrot') || q.includes('spinach')) {
        matchedProduce = listings.filter((l) =>
          l.category.toLowerCase().includes('veg') ||
          l.name.toLowerCase().includes('tomato') ||
          l.name.toLowerCase().includes('potato') ||
          l.name.toLowerCase().includes('onion') ||
          l.name.toLowerCase().includes('carrot') ||
          l.name.toLowerCase().includes('spinach')
        ).slice(0, 4);

        if (language === 'kn') {
          responseText = `ನಮ್ಮ ಪರಿಶೀಲಿತ ರೈತರಿಂದ ಲಭ್ಯವಿರುವ ಪ್ರಮುಖ ಸಾವಯವ ತರಕಾರಿಗಳು:\n\n• **${matchedProduce.map((p) => `${p.name} (₹${p.pricePerUnit}/${p.unit} - ${p.farmerName})`).join('\n• ')}**\n\nಇವುಗಳನ್ನು ನೇರವಾಗಿ ರೈತರ ಜಮೀನಿನಿಂದಲೇ ತಲುಪಿಸಲಾಗುತ್ತದೆ.`;
        } else if (language === 'hi') {
          responseText = `हमारे सत्यापित भारतीय किसानों से उपलब्ध प्रमुख ताज़ी सब्जियां:\n\n• **${matchedProduce.map((p) => `${p.name} (₹${p.pricePerUnit}/${p.unit} - ${p.farmerName})`).join('\n• ')}**\n\nइन्हें सुबह की ताज़ी कटाई के बाद सीधे आपके पास भेजा जाता है।`;
        } else {
          responseText = `Here are the freshest verified farm vegetables currently listed in PostgreSQL:\n\n• **${matchedProduce.map((p) => `${p.name} — ₹${p.pricePerUnit}/${p.unit} from ${p.farmerName} (${p.farmLocation})`).join('\n• ')}**\n\nEach listing is harvested at dawn with zero middleman holding times.`;
        }
      }
      // 2. Fruits query
      else if (q.includes('fruit') || q.includes('ಹಣ್ಣು') || q.includes('फल') || q.includes('mango') || q.includes('apple') || q.includes('banana') || q.includes('papaya') || q.includes('orange')) {
        matchedProduce = listings.filter((l) =>
          l.category.toLowerCase().includes('fruit') ||
          l.name.toLowerCase().includes('mango') ||
          l.name.toLowerCase().includes('apple') ||
          l.name.toLowerCase().includes('banana') ||
          l.name.toLowerCase().includes('papaya') ||
          l.name.toLowerCase().includes('orange')
        ).slice(0, 4);

        if (language === 'kn') {
          responseText = `ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಲಭ್ಯವಿರುವ ನೈಸರ್ಗಿಕವಾಗಿ ಮಾಗಿದ ತಾಜಾ ಹಣ್ಣುಗಳು:\n\n• **${matchedProduce.map((p) => `${p.name} (₹${p.pricePerUnit}/${p.unit})`).join('\n• ')}**\n\nಯಾವುದೇ ಕೃತಕ ಕಾರ್ಬೈಡ್ ಬಳಸದೆ ನೈಸರ್ಗಿಕವಾಗಿ ಕೊಯ್ಲು ಮಾಡಲಾದ ಹಣ್ಣುಗಳು.`;
        } else if (language === 'hi') {
          responseText = `मंडी में उपलब्ध प्राकृतिक रूप से पके ताज़े फल:\n\n• **${matchedProduce.map((p) => `${p.name} (₹${p.pricePerUnit}/${p.unit})`).join('\n• ')}**\n\nये फल बिना किसी कृत्रिम रसायन के सीधे बगीचों से तोड़े जाते हैं।`;
        } else {
          responseText = `Here are naturally tree-ripened farm fruits available in the marketplace:\n\n• **${matchedProduce.map((p) => `${p.name} — ₹${p.pricePerUnit}/${p.unit} by ${p.farmerName}`).join('\n• ')}**\n\nGuaranteed calcium-carbide free and naturally sun-ripened.`;
        }
      }
      // 3. Spices query
      else if (q.includes('spice') || q.includes('ಸಾಂಬಾರ') || q.includes('मसाले') || q.includes('turmeric') || q.includes('saffron') || q.includes('pepper') || q.includes('cardamom')) {
        matchedProduce = listings.filter((l) =>
          l.category.toLowerCase().includes('spice') ||
          l.name.toLowerCase().includes('turmeric') ||
          l.name.toLowerCase().includes('saffron') ||
          l.name.toLowerCase().includes('pepper') ||
          l.name.toLowerCase().includes('cardamom')
        ).slice(0, 4);

        if (language === 'kn') {
          responseText = `ನಮ್ಮ ಅಧಿಕೃತ ರೈತರಿಂದ ಸಿಗುವ ಪರಿಶುದ್ಧ ಸಾಂಬಾರ ಪದಾರ್ಥಗಳು:\n\n• **${matchedProduce.map((p) => `${p.name} (₹${p.pricePerUnit}/${p.unit} - ${p.farmerName})`).join('\n• ')}**\n\nಉನ್ನತ ಕರ್ಕ್ಯುಮಿನ್ ಅರಿಶಿನ ಮತ್ತು ಜಿಐ-ಟ್ಯಾಗ್ ಹೊಂದಿದ ಕಾಶ್ಮೀರಿ ಕೇಸರಿ ಲಭ್ಯವಿದೆ.`;
        } else if (language === 'hi') {
          responseText = `सत्यापित किसानों से उपलब्ध शुद्ध पारंपरिक मसाले:\n\n• **${matchedProduce.map((p) => `${p.name} (₹${p.pricePerUnit}/${p.unit} - ${p.farmerName})`).join('\n• ')}**\n\nइनमें उच्च-करक्यूमिन हल्दी और शुद्ध कश्मीरी केसर शामिल हैं।`;
        } else {
          responseText = `Here are pure single-origin Indian spices from verified growers:\n\n• **${matchedProduce.map((p) => `${p.name} — ₹${p.pricePerUnit}/${p.unit} (${p.farmerName}, ${p.farmLocation})`).join('\n• ')}**\n\nIncludes Salem High-Curcumin Turmeric and GI-Tagged Kashmir Saffron.`;
        }
      }
      // 4. Budget under price query
      else if (q.includes('150') || q.includes('under') || q.includes('ಬೆಲೆ') || q.includes('कीमत') || q.includes('budget') || q.includes('cheap')) {
        matchedProduce = listings.filter((l) => l.pricePerUnit <= 150).slice(0, 4);

        if (language === 'kn') {
          responseText = `₹150 ಒಳಗೆ ಲಭ್ಯವಿರುವ ಅತ್ಯುತ್ತಮ ನೇರ ಕೃಷಿ ಬೆಳೆಗಳು:\n\n• **${matchedProduce.map((p) => `${p.name}: ₹${p.pricePerUnit}/${p.unit}`).join('\n• ')}**`;
        } else if (language === 'hi') {
          responseText = `₹150 से कम कीमत में उपलब्ध उत्तम कृषि उपज:\n\n• **${matchedProduce.map((p) => `${p.name}: ₹${p.pricePerUnit}/${p.unit}`).join('\n• ')}**`;
        } else {
          responseText = `Here are direct farm crops available for under ₹150 per unit:\n\n• **${matchedProduce.map((p) => `${p.name}: ₹${p.pricePerUnit}/${p.unit} (${p.farmerName})`).join('\n• ')}**`;
        }
      }
      // 5. Recipe / Cooking / Storage query
      else if (q.includes('recipe') || q.includes('cook') || q.includes('ಅಡುಗೆ') || q.includes('व्यंजन') || q.includes('store') || q.includes('ಸಂರಕ್ಷಣೆ')) {
        if (language === 'kn') {
          responseText = `🌿 **ತಾಜಾ ಸೊಪ್ಪು ಮತ್ತು ತರಕಾರಿಗಳ ಬಳಕೆ & ಸಂರಕ್ಷಣೆ ಸಲಹೆ:**\n\n1. **ಪಾಲಕ್ ಪನೀರ್ / ದಾಲ್ ಪಾಲಕ್:** ಪಾಲಕ್ ಸೊಪ್ಪನ್ನು ತಣ್ಣೀರಿನಲ್ಲಿ ತೊಳೆದು, ಬಿಸಿನೀರಿನಲ್ಲಿ 2 ನಿಮಿಷ ಬೇಯಿಸಿ ತಣ್ಣೀರಿನಲ್ಲಿ ಇರಿಸಿದರೆ (blanching) ಹಸಿರು ಬಣ್ಣ ಹಾಗೇ ಉಳಿಯುತ್ತದೆ.\n2. **ಸಂರಕ್ಷಣೆ:** ತೇವಾಂಶವಿಲ್ಲದ ಹತ್ತಿ ಬಟ್ಟೆ ಅಥವಾ ಜಿಪ್‌ಲಾಕ್ ಬ್ಯಾಗ್‌ನಲ್ಲಿ ಸಂಗ್ರಹಿಸಿದರೆ 7-10 ದಿನ ತಾಜಾವಾಗಿರುತ್ತದೆ.`;
        } else if (language === 'hi') {
          responseText = `🌿 **ताज़ी पालक व सब्जियों के पाक व भंडारण सुझाव:**\n\n1. **पालक पनीर / दाल पालक:** पालक को ब्लांच (2 मिनट गर्म पानी में डालकर तुरंत ठंडे पानी में) करने से इसका हरा रंग और पोषक तत्व बरकरार रहते हैं।\n2. **सुरक्षित भंडारण:** सूती कपड़े या एयरटाइट बॉक्स में रखने पर यह 7-10 दिनों तक एकदम ताज़ा रहती है।`;
        } else {
          responseText = `🌿 **Culinary & Farm Fresh Storage Tips:**\n\n1. **Palak Paneer & Dal Palak:** Blanch freshly harvested baby spinach leaves in boiling water for 2 minutes, then immediately plunge into cold ice water to preserve its vibrant green chlorophyll and vitamins.\n2. **Storage Tip:** Store unwashed in a breathable container with a dry cloth in the refrigerator to keep leaves crisp for up to 10 days.`;
        }
      }
      // 6. Track order query
      else if (q.includes('track') || q.includes('order') || q.includes('ಆರ್ಡರ್') || q.includes('ऑर्डर') || q.includes('status')) {
        if (language === 'kn') {
          responseText = `📦 **ಆರ್ಡರ್ ಹಂತಗಳು:**\n1. **Placed** (ಆರ್ಡರ್ ಸ್ವೀಕರಿಸಲಾಗಿದೆ)\n2. **Harvesting** (ಜಮೀನಿನಲ್ಲಿ ತಾಜಾ ಕೊಯ್ಲು)\n3. **Dispatched** (ನೇರ ರವಾನೆ)\n4. **Delivered** (ನಿಮ್ಮ ಮನೆಗೆ ತಲುಪಿದೆ).\n\n👉 ನೀವು ಗ್ರಾಹಕ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ನಲ್ಲಿ ನೈಜ ಸಮಯದಲ್ಲಿ ಲೈವ್ ಸ್ಥಿತಿಯನ್ನು ವೀಕ್ಷಿಸಬಹುದು.`;
        } else if (language === 'hi') {
          responseText = `📦 **ऑर्डर ट्रैकिंग चरण:**\n1. **Placed** (ऑर्डर दर्ज)\n2. **Harvesting** (खेत में ताज़ी कटाई)\n3. **Dispatched** (सीधा प्रेषण)\n4. **Delivered** (घर पर डिलीवरी)।\n\n👉 आप ग्राहक डैशबोर्ड में लाइव स्थिति देख सकते हैं।`;
        } else {
          responseText = `📦 **Direct Farm Order Lifecycle:**\n\n1. **Placed** — Order registered with grower\n2. **Harvesting** — Dawn harvest in progress\n3. **Dispatched** — Direct farm logistics transit\n4. **Delivered** — Handed over to your doorstep\n\n👉 You can track every milestone in real time in your Customer Dashboard.`;
        }
      }
      // 7. General fallback
      else {
        matchedProduce = listings.filter((l) =>
          l.name.toLowerCase().includes(q) ||
          l.category.toLowerCase().includes(q) ||
          l.farmerName.toLowerCase().includes(q)
        ).slice(0, 4);

        if (matchedProduce.length > 0) {
          responseText = language === 'kn'
            ? `ನಿಮ್ಮ ಪ್ರಶ್ನೆಗೆ ಸೂಕ್ತವಾದ ಬೆಳೆಗಳು ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಲಭ್ಯವಿವೆ:`
            : language === 'hi'
            ? `आपकी खोज से संबंधित उपलब्ध कृषि उत्पाद:`
            : `Here are matching produce listings from our verified growers in PostgreSQL:`;
        } else {
          responseText = language === 'kn'
            ? `ಕ್ಷಮಿಸಿ, ನಿಮ್ಮ ಹುಡುಕಾಟಕ್ಕೆ ಸದ್ಯಕ್ಕೆ ಯಾವುದೇ ನೇರ ಬೆಳೆ ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಬೇರೆ ತರಕಾರಿ, ಹಣ್ಣು ಅಥವಾ ಸಾಂಬಾರ ಪದಾರ್ಥಗಳ ಬಗ್ಗೆ ವಿಚಾರಿಸಿ.`
            : language === 'hi'
            ? `क्षमा करें, इस समय इससे संबंधित कोई उत्पाद उपलब्ध नहीं है। कृपया ताज़ी सब्जियों या फलों के बारे में पूछें।`
            : `No matching produce is currently listed for that query. You can explore our other active harvests in the marketplace.`;
        }
      }

      const aiMsg: Message = {
        id: `msg-${Date.now()}`,
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedProduce: matchedProduce.slice(0, 4),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setLoadingStep('idle');
    }, 900);
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
                        <div className="whitespace-pre-line text-xs sm:text-[13px]">{msg.text}</div>

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
                                  <img
                                    src={getProduceImage(prod)}
                                    alt={prod.name}
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

                        {/* Speaker Button on AI Messages */}
                        {msg.sender === 'ai' && (
                          <div className="flex items-center justify-between pt-1 border-t border-[#d4af37]/15 text-[10px] font-mono text-[#8e8b82]">
                            <span>{msg.timestamp}</span>
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
                          ? 'Understanding Indian agricultural query...'
                          : loadingStep === 'searching'
                          ? 'Scanning PostgreSQL harvests & verified farmers...'
                          : 'Synthesizing verified produce recommendations...'}
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
