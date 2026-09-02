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

  // Language speech codes for Web Speech API
  const langSpeechCodes: Record<string, string> = {
    en: 'en-IN',
    kn: 'kn-IN',
    hi: 'hi-IN',
    te: 'te-IN',
    ta: 'ta-IN',
    ml: 'ml-IN',
  };

  // Quick Customer & Farmer prompts
  const quickPrompts = useMemo(() => {
    return [
      {
        id: 'veg',
        icon: Carrot,
        label: language === 'kn' ? '🥬 ತಾಜಾ ತರಕಾರಿಗಳು' : language === 'hi' ? '🥬 ताज़ी सब्जियां' : language === 'te' ? '🥬 తాజా కూరగాయలు' : language === 'ta' ? '🥬 புதிய காய்கறிகள்' : language === 'ml' ? '🥬 പുതിയ പച്ചക്കറികൾ' : '🥬 Fresh Vegetables',
        query:
          language === 'kn'
            ? 'ಪ್ರಸ್ತುತ ಲಭ್ಯವಿರುವ ತಾಜಾ ತರಕಾರಿಗಳು ಮತ್ತು ಅವುಗಳ ದರವನ್ನು ತೋರಿಸಿ.'
            : language === 'hi'
            ? 'वर्तमान में उपलब्ध ताज़ी सब्जियां और उनके मूल्य बताएं।'
            : language === 'te'
            ? 'ప్రస్తుతం అందుబాటులో ఉన్న కూరగాయల వివరాలు చెప్పండి.'
            : language === 'ta'
            ? 'தற்போது கிடைக்கும் புதிய காய்கறிகள் மற்றும் விலைகளைக் காட்டுங்கள்.'
            : language === 'ml'
            ? 'ഇപ്പോൾ ലഭ്യമായ പച്ചക്കറികളുടെ വിവരങ്ങൾ പറയൂ.'
            : 'Show me fresh vegetables currently available and their prices.',
      },
      {
        id: 'fruits',
        icon: Apple,
        label: language === 'kn' ? '🍎 ಹಣ್ಣುಗಳು' : language === 'hi' ? '🍎 ताज़े फल' : language === 'te' ? '🍎 తాజా పండ్లు' : language === 'ta' ? '🍎 பழங்கள்' : language === 'ml' ? '🍎 പഴങ്ങൾ' : '🍎 Available Fruits',
        query:
          language === 'kn'
            ? 'ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಯಾವ ಸಾವಯವ ಹಣ್ಣುಗಳು ಲಭ್ಯವಿವೆ?'
            : language === 'hi'
            ? 'मंडी में कौन-कौन से जैविक फल उपलब्ध हैं?'
            : language === 'te'
            ? 'మార్కెట్‌లో ఏయే పండ్లు అందుబాటులో ఉన్నాయి?'
            : language === 'ta'
            ? 'சந்தையில் என்னென்ன பழங்கள் உள்ளன?'
            : language === 'ml'
            ? 'വിപണിയിൽ ഏതൊക്കെ പഴങ്ങളാണ് ഉള്ളത്?'
            : 'What fresh fruits are available in the marketplace?',
      },
      {
        id: 'budget',
        icon: TrendingUp,
        label: language === 'kn' ? '💰 ₹150 ಒಳಗಿನ ಬೆಳೆಗಳು' : language === 'hi' ? '💰 ₹150 से कम में' : language === 'te' ? '💰 ₹150 లోపు పంటలు' : language === 'ta' ? '💰 ₹150க்குள்' : language === 'ml' ? '💰 ₹150 ൽ താഴെ' : '💰 Under ₹150',
        query:
          language === 'kn'
            ? '₹150 ಅಥವಾ ಅದಕ್ಕಿಂತ ಕಡಿಮೆ ದರದಲ್ಲಿರುವ ಬೆಳೆಗಳನ್ನು ತೋರಿಸಿ.'
            : language === 'hi'
            ? '₹150 या उससे कम कीमत वाले उत्पाद दिखाएं।'
            : language === 'te'
            ? '₹150 లోపు ధర గల పంటలను చూపించండి.'
            : language === 'ta'
            ? '₹150க்குள் கிடைக்கும் விளைபொருட்களைக் காட்டுங்கள்.'
            : language === 'ml'
            ? '₹150 ൽ താഴെ വിലയുള്ള ഉൽപ്പന്നങ്ങൾ കാണിക്കൂ.'
            : 'Find produce under ₹150 per kg/unit.',
      },
      {
        id: 'spices',
        icon: Flame,
        label: language === 'kn' ? '🌶️ ಸಾವಯವ ಸಾಂಬಾರ' : language === 'hi' ? '🌶️ जैविक मसाले' : language === 'te' ? '🌶️ సుగంధ ద్రవ్యాలు' : language === 'ta' ? '🌶️ வாசனை பொருட்கள்' : language === 'ml' ? '🌶️ സുഗന്ധവ്യഞ്ജനങ്ങൾ' : '🌶️ Spices & Seasonings',
        query:
          language === 'kn'
            ? 'ಯಾವ ರೈತರು ಅರಿಶಿನ ಮತ್ತು ಕೇಸರಿ ಮುಂತಾದ ಸಾಂಬಾರ ಪದಾರ್ಥಗಳನ್ನು ಮಾರಾಟ ಮಾಡುತ್ತಿದ್ದಾರೆ?'
            : language === 'hi'
            ? 'कौन से किसान हल्दी व केसर जैसे मसाले बेच रहे हैं?'
            : language === 'te'
            ? 'ఏ రైతులు పసుపు, కుంకుమపువ్వు వంటి సుగంధ ద్రవ్యాలు అమ్ముతున్నారు?'
            : language === 'ta'
            ? 'மஞ்சள் மற்றும் குங்குமப்பூ போன்ற வாசனைப் பொருட்களை விற்பனை செய்யும் விவசாயிகள் யார்?'
            : language === 'ml'
            ? 'ഏതൊക്കെ കർഷകരാണ് മഞ്ഞളും കുങ്കുമപ്പൂവും വിൽക്കുന്നത്?'
            : 'Which verified farmers are selling spices and seasonings like Turmeric and Saffron?',
      },
      {
        id: 'recipes',
        icon: Sparkles,
        label: language === 'kn' ? '🍲 ಅಡುಗೆ & ಬಳಕೆ ಸಲಹೆ' : language === 'hi' ? '🍲 व्यंजन व पाक विधि' : language === 'te' ? '🍲 వంటకాలు & చిట్కాలు' : language === 'ta' ? '🍲 சமையல் குறிப்புகள்' : language === 'ml' ? '🍲 പാചകക്കുറിപ്പുകൾ' : '🍲 Recipe & Cooking Tips',
        query:
          language === 'kn'
            ? 'ತಾಜಾ ಪಾಲಕ್ ಸೊಪ್ಪಿನಿಂದ ಯಾವ ರುಚಿಕರ ಅಡುಗೆಗಳನ್ನು ಮಾಡಬಹುದು ಮತ್ತು ಅದನ್ನು ಹೇಗೆ ಸಂರಕ್ಷಿಸಿಡಬೇಕು?'
            : language === 'hi'
            ? 'ताज़ी पालक से कौन से स्वादिष्ट व्यंजन बनाए जा सकते हैं और इसे कैसे सुरक्षित रखें?'
            : language === 'te'
            ? 'పాలకూరతో ఎలాంటి వంటకాలు చేయవచ్చు ಮತ್ತು ఎలా నిల్వ చేయాలి?'
            : language === 'ta'
            ? 'பசலைக் கீரையில் என்னென்ன சமையல் செய்யலாம்? அதை எவ்வாறு பாதுகாக்க வேண்டும்?'
            : language === 'ml'
            ? 'ചീര ഉപയോഗിച്ച് എന്തൊക്കെ വിഭവങ്ങൾ ഉണ്ടാക്കാം? എങ്ങനെ സൂക്ഷിക്കാം?'
            : 'What dishes can I cook with fresh baby spinach and how should I store it to keep it fresh?',
      },
      {
        id: 'track',
        icon: Package,
        label: language === 'kn' ? '📦 ಆರ್ಡರ್ ಟ್ರ್ಯಾಕಿಂಗ್' : language === 'hi' ? '📦 ऑर्डर ट्रैकिंग' : language === 'te' ? '📦 ఆర్డర్ ట్రాకింగ్' : language === 'ta' ? '📦 ஆர்டர் நிலை' : language === 'ml' ? '📦 ഓർഡർ ട്രാക്കിംഗ്' : '📦 Track My Order',
        query:
          language === 'kn'
            ? 'ನನ್ನ ಆರ್ಡರ್ ಸ್ಥಿತಿಯನ್ನು ಹೇಗೆ ಟ್ರ್ಯಾಕ್ ಮಾಡಬೇಕು?'
            : language === 'hi'
            ? 'मैं अपने ऑर्डर की स्थिति कैसे ट्रैक कर सकता हूँ?'
            : language === 'te'
            ? 'నా ఆర్డర్ స్థితిని ఎలా ట్రాక్ చేయాలి?'
            : language === 'ta'
            ? 'எனது ஆர்டர் நிலையை எவ்வாறு கண்காணிப்பது?'
            : language === 'ml'
            ? 'എന്റെ ഓർഡർ നില എങ്ങനെ ട്രാക്ക് ചെയ്യാം?'
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
    } catch (err: any) {
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

    // Simulate natural AI thinking steps with real DB filtering
    setTimeout(() => {
      setLoadingStep('searching');
    }, 400);

    setTimeout(() => {
      setLoadingStep('preparing');
    }, 800);

    setTimeout(() => {
      const q = queryText.toLowerCase().trim();
      let matchedProduce: ProduceListing[] = [];
      let responseText = '';

      // 1. Check for Vegetable query
      if (q.includes('veg') || q.includes('ತರಕಾರಿ') || q.includes('सब्जी') || q.includes('కూరగాయ') || q.includes('காய்கறி') || q.includes('പച്ചക്കറി')) {
        matchedProduce = listings.filter((l) =>
          l.category.toLowerCase().includes('veg') ||
          l.name.toLowerCase().includes('tomato') ||
          l.name.toLowerCase().includes('carrot') ||
          l.name.toLowerCase().includes('spinach')
        );
        if (language === 'kn') {
          responseText = `🥬 ನಮ್ಮ ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಸದ್ಯಕ್ಕೆ ${matchedProduce.length} ತಾಜಾ ತರಕಾರಿಗಳು ಲಭ್ಯವಿವೆ. ಇವುಗಳನ್ನು ರೈತರು ಮುಂಜಾನೆಯೇ ಕೊಯ್ಲು ಮಾಡಿ ನೇರವಾಗಿ ಪೂರೈಸುತ್ತಾರೆ:`;
        } else if (language === 'hi') {
          responseText = `🥬 वर्तमान में हमारे पास ${matchedProduce.length} ताज़ी सब्जियां उपलब्ध हैं, जो किसानों द्वारा सीधे खेत से उपलब्ध कराई जा रही हैं:`;
        } else if (language === 'te') {
          responseText = `🥬 మా వద్ద ప్రస్తుతం ${matchedProduce.length} తాజా కూరగాయల రకాలు అందుబాటులో ఉన్నాయి:`;
        } else if (language === 'ta') {
          responseText = `🥬 தற்போது சந்தையில் ${matchedProduce.length} புதிய காய்கறி வகைகள் கிடைக்கின்றன:`;
        } else if (language === 'ml') {
          responseText = `🥬 നിലവിൽ ${matchedProduce.length} പച്ചക്കറികൾ വിപണിയിൽ ലഭ്യമാണ്:`;
        } else {
          responseText = `🥬 We currently have ${matchedProduce.length} fresh vegetable listings available directly from Indian growers:`;
        }
      }
      // 2. Check for Fruit query
      else if (q.includes('fruit') || q.includes('mango') || q.includes('apple') || q.includes('ಹಣ್ಣು') || q.includes('फल') || q.includes('పండ్లు') || q.includes('பழம்') || q.includes('പഴങ്ങൾ')) {
        matchedProduce = listings.filter((l) =>
          l.category.toLowerCase().includes('fruit') ||
          l.name.toLowerCase().includes('mango') ||
          l.name.toLowerCase().includes('apple') ||
          l.name.toLowerCase().includes('dragonfruit')
        );
        if (language === 'kn') {
          responseText = `🍎 ಸದ್ಯಕ್ಕೆ ಲಭ್ಯವಿರುವ ತಾಜಾ ಸಾವಯವ ಹಣ್ಣುಗಳು (${matchedProduce.length} ವಿಧಗಳು):`;
        } else if (language === 'hi') {
          responseText = `🍎 हमारे पास उपलब्ध ताज़े मौसमी फल (${matchedProduce.length} किस्में):`;
        } else {
          responseText = `🍎 Here are the fresh orchard fruits currently in stock (${matchedProduce.length} items):`;
        }
      }
      // 3. Check for Spices query
      else if (q.includes('spice') || q.includes('turmeric') || q.includes('saffron') || q.includes('ಸಾಂಬಾರ') || q.includes('मसाले') || q.includes('సుగంధ') || q.includes('மசாலா')) {
        matchedProduce = listings.filter((l) =>
          l.category.toLowerCase().includes('spice') ||
          l.name.toLowerCase().includes('turmeric') ||
          l.name.toLowerCase().includes('saffron')
        );
        if (language === 'kn') {
          responseText = `🌶️ ಪ್ರಮಾಣೀಕೃತ ರೈತರಿಂದ ನೇರ ಸಾವಯವ ಸಾಂಬಾರ ಪದಾರ್ಥಗಳು:`;
        } else if (language === 'hi') {
          responseText = `🌶️ हमारे सत्यापित किसानों द्वारा उपलब्ध कराए गए शुद्ध मसाले:`;
        } else {
          responseText = `🌶️ Verified Indian farmers currently listing natural spices & seasonings:`;
        }
      }
      // 4. Budget / Price query (e.g. Under 150 / 300)
      else if (q.includes('150') || q.includes('300') || q.includes('under') || q.includes('ಕಡಿಮೆ') || q.includes('कम') || q.includes('లోపు')) {
        const threshold = q.includes('300') ? 300 : 150;
        matchedProduce = listings.filter((l) => l.pricePerUnit <= threshold && l.status === 'Active');
        if (language === 'kn') {
          responseText = `💰 ₹${threshold} ಅಥವಾ ಅದಕ್ಕಿಂತ ಕಡಿಮೆ ದರದಲ್ಲಿ ಲಭ್ಯವಿರುವ ಬೆಳೆಗಳು (${matchedProduce.length} ಬೆಳೆಗಳು):`;
        } else if (language === 'hi') {
          responseText = `💰 ₹${threshold} से कम में उपलब्ध ताज़ी फसलें (${matchedProduce.length} उत्पाद):`;
        } else {
          responseText = `💰 Fresh farm produce available under ₹${threshold} per unit (${matchedProduce.length} items):`;
        }
      }
      // 5. Recipe / Cooking & Storage advice
      else if (q.includes('cook') || q.includes('recipe') || q.includes('spinach') || q.includes('store') || q.includes('ಅಡುಗೆ') || q.includes('व्यंजन') || q.includes('వంటకం') || q.includes('சமையல்')) {
        matchedProduce = listings.filter((l) => l.name.toLowerCase().includes('spinach') || l.name.toLowerCase().includes('tomato'));
        if (language === 'kn') {
          responseText = `🍲 **ತಾಜಾ ಪಾಲಕ್ ಸೊಪ್ಪಿನ ಅಡುಗೆ & ಸಂಗ್ರಹಣಾ ಸಲಹೆ:**\n\n• **ಜನಪ್ರಿಯ ಅಡುಗೆಗಳು:** ಪಾಲಕ್ ಪನೀರ್, ದಾಲ್ ಪಾಲಕ್, ಅಥವಾ ಪಾಲಕ್ ಸೊಪ್ಪಿನ ಪಲ್ಯ.\n• **ಸಂಗ್ರಹಣೆ:** ಸೊಪ್ಪನ್ನು ತೊಳೆಯದೆ ಒಣ ಬಟ್ಟೆ ಅಥವಾ ಪೇಪರ್ ಟವಲ್‌ನಲ್ಲಿ ಸುತ್ತಿ ಫ್ರಿಜ್‌ನಲ್ಲಿಟ್ಟರೆ 4-5 ದಿನಗಳವರೆಗೆ ತಾಜಾವಾಗಿರುತ್ತದೆ.\n\n👉 ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಲಭ್ಯವಿರುವ ಬೆಳೆ:`;
        } else if (language === 'hi') {
          responseText = `🍲 **ताज़ी पालक के व्यंजन और भंडारण विधि:**\n\n• **लोकप्रिय व्यंजन:** पालक पनीर, दाल पालक, और पौष्टिक पालक सूप।\n• **सुरक्षित भंडारण:** बिना धोए कॉटन के कपड़े या पेपर में लपेटकर फ्रिज में रखें। 4-5 दिनों तक ताज़ी रहेगी।\n\n👉 उपलब्ध फसल:`;
        } else {
          responseText = `🍲 **Culinary & Storage Guide for Fresh Leafy Greens:**\n\n• **Recommended Dishes:** Palak Paneer, Dal Palak, or fresh vegetable sautés.\n• **Optimal Storage:** Do not wash prior to storage; wrap in dry paper towel and refrigerate for up to 5 days of crisp freshness.\n\n👉 Available from our growers:`;
        }
      }
      // 6. Order tracking query
      else if (q.includes('track') || q.includes('order') || q.includes('ಆರ್ಡರ್') || q.includes('ऑर्डर') || q.includes('ఆర్డర్')) {
        if (language === 'kn') {
          responseText = `📦 **ಆರ್ಡರ್ ಹಂತಗಳು:**\n1. **ಆರ್ಡರ್ ಆಗಿದೆ (Placed)** - ರೈತರಿಗೆ ಮಾಹಿತಿ ತಲುಪಿದೆ\n2. **ಕೊಯ್ಲು (Harvesting)** - ತೋಟದಲ್ಲಿ ತಾಜಾ ಕೊಯ್ಲು\n3. **ರವಾನೆ (Dispatched)** - ಮನೆ ಬಾಗಿಲಿಗೆ ರವಾನೆ\n4. **ತಲುಪಿದೆ (Delivered)** - ನಿಮ್ಮ ಕೈಸೇರಿದೆ.\n\n👉 ನಿಮ್ಮ ಆರ್ಡರ್‌ಗಳನ್ನು ನೇರವಾಗಿ ಕಸ್ಟಮರ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ನಲ್ಲಿ ಪರಿಶೀಲಿಸಬಹುದು.`;
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
    }, 1200);
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
          className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#b89120] text-[#0a0a0a] shadow-[0_0_35px_rgba(212,175,55,0.45)] border border-[#ffffff]/40 flex items-center gap-2.5 cursor-pointer"
          title="Ask Auric Arohi AI"
        >
          <Bot className="w-6 h-6 text-[#0a0a0a]" />
          <span className="font-serif font-bold text-xs uppercase tracking-wider hidden sm:inline">
            Ask Auric AI
          </span>
          <span className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse" />
        </motion.button>
      )}

      {/* Floating Chat Modal / Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-3 bottom-3 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[460px] h-[85vh] sm:h-[620px] bg-[#0e0d0b] border-2 border-[#d4af37]/50 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.9)] z-50 flex flex-col overflow-hidden backdrop-blur-xl"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-[#1c170e] via-[#14110b] to-[#0e0d0b] border-b border-[#d4af37]/25 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#8a6b18] flex items-center justify-center text-[#0a0a0a] shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                  <Bot className="w-5 h-5 text-[#0a0a0a]" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-[#fcfbf7] flex items-center gap-1.5">
                    <span>Auric Arohi AI</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" />
                  </h3>
                  <p className="text-[10px] font-mono text-[#aba79c]">
                    Real-time Agricultural Shopping Assistant
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setMessages([])}
                  className="p-1.5 rounded-lg text-[#8e8b82] hover:text-[#fae69e] hover:bg-white/5"
                  title="Clear Chat"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-[#aba79c] hover:text-[#fcfbf7] hover:bg-white/5"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Prompts Carousel */}
            <div className="p-2.5 bg-[#14110c] border-b border-[#d4af37]/15 overflow-x-auto no-scrollbar flex items-center gap-1.5 shrink-0">
              {quickPrompts.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleProcessQuery(p.query)}
                  className="px-3 py-1.5 rounded-xl bg-[#1e1910] hover:bg-[#2c2414] border border-[#d4af37]/30 text-[11px] font-sans text-[#fae69e] whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <p.icon className="w-3 h-3 text-[#d4af37]" />
                  <span>{p.label}</span>
                </button>
              ))}
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-[#d4af37] to-[#c2981f] text-[#0a0a0a] font-medium rounded-tr-none shadow-md'
                        : 'bg-[#16130e] border border-[#d4af37]/30 text-[#fcfbf7] rounded-tl-none space-y-3'
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.text}</div>

                    {/* Render Real Recommended Produce Cards if returned by AI */}
                    {msg.recommendedProduce && msg.recommendedProduce.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#d4af37]/20">
                        {msg.recommendedProduce.map((prod) => (
                          <div
                            key={prod.id}
                            onClick={() => {
                              setIsOpen(false);
                              navigate('/marketplace');
                            }}
                            className="p-2 rounded-xl bg-[#0e0d0a] border border-[#d4af37]/30 hover:border-[#fae69e] transition-all cursor-pointer flex flex-col justify-between space-y-1"
                          >
                            <div className="h-16 rounded-lg overflow-hidden bg-[#18150e]">
                              <img
                                src={prod.images?.[0] || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea'}
                                alt={prod.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="font-serif font-bold text-[11px] text-[#fcfbf7] truncate">
                              {prod.name}
                            </div>
                            <div className="flex items-baseline justify-between text-[10px] font-mono">
                              <span className="text-[#fae69e] font-bold">₹{prod.pricePerUnit}</span>
                              <span className="text-[#8e8b82]">/{prod.unit}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Speaker button for AI messages */}
                  {msg.sender === 'ai' && (
                    <button
                      type="button"
                      onClick={() => handleSpeakText(msg.text)}
                      className="mt-1 text-[10px] font-mono text-[#8e8b82] hover:text-[#fae69e] flex items-center gap-1 self-start ml-2"
                    >
                      {isSpeaking ? <VolumeX className="w-3 h-3 text-[#f87171]" /> : <Volume2 className="w-3 h-3 text-[#d4af37]" />}
                      <span>{isSpeaking ? 'Stop Audio' : 'Listen'}</span>
                    </button>
                  )}
                </div>
              ))}

              {/* Live Loading Step Indicator */}
              {loadingStep !== 'idle' && (
                <div className="flex items-center gap-2 text-xs font-mono text-[#fae69e] bg-[#16130e] p-3 rounded-2xl border border-[#d4af37]/30 max-w-[80%]">
                  <div className="w-3.5 h-3.5 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin shrink-0" />
                  <span>
                    {loadingStep === 'understanding'
                      ? 'Understanding query...'
                      : loadingStep === 'searching'
                      ? 'Checking PostgreSQL farm listings...'
                      : 'Preparing recommendation...'}
                  </span>
                </div>
              )}

              {/* Live Microphone Transcript */}
              {isListening && (
                <div className="p-3 rounded-2xl bg-[#221c10] border border-[#d4af37] text-xs font-mono text-[#fae69e] animate-pulse flex items-center gap-2">
                  <Mic className="w-4 h-4 text-[#fae69e]" />
                  <span>Listening: "{liveTranscript || 'Speak into microphone...'}"</span>
                </div>
              )}

              {speechError && (
                <div className="p-2 rounded-xl bg-[#2a1010] text-[11px] font-mono text-[#f87171]">
                  {speechError}
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Chat Input Bar */}
            <div className="p-3 sm:p-4 bg-[#14110c] border-t border-[#d4af37]/25 flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleToggleVoice}
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  isListening
                    ? 'bg-[#ef4444] border-white text-white animate-pulse'
                    : 'bg-[#1e1910] border-[#d4af37]/30 text-[#fae69e] hover:bg-[#2c2414]'
                }`}
                title="Voice Input"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                ref={inputFieldRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleProcessQuery(inputText);
                }}
                placeholder={t('ai.placeholder', 'Ask about produce, recipes, farmers or orders...')}
                className="flex-1 px-4 py-3 rounded-2xl bg-[#0e0d0b] border border-[#d4af37]/35 text-xs text-[#fcfbf7] placeholder-[#736f66] focus:outline-none focus:border-[#fae69e]"
              />

              <button
                type="button"
                onClick={() => handleProcessQuery(inputText)}
                disabled={!inputText.trim()}
                className="p-3 rounded-2xl bg-gradient-to-r from-[#fae69e] to-[#d4af37] text-[#0a0a0a] disabled:opacity-40 transition-all cursor-pointer hover:brightness-110 active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
