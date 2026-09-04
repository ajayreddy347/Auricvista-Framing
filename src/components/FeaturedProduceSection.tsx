import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ShoppingBag, Plus, Check, MapPin } from 'lucide-react';
import { useProduce, ProduceListing } from '../context/ProduceContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedProduceName, getLocalizedUnit } from '../utils/produceLocalization';
import { getProduceImage } from '../utils/produceImages';
import { ProductDetailModal } from './ProductDetailModal';

export const FeaturedProduceSection: React.FC = () => {
  const { language, t } = useLanguage();
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
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#12100d]/80 via-[#16130f]/75 to-[#0e140f]/80 backdrop-blur-[2px] overflow-hidden"
    >
      {/* Subtle organic ambient backlight */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[350px] bg-[radial-gradient(ellipse,rgba(212,175,55,0.06)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[300px] bg-[radial-gradient(ellipse,rgba(34,197,94,0.04)_0%,transparent_70%)] blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1e1a12] border border-[#d4af37]/35 mb-3.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="text-[11px] font-mono font-bold tracking-widest text-[#fae69e] uppercase">
                {t('featured.eyebrow', 'Direct Farm Harvests')}
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#fcfbf7] tracking-tight">
              {t('featured.title', 'Featured Fresh Produce')}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#d0cbc0] font-sans max-w-xl">
              {t('featured.subtext', 'Harvested at dawn by certified growers across Indian states. 100% farm-traceable with direct pricing.')}
            </p>
          </div>

          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-serif font-bold uppercase tracking-wider text-[#fae69e] hover:text-[#ffffff] hover:translate-x-1 transition-all"
          >
            <span>{t('featured.viewAll', 'View All 79+ Harvests')}</span>
            <ArrowRight className="w-4 h-4 text-[#d4af37]" />
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredListings.map((produce) => {
            const imgSrc = getProduceImage(produce);
            const isAdded = addedIds[produce.id];

            return (
              <motion.div
                key={produce.id}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSelectedProduct(produce)}
                className="group flex flex-col bg-[#1a1612]/95 rounded-2xl border border-[#d4af37]/25 hover:border-[#fae69e]/70 overflow-hidden cursor-pointer shadow-lg hover:shadow-[0_0_30px_rgba(212,175,55,0.22)] transition-all duration-300 backdrop-blur-sm"
              >
                {/* Product Image Container */}
                <div className="relative aspect-square w-full bg-[#201c15] overflow-hidden">
                  <img
                    src={imgSrc}
                    alt={getLocalizedProduceName(produce.name, language)}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#12100d]/90 backdrop-blur-md border border-[#d4af37]/35 text-[10px] font-mono text-[#fae69e] uppercase tracking-wider">
                    {produce.category}
                  </div>
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#142014]/90 backdrop-blur-md border border-[#34d399]/40 text-[10px] font-mono text-[#34d399]">
                    {produce.quantity} {produce.unit}
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-5 flex flex-col justify-between flex-1 space-y-4">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#fcfbf7] group-hover:text-[#fae69e] transition-colors line-clamp-1">
                      {produce.name}
                    </h3>
                    <p className="text-xs text-[#aba79c] flex items-center gap-1.5 mt-1 font-sans">
                      <MapPin className="w-3 h-3 text-[#d4af37] shrink-0" />
                      <span className="truncate">{produce.farmerName} • {produce.farmLocation.split(',')[0]}</span>
                    </p>
                  </div>

                  {/* Price & Action Row */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#d4af37]/15">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#8e8b82] block">Direct Farm Gate</span>
                      <span className="text-lg font-mono font-bold text-[#fae69e]">
                        ₹{produce.pricePerUnit}
                        <span className="text-xs text-[#aba79c] font-normal">/{getLocalizedUnit(produce.unit, language)}</span>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleQuickAdd(e, produce)}
                      className={`p-2.5 rounded-xl font-serif text-xs font-bold uppercase transition-all duration-300 flex items-center justify-center cursor-pointer shadow-md ${
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
