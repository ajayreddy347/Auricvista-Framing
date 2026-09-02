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
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section id="final-cta-section" className="relative py-28 sm:py-36 px-4 sm:px-6 lg:px-8 border-t border-[#d4af37]/20 bg-[#070707] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] rounded-full gold-ambient-radial blur-3xl opacity-35" />
        <div className="absolute inset-0 bg-subtle-grid opacity-25 mask-gradient" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto w-full text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={containerVariants}
          className="flex flex-col items-center"
        >
          {/* Eyebrow */}
          <motion.div variants={itemFadeUp} className="mb-6 inline-block">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#14120c]/90 border border-[#d4af37]/40 backdrop-blur-md shadow-[0_0_20px_-5px_rgba(212,175,55,0.25)]">
              <Sparkles className="w-3.5 h-3.5 text-[#fae69e]" />
              <span className="text-[11px] font-mono font-medium tracking-[0.2em] text-[#fae69e] uppercase">
                {t('cta.badge', 'Direct Agricultural Future')}
              </span>
            </div>
          </motion.div>

          {/* Main Two-Line Heading */}
          <motion.h2
            variants={itemFadeUp}
            id="final-heading"
            className="font-serif text-4xl sm:text-6xl md:text-7xl font-medium tracking-tight leading-[1.1] text-[#fcfbf7]"
          >
            <span>{t('cta.title1', 'Grow With Auric Arohi.')}</span>
            <span className="block gold-gradient-text mt-2">
              {t('cta.title2', 'Fresh Harvests. Direct Value.')}
            </span>
          </motion.h2>

          {/* Subtext */}
          <motion.p
            variants={itemFadeUp}
            className="mt-6 sm:mt-8 text-base sm:text-xl text-[#c4bfae] font-normal max-w-2xl mx-auto leading-relaxed font-sans"
          >
            {t(
              'cta.subtitle',
              'Whether you are an organic farmer seeking fair returns or a conscious customer looking for fresh nutrition, join India\'s direct farm movement today.'
            )}
          </motion.p>

          {/* Dual Action CTAs */}
          <motion.div
            variants={itemFadeUp}
            className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-lg mx-auto"
          >
            {/* Primary Gold CTA */}
            <Link
              to="/marketplace"
              id="start-shopping-final-btn"
              className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full font-serif font-bold text-xs sm:text-sm uppercase tracking-wider text-[#0a0a0a] bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#b89120] hover:brightness-110 shadow-[0_0_30px_rgba(212,175,55,0.4)] active:scale-[0.99] transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-[#0a0a0a]" />
              <span>{t('cta.exploreProduce', 'Explore Fresh Produce')}</span>
              <ArrowRight className="w-4 h-4 text-[#0a0a0a] group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Secondary Outlined CTA */}
            <Link
              to={isLoggedIn && userRole === 'farmer' ? '/farmer-dashboard' : '/signup?role=farmer'}
              id="become-farmer-final-btn"
              className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full font-serif font-bold text-xs sm:text-sm uppercase tracking-wider text-[#fae69e] bg-[#14120e]/90 hover:bg-[#201a0e] border-2 border-[#d4af37]/60 hover:border-[#fae69e] backdrop-blur-md shadow-md active:scale-[0.99] transition-all cursor-pointer"
            >
              <Tractor className="w-4 h-4 text-[#d4af37]" />
              <span>
                {isLoggedIn && userRole === 'farmer'
                  ? t('nav.dashboard', 'My Farm Portal')
                  : t('cta.joinFarmer', 'Join as a Farmer')}
              </span>
              <ArrowRight className="w-4 h-4 text-[#d4af37] group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
