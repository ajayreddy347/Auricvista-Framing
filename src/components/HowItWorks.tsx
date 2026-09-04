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
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0e140f] via-[#0d160e] to-[#0c120d] overflow-hidden"
    >
      {/* Background subtle organic forest & gold atmosphere */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[450px] bg-[radial-gradient(ellipse,rgba(52,211,153,0.06)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[350px] bg-[radial-gradient(ellipse,rgba(212,175,55,0.05)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute inset-0 bg-subtle-grid opacity-15 mask-gradient" />
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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#162015]/90 border border-[#d4af37]/40 backdrop-blur-md shadow-[0_0_20px_-5px_rgba(212,175,55,0.25)]">
              <Sparkles className="w-3.5 h-3.5 text-[#fae69e]" />
              <span className="text-[11px] font-mono font-bold tracking-[0.2em] text-[#fae69e] uppercase">
                {t('how.badge', 'Simple 4-Step Process')}
              </span>
            </div>
          </motion.div>

          <motion.h2
            variants={itemFadeUp}
            className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#fcfbf7] leading-[1.12]"
          >
            <span>{t('how.title1', 'How Auric Arohi Works')}</span>
          </motion.h2>

          <motion.p
            variants={itemFadeUp}
            className="mt-4 sm:mt-5 text-base sm:text-lg text-[#d0cbc0] font-sans leading-relaxed max-w-2xl mx-auto"
          >
            {t('how.subtitle', 'A seamless direct bridge connecting growers and consumers with total transparency.')}
          </motion.p>
        </motion.div>

        {/* 4 Steps Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative"
        >
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.stepNumber}
                variants={stepCardVariants}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-[#131c13]/90 border border-[#d4af37]/30 hover:border-[#fae69e]/70 backdrop-blur-md shadow-lg hover:shadow-[0_0_35px_rgba(212,175,55,0.2)] transition-all duration-300 overflow-hidden"
              >
                {/* Step Top */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#1c281b] border border-[#d4af37]/45 flex items-center justify-center text-[#fae69e] group-hover:scale-110 group-hover:border-[#fae69e] transition-all duration-300 shadow-md">
                      <Icon className="w-6 h-6 text-[#d4af37] group-hover:text-[#fae69e]" />
                    </div>
                    <span className="font-mono font-bold text-xl text-[#d4af37]/50 group-hover:text-[#fae69e] transition-colors">
                      {step.stepNumber}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#34d399] font-semibold block mb-1">
                    {t(step.subtitleKey, step.defaultSub)}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#fcfbf7] group-hover:text-[#fae69e] transition-colors leading-snug mb-3">
                    {t(step.titleKey, step.defaultTitle)}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#aba79c] leading-relaxed font-sans">
                    {t(step.descKey, step.defaultDesc)}
                  </p>
                </div>

                {/* Badge Footer */}
                <div className="mt-6 pt-4 border-t border-[#d4af37]/15 flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#fae69e] font-semibold bg-[#1a2618] px-2.5 py-1 rounded-full border border-[#d4af37]/30">
                    {t(step.highlightKey, step.defaultHighlight)}
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-[#34d399]" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
