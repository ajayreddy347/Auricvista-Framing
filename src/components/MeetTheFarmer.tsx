import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Bot,
} from 'lucide-react';
import { StarRating } from './StarRating';
import { FarmerProfileModal, FarmerProfileData } from './FarmerProfileModal';
import { useReviews } from '../context/ReviewsContext';
import { useProduce } from '../context/ProduceContext';

/* NOTE: In the next development phase, all local/mock states (listings, reviews, auth) 
   should be replaced with real backend/database calls (e.g., Firebase Firestore, Cloud SQL, or custom API). */

export const MeetTheFarmer: React.FC = () => {
  const [selectedFarmer, setSelectedFarmer] = useState<FarmerProfileData | null>(null);
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
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#070707] border-t border-[#d4af37]/15 overflow-hidden"
    >
      {/* Ambient background gold lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[500px] rounded-full gold-ambient-secondary blur-3xl opacity-35" />
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
              id="farmer-eyebrow-pill"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14120c]/80 border border-[#d4af37]/30 backdrop-blur-md shadow-[0_0_15px_-5px_rgba(212,175,55,0.15)]"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="text-[11px] font-mono font-medium tracking-[0.2em] text-[#e8dfca] uppercase">
                Verified Producer Network
              </span>
            </div>
          </motion.div>

          {/* Section Heading */}
          <motion.h2
            variants={itemFadeUp}
            id="meet-farmer-heading"
            className="font-serif text-3xl sm:text-5xl md:text-6xl font-medium tracking-[-0.02em] leading-[1.12] text-[#fcfbf7]"
          >
            <span className="block text-[#fcfbf7]">
              Meet the Farmer
            </span>
          </motion.h2>

          {/* Supporting Subtext */}
          <motion.p
            variants={itemFadeUp}
            id="meet-farmer-subtext"
            className="mt-4 sm:mt-5 text-base sm:text-lg md:text-xl text-[#aba79c] font-normal leading-relaxed font-sans"
          >
            Every product has a face, a name, and a story behind it.
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
                className="group relative p-7 sm:p-8 rounded-3xl bg-[#0e0d0b]/85 border border-[#d4af37]/25 backdrop-blur-xl card-lift-glow shadow-[0_0_25px_-10px_rgba(212,175,55,0.12)] flex flex-col justify-between overflow-hidden"
              >
                {/* Subtle top-right ambient gold glow */}
                <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-[#d4af37]/10 blur-xl pointer-events-none card-ambient-glow" />

                <div>
                  {/* Top: Avatar & Badge */}
                  <div className="flex items-center justify-between mb-6">
                    {/* Circular Avatar with Gold Ring Border */}
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-[#d4af37] via-[#fae69e] to-[#9b7617] shadow-[0_0_15px_-2px_rgba(212,175,55,0.35)] group-hover:shadow-[0_0_20px_rgba(212,175,55,0.5)] transition-all">
                        <div className="w-full h-full rounded-full bg-[#171510] flex items-center justify-center border border-[#0e0d0b]">
                          <span className="font-serif text-lg font-bold text-[#fae69e] tracking-wider">
                            {farmer.initials}
                          </span>
                        </div>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#12110c] border border-[#d4af37]/50 flex items-center justify-center text-[#34d399] shadow-sm">
                        <ShieldCheck className="w-3 h-3" />
                      </div>
                    </div>

                    {/* Micro Tag */}
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#171510] border border-[#d4af37]/20 text-[#c9a227]">
                      {farmer.highlightBadge}
                    </span>
                  </div>

                  {/* Farmer Name (Bold, Ivory) */}
                  <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#f5f3eb] tracking-wide mb-1 group-hover:text-[#fae69e] transition-colors">
                    {farmer.name}
                  </h3>

                  {/* Role / Location Line */}
                  <div className="flex items-center gap-1.5 text-xs text-[#aba79c] font-sans mb-3">
                    <MapPin className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                    <span>
                      {farmer.role} • <strong className="text-[#dcd7c9] font-medium">{farmer.location}</strong>
                    </span>
                  </div>

                  {/* Dual Metrics: AI Quality & Customer Star Rating */}
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#18140c] border border-[#d4af37]/45 text-[11px] font-mono text-[#fae69e] shadow-[0_0_10px_rgba(212,175,55,0.15)]">
                      <Bot className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>AI Quality: <strong>9.7/10</strong></span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30">
                      <StarRating
                        rating={stats.average}
                        size="xs"
                        showNumeric={true}
                        reviewCount={stats.totalCount}
                      />
                    </div>
                  </div>

                  {/* Experience Line */}
                  <div className="flex items-center gap-1.5 text-xs text-[#8e8b82] font-sans mb-6">
                    <Clock className="w-3.5 h-3.5 text-[#a19e95] shrink-0" />
                    <span>Farming for <strong className="text-[#e8dfca] font-medium">{farmer.experience}</strong></span>
                  </div>
                </div>

                {/* Bottom Gold Outlined Button */}
                <div className="pt-4 border-t border-[#d4af37]/15">
                  <button
                    id={`view-farm-btn-${farmer.id}`}
                    onClick={() => setSelectedFarmer(farmer)}
                    className="w-full group/btn inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs font-medium uppercase tracking-[0.14em] text-[#f5f3eb] bg-[#14120c]/70 hover:bg-[#d4af37]/15 border border-[#d4af37]/40 hover:border-[#d4af37] transition-all duration-300 shadow-[0_0_15px_-5px_rgba(212,175,55,0.15)] hover:shadow-[0_0_20px_-3px_rgba(212,175,55,0.3)] cursor-pointer"
                  >
                    <span>View Farm & Reviews</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#d4af37] group-hover/btn:translate-x-1 transition-transform" />
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
            className="text-xs sm:text-sm text-[#9b978d] leading-relaxed font-sans px-4"
          >
            Every farmer profile includes their farm location, farming practices,
            available produce, and reviews from real customers — building trust
            between the people who grow your food and the people who eat it.
          </p>

          {/* Centered Secondary Button */}
          <div className="mt-8 flex justify-center">
            <button
              id="explore-all-farmers-btn"
              onClick={() => setSelectedFarmer(farmers[0])}
              className="group relative inline-flex items-center justify-center gap-3 px-9 py-4 rounded-full font-medium text-xs sm:text-sm uppercase tracking-[0.14em] text-[#f5f3eb] bg-[#12110c]/85 hover:bg-[#d4af37]/15 border border-[#d4af37]/45 hover:border-[#d4af37] backdrop-blur-md shadow-[0_0_20px_-8px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_-5px_rgba(212,175,55,0.4)] hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 cursor-pointer"
            >
              <span>EXPLORE ALL FARMERS & DOSSIERS</span>
              <ArrowRight className="w-4 h-4 text-[#d4af37] group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Comprehensive Farmer Profile & Reviews Modal */}
      <AnimatePresence>
        {selectedFarmer && (
          <FarmerProfileModal
            farmer={selectedFarmer}
            onClose={() => setSelectedFarmer(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};
