import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Star,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Clock,
  Sparkles,
  Bot,
  MessageSquare,
  ThumbsUp,
  LogIn,
  AlertCircle,
  ExternalLink,
  Award,
  Layers,
  Package,
} from 'lucide-react';
import { StarRating } from './StarRating';
import { WriteReviewModal } from './WriteReviewModal';
import { useAuth } from '../context/AuthContext';
import { useReviews, CustomerReview } from '../context/ReviewsContext';
import { useProduce } from '../context/ProduceContext';
import { useTheme } from '../context/ThemeContext';
import { getProduceImage } from '../utils/produceImages';
import { Link } from 'react-router-dom';

/* NOTE: In the next development phase, all local/mock states (listings, reviews, auth) 
   should be replaced with real backend/database calls (e.g., Firebase Firestore, Cloud SQL, or custom API). */

export interface FarmerProfileData {
  id: string;
  name: string;
  role: string;
  location: string;
  experience: string;
  specialty: string;
  acreage: string;
  initials: string;
  highlightBadge: string;
  farmerId?: string;
}

interface FarmerProfileModalProps {
  farmer: FarmerProfileData | null;
  onClose: () => void;
  onSelectProduce?: (produceId: string) => void;
  initialTab?: 'reviews' | 'harvests' | 'about';
}

