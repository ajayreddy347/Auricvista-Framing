import { useLanguage } from '../context/LanguageContext';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Utensils,
  Building2,
  Building,
  Coffee,
  Users,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  X,
  Scale,
} from 'lucide-react';

export const BulkBuying: React.FC = () => {
  const { t } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);

  const audiences = [
    { label: 'Restaurants', icon: Utensils },
    { label: 'Hotels', icon: Building2 },
    { label: 'Hostels', icon: Building },
    { label: 'Canteens', icon: Coffee },
    { label: 'Families', icon: Users },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-transparent border-t border-[#d4af37]/15 backdrop-blur-[2px] overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[450px] rounded-full gold-ambient-secondary blur-3xl opacity-35" />
        <div className="absolute inset-0 bg-subtle-grid opacity-30 mask-gradient" />
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
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14120c]/80 border border-[#d4af37]/30 backdrop-blur-md shadow-[0_0_15px_-5px_rgba(212,175,55,0.15)]"
            >
              <Scale className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="text-[11px] font-mono font-medium tracking-[0.2em] text-[#e8dfca] uppercase">
                {t('bulk.eyebrow', 'Direct Commercial Procurement')}
              </span>
            </div>
          </motion.div>

          <motion.h2
            variants={itemFadeUp}
            id="bulk-heading"
            className="font-serif text-3xl sm:text-5xl md:text-6xl font-medium tracking-[-0.02em] leading-[1.12] text-[#fcfbf7]"
          >
            <span className="block text-[#fcfbf7]">
              {t('bulk.heading', 'Need 50 KG Tomatoes?')}
            </span>
          </motion.h2>

          <motion.p
            variants={itemFadeUp}
            id="bulk-subtext"
            className="mt-4 sm:mt-5 text-base sm:text-lg md:text-xl text-[#aba79c] font-normal leading-relaxed font-sans"
          >
            {t('bulk.subtext', 'Skip the wholesalers. Connect directly with nearby farmers for bulk orders.')}
          </motion.p>
        </motion.div>

        {/* ========================================================================= */}
        {/* WIDE DARK GLASS CARD                                                      */}
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
            className="group relative p-8 sm:p-12 rounded-3xl bg-[#0e0d0b]/90 border-2 border-[#d4af37]/35 hover:border-[#d4af37] backdrop-blur-2xl transition-all duration-300 shadow-[0_0_40px_-15px_rgba(212,175,55,0.2)] hover:shadow-[0_0_55px_-8px_rgba(212,175,55,0.35)] text-center flex flex-col items-center"
          >
            {/* Top Row of 5 Audience Tags */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8">
              {audiences.map((aud, idx) => {
                const IconComp = aud.icon;
                return (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#17150f] border border-[#d4af37]/30 text-xs sm:text-sm font-sans text-[#e8dfca] shadow-sm hover:border-[#d4af37] transition-colors"
                  >
                    <IconComp className="w-4 h-4 text-[#d4af37]" />
                    <span className="font-medium">{aud.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Short Line */}
            <p
              id="bulk-short-line"
              className="text-base sm:text-lg text-[#dcd7c9] max-w-2xl mx-auto leading-relaxed font-sans mb-8"
            >
              Whether you need 10kg or 500kg, order in bulk directly from farmers near you — at fair, transparent prices.
            </p>

            {/* Centered Gold Outlined Button */}
            <button
              id="explore-bulk-orders-btn"
              onClick={() => setModalOpen(true)}
              className="group relative inline-flex items-center justify-center gap-3 px-9 py-4 rounded-full font-medium text-xs sm:text-sm uppercase tracking-[0.14em] text-[#f5f3eb] bg-[#12110c]/85 hover:bg-[#d4af37]/15 border border-[#d4af37]/45 hover:border-[#d4af37] backdrop-blur-md shadow-[0_0_20px_-8px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_-5px_rgba(212,175,55,0.4)] hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 cursor-pointer"
            >
              <span>EXPLORE BULK ORDERS</span>
              <ArrowRight className="w-4 h-4 text-[#d4af37] group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Modal for Bulk Inquiry */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg rounded-2xl bg-[#0f0e0c] border border-[#d4af37]/45 p-6 sm:p-8 shadow-[0_0_50px_-10px_rgba(212,175,55,0.35)] z-10 text-left"
            >
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-[#a19e95] hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/35 flex items-center justify-center mb-5 text-[#d4af37]">
                <Scale className="w-6 h-6" />
              </div>

              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#c9a227]">
                B2B DIRECT QUOTATION
              </span>
              <h3 className="font-serif text-2xl font-semibold text-[#f5f3eb] tracking-wide mt-1 mb-2">
                Bulk Produce Procurement
              </h3>
              <p className="text-xs text-[#aba79c] leading-relaxed mb-6 font-sans">
                Direct wholesale quotes aggregated across verified regional farms with unified cold freight logistics.
              </p>

              <div className="space-y-3 mb-6">
                <div className="p-3 rounded-xl bg-[#14120e] border border-[#d4af37]/20 flex justify-between items-center text-xs">
                  <span className="text-[#8e8b82]">Standard Minimum Volume</span>
                  <span className="font-mono text-[#fae69e]">10 kg to 2,000+ kg</span>
                </div>
                <div className="p-3 rounded-xl bg-[#14120e] border border-[#d4af37]/20 flex justify-between items-center text-xs">
                  <span className="text-[#8e8b82]">Farmer Direct Margin</span>
                  <span className="font-mono text-[#34d399]">30% Below APMC Middlemen</span>
                </div>
                <div className="p-3 rounded-xl bg-[#14120e] border border-[#d4af37]/20 flex justify-between items-center text-xs">
                  <span className="text-[#8e8b82]">Invoice & GST Compliance</span>
                  <span className="font-mono text-[#dcd7c9]">Direct Producer Receipt</span>
                </div>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#fae69e] to-[#c9a227] text-[#0a0a0a] font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-[0_0_20px_-5px_rgba(212,175,55,0.4)]"
              >
                Request Commercial Quote →
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
