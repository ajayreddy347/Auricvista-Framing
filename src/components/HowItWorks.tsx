import React from 'react';
import { motion } from 'motion/react';
import {
  Upload,
  Search,
  CheckCircle2,
  Truck,
  Sparkles,
  ArrowRight,
  ArrowDown,
  Layers,
  ShoppingBag,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const HowItWorks: React.FC = () => {
  const { t } = useLanguage();

  const steps = [
    {
      stepNumber: '01',
      titleKey: 'how.step1Title',
      defaultTitle: 'Farmer Lists Fresh Produce',
      subtitleKey: 'how.step1Sub',
      defaultSub: 'Dawn Harvest & Inventory',
      descKey: 'how.step1Desc',
      defaultDesc: 'Growers upload live produce details, morning harvest date, farm origin, and fair direct price.',
      icon: Upload,
      highlightKey: 'how.step1Badge',
      defaultHighlight: 'Zero Broker Fees',
    },
    {
      stepNumber: '02',
      titleKey: 'how.step2Title',
      defaultTitle: 'Customer Discovers & Orders',
      subtitleKey: 'how.step2Sub',
      defaultSub: 'Transparent Marketplace',
      descKey: 'how.step2Desc',
      defaultDesc: 'Customers browse fresh local crops, see grower credentials, and place orders directly.',
      icon: Search,
      highlightKey: 'how.step2Badge',
      defaultHighlight: '100% Traceable',
    },
    {
      stepNumber: '03',
      titleKey: 'how.step3Title',
      defaultTitle: 'Farmer Prepares the Order',
      subtitleKey: 'how.step3Sub',
      defaultSub: 'Fresh Harvest Preparation',
      descKey: 'how.step3Desc',
      defaultDesc: 'Crops are gathered and packed directly on the farm upon order placement with zero multi-day cold storage.',
      icon: ShoppingBag,
      highlightKey: 'how.step3Badge',
      defaultHighlight: 'Peak Quality',
    },
    {
      stepNumber: '04',
      titleKey: 'how.step4Title',
      defaultTitle: 'Customer Receives Produce',
      subtitleKey: 'how.step4Sub',
      defaultSub: 'Direct Doorstep Delivery',
      descKey: 'how.step4Desc',
      defaultDesc: 'Delivered straight from farm to consumer doorstep within hours, ensuring maximum nutritional freshness.',
      icon: Truck,
      highlightKey: 'how.step4Badge',
      defaultHighlight: 'Direct Delivery',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const itemFadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const stepCardVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section
      id="how-it-works"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#070707] border-t border-[#d4af37]/15 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[450px] rounded-full gold-ambient-radial blur-3xl opacity-30" />
        <div className="absolute inset-0 bg-subtle-grid opacity-25 mask-gradient" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={containerVariants}
          className="text-center max-w-3xl mx-auto mb-16 sm:mb-20"
        >
          <motion.div variants={itemFadeUp} className="mb-4 inline-block">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#14120c]/90 border border-[#d4af37]/40 backdrop-blur-md shadow-[0_0_20px_-5px_rgba(212,175,55,0.25)]">
              <Sparkles className="w-3.5 h-3.5 text-[#fae69e]" />
              <span className="text-[11px] font-mono font-medium tracking-[0.2em] text-[#fae69e] uppercase">
                {t('how.badge', 'Simple 4-Step Process')}
              </span>
            </div>
          </motion.div>

          <motion.h2
            variants={itemFadeUp}
            className="font-serif text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight text-[#fcfbf7] leading-[1.12]"
          >
            <span>{t('how.title1', 'How Auric Arohi Works')}</span>
          </motion.h2>

          <motion.p
            variants={itemFadeUp}
            className="mt-4 sm:mt-5 text-base sm:text-lg text-[#aba79c] font-sans leading-relaxed max-w-2xl mx-auto"
          >
            {t('how.subtitle', 'A seamless direct bridge connecting growers and consumers with total transparency.')}
          </motion.p>
        </motion.div>

        {/* 4 Steps Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isLast = idx === steps.length - 1;

            return (
              <div key={idx} className="relative flex flex-col">
                <motion.div
                  variants={stepCardVariants}
                  className="relative flex-1 p-6 sm:p-7 rounded-3xl bg-[#0e0d0b]/85 border border-[#d4af37]/30 hover:border-[#d4af37] backdrop-blur-xl transition-all duration-300 shadow-[0_0_30px_-10px_rgba(212,175,55,0.15)] hover:shadow-[0_0_40px_-5px_rgba(212,175,55,0.35)] flex flex-col justify-between overflow-hidden group hover:-translate-y-1"
                >
                  {/* Oversized background numeral */}
                  <div
                    className="absolute -top-3 -right-2 font-serif text-7xl sm:text-8xl font-black text-[#d4af37]/[0.08] group-hover:text-[#d4af37]/[0.15] select-none pointer-events-none transition-colors tracking-tighter"
                    aria-hidden="true"
                  >
                    {step.stepNumber}
                  </div>

                  <div>
                    {/* Step tag & Icon */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-xl sm:text-2xl font-bold gold-text-metallic">
                          {step.stepNumber}
                        </span>
                        <span className="h-[1px] w-6 bg-[#d4af37]/40" />
                      </div>

                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#2a2412] to-[#12100a] border border-[#d4af37]/40 flex items-center justify-center text-[#fae69e] shadow-sm group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    <h3 className="font-serif text-lg sm:text-xl font-bold text-[#f5f3eb] mb-1">
                      {t(step.titleKey, step.defaultTitle)}
                    </h3>
                    <p className="text-[11px] font-mono uppercase tracking-wider text-[#c9a227] mb-3">
                      {t(step.subtitleKey, step.defaultSub)}
                    </p>
                    <p className="text-xs sm:text-sm text-[#a39e93] leading-relaxed font-sans">
                      {t(step.descKey, step.defaultDesc)}
                    </p>
                  </div>

                  <div className="pt-5 mt-5 border-t border-[#d4af37]/15 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#8e8b82] uppercase">
                      {t('how.tier', 'Step Standard')}
                    </span>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#fae69e] font-semibold">
                      {t(step.highlightKey, step.defaultHighlight)}
                    </span>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
