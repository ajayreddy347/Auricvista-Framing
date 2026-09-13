import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  ChefHat,
  Package,
  Layers,
} from 'lucide-react';
import { StarRating } from './StarRating';
import { WriteReviewModal } from './WriteReviewModal';
import { ProduceListing } from '../context/ProduceContext';
import { useReviews } from '../context/ReviewsContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { Link, useNavigate } from 'react-router-dom';
import { getProduceImage } from '../utils/produceImages';
import { getLocalizedProduceName, getLocalizedCategory, getLocalizedUnit } from '../utils/produceLocalization';
import { findFarmerByListingOrName, getLocalizedHighlightBadge } from '../utils/farmerLocalization';
import { GoogleFarmMap } from './GoogleFarmMap';
import { ProductImage } from './ProductImage';
import { useTheme } from '../context/ThemeContext';

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
  const { language, t } = useLanguage();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [reservedSuccess, setReservedSuccess] = useState(false);
  const [selectedAiTab, setSelectedAiTab] = useState<'culinary' | 'storage' | 'farmer' | 'seasonal'>('culinary');

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [produce?.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!produce) return null;

  const productStats = getProductStats(produce.id);
  const productReviews = getProductReviews(produce.id);

  const matchedFarmer = findFarmerByListingOrName(produce.farmerName, produce.farmerId);
  const farmerId = produce.farmerId || matchedFarmer.farmerId || 'AV-FARM-1001';

  const canWriteReview = isLoggedIn && userRole === 'customer';
  const isSoldOut = produce.status === 'Sold Out' || produce.quantity <= 0;

  const handleReserve = () => {
    if (isSoldOut) return;
    addToCart(
      {
        productId: produce.id,
        name: produce.name,
        image: getProduceImage(produce),
        price: produce.pricePerUnit,
        unit: produce.unit,
        farmerName: produce.farmerName,
        farmerId: produce.farmerId,
        maxAvailable: produce.quantity,
      },
      1
    );
    setReservedSuccess(true);
    setTimeout(() => {
      setReservedSuccess(false);
    }, 2500);
  };

  // Dynamic AI Tab Content based on specific produce name
  const aiTabContent = useMemo(() => {
    const name = produce.name.toLowerCase();

    if (selectedAiTab === 'culinary') {
      if (name.includes('turmeric')) {
        return '• Traditional Golden Milk (Haldi Doodh)\n• Fresh curries, gravies, and Ayurvedic tonics\n• High natural curcumin retention due to single-estate shade drying.';
      }
      if (name.includes('saffron')) {
        return '• Infuse 3-4 strands in warm milk for Biryani, Kheer, or herbal teas.\n• Store sealed away from direct sunlight for intense aroma.';
      }
      if (name.includes('mango')) {
        return '• Enjoy fresh slices, authentic Aamras, mango shakes, or seasonal fruit salads.\n• Ripens naturally with sweet aromatic pulp.';
      }
      if (name.includes('spinach')) {
        return '• Palak Paneer, Dal Palak, crispy pakodas, or healthy green smoothies.\n• Quick steam or sauté to retain natural iron and chlorophyll.';
      }
      if (name.includes('carrot')) {
        return '• Gajar Ka Halwa, fresh crunchy salads, vegetable sambar, and mixed vegetable curries.';
      }
      if (name.includes('tomato')) {
        return '• Fresh rasam, rich tomato gravy, chutneys, and salads.\n• Plump and juicy with balanced natural acidity.';
      }
      if (name.includes('jaggery')) {
        return '• Natural unrefined sweetener for tea, traditional sweets, payasam, and daily cooking.';
      }
      return '• Ideal for everyday wholesome home cooking, seasonal traditional recipes, and nutrient-dense dishes.';
    }

    if (selectedAiTab === 'storage') {
      if (name.includes('spinach') || name.includes('leaf')) {
        return '• Store dry wrapped in a paper towel inside a breathable container in the refrigerator (crisp for 4-5 days).';
      }
      if (name.includes('turmeric') || name.includes('saffron') || name.includes('spice')) {
        return '• Store in an airtight glass jar in a cool, dark pantry away from moisture and heat.';
      }
      if (name.includes('mango')) {
        return '• Keep at room temperature until fragrant and soft, then refrigerate for up to 3 days.';
      }
      return '• Keep in a cool, well-ventilated dry space or standard refrigerator compartment away from direct sunlight.';
    }

    if (selectedAiTab === 'farmer') {
      return `• Cultivated by ${produce.farmerName} (Farmer ID: ${farmerId}) in ${produce.farmLocation}.\n• Direct farm-to-consumer fulfillment with zero intermediaries.`;
    }

    // Seasonal
    return `• Harvested fresh on ${produce.harvestDate || 'dawn schedule'}.\n• Grown naturally according to seasonal soil conditions in ${produce.farmLocation}.`;
  }, [selectedAiTab, produce, farmerId]);

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
        {/* Backdrop: Warm-white in Light Mode, dark in Dark Mode */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className={`fixed inset-0 ${isDark ? 'bg-black/90 backdrop-blur-md' : 'bg-[#faf8f5]/85 backdrop-blur-md'}`}
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
          className={`relative w-full max-w-xl sm:max-w-2xl max-h-[90vh] flex flex-col rounded-3xl ${
            isDark
              ? 'bg-gradient-to-b from-[#16130e] via-[#0f0e0c] to-[#080706] border-2 border-[#d4af37]/45 shadow-[0_0_60px_-15px_rgba(212,175,55,0.4)] text-[#fcfbf7]'
              : 'bg-white border-2 border-[#d4af37]/60 shadow-[0_20px_50px_rgba(0,0,0,0.15)] text-[#1c1917]'
          } z-10 overflow-hidden my-auto`}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center border transition-all cursor-pointer z-40 ${
              isDark
                ? 'bg-[#18150d]/90 border-[#d4af37]/40 text-[#aba79c] hover:text-[#fae69e] hover:border-[#d4af37] shadow-lg'
                : 'bg-white/95 border-[#d4af37]/60 text-stone-700 hover:text-stone-950 hover:bg-[#fae69e]/30 shadow-md'
            }`}
            aria-label={t('product.close', 'Close')}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Scrollable Body */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
            {!isDark ? (
              /* LIGHT MODE: Clean top title row + contained centered image card */
              <div className="space-y-3">
                {/* Header title block */}
                <div className="pr-8">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#92700c] font-bold">
                      {getLocalizedCategory(produce.category, language)}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 font-semibold">
                      ✓ {t('market.inStock', 'Direct Harvest')}
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1c1917]">
                    {getLocalizedProduceName(produce.name, language)}
                  </h2>
                </div>

                {/* Contained Image Card (NOT full screen) */}
                <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden border border-[#d4af37]/40 bg-[#faf8f5] shadow-sm flex items-center justify-center p-2">
                  <ProductImage
                    src={getProduceImage(produce)}
                    alt={produce.name}
                    productName={getLocalizedProduceName(produce.name, language)}
                    category={produce.category}
                    size="detail"
                    className="w-full h-full object-contain rounded-xl"
                  />
                  {/* Price Badge */}
                  <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#d4af37] text-xs sm:text-sm font-mono font-bold text-[#92700c] shadow-md">
                    ₹{produce.pricePerUnit} / {getLocalizedUnit(produce.unit, language)}
                  </div>
                  {/* Harvest Date Tag */}
                  <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#d4af37]/50 text-[11px] font-mono text-stone-700 flex items-center gap-1.5 shadow-md">
                    <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>{t('market.harvested', 'Harvested')} {produce.harvestDate || 'Fresh Dawn'}</span>
                  </div>
                </div>
              </div>
            ) : (
              /* DARK MODE: Original Cinematic Banner */
              <div className="relative h-60 sm:h-72 rounded-2xl overflow-hidden border border-[#d4af37]/35 shadow-inner bg-neutral-900">
                <ProductImage
                  src={getProduceImage(produce)}
                  alt={produce.name}
                  productName={getLocalizedProduceName(produce.name, language)}
                  category={produce.category}
                  size="detail"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                {/* Price Tag */}
                <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-[#d4af37]/60 text-xs sm:text-sm font-mono font-bold text-[#fae69e] shadow-lg">
                  ₹{produce.pricePerUnit} / {getLocalizedUnit(produce.unit, language)}
                </div>

                {/* Harvest Date Tag */}
                <div className="absolute top-3 right-12 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-[#d4af37]/40 text-[11px] font-mono text-[#e8dfca] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>{t('market.harvested', 'Harvested')} {produce.harvestDate || 'Fresh Dawn'}</span>
                </div>

                {/* Bottom Info Overlay */}
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#fae69e] font-semibold">
                      {getLocalizedCategory(produce.category, language)} • {t('market.inStock', 'Direct Harvest')}
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#fcfbf7] drop-shadow-md">
                      {getLocalizedProduceName(produce.name, language)}
                    </h2>
                  </div>
                </div>
              </div>
            )}

            {/* Farmer Transparency Card */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
              isDark
                ? 'bg-[#12110c] border-[#d4af37]/30 text-[#fcfbf7]'
                : 'bg-[#faf8f5] border-[#d4af37]/40 text-[#1c1917] shadow-sm'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center font-serif font-bold text-sm ${
                  isDark
                    ? 'bg-[#221c10] border-[#d4af37]/40 text-[#fae69e]'
                    : 'bg-white border-[#d4af37]/50 text-[#b89120] shadow-sm'
                }`}>
                  {produce.farmerName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className={`font-serif text-base font-bold ${isDark ? 'text-[#fcfbf7]' : 'text-[#1c1917]'}`}>
                      {produce.farmerName}
                    </h4>
                    {matchedFarmer.highlightBadge && (
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
                        isDark
                          ? 'bg-[#1c170d] text-[#fae69e] border-[#d4af37]/30'
                          : 'bg-[#fef9ee] text-[#b89120] border-[#d4af37]/40 font-semibold'
                      }`}>
                        {getLocalizedHighlightBadge(matchedFarmer.highlightBadge, language)}
                      </span>
                    )}
                    {farmerId && (
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.2 rounded border ${
                        isDark
                          ? 'text-[#fae69e] bg-[#221c10] border-[#d4af37]/40'
                          : 'text-[#92700c] bg-white border-[#d4af37]/50'
                      }`}>
                        {farmerId}
                      </span>
                    )}
                  </div>
                  <p className={`text-xs flex items-center gap-1 mt-0.5 ${isDark ? 'text-[#aba79c]' : 'text-stone-600'}`}>
                    <MapPin className="w-3 h-3 text-[#d4af37]" />
                    {produce.farmLocation || matchedFarmer.location}
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
                  className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition-all cursor-pointer shrink-0 ${
                    isDark
                      ? 'bg-[#18150d] border-[#d4af37]/40 text-[#fae69e] hover:border-[#d4af37]'
                      : 'bg-white border-[#d4af37]/50 text-[#92700c] hover:bg-[#fae69e]/30 shadow-sm'
                  }`}
                >
                  {t('farmer.viewFarmReviews', 'View Farmer Profile')} →
                </button>
              )}
            </div>

            {/* Farm Location Map Preview */}
            <GoogleFarmMap
              singleLocation={{
                location: produce.farmLocation || matchedFarmer.location,
                city: (produce.farmLocation || matchedFarmer.location).split(',')[0]?.trim() || 'Mandya',
                state: (produce.farmLocation || matchedFarmer.location).split(',')[1]?.trim() || 'Karnataka',
                farmerName: produce.farmerName,
                farmerId: farmerId,
              }}
            />

            {/* AI-POWERED PRODUCT SECTION: "Ask Auric Arohi AI" */}
            <div className={`p-4 sm:p-5 rounded-2xl border-2 space-y-3 ${
              isDark
                ? 'bg-[#12100c] border-[#d4af37]/35'
                : 'bg-[#faf8f5] border-[#d4af37]/40 shadow-sm'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-[#d4af37]" />
                  <h5 className={`font-mono text-xs uppercase tracking-wider font-semibold ${
                    isDark ? 'text-[#fae69e]' : 'text-[#92700c]'
                  }`}>
                    Ask Auric Arohi AI
                  </h5>
                </div>
                <span className={`text-[10px] font-mono ${isDark ? 'text-[#8e8b82]' : 'text-stone-500'}`}>
                  Instant Culinary & Crop Insights
                </span>
              </div>

              {/* Interactive Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                {[
                  { id: 'culinary', label: 'Culinary Uses' },
                  { id: 'storage', label: 'Storage Advice' },
                  { id: 'farmer', label: 'Grower Info' },
                  { id: 'seasonal', label: 'Seasonality' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSelectedAiTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-mono whitespace-nowrap transition-all border cursor-pointer ${
                      selectedAiTab === tab.id
                        ? isDark
                          ? 'bg-[#221c10] border-[#d4af37] text-[#fae69e] font-bold shadow-sm'
                          : 'bg-[#fae69e]/40 border-[#d4af37] text-[#1c1917] font-bold shadow-sm'
                        : isDark
                          ? 'bg-[#18150e] border-[#d4af37]/20 text-[#8e8b82] hover:text-[#fcfbf7]'
                          : 'bg-white border-stone-200 text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab AI Content */}
              <div className={`p-3.5 rounded-xl border text-xs leading-relaxed space-y-2 whitespace-pre-line font-sans ${
                isDark
                  ? 'bg-[#18150e] border-[#d4af37]/20 text-[#aba79c]'
                  : 'bg-white border-[#d4af37]/25 text-[#44403c]'
              }`}>
                {aiTabContent}
                <div className={`pt-2 border-t flex items-center justify-between text-[10px] font-mono ${
                  isDark ? 'border-[#d4af37]/15 text-[#736f66]' : 'border-[#d4af37]/20 text-stone-500'
                }`}>
                  <span>✓ Verified Database Listing Data</span>
                  <span>Agricultural Knowledge Layer</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h5 className={`font-mono text-xs uppercase tracking-wider ${isDark ? 'text-[#d4af37]' : 'text-[#92700c]'}`}>
                {t('product.description', 'Harvest Story & Description')}
              </h5>
              <p className={`text-xs sm:text-sm leading-relaxed font-sans ${isDark ? 'text-[#aba79c]' : 'text-stone-700'}`}>
                {produce.description}
              </p>
            </div>

            {/* Action Area: Reserve / Add to Cart */}
            <div className={`pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${
              isDark ? 'border-[#d4af37]/20' : 'border-[#d4af37]/30'
            }`}>
              <div>
                <span className={`text-[10px] font-mono uppercase block ${isDark ? 'text-[#8e8b82]' : 'text-stone-500'}`}>
                  {t('market.stockAvailable', 'Available Harvest')}
                </span>
                <span className={`text-sm font-mono font-bold ${
                  isSoldOut
                    ? 'text-red-500'
                    : isDark
                      ? 'text-[#6ee7b7]'
                      : 'text-emerald-700'
                }`}>
                  {isSoldOut ? t('market.soldOut', 'Sold Out') : `${produce.quantity} ${produce.unit} ${t('market.inStock', 'Available')}`}
                </span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {reservedSuccess ? (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      openCart();
                    }}
                    className={`w-full sm:w-auto px-6 py-3 rounded-2xl border text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                      isDark
                        ? 'bg-[#102416] border-[#34d399] text-[#34d399]'
                        : 'bg-emerald-50 border-emerald-500 text-emerald-700'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Added! Open Basket</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleReserve}
                    disabled={isSoldOut}
                    className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#b89120] text-[#0a0a0a] text-xs font-serif font-bold uppercase tracking-wider hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(212,175,55,0.3)] cursor-pointer flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#0a0a0a]" />
                    <span>{t('market.addToCart', 'Add to Cart')}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Write Review Modal */}
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
    </>
  );
};
