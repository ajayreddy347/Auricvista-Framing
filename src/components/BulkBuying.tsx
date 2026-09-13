import { useLanguage } from '../context/LanguageContext';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Scale,
  Building2,
  Utensils,
  Store,
  Users2,
  Building,
  ArrowRight,
  X,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const BulkBuying: React.FC = () => {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!modalOpen) return;
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = origOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [modalOpen]);

  const audiences = [
    { label: 'Restaurants', icon: Utensils },
    { label: 'Apartment Societies', icon: Building2 },
    { label: 'Events & Catering', icon: Users2 },
    { label: 'Offices & Canteens', icon: Building },
    { label: 'Retailers & Kiranas', icon: Store },
  ];

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

  return (
    <section
      id="bulk-buying-section"
      className={`relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-transparent border-t backdrop-blur-[2px] overflow-hidden transition-colors duration-200 ${
        isDark ? 'border-[#d4af37]/15' : 'border-[#d4af37]/25'
      }`}
    >
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[450px] rounded-full gold-ambient-secondary blur-3xl ${
          isDark ? 'opacity-35' : 'opacity-20'
        }`} />
        <div className={`absolute inset-0 bg-subtle-grid mask-gradient ${
          isDark ? 'opacity-30' : 'opacity-15'
        }`} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto w-full">
        {/* ========================================================================= */}
        {/* SECTION HEADER & TITLE */}
        {/* ========================================================================= */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={containerVariants}
          className="text-center max-w-3xl mx-auto"
        >
          <motion.div variants={itemFadeUp} className="mb-5 inline-block">
            <div
              id="bulk-eyebrow-pill"
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border backdrop-blur-md transition-colors ${
                isDark
                  ? 'bg-[#14120c]/80 border-[#d4af37]/30 text-[#e8dfca] shadow-[0_0_15px_-5px_rgba(212,175,55,0.15)]'
                  : 'bg-[#faf6ee] border-[#d4af37]/50 text-[#8f6208] shadow-xs'
              }`}
            >
              <Scale className={`w-3.5 h-3.5 ${isDark ? 'text-[#d4af37]' : 'text-[#8f6208]'}`} />
              <span className={`text-[11px] font-mono font-medium tracking-[0.2em] uppercase ${
                isDark ? 'text-[#e8dfca]' : 'text-[#8f6208]'
              }`}>
                {t('bulk.eyebrow', 'Direct Commercial Procurement')}
              </span>
            </div>
          </motion.div>

          <motion.h2
            variants={itemFadeUp}
            id="bulk-heading"
            className={`font-serif text-3xl sm:text-5xl md:text-6xl font-medium tracking-[-0.02em] leading-[1.12] ${
              isDark ? 'text-[#fcfbf7]' : 'text-[#1c1917]'
            }`}
          >
            <span className="block">
              {t('bulk.heading', 'Need 50 KG Tomatoes?')}
            </span>
          </motion.h2>

          <motion.p
            variants={itemFadeUp}
            id="bulk-subtext"
            className={`mt-4 sm:mt-5 text-base sm:text-lg md:text-xl font-normal leading-relaxed font-sans ${
              isDark ? 'text-[#aba79c]' : 'text-stone-600'
            }`}
          >
            {t('bulk.subtext', 'Skip the wholesalers. Connect directly with nearby farmers for bulk orders.')}
          </motion.p>
        </motion.div>

        {/* ========================================================================= */}
        {/* WIDE CARD CONTAINER                                                       */}
        {/* ========================================================================= */}
        <motion.div
          variants={itemFadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-14 sm:mt-18"
        >
          <div
            id="bulk-procurement-card"
            className={`group relative p-8 sm:p-12 rounded-3xl border-2 backdrop-blur-2xl transition-all duration-300 text-center flex flex-col items-center ${
              isDark
                ? 'bg-[#0e0d0b]/90 border-[#d4af37]/35 hover:border-[#d4af37] shadow-[0_0_40px_-15px_rgba(212,175,55,0.2)] hover:shadow-[0_0_55px_-8px_rgba(212,175,55,0.35)]'
                : 'bg-white/95 border-[#d4af37]/40 hover:border-[#b89120] shadow-xl hover:shadow-2xl text-[#1c1917]'
            }`}
          >
            {/* Top Row of 5 Audience Tags */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8">
              {audiences.map((aud, idx) => {
                const IconComp = aud.icon;
                return (
                  <div
                    key={idx}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs sm:text-sm font-sans transition-all shadow-xs ${
                      isDark
                        ? 'bg-[#17150f] border-[#d4af37]/30 text-[#e8dfca] hover:border-[#d4af37]'
                        : 'bg-[#faf6ee] hover:bg-[#f5ede0] border-[#d4af37]/45 text-[#1c1917] hover:border-[#b89120]'
                    }`}
                  >
                    <IconComp className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#d4af37]' : 'text-[#8f6208]'}`} />
                    <span className={`font-semibold ${isDark ? 'text-[#e8dfca]' : 'text-[#1c1917]'}`}>
                      {aud.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Short Line */}
            <p
              id="bulk-short-line"
              className={`text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-sans mb-8 ${
                isDark ? 'text-[#dcd7c9]' : 'text-stone-700 font-medium'
              }`}
            >
              Whether you need 10kg or 500kg, order in bulk directly from farmers near you — at fair, transparent prices.
            </p>

            {/* Centered Button */}
            <button
              id="explore-bulk-orders-btn"
              type="button"
              onClick={() => setModalOpen(true)}
              className={`group relative inline-flex items-center justify-center gap-3 px-9 py-4 rounded-full font-medium text-xs sm:text-sm uppercase tracking-[0.14em] border backdrop-blur-md transition-all duration-300 cursor-pointer ${
                isDark
                  ? 'text-[#f5f3eb] bg-[#12110c]/85 hover:bg-[#d4af37]/15 border-[#d4af37]/45 hover:border-[#d4af37] shadow-[0_0_20px_-8px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_-5px_rgba(212,175,55,0.4)] hover:scale-[1.02] active:scale-[0.99]'
                  : 'text-[#1c1917] hover:text-[#8f6208] bg-[#faf6ee] hover:bg-white border-2 border-[#d4af37] hover:border-[#b89120] shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.99]'
              }`}
            >
              <span className={isDark ? 'text-[#f5f3eb]' : 'text-[#1c1917] font-bold'}>
                EXPLORE BULK ORDERS
              </span>
              <ArrowRight className={`w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 ${
                isDark ? 'text-[#d4af37]' : 'text-[#8f6208]'
              }`} />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Modal for Bulk Inquiry */}
      <AnimatePresence>
        {modalOpen && typeof document !== 'undefined' && createPortal(
          <div
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4 overflow-hidden"
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className={`fixed inset-0 transition-colors duration-200 ${
                isDark ? 'bg-black/85 backdrop-blur-md' : 'bg-stone-900/40 backdrop-blur-sm'
              }`}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative w-full max-w-lg rounded-2xl p-6 sm:p-8 z-10 text-left transition-colors duration-200 ${
                isDark
                  ? 'bg-[#0f0e0c] border border-[#d4af37]/45 text-[#f5f3eb] shadow-[0_0_50px_-10px_rgba(212,175,55,0.35)]'
                  : 'bg-[#fcfbf7] border-2 border-[#d4af37]/40 text-[#1c1917] shadow-2xl'
              }`}
            >
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className={`absolute top-4 right-4 p-2 rounded-full transition-colors cursor-pointer ${
                  isDark
                    ? 'text-[#a19e95] hover:text-white hover:bg-white/5'
                    : 'text-stone-500 hover:text-[#1c1917] hover:bg-stone-200/60'
                }`}
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-5 ${
                isDark
                  ? 'bg-[#d4af37]/15 border-[#d4af37]/35 text-[#d4af37]'
                  : 'bg-[#faf6ee] border-[#d4af37]/40 text-[#8f6208]'
              }`}>
                <Scale className="w-6 h-6" />
              </div>

              <span className={`text-[10px] font-mono uppercase tracking-[0.25em] font-semibold ${
                isDark ? 'text-[#c9a227]' : 'text-[#8f6208]'
              }`}>
                B2B DIRECT QUOTATION
              </span>
              <h3 className={`font-serif text-2xl font-semibold tracking-wide mt-1 mb-2 ${
                isDark ? 'text-[#f5f3eb]' : 'text-[#1c1917]'
              }`}>
                Bulk Produce Procurement
              </h3>
              <p className={`text-xs leading-relaxed mb-6 font-sans ${
                isDark ? 'text-[#aba79c]' : 'text-stone-600'
              }`}>
                Direct wholesale quotes aggregated across verified regional farms with unified cold freight logistics.
              </p>

              <div className="space-y-3 mb-6">
                <div className={`p-3 rounded-xl border flex justify-between items-center text-xs ${
                  isDark ? 'bg-[#14120e] border-[#d4af37]/20' : 'bg-[#faf6ee] border-[#d4af37]/30'
                }`}>
                  <span className={isDark ? 'text-[#8e8b82]' : 'text-stone-600 font-medium'}>Standard Minimum Volume</span>
                  <span className={`font-mono font-bold ${isDark ? 'text-[#fae69e]' : 'text-[#8f6208]'}`}>10 kg to 2,000+ kg</span>
                </div>
                <div className={`p-3 rounded-xl border flex justify-between items-center text-xs ${
                  isDark ? 'bg-[#14120e] border-[#d4af37]/20' : 'bg-[#faf6ee] border-[#d4af37]/30'
                }`}>
                  <span className={isDark ? 'text-[#8e8b82]' : 'text-stone-600 font-medium'}>Farmer Direct Margin</span>
                  <span className={`font-mono font-bold ${isDark ? 'text-[#34d399]' : 'text-[#166534]'}`}>30% Below APMC Middlemen</span>
                </div>
                <div className={`p-3 rounded-xl border flex justify-between items-center text-xs ${
                  isDark ? 'bg-[#14120e] border-[#d4af37]/20' : 'bg-[#faf6ee] border-[#d4af37]/30'
                }`}>
                  <span className={isDark ? 'text-[#8e8b82]' : 'text-stone-600 font-medium'}>Invoice & GST Compliance</span>
                  <span className={`font-mono font-bold ${isDark ? 'text-[#dcd7c9]' : 'text-[#8f6208]'}`}>Direct Producer Receipt</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#fae69e] to-[#c9a227] text-[#0a0a0a] font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-[0_0_20px_-5px_rgba(212,175,55,0.4)] cursor-pointer"
              >
                Request Commercial Quote →
              </button>
            </motion.div>
          </div>,
          document.body
        )}
      </AnimatePresence>
    </section>
  );
};

