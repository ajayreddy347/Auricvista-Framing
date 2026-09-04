import { useLanguage } from '../context/LanguageContext';
import React from 'react';
import { motion } from 'motion/react';
import {
  Sprout,
  Wheat,
  Package,
  Truck,
  Home,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const Traceability: React.FC = () => {
  const { t } = useLanguage();
  const steps = [
    {
      id: 'farm',
      num: '01',
      title: 'Farm',
      subtext: 'Where it all begins',
      icon: Sprout,
      tag: 'Soil Origin',
    },
    {
      id: 'harvested',
      num: '02',
      title: 'Harvested',
      subtext: 'Picked fresh, same day',
      icon: Wheat,
      tag: 'Peak Maturity',
    },
    {
      id: 'packed',
      num: '03',
      title: 'Packed',
      subtext: 'Carefully prepared for delivery',
      icon: Package,
      tag: 'Zero Chemical Seal',
    },
    {
      id: 'dispatched',
      num: '04',
      title: 'Dispatched',
      subtext: 'On its way to you',
      icon: Truck,
      tag: 'Cold Transit',
    },
    {
      id: 'customer',
      num: '05',
      title: 'Customer',
      subtext: 'Fresh produce, delivered',
      icon: Home,
      tag: 'Table Ready',
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

  const nodeVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <section
      id="traceability-section"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-transparent border-t border-[#d4af37]/15 backdrop-blur-[2px] overflow-hidden"
    >
      {/* Ambient background gold glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[450px] rounded-full gold-ambient-radial blur-3xl opacity-35" />
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
              id="traceability-eyebrow-pill"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14120c]/80 border border-[#d4af37]/30 backdrop-blur-md shadow-[0_0_15px_-5px_rgba(212,175,55,0.15)]"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="text-[11px] font-mono font-medium tracking-[0.2em] text-[#e8dfca] uppercase">
                {t('trace.eyebrow', 'End-to-End Verification')}
              </span>
            </div>
          </motion.div>

          <motion.h2
            variants={itemFadeUp}
            id="traceability-heading"
            className="font-serif text-3xl sm:text-5xl md:text-6xl font-medium tracking-[-0.02em] leading-[1.12] text-[#fcfbf7]"
          >
            <span className="block text-[#fcfbf7]">
              {t('trace.heading', 'Where Did Your Food Come From?')}
            </span>
          </motion.h2>

          <motion.p
            variants={itemFadeUp}
            id="traceability-subtext"
            className="mt-4 sm:mt-5 text-base sm:text-lg md:text-xl text-[#aba79c] font-normal leading-relaxed font-sans"
          >
            {t('trace.subtext', 'Follow the journey of your produce, from soil to doorstep.')}
          </motion.p>
        </motion.div>

        {/* ========================================================================= */}
        {/* TIMELINE / JOURNEY DIAGRAM (Horizontal on Desktop, Vertical on Mobile)   */}
        {/* ========================================================================= */}
        <div className="mt-16 sm:mt-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            id="traceability-timeline"
            className="relative p-6 sm:p-8 md:p-10 rounded-3xl bg-[#0e0d0b]/85 border border-[#d4af37]/25 backdrop-blur-xl shadow-[0_0_40px_-15px_rgba(0,0,0,0.8)]"
          >
            {/* Desktop Connecting Line behind nodes */}
            <div className="hidden lg:block absolute top-[92px] left-16 right-16 h-[2px] animated-signal-line rounded-full z-0 opacity-70" />

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-4 relative z-10">
              {steps.map((step, idx) => {
                const IconComp = step.icon;

                return (
                  <motion.div
                    key={step.id}
                    variants={nodeVariants}
                    id={`trace-node-${step.id}`}
                    className="group relative p-5 sm:p-6 rounded-2xl bg-[#14120d]/90 border border-[#d4af37]/30 hover:border-[#d4af37] backdrop-blur-md transition-all duration-300 shadow-[0_0_20px_-8px_rgba(212,175,55,0.15)] hover:shadow-[0_0_35px_-5px_rgba(212,175,55,0.35)] hover:-translate-y-1 flex flex-col items-center text-center"
                  >
                    {/* Step Number Micro-Badge */}
                    <span className="text-[10px] font-mono text-[#c9a227] tracking-widest uppercase mb-2">
                      STEP {step.num}
                    </span>

                    {/* Icon Box with Gold Ring */}
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2a2412] to-[#12100a] border border-[#d4af37]/45 flex items-center justify-center text-[#fae69e] shadow-[0_0_15px_-3px_rgba(212,175,55,0.3)] group-hover:scale-105 group-hover:border-[#fae69e] transition-all duration-300 mb-3">
                      <IconComp className="w-6 h-6" />
                    </div>

                    {/* Node Title */}
                    <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#f5f3eb] tracking-wide mb-1 group-hover:text-[#fae69e] transition-colors">
                      {step.title}
                    </h3>

                    {/* Node Subtext */}
                    <p className="text-xs text-[#aba79c] leading-relaxed font-sans mb-3">
                      {step.subtext}
                    </p>

                    {/* Tag badge */}
                    <span className="mt-auto inline-flex items-center gap-1 text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#1c1912] border border-[#d4af37]/25 text-[#d4af37]">
                      <CheckCircle2 className="w-2.5 h-2.5 text-[#34d399]" />
                      <span>{step.tag}</span>
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Bottom Centered Guarantee Line */}
          <motion.div
            variants={itemFadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-8 text-center"
          >
            <p
              id="traceability-guarantee-line"
              className="text-xs sm:text-sm text-[#9b978d] font-sans tracking-normal max-w-2xl mx-auto"
            >
              {t('trace.guarantee', 'Every order can be traced back to the exact farm and farmer it came from.')}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
