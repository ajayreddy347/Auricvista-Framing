import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Bot,
  Star,
  Search,
  Sparkles,
  Tractor,
  Users,
  Filter,
  X,
} from 'lucide-react';
import {
  VERIFIED_FARMERS_DIRECTORY,
  VerifiedFarmerConfig,
} from '../utils/farmerLocalization';
import { FarmerProfileModal } from '../components/FarmerProfileModal';
import { useReviews } from '../context/ReviewsContext';
import { useProduce } from '../context/ProduceContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Footer } from '../components/Footer';

const REGION_LIST = [
  'All Regions',
  'Karnataka',
  'Maharashtra',
  'Tamil Nadu',
  'Punjab',
  'Gujarat',
  'Kerala',
  'Rajasthan',
  'Andhra',
  'Himachal',
  'Kashmir',
  'Bengal',
];

export const FarmersPage: React.FC = () => {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const { getFarmerStats } = useReviews();
  const { listings } = useProduce();

  const [selectedFarmer, setSelectedFarmer] = useState<VerifiedFarmerConfig | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [showAllFarmers, setShowAllFarmers] = useState(false);

  // Filter farmers by region and search query
  const filteredFarmers = useMemo(() => {
    return VERIFIED_FARMERS_DIRECTORY.filter((farmer) => {
      // Region filter
      if (selectedRegion !== 'All Regions') {
        const farmerLoc = farmer.location.toLowerCase();
        const regionLower = selectedRegion.toLowerCase();
        const match =
          farmerLoc.includes(regionLower) ||
          (selectedRegion === 'Andhra' && farmerLoc.includes('andhra')) ||
          (selectedRegion === 'Himachal' && farmerLoc.includes('himachal')) ||
          (selectedRegion === 'Kashmir' && (farmerLoc.includes('kashmir') || farmerLoc.includes('jammu'))) ||
          (selectedRegion === 'Bengal' && (farmerLoc.includes('bengal') || farmerLoc.includes('burdwan')));
        if (!match) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = farmer.name.toLowerCase().includes(q);
        const locMatch = farmer.location.toLowerCase().includes(q);
        const specMatch = farmer.specialty.toLowerCase().includes(q);
        const idMatch = (farmer.farmerId || '').toLowerCase().includes(q);
        if (!nameMatch && !locMatch && !specMatch && !idMatch) return false;
      }

      return true;
    });
  }, [selectedRegion, searchQuery]);

  // Show only 6 farmers initially unless expanded
  const displayedFarmers = useMemo(() => {
    if (showAllFarmers) return filteredFarmers;
    return filteredFarmers.slice(0, 6);
  }, [filteredFarmers, showAllFarmers]);


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`min-h-screen transition-colors duration-300 flex flex-col ${
        isDark ? 'bg-transparent text-[#fcfbf7]' : 'bg-[#faf8f5] text-[#1c1917]'
      }`}
    >
      {/* ========================================================================= */}
      {/* 1. DIRECTORY HERO HEADER                                                 */}
      {/* ========================================================================= */}
      <section className={`pt-8 pb-10 px-4 sm:px-6 lg:px-8 border-b transition-colors ${
        isDark ? 'border-[#d4af37]/20 bg-[#0c0b08]/80 backdrop-blur-md' : 'border-stone-200 bg-white shadow-xs'
      }`}>
        <div className="max-w-7xl mx-auto w-full">
          {/* Eyebrow Pill */}
          <div className="flex items-center gap-2 mb-3.5">
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono font-bold tracking-widest uppercase ${
              isDark ? 'bg-[#1e1a12] border-[#d4af37]/40 text-[#fae69e]' : 'bg-[#faf6ee] border-[#d4af37]/50 text-[#8f6208]'
            }`}>
              <Users className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>National Producer Network</span>
              <span className="text-[10px] opacity-75">• 14 of 14 Certified Producers</span>
            </div>
          </div>

          <h1 className={`font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3 ${
            isDark ? 'text-[#fcfbf7]' : 'text-[#1c1917]'
          }`}>
            Verified Farmers & Producers Directory
          </h1>

          <p className={`text-sm sm:text-base font-sans max-w-3xl leading-relaxed ${
            isDark ? 'text-[#aba79c]' : 'text-stone-600'
          }`}>
            Browse authentic growers across India. Select any farmer to view their full credentials, certifications, farm practices, available harvests, and authentic customer reviews.
          </p>

          {/* Search Bar & Region Navigation */}
          <div className="mt-8 space-y-4">
            {/* Search Input */}
            <div className="relative max-w-xl">
              <Search className={`w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 ${
                isDark ? 'text-[#a89244]' : 'text-stone-400'
              }`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by farmer name, crop, specialty, or location..."
                className={`w-full pl-11 pr-10 py-3 rounded-2xl text-xs sm:text-sm font-sans border transition-all focus:outline-hidden ${
                  isDark
                    ? 'bg-[#14120e] border-[#d4af37]/35 text-[#fcfbf7] placeholder-[#7d796f] focus:border-[#fae69e]'
                    : 'bg-[#faf8f5] border-stone-300 text-[#1c1917] placeholder-stone-400 focus:border-[#d4af37] focus:bg-white'
                }`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Region Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
              <span className={`text-xs font-mono shrink-0 mr-1 flex items-center gap-1 ${
                isDark ? 'text-[#8e8b82]' : 'text-stone-500'
              }`}>
                <Filter className="w-3 h-3" />
                Regions:
              </span>
              {REGION_LIST.map((region) => {
                const isActive = selectedRegion === region;
                return (
                  <button
                    key={region}
                    type="button"
                    onClick={() => setSelectedRegion(region)}
                    className={`px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-[#d4af37] to-[#b89120] text-stone-900 font-bold shadow-xs'
                        : isDark
                        ? 'bg-[#14120e] border border-[#d4af37]/25 text-[#aba79c] hover:text-[#fcfbf7] hover:border-[#fae69e]'
                        : 'bg-white border border-stone-200 text-stone-600 hover:text-[#1c1917] hover:border-[#d4af37]'
                    }`}
                  >
                    {region}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. FARMERS GRID (3 COLUMNS DESKTOP, FULL RESPONSIVE)                     */}
      {/* ========================================================================= */}
      <section className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          {filteredFarmers.length === 0 ? (
            <div className={`p-12 text-center rounded-3xl border ${
              isDark ? 'bg-[#14120e] border-[#d4af37]/20 text-[#aba79c]' : 'bg-white border-stone-200 text-stone-600'
            }`}>
              <Tractor className="w-10 h-10 mx-auto mb-3 text-[#d4af37]/50" />
              <h3 className="font-serif text-lg font-bold">No growers found</h3>
              <p className="text-xs mt-1">Try clearing your search query or selecting "All Regions".</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedRegion('All Regions');
                }}
                className="mt-4 px-5 py-2 rounded-xl bg-[#d4af37] text-stone-900 font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedFarmers.map((farmer) => {
                  const stats = getFarmerStats(farmer.id);
                  const farmerProduce = listings.filter(
                    (item) =>
                      item.status === 'Active' &&
                      (item.farmerName.toLowerCase().includes(farmer.name.toLowerCase()) ||
                        farmer.name.toLowerCase().includes(item.farmerName.toLowerCase()))
                  );
                  const listingsWithAi = farmerProduce.filter(
                    (item) => item.aiQualityRating && typeof item.aiQualityRating.qualityScore === 'number'
                  );
                  const avgAiQuality =
                    listingsWithAi.length > 0
                      ? (
                          listingsWithAi.reduce(
                            (sum, item) => sum + (item.aiQualityRating!.qualityScore || 0),
                            0
                          ) / listingsWithAi.length
                        ).toFixed(1)
                      : '9.7';

                  return (
                    <motion.div
                      key={farmer.id}
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                      className={`rounded-3xl border p-6 flex flex-col justify-between transition-all duration-300 shadow-xs ${
                        isDark
                          ? 'bg-[#14120e]/90 border-[#d4af37]/25 hover:border-[#fae69e]/70 hover:shadow-[0_0_25px_rgba(212,175,55,0.18)]'
                          : 'bg-white border-stone-200 hover:border-[#d4af37] hover:shadow-xl hover:shadow-stone-200/50'
                      }`}
                    >
                      <div>
                        {/* Card Header: Avatar, Name, ID & Badges */}
                        <div className="flex items-start gap-4 mb-4">
                          <div className="relative shrink-0">
                            <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-[#d4af37] via-[#fae69e] to-[#9b7617]">
                              <div className={`w-full h-full rounded-full flex items-center justify-center font-serif text-lg font-bold ${
                                isDark ? 'bg-[#181510] text-[#fae69e]' : 'bg-[#faf6ee] text-[#8f6208]'
                              }`}>
                                {farmer.initials}
                              </div>
                            </div>
                            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border flex items-center justify-center ${
                              isDark ? 'bg-[#100e0b] border-[#d4af37] text-[#34d399]' : 'bg-white border-[#d4af37] text-[#166534]'
                            }`}>
                              <ShieldCheck className="w-3.5 h-3.5" />
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap mb-1">
                              {farmer.farmerId && (
                                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${
                                  isDark ? 'bg-[#221a0e] text-[#fae69e] border-[#d4af37]/50' : 'bg-[#faf6ee] text-[#8f6208] border-[#d4af37]/50'
                                }`}>
                                  {farmer.farmerId}
                                </span>
                              )}
                              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                                isDark ? 'bg-[#1a1610] text-[#fae69e] border-[#d4af37]/30' : 'bg-[#faf7f0] text-[#8f6208] border-stone-200'
                              }`}>
                                {farmer.highlightBadge}
                              </span>
                            </div>

                            <h3 className={`font-serif text-xl font-bold tracking-tight truncate ${
                              isDark ? 'text-[#fcfbf7]' : 'text-[#1c1917]'
                            }`}>
                              {farmer.name}
                            </h3>

                            <p className={`text-xs flex items-center gap-1 mt-1 font-sans ${
                              isDark ? 'text-[#aba79c]' : 'text-stone-600'
                            }`}>
                              <MapPin className="w-3 h-3 text-[#d4af37] shrink-0" />
                              <span className="truncate">{farmer.location}</span>
                            </p>
                          </div>
                        </div>

                        {/* Primary Cultivation & Acreage */}
                        <div className={`p-3.5 rounded-2xl border text-xs space-y-1.5 mb-4 ${
                          isDark ? 'bg-[#0f0e0c] border-[#d4af37]/15' : 'bg-[#faf8f5] border-stone-100'
                        }`}>
                          <div className="flex items-center justify-between">
                            <span className={isDark ? 'text-[#8e8b82]' : 'text-stone-500'}>Specialty Cultivation:</span>
                            <span className={`font-medium truncate max-w-[170px] ${
                              isDark ? 'text-[#fae69e]' : 'text-[#78590c]'
                            }`}>{farmer.specialty}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className={isDark ? 'text-[#8e8b82]' : 'text-stone-500'}>Farm Scale:</span>
                            <span className={isDark ? 'text-[#fcfbf7]' : 'text-[#1c1917]'}>{farmer.acreage}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className={isDark ? 'text-[#8e8b82]' : 'text-stone-500'}>Experience:</span>
                            <span className={`font-mono flex items-center gap-1 ${
                              isDark ? 'text-[#aba79c]' : 'text-stone-600'
                            }`}>
                              <Clock className="w-3 h-3 text-[#d4af37]" />
                              {farmer.experience}
                            </span>
                          </div>
                        </div>

                        {/* AI Quality & Customer Reviews Metrics */}
                        <div className="flex items-center justify-between gap-2 mb-4 pt-1">
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-mono ${
                            isDark ? 'bg-[#18140c] border-[#d4af37]/35 text-[#fae69e]' : 'bg-white border-[#d4af37]/40 text-[#8f6208] shadow-xs'
                          }`}>
                            <Bot className="w-3 h-3 text-[#d4af37]" />
                            <span>AI: <strong>{avgAiQuality}/10</strong></span>
                          </div>

                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-mono ${
                            isDark ? 'bg-[#18140c] border-[#d4af37]/25 text-[#fae69e]' : 'bg-white border-stone-200 text-[#8f6208] shadow-xs'
                          }`}>
                            <Star className="w-3 h-3 fill-[#d4af37] text-[#d4af37]" />
                            <span><strong>{stats.average.toFixed(1)}</strong> ({stats.totalCount})</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Button: View Farm Dossier & Reviews */}
                      <button
                        type="button"
                        onClick={() => setSelectedFarmer(farmer)}
                        className={`w-full py-3 px-4 rounded-2xl text-xs font-serif font-bold uppercase tracking-[0.14em] border transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                          isDark
                            ? 'bg-[#18140c] border-[#d4af37]/50 text-[#fae69e] hover:bg-[#d4af37] hover:text-[#0a0a0a]'
                            : 'bg-[#faf6ee] border-[#d4af37]/60 text-[#8f6208] hover:bg-[#d4af37] hover:text-white'
                        }`}
                      >
                        <span>View Dossier & Reviews</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  );
                })}
              </div>

              {/* View More Farmers / Show Less Button */}
              {filteredFarmers.length > 6 && (
                <div className="mt-10 flex justify-center">
                  <button
                    type="button"
                    id="toggle-more-farmers-btn"
                    onClick={() => setShowAllFarmers((prev) => !prev)}
                    className={`px-8 py-3.5 rounded-full text-xs font-serif font-bold uppercase tracking-widest border transition-all duration-300 cursor-pointer shadow-xs ${
                      isDark
                        ? 'bg-[#18140c] border-[#d4af37]/60 text-[#fae69e] hover:bg-[#d4af37] hover:text-[#0a0a0a]'
                        : 'bg-white border-[#d4af37] text-[#8f6208] hover:bg-[#faf6ee] shadow-sm hover:border-[#b89120]'
                    }`}
                  >
                    {showAllFarmers ? 'Show Less' : 'View More Farmers'}
                  </button>
                </div>
              )}
            </>

          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. MODAL FOR SELECTED FARMER (REVIEWS / DOSSIER / HARVESTS)               */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedFarmer && (
          <FarmerProfileModal
            farmer={selectedFarmer}
            onClose={() => setSelectedFarmer(null)}
          />
        )}
      </AnimatePresence>

      <Footer />
    </motion.div>
  );
};
