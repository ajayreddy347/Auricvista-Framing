import React from 'react';
import { motion } from 'motion/react';
import {
  HeartHandshake,
  Sparkles,
  Eye,
  Globe,
  Clock,
  Wheat,
} from 'lucide-react';
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const corePillars = [
    {
      icon: HeartHandshake,
      title: 'Direct Farmer Sourcing',
      desc: 'Connect directly with certified regional growers. 100% of fair produce value reaches the farmer with zero broker markups.',
    },
    {
      icon: Eye,
      title: 'Transparent Pricing',
      desc: 'Real farm-gate pricing set directly by growers with verified crop origin, batch harvest dates, and transparent logistics.',
    },
    {
      icon: Clock,
      title: 'Dawn Harvest Workflow',
      desc: 'Crops are gathered at dawn upon order placement and dispatched fresh, eliminating days of nutrient-degrading cold storage.',
    },
    {
      icon: Globe,
      title: 'Multilingual Experience',
      desc: 'Accessible across 13 native Indian regional languages with natural agricultural voice AI assistance.',
    },
  ];

  return (
    <section
      id="why-choose-auric-arohi"
      className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#12140e] via-[#0d140e] to-[#14120c] overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[radial-gradient(ellipse,rgba(34,197,94,0.05)_0%,rgba(212,175,55,0.04)_50%,transparent_70%)] blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={containerVariants}
          className="text-center max-w-2xl mx-auto mb-14 sm:mb-16"
        >
          <motion.div variants={itemFadeUp} className="mb-3.5 inline-block">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#182417] border border-[#d4af37]/40 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#fae69e]" />
              <span className="text-[11px] font-mono font-bold tracking-widest text-[#fae69e] uppercase">
                The Auric Standard
              </span>
            </div>
          </motion.div>

          <motion.h2
            variants={itemFadeUp}
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#fcfbf7] tracking-tight leading-[1.15]"
          >
            Why Auric Arohi?
          </motion.h2>

          <motion.p
            variants={itemFadeUp}
            className="mt-3.5 text-sm sm:text-base text-[#d0cbc0] font-sans leading-relaxed"
          >
            Designed to empower Indian growers and deliver morning-harvested produce directly to families.
          </motion.p>
        </motion.div>

        {/* 4 Clean Pillars Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {corePillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={idx}
                variants={itemFadeUp}
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl bg-[#141c13]/90 border border-[#d4af37]/30 hover:border-[#fae69e]/70 transition-all duration-300 shadow-md flex flex-col justify-between backdrop-blur-sm"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#1c281b] border border-[#d4af37]/45 flex items-center justify-center text-[#fae69e] mb-4 shadow-sm">
                    <Icon className="w-5 h-5 text-[#fae69e]" />
                  </div>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-[#fcfbf7] mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#aba79c] leading-relaxed font-sans">
                    {pillar.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
