import React from 'react';
import { motion } from 'motion/react';
import {
  Upload,
  Search,
  ShoppingCart,
  Truck,
  Sparkles,
  ArrowRight,
  ArrowDown,
  CheckCircle,
  Clock,
  MapPin,
  Camera,
  DollarSign,
  Package,
  Layers,
} from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      stepNumber: '01',
      title: 'Farmers List',
      icon: Upload,
      subtitle: 'Harvest & inventory onboarding',
      description: 'Growers upload live harvest metrics directly onto the decentralized ledger:',
      bullets: [
        'Product & variety',
        'Quantity & yield capacity',
        'Direct farm-gate price',
        'Verified harvest date',
        'Geographic location',
        'High-resolution farm photos',
        'Real-time availability window',
      ],
      highlight: 'Zero Listing Fees',
    },
    {
      stepNumber: '02',
      title: 'Customers Discover',
      icon: Search,
      subtitle: 'Algorithmic curation',
      description: 'Consumers query hyper-local organic harvests with full transparency:',
      bullets: [
        'Precise geo-location radius',
        'Fresh produce catalog',
        'Transparent direct pricing',
        'Freshness & picking index',
        'Verified grower profiles',
        'Instant batch availability',
      ],
      highlight: 'Traceable Provenance',
    },
    {
      stepNumber: '03',
      title: 'Direct Order',
      icon: ShoppingCart,
      subtitle: 'Peer-to-peer settlement',
      description:
        'Customer places an order directly through the platform, no middlemen involved.',
      bullets: [
        'Direct grower-to-buyer escrow',
        'Automated quality validation',
        'Instant digital invoice',
        'Zero predatory broker cuts',
      ],
      highlight: '100% Disintermediated',
    },
    {
      stepNumber: '04',
      title: 'Delivery / Pickup',
      icon: Truck,
      subtitle: 'Flexible fulfillment channels',
      description: 'Seamless cold-chain dispatch or regional farm-gate retrieval options:',
      bullets: [
        'Farmer direct delivery',
        'AuricVista-supported cold transit',
        'Local verified pickup hubs',
        'Real-time harvest GPS tracking',
      ],
      highlight: 'Peak Fresh Guarantee',
    },
  ];

  // Motion variants for staged entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.14,
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

  const stepCardVariants = {
    hidden: { opacity: 0, y: 28, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.75,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <section
      id="how-it-works-section"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#070707] border-t border-[#d4af37]/15 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[450px] rounded-full gold-ambient-radial blur-3xl opacity-35" />
        <div className="absolute bottom-10 left-1/4 w-[500px] h-[350px] rounded-full gold-ambient-secondary blur-2xl opacity-30" />
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
          {/* Eyebrow Pill */}
          <motion.div variants={itemFadeUp} className="mb-5 inline-block">
            <div
              id="how-it-works-eyebrow-pill"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14120c]/80 border border-[#d4af37]/30 backdrop-blur-md shadow-[0_0_15px_-5px_rgba(212,175,55,0.15)]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="text-[11px] font-mono font-medium tracking-[0.2em] text-[#e8dfca] uppercase">
                The Protocol Architecture
              </span>
            </div>
          </motion.div>

          {/* Section Heading */}
          <motion.h2
            variants={itemFadeUp}
            id="how-it-works-heading"
            className="font-serif text-3xl sm:text-5xl md:text-6xl font-medium tracking-[-0.02em] leading-[1.12] text-[#fcfbf7]"
          >
            <span className="block text-[#fcfbf7]">
              How AuricVista Works
            </span>
          </motion.h2>

          {/* Supporting Subtext */}
          <motion.p
            variants={itemFadeUp}
            id="how-it-works-subtext"
            className="mt-4 sm:mt-5 text-base sm:text-lg md:text-xl text-[#aba79c] font-normal leading-relaxed font-sans"
          >
            A simple, direct path from farm to doorstep.
          </motion.p>
        </motion.div>

        {/* ========================================================================= */}
        {/* 4-STEP PROCESS FLOW (HORIZONTAL DESKTOP / STACKED MOBILE)                  */}
        {/* ========================================================================= */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-16 sm:mt-20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-4 relative">
            {steps.map((step, index) => {
              const IconComp = step.icon;
              const isLast = index === steps.length - 1;

              return (
                <div key={step.stepNumber} className="relative flex flex-col">
                  {/* Step Card */}
                  <motion.div
                    variants={stepCardVariants}
                    id={`step-card-${step.stepNumber}`}
                    className="relative flex-1 p-6 sm:p-7 rounded-3xl bg-[#0e0d0b]/85 border border-[#d4af37]/30 hover:border-[#d4af37]/70 backdrop-blur-xl transition-all duration-300 shadow-[0_0_30px_-10px_rgba(212,175,55,0.15)] hover:shadow-[0_0_40px_-5px_rgba(212,175,55,0.35)] flex flex-col justify-between overflow-hidden group"
                  >
                    {/* Oversized Background Watermark Step Number */}
                    <div
                      className="absolute -top-3 -right-2 font-serif text-7xl sm:text-8xl font-black text-[#d4af37]/[0.08] group-hover:text-[#d4af37]/[0.15] select-none pointer-events-none transition-colors duration-300 tracking-tighter"
                      aria-hidden="true"
                    >
                      {step.stepNumber}
                    </div>

                    {/* Top Row: Prominent Step Tag & Icon */}
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-xl sm:text-2xl font-bold gold-text-metallic">
                            {step.stepNumber}
                          </span>
                          <span className="h-[1px] w-6 bg-[#d4af37]/40" />
                        </div>

                        {/* Icon Box */}
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#2a2412] to-[#12100a] border border-[#d4af37]/40 flex items-center justify-center text-[#fae69e] shadow-[0_0_15px_-3px_rgba(212,175,55,0.25)] group-hover:scale-105 transition-transform duration-300">
                          <IconComp className="w-5 h-5" />
                        </div>
                      </div>

                      {/* Step Title & Subtitle */}
                      <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#f5f3eb] tracking-wide mb-1">
                        {step.title}
                      </h3>
                      <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#c9a227] mb-4">
                        {step.subtitle}
                      </p>

                      {/* Descriptive Intro text */}
                      <p className="text-xs text-[#a19e95] leading-relaxed mb-4 font-sans">
                        {step.description}
                      </p>

                      {/* Bulleted List */}
                      <ul className="space-y-2 mb-6">
                        {step.bullets.map((bullet, bIdx) => (
                          <li
                            key={bIdx}
                            className="flex items-start gap-2 text-xs text-[#dcd7c9] font-sans"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] mt-1.5 shrink-0 shadow-[0_0_4px_#d4af37]" />
                            <span className="leading-snug">{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Bottom Highlight Pill */}
                    <div className="pt-4 border-t border-[#d4af37]/15 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[#8e8b82] uppercase">
                        Protocol Tier
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#fae69e] font-semibold">
                        {step.highlight}
                      </span>
                    </div>
                  </motion.div>

                  {/* Desktop Connecting Arrow between cards */}
                  {!isLast && (
                    <div className="hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-7 h-7 rounded-full bg-[#171510] border border-[#d4af37]/45 text-[#d4af37] shadow-[0_0_12px_rgba(212,175,55,0.3)]">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  )}

                  {/* Mobile Connecting Arrow between cards */}
                  {!isLast && (
                    <div className="lg:hidden flex items-center justify-center py-2 text-[#d4af37]">
                      <div className="w-7 h-7 rounded-full bg-[#171510] border border-[#d4af37]/45 flex items-center justify-center shadow-[0_0_10px_rgba(212,175,55,0.25)]">
                        <ArrowDown className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Bottom Assurance Banner */}
        <motion.div
          variants={itemFadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-14 p-4 sm:p-6 rounded-2xl bg-[#11100c]/80 border border-[#d4af37]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-serif font-semibold text-[#f5f3eb]">
                End-to-End Direct Exchange Protocol
              </p>
              <p className="text-[11px] text-[#8e8b82] font-sans">
                Every transaction directly rewards the producer and delivers verified fresh harvests to consumer tables.
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#171510] border border-[#d4af37]/30 text-[11px] font-mono text-[#fae69e] shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse" />
            <span>Real-time Active Routing</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
