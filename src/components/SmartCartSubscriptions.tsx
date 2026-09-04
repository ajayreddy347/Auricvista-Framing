import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ShoppingCart,
  Calendar,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Layers,
  Repeat,
} from 'lucide-react';
import { SmartCartBuilderModal } from './SmartCartBuilderModal';

export const SmartCartSubscriptions: React.FC = () => {
  const [selectedFrequency, setSelectedFrequency] = useState<string>('Weekly');
  const [isSmartCartOpen, setIsSmartCartOpen] = useState<boolean>(false);

  const cartFeatures = [
    'Select quantity per item',
    'Choose delivery or pickup',
    'Pick preferred delivery date',
    'Add products from multiple farmers in one order',
    'Save favourite farmers',
    'Reorder previous purchases',
  ];

  const basketChips = [
    { label: 'Potatoes', icon: '🥔' },
    { label: 'Tomatoes', icon: '🍅' },
    { label: 'Greens', icon: '🥬' },
    { label: 'Carrots', icon: '🥕' },
    { label: 'Bananas', icon: '🍌' },
  ];

  const frequencies = ['Weekly', 'Biweekly', 'Monthly'];

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

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <section
      id="smart-cart-section"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#070707] border-t border-[#d4af37]/15 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full gold-ambient-radial blur-3xl opacity-35" />
        <div className="absolute inset-0 bg-subtle-grid opacity-30 mask-gradient" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
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
              id="subscriptions-eyebrow-pill"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14120c]/80 border border-[#d4af37]/30 backdrop-blur-md shadow-[0_0_15px_-5px_rgba(212,175,55,0.15)]"
            >
              <Layers className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="text-[11px] font-mono font-medium tracking-[0.2em] text-[#e8dfca] uppercase">
                Flexible Fulfillment
              </span>
            </div>
          </motion.div>

          <motion.h2
            variants={itemFadeUp}
            id="smart-cart-heading"
            className="font-serif text-3xl sm:text-5xl md:text-6xl font-medium tracking-[-0.02em] leading-[1.12] text-[#fcfbf7]"
          >
            <span className="block text-[#fcfbf7]">
              Shop Your Way
            </span>
          </motion.h2>

          <motion.p
            variants={itemFadeUp}
            id="smart-cart-subtext"
            className="mt-4 sm:mt-5 text-base sm:text-lg md:text-xl text-[#aba79c] font-normal leading-relaxed font-sans"
          >
            Order once, or set it and forget it.
          </motion.p>
        </motion.div>

        {/* ========================================================================= */}
        {/* TWO-COLUMN LAYOUT: SMART CART & WEEKLY FARM BASKET                       */}
        {/* ========================================================================= */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-16 sm:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* CARD 1 — Smart Cart */}
          <motion.div
            variants={cardVariants}
            id="smart-cart-card"
            className="group relative p-7 sm:p-9 rounded-3xl bg-[#0e0d0b]/85 border border-[#d4af37]/25 backdrop-blur-xl card-lift-glow shadow-[0_0_25px_-10px_rgba(212,175,55,0.12)] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#2a2412] to-[#12100a] border border-[#d4af37]/40 flex items-center justify-center text-[#fae69e] shadow-[0_0_15px_-3px_rgba(212,175,55,0.25)] group-hover:scale-105 transition-all">
                  <ShoppingCart className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-[#171510] border border-[#d4af37]/20 text-[#c9a227]">
                  On-Demand
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#f5f3eb] tracking-wide mb-3 group-hover:text-[#fae69e] transition-colors">
                Smart Cart
              </h3>

              <p className="text-xs sm:text-sm text-[#aba79c] leading-relaxed mb-6 font-sans">
                Full dynamic freedom to customize your daily or weekly produce haul directly from multiple local plots.
              </p>

              {/* Bullet list */}
              <div className="space-y-3 pt-2 border-t border-[#d4af37]/15">
                {cartFeatures.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-[#dcd7c9] font-sans">
                      {feat}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#d4af37]/15">
              <button
                type="button"
                onClick={() => setIsSmartCartOpen(true)}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-medium uppercase tracking-[0.14em] text-[#f5f3eb] bg-[#14120c]/70 hover:bg-[#d4af37]/15 border border-[#d4af37]/40 hover:border-[#d4af37] transition-all duration-300 cursor-pointer"
              >
                <span>Start Fresh Cart</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#d4af37]" />
              </button>
            </div>
          </motion.div>

          {/* CARD 2 — Weekly Farm Basket (Slightly stronger gold emphasis) */}
          <motion.div
            variants={cardVariants}
            id="weekly-farm-basket-card"
            className="group relative p-7 sm:p-9 rounded-3xl bg-[#12100a]/90 border-2 border-[#d4af37]/45 backdrop-blur-xl card-lift-glow shadow-[0_0_35px_-10px_rgba(212,175,55,0.25)] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#3b3218] to-[#17140b] border border-[#d4af37]/60 flex items-center justify-center text-[#fae69e] shadow-[0_0_20px_-3px_rgba(212,175,55,0.4)] group-hover:scale-105 transition-all">
                  <Calendar className="w-6 h-6 text-[#fae69e]" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-[#241f11] border border-[#d4af37]/50 text-[#fae69e] font-semibold">
                  Recommended Subscription
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#fcfbf7] tracking-wide mb-2 group-hover:text-[#fae69e] transition-colors">
                Weekly Farm Basket
              </h3>

              {/* Intro */}
              <p className="text-xs sm:text-sm text-[#e8dfca] font-medium leading-relaxed mb-5 font-sans">
                A curated basket delivered on your schedule.
              </p>

              {/* Example Items as Small Chips */}
              <div className="mb-6">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#9b978d] block mb-2">
                  SEASONAL HARVEST ALLOCATION:
                </span>
                <div className="flex flex-wrap gap-2">
                  {basketChips.map((chip, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1c180e] border border-[#d4af37]/35 text-xs text-[#f5f3eb] font-sans"
                    >
                      <span>{chip.icon}</span>
                      <span>{chip.label}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Frequency Pill Buttons */}
              <div className="mb-6">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#9b978d] block mb-2">
                  DELIVERY CADENCE:
                </span>
                <div className="flex gap-2">
                  {frequencies.map((freq) => {
                    const isSelected = selectedFrequency === freq;
                    return (
                      <button
                        key={freq}
                        type="button"
                        onClick={() => setSelectedFrequency(freq)}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'bg-[#d4af37] text-[#0a0a0a] font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                            : 'bg-[#18150d] text-[#a19e95] border border-[#d4af37]/25 hover:border-[#d4af37]/50'
                        }`}
                      >
                        {freq}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Closing Line */}
              <div className="p-3.5 rounded-xl bg-[#18150d] border border-[#d4af37]/20 text-xs text-[#dcd7c9] leading-relaxed">
                Farmers get predictable demand. You get regular fresh produce.
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#d4af37]/20">
              <button
                type="button"
                onClick={() => setIsSmartCartOpen(true)}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#fae69e] to-[#c9a227] text-[#0a0a0a] font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-[0_0_20px_-5px_rgba(212,175,55,0.4)] cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Subscribe to Basket</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Personalized Smart Cart & Routine Builder Modal */}
      <SmartCartBuilderModal
        isOpen={isSmartCartOpen}
        onClose={() => setIsSmartCartOpen(false)}
      />
    </section>
  );
};
