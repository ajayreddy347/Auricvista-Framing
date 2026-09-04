import { useLanguage } from '../context/LanguageContext';
import { getLocalizedProduceName } from '../utils/produceLocalization';
import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  MapPin,
  Navigation,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Carrot,
  Apple,
  Wheat,
  Clock,
} from 'lucide-react';

export const FarmsNearYou: React.FC = () => {
  const { language, t } = useLanguage();
  const [activePin, setActivePin] = useState<number>(0);

  const pins = [
    {
      id: 0,
      x: '32%',
      y: '38%',
      name: 'Ravi Kumar',
      distance: '2.4 km away',
      location: 'Chikkaballapur Valley',
      products: ['Tomatoes', 'Bell Peppers', 'Spinach'],
      harvest: "Today's Harvest: 6:00 AM",
      badge: 'Pickup Available',
    },
    {
      id: 1,
      x: '64%',
      y: '28%',
      name: 'Lakshmi Devi',
      distance: '4.8 km away',
      location: 'Kolar Organic Belt',
      products: ['Hydroponic Greens', 'Melons'],
      harvest: "Today's Harvest: 5:30 AM",
      badge: 'Pickup Available',
    },
    {
      id: 2,
      x: '75%',
      y: '68%',
      name: 'Suresh Naidu',
      distance: '6.2 km away',
      location: 'Hosur Agro Ridge',
      products: ['Heritage Millets', 'Desi Milk'],
      harvest: "Today's Harvest: 6:30 AM",
      badge: 'Cold Dispatch Hub',
    },
    {
      id: 3,
      x: '42%',
      y: '72%',
      name: 'Anand Gowda',
      distance: '3.1 km away',
      location: 'Devanahalli Groves',
      products: ['Guavas', 'Papayas', 'Herbs'],
      harvest: "Today's Harvest: 7:00 AM",
      badge: 'Pickup Available',
    },
  ];

  const currentFarm = pins[activePin];

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
      id="farms-near-you-section"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-transparent border-t border-[#d4af37]/15 backdrop-blur-[2px] overflow-hidden"
    >
      {/* Ambient background gold glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] rounded-full gold-ambient-secondary blur-3xl opacity-35" />
        <div className="absolute inset-0 bg-subtle-grid opacity-30 mask-gradient" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full">
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
              id="farms-eyebrow-pill"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14120c]/80 border border-[#d4af37]/30 backdrop-blur-md shadow-[0_0_15px_-5px_rgba(212,175,55,0.15)]"
            >
              <Navigation className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="text-[11px] font-mono font-medium tracking-[0.2em] text-[#e8dfca] uppercase">
                {t('farms.eyebrow', 'Hyperlocal Radius')}
              </span>
            </div>
          </motion.div>

          <motion.h2
            variants={itemFadeUp}
            id="farms-near-heading"
            className="font-serif text-3xl sm:text-5xl md:text-6xl font-medium tracking-[-0.02em] leading-[1.12] text-[#fcfbf7]"
          >
            <span className="block text-[#fcfbf7]">
              {t('farms.heading', 'Freshness Starts Nearby')}
            </span>
          </motion.h2>

          <motion.p
            variants={itemFadeUp}
            id="farms-near-subtext"
            className="mt-4 sm:mt-5 text-base sm:text-lg md:text-xl text-[#aba79c] font-normal leading-relaxed font-sans"
          >
            {t('farms.subtext', 'Discover participating farms close to you.')}
          </motion.p>
        </motion.div>

        {/* ========================================================================= */}
        {/* WIDE DARK GLASS CARD WITH STYLIZED MAP & SAMPLE FARM POPUP               */}
        {/* ========================================================================= */}
        <motion.div
          variants={itemFadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-14 sm:mt-18"
        >
          <div
            id="farms-map-card"
            className="group relative p-6 sm:p-8 md:p-10 rounded-3xl bg-[#0e0d0b]/90 border-2 border-[#d4af37]/35 hover:border-[#d4af37] backdrop-blur-2xl transition-all duration-300 shadow-[0_0_50px_-15px_rgba(212,175,55,0.25)] hover:shadow-[0_0_60px_-10px_rgba(212,175,55,0.4)] overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* STYLIZED MAP CANVAS AREA (lg:col-span-7) */}
              <div className="lg:col-span-7 relative h-[300px] sm:h-[380px] rounded-2xl bg-[#11100c] border border-[#d4af37]/30 overflow-hidden shadow-inner flex items-center justify-center">
                {/* Stylized Vector Grid & Topographical Contour Lines */}
                <svg
                  className="absolute inset-0 w-full h-full opacity-35"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#d4af37" strokeWidth="0.5" strokeOpacity="0.4" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#mapGrid)" />
                  {/* Topo abstract contours */}
                  <path
                    d="M-50 150 C 100 100, 200 250, 400 180 C 600 110, 750 260, 900 150"
                    fill="none"
                    stroke="#d4af37"
                    strokeWidth="1.2"
                    strokeOpacity="0.25"
                    strokeDasharray="4 4"
                  />
                  <path
                    d="M-50 220 C 120 180, 260 320, 480 240 C 680 160, 800 320, 950 220"
                    fill="none"
                    stroke="#d4af37"
                    strokeWidth="1.2"
                    strokeOpacity="0.2"
                  />
                  {/* Center Radar Circles */}
                  <circle cx="50%" cy="50%" r="90" fill="none" stroke="#d4af37" strokeWidth="0.8" strokeOpacity="0.3" strokeDasharray="3 3" />
                  <circle cx="50%" cy="50%" r="160" fill="none" stroke="#d4af37" strokeWidth="0.8" strokeOpacity="0.15" />
                </svg>

                {/* Radar Sweep Effect */}
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)]" />

                {/* User Location Radar Center */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-[#34d399] shadow-[0_0_15px_#34d399] animate-ping opacity-60" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#34d399] border-2 border-[#0a0a0a]" />
                  <span className="mt-4 text-[9px] font-mono uppercase tracking-widest text-[#a19e95] bg-black/70 px-2 py-0.5 rounded border border-white/10">
                    You Are Here
                  </span>
                </div>

                {/* Pulsing Gold Pin Markers */}
                {pins.map((pin, idx) => {
                  const isSelected = activePin === idx;
                  return (
                    <div
                      key={pin.id}
                      onClick={() => setActivePin(idx)}
                      style={{ top: pin.y, left: pin.x }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group/pin z-20"
                    >
                      {/* Outer pulsing ring with staggered delay */}
                      <motion.div
                        animate={{
                          scale: [1, 1.8, 1],
                          opacity: [0.6, 0.1, 0.6],
                        }}
                        transition={{
                          duration: 2.4,
                          repeat: Infinity,
                          delay: idx * 0.5,
                          ease: 'easeInOut',
                        }}
                        className="absolute -inset-2 rounded-full bg-[#d4af37]/30 blur-xs"
                      />

                      {/* Pin Button */}
                      <div
                        className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isSelected
                            ? 'bg-[#fae69e] text-[#0a0a0a] scale-125 shadow-[0_0_20px_#fae69e] border-2 border-white'
                            : 'bg-[#18150d] text-[#d4af37] border border-[#d4af37]/60 hover:scale-110 hover:border-[#fae69e]'
                        }`}
                      >
                        <MapPin className="w-4 h-4 fill-current" />
                      </div>

                      {/* Micro Distance Tag */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-1.5 py-0.5 rounded bg-black/80 border border-[#d4af37]/30 text-[9px] font-mono text-[#fae69e] whitespace-nowrap opacity-0 group-hover/pin:opacity-100 transition-opacity">
                        {pin.distance}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* FARM INFO POPUP CARD SAMPLE (lg:col-span-5) */}
              <div className="lg:col-span-5 flex flex-col justify-between h-full">
                <div className="p-6 rounded-2xl bg-[#14120e] border border-[#d4af37]/30 shadow-lg">
                  {/* Top Bar: Today's Harvest Label + Pickup Badge */}
                  <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-[#d4af37]/15">
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-[#34d399] font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      {currentFarm.harvest}
                    </span>

                    <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#1c180e] border border-[#d4af37]/35 text-[#fae69e]">
                      {currentFarm.badge}
                    </span>
                  </div>

                  {/* Farmer Name & Distance */}
                  <div className="mb-4">
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-serif text-2xl font-semibold text-[#f5f3eb] tracking-wide">
                        {currentFarm.name}
                      </h3>
                      <span className="text-xs font-mono font-bold text-[#d4af37]">
                        {currentFarm.distance}
                      </span>
                    </div>
                    <p className="text-xs text-[#aba79c] flex items-center gap-1 mt-1 font-sans">
                      <MapPin className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                      <span>{currentFarm.location}</span>
                    </p>
                  </div>

                  {/* Available Produce Small Tags */}
                  <div className="mb-5">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#8e8b82] block mb-2">
                      {t('farms.manifestTitle', 'FRESH HARVEST MANIFEST:')}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentFarm.products.map((prod, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-[#1a1710] border border-[#d4af37]/25 text-xs text-[#e8dfca] font-sans"
                        >
                          {prod}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Direct Contact / Action */}
                  <button className="w-full py-3 rounded-xl bg-[#1d1911] hover:bg-[#d4af37] text-[#fae69e] hover:text-[#0a0a0a] border border-[#d4af37]/40 hover:border-[#d4af37] font-semibold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_-5px_rgba(212,175,55,0.2)]">
                    <span>Reserve From This Plot</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Centered Gold Outlined Button Below */}
          <div className="mt-10 flex justify-center">
            <button
              id="view-all-nearby-farms-btn"
              className="group relative inline-flex items-center justify-center gap-3 px-9 py-4 rounded-full font-medium text-xs sm:text-sm uppercase tracking-[0.14em] text-[#f5f3eb] bg-[#12110c]/85 hover:bg-[#d4af37]/15 border border-[#d4af37]/45 hover:border-[#d4af37] backdrop-blur-md shadow-[0_0_20px_-8px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_-5px_rgba(212,175,55,0.4)] hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 cursor-pointer"
            >
              <span>{t('farms.viewAllNearby', 'VIEW ALL NEARBY FARMS')}</span>
              <ArrowRight className="w-4 h-4 text-[#d4af37] group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
