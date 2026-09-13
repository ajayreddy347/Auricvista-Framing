import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ShoppingBag, Plus, Check, MapPin } from 'lucide-react';
import { useProduce, ProduceListing } from '../context/ProduceContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { getLocalizedProduceName, getLocalizedUnit } from '../utils/produceLocalization';
import { getProduceImage } from '../utils/produceImages';
import { ProductDetailModal } from './ProductDetailModal';
import { ProductImage } from './ProductImage';

export const FeaturedProduceSection: React.FC = () => {
  const { language, t } = useLanguage();
  const { isDark } = useTheme();
  const { listings } = useProduce();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<ProduceListing | null>(null);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  // Select 8 top diverse, authentic seasonal listings
  const featuredListings = listings
    .filter((p) => p.quantity > 0 && p.status === 'Active')
    .slice(0, 8);

  const handleQuickAdd = (e: React.MouseEvent, produce: ProduceListing) => {
    e.stopPropagation();
    const imgSrc = getProduceImage(produce);
    addToCart(
      {
        productId: produce.id,
        name: produce.name,
        image: imgSrc,
        price: produce.pricePerUnit,
        unit: produce.unit,
        farmerName: produce.farmerName,
        maxAvailable: produce.quantity,
      },
      1
    );
    setAddedIds((prev) => ({ ...prev, [produce.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [produce.id]: false }));
    }, 1500);
  };

  return (
    <section
      id="featured-produce"
      className={`relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 transition-colors duration-300 overflow-hidden ${
        isDark
          ? 'bg-gradient-to-b from-[#12100d]/80 via-[#16130f]/75 to-[#0e140f]/80 backdrop-blur-[2px]'
          : 'bg-gradient-to-b from-[#ffffff] via-[#fbf9f5] to-[#ffffff]'
      }`}
    >
      {/* Subtle organic ambient backlight */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        <div className={`absolute top-1/4 left-1/4 w-[600px] h-[350px] blur-3xl ${
          isDark ? 'bg-[radial-gradient(ellipse,rgba(212,175,55,0.06)_0%,transparent_70%)]' : 'bg-[radial-gradient(ellipse,rgba(212,175,55,0.08)_0%,transparent_70%)]'
        }`} />
        <div className={`absolute bottom-1/4 right-1/4 w-[500px] h-[300px] blur-3xl ${
          isDark ? 'bg-[radial-gradient(ellipse,rgba(34,197,94,0.04)_0%,transparent_70%)]' : 'bg-[radial-gradient(ellipse,rgba(34,197,94,0.06)_0%,transparent_70%)]'
        }`} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border mb-3.5 shadow-xs ${
              isDark ? 'bg-[#1e1a12] border-[#d4af37]/35 text-[#fae69e]' : 'bg-white border-[#d4af37]/45 text-[#8f6208]'
            }`}>
              <Sparkles className={`w-3.5 h-3.5 ${isDark ? 'text-[#d4af37]' : 'text-[#8f6208]'}`} />
              <span className="text-[11px] font-mono font-bold tracking-widest uppercase">
                {t('featured.eyebrow', 'Direct Farm Harvests')}
              </span>
            </div>
            <h2 className={`font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight ${
              isDark ? 'text-[#fcfbf7]' : 'text-[#1c1917]'
            }`}>
              {t('featured.title', 'Featured Fresh Produce')}
            </h2>
            <p className={`mt-2 text-sm sm:text-base font-sans max-w-xl ${
              isDark ? 'text-[#d0cbc0]' : 'text-[#57534e]'
            }`}>
              {t('featured.subtext', 'Harvested at dawn by certified growers across Indian states. 100% farm-traceable with direct pricing.')}
            </p>
          </div>

          <Link
            to="/marketplace"
            className={`inline-flex items-center gap-2 text-xs sm:text-sm font-serif font-bold uppercase tracking-wider hover:translate-x-1 transition-all ${
              isDark ? 'text-[#fae69e] hover:text-[#ffffff]' : 'text-[#8f6208] hover:text-[#1c1917]'
            }`}
          >
            <span>{t('featured.viewAll', 'View All 79+ Harvests')}</span>
            <ArrowRight className={`w-4 h-4 ${isDark ? 'text-[#d4af37]' : 'text-[#8f6208]'}`} />
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {featuredListings.map((produce) => {
            const imgSrc = getProduceImage(produce);
            const isAdded = addedIds[produce.id];

            return (
              <motion.div
                key={produce.id}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSelectedProduct(produce)}
                className={`group flex flex-col rounded-2xl border overflow-hidden cursor-pointer transition-all duration-300 backdrop-blur-xs ${
                  isDark
                    ? 'bg-[#1a1612]/95 border-[#d4af37]/25 hover:border-[#fae69e]/70 shadow-lg hover:shadow-[0_0_30px_rgba(212,175,55,0.22)]'
                    : 'bg-white border-[#e7e4dc] hover:border-[#b89120] shadow-sm hover:shadow-xl hover:shadow-black/5'
                }`}
              >
                {/* Product Image Container */}
                <div className={`relative aspect-square w-full overflow-hidden ${
                  isDark ? 'bg-[#201c15]' : 'bg-[#f4efe6]'
                }`}>
                  <ProductImage
                    src={imgSrc}
                    alt={getLocalizedProduceName(produce.name, language)}
                    productName={getLocalizedProduceName(produce.name, language)}
                    category={produce.category}
                    size="md"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className={`absolute top-2 sm:top-3 left-2 sm:left-3 px-2 py-0.5 sm:py-1 rounded-full backdrop-blur-md border text-[9px] sm:text-[10px] font-mono uppercase tracking-wider ${
                    isDark
                      ? 'bg-[#12100d]/90 border-[#d4af37]/35 text-[#fae69e]'
                      : 'bg-white/95 border-[#e7e4dc] text-[#8f6208] shadow-xs'
                  }`}>
                    {produce.category}
                  </div>
                  <div className={`absolute top-2 sm:top-3 right-2 sm:right-3 px-2 py-0.5 sm:py-1 rounded-full backdrop-blur-md border text-[9px] sm:text-[10px] font-mono ${
                    isDark
                      ? 'bg-[#142014]/90 border-[#34d399]/40 text-[#34d399]'
                      : 'bg-[#f0fdf4] border-[#86efac] text-[#166534]'
                  }`}>
                    {produce.quantity} {getLocalizedUnit(produce.unit, language)}
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-3 sm:p-5 flex flex-col justify-between flex-1 space-y-3 sm:space-y-4">
                  <div>
                    <h3 className={`font-serif text-sm sm:text-base md:text-lg font-bold transition-colors line-clamp-1 ${
                      isDark
                        ? 'text-[#fcfbf7] group-hover:text-[#fae69e]'
                        : 'text-[#1c1917] group-hover:text-[#8f6208]'
                    }`}>
                      {getLocalizedProduceName(produce.name, language)}
                    </h3>
                    <p className={`text-[11px] sm:text-xs flex items-center gap-1.5 mt-1 font-sans ${
                      isDark ? 'text-[#aba79c]' : 'text-[#78716c]'
                    }`}>
                      <MapPin className={`w-3 h-3 shrink-0 ${isDark ? 'text-[#d4af37]' : 'text-[#8f6208]'}`} />
                      <span className="truncate">{produce.farmerName} • {produce.farmLocation.split(',')[0]}</span>
                    </p>
                  </div>

                  {/* Price & Action Row */}
                  <div className={`flex items-center justify-between pt-2 sm:pt-3 border-t ${
                    isDark ? 'border-[#d4af37]/15' : 'border-[#e7e4dc]'
                  }`}>
                    <div>
                      <span className={`text-[9px] sm:text-[10px] font-mono uppercase tracking-wider block ${
                        isDark ? 'text-[#8e8b82]' : 'text-[#78716c]'
                      }`}>Direct Farm Gate</span>
                      <span className={`text-base sm:text-lg font-mono font-bold ${
                        isDark ? 'text-[#fae69e]' : 'text-[#8f6208]'
                      }`}>
                        ₹{produce.pricePerUnit}
                        <span className={`text-[11px] sm:text-xs font-normal ${
                          isDark ? 'text-[#aba79c]' : 'text-[#78716c]'
                        }`}>/{getLocalizedUnit(produce.unit, language)}</span>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleQuickAdd(e, produce)}
                      className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl font-serif text-xs font-bold uppercase transition-all duration-300 flex items-center justify-center cursor-pointer shadow-md ${
                        isAdded
                          ? 'bg-[#34d399] text-[#0a0a0a]'
                          : 'bg-gradient-to-r from-[#fae69e] to-[#d4af37] text-[#0a0a0a] hover:brightness-110 active:scale-95'
                      }`}
                      title="Add to Basket"
                    >
                      {isAdded ? (
                        <Check className="w-4 h-4 stroke-[3]" />
                      ) : (
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          produce={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
};
