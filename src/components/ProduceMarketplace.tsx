import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Carrot,
  Apple,
  Wheat,
  CircleDot,
  Milk,
  Sprout,
  ArrowRight,
  Sparkles,
  Search,
  Bot,
  MapPin,
  Calendar,
  ShoppingBag,
  SlidersHorizontal,
  ArrowUpDown,
  Check,
} from 'lucide-react';
import { StarRating } from './StarRating';
import { ProductDetailModal } from './ProductDetailModal';
import { FarmerProfileModal, FarmerProfileData } from './FarmerProfileModal';
import { useProduce, ProduceListing } from '../context/ProduceContext';
import { useReviews } from '../context/ReviewsContext';
import { useCart } from '../context/CartContext';

/* NOTE: In the next development phase, all local/mock states (listings, reviews, auth, cart) 
   should be replaced with real backend/database calls (e.g., Firebase Firestore, Cloud SQL, or custom API). */

export const ProduceMarketplace: React.FC = () => {
  const { listings } = useProduce();
  const { getProductStats } = useReviews();
  const { addToCart } = useCart();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'highest-rated' | 'ai-score' | 'price-low' | 'price-high' | 'newest'>('highest-rated');
  const [selectedProduct, setSelectedProduct] = useState<ProduceListing | null>(null);
  const [selectedFarmer, setSelectedFarmer] = useState<FarmerProfileData | null>(null);
  const [cartSuccessId, setCartSuccessId] = useState<string | null>(null);

  const categories = [
    {
      id: 'vegetables',
      title: 'Vegetables',
      icon: Carrot,
      examples: 'Tomato, Onion, Potato, Spinach, Carrot',
      tag: 'Daily Harvest',
      count: '42 Farms Listing',
    },
    {
      id: 'fruits',
      title: 'Fruits',
      icon: Apple,
      examples: 'Mango, Banana, Orange, Apple',
      tag: 'Orchard Picked',
      count: '28 Farms Listing',
    },
    {
      id: 'grains',
      title: 'Grains',
      icon: Wheat,
      examples: 'Rice, Wheat, Millets',
      tag: 'Heritage Crops',
      count: '19 Farms Listing',
    },
    {
      id: 'pulses',
      title: 'Pulses',
      icon: CircleDot,
      examples: 'Dal, Beans, Lentils',
      tag: 'Protein Rich',
      count: '15 Farms Listing',
    },
    {
      id: 'farm-fresh',
      title: 'Farm Fresh',
      icon: Milk,
      examples: 'Milk, Curd, Paneer, Eggs',
      tag: 'Dairy & Poultry',
      count: '23 Farms Listing',
    },
    {
      id: 'organic-natural',
      title: 'Organic / Natural',
      icon: Sprout,
      examples: 'Naturally grown, chemical-free produce (subject to farmer offerings)',
      tag: 'Zero Chemical',
      count: '31 Farms Listing',
    },
  ];

  const categoryTabs = ['All', 'Vegetables', 'Fruits', 'Grains', 'Pulses', 'Dairy & Fresh'];

  // Filter listings
  const filteredListings = listings.filter((item) => {
    if (item.status !== 'Active') return false;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.farmLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.farmerName.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedCategoryTab === 'All') return matchesSearch;
    if (selectedCategoryTab === 'Dairy & Fresh') {
      return matchesSearch && item.category === 'Farm Fresh';
    }
    return (
      matchesSearch &&
      item.category.toLowerCase().includes(selectedCategoryTab.toLowerCase())
    );
  });

  // Sort filtered listings
  const sortedListings = [...filteredListings].sort((a, b) => {
    if (sortBy === 'highest-rated') {
      const statsA = getProductStats(a.id);
      const statsB = getProductStats(b.id);
      return statsB.average - statsA.average;
    }
    if (sortBy === 'ai-score') {
      const scoreA = a.aiQualityRating?.qualityScore ?? 0;
      const scoreB = b.aiQualityRating?.qualityScore ?? 0;
      return scoreB - scoreA;
    }
    if (sortBy === 'price-low') {
      return Number(a.pricePerUnit) - Number(b.pricePerUnit);
    }
    if (sortBy === 'price-high') {
      return Number(b.pricePerUnit) - Number(a.pricePerUnit);
    }
    if (sortBy === 'newest') {
      return new Date(b.harvestDate || '').getTime() - new Date(a.harvestDate || '').getTime();
    }
    return 0;
  });

  const handleAddToCart = (e: React.MouseEvent, prod: ProduceListing) => {
    e.stopPropagation();
    addToCart({
      productId: prod.id,
      name: prod.name,
      image: prod.images && prod.images[0] ? prod.images[0] : 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
      price: prod.pricePerUnit,
      unit: prod.unit,
      farmerName: prod.farmerName,
    }, 1);
    setCartSuccessId(prod.id);
    setTimeout(() => {
      setCartSuccessId(null);
    }, 1800);
  };

  const handleOpenFarmer = (farmerName: string) => {
    if (farmerName.toLowerCase().includes('lakshmi')) {
      setSelectedFarmer({
        id: 'lakshmi-devi',
        name: 'Lakshmi Devi',
        role: 'Farmer',
        location: 'Kolar',
        experience: '12 years',
        specialty: 'Hydroponic Greens & Exotic Melons',
        acreage: '8 Acres Precision Soil',
        initials: 'LD',
        highlightBadge: 'Zero Pesticide Pioneer',
      });
    } else if (farmerName.toLowerCase().includes('suresh')) {
      setSelectedFarmer({
        id: 'suresh-naidu',
        name: 'Suresh Naidu',
        role: 'Farmer',
        location: 'Hosur',
        experience: '22 years',
        specialty: 'Heritage Millets, Pulses & Desi Dairy',
        acreage: '26 Acres Ancestral Farm',
        initials: 'SN',
        highlightBadge: 'Heritage Cultivator',
      });
    } else {
      setSelectedFarmer({
        id: 'ravi-kumar',
        name: 'Ravi Kumar',
        role: 'Farmer',
        location: 'Chikkaballapur',
        experience: '18 years',
        specialty: 'Organic Vine Tomatoes & Bell Peppers',
        acreage: '14 Acres Certified Natural',
        initials: 'RK',
        highlightBadge: 'Master Grower',
      });
    }
  };

  // Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
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
    hidden: { opacity: 0, y: 24, scale: 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <section
      id="marketplace-section"
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#070707] border-t border-[#d4af37]/15 overflow-hidden"
    >
      {/* Background ambient gold lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[550px] rounded-full gold-ambient-radial blur-3xl opacity-35" />
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
              id="marketplace-eyebrow-pill"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14120c]/80 border border-[#d4af37]/30 backdrop-blur-md shadow-[0_0_15px_-5px_rgba(212,175,55,0.15)]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="text-[11px] font-mono font-medium tracking-[0.2em] text-[#e8dfca] uppercase">
                Direct Harvest Catalog & Reviews
              </span>
            </div>
          </motion.div>

          {/* Section Heading */}
          <motion.h2
            variants={itemFadeUp}
            id="marketplace-heading"
            className="font-serif text-3xl sm:text-5xl md:text-6xl font-medium tracking-[-0.02em] leading-[1.12] text-[#fcfbf7]"
          >
            <span className="block text-[#fcfbf7]">
              Fresh Produce Marketplace
            </span>
          </motion.h2>

          {/* Supporting Subtext */}
          <motion.p
            variants={itemFadeUp}
            id="marketplace-subtext"
            className="mt-4 sm:mt-5 text-base sm:text-lg md:text-xl text-[#aba79c] font-normal leading-relaxed font-sans"
          >
            Explore what local farmers are harvesting right now with verified AI Quality ratings and authentic customer reviews.
          </motion.p>

          {/* Search & Sort Controls */}
          <motion.div
            variants={itemFadeUp}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-3xl mx-auto"
          >
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4af37]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tomatoes, spinach, carrots, millets, farmer..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#12100c]/90 border border-[#d4af37]/35 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] text-xs sm:text-sm text-[#fcfbf7] placeholder-[#6e6a5f] outline-none shadow-[0_0_20px_rgba(212,175,55,0.1)] transition-all"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative w-full sm:w-auto shrink-0 flex items-center gap-2">
              <div className="relative w-full sm:w-56">
                <ArrowUpDown className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4af37] pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  aria-label="Sort produce listings"
                  className="w-full pl-10 pr-8 py-3 rounded-2xl bg-[#14120e] border border-[#d4af37]/45 text-xs font-mono text-[#fae69e] appearance-none cursor-pointer focus:outline-none focus:border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all"
                >
                  <option value="highest-rated" className="bg-[#14120e] text-[#fcfbf7]">Sort: Highest Rated</option>
                  <option value="ai-score" className="bg-[#14120e] text-[#fcfbf7]">Sort: AI Quality Score</option>
                  <option value="price-low" className="bg-[#14120e] text-[#fcfbf7]">Sort: Price: Low to High</option>
                  <option value="price-high" className="bg-[#14120e] text-[#fcfbf7]">Sort: Price: High to Low</option>
                  <option value="newest" className="bg-[#14120e] text-[#fcfbf7]">Sort: Newest Harvest</option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#d4af37] text-xs">
                  ▼
                </div>
              </div>
            </div>
          </motion.div>

          {/* Category Filter Pills */}
          <motion.div
            variants={itemFadeUp}
            className="mt-5 flex items-center justify-center gap-2 flex-wrap"
          >
            {categoryTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setSelectedCategoryTab(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
                  selectedCategoryTab === tab
                    ? 'bg-[#d4af37] text-[#0a0a0a] font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                    : 'bg-[#14120e] text-[#aba79c] hover:text-[#fcfbf7] border border-[#d4af37]/25 hover:border-[#d4af37]/50'
                }`}
              >
                {tab}
              </button>
            ))}
          </motion.div>
        </motion.div>

        {/* ========================================================================= */}
        {/* LIVE HARVEST PRODUCE CARDS GRID WITH DUAL RATINGS (AI + CUSTOMER)         */}
        {/* ========================================================================= */}
        <div className="mt-14 sm:mt-16">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#d4af37]/20">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#fae69e] font-semibold">
                Available Morning Harvests
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#18150d] text-[#8e8b82] border border-[#d4af37]/20">
                {sortedListings.length} Active
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#8e8b82] hidden sm:inline">
              Dual-Verification: AI Vision Inspection & Customer Ratings
            </span>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7"
          >
            {sortedListings.map((prod) => {
              const productStats = getProductStats(prod.id);
              const hasAiScore = Boolean(
                prod.aiQualityRating &&
                typeof prod.aiQualityRating.qualityScore === 'number' &&
                prod.aiQualityRating.qualityScore > 0
              );
              const aiScoreText = hasAiScore
                ? `${prod.aiQualityRating!.qualityScore.toFixed(1)}/10`
                : null;
              const isAddedToCart = cartSuccessId === prod.id;

              return (
                <motion.div
                  key={prod.id}
                  variants={cardVariants}
                  id={`product-card-${prod.id}`}
                  onClick={() => setSelectedProduct(prod)}
                  className="group relative p-5 sm:p-6 rounded-3xl bg-[#0e0d0b]/90 border border-[#d4af37]/25 backdrop-blur-xl card-lift-glow shadow-[0_0_25px_-10px_rgba(212,175,55,0.15)] cursor-pointer flex flex-col justify-between overflow-hidden"
                >
                  {/* Ambient Glow */}
                  <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-[#d4af37]/10 blur-xl pointer-events-none card-ambient-glow" />

                  <div>
                    {/* Produce Thumbnail & Price Overlay */}
                    <div className="relative h-44 rounded-2xl overflow-hidden mb-4 border border-[#d4af37]/25 group-hover:border-[#d4af37]/60 transition-colors">
                      <img
                        src={prod.images && prod.images[0] ? prod.images[0] : 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea'}
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/90 via-transparent to-transparent" />

                      {/* Price Badge */}
                      <div className="absolute top-2.5 left-2.5 px-3 py-1 rounded-full bg-black/85 backdrop-blur-md border border-[#d4af37]/60 text-xs font-mono font-bold text-[#fae69e] shadow-md">
                        ₹{prod.pricePerUnit} / {prod.unit}
                      </div>

                      {/* Category Tag */}
                      <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-[#18150d]/85 backdrop-blur-md border border-[#d4af37]/30 text-[10px] font-mono text-[#c9a227]">
                        {prod.category}
                      </div>

                      {/* Harvest Date */}
                      <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 text-[11px] font-mono text-[#e8dfca]">
                        <Calendar className="w-3 h-3 text-[#d4af37]" />
                        <span>Picked {prod.harvestDate}</span>
                      </div>
                    </div>

                    {/* Produce Title */}
                    <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#f5f3eb] tracking-wide mb-1 group-hover:text-[#fae69e] transition-colors">
                      {prod.name}
                    </h3>

                    {/* Farmer Attribution (Clickable -> Opens Farmer Profile) */}
                    <div className="flex items-center gap-1 text-xs text-[#aba79c] mb-3.5">
                      <MapPin className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                      <span className="truncate">
                        By{' '}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenFarmer(prod.farmerName);
                          }}
                          className="text-[#fae69e] hover:underline cursor-pointer font-medium"
                          title={`View ${prod.farmerName}'s Farm Dossier`}
                        >
                          {prod.farmerName}
                        </button>
                        {prod.farmLocation ? ` • ${prod.farmLocation.split(',')[0]}` : ''}
                      </span>
                    </div>

                    {/* ================================================================= */}
                    {/* DUAL RATING ROW: AI Quality Badge & Customer Rating Side-by-Side  */}
                    {/* ================================================================= */}
                    <div className="p-2.5 rounded-xl bg-[#14120e] border border-[#d4af37]/30 flex items-center justify-between flex-wrap gap-2 mb-4">
                      {/* AI Quality Score: small robot icon + "AI Quality: X.X/10", or hidden if unavailable */}
                      {hasAiScore && aiScoreText ? (
                        <div
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1a160d] border border-[#d4af37]/60 text-[11px] font-mono text-[#fae69e] shadow-[0_0_8px_rgba(212,175,55,0.15)]"
                          title="Gemini AI Multimodal Vision Agronomic Freshness Inspection"
                        >
                          <Bot className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                          <span>
                            AI Quality: <strong>{aiScoreText}</strong>
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] font-mono text-[#8e8b82] italic">
                          Standard Grade
                        </span>
                      )}

                      {/* Customer Rating: "⭐ 4.X (N reviews)" or "No reviews yet" in muted gray */}
                      <div className="flex items-center">
                        {productStats.totalCount > 0 ? (
                          <StarRating
                            rating={productStats.average}
                            size="xs"
                            showNumeric={true}
                            reviewCount={productStats.totalCount}
                          />
                        ) : (
                          <span className="text-xs font-mono text-[#8e8b82]">
                            No reviews yet
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom CTA with "Add to Cart" Gold Button */}
                  <div className="pt-3 border-t border-[#d4af37]/15 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(e, prod)}
                      className={`flex-1 py-2.5 px-3.5 rounded-xl font-mono text-xs uppercase tracking-wider font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                        isAddedToCart
                          ? 'bg-[#34d399] text-[#0a0a0a] shadow-[0_0_15px_rgba(52,211,153,0.4)]'
                          : 'bg-gradient-to-r from-[#d4af37] via-[#fae69e] to-[#c9a227] text-[#0a0a0a] hover:brightness-110 shadow-[0_0_15px_rgba(212,175,55,0.3)] active:scale-[0.98]'
                      }`}
                    >
                      {isAddedToCart ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#0a0a0a]" />
                          <span>Added to Cart</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5 text-[#0a0a0a]" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(prod);
                      }}
                      className="p-2.5 rounded-xl bg-[#14120e] hover:bg-[#201a0e] border border-[#d4af37]/35 hover:border-[#d4af37] text-[#fae69e] transition-colors cursor-pointer"
                      title="View Details & Reviews"
                      aria-label="View Details & Reviews"
                    >
                      <ArrowRight className="w-4 h-4 text-[#d4af37]" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* ========================================================================= */}
        {/* CATEGORY EXPLORER SECTION                                                */}
        {/* ========================================================================= */}
        <div className="mt-24 sm:mt-28">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#c9a227]">
              Regional Agricultural Clusters
            </span>
            <h3 className="font-serif text-2xl sm:text-4xl font-semibold text-[#fcfbf7] mt-1">
              Explore by Crop Classification
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {categories.map((cat) => {
              const IconComp = cat.icon;

              return (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCategoryTab(cat.title === 'Farm Fresh' ? 'Dairy & Fresh' : cat.title)}
                  className="group relative p-6 sm:p-7 rounded-3xl bg-[#0e0d0b]/80 border border-[#d4af37]/20 hover:border-[#d4af37] backdrop-blur-xl transition-all duration-300 shadow-[0_0_20px_-10px_rgba(212,175,55,0.1)] hover:shadow-[0_0_35px_-5px_rgba(212,175,55,0.3)] hover:-translate-y-1 cursor-pointer flex flex-col justify-between overflow-hidden"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2a2412] to-[#12100a] border border-[#d4af37]/40 flex items-center justify-center text-[#fae69e] shadow-[0_0_15px_-3px_rgba(212,175,55,0.25)] group-hover:scale-110 transition-transform">
                        <IconComp className="w-6 h-6" />
                      </div>

                      <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#171510] border border-[#d4af37]/20 text-[#c9a227]">
                        {cat.tag}
                      </span>
                    </div>

                    <h4 className="font-serif text-2xl font-semibold text-[#f5f3eb] tracking-wide mb-2 group-hover:text-[#fae69e] transition-colors">
                      {cat.title}
                    </h4>

                    <p className="text-xs sm:text-sm text-[#aba79c] leading-relaxed font-sans mb-6">
                      {cat.examples}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#d4af37]/15 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-[#8e8b82]">
                      {cat.count}
                    </span>
                    <div className="w-7 h-7 rounded-full bg-[#171510] border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] group-hover:bg-[#d4af37] group-hover:text-[#0a0a0a] transition-all">
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductDetailModal
            produce={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onFarmerClick={handleOpenFarmer}
          />
        )}
      </AnimatePresence>

      {/* Farmer Profile & Reviews Modal */}
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

