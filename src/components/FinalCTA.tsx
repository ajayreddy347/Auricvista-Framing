import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Tractor, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const FinalCTA: React.FC = () => {
  const { isLoggedIn, userRole } = useAuth();
  const { t } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const itemFadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section
      id="final-cta-section"
      className="relative py-28 sm:py-36 px-4 sm:px-6 lg:px-8 border-t border-[#d4af37]/25 bg-transparent overflow-hidden"
    >
      {/* Subtle atmospheric warm aura */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
        {/* Center text backdrop aura */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(10,9,7,0.6)_0%,rgba(10,9,7,0.3)_50%,transparent_80%)]" />

        {/* Sunset warm glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[radial-gradient(circle,rgba(245,158,11,0.15)_0%,rgba(212,175,55,0.05)_50%,transparent_80%)] blur-3xl pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto w-full text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={containerVariants}
          className="flex flex-col items-center"
        >
          {/* Eyebrow */}
          <motion.div variants={itemFadeUp} className="mb-5 inline-block">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#18140c]/90 border border-[#d4af37]/45 backdrop-blur-md shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-[#fae69e]" />
              <span className="text-[11px] font-mono font-bold tracking-[0.2em] text-[#fae69e] uppercase">
                {t('cta.badge', 'Direct Agricultural Future')}
              </span>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.h2
            variants={itemFadeUp}
            id="final-heading"
            className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.15] text-[#fcfbf7]"
          >
            <span className="block drop-shadow-[0_3px_15px_rgba(0,0,0,0.95)]">
              {t('cta.title1', 'Grow With Auric Arohi.')}
            </span>
            <span className="block bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#e6ca65] bg-clip-text text-transparent mt-1 sm:mt-2 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
              {t('cta.title2', 'Fresh Harvests. Direct Value.')}
            </span>
          </motion.h2>

          {/* Subtext */}
          <motion.p
            variants={itemFadeUp}
            className="mt-5 text-sm sm:text-base md:text-lg text-[#e0dcce] font-normal max-w-xl mx-auto leading-relaxed font-sans drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
          >
            {t(
              'cta.subtitle',
              'Whether you are a verified grower seeking honest returns or a family looking for pure farm harvests, join India\'s direct agricultural marketplace today.'
            )}
          </motion.p>

          {/* Dual Action CTAs */}
          <motion.div
            variants={itemFadeUp}
            className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
          >
            <Link
              to="/marketplace"
              id="start-shopping-final-btn"
              className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full font-serif font-bold text-xs sm:text-sm uppercase tracking-wider text-[#0a0a0a] bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#b89120] hover:brightness-110 shadow-[0_0_30px_rgba(212,175,55,0.45)] active:scale-[0.99] transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-[#0a0a0a]" />
              <span>{t('cta.exploreProduce', 'Explore Fresh Produce')}</span>
              <ArrowRight className="w-4 h-4 text-[#0a0a0a] group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to={isLoggedIn && userRole === 'farmer' ? '/farmer-dashboard' : '/signup?role=farmer'}
              id="become-farmer-final-btn"
              className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full font-serif font-bold text-xs sm:text-sm uppercase tracking-wider text-[#fae69e] bg-[#1a160e]/90 hover:bg-[#282014] border-2 border-[#d4af37]/50 hover:border-[#fae69e] backdrop-blur-md shadow-lg active:scale-[0.99] transition-all cursor-pointer"
            >
              <Tractor className="w-4 h-4 text-[#d4af37]" />
              <span>{t('cta.joinAsFarmer', 'Join As A Farmer')}</span>
              <ArrowRight className="w-4 h-4 text-[#fae69e] group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