export const FarmerProfileModal: React.FC<FarmerProfileModalProps> = ({
  farmer,
  onClose,
  onSelectProduce,
  initialTab = 'reviews',
}) => {
  const { user, isLoggedIn, userRole } = useAuth();
  const { isDark } = useTheme();
  const { getFarmerReviews, getFarmerStats, getProductStats, toggleHelpful } = useReviews();
  const { listings } = useProduce();

  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'reviews' | 'harvests' | 'about'>(initialTab);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, farmer]);

  // Lock background page scroll while modal is open, restoring exact state on unmount
  useEffect(() => {
    if (!farmer) return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [farmer, onClose]);

  // Reset scroll to top whenever farmer or active tab changes so it is immediately visible
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [farmer, activeTab]);

  if (!farmer) return null;

  const stats = getFarmerStats(farmer.id);
  const allReviews = getFarmerReviews(farmer.id);

  // Filter reviews
  const filteredReviews = allReviews.filter((r) => {
    if (filterRating === 'all') return true;
    return Math.round(r.rating) === filterRating;
  });

  // Farmer's active produce listings
  const farmerProduce = listings.filter(
    (item) =>
      item.status === 'Active' &&
      (item.farmerName.toLowerCase().includes(farmer.name.toLowerCase()) ||
        farmer.name.toLowerCase().includes(item.farmerName.toLowerCase()))
  );

  // Calculate Average AI Quality Score across farmer's listings
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

  const canWriteReview = isLoggedIn && userRole === 'customer';

  if (typeof document === 'undefined') return null;

  return createPortal(
    <>
      {/* Centered Modal Overlay with absolute lock on background */}
      <div
        className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="farmer-modal-title"
      >
        {/* Backdrop: Genuinely light in light mode, dark in dark mode */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className={`fixed inset-0 transition-colors duration-200 ${
            isDark ? 'bg-black/85 backdrop-blur-md' : 'bg-stone-900/45 backdrop-blur-sm'
          }`}
        />

        {/* Modal Container: Properly centered in visible viewport */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as const }}
          className={`relative w-full max-w-2xl max-h-[82vh] sm:max-h-[78vh] flex flex-col rounded-2xl sm:rounded-3xl z-10 overflow-hidden shadow-2xl transition-colors duration-200 ${
            isDark
              ? 'bg-gradient-to-b from-[#16130e] via-[#0f0e0c] to-[#080706] text-[#fcfbf7] border-2 border-[#d4af37]/45 shadow-[0_0_50px_-15px_rgba(212,175,55,0.35)]'
              : 'bg-[#fcfbf7] text-[#1c1917] border-2 border-[#d4af37]/40 shadow-2xl'
          }`}
        >
          {/* Header Ambient Glow */}
          <div className={`absolute top-0 right-0 w-60 h-28 rounded-full blur-3xl pointer-events-none ${
            isDark ? 'bg-[#d4af37]/15' : 'bg-[#d4af37]/10'
          }`} />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className={`absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-2 rounded-full transition-colors cursor-pointer z-30 ${
              isDark
                ? 'text-[#aba79c] hover:text-[#fae69e] hover:bg-[#201a0e]'
                : 'text-stone-600 hover:text-[#1c1917] hover:bg-stone-200/70'
            }`}
            aria-label="Close farmer dossier"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Scrollable Content: ONLY this container scrolls */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto overscroll-contain p-3.5 sm:p-5 space-y-3.5"
          >
            {/* Top Farmer Profile Header */}
            <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-3.5 pb-3 border-b ${
              isDark ? 'border-[#d4af37]/20' : 'border-stone-200'
            }`}>
              {/* Gold Ring Avatar */}
              <div className="relative shrink-0">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full p-[2px] bg-gradient-to-tr from-[#d4af37] via-[#fae69e] to-[#9b7617] shadow-[0_0_15px_rgba(212,175,55,0.25)] shrink-0">
                  <div className={`w-full h-full rounded-full flex items-center justify-center border-2 ${
                    isDark ? 'bg-[#181510] border-[#0e0d0b]' : 'bg-[#faf6ee] border-[#e8dfca]'
                  }`}>
                    <span className={`font-serif text-base sm:text-lg font-bold ${
                      isDark ? 'text-[#fae69e]' : 'text-[#8f6208]'
                    }`}>
                      {farmer.initials}
                    </span>
                  </div>
                </div>
                <div className={`absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 rounded-full border flex items-center justify-center shadow-md ${
                  isDark ? 'bg-[#12110c] border-[#d4af37] text-[#34d399]' : 'bg-white border-[#d4af37] text-[#166534]'
                }`}>
                  <ShieldCheck className="w-3 h-3" />
                </div>
              </div>

              {/* Title & Metadata */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className={`text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.25em] font-semibold ${
                    isDark ? 'text-[#d4af37]' : 'text-[#8f6208]'
                  }`}>
                    VERIFIED DIRECT GROWER
                  </span>
                  <span className={`text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                    isDark ? 'bg-[#201a0e] text-[#fae69e] border-[#d4af37]/30' : 'bg-[#faf6ee] text-[#8f6208] border-[#d4af37]/40'
                  }`}>
                    {farmer.highlightBadge}
                  </span>
                  {farmer.farmerId && (
                    <span className={`text-[9px] sm:text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border shadow-xs flex items-center gap-1 ${
                      isDark ? 'text-[#fae69e] bg-[#241c0e] border-[#d4af37]/60' : 'text-[#8f6208] bg-[#f8f4ea] border-[#d4af37]/50'
                    }`}>
                      <span className={isDark ? 'text-[#a89244]' : 'text-stone-500'}>ID:</span> {farmer.farmerId}
                    </span>
                  )}
                </div>

                <h2 className={`font-serif text-lg sm:text-xl font-bold tracking-tight ${
                  isDark ? 'text-[#fcfbf7]' : 'text-[#1c1917]'
                }`}>
                  {farmer.name}
                </h2>

                <div className="mt-1 flex flex-wrap items-center gap-y-1 gap-x-3 text-xs">
                  <span className={`flex items-center gap-1 ${isDark ? 'text-[#dcd7c9]' : 'text-stone-700'}`}>
                    <MapPin className={`w-3.5 h-3.5 ${isDark ? 'text-[#d4af37]' : 'text-[#8f6208]'}`} />
                    {farmer.location}
                  </span>
                  <span className={`flex items-center gap-1 ${isDark ? 'text-[#aba79c]' : 'text-stone-600'}`}>
                    <Clock className={`w-3.5 h-3.5 ${isDark ? 'text-[#d4af37]' : 'text-[#8f6208]'}`} />
                    Farming for {farmer.experience}
                  </span>
                  <span className={`flex items-center gap-1 font-mono text-[11px] ${isDark ? 'text-[#34d399]' : 'text-[#166534]'}`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    100% Certified Direct
                  </span>
                </div>

                {/* Header Dual Metrics: Avg AI Quality & Customer Rating */}
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  {/* AI Quality Badge */}
                  <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] sm:text-[11px] font-mono shadow-xs ${
                    isDark
                      ? 'bg-[#1c180e] border-[#d4af37]/50 text-[#fae69e]'
                      : 'bg-white border-[#d4af37]/40 text-[#8f6208]'
                  }`}>
                    <Bot className="w-3 h-3 text-[#d4af37]" />
                    <span>
                      Avg. AI Quality: <strong>{avgAiQuality}/10</strong>
                    </span>
                  </div>

                  {/* Customer Rating */}
                  <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] sm:text-[11px] font-mono shadow-xs ${
                    isDark
                      ? 'bg-[#1c180e] border-[#d4af37]/30 text-[#fae69e]'
                      : 'bg-white border-stone-200 text-[#8f6208]'
                  }`}>
                    <Star className="w-3 h-3 fill-[#d4af37] text-[#d4af37]" />
                    <span>
                      <strong>{stats.average.toFixed(1)}</strong> ({stats.totalCount} reviews)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs (Reviews / Harvests / Farm Details) */}
            <div className={`flex items-center gap-1.5 border-b pb-1 ${
              isDark ? 'border-[#d4af37]/20' : 'border-stone-200'
            }`}>
              <button
                type="button"
                onClick={() => setActiveTab('reviews')}
                className={`px-3 py-1 rounded-lg text-[11px] sm:text-xs font-mono font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'reviews'
                    ? isDark
                      ? 'bg-[#201a0e] text-[#fae69e] border border-[#d4af37]/50 shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                      : 'bg-[#fae69e]/40 text-[#78590c] border border-[#b89120] font-bold shadow-xs'
                    : isDark
                    ? 'text-[#aba79c] hover:text-[#fcfbf7] hover:bg-[#14120e]'
                    : 'text-stone-600 hover:text-[#1c1917] hover:bg-stone-100'
                }`}
              >
                <MessageSquare className="w-3 h-3 text-[#d4af37]" />
                <span>Reviews ({allReviews.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('harvests')}
                className={`px-3 py-1 rounded-lg text-[11px] sm:text-xs font-mono font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'harvests'
                    ? isDark
                      ? 'bg-[#201a0e] text-[#fae69e] border border-[#d4af37]/50 shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                      : 'bg-[#fae69e]/40 text-[#78590c] border border-[#b89120] font-bold shadow-xs'
                    : isDark
                    ? 'text-[#aba79c] hover:text-[#fcfbf7] hover:bg-[#14120e]'
                    : 'text-stone-600 hover:text-[#1c1917] hover:bg-stone-100'
                }`}
              >
                <Layers className="w-3 h-3 text-[#d4af37]" />
                <span>Harvests ({farmerProduce.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('about')}
                className={`px-3 py-1 rounded-lg text-[11px] sm:text-xs font-mono font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'about'
                    ? isDark
                      ? 'bg-[#201a0e] text-[#fae69e] border border-[#d4af37]/50 shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                      : 'bg-[#fae69e]/40 text-[#78590c] border border-[#b89120] font-bold shadow-xs'
                    : isDark
                    ? 'text-[#aba79c] hover:text-[#fcfbf7] hover:bg-[#14120e]'
                    : 'text-stone-600 hover:text-[#1c1917] hover:bg-stone-100'
                }`}
              >
                <Award className="w-3 h-3 text-[#d4af37]" />
                <span>Farm Dossier</span>
              </button>
            </div>

            {/* TAB 1: RATINGS & REVIEWS SECTION */}
            {activeTab === 'reviews' && (
              <div className="space-y-4">
                {/* Overall Rating & Breakdown Card */}
                <div className={`p-3.5 sm:p-4 rounded-xl border grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center ${
                  isDark ? 'bg-[#0f0e0c] border-[#d4af37]/35' : 'bg-white border-stone-200 shadow-xs'
                }`}>
                  {/* Left: Overall Numeric Score & Stars */}
                  <div className={`md:col-span-5 flex flex-col items-center justify-center text-center p-3 rounded-lg border ${
                    isDark ? 'bg-[#14120e] border-[#d4af37]/20' : 'bg-[#faf7f0] border-[#d4af37]/30'
                  }`}>
                    <span className={`text-[9px] font-mono uppercase tracking-widest mb-0.5 ${
                      isDark ? 'text-[#8e8b82]' : 'text-stone-500'
                    }`}>
                      Customer Satisfaction Score
                    </span>
                    <div className={`font-serif text-2xl sm:text-3xl font-bold tracking-tight ${
                      isDark ? 'text-[#fae69e]' : 'text-[#8f6208]'
                    }`}>
                      {stats.average.toFixed(1)}
                    </div>
                    <div className="mt-1">
                      <StarRating rating={stats.average} size="sm" />
                    </div>
                    <span className={`text-[11px] font-mono mt-1 ${
                      isDark ? 'text-[#aba79c]' : 'text-stone-600'
                    }`}>
                      Based on {stats.totalCount} verified {stats.totalCount === 1 ? 'review' : 'reviews'}
                    </span>
                  </div>

                  {/* Right: 5-Star Distribution Bars */}
                  <div className="md:col-span-7 space-y-2 text-xs font-mono">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = stats.distribution[star as 1 | 2 | 3 | 4 | 5] || 0;
                      const percentage =
                        stats.totalCount > 0 ? Math.round((count / stats.totalCount) * 100) : 0;

                      return (
                        <div
                          key={star}
                          onClick={() => setFilterRating(filterRating === star ? 'all' : star)}
                          className={`flex items-center gap-3 p-1.5 rounded-lg transition-colors cursor-pointer ${
                            filterRating === star
                              ? isDark
                                ? 'bg-[#201a0e] text-[#fae69e]'
                                : 'bg-[#f5efe2] text-[#8f6208] font-bold'
                              : isDark
                              ? 'hover:bg-[#14120e] text-[#aba79c]'
                              : 'hover:bg-stone-50 text-stone-600'
                          }`}
                        >
                          <span className="w-12 text-right text-[11px] flex items-center justify-end gap-1">
                            {star} <Star className="w-3 h-3 text-[#d4af37] fill-[#d4af37]" />
                          </span>
                          <div className={`flex-1 h-2 rounded-full overflow-hidden ${
                            isDark ? 'bg-[#1e1c17]' : 'bg-stone-100'
                          }`}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                              className="h-full bg-gradient-to-r from-[#d4af37] to-[#fae69e] rounded-full"
                            />
                          </div>
                          <span className={`w-8 text-[11px] text-right ${
                            isDark ? 'text-[#8e8b82]' : 'text-stone-500'
                          }`}>
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Write a Review CTA Row */}
                <div className={`p-3.5 sm:p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs ${
                  isDark
                    ? 'bg-gradient-to-r from-[#18140c] via-[#14120c] to-[#0f0e0c] border-[#d4af37]/35'
                    : 'bg-gradient-to-r from-[#faf7f0] via-[#f5efe2] to-[#f0e9d6] border-stone-200 text-[#1c1917]'
                }`}>
                  <div>
                    <h4 className={`font-serif text-lg font-bold ${isDark ? 'text-[#fcfbf7]' : 'text-[#1c1917]'}`}>
                      Ordered from {farmer.name}?
                    </h4>
                    <p className={`text-xs mt-0.5 font-sans ${isDark ? 'text-[#aba79c]' : 'text-stone-600'}`}>
                      Help other customers and support our local farmers by sharing your direct experience.
                    </p>
                  </div>

                  {canWriteReview ? (
                    <button
                      type="button"
                      onClick={() => setIsWriteReviewOpen(true)}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#fae69e] to-[#c9a227] text-stone-900 font-bold text-xs uppercase tracking-widest hover:brightness-110 active:scale-[0.99] transition-all shadow-md cursor-pointer shrink-0 flex items-center gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Write a Review</span>
                    </button>
                  ) : (
                    <div className="flex flex-col sm:items-end gap-1 shrink-0">
                      <button
                        type="button"
                        disabled
                        className={`px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider cursor-not-allowed opacity-75 border ${
                          isDark ? 'bg-[#1e1c17] text-[#6b675d] border-[#3a3528]' : 'bg-stone-100 text-stone-400 border-stone-300'
                        }`}
                      >
                        Write a Review
                      </button>
                      <div className={`flex items-center gap-1.5 text-[11px] font-mono ${
                        isDark ? 'text-[#d4af37]' : 'text-[#8f6208]'
                      }`}>
                        <AlertCircle className="w-3 h-3" />
                        <span>
                          {!isLoggedIn ? (
                            <Link to="/login" className="underline hover:text-[#b89120]">
                              Login as a customer to leave a review.
                            </Link>
                          ) : (
                            'Customer account required to leave reviews.'
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Filter Chips Bar */}
                <div className="flex items-center justify-between flex-wrap gap-2 pt-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-mono ${isDark ? 'text-[#8e8b82]' : 'text-stone-500'}`}>Filter:</span>
                    <button
                      type="button"
                      onClick={() => setFilterRating('all')}
                      className={`px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer ${
                        filterRating === 'all'
                          ? 'bg-[#d4af37] text-stone-900 font-bold'
                          : isDark
                          ? 'bg-[#14120e] text-[#aba79c] hover:text-[#fcfbf7] border border-[#d4af37]/25'
                          : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
                      }`}
                    >
                      All ({allReviews.length})
                    </button>
                    {[5, 4, 3, 2, 1].map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setFilterRating(filterRating === st ? 'all' : st)}
                        className={`px-2.5 py-1 rounded-full text-xs font-mono flex items-center gap-1 transition-all cursor-pointer ${
                          filterRating === st
                            ? 'bg-[#d4af37] text-stone-900 font-bold'
                            : isDark
                            ? 'bg-[#14120e] text-[#aba79c] hover:text-[#fcfbf7] border border-[#d4af37]/25'
                            : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
                        }`}
                      >
                        <span>{st}</span>
                        <Star className="w-3 h-3 fill-current" />
                      </button>
                    ))}
                  </div>

                  <span className={`text-[11px] font-mono ${isDark ? 'text-[#aba79c]' : 'text-stone-500'}`}>
                    Showing {filteredReviews.length} of {allReviews.length}
                  </span>
                </div>

                {/* Reviews List Cards */}
                <div className="space-y-3.5">
                  <AnimatePresence>
                    {filteredReviews.length === 0 ? (
                      <div className={`p-8 rounded-2xl border text-center ${
                        isDark ? 'bg-[#0f0e0c] border-[#d4af37]/20' : 'bg-white border-stone-200'
                      }`}>
                        <MessageSquare className="w-8 h-8 text-[#d4af37]/40 mx-auto mb-2" />
                        <p className={`text-sm font-sans ${isDark ? 'text-[#aba79c]' : 'text-stone-600'}`}>
                          No reviews found matching this filter.
                        </p>
                      </div>
                    ) : (
                      filteredReviews.map((rev) => (
                        <motion.div
                          key={rev.id}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.35 }}
                          className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                            rev.isUserReviewed
                              ? isDark
                                ? 'bg-[#1a150c] border-[#d4af37]/60 shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                                : 'bg-[#fffdf7] border-[#d4af37] shadow-xs'
                              : isDark
                              ? 'bg-[#0f0e0c] border-[#d4af37]/20 hover:border-[#d4af37]/45'
                              : 'bg-white border-stone-200 hover:border-[#d4af37]/50 shadow-xs'
                          }`}
                        >
                          {/* Review Top Row: User Avatar, Name, Rating & Date */}
                          <div className="flex items-start justify-between gap-3 mb-2.5">
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-full border flex items-center justify-center font-serif font-bold text-sm shrink-0 ${
                                isDark ? 'bg-[#1e1a12] border-[#d4af37]/40 text-[#fae69e]' : 'bg-[#faf6ee] border-[#d4af37]/40 text-[#8f6208]'
                              }`}>
                                {rev.customerName ? rev.customerName.charAt(0).toUpperCase() : 'C'}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className={`font-semibold text-xs sm:text-sm ${
                                    isDark ? 'text-[#fcfbf7]' : 'text-[#1c1917]'
                                  }`}>
                                    {rev.customerName}
                                  </h4>
                                  {rev.verified && (
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-mono ${
                                      isDark ? 'bg-[#121c14] border-[#34d399]/40 text-[#34d399]' : 'bg-[#f0fdf4] border-[#86efac] text-[#166534]'
                                    }`}>
                                      <CheckCircle2 className="w-2.5 h-2.5" />
                                      Verified Purchase
                                    </span>
                                  )}
                                  {rev.isUserReviewed && (
                                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                                      isDark ? 'bg-[#2a220e] text-[#fae69e] border-[#d4af37]' : 'bg-[#faf6ee] text-[#8f6208] border-[#d4af37]'
                                    }`}>
                                      Your Review
                                    </span>
                                  )}
                                </div>
                                <div className="mt-0.5">
                                  <StarRating rating={rev.rating} size="sm" />
                                </div>
                              </div>
                            </div>

                            <span className={`text-[10px] font-mono ${isDark ? 'text-[#8e8b82]' : 'text-stone-400'}`}>
                              {rev.date}
                            </span>
                          </div>

                          {/* Produce Link if specific crop reviewed */}
                          {rev.produceName && (
                            <div className={`mb-2 text-[11px] font-mono flex items-center gap-1 ${
                              isDark ? 'text-[#d4af37]' : 'text-[#8f6208]'
                            }`}>
                              <span>Produce:</span>
                              <span className={`font-sans underline cursor-pointer ${
                                isDark ? 'text-[#f5f3eb]' : 'text-stone-800'
                              }`}>
                                {rev.produceName}
                              </span>
                            </div>
                          )}

                          {/* Review Text */}
                          <p className={`text-xs sm:text-sm leading-relaxed font-sans mt-1 ${
                            isDark ? 'text-[#aba79c]' : 'text-stone-700'
                          }`}>
                            "{rev.comment}"
                          </p>

                          {/* Optional Harvest Photos Attached */}
                          {rev.photos && rev.photos.length > 0 && (
                            <div className="mt-3 flex items-center gap-2 flex-wrap">
                              {rev.photos.map((imgUrl, pIdx) => (
                                <div
                                  key={pIdx}
                                  onClick={() => setSelectedPhoto(imgUrl)}
                                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border cursor-pointer transition-all hover:scale-105 ${
                                    isDark ? 'border-[#d4af37]/35 hover:border-[#d4af37]' : 'border-stone-200 hover:border-[#d4af37]'
                                  }`}
                                >
                                  <img
                                    src={imgUrl}
                                    alt={`Review photo ${pIdx + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Helpful Counter Button */}
                          <div className={`mt-3 pt-2.5 border-t flex items-center justify-between text-[11px] ${
                            isDark ? 'border-[#d4af37]/10' : 'border-stone-100'
                          }`}>
                            <button
                              type="button"
                              onClick={() => toggleHelpful(rev.id)}
                              className={`inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                                isDark ? 'text-[#aba79c] hover:text-[#fae69e]' : 'text-stone-600 hover:text-[#8f6208]'
                              }`}
                            >
                              <ThumbsUp className="w-3.5 h-3.5 text-[#d4af37]" />
                              <span>Helpful ({rev.helpfulCount || 0})</span>
                            </button>

                            <span className={`text-[10px] font-mono ${isDark ? 'text-[#8e8b82]' : 'text-stone-400'}`}>
                              Direct Farm Verification #AUR-{rev.id.slice(-4).toUpperCase()}
                            </span>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* TAB 2: ACTIVE HARVESTS WITH AI QUALITY & CUSTOMER STARS */}
            {activeTab === 'harvests' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-mono uppercase tracking-wider ${
                    isDark ? 'text-[#d4af37]' : 'text-[#8f6208]'
                  }`}>
                    Live Harvests Dispatched by {farmer.name}
                  </span>
                  <span className={`text-xs font-mono ${isDark ? 'text-[#8e8b82]' : 'text-stone-500'}`}>
                    {farmerProduce.length} available items
                  </span>
                </div>

                {farmerProduce.length === 0 ? (
                  <div className={`p-8 rounded-2xl border text-center ${
                    isDark ? 'bg-[#0f0e0c] border-[#d4af37]/20' : 'bg-white border-stone-200'
                  }`}>
                    <p className={`text-sm ${isDark ? 'text-[#aba79c]' : 'text-stone-600'}`}>
                      All current harvests from this grower are reserved. New harvests dispatch tomorrow at dawn.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {farmerProduce.map((prod) => {
                      const prodStats = getProductStats(prod.id);
                      const hasAi = Boolean(
                        prod.aiQualityRating &&
                        typeof prod.aiQualityRating.qualityScore === 'number' &&
                        prod.aiQualityRating.qualityScore > 0
                      );

                      return (
                        <div
                          key={prod.id}
                          className={`p-4 rounded-2xl border flex flex-col justify-between transition-all cursor-pointer ${
                            isDark
                              ? 'bg-[#0f0e0c] border-[#d4af37]/30 hover:border-[#d4af37]'
                              : 'bg-white border-stone-200 hover:border-[#b89120] shadow-xs'
                          }`}
                        >
                          <div>
                            <div className={`relative h-36 rounded-xl overflow-hidden mb-3 border ${
                              isDark ? 'border-[#d4af37]/20 bg-[#16130e]' : 'border-stone-200 bg-stone-100'
                            }`}>
                              <img
                                src={getProduceImage(prod)}
                                alt={prod.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-[#d4af37]/40 text-[10px] font-mono text-[#fae69e]">
                                ₹{prod.pricePerUnit} / {prod.unit}
                              </div>
                              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-[#100e0a]/80 backdrop-blur-sm border border-[#d4af37]/20 text-[9px] font-mono text-[#e8dfca]">
                                Stock: {prod.quantity} {prod.unit}
                              </div>
                            </div>

                            <div className="flex items-center justify-between gap-1 mb-1">
                              <h4 className={`font-serif text-lg font-bold truncate ${
                                isDark ? 'text-[#fcfbf7]' : 'text-[#1c1917]'
                              }`}>
                                {prod.name}
                              </h4>
                              <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border shrink-0 ${
                                isDark ? 'bg-[#1e190e] text-[#d4af37] border-[#d4af37]/30' : 'bg-[#faf6ee] text-[#8f6208] border-[#d4af37]/40'
                              }`}>
                                {prod.category}
                              </span>
                            </div>
                            <p className={`text-xs line-clamp-2 mb-3 ${
                              isDark ? 'text-[#aba79c]' : 'text-stone-600'
                            }`}>
                              {prod.description}
                            </p>
                          </div>

                          {/* Dual Score Row: AI Quality Score + Customer Rating side by side */}
                          <div className={`pt-3 border-t space-y-2 ${
                            isDark ? 'border-[#d4af37]/15' : 'border-stone-100'
                          }`}>
                            <div className="flex items-center justify-between flex-wrap gap-1.5">
                              {/* AI Quality Badge */}
                              {hasAi ? (
                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-mono ${
                                  isDark
                                    ? 'bg-[#18140c] border-[#d4af37]/50 text-[#fae69e] shadow-[0_0_10px_rgba(212,175,55,0.15)]'
                                    : 'bg-[#faf6ee] border-[#d4af37]/40 text-[#8f6208]'
                                }`}>
                                  <Bot className="w-3.5 h-3.5 text-[#d4af37]" />
                                  <span>
                                    AI Quality:{' '}
                                    <strong>
                                      {prod.aiQualityRating!.qualityScore.toFixed(1)}/10
                                    </strong>
                                  </span>
                                </span>
                              ) : (
                                <span className={`text-[11px] font-mono ${isDark ? 'text-[#8e8b82]' : 'text-stone-400'}`}>Standard Fresh</span>
                              )}

                              {/* Customer Rating */}
                              <div className="flex items-center gap-1">
                                {prodStats.totalCount > 0 ? (
                                  <StarRating rating={prodStats.average} size="xs" showNumeric={true} />
                                ) : (
                                  <span className={`text-[10px] font-mono ${isDark ? 'text-[#8e8b82]' : 'text-stone-400'}`}>No reviews yet</span>
                                )}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                if (onSelectProduce) onSelectProduce(prod.id);
                              }}
                              className={`w-full py-2.5 rounded-xl border font-mono text-xs uppercase tracking-wider transition-all cursor-pointer font-bold mt-2 ${
                                isDark
                                  ? 'bg-[#14120e] hover:bg-[#d4af37] text-[#fae69e] hover:text-[#0a0a0a] border-[#d4af37]/40'
                                  : 'bg-[#faf6ee] hover:bg-[#d4af37] text-[#8f6208] hover:text-white border-[#d4af37]/50'
                              }`}
                            >
                              Reserve Harvest Allocation
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: FARM DOSSIER & CERTIFICATIONS */}
            {activeTab === 'about' && (
              <div className="space-y-4">
                <div className={`p-5 rounded-2xl border space-y-3.5 text-xs ${
                  isDark ? 'bg-[#0f0e0c] border-[#d4af37]/25 text-[#aba79c]' : 'bg-white border-stone-200 text-stone-600 shadow-xs'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={isDark ? 'text-[#8e8b82]' : 'text-stone-500'}>Farm Scale & Soil</span>
                    <span className={`font-mono font-semibold ${isDark ? 'text-[#fae69e]' : 'text-[#8f6208]'}`}>{farmer.acreage}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={isDark ? 'text-[#8e8b82]' : 'text-stone-500'}>Primary Harvest Specialty</span>
                    <span className={`font-medium ${isDark ? 'text-[#f5f3eb]' : 'text-stone-800'}`}>{farmer.specialty}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={isDark ? 'text-[#8e8b82]' : 'text-stone-500'}>Direct Payout Escrow</span>
                    <span className="font-mono text-[#166534] dark:text-[#34d399] flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      100% Instant Escrow (Zero Commission)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={isDark ? 'text-[#8e8b82]' : 'text-stone-500'}>Cold Chain Transit Target</span>
                    <span className={`font-mono font-semibold ${isDark ? 'text-[#fae69e]' : 'text-[#8f6208]'}`}>&lt; 14 Hours from Picking</span>
                  </div>
                </div>

                <div className={`p-5 rounded-2xl border ${
                  isDark ? 'bg-[#14120e] border-[#d4af37]/35' : 'bg-[#faf7f0] border-[#d4af37]/30 shadow-xs'
                }`}>
                  <h4 className={`font-serif text-base font-bold mb-2 ${
                    isDark ? 'text-[#fae69e]' : 'text-[#8f6208]'
                  }`}>
                    Direct Farm Guarantee
                  </h4>
                  <p className={`text-xs leading-relaxed font-sans ${
                    isDark ? 'text-[#aba79c]' : 'text-stone-700'
                  }`}>
                    Every harvest dispatched by {farmer.name} undergoes dual verification:
                    Multimodal AI visual quality inspection and direct batch traceability with
                    zero middleman manipulation.
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Write a Review Modal Sub-Component */}
      <AnimatePresence>
        {isWriteReviewOpen && (
          <WriteReviewModal
            isOpen={isWriteReviewOpen}
            onClose={() => setIsWriteReviewOpen(false)}
            farmerId={farmer.id}
            farmerName={farmer.name}
          />
        )}
      </AnimatePresence>

      {/* Photo Lightbox Preview */}
      <AnimatePresence>
        {selectedPhoto && (
          <div
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-[120] bg-black/95 flex items-center justify-center p-4 cursor-pointer"
          >
            <div className="relative max-w-xl max-h-[85vh] rounded-2xl overflow-hidden border border-[#d4af37]">
              <img src={selectedPhoto} alt="Review full size" className="w-full h-full object-contain" />
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/70 text-[#fae69e] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>,
    document.body
  );
};
