import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShoppingCart,
  ShieldCheck,
  Wheat,
  Clock,
  Tractor,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { SmartCartBuilderModal } from './SmartCartBuilderModal';

export const Hero: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const [isSmartCartOpen, setIsSmartCartOpen] = useState(false);

  const handleViewFarms = () => {
    navigate('/farmers');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.05,
      },
    },
  };

  const itemFadeUp = {
    hidden: { opacity: 0, y: 20 },
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
      id="hero-section"
      className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center overflow-hidden py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-transparent"
    >
      {/* Subtle atmospheric ambient glow for crisp text contrast */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
        {isDark ? (
          <>
            {/* Soft center ambient radial aura */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(10,9,7,0.5)_0%,rgba(10,9,7,0.2)_50%,transparent_80%)]" />
            {/* Sunrise amber atmospheric warm glow */}
            <div className="absolute top-1/6 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[radial-gradient(circle,rgba(245,158,11,0.15)_0%,rgba(212,175,55,0.05)_50%,transparent_80%)] blur-3xl pointer-events-none" />
          </>
        ) : (
          <>
            {/* Soft morning sun aura */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,241,232,0.8)_0%,rgba(249,247,242,0.4)_50%,transparent_80%)]" />
            {/* Warm morning sunburst */}
            <div className="absolute top-1/6 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[radial-gradient(circle,rgba(212,175,55,0.14)_0%,rgba(245,158,11,0.04)_50%,transparent_80%)] blur-3xl pointer-events-none" />
          </>
        )}
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl mx-auto w-full flex flex-col items-center text-center"
      >
        {/* Eyebrow Pill */}
        <motion.div variants={itemFadeUp} className="mb-4 sm:mb-5">
          <div
            id="hero-eyebrow-pill"
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border backdrop-blur-md transition-all ${
              isDark
                ? 'bg-[#14120c]/85 border-[#d4af37]/45 shadow-[0_0_20px_-3px_rgba(212,175,55,0.3)]'
                : 'bg-[#faf8f5] border-[#d4af37]/60 shadow-xs'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${isDark ? 'text-[#d4af37]' : 'text-[#8f6208]'}`} />
            <span
              className={`text-[11px] sm:text-xs font-mono font-bold tracking-[0.2em] uppercase ${
                isDark ? 'text-[#fae69e]' : 'text-[#8f6208]'
              }`}
            >
              {t('hero.badge', 'Direct Farm-to-Consumer Platform across India')}
            </span>
          </div>
        </motion.div>

        {/* Main Headline — Crisp & Clean without black shadows in Light Mode */}
        <motion.h1
          variants={itemFadeUp}
          id="hero-main-heading"
          className={`font-serif text-3xl sm:text-5xl md:text-6xl lg:text-[4.2rem] font-bold tracking-tight leading-[1.12] max-w-3xl mx-auto ${
            isDark ? 'text-[#fcfbf7]' : 'text-[#1c1917]'
          }`}
        >
          <span
            className={`block ${
              isDark
                ? 'text-[#fcfbf7] drop-shadow-[0_3px_15px_rgba(0,0,0,0.95)]'
                : 'text-[#1c1917]'
            }`}
          >
            Fresh Indian Harvests.
          </span>
          <span
            className={`block bg-clip-text text-transparent font-extrabold mt-1 sm:mt-2 ${
              isDark
                ? 'bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#e6ca65] drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]'
                : 'bg-gradient-to-r from-[#8f6208] via-[#b8860b] to-[#78590c]'
            }`}
          >
            Direct From Farmers.
          </span>
        </motion.h1>

        {/* Concise Supporting Copy — Clean dark charcoal without shadow in Light Mode */}
        <motion.p
          variants={itemFadeUp}
          id="hero-subtext"
          className={`mt-4 sm:mt-5 text-sm sm:text-base md:text-lg font-normal leading-relaxed max-w-2xl mx-auto font-sans ${
            isDark
              ? 'text-[#e0dcce] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]'
              : 'text-[#44403c]'
          }`}
        >
          {t(
            'hero.subtitle',
            'Connect directly with hardworking farmers across India. Seasonal fruits, crisp vegetables, pulses, and organic spices harvested at dawn with zero middlemen.'
          )}
        </motion.p>

        {/* Action CTAs */}
        <motion.div
          variants={itemFadeUp}
          id="hero-cta-group"
          className="mt-7 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto"
        >
          {/* Primary CTA: Explore Fresh Produce */}
          <button
            id="primary-explore-produce-btn"
            type="button"
            onClick={() => navigate('/marketplace')}
            className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full font-serif font-bold text-xs sm:text-sm uppercase tracking-[0.14em] text-[#0a0a0a] bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#b89120] shadow-[0_0_30px_rgba(212,175,55,0.45)] hover:brightness-110 hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 cursor-pointer overflow-hidden"
          >
            <span>{t('hero.exploreBtn', 'Explore Fresh Produce')}</span>
            <ArrowRight className="w-4 h-4 text-[#0a0a0a] group-hover:translate-x-1 transition-transform" />
          </button>

          {/* View Farms CTA */}
          <button
            id="hero-view-farms-btn"
            type="button"
            onClick={handleViewFarms}
            className={`group relative w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full font-serif font-bold text-xs sm:text-sm uppercase tracking-[0.14em] border-2 transition-all duration-300 cursor-pointer ${
              isDark
                ? 'text-[#fae69e] bg-[#14120c]/90 hover:bg-[#221c10] border-[#d4af37]/50 hover:border-[#fae69e] backdrop-blur-md shadow-lg hover:scale-[1.02] active:scale-[0.99]'
                : 'text-[#8f6208] bg-white hover:bg-[#faf7f0] border-[#d4af37] hover:border-[#b89120] shadow-sm hover:scale-[1.02] active:scale-[0.99]'
            }`}
          >
            <Tractor className={`w-4 h-4 ${isDark ? 'text-[#d4af37]' : 'text-[#8f6208]'}`} />
            <span>View Farms</span>
          </button>

          {/* Secondary CTA: Build Your Smart Cart */}
          <button
            id="secondary-smart-cart-btn"
            type="button"
            onClick={() => setIsSmartCartOpen(true)}
            className={`group relative w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full font-serif font-bold text-xs sm:text-sm uppercase tracking-[0.14em] border-2 transition-all duration-300 cursor-pointer ${
              isDark
                ? 'text-[#e8dfca] bg-[#14120c]/60 hover:bg-[#221c10] border-[#d4af37]/30 hover:border-[#fae69e] backdrop-blur-md hover:scale-[1.02] active:scale-[0.99]'
                : 'text-stone-700 bg-white hover:bg-stone-50 border-stone-300 hover:border-[#d4af37] shadow-xs hover:scale-[1.02] active:scale-[0.99]'
            }`}
          >
            <ShoppingCart className={`w-4 h-4 ${isDark ? 'text-[#d4af37]' : 'text-[#8f6208]'}`} />
            <span>Build Your Smart Cart</span>
          </button>
        </motion.div>

        {/* Subtle Supporting Value Row */}
        <motion.div
          variants={itemFadeUp}
          className={`mt-10 sm:mt-12 pt-5 border-t grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-6 w-full max-w-2xl text-xs font-mono backdrop-blur-sm ${
            isDark
              ? 'border-[#d4af37]/25 text-[#dcd7c9]'
              : 'border-[#e7e4dc] text-[#57534e]'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Wheat className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#fae69e]' : 'text-[#8f6208]'}`} />
            <span>100% Direct Farm Origin</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Clock className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#fae69e]' : 'text-[#8f6208]'}`} />
            <span>Dawn Harvest Dispatch</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#34d399]' : 'text-[#059669]'}`} />
            <span>Zero Chemical Additives</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Personalized Smart Cart Routine Builder Modal */}
      <SmartCartBuilderModal
        isOpen={isSmartCartOpen}
        onClose={() => setIsSmartCartOpen(false)}
      />
    </section>
  );
};
