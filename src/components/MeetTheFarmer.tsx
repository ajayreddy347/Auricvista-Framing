import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Bot,
  Star,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StarRating } from './StarRating';
import { FarmerProfileModal, FarmerProfileData } from './FarmerProfileModal';
import { useReviews } from '../context/ReviewsContext';
import { useProduce } from '../context/ProduceContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

/* NOTE: In the next development phase, all local/mock states (listings, reviews, auth) 
   should be replaced with real backend/database calls (e.g., Firebase Firestore, Cloud SQL, or custom API). */

export const MeetTheFarmer: React.FC = () => {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [selectedFarmer, setSelectedFarmer] = useState<FarmerProfileData | null>(null);
  const [modalTab, setModalTab] = useState<'reviews' | 'harvests' | 'about'>('reviews');
  const { getFarmerStats } = useReviews();
  const { listings } = useProduce();

  const farmers: FarmerProfileData[] = [
    {
      id: 'ravi-kumar',
      name: 'Ravi Kumar',
      role: 'Farmer',
      location: 'Chikkaballapur',
      experience: '18 years',
      specialty: 'Organic Vine Tomatoes & Bell Peppers',
      acreage: '14 Acres Certified Natural',
      initials: 'RK',
      highlightBadge: 'Master Grower',
    },
    {
      id: 'lakshmi-devi',
      name: 'Lakshmi Devi',
      role: 'Farmer',
      location: 'Kolar',
      experience: '12 years',
      specialty: 'Hydroponic Greens & Exotic Melons',
      acreage: '8 Acres Precision Soil',
      initials: 'LD',
      highlightBadge: 'Zero Pesticide Pioneer',
    },
    {
      id: 'suresh-naidu',
      name: 'Suresh Naidu',
      role: 'Farmer',
      location: 'Hosur',
      experience: '22 years',
      specialty: 'Heritage Millets, Pulses & Desi Dairy',
      acreage: '26 Acres Ancestral Farm',
      initials: 'SN',
      highlightBadge: 'Heritage Cultivator',
    },
  ];

  // Motion variants
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

  const cardVariants = {
    hidden: { opacity: 0, y: 32, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <section
      id="meet-the-farmer-section"
      className={`relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-transparent border-t backdrop-blur-[2px] overflow-hidden transition-colors duration-200 ${
        isDark ? 'border-[#d4af37]/15' : 'border-[#d4af37]/25'
      }`}
    >
      {/* Ambient background gold lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[500px] rounded-full gold-ambient-secondary blur-3xl ${
          isDark ? 'opacity-35' : 'opacity-20'
        }`} />
        <div className={`absolute inset-0 bg-subtle-grid mask-gradient ${
          isDark ? 'opacity-30' : 'opacity-15'
        }`} />
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
              id="farmer-eyebrow-pill"
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border backdrop-blur-md transition-colors ${
                isDark
                  ? 'bg-[#14120c]/80 border-[#d4af37]/30 text-[#e8dfca] shadow-[0_0_15px_-5px_rgba(212,175,55,0.15)]'
                  : 'bg-[#faf6ee] border-[#d4af37]/50 text-[#8f6208] shadow-xs'
              }`}
            >
              <UserCheck className={`w-3.5 h-3.5 ${isDark ? 'text-[#d4af37]' : 'text-[#8f6208]'}`} />
              <span className={`text-[11px] font-mono font-medium tracking-[0.2em] uppercase ${
                isDark ? 'text-[#e8dfca]' : 'text-[#8f6208]'
              }`}>
                {t('farmer.eyebrow', 'Verified Producer Network')}
              </span>
            </div>
          </motion.div>

          {/* Section Heading */}
          <motion.h2
            variants={itemFadeUp}
            id="meet-farmer-heading"
            className={`font-serif text-3xl sm:text-5xl md:text-6xl font-medium tracking-[-0.02em] leading-[1.12] ${
              isDark ? 'text-[#fcfbf7]' : 'text-[#1c1917]'
            }`}
          >
            <span className="block">
              {t('farmer.heading', 'Meet the Farmer')}
            </span>
          </motion.h2>

          {/* Supporting Subtext */}
          <motion.p
            variants={itemFadeUp}
            id="meet-farmer-subtext"
            className={`mt-4 sm:mt-5 text-base sm:text-lg md:text-xl font-normal leading-relaxed font-sans ${
              isDark ? 'text-[#aba79c]' : 'text-stone-600'
            }`}
          >
            {t('farmer.subtext', 'Every product has a face, a name, and a story behind it.')}
          </motion.p>
        </motion.div>

        {/* ========================================================================= */}
        {/* 3 FARMER PROFILE CARDS GRID (3 cols Desktop, 1-2 cols Mobile/Tablet)      */}
        {/* ========================================================================= */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-16 sm:mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {farmers.map((farmer) => {
            const stats = getFarmerStats(farmer.id);

            return (
              <motion.div
                key={farmer.id}
                variants={cardVariants}
                id={`farmer-card-${farmer.id}`}
                className={`group relative p-6 sm:p-7 rounded-3xl border backdrop-blur-xl flex flex-col justify-between overflow-hidden transition-all duration-300 ${
                  isDark
                    ? 'bg-[#0e0d0b]/85 border-[#d4af37]/25 card-lift-glow shadow-[0_0_25px_-10px_rgba(212,175,55,0.12)] text-[#fcfbf7]'
                    : 'bg-white/95 border-[#d4af37]/30 shadow-md hover:shadow-xl text-[#1c1917]'
                }`}
              >
                {/* Subtle top-right ambient gold glow */}
                <div className={`absolute -top-10 -right-10 w-28 h-28 rounded-full blur-xl pointer-events-none card-ambient-glow ${
                  isDark ? 'bg-[#d4af37]/10' : 'bg-[#d4af37]/15'
                }`} />

                <div>
                  {/* Top: Avatar & Badge */}
                  <div className="flex items-center justify-between mb-5">
                    {/* Circular Avatar with Gold Ring Border */}
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-[#d4af37] via-[#fae69e] to-[#9b7617] shadow-[0_0_15px_-2px_rgba(212,175,55,0.35)] group-hover:shadow-[0_0_20px_rgba(212,175,55,0.5)] transition-all">
                        <div className={`w-full h-full rounded-full flex items-center justify-center border ${
                          isDark ? 'bg-[#171510] border-[#0e0d0b]' : 'bg-[#faf6ee] border-[#e8dfca]'
                        }`}>
                          <span className={`font-serif text-lg font-bold tracking-wider ${
                            isDark ? 'text-[#fae69e]' : 'text-[#8f6208]'
                          }`}>
                            {farmer.initials}
                          </span>
                        </div>
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border flex items-center justify-center shadow-sm ${
                        isDark ? 'bg-[#12110c] border-[#d4af37]/50 text-[#34d399]' : 'bg-white border-[#d4af37] text-[#166534]'
                      }`}>
                        <ShieldCheck className="w-3 h-3" />
                      </div>
                    </div>

                    {/* Micro Tag */}
                    <span className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                      isDark ? 'bg-[#171510] border-[#d4af37]/20 text-[#c9a227]' : 'bg-[#faf6ee] border-[#d4af37]/40 text-[#8f6208]'
                    }`}>
                      {farmer.highlightBadge}
                    </span>
                  </div>

                  {/* Farmer Name */}
                  <h3 className={`font-serif text-2xl sm:text-3xl font-semibold tracking-wide mb-1 transition-colors ${
                    isDark ? 'text-[#f5f3eb] group-hover:text-[#fae69e]' : 'text-[#1c1917] group-hover:text-[#8f6208]'
                  }`}>
                    {farmer.name}
                  </h3>

                  {/* Role / Location Line */}
                  <div className={`flex items-center gap-1.5 text-xs font-sans mb-3 ${
                    isDark ? 'text-[#aba79c]' : 'text-stone-600'
                  }`}>
                    <MapPin className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-[#d4af37]' : 'text-[#8f6208]'}`} />
                    <span>
                      {farmer.role} • <strong className={isDark ? 'text-[#dcd7c9] font-medium' : 'text-[#1c1917] font-semibold'}>{farmer.location}</strong>
                    </span>
                  </div>

                  {/* Dual Metrics: AI Quality & Customer Star Rating */}
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-mono ${
                      isDark
                        ? 'bg-[#18140c] border-[#d4af37]/45 text-[#fae69e] shadow-[0_0_10px_rgba(212,175,55,0.15)]'
                        : 'bg-[#faf6ee] border-[#d4af37]/40 text-[#8f6208] shadow-xs'
                    }`}>
                      <Bot className={`w-3.5 h-3.5 ${isDark ? 'text-[#d4af37]' : 'text-[#8f6208]'}`} />
                      <span>AI Quality: <strong>9.7/10</strong></span>
                    </div>

                    <button
                      type="button"
                      id={`farmer-reviews-badge-${farmer.id}`}
                      onClick={() => {
                        setSelectedFarmer(farmer);
                        setModalTab('reviews');
                      }}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                        isDark
                          ? 'bg-[#d4af37]/10 border-[#d4af37]/30 hover:bg-[#d4af37]/20 text-[#f5f3eb]'
                          : 'bg-[#faf6ee] border-[#d4af37]/40 hover:border-[#d4af37] text-[#8f6208] shadow-xs'
                      }`}
                      title="View Customer Reviews"
                    >
                      <StarRating
                        rating={stats.average}
                        size="xs"
                        showNumeric={true}
                        reviewCount={stats.totalCount}
                      />
                    </button>
                  </div>

                  {/* Experience Line */}
                  <div className={`flex items-center gap-1.5 text-xs font-sans mb-5 ${
                    isDark ? 'text-[#8e8b82]' : 'text-stone-500'
                  }`}>
                    <Clock className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-[#a19e95]' : 'text-stone-400'}`} />
                    <span>
                      {t('farmer.farmingFor', 'Farming for')}{' '}
                      <strong className={isDark ? 'text-[#e8dfca] font-medium' : 'text-stone-700 font-semibold'}>
                        {farmer.experience}
                      </strong>
                    </span>
                  </div>
                </div>

                {/* Bottom Action Buttons: View Farms & Reviews */}
                <div className={`pt-4 border-t flex items-center gap-2.5 ${
                  isDark ? 'border-[#d4af37]/15' : 'border-stone-200'
                }`}>
                  <button
                    id={`view-farm-btn-${farmer.id}`}
                    type="button"
                    onClick={() => {
                      setSelectedFarmer(farmer);
                      setModalTab('harvests');
                    }}
                    className={`flex-1 group/btn inline-flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl text-xs font-serif font-bold uppercase tracking-[0.1em] border transition-all duration-300 cursor-pointer shadow-xs ${
                      isDark
                        ? 'text-[#f5f3eb] bg-[#14120c]/70 hover:bg-[#d4af37]/20 border-[#d4af37]/40 hover:border-[#d4af37] shadow-[0_0_15px_-5px_rgba(212,175,55,0.15)]'
                        : 'text-[#8f6208] bg-[#faf6ee] hover:bg-[#d4af37] hover:text-white border-[#d4af37]/50'
                    }`}
                  >
                    <span>{t('farmer.viewFarmReviews', 'View Farms')}</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>

                  <button
                    id={`view-reviews-btn-${farmer.id}`}
                    type="button"
                    onClick={() => {
                      setSelectedFarmer(farmer);
                      setModalTab('reviews');
                    }}
                    className={`inline-flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl text-xs font-serif font-bold uppercase tracking-[0.1em] border transition-all duration-300 cursor-pointer shadow-xs ${
                      isDark
                        ? 'text-[#fae69e] bg-[#18140c] hover:bg-[#d4af37]/25 border-[#d4af37]/40 hover:border-[#d4af37]'
                        : 'text-[#8f6208] bg-white hover:bg-[#faf6ee] border-[#d4af37]/50 hover:border-[#d4af37]'
                    }`}
                  >
                    <Star className="w-3.5 h-3.5 fill-[#d4af37] text-[#d4af37]" />
                    <span>Reviews</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ========================================================================= */}
        {/* DESCRIPTIVE SUMMARY PARAGRAPH                                            */}
        {/* ========================================================================= */}
        <motion.div
          variants={itemFadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-14 sm:mt-16 text-center max-w-3xl mx-auto"
        >
          <p
            id="meet-farmer-trust-paragraph"
            className={`text-xs sm:text-sm leading-relaxed font-sans px-4 ${
              isDark ? 'text-[#9b978d]' : 'text-stone-600 font-medium'
            }`}
          >
            Every farmer profile includes their farm location, farming practices,
            available produce, and reviews from real customers — building trust
            between the people who grow your food and the people who eat it.
          </p>

          {/* Centered Secondary Button */}
          <div className="mt-8 flex justify-center">
            <button
              id="explore-all-farmers-btn"
              type="button"
              onClick={() => navigate('/farmers')}
              className={`group relative inline-flex items-center justify-center gap-3 px-9 py-4 rounded-full font-medium text-xs sm:text-sm uppercase tracking-[0.14em] border backdrop-blur-md transition-all duration-300 cursor-pointer ${
                isDark
                  ? 'text-[#f5f3eb] bg-[#12110c]/85 hover:bg-[#d4af37]/15 border-[#d4af37]/45 hover:border-[#d4af37] shadow-[0_0_20px_-8px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_-5px_rgba(212,175,55,0.4)] hover:scale-[1.02] active:scale-[0.99]'
                  : 'text-[#1c1917] hover:text-[#8f6208] bg-white hover:bg-[#faf8f5] border-[#d4af37] hover:border-[#b89120] shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.99]'
              }`}
            >
              <span>{t('farmer.exploreAllDossiers', 'EXPLORE ALL FARMERS & DOSSIERS')}</span>
              <ArrowRight className={`w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 ${
                isDark ? 'text-[#d4af37]' : 'text-[#8f6208]'
              }`} />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Comprehensive Farmer Profile & Reviews Modal */}
      <AnimatePresence>
        {selectedFarmer && (
          <FarmerProfileModal
            farmer={selectedFarmer}
            initialTab={modalTab}
            onClose={() => setSelectedFarmer(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

