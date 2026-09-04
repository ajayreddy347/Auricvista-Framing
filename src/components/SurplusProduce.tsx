import { useLanguage } from '../context/LanguageContext';
import React from 'react';
import { motion } from 'motion/react';
import {
  Tag,
  HeartHandshake,
  Recycle,
  ArrowRight,
  Leaf,
} from 'lucide-react';

export const SurplusProduce: React.FC = () => {
  const { t } = useLanguage();
  const surplusOptions = [
    {
      label: 'Sell at Discount →',
      icon: Tag,
      tag: 'Flash Markdown',
    },
    {
      label: 'Donate →',
      icon: HeartHandshake,
      tag: 'Zero Hunger NGO Link',
    },
    {
      label: 'Send for Food Recycling →',
      icon: Recycle,
      tag: 'Compost & Biofuel',
    },
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

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.96 },
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
      id="surplus-produce-section"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-transparent border-t border-[#d4af37]/15 backdrop-blur-[2px] overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] rounded-full gold-ambient-radial blur-3xl opacity-35" />
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
              id="surplus-eyebrow-pill"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14120c]/80 border border-[#d4af37]/30 backdrop-blur-md shadow-[0_0_15px_-5px_rgba(212,175,55,0.15)]"
            >
              <Leaf className="w-3.5 h-3.5 text-[#34d399]" />
              <span className="text-[11px] font-mono font-medium tracking-[0.2em] text-[#e8dfca] uppercase">
                {t('surplus.eyebrow', 'Zero Waste Circularity')}
              </span>
            </div>
          </motion.div>

          <motion.h2
            variants={itemFadeUp}
            id="surplus-heading"
            className="font-serif text-3xl sm:text-5xl md:text-6xl font-medium tracking-[-0.02em] leading-[1.12] text-[#fcfbf7]"
          >
            <span className="block text-[#fcfbf7]">
              {t('surplus.heading', "Don't Let Good Food Go to Waste")}
            </span>
          </motion.h2>

          <motion.p
            variants={itemFadeUp}
            id="surplus-subtext"
            className="mt-4 sm:mt-5 text-base sm:text-lg md:text-xl text-[#aba79c] font-normal leading-relaxed font-sans"
          >
            Options for surplus and unsold produce.
          </motion.p>
        </motion.div>

        {/* ========================================================================= */}
        {/* THREE GOLD-OUTLINED CARDS (Minimal, Minimalist Text & Icons)              */}
        {/* ========================================================================= */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-14 sm:mt-18 grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6"
        >
          {surplusOptions.map((opt, idx) => {
            const IconComp = opt.icon;
            return (
              <motion.div
                key={idx}
                variants={cardVariants}
                className="group relative p-7 sm:p-8 rounded-3xl bg-[#0e0d0b]/85 border border-[#d4af37]/30 backdrop-blur-xl card-lift-glow shadow-[0_0_25px_-10px_rgba(212,175,55,0.12)] flex flex-col items-center justify-center text-center cursor-pointer overflow-hidden"
              >
                {/* Micro Tag */}
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#c9a227] mb-5 px-2.5 py-0.5 rounded-full bg-[#18150d] border border-[#d4af37]/20">
                  {opt.tag}
                </span>

                {/* Icon Box */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2a2412] to-[#12100a] border border-[#d4af37]/45 flex items-center justify-center text-[#fae69e] shadow-[0_0_15px_-3px_rgba(212,175,55,0.25)] group-hover:scale-110 group-hover:border-[#fae69e] transition-all duration-300 mb-5">
                  <IconComp className="w-7 h-7" />
                </div>

                {/* Label with Arrow */}
                <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#f5f3eb] group-hover:text-[#fae69e] transition-colors tracking-wide flex items-center gap-1">
                  <span>{opt.label}</span>
                </h3>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ========================================================================= */}
        {/* SMALL CONNECTING ECOSYSTEM LINE                                          */}
        {/* ========================================================================= */}
        <motion.div
          variants={itemFadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <p
            id="surplus-ecosystem-line"
            className="text-xs sm:text-sm text-[#8e8b82] font-sans max-w-2xl mx-auto leading-relaxed"
          >
            Part of the larger Auric Arohi ecosystem — connecting farms, food donation, and food recycling.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
