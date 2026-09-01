import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const FinalCTA: React.FC = () => {
  const { isLoggedIn, userRole } = useAuth();

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
    <section id="final-cta-section" className="relative py-28 sm:py-36 px-4 sm:px-6 lg:px-8 border-t border-[#d4af37]/20 bg-[#070707] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] rounded-full gold-ambient-radial blur-3xl opacity-40" />
        <div className="absolute inset-0 bg-subtle-grid opacity-30 mask-gradient" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto w-full text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={containerVariants}
          className="flex flex-col items-center"
        >
          {/* Small Eyebrow */}
          <motion.div variants={itemFadeUp} className="mb-6 inline-block">
            <div
              id="final-eyebrow-pill"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#14120c]/90 border border-[#d4af37]/40 backdrop-blur-md shadow-[0_0_20px_-5px_rgba(212,175,55,0.25)]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#fae69e]" />
              <span className="text-[11px] font-mono font-medium tracking-[0.2em] text-[#fae69e] uppercase">
                The Direct Agricultural Future
              </span>
            </div>
          </motion.div>

          {/* Large Two-Line Premium Typography Heading */}
          <motion.h2
            variants={itemFadeUp}
            id="final-heading"
            className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-[-0.03em] leading-[1.08] text-[#fcfbf7]"
          >
            <span className="block text-[#fcfbf7]">
              A Better Way to Buy.
            </span>
            <span className="block text-gradient-gold drop-shadow-sm mt-1 sm:mt-2">
              A Fairer Way to Farm.
            </span>
          </motion.h2>

          {/* Subtext */}
          <motion.p
            variants={itemFadeUp}
            id="final-subtext"
            className="mt-6 sm:mt-8 text-base sm:text-xl md:text-2xl text-[#c4bfae] font-normal max-w-2xl mx-auto leading-relaxed font-sans"
          >
            When farmers earn fairly, communities grow stronger.
          </motion.p>

          {/* Two Centered Action Buttons */}
          <motion.div
            variants={itemFadeUp}
            className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-md mx-auto"
          >
            {/* Primary Gold Button */}
            <Link
              to="/marketplace"
              id="start-shopping-final-btn"
              className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-9 py-4 rounded-full font-semibold text-xs sm:text-sm uppercase tracking-[0.14em] text-[#0a0a0a] bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#b89120] hover:from-[#fff0b8] hover:via-[#e6c24d] hover:to-[#c99f2b] shadow-[0_0_30px_-5px_rgba(212,175,55,0.4)] hover:shadow-[0_0_45px_0_rgba(212,175,55,0.6)] hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 cursor-pointer"
            >
              <span>START SHOPPING</span>
              <ArrowRight className="w-4 h-4 text-[#0a0a0a] group-hover:translate-x-1 transition-transform duration-300" />
            </Link>

            {/* Secondary Outlined Button */}
            <Link
              to={isLoggedIn && userRole === 'farmer' ? '/farmer-dashboard' : '/signup?role=farmer'}
              id="become-farmer-final-btn"
              className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-9 py-4 rounded-full font-medium text-xs sm:text-sm uppercase tracking-[0.14em] text-[#f5f3eb] bg-[#12110c]/80 hover:bg-[#d4af37]/15 border border-[#d4af37]/45 hover:border-[#d4af37] backdrop-blur-md shadow-[0_0_20px_-8px_rgba(212,175,55,0.15)] hover:shadow-[0_0_30px_-5px_rgba(212,175,55,0.35)] hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 cursor-pointer"
            >
              <span>{isLoggedIn && userRole === 'farmer' ? 'MY FARM PORTAL' : 'BECOME A FARMER'}</span>
              <ArrowRight className="w-4 h-4 text-[#d4af37] group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
