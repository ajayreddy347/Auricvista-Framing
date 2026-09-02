import React, { useState, useEffect } from 'react';
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
}

export const FarmerProfileModal: React.FC<FarmerProfileModalProps> = ({
  farmer,
  onClose,
  onSelectProduce,
}) => {
  const { user, isLoggedIn, userRole } = useAuth();
  const { getFarmerReviews, getFarmerStats, getProductStats, toggleHelpful } = useReviews();
  const { listings } = useProduce();

  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'reviews' | 'harvests' | 'about'>('reviews');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (!farmer) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [farmer, onClose]);

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

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
          className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl bg-gradient-to-b from-[#16130e] via-[#0f0e0c] to-[#080706] border-2 border-[#d4af37]/45 shadow-[0_0_60px_-15px_rgba(212,175,55,0.4)] z-10 overflow-hidden my-auto"
        >
          {/* Header Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-32 bg-[#d4af37]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full text-[#aba79c] hover:text-[#fae69e] hover:bg-[#201a0e] transition-colors cursor-pointer z-20"
            aria-label="Close farmer dossier"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 md:p-8 space-y-6">
            {/* Top Farmer Profile Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-[#d4af37]/20">
              {/* Gold Ring Avatar */}
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-[2.5px] bg-gradient-to-tr from-[#d4af37] via-[#fae69e] to-[#9b7617] shadow-[0_0_25px_rgba(212,175,55,0.35)] shrink-0">
                  <div className="w-full h-full rounded-full bg-[#181510] flex items-center justify-center border-2 border-[#0e0d0b]">
                    <span className="font-serif text-2xl sm:text-3xl font-bold text-[#fae69e]">
                      {farmer.initials}
                    </span>
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#12110c] border border-[#d4af37] flex items-center justify-center text-[#34d399] shadow-md">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>

              {/* Title & Metadata */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
                    VERIFIED DIRECT GROWER
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#201a0e] text-[#fae69e] border border-[#d4af37]/30">
                    {farmer.highlightBadge}
                  </span>
                  {farmer.farmerId && (
                    <span className="text-[11px] font-mono font-bold text-[#fae69e] bg-[#241c0e] px-2.5 py-0.5 rounded-md border border-[#d4af37]/60 shadow-sm flex items-center gap-1">
                      <span className="text-[#a89244] font-semibold">Farmer ID:</span> {farmer.farmerId}
                    </span>
                  )}
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#fcfbf7] tracking-tight">
                  {farmer.name}
                </h2>

                <div className="mt-2 flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-[#aba79c]">
                  <span className="flex items-center gap-1.5 text-[#dcd7c9]">
                    <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                    {farmer.location}
                  </span>
                  <span className="flex items-center gap-1.5 text-[#aba79c]">
                    <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                    Farming for {farmer.experience}
                  </span>
                  <span className="flex items-center gap-1 text-[#34d399] font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    100% Certified Direct
                  </span>
                </div>

                {/* Header Dual Metrics: Avg AI Quality & Customer Rating */}
                <div className="mt-3.5 flex items-center gap-3 flex-wrap">
                  {/* AI Quality Badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1c180e] border border-[#d4af37]/50 text-xs font-mono text-[#fae69e] shadow-[0_0_12px_rgba(212,175,55,0.2)]">
                    <Bot className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>
                      Avg. AI Quality: <strong>{avgAiQuality}/10</strong>
                    </span>
                  </div>

                  {/* Customer Rating */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1c180e] border border-[#d4af37]/30 text-xs font-mono text-[#fae69e]">
                    <Star className="w-3.5 h-3.5 fill-[#d4af37] text-[#d4af37]" />
                    <span>
                      <strong>{stats.average.toFixed(1)}</strong> ({stats.totalCount} reviews)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs (Reviews / Harvests / Farm Details) */}
            <div className="flex items-center gap-2 border-b border-[#d4af37]/20 pb-1">
              <button
                type="button"
                onClick={() => setActiveTab('reviews')}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'reviews'
                    ? 'bg-[#201a0e] text-[#fae69e] border border-[#d4af37]/50 shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                    : 'text-[#aba79c] hover:text-[#fcfbf7] hover:bg-[#14120e]'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Ratings & Reviews ({allReviews.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('harvests')}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'harvests'
                    ? 'bg-[#201a0e] text-[#fae69e] border border-[#d4af37]/50 shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                    : 'text-[#aba79c] hover:text-[#fcfbf7] hover:bg-[#14120e]'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Active Harvests ({farmerProduce.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('about')}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'about'
                    ? 'bg-[#201a0e] text-[#fae69e] border border-[#d4af37]/50 shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                    : 'text-[#aba79c] hover:text-[#fcfbf7] hover:bg-[#14120e]'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Farm Dossier</span>
              </button>
            </div>

            {/* TAB 1: RATINGS & REVIEWS SECTION */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Overall Rating & Breakdown Card */}
                <div className="p-5 sm:p-6 rounded-2xl bg-[#0f0e0c] border border-[#d4af37]/35 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Left: Overall Numeric Score & Stars */}
                  <div className="md:col-span-5 flex flex-col items-center justify-center text-center p-3 sm:p-4 rounded-xl bg-[#14120e] border border-[#d4af37]/20">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#8e8b82] mb-1">
                      Customer Satisfaction Score
                    </span>
                    <div className="font-serif text-4xl sm:text-5xl font-bold text-[#fae69e] tracking-tight">
                      {stats.average.toFixed(1)}
                    </div>
                    <div className="mt-2">
                      <StarRating rating={stats.average} size="lg" />
                    </div>
                    <span className="text-xs font-mono text-[#aba79c] mt-2">
                      Based on {stats.totalCount} verified {stats.totalCount === 1 ? 'review' : 'reviews'}
                    </span>
                  </div>

                  {/* Right: 5-Star Distribution Bars */}
                  <div className="md:col-span-7 space-y-1.5 text-xs font-mono">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = stats.distribution[star as 1 | 2 | 3 | 4 | 5] || 0;
                      const percentage =
                        stats.totalCount > 0 ? Math.round((count / stats.totalCount) * 100) : 0;

                      return (
                        <div
                          key={star}
                          onClick={() => setFilterRating(filterRating === star ? 'all' : star)}
                          className={`flex items-center gap-3 p-1 rounded-lg transition-colors cursor-pointer ${
                            filterRating === star
                              ? 'bg-[#201a0e] text-[#fae69e]'
                              : 'hover:bg-[#14120e] text-[#aba79c]'
                          }`}
                        >
                          <span className="w-12 text-right text-[11px] flex items-center justify-end gap-1">
                            {star} <Star className="w-3 h-3 text-[#d4af37] fill-[#d4af37]" />
                          </span>
                          <div className="flex-1 h-2 rounded-full bg-[#1e1c17] overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                              className="h-full bg-gradient-to-r from-[#d4af37] to-[#fae69e] rounded-full"
                            />
                          </div>
                          <span className="w-8 text-[11px] text-[#8e8b82] text-right">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Write a Review CTA Row */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#18140c] via-[#14120c] to-[#0f0e0c] border border-[#d4af37]/35 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                  <div>
                    <h4 className="font-serif text-lg font-bold text-[#fcfbf7]">
                      Ordered from {farmer.name}?
                    </h4>
                    <p className="text-xs text-[#aba79c] mt-0.5 font-sans">
                      Help other customers and support our local farmers by sharing your direct experience.
                    </p>
                  </div>

                  {canWriteReview ? (
                    <button
                      type="button"
                      onClick={() => setIsWriteReviewOpen(true)}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#fae69e] to-[#c9a227] text-[#0a0a0a] font-bold text-xs uppercase tracking-widest hover:brightness-110 active:scale-[0.99] transition-all shadow-[0_0_20px_rgba(212,175,55,0.35)] cursor-pointer shrink-0 flex items-center gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Write a Review</span>
                    </button>
                  ) : (
                    <div className="flex flex-col sm:items-end gap-1 shrink-0">
                      <button
                        type="button"
                        disabled
                        className="px-5 py-2.5 rounded-xl bg-[#1e1c17] text-[#6b675d] border border-[#3a3528] font-mono text-xs uppercase tracking-wider cursor-not-allowed opacity-75"
                      >
                        Write a Review
                      </button>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#d4af37] font-mono">
                        <AlertCircle className="w-3 h-3 text-[#d4af37]" />
                        <span>
                          {!isLoggedIn ? (
                            <Link to="/login" className="underline hover:text-white">
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
                    <span className="text-xs font-mono text-[#8e8b82]">Filter:</span>
                    <button
                      type="button"
                      onClick={() => setFilterRating('all')}
                      className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
                        filterRating === 'all'
                          ? 'bg-[#d4af37] text-[#0a0a0a] font-bold'
                          : 'bg-[#14120e] text-[#aba79c] hover:text-[#fcfbf7] border border-[#d4af37]/25'
                      }`}
                    >
                      All ({allReviews.length})
                    </button>
                    {[5, 4, 3, 2, 1].map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setFilterRating(filterRating === st ? 'all' : st)}
                        className={`px-2.5 py-1 rounded-full text-xs font-mono flex items-center gap-1 transition-all ${
                          filterRating === st
                            ? 'bg-[#d4af37] text-[#0a0a0a] font-bold'
                            : 'bg-[#14120e] text-[#aba79c] hover:text-[#fcfbf7] border border-[#d4af37]/25'
                        }`}
                      >
                        <span>{st}</span>
                        <Star className="w-3 h-3 fill-current" />
                      </button>
                    ))}
                  </div>

                  <span className="text-[11px] font-mono text-[#aba79c]">
                    Showing {filteredReviews.length} of {allReviews.length}
                  </span>
                </div>

                {/* Reviews List Cards */}
                <div className="space-y-3.5">
                  <AnimatePresence>
                    {filteredReviews.length === 0 ? (
                      <div className="p-8 rounded-2xl bg-[#0f0e0c] border border-[#d4af37]/20 text-center">
                        <MessageSquare className="w-8 h-8 text-[#d4af37]/40 mx-auto mb-2" />
                        <p className="text-sm text-[#aba79c] font-sans">
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
                              ? 'bg-[#1a150c] border-[#d4af37]/60 shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                              : 'bg-[#0f0e0c] border-[#d4af37]/20 hover:border-[#d4af37]/45'
                          }`}
                        >
                          {/* Review Top Row: User Avatar, Name, Rating & Date */}
                          <div className="flex items-start justify-between gap-3 mb-2.5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-[#1e1a12] border border-[#d4af37]/40 flex items-center justify-center text-[#fae69e] font-serif font-bold text-sm shrink-0">
                                {rev.customerName ? rev.customerName.charAt(0).toUpperCase() : 'C'}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="font-semibold text-xs sm:text-sm text-[#fcfbf7]">
                                    {rev.customerName}
                                  </h4>
                                  {rev.verified && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#121c14] border border-[#34d399]/40 text-[10px] font-mono text-[#34d399]">
                                      <CheckCircle2 className="w-2.5 h-2.5" />
                                      Verified Purchase
                                    </span>
                                  )}
                                  {rev.isUserReviewed && (
                                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#2a220e] text-[#fae69e] border border-[#d4af37]">
                                      Your Review
                                    </span>
                                  )}
                                </div>
                                <div className="mt-0.5">
                                  <StarRating rating={rev.rating} size="sm" />
                                </div>
                              </div>
                            </div>

                            <span className="text-[10px] font-mono text-[#8e8b82] shrink-0">
                              {rev.date}
                            </span>
                          </div>

                          {/* Produce Link if specific crop reviewed */}
                          {rev.produceName && (
                            <div className="mb-2 text-[11px] font-mono text-[#d4af37] flex items-center gap-1">
                              <span>Produce:</span>
                              <span className="text-[#f5f3eb] font-sans underline cursor-pointer">
                                {rev.produceName}
                              </span>
                            </div>
                          )}

                          {/* Review Text */}
                          <p className="text-xs sm:text-sm text-[#aba79c] leading-relaxed font-sans mt-1">
                            "{rev.comment}"
                          </p>

                          {/* Optional Harvest Photos Attached */}
                          {rev.photos && rev.photos.length > 0 && (
                            <div className="mt-3 flex items-center gap-2 flex-wrap">
                              {rev.photos.map((imgUrl, pIdx) => (
                                <div
                                  key={pIdx}
                                  onClick={() => setSelectedPhoto(imgUrl)}
                                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border border-[#d4af37]/35 cursor-pointer hover:border-[#d4af37] transition-all hover:scale-105"
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
                          <div className="mt-3 pt-2.5 border-t border-[#d4af37]/10 flex items-center justify-between text-[11px]">
                            <button
                              type="button"
                              onClick={() => toggleHelpful(rev.id)}
                              className="inline-flex items-center gap-1.5 text-[#aba79c] hover:text-[#fae69e] transition-colors cursor-pointer"
                            >
                              <ThumbsUp className="w-3.5 h-3.5 text-[#d4af37]" />
                              <span>Helpful ({rev.helpfulCount || 0})</span>
                            </button>

                            <span className="text-[10px] font-mono text-[#8e8b82]">
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
                  <span className="text-xs font-mono uppercase tracking-wider text-[#d4af37]">
                    Live Harvests Dispatched by {farmer.name}
                  </span>
                  <span className="text-xs font-mono text-[#8e8b82]">
                    {farmerProduce.length} available items
                  </span>
                </div>

                {farmerProduce.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-[#0f0e0c] border border-[#d4af37]/20 text-center">
                    <p className="text-sm text-[#aba79c]">
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
                          className="p-4 rounded-2xl bg-[#0f0e0c] border border-[#d4af37]/30 flex flex-col justify-between card-lift-glow-md cursor-pointer"
                        >
                          <div>
                            <div className="relative h-36 rounded-xl overflow-hidden mb-3 border border-[#d4af37]/20">
                              <img
                                src={prod.images[0] || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea'}
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
                              <h4 className="font-serif text-lg font-bold text-[#fcfbf7] truncate">
                                {prod.name}
                              </h4>
                              <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#1e190e] text-[#d4af37] border border-[#d4af37]/30 shrink-0">
                                {prod.category}
                              </span>
                            </div>
                            <p className="text-xs text-[#aba79c] line-clamp-2 mb-3">
                              {prod.description}
                            </p>
                          </div>

                          {/* Dual Score Row: AI Quality Score + Customer Rating side by side */}
                          <div className="pt-3 border-t border-[#d4af37]/15 space-y-2">
                            <div className="flex items-center justify-between flex-wrap gap-1.5">
                              {/* AI Quality Badge */}
                              {hasAi ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#18140c] border border-[#d4af37]/50 text-[11px] font-mono text-[#fae69e] shadow-[0_0_10px_rgba(212,175,55,0.15)]">
                                  <Bot className="w-3.5 h-3.5 text-[#d4af37]" />
                                  <span>
                                    AI Quality:{' '}
                                    <strong>
                                      {prod.aiQualityRating!.qualityScore.toFixed(1)}/10
                                    </strong>
                                  </span>
                                </span>
                              ) : (
                                <span className="text-[11px] font-mono text-[#8e8b82]">Standard Fresh</span>
                              )}

                              {/* Customer Rating */}
                              <div className="flex items-center gap-1">
                                {prodStats.totalCount > 0 ? (
                                  <StarRating rating={prodStats.average} size="xs" showNumeric={true} />
                                ) : (
                                  <span className="text-[10px] font-mono text-[#8e8b82]">No reviews yet</span>
                                )}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                if (onSelectProduce) onSelectProduce(prod.id);
                              }}
                              className="w-full py-2.5 rounded-xl bg-[#14120e] hover:bg-[#d4af37] text-[#fae69e] hover:text-[#0a0a0a] border border-[#d4af37]/40 hover:border-[#d4af37] font-mono text-xs uppercase tracking-wider transition-all cursor-pointer font-bold mt-2"
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
                <div className="p-5 rounded-2xl bg-[#0f0e0c] border border-[#d4af37]/25 space-y-3.5 text-xs text-[#aba79c]">
                  <div className="flex items-center justify-between text-[#dcd7c9]">
                    <span className="text-[#8e8b82]">Farm Scale & Soil</span>
                    <span className="font-mono text-[#fae69e]">{farmer.acreage}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#dcd7c9]">
                    <span className="text-[#8e8b82]">Primary Harvest Specialty</span>
                    <span className="font-mono text-[#f5f3eb]">{farmer.specialty}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#dcd7c9]">
                    <span className="text-[#8e8b82]">Direct Payout Escrow</span>
                    <span className="font-mono text-[#34d399] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      100% Instant Escrow (Zero Commission)
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[#dcd7c9]">
                    <span className="text-[#8e8b82]">Cold Chain Transit Target</span>
                    <span className="font-mono text-[#fae69e]">&lt; 14 Hours from Picking</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#14120e] border border-[#d4af37]/35">
                  <h4 className="font-serif text-base font-bold text-[#fae69e] mb-2">
                    Direct Farm Guarantee
                  </h4>
                  <p className="text-xs text-[#aba79c] leading-relaxed font-sans">
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
            className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4 cursor-pointer"
          >
            <div className="relative max-w-xl max-h-[85vh] rounded-2xl overflow-hidden border border-[#d4af37]">
              <img src={selectedPhoto} alt="Review full size" className="w-full h-full object-contain" />
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/70 text-[#fae69e]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
