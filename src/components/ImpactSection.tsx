import React from 'react';
import { motion } from 'motion/react';
import {
  Heart,
  TrendingDown,
  Apple,
  ShieldCheck,
  Sparkles,
  Tractor,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const ImpactSection: React.FC = () => {
  const { t } = useLanguage();

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

  const impacts = [
    {
      icon: Tractor,
      titleKey: 'impact.card1Title',
      defaultTitle: 'Supporting Local Farmers',
      descKey: 'impact.card1Desc',
      defaultDesc: 'Empowering regional growers with direct market access, fair harvest returns, and long-term economic dignity.',
    },
    {
      icon: TrendingDown,
      titleKey: 'impact.card2Title',
      defaultTitle: 'Eliminating Unnecessary Middlemen',
      descKey: 'impact.card2Desc',
      defaultDesc: 'Removing multi-tiered broker markups so consumer payments go straight to the agricultural producers who grew the food.',
    },
    {
      icon: Apple,
      titleKey: 'impact.card3Title',
      defaultTitle: 'Promoting Fresh & Healthy Produce',
      descKey: 'impact.card3Desc',
      defaultDesc: 'Delivering chemical-free, nutrient-rich morning harvests to families with zero artificial preservation or aging.',
    },
    {
      icon: Users,
      titleKey: 'impact.card4Title',
      defaultTitle: 'Trusted Direct Ecosystem',
      descKey: 'impact.card4Desc',
      defaultDesc: 'Building genuine human relationships between growers and patrons through verifiable harvest traceability and feedback.',
    },
  ];

  return (
    <section
      id="our-impact"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#070707] border-t border-[#d4af37]/15 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        <div className="absolute top-1/2 right-1/3 w-[700px] h-[450px] rounded-full gold-ambient-secondary blur-3xl opacity-30" />
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
              <Heart className="w-3.5 h-3.5 text-[#fae69e]" />
              <span className="text-[11px] font-mono font-medium tracking-[0.2em] text-[#fae69e] uppercase">
                {t('impact.badge', 'Our Agricultural Impact')}
              </span>
            </div>
          </motion.div>

          <motion.h2
            variants={itemFadeUp}
            className="font-serif text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight text-[#fcfbf7] leading-[1.12]"
          >
            <span>{t('impact.title1', 'Transforming Farm Trade.')}</span>
            <span className="block gold-gradient-text mt-1 sm:mt-2">
              {t('impact.title2', 'Strengthening Communities.')}
            </span>
          </motion.h2>

          <motion.p
            variants={itemFadeUp}
            className="mt-5 text-base sm:text-lg text-[#aba79c] font-sans leading-relaxed max-w-2xl mx-auto"
          >
            {t(
              'impact.subtitle',
              'By establishing a direct bridge between fields and tables, Auric Arohi fosters regenerative farming, financial transparency, and genuine food trust.'
            )}
          </motion.p>
        </motion.div>

        {/* 4 Impact Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {impacts.map((imp, idx) => {
            const Icon = imp.icon;
            return (
              <motion.div
                key={idx}
                variants={itemFadeUp}
                className="p-6 sm:p-7 rounded-3xl bg-[#0e0d0b]/85 border border-[#d4af37]/25 hover:border-[#d4af37] backdrop-blur-xl transition-all duration-300 shadow-[0_0_25px_-8px_rgba(212,175,55,0.15)] hover:shadow-[0_0_35px_-5px_rgba(212,175,55,0.35)] hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#1c180e] border border-[#d4af37]/40 flex items-center justify-center text-[#fae69e] mb-5 shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#f5f3eb] mb-2">
                    {t(imp.titleKey, imp.defaultTitle)}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#a39e93] leading-relaxed font-sans">
                    {t(imp.descKey, imp.defaultDesc)}
                  </p>
                </div>

                <div className="pt-5 mt-5 border-t border-[#d4af37]/15 flex items-center gap-2 text-[11px] font-mono text-[#34d399]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t('impact.realImpact', 'Direct Impact')}</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
