import React from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Bot,
  User,
  ArrowRight,
  TrendingUp,
  FileText,
  Compass,
  CheckCircle2,
  Cpu,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const AIAssistant: React.FC = () => {
  const { language, t } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const itemFadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  const chatContainer = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1] as const,
        staggerChildren: 0.4,
        delayChildren: 0.2,
      },
    },
  };

  const userBubble = {
    hidden: { opacity: 0, y: 15, x: 20 },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const aiBubble = {
    hidden: { opacity: 0, y: 15, x: -20 },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const featureTiles = [
    {
      title: language === 'kn' ? 'ಬೆಳೆ & ಕೊಯ್ಲು ಮಾರ್ಗದರ್ಶನ' : language === 'hi' ? 'फसल व कटाई सलाह' : 'Crop & Harvest Guidance',
      description: language === 'kn' ? 'ಉತ್ತಮ ಕೊಯ್ಲಿನ ಸಮಯ ಮತ್ತು ನೈಸರ್ಗಿಕ ಕೃಷಿ ವಿಧಾನಗಳು.' : language === 'hi' ? 'उत्कृष्ट कटाई समय और जैविक पद्धतियाँ।' : 'Optimal harvest timings and climate-resilient organic methods.',
      icon: Compass,
    },
    {
      title: language === 'kn' ? 'ಉತ್ಪನ್ನ ವಿವರಣೆ ಸೃಷ್ಟಿ' : language === 'hi' ? 'फसल विवरण जनरेशन' : 'Produce Storytelling',
      description: language === 'kn' ? 'ನಿಮ್ಮ ಸಾವಯವ ಇಳುವರಿಗೆ ಆಕರ್ಷಕ ವಿವರಣೆ ಸೃಷ್ಟಿಸಿ.' : language === 'hi' ? 'अपनी उपज के लिए प्रभावशाली विवरण तैयार करें।' : 'Auto-generate compelling farm storytelling and harvest manifests.',
      icon: FileText,
    },
    {
      title: language === 'kn' ? 'ಮಾರುಕಟ್ಟೆ & ದರ ಮಾಹಿತಿ' : language === 'hi' ? 'मंडी भाव व मांग' : 'Market Trends & Fair Prices',
      description: language === 'kn' ? 'ನೈಜ ಸಮಯದ ಸ್ಥಳೀಯ ಬೇಡಿಕೆ ಮತ್ತು ಸೂಕ್ತ ಬೆಲೆ ಸಲಹೆ.' : language === 'hi' ? 'रीयल-टाइम स्थानीय मांग और प्रत्यक्ष मूल्य निर्धारण।' : 'Real-time local retail price trends and instant regional demand alerts.',
      icon: TrendingUp,
    },
  ];

  return (
    <section
      id="ai-assistant-section"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#070707] border-t border-[#d4af37]/15 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] rounded-full gold-ambient-radial blur-3xl opacity-35" />
        <div className="absolute inset-0 bg-subtle-grid opacity-30 mask-gradient" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto w-full">
        {/* SECTION HEADER & TITLE */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={containerVariants}
          className="text-center max-w-3xl mx-auto"
        >
          <motion.div variants={itemFadeUp} className="mb-5 inline-block">
            <div
              id="ai-eyebrow-pill"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14120c]/80 border border-[#d4af37]/30 backdrop-blur-md shadow-[0_0_15px_-5px_rgba(212,175,55,0.15)]"
            >
              <Cpu className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="text-[11px] font-mono font-medium tracking-[0.2em] text-[#e8dfca] uppercase">
                {language === 'kn' ? 'ಬುದ್ಧಿವಂತ ಕೃಷಿ AI ಇಂಜಿನ್' : language === 'hi' ? 'इंटेलिजेंट कृषि इंजन' : 'Intelligent Agri-Engine'}
              </span>
            </div>
          </motion.div>

          <motion.h2
            variants={itemFadeUp}
            id="ai-heading"
            className="font-serif text-3xl sm:text-5xl md:text-6xl font-medium tracking-[-0.02em] leading-[1.12] text-[#fcfbf7]"
          >
            <span className="block text-[#fcfbf7]">
              {language === 'kn'
                ? 'ಆರಿಕ್ ಆರೋಹಿ AI ಸಹಾಯಕ'
                : language === 'hi'
                ? 'ऑरिक आरोही किसान AI सहायक'
                : language === 'te'
                ? 'ఆరిక్ ఆరోహి రైతు AI సహాయకుడు'
                : language === 'ta'
                ? 'ஆரிக் ஆரோஹி உழவர் AI உதவியாளர்'
                : language === 'ml'
                ? 'ഓറിക് ആരോഹി കർഷക AI സഹായി'
                : 'Auric Arohi AI Farm Assistant'}
            </span>
          </motion.h2>

          <motion.p
            variants={itemFadeUp}
            id="ai-subtext"
            className="mt-4 sm:mt-5 text-base sm:text-lg md:text-xl text-[#aba79c] font-normal leading-relaxed font-sans"
          >
            {language === 'kn'
              ? 'ರೈತರಿಗಾಗಿ ಧ್ವನಿ ಮತ್ತು ಪಠ್ಯ ಆಧಾರಿತ ಕೃಷಿ ಸಲಹೆಗಳು.'
              : language === 'hi'
              ? 'किसानों के लिए आवाज और टेक्स्ट आधारित स्मार्ट कृषि मार्गदर्शन।'
              : 'Smart guidance for farmers, powered by multilingual agricultural AI.'}
          </motion.p>
        </motion.div>

        {/* CHAT / ASSISTANT INTERFACE CARD */}
        <motion.div
          variants={chatContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-14 sm:mt-18"
        >
          <div
            id="ai-chat-card"
            className="relative p-6 sm:p-9 md:p-11 rounded-3xl bg-[#0e0d0b]/90 border-2 border-[#d4af37]/45 hover:border-[#fae69e] backdrop-blur-2xl transition-all duration-300 shadow-[0_0_50px_-15px_rgba(212,175,55,0.25)] hover:shadow-[0_0_60px_-10px_rgba(212,175,55,0.4)]"
          >
            {/* Card Header Bar */}
            <div className="flex items-center justify-between pb-5 mb-6 border-b border-[#d4af37]/20">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#1d1910] border border-[#d4af37]/40 flex items-center justify-center text-[#fae69e] shadow-[0_0_12px_rgba(212,175,55,0.25)]">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-sm sm:text-base font-semibold text-[#f5f3eb]">
                    Auric Arohi Agronomist AI
                  </h3>
                  <p className="text-[10px] font-mono text-[#34d399] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" />
                    Online • Real-Time Regional Market Stream
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-[#18150d] border border-[#d4af37]/25 text-[#d4af37]">
                v2.4 Neural Crop Link
              </span>
            </div>

            {/* Chat Conversation Flow */}
            <div className="space-y-5">
              {/* Farmer Chat Bubble */}
              <motion.div
                variants={userBubble}
                className="flex justify-end items-end gap-2.5 sm:gap-3"
              >
                <div className="max-w-md sm:max-w-lg p-4 sm:p-5 rounded-2xl rounded-tr-none bg-[#191712] border border-[#d4af37]/25 text-xs sm:text-sm text-[#f5f3eb] font-sans leading-relaxed shadow-md">
                  <p>
                    {language === 'kn'
                      ? 'ನನ್ನ ಬಳಿ 200 ಕೆಜಿ ತಾಜಾ ಸಾವಯವ ಟೊಮೇಟೊ ಇದೆ. ನೇರ ಮಾರಾಟಕ್ಕೆ ಉತ್ತಮ ದರ ಎಷ್ಟು?'
                      : language === 'hi'
                      ? 'मेरे पास 200 किलो ताज़ा टमाटर तैयार है। सीधे ग्राहकों के लिए सही दाम क्या रखें?'
                      : 'I have 200 kg organic tomatoes ready. What is the optimal direct price?'}
                  </p>
                  <span className="text-[10px] font-mono text-[#78756d] block text-right mt-1.5">
                    Farmer Ravi • 2 mins ago
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#1c180e] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shrink-0">
                  <User className="w-4 h-4" />
                </div>
              </motion.div>

              {/* AI Response Bubble */}
              <motion.div
                variants={aiBubble}
                className="flex justify-start items-start gap-2.5 sm:gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#d4af37] to-[#8c6b12] flex items-center justify-center text-[#0a0a0a] shrink-0 shadow-[0_0_12px_rgba(212,175,55,0.3)] mt-1">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="max-w-md sm:max-w-xl p-5 sm:p-6 rounded-2xl rounded-tl-none bg-[#13110b] border-2 border-[#d4af37]/50 text-xs sm:text-sm text-[#e8dfca] font-sans leading-relaxed shadow-[0_0_30px_-8px_rgba(212,175,55,0.25)]">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-[#fae69e] mb-2 font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>
                      {language === 'kn' ? 'ಲೈವ್ ಕೃಷಿ ದರ ವಿಶ್ಲೇಷಣೆ' : language === 'hi' ? 'लाइव कृषि विश्लेषण' : 'Live Agronomy Insight'}
                    </span>
                  </div>

                  <p className="mb-4 text-[#dcd7c9]">
                    {language === 'kn'
                      ? 'ಪ್ರಸ್ತುತ ಬೆಂಗಳೂರು ಮತ್ತು ಮೈಸೂರು ವಲಯದಲ್ಲಿ ರಾಸಾಯನಿಕ ರಹಿತ ಟೊಮೇಟೊಗೆ ಹೆಚ್ಚಿನ ಬೇಡಿಕೆಯಿದೆ (94% ಇಂಡೆಕ್ಸ್). ನೇರ ಗ್ರಾಹಕರಿಗೆ ಪ್ರತಿ ಕೆ.ಜಿಗೆ ₹40 ರಿಂದ ₹45 ನಿಗದಿಪಡಿಸಲು ಶಿಫಾರಸು ಮಾಡುತ್ತೇವೆ.'
                      : language === 'hi'
                      ? 'वर्तमान में आपके क्षेत्र में जैविक टमाटर की मांग बहुत अधिक (94%) है। हम सुबह की ताज़ा कटाई के लिए ₹40–₹45 प्रति किलो का भाव सुझाते हैं।'
                      : 'Demand for chemical-free tomatoes is High (94% index). We recommend allocating 120 kg for direct fulfillment and listing at ₹40–₹45 per kg on Auric Arohi.'}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-[#d4af37]/20">
                    <div className="p-2 rounded-xl bg-[#1c180e] border border-[#d4af37]/30 text-center">
                      <span className="text-[9px] font-mono text-[#8e8b82] uppercase block">Demand</span>
                      <span className="text-xs font-serif font-bold text-[#fae69e]">High (94%)</span>
                    </div>
                    <div className="p-2 rounded-xl bg-[#1c180e] border border-[#d4af37]/30 text-center">
                      <span className="text-[9px] font-mono text-[#8e8b82] uppercase block">Suggested Buyers</span>
                      <span className="text-xs font-serif font-bold text-[#f5f3eb]">Direct Patrons</span>
                    </div>
                    <div className="p-2 rounded-xl bg-[#1c180e] border border-[#d4af37]/30 text-center">
                      <span className="text-[9px] font-mono text-[#8e8b82] uppercase block">Suggested Price</span>
                      <span className="text-xs font-serif font-bold text-[#34d399]">₹42 / kg</span>
                    </div>
                    <div className="p-2 rounded-xl bg-[#1c180e] border border-[#d4af37]/30 text-center">
                      <span className="text-[9px] font-mono text-[#8e8b82] uppercase block">Fulfillment</span>
                      <span className="text-xs font-serif font-bold text-[#d4af37]">Sub-24hr</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* 3 FEATURE TILES IN A ROW */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6"
        >
          {featureTiles.map((tile, idx) => {
            const IconComp = tile.icon;
            return (
              <motion.div
                key={idx}
                variants={itemFadeUp}
                className="group p-6 rounded-2xl bg-[#0e0d0b]/85 border border-[#d4af37]/25 hover:border-[#d4af37] backdrop-blur-xl transition-all duration-300 shadow-[0_0_20px_-8px_rgba(212,175,55,0.12)] hover:shadow-[0_0_35px_-5px_rgba(212,175,55,0.3)] hover:-translate-y-1"
              >
                <div className="w-10 h-10 rounded-xl bg-[#1a160d] border border-[#d4af37]/35 flex items-center justify-center text-[#d4af37] mb-4 group-hover:scale-105 transition-transform">
                  <IconComp className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-lg font-semibold text-[#f5f3eb] mb-1.5 group-hover:text-[#fae69e] transition-colors">
                  {tile.title}
                </h4>
                <p className="text-xs text-[#aba79c] leading-relaxed font-sans">
                  {tile.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
