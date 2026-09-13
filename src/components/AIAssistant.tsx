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
import { useTheme } from '../context/ThemeContext';

export const AIAssistant: React.FC = () => {
  const { language, t } = useLanguage();
  const { isDark } = useTheme();

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
      title: t('ai.tile1Title', 'Crop & Harvest Guidance'),
      description: t('ai.tile1Desc', 'Optimal harvest timings and climate-resilient organic methods.'),
      icon: Compass,
    },
    {
      title: t('ai.tile2Title', 'Produce Storytelling'),
      description: t('ai.tile2Desc', 'Auto-generate compelling farm storytelling and harvest manifests.'),
      icon: FileText,
    },
    {
      title: t('ai.tile3Title', 'Market Trends & Fair Prices'),
      description: t('ai.tile3Desc', 'Real-time local retail price trends and instant regional demand alerts.'),
      icon: TrendingUp,
    },
  ];

  return (
    <section
      id="ai-assistant-section"
      className={`relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 transition-colors duration-300 overflow-hidden ${
        isDark ? 'bg-[#070707] border-t border-[#d4af37]/15' : 'bg-[#faf8f5] border-t border-stone-200'
      }`}
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] rounded-full blur-3xl ${
          isDark ? 'gold-ambient-radial opacity-35' : 'bg-[radial-gradient(ellipse,rgba(212,175,55,0.08)_0%,transparent_70%)]'
        }`} />
        <div className={`absolute inset-0 bg-subtle-grid mask-gradient ${isDark ? 'opacity-30' : 'opacity-10'}`} />
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
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full backdrop-blur-md transition-all ${
                isDark
                  ? 'bg-[#14120c]/80 border border-[#d4af37]/30 text-[#e8dfca] shadow-[0_0_15px_-5px_rgba(212,175,55,0.15)]'
                  : 'bg-white border border-[#d4af37]/50 text-[#8f6208] shadow-xs'
              }`}
            >
              <Cpu className={`w-3.5 h-3.5 ${isDark ? 'text-[#d4af37]' : 'text-[#8f6208]'}`} />
              <span className="text-[11px] font-mono font-medium tracking-[0.2em] uppercase">
                {t('ai.eyebrow', 'Intelligent Agri-Engine')}
              </span>
            </div>
          </motion.div>

          <motion.h2
            variants={itemFadeUp}
            id="ai-heading"
            className={`font-serif text-3xl sm:text-5xl md:text-6xl font-medium tracking-[-0.02em] leading-[1.12] ${
              isDark ? 'text-[#fcfbf7]' : 'text-[#1c1917]'
            }`}
          >
            <span className="block">
              {t('ai.heading', 'Auric Arohi AI Farm Assistant')}
            </span>
          </motion.h2>

          <motion.p
            variants={itemFadeUp}
            id="ai-subtext"
            className={`mt-4 sm:mt-5 text-base sm:text-lg md:text-xl font-normal leading-relaxed font-sans ${
              isDark ? 'text-[#aba79c]' : 'text-[#57534e]'
            }`}
          >
            {t('ai.subtext', 'Smart guidance for farmers, powered by multilingual agricultural AI.')}
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
            className={`relative p-6 sm:p-9 md:p-11 rounded-3xl border-2 backdrop-blur-2xl transition-all duration-300 ${
              isDark
                ? 'bg-[#0e0d0b]/90 border-[#d4af37]/45 hover:border-[#fae69e] shadow-[0_0_50px_-15px_rgba(212,175,55,0.25)] hover:shadow-[0_0_60px_-10px_rgba(212,175,55,0.4)]'
                : 'bg-white border-stone-200 hover:border-[#d4af37]/60 shadow-xl'
            }`}
          >
            {/* Card Header Bar */}
            <div className={`flex items-center justify-between pb-5 mb-6 border-b ${
              isDark ? 'border-[#d4af37]/20' : 'border-stone-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shadow-xs ${
                  isDark
                    ? 'bg-[#1d1910] border-[#d4af37]/40 text-[#fae69e] shadow-[0_0_12px_rgba(212,175,55,0.25)]'
                    : 'bg-[#faf8f5] border-[#d4af37]/45 text-[#8f6208]'
                }`}>
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`font-serif text-sm sm:text-base font-semibold ${
                    isDark ? 'text-[#f5f3eb]' : 'text-[#1c1917]'
                  }`}>
                    Auric Arohi Agronomist AI
                  </h3>
                  <p className={`text-[10px] font-mono flex items-center gap-1 ${
                    isDark ? 'text-[#34d399]' : 'text-[#059669]'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                      isDark ? 'bg-[#34d399]' : 'bg-[#059669]'
                    }`} />
                    Online • Real-Time Regional Market Stream
                  </p>
                </div>
              </div>
              <span className={`text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-full border ${
                isDark
                  ? 'bg-[#18150d] border-[#d4af37]/25 text-[#d4af37]'
                  : 'bg-[#faf8f5] border-[#d4af37]/40 text-[#8f6208]'
              }`}>
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
                <div className={`max-w-md sm:max-w-lg p-4 sm:p-5 rounded-2xl rounded-tr-none border text-xs sm:text-sm font-sans leading-relaxed shadow-sm ${
                  isDark
                    ? 'bg-[#191712] border-[#d4af37]/25 text-[#f5f3eb]'
                    : 'bg-[#faf8f5] border-stone-200 text-[#1c1917]'
                }`}>
                  <p>
                    {t('ai.demoFarmerQuestion', 'I have 200 kg organic tomatoes ready. What is the optimal direct price?')}
                  </p>
                  <span className={`text-[10px] font-mono block text-right mt-1.5 ${
                    isDark ? 'text-[#78756d]' : 'text-stone-500'
                  }`}>
                    Farmer Ravi • 2 mins ago
                  </span>
                </div>
                <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 ${
                  isDark
                    ? 'bg-[#1c180e] border-[#d4af37]/40 text-[#d4af37]'
                    : 'bg-[#f4efe6] border-[#d4af37]/45 text-[#8f6208]'
                }`}>
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
                <div className={`max-w-md sm:max-w-xl p-5 sm:p-6 rounded-2xl rounded-tl-none border-2 text-xs sm:text-sm font-sans leading-relaxed ${
                  isDark
                    ? 'bg-[#13110b] border-[#d4af37]/50 text-[#e8dfca] shadow-[0_0_30px_-8px_rgba(212,175,55,0.25)]'
                    : 'bg-white border-[#d4af37]/50 text-stone-800 shadow-md'
                }`}>
                  <div className={`flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider mb-2 font-semibold ${
                    isDark ? 'text-[#fae69e]' : 'text-[#8f6208]'
                  }`}>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>
                      {t('ai.demoInsightTitle', 'Live Agronomy Insight')}
                    </span>
                  </div>

                  <p className={`mb-4 ${isDark ? 'text-[#dcd7c9]' : 'text-stone-700'}`}>
                    {t('ai.demoInsightText', 'Demand for chemical-free tomatoes is High (94% index). We recommend allocating 120 kg for direct fulfillment and listing at ₹40–₹45 per kg on Auric Arohi.')}
                  </p>

                  <div className={`grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t ${
                    isDark ? 'border-[#d4af37]/20' : 'border-stone-200'
                  }`}>
                    <div className={`p-2 rounded-xl border text-center ${
                      isDark ? 'bg-[#1c180e] border-[#d4af37]/30' : 'bg-[#faf8f5] border-stone-200'
                    }`}>
                      <span className={`text-[9px] font-mono uppercase block ${isDark ? 'text-[#8e8b82]' : 'text-stone-500'}`}>
                        Demand
                      </span>
                      <span className={`text-xs font-serif font-bold ${isDark ? 'text-[#fae69e]' : 'text-[#8f6208]'}`}>
                        High (94%)
                      </span>
                    </div>
                    <div className={`p-2 rounded-xl border text-center ${
                      isDark ? 'bg-[#1c180e] border-[#d4af37]/30' : 'bg-[#faf8f5] border-stone-200'
                    }`}>
                      <span className={`text-[9px] font-mono uppercase block ${isDark ? 'text-[#8e8b82]' : 'text-stone-500'}`}>
                        Suggested Buyers
                      </span>
                      <span className={`text-xs font-serif font-bold ${isDark ? 'text-[#f5f3eb]' : 'text-stone-900'}`}>
                        Direct Patrons
                      </span>
                    </div>
                    <div className={`p-2 rounded-xl border text-center ${
                      isDark ? 'bg-[#1c180e] border-[#d4af37]/30' : 'bg-[#faf8f5] border-stone-200'
                    }`}>
                      <span className={`text-[9px] font-mono uppercase block ${isDark ? 'text-[#8e8b82]' : 'text-stone-500'}`}>
                        Suggested Price
                      </span>
                      <span className={`text-xs font-serif font-bold ${isDark ? 'text-[#34d399]' : 'text-emerald-700'}`}>
                        ₹42 / kg
                      </span>
                    </div>
                    <div className={`p-2 rounded-xl border text-center ${
                      isDark ? 'bg-[#1c180e] border-[#d4af37]/30' : 'bg-[#faf8f5] border-stone-200'
                    }`}>
                      <span className={`text-[9px] font-mono uppercase block ${isDark ? 'text-[#8e8b82]' : 'text-stone-500'}`}>
                        Fulfillment
                      </span>
                      <span className={`text-xs font-serif font-bold ${isDark ? 'text-[#d4af37]' : 'text-[#8f6208]'}`}>
                        Sub-24hr
                      </span>
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
                className={`group p-6 rounded-2xl border backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 ${
                  isDark
                    ? 'bg-[#0e0d0b]/85 border-[#d4af37]/25 hover:border-[#d4af37] shadow-[0_0_20px_-8px_rgba(212,175,55,0.12)] hover:shadow-[0_0_35px_-5px_rgba(212,175,55,0.3)]'
                    : 'bg-white border-stone-200 hover:border-[#b89120] shadow-sm hover:shadow-md'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 group-hover:scale-105 transition-transform ${
                  isDark
                    ? 'bg-[#1a160d] border-[#d4af37]/35 text-[#d4af37]'
                    : 'bg-[#faf8f5] border-[#d4af37]/45 text-[#8f6208]'
                }`}>
                  <IconComp className="w-5 h-5" />
                </div>
                <h4 className={`font-serif text-lg font-semibold mb-1.5 transition-colors ${
                  isDark
                    ? 'text-[#f5f3eb] group-hover:text-[#fae69e]'
                    : 'text-[#1c1917] group-hover:text-[#8f6208]'
                }`}>
                  {tile.title}
                </h4>
                <p className={`text-xs leading-relaxed font-sans ${
                  isDark ? 'text-[#aba79c]' : 'text-[#57534e]'
                }`}>
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

