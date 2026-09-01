import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Bot,
  Star,
  MapPin,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  User,
  MessageSquare,
  ThumbsUp,
  AlertCircle,
  Tag,
} from 'lucide-react';
import { StarRating } from './StarRating';
import { WriteReviewModal } from './WriteReviewModal';
import { ProduceListing } from '../context/ProduceContext';
import { useReviews } from '../context/ReviewsContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

/* NOTE: In the next development phase, all local/mock states (listings, reviews, auth, cart) 
   should be replaced with real backend/database calls (e.g., Firebase Firestore, Cloud SQL, or custom API). */

interface ProductDetailModalProps {
  produce: ProduceListing | null;
  onClose: () => void;
  onFarmerClick?: (farmerName: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  produce,
  onClose,
  onFarmerClick,
}) => {
  const { user, isLoggedIn, userRole } = useAuth();
  const { getProductReviews, getProductStats, toggleHelpful } = useReviews();
  const { addToCart, openCart } = useCart();
  const navigate = useNavigate();

  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [reservedSuccess, setReservedSuccess] = useState(false);

  if (!produce) return null;

  const productStats = getProductStats(produce.id);
  const productReviews = getProductReviews(produce.id);

  // Match farmer ID helper
  const farmerId =
    produce.farmerName.toLowerCase().includes('ravi')
      ? 'ravi-kumar'
      : produce.farmerName.toLowerCase().includes('lakshmi')
      ? 'lakshmi-devi'
      : 'suresh-naidu';

  const canWriteReview = isLoggedIn && userRole === 'customer';

  const handleReserve = () => {
    addToCart({
      productId: produce.id,
      name: produce.name,
      image: produce.images && produce.images[0] ? produce.images[0] : 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea',
      price: produce.pricePerUnit,
      unit: produce.unit,
      farmerName: produce.farmerName,
    }, 1);
    setReservedSuccess(true);
    setTimeout(() => {
      setReservedSuccess(false);
    }, 2500);
  };

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
          className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-gradient-to-b from-[#16130e] via-[#0f0e0c] to-[#080706] border-2 border-[#d4af37]/45 shadow-[0_0_60px_-15px_rgba(212,175,55,0.4)] z-10 overflow-hidden my-auto"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-[#aba79c] hover:text-[#fae69e] hover:bg-[#201a0e] transition-colors cursor-pointer z-20"
            aria-label="Close product view"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
            {/* Top Produce Image Banner & Price Badge */}
            <div className="relative h-60 sm:h-72 rounded-2xl overflow-hidden border border-[#d4af37]/35 shadow-inner">
              <img
                src={produce.images[0] || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea'}
                alt={produce.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80" />

              {/* Price Tag */}
              <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-[#d4af37]/60 text-xs sm:text-sm font-mono font-bold text-[#fae69e] shadow-lg">
                ₹{produce.pricePerUnit} / {produce.unit}
              </div>

              {/* Harvest Date Tag */}
              <div className="absolute top-3 right-12 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-[#d4af37]/40 text-[11px] font-mono text-[#e8dfca] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Harvested {produce.harvestDate}</span>
              </div>

              {/* Bottom Info Overlay */}
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c9a227]">
                    {produce.category} • DIRECT HARVEST
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#fcfbf7] drop-shadow-md">
                    {produce.name}
                  </h2>
                </div>
              </div>
            </div>

            {/* DUAL RATING ROW: AI Quality Badge & Customer Rating Side-by-Side */}
            <div className="p-4 rounded-2xl bg-[#14120e] border border-[#d4af37]/35 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-[0_0_20px_-5px_rgba(212,175,55,0.15)]">
              {/* AI Quality Score: Robot icon + gold outline badge */}
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1d180d] border border-[#d4af37]/60 text-xs font-mono text-[#fae69e] shadow-[0_0_12px_rgba(212,175,55,0.2)]">
                  <Bot className="w-4 h-4 text-[#d4af37]" />
                  <span>
                    AI Quality Score:{' '}
                    <strong className="text-[#fae69e]">
                      {produce.aiQualityRating?.qualityScore
                        ? `${produce.aiQualityRating.qualityScore.toFixed(1)}/10`
                        : '9.8/10'}
                    </strong>
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#18261a] border border-[#34d399]/40 text-[#34d399]">
                  {produce.aiQualityRating?.freshnessLabel || 'Peak Freshness'}
                </span>
              </div>

              {/* Customer Rating: Star icons filled gold */}
              <div className="flex items-center gap-2">
                <StarRating
                  rating={productStats.average}
                  size="sm"
                  showNumeric={true}
                  reviewCount={productStats.totalCount}
                />
              </div>
            </div>

            {/* Farm Origin & Farmer Info */}
            <div className="p-4 rounded-2xl bg-[#0f0e0c] border border-[#d4af37]/25 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#18150d] border border-[#d4af37]/40 flex items-center justify-center text-[#fae69e] font-serif font-bold text-base">
                  {produce.farmerName.charAt(0)}
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#8e8b82]">
                    Cultivated & Dispatched By
                  </span>
                  <h4 className="font-serif text-base font-bold text-[#fcfbf7]">
                    {produce.farmerName}
                  </h4>
                  <p className="text-xs text-[#aba79c] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#d4af37]" />
                    {produce.farmLocation}
                  </p>
                </div>
              </div>

              {onFarmerClick && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onFarmerClick(produce.farmerName);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#18150d] border border-[#d4af37]/35 text-[11px] font-mono text-[#fae69e] hover:border-[#d4af37] transition-all cursor-pointer"
                >
                  View Farm Dossier →
                </button>
              )}
            </div>

            {/* Agronomic Inspection & Description */}
            <div className="space-y-3">
              <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-[#d4af37]">
                Produce Profile & Agronomic Inspection
              </h4>
              <p className="text-xs sm:text-sm text-[#aba79c] leading-relaxed font-sans">
                {produce.description ||
                  'Naturally grown harvest, harvested early in the morning and dispatched in moisture-preserving food-safe packaging.'}
              </p>

              {produce.aiQualityRating && (
                <div className="p-3.5 rounded-xl bg-[#12100b] border border-[#d4af37]/20 text-xs space-y-2">
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className="text-[#8e8b82]">AI Visual Grade:</span>
                    <span className="text-[#fae69e] font-bold">
                      {produce.aiQualityRating.grade}
                    </span>
                  </div>
                  {produce.aiQualityRating.analysisNote && (
                    <p className="text-[11px] text-[#aba79c] font-sans italic">
                      "{produce.aiQualityRating.analysisNote}"
                    </p>
                  )}
                  {produce.aiQualityRating.tags && produce.aiQualityRating.tags.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {produce.aiQualityRating.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded-full bg-[#18150d] border border-[#d4af37]/30 text-[10px] font-mono text-[#fae69e]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Customer Reviews for this Produce Item */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-[#d4af37] flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Customer Reviews ({productReviews.length})</span>
                </h4>

                {canWriteReview ? (
                  <button
                    type="button"
                    onClick={() => setIsWriteReviewOpen(true)}
                    className="text-xs font-mono text-[#fae69e] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-[#d4af37]" />
                    Write a Review
                  </button>
                ) : (
                  <span className="text-[10px] font-mono text-[#8e8b82]">
                    {!isLoggedIn ? 'Sign in to review' : 'Customer review mode'}
                  </span>
                )}
              </div>

              {productReviews.length === 0 ? (
                <div className="p-4 rounded-xl bg-[#0f0e0c] border border-[#d4af37]/20 text-center text-xs text-[#aba79c]">
                  No reviews for this specific harvest yet. Be the first to rate it!
                </div>
              ) : (
                <div className="space-y-2.5">
                  {productReviews.slice(0, 3).map((r) => (
                    <div
                      key={r.id}
                      className="p-3 rounded-xl bg-[#0f0e0c] border border-[#d4af37]/20 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#fcfbf7]">{r.customerName}</span>
                          <StarRating rating={r.rating} size="xs" />
                        </div>
                        <span className="text-[10px] font-mono text-[#8e8b82]">{r.date}</span>
                      </div>
                      <p className="text-[#aba79c] font-sans">"{r.comment}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-[#d4af37]/20 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleReserve}
                className="flex-1 py-3.5 px-5 rounded-xl bg-[#1a160e] border border-[#d4af37]/60 text-[#fae69e] font-bold text-xs uppercase tracking-wider hover:border-[#fae69e] hover:bg-[#251e12] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-[#fae69e]" />
                <span>
                  {reservedSuccess ? 'Added to Cart ✓' : 'Add to Cart'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  addToCart({
                    productId: produce.id,
                    name: produce.name,
                    image: produce.images && produce.images[0] ? produce.images[0] : 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea',
                    price: produce.pricePerUnit,
                    unit: produce.unit,
                    farmerName: produce.farmerName,
                  }, 1);
                  onClose();
                  navigate('/checkout');
                }}
                className="flex-1 py-3.5 px-5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#fae69e] to-[#c9a227] text-[#0a0a0a] font-bold text-xs uppercase tracking-widest hover:brightness-110 active:scale-[0.99] transition-all shadow-[0_0_25px_rgba(212,175,55,0.4)] cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Instant Checkout →</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Write a Review Modal */}
      <AnimatePresence>
        {isWriteReviewOpen && (
          <WriteReviewModal
            isOpen={isWriteReviewOpen}
            onClose={() => setIsWriteReviewOpen(false)}
            farmerId={farmerId}
            farmerName={produce.farmerName}
            produceId={produce.id}
            produceName={produce.name}
          />
        )}
      </AnimatePresence>
    </>
  );
};
