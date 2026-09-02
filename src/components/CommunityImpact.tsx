import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import {
  TrendingUp,
  Users,
  Scale,
  Coins,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';

interface StatItemProps {
  finalNumber: number;
  suffix?: string;
  prefix?: string;
  label: string;
  sublabel?: string;
  icon: React.ElementType;
}

const CountUpTile: React.FC<StatItemProps> = ({
  finalNumber,
  suffix = '',
  prefix = '',
  label,
  sublabel,
  icon: IconComp,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 1600; // ms
    const startTime = performance.now();

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(easeOut * finalNumber);

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setDisplayValue(finalNumber);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [isInView, finalNumber]);

  return (
    <motion.div
      ref={ref}
      variants={{
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
        },
      }}
      className="group relative p-7 sm:p-9 rounded-3xl bg-[#0e0d0b]/85 border border-[#d4af37]/25 hover:border-[#fae69e] backdrop-blur-xl transition-all duration-300 shadow-[0_0_25px_-10px_rgba(212,175,55,0.12)] hover:shadow-[0_0_40px_-5px_rgba(212,175,55,0.35)] hover:-translate-y-1.5 flex flex-col justify-between"
    >
      {/* Ambient gold glow on hover */}
      <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-[#d4af37]/10 group-hover:bg-[#d4af37]/20 blur-xl transition-all duration-300 pointer-events-none" />

      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2a2412] to-[#12100a] border border-[#d4af37]/40 flex items-center justify-center text-[#fae69e] shadow-[0_0_15px_-3px_rgba(212,175,55,0.25)] group-hover:scale-105 transition-all">
            <IconComp className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#c9a227] px-2.5 py-1 rounded-full bg-[#18150d] border border-[#d4af37]/20">
            Real Impact
          </span>
        </div>

        {/* Count-Up Metric */}
        <div className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#fcfbf7] tracking-tight mb-2 group-hover:text-[#fae69e] transition-colors">
          <span className="text-[#fae69e]">{prefix}</span>
          <span>{displayValue.toLocaleString()}</span>
          <span className="text-[#fae69e]">{suffix}</span>
        </div>

        {/* Label Underneath */}
        <h3 className="text-sm sm:text-base font-semibold text-[#f5f3eb] font-sans tracking-wide">
          {label}
        </h3>
      </div>

      {sublabel && (
        <p className="mt-4 pt-3 border-t border-[#d4af37]/15 text-xs text-[#8e8b82] font-sans">
          {sublabel}
        </p>
      )}
    </motion.div>
  );
};

export const CommunityImpact: React.FC = () => {
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

  return (
    <section
      id="community-impact-section"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#070707] border-t border-[#d4af37]/15 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] rounded-full gold-ambient-radial blur-3xl opacity-35" />
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
              id="impact-eyebrow-pill"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14120c]/80 border border-[#d4af37]/30 backdrop-blur-md shadow-[0_0_15px_-5px_rgba(212,175,55,0.15)]"
            >
              <TrendingUp className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="text-[11px] font-mono font-medium tracking-[0.2em] text-[#e8dfca] uppercase">
                Collective Prosperity
              </span>
            </div>
          </motion.div>

          <motion.h2
            variants={itemFadeUp}
            id="impact-heading"
            className="font-serif text-3xl sm:text-5xl md:text-6xl font-medium tracking-[-0.02em] leading-[1.12] text-[#fcfbf7]"
          >
            <span className="block text-[#fcfbf7]">
              Auric Arohi Impact
            </span>
          </motion.h2>

          <motion.p
            variants={itemFadeUp}
            id="impact-subtext"
            className="mt-4 sm:mt-5 text-base sm:text-lg md:text-xl text-[#aba79c] font-normal leading-relaxed font-sans"
          >
            Real change, one direct connection at a time.
          </motion.p>
        </motion.div>

        {/* ========================================================================= */}
        {/* 4 LARGE STAT TILES (Row on Desktop, 2x2 on Mobile/Tablet)                 */}
        {/* ========================================================================= */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-16 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7"
        >
          {/* Tile 1: 1,250+ Farmers Connected */}
          <CountUpTile
            finalNumber={1250}
            suffix="+"
            label="Farmers Connected"
            sublabel="Across 28 verified agricultural zones"
            icon={Users}
          />

          {/* Tile 2: 18,500+ KG Produce Sold Directly */}
          <CountUpTile
            finalNumber={18500}
            suffix="+ KG"
            label="Produce Sold Directly"
            sublabel="Direct soil-to-door fulfillment"
            icon={Scale}
          />

          {/* Tile 3: ₹12L+ Value Reached Farmers */}
          <CountUpTile
            finalNumber={12}
            prefix="₹"
            suffix="L+"
            label="Value Reached Farmers"
            sublabel="100% transparent zero-middleman payout"
            icon={Coins}
          />

          {/* Tile 4: 32,000+ Orders Completed */}
          <CountUpTile
            finalNumber={32000}
            suffix="+"
            label="Orders Completed"
            sublabel="Average customer rating 4.9 / 5.0"
            icon={ShoppingBag}
          />
        </motion.div>
      </div>
    </section>
  );
};
