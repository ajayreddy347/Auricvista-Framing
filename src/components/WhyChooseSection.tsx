import React from 'react';
import { motion } from 'motion/react';
import {
  HeartHandshake,
  Sparkles,
  Eye,
  ShieldCheck,
  Bot,
  Globe,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export const WhyChooseSection: React.FC = () => {
  const { t } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
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

  const reasons = [
    {
      icon: HeartHandshake,
      titleKey: 'why.reason1Title',
      defaultTitle: 'Direct Farmer Connection',
      descKey: 'why.reason1Desc',
      defaultDesc: 'Buy directly from certified growers without brokers, ensuring farmers earn full value for their hard work.',
    },
    {
      icon: Sparkles,
      titleKey: 'why.reason2Title',
      defaultTitle: 'Fresh & Traceable Produce',
      descKey: 'why.reason2Desc',
      defaultDesc: 'Morning dawn-harvested produce delivered quickly with full harvest origin and grower transparency.',
    },
    {
      icon: Eye,
      titleKey: 'why.reason3Title',
      defaultTitle: 'Transparent Pricing',
      descKey: 'why.reason3Desc',
      defaultDesc: 'Direct farm-gate rates set by farmers themselves, providing honesty for consumers and prosperity for growers.',
    },
    {
      icon: ShieldCheck,
      titleKey: 'why.reason4Title',
      defaultTitle: 'Secure Ordering & Verification',
      descKey: 'why.reason4Desc',
      defaultDesc: 'Reliable transaction processing with verified order tracking, live dispatch status, and authentic customer reviews.',
    },
    {
      icon: Bot,
      titleKey: 'why.reason5Title',
      defaultTitle: 'AI Agronomy for Farmers',
      descKey: 'why.reason5Desc',
      defaultDesc: 'Built-in intelligent farm assistant providing crop care, organic pest remedies, and pricing guidance.',
    },
    {
      icon: Globe,
      titleKey: 'why.reason6Title',
      defaultTitle: 'Multilingual Experience',
      descKey: 'why.reason6Desc',
      defaultDesc: 'Full regional Indian language and voice assistance across 13 native languages with same-language voice response.',
    },
  ];

  return (
    <section
      id="why-choose-auric-arohi"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#070707] border-t border-[#d4af37]/15 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[500px] rounded-full gold-ambient-radial blur-3xl opacity-30" />
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
              <ShieldCheck className="w-3.5 h-3.5 text-[#fae69e]" />
              <span className="text-[11px] font-mono font-medium tracking-[0.2em] text-[#fae69e] uppercase">
                {t('why.badge', 'The Auric Advantage')}
              </span>
            </div>
          </motion.div>

          <motion.h2
            variants={itemFadeUp}
            className="font-serif text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight text-[#fcfbf7] leading-[1.12]"
          >
            <span>{t('why.title1', 'Why Choose Auric Arohi?')}</span>
          </motion.h2>

          <motion.p
            variants={itemFadeUp}
            className="mt-4 sm:mt-5 text-base sm:text-lg text-[#aba79c] font-sans leading-relaxed max-w-2xl mx-auto"
          >
            {t(
              'why.subtitle',
              'Built specifically to empower farmers and deliver unmatched organic harvest freshness to consumers.'
            )}
          </motion.p>
        </motion.div>

        {/* 6 Grid Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {reasons.map((r, idx) => {
            const Icon = r.icon;
            return (
              <motion.div
                key={idx}
                variants={itemFadeUp}
                className="p-7 rounded-3xl bg-[#0e0d0b]/85 border border-[#d4af37]/25 hover:border-[#d4af37] backdrop-blur-xl transition-all duration-300 shadow-[0_0_25px_-8px_rgba(212,175,55,0.15)] hover:shadow-[0_0_35px_-5px_rgba(212,175,55,0.35)] hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#1c180e] border border-[#d4af37]/40 flex items-center justify-center text-[#fae69e] mb-5 shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#f5f3eb] mb-2">
                    {t(r.titleKey, r.defaultTitle)}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#a39e93] leading-relaxed font-sans">
                    {t(r.descKey, r.defaultDesc)}
                  </p>
                </div>

                <div className="pt-5 mt-5 border-t border-[#d4af37]/15 flex items-center gap-2 text-[11px] font-mono text-[#d4af37]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#34d399]" />
                  <span>{t('why.guarantee', 'Auric Arohi Standard')}</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
