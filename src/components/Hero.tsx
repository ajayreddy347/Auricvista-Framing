import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  Tractor,
  Cpu,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Leaf,
  ChevronRight,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Hero: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemFadeUp = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.85,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <section
      id="hero-section"
      className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center overflow-hidden py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#070707]"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] sm:w-[900px] h-[550px] rounded-full gold-ambient-radial animate-gold-glow blur-3xl opacity-70" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[400px] rounded-full gold-ambient-secondary blur-2xl opacity-60" />
        <div className="absolute inset-0 bg-subtle-grid opacity-60 mask-gradient" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl mx-auto w-full flex flex-col items-center text-center"
      >
        {/* Eyebrow Pill */}
        <motion.div variants={itemFadeUp} className="mb-6 sm:mb-8">
          <div
            id="hero-eyebrow-pill"
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#14120c]/80 border border-[#d4af37]/35 backdrop-blur-md shadow-[0_0_20px_-5px_rgba(212,175,55,0.2)]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="text-[11px] sm:text-xs font-mono font-medium tracking-[0.2em] text-[#e8dfca] uppercase">
              {t('hero.badge', 'Direct Farm-to-Consumer Platform across India')}
            </span>
          </div>
        </motion.div>

        {/* Large Heading */}
        <motion.h1
          variants={itemFadeUp}
          id="hero-main-heading"
          className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-[5.25rem] font-medium tracking-[-0.02em] leading-[1.08] text-[#fcfbf7] max-w-4xl mx-auto"
        >
          <span className="block text-[#fcfbf7] drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)]">
            {t('hero.title1', 'Fresh Indian Harvests.')}
          </span>
          <span className="block gold-text-metallic font-semibold tracking-[-0.015em] mt-1 sm:mt-2">
            {t('hero.title2', 'Direct From Farmers.')}
          </span>
        </motion.h1>

        {/* India-Wide Subtext */}
        <motion.p
          variants={itemFadeUp}
          id="hero-subtext"
          className="mt-6 sm:mt-8 text-base sm:text-lg md:text-xl text-[#aba79c] font-normal leading-relaxed max-w-3xl mx-auto tracking-normal font-sans"
        >
          {t(
            'hero.subtitle',
            'Connect directly with hardworking farmers across India. Discover seasonal fruits, fresh vegetables, aromatic spices, pulses, and organic grains with fair returns for growers and honest prices for families.'
          )}
        </motion.p>

        {/* Two Action CTAs */}
        <motion.div
          variants={itemFadeUp}
          id="hero-cta-group"
          className="mt-9 sm:mt-11 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          <button
            id="primary-explore-produce-btn"
            onClick={() => navigate('/marketplace')}
            className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-semibold text-xs sm:text-sm uppercase tracking-[0.14em] text-[#0a0a0a] bg-gradient-to-r from-[#d4af37] via-[#f7e6a4] to-[#c9a227] shadow-[0_0_30px_-5px_rgba(212,175,55,0.45)] hover:shadow-[0_0_40px_2px_rgba(212,175,55,0.7)] hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 cursor-pointer overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              {t('hero.exploreBtn', 'Explore Fresh Produce')}
              <ArrowRight className="w-4 h-4 text-[#0a0a0a] group-hover:translate-x-1 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>

          <button
            id="secondary-join-farmer-btn"
            onClick={() => navigate('/login?role=farmer')}
            className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-medium text-xs sm:text-sm uppercase tracking-[0.14em] text-[#f5f3eb] bg-[#12110c]/80 hover:bg-[#d4af37]/15 border border-[#d4af37]/45 hover:border-[#d4af37] backdrop-blur-md shadow-[0_0_20px_-8px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_-5px_rgba(212,175,55,0.35)] hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 cursor-pointer"
          >
            <span>{t('hero.farmerBtn', 'Join as a Farmer')}</span>
            <ArrowUpRight className="w-4 h-4 text-[#d4af37] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </button>
        </motion.div>

        {/* CONNECTED NODES DIAGRAM: FARMER -> AURIC AROHI -> CUSTOMER */}
        <motion.div
          variants={itemFadeUp}
          id="hero-connected-diagram"
          className="mt-14 sm:mt-20 w-full max-w-4xl pt-6"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#d4af37]/40" />
            <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#c9a227]">
              DIRECT VALUE CHAIN
            </span>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#d4af37]/40" />
          </div>

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 md:gap-3 p-4 sm:p-6 md:p-8 rounded-3xl bg-[#0e0d0a]/70 border border-[#d4af37]/25 backdrop-blur-xl shadow-[0_0_50px_-15px_rgba(212,175,55,0.15)]">
            {/* NODE 1: FARMER */}
            <div
              id="node-farmer"
              className="group relative flex-1 w-full md:w-auto p-5 sm:p-6 rounded-2xl bg-[#14120d]/90 border border-[#d4af37]/35 hover:border-[#d4af37] transition-all duration-300 shadow-[0_0_20px_-8px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_-5px_rgba(212,175,55,0.35)] flex flex-col items-center text-center"
            >
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[#2a2412] to-[#12100a] border border-[#d4af37]/40 flex items-center justify-center mb-3 shadow-[0_0_15px_-3px_rgba(212,175,55,0.3)] group-hover:scale-105 transition-transform">
                <Tractor className="w-6 h-6 text-[#fae69e]" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs uppercase font-mono tracking-[0.2em] text-[#d4af37] font-bold">
                  {t('nav.roleFarmer', 'FARMER')}
                </span>
              </div>
              <p className="text-xs text-[#aba79c] mt-1.5 leading-relaxed font-sans">
                Harvests produce & receives fair direct payment.
              </p>
            </div>

            {/* Connecting Arrow 1 */}
            <div className="hidden md:flex items-center justify-center text-[#d4af37]/60">
              <ChevronRight className="w-5 h-5 animate-pulse" />
            </div>

            {/* NODE 2: AURIC AROHI PLATFORM */}
            <div
              id="node-platform"
              className="group relative flex-1 w-full md:w-auto p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#18150e] to-[#0e0d0a] border-2 border-[#d4af37]/60 hover:border-[#fae69e] transition-all duration-300 shadow-[0_0_30px_-5px_rgba(212,175,55,0.3)] hover:shadow-[0_0_40px_0_rgba(212,175,55,0.5)] flex flex-col items-center text-center"
            >
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#8a6b18] text-[#0a0a0a] flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(212,175,55,0.4)] group-hover:scale-105 transition-transform">
                <Cpu className="w-6 h-6 text-[#0a0a0a]" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs uppercase font-mono tracking-[0.2em] text-[#fae69e] font-bold">
                  AURIC AROHI PLATFORM
                </span>
              </div>
              <p className="text-xs text-[#aba79c] mt-1.5 leading-relaxed font-sans">
                Direct trade network with transparent pricing & AI agronomy.
              </p>
            </div>

            {/* Connecting Arrow 2 */}
            <div className="hidden md:flex items-center justify-center text-[#d4af37]/60">
              <ChevronRight className="w-5 h-5 animate-pulse" />
            </div>

            {/* NODE 3: CUSTOMER */}
            <div
              id="node-customer"
              className="group relative flex-1 w-full md:w-auto p-5 sm:p-6 rounded-2xl bg-[#14120d]/90 border border-[#d4af37]/35 hover:border-[#d4af37] transition-all duration-300 shadow-[0_0_20px_-8px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_-5px_rgba(212,175,55,0.35)] flex flex-col items-center text-center"
            >
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[#2a2412] to-[#12100a] border border-[#d4af37]/40 flex items-center justify-center mb-3 shadow-[0_0_15px_-3px_rgba(212,175,55,0.3)] group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-6 h-6 text-[#fae69e]" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs uppercase font-mono tracking-[0.2em] text-[#d4af37] font-bold">
                  {t('nav.roleCustomer', 'CUSTOMER')}
                </span>
              </div>
              <p className="text-xs text-[#aba79c] mt-1.5 leading-relaxed font-sans">
                Receives fresh farm harvest directly at home.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};
