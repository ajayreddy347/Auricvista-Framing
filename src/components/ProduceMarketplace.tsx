import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Check,
  ShoppingBag,
  MapPin,
  Bot,
  Layers,
  Carrot,
  Apple,
  Flame,
  Wheat,
  CircleDot,
  Leaf,
  Sparkles,
  X,
  Eye,
  Filter,
  ArrowRight,
  User,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { ProductDetailModal } from './ProductDetailModal';
import { FarmerProfileModal, FarmerProfileData } from './FarmerProfileModal';
import { useProduce, ProduceListing } from '../context/ProduceContext';
import { useReviews } from '../context/ReviewsContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { getProduceImage } from '../utils/produceImages';
import { GoogleFarmMap } from './GoogleFarmMap';

export const ProduceMarketplace: React.FC = () => {
  const { listings, isLoading, error } = useProduce();
  const { getProductStats } = useReviews();
  const { addToCart } = useCart();
  const { t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-low' | 'price-high' | 'newest' | 'in-stock'>('recommended');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(1000);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProduceListing | null>(null);
  const [selectedFarmer, setSelectedFarmer] = useState<FarmerProfileData | null>(null);
  const [cartSuccessId, setCartSuccessId] = useState<string | null>(null);

  // Category definitions
  const categoryDefinitions = [
    {
      key: 'ALL',
      labelKey: 'market.allCategories',
      defaultLabel: 'All Produce',
      icon: Layers,
      emoji: '🧺',
    },
    {
      key: 'VEGETABLES',
      labelKey: 'market.vegetables',
      defaultLabel: 'Vegetables',
      icon: Carrot,
      emoji: '🥬',
      sectionTitleKey: 'market.sectionVegetables',
      sectionDefault: 'Fresh Vegetables',
      matchFn: (item: ProduceListing) => {
        const name = item.name.toLowerCase();
        const cat = item.category.toLowerCase();
        return (
          cat.includes('veg') ||
          (cat === 'farm fresh' && !name.includes('saffron') && !name.includes('jaggery')) ||
          name.includes('tomato') ||
          name.includes('carrot') ||
          name.includes('potato') ||
          name.includes('brinjal') ||
          name.includes('gourd') ||
          name.includes('radish')
        );
      },
    },
    {
      key: 'FRUITS',
      labelKey: 'market.fruits',
      defaultLabel: 'Fruits',
      icon: Apple,
      emoji: '🍎',
      sectionTitleKey: 'market.sectionFruits',
      sectionDefault: 'Fresh Fruits',
      matchFn: (item: ProduceListing) => {
        const name = item.name.toLowerCase();
        const cat = item.category.toLowerCase();
        return (
          cat.includes('fruit') ||
          name.includes('mango') ||
          name.includes('apple') ||
          name.includes('dragonfruit') ||
          name.includes('banana') ||
          name.includes('papaya') ||
          name.includes('orange') ||
          name.includes('guava')
        );
      },
    },
    {
      key: 'SPICES',
      labelKey: 'market.spices',
      defaultLabel: 'Spices & Seasonings',
      icon: Flame,
      emoji: '🌶️',
      sectionTitleKey: 'market.sectionSpices',
      sectionDefault: 'Spices & Seasonings',
      matchFn: (item: ProduceListing) => {
        const name = item.name.toLowerCase();
        const cat = item.category.toLowerCase();
        return (
          cat.includes('spice') ||
          name.includes('turmeric') ||
          name.includes('saffron') ||
          name.includes('pepper') ||
          name.includes('cardamom') ||
          name.includes('clove') ||
          name.includes('cinnamon') ||
          name.includes('ginger') ||
          name.includes('chilli')
        );
      },
    },
    {
      key: 'GRAINS & CEREALS',
      labelKey: 'market.grains',
      defaultLabel: 'Grains & Cereals',
      icon: Wheat,
      emoji: '🌾',
      sectionTitleKey: 'market.sectionGrains',
      sectionDefault: 'Grains & Cereals',
      matchFn: (item: ProduceListing) => {
        const name = item.name.toLowerCase();
        const cat = item.category.toLowerCase();
        return (
          cat.includes('grain') ||
          cat.includes('cereal') ||
          name.includes('rice') ||
          name.includes('wheat') ||
          name.includes('millet') ||
          name.includes('ragi') ||
          name.includes('jowar') ||
          name.includes('oats')
        );
      },
    },
    {
      key: 'PULSES & DALS',
      labelKey: 'market.pulses',
      defaultLabel: 'Pulses & Dals',
      icon: CircleDot,
      emoji: '🫘',
      sectionTitleKey: 'market.sectionPulses',
      sectionDefault: 'Pulses & Dals',
      matchFn: (item: ProduceListing) => {
        const name = item.name.toLowerCase();
        const cat = item.category.toLowerCase();
        return (
          cat.includes('pulse') ||
          name.includes('dal') ||
          name.includes('gram') ||
          name.includes('lentil') ||
          name.includes('toor') ||
          name.includes('moong') ||
          name.includes('urad') ||
          name.includes('chana')
        );
      },
    },
    {
      key: 'HERBS & LEAFY GREENS',
      labelKey: 'market.herbsGreens',
      defaultLabel: 'Herbs & Leafy Greens',
      icon: Leaf,
      emoji: '🌿',
      sectionTitleKey: 'market.sectionHerbs',
      sectionDefault: 'Herbs & Leafy Greens',
      matchFn: (item: ProduceListing) => {
        const name = item.name.toLowerCase();
        return (
          name.includes('spinach') ||
          name.includes('palak') ||
          name.includes('methi') ||
          name.includes('coriander') ||
          name.includes('mint') ||
          name.includes('pudina') ||
          name.includes('curry leaf') ||
          name.includes('kale') ||
          name.includes('lettuce') ||
          name.includes('herb')
        );
      },
    },
    {
      key: 'ORGANIC & NATURAL',
      labelKey: 'market.organicNatural',
      defaultLabel: 'Organic & Natural',
      icon: Sparkles,
      emoji: '🥥',
      sectionTitleKey: 'market.sectionOrganic',
      sectionDefault: 'Organic & Natural Products',
      matchFn: (item: ProduceListing) => {
        const name = item.name.toLowerCase();
        const cat = item.category.toLowerCase();
        return (
          name.includes('jaggery') ||
          name.includes('honey') ||
          name.includes('ghee') ||
          name.includes('coconut') ||
          name.includes('oil') ||
          cat.includes('dairy') ||
          cat.includes('organic')
        );
      },
    },
    {
      key: 'OTHER PRODUCE',
      labelKey: 'market.otherProduce',
      defaultLabel: 'Other Produce',
      icon: Layers,
      emoji: '🧺',
      sectionTitleKey: 'market.sectionOther',
      sectionDefault: 'Other Farm Produce',
      matchFn: () => true,
    },
  ];

  const handleOpenFarmerProfile = (prod: ProduceListing, e: React.MouseEvent) => {
    e.stopPropagation();
    const farmerSlug = prod.farmerName.toLowerCase().includes('ravi')
      ? 'ravi-kumar'
      : prod.farmerName.toLowerCase().includes('lakshmi')
      ? 'lakshmi-devi'
      : 'suresh-naidu';

    setSelectedFarmer({
      id: farmerSlug,
      name: prod.farmerName,
      farmerId: prod.farmerId || (prod.farmerName.toLowerCase().includes('ravi') ? 'AV-FARM-1001' : 'AV-FARM-1002'),
      role: 'Verified Direct Grower',
      location: prod.farmLocation,
      experience: '12+ Years Natural Soil Cultivation',
      specialty: prod.category,
      acreage: '8 Acres Heritage Soil',
      initials: prod.farmerName.split(' ').map((n) => n[0]).join(''),
      highlightBadge: 'Direct Producer',
    });
  };

  const handleAddToCartQuick = (prod: ProduceListing, e: React.MouseEvent) => {
    e.stopPropagation();
    if (prod.status === 'Sold Out' || prod.quantity <= 0) return;

    addToCart(
      {
        productId: prod.id,
        name: prod.name,
        image: getProduceImage(prod),
        price: prod.pricePerUnit,
        unit: prod.unit,
        farmerName: prod.farmerName,
        farmerId: prod.farmerId,
        maxAvailable: prod.quantity,
      },
      1
    );

    setCartSuccessId(prod.id);
    setTimeout(() => {
      setCartSuccessId(null);
    }, 1800);
  };

  // Smart Natural Language search parser
  const parsedSearch = useMemo(() => {
    const raw = searchQuery.toLowerCase().trim();
    if (!raw) return { text: '', priceLimit: null, requireInStock: false, categoryHint: null };

    let text = raw;
    let priceLimit: number | null = null;
    let requireInStock = false;
    let categoryHint: string | null = null;

    // Price regex (e.g. "under 200", "under ₹300", "< 150")
    const priceMatch = raw.match(/(?:under|below|less than|<=|₹)\s*(\d+)/i);
    if (priceMatch && priceMatch[1]) {
      priceLimit = Number(priceMatch[1]);
      text = text.replace(priceMatch[0], '').trim();
    }

    if (raw.includes('in stock') || raw.includes('available')) {
      requireInStock = true;
      text = text.replace(/in stock|available/gi, '').trim();
    }

    if (raw.includes('fruit')) categoryHint = 'fruit';
    else if (raw.includes('veg')) categoryHint = 'veg';
    else if (raw.includes('spice')) categoryHint = 'spice';
    else if (raw.includes('grain')) categoryHint = 'grain';

    return { text, priceLimit, requireInStock, categoryHint };
  }, [searchQuery]);

  // Filter listings by natural search, stock, and category
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      const q = parsedSearch.text;
      const matchesText =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.farmerName.toLowerCase().includes(q) ||
        item.farmLocation.toLowerCase().includes(q) ||
        (item.farmerId && item.farmerId.toLowerCase().includes(q));

      const matchesStock =
        (!inStockOnly && !parsedSearch.requireInStock) ||
        (item.status === 'Active' && item.quantity > 0);

      const effectivePriceLimit = parsedSearch.priceLimit !== null ? parsedSearch.priceLimit : maxPriceFilter;
      const matchesPrice = item.pricePerUnit <= effectivePriceLimit;

      const matchesCategoryHint =
        !parsedSearch.categoryHint ||
        item.category.toLowerCase().includes(parsedSearch.categoryHint) ||
        item.name.toLowerCase().includes(parsedSearch.categoryHint);

      if (!matchesText || !matchesStock || !matchesPrice || !matchesCategoryHint) return false;

      if (selectedCategoryTab === 'ALL') return true;

      const catDef = categoryDefinitions.find((c) => c.key === selectedCategoryTab);
      if (catDef && catDef.matchFn) {
        return catDef.matchFn(item);
      }
      return item.category.toUpperCase() === selectedCategoryTab;
    });
  }, [listings, parsedSearch, inStockOnly, maxPriceFilter, selectedCategoryTab]);

  // Sort listings based on selected criterion
  const sortedListings = useMemo(() => {
    const list = [...filteredListings];
    if (sortBy === 'price-low') {
      return list.sort((a, b) => a.pricePerUnit - b.pricePerUnit);
    }
    if (sortBy === 'price-high') {
      return list.sort((a, b) => b.pricePerUnit - a.pricePerUnit);
    }
    if (sortBy === 'newest') {
      return list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }
    if (sortBy === 'in-stock') {
      return list.sort((a, b) => {
        if (a.status === 'Active' && b.status !== 'Active') return -1;
        if (b.status === 'Active' && a.status !== 'Active') return 1;
        return b.quantity - a.quantity;
      });
    }
    // Recommended default (In-stock first, then rating)
    return list.sort((a, b) => {
      if (a.status === 'Active' && b.status !== 'Active') return -1;
      if (b.status === 'Active' && a.status !== 'Active') return 1;
      const statsA = getProductStats(a.id);
      const statsB = getProductStats(b.id);
      return statsB.average - statsA.average;
    });
  }, [filteredListings, sortBy, getProductStats]);

  // Picked for You Recommendations (Active Real Items)
  const seasonalRecommendations = useMemo(() => {
    return listings
      .filter((item) => item.status === 'Active' && item.quantity > 0)
      .slice(0, 4);
  }, [listings]);

  // Category-First Section grouping when "ALL" is selected
  const activeCategorySections = useMemo(() => {
    if (selectedCategoryTab !== 'ALL' || searchQuery.trim().length > 0) return null;

    const sections: Array<{ definition: (typeof categoryDefinitions)[0]; items: ProduceListing[] }> = [];

    categoryDefinitions.forEach((catDef) => {
      if (catDef.key === 'ALL' || catDef.key === 'OTHER PRODUCE') return;
      const matched = sortedListings.filter((item) =>
        catDef.matchFn ? catDef.matchFn(item) : item.category.toUpperCase() === catDef.key
      );
      if (matched.length > 0) {
        sections.push({
          definition: catDef,
          items: matched,
        });
      }
    });

    return sections;
  }, [sortedListings, selectedCategoryTab, searchQuery]);

  return (
    <div className="w-full bg-[#070707] text-[#fcfbf7] min-h-screen pb-28">
      {/* 1. MARKETPLACE HEADER */}
      <section className="relative pt-24 pb-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#16120b] via-[#0c0a07] to-[#070707] border-b border-[#d4af37]/25">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#d4af37] font-semibold block mb-1">
                {t('nav.brand', 'AURIC AROHI')} {t('nav.marketplace', 'MARKETPLACE')}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#fcfbf7]">
                {t('market.title', 'Fresh produce, directly from Indian farmers.')}
              </h1>
            </div>

            {/* In-Stock Harvest Live Badge */}
            <div className="inline-flex items-center gap-2 font-mono text-xs text-[#fae69e] bg-[#14120c] px-4 py-2 rounded-2xl border border-[#d4af37]/35 shadow-[0_0_20px_rgba(212,175,55,0.15)]">
              <span className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse" />
              <span>
                <strong>{listings.filter((l) => l.status === 'Active').length}</strong> {t('market.inStock', 'Active Crops in PostgreSQL')}
              </span>
            </div>
          </div>

          {/* 2. SEARCH BAR & ACTION ROW */}
          <div className="mt-7 flex flex-col sm:flex-row items-center gap-3">
            {/* Full-width Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-[#d4af37] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('market.searchPlaceholder', 'Search for fruits, vegetables, spices, grains or farmers...')}
                className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-[#14120e] border border-[#d4af37]/40 text-xs sm:text-sm text-[#fcfbf7] placeholder-[#7a766e] focus:outline-none focus:border-[#fae69e] focus:ring-1 focus:ring-[#fae69e] shadow-inner transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#8e8b82] hover:text-[#fcfbf7] p-1 cursor-pointer"
                  title="Clear search"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Mobile Filter Button Trigger */}
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="sm:hidden w-full py-3.5 px-4 rounded-2xl bg-[#1a160f] border border-[#d4af37]/40 text-xs font-mono font-bold text-[#fae69e] flex items-center justify-center gap-2 cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#d4af37]" />
              <span>{t('market.filterAndSort', 'Filter & Sort')}</span>
              {(inStockOnly || sortBy !== 'recommended' || selectedCategoryTab !== 'ALL') && (
                <span className="w-2 h-2 rounded-full bg-[#d4af37]" />
              )}
            </button>
          </div>

          {/* Desktop Filter / Sort Bar */}
          <div className="hidden sm:flex items-center justify-between gap-4 mt-4 pt-4 border-t border-[#d4af37]/15">
            <div className="text-xs font-mono text-[#aba79c]">
              {t('market.showing', 'Showing')}{' '}
              <strong className="text-[#fae69e]">{sortedListings.length}</strong>{' '}
              {t('market.produceItems', 'verified farm produce listings')}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setInStockOnly(!inStockOnly)}
                className={`py-2 px-3.5 rounded-xl border text-xs font-mono font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  inStockOnly
                    ? 'bg-[#221c10] border-[#d4af37] text-[#fae69e] shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                    : 'bg-[#14120e] border-[#d4af37]/25 text-[#8e8b82] hover:text-[#fcfbf7]'
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-md border flex items-center justify-center ${
                    inStockOnly ? 'bg-[#d4af37] border-[#fae69e]' : 'border-[#8e8b82]'
                  }`}
                >
                  {inStockOnly && <Check className="w-3 h-3 text-[#0a0a0a]" />}
                </div>
                <span>{t('market.inStockOnly', 'In-Stock Only')}</span>
              </button>

              <div className="relative">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#d4af37] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="pl-8 pr-4 py-2 rounded-xl bg-[#14120e] border border-[#d4af37]/35 text-xs text-[#fcfbf7] focus:outline-none focus:border-[#fae69e] cursor-pointer"
                >
                  <option value="recommended">{t('market.sortRecommended', 'Sort: Recommended')}</option>
                  <option value="price-low">{t('market.priceLow', 'Price: Low to High')}</option>
                  <option value="price-high">{t('market.priceHigh', 'Price: High to Low')}</option>
                  <option value="newest">{t('market.sortNewest', 'Newest Listings')}</option>
                  <option value="in-stock">{t('market.sortInStock', 'Availability First')}</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HORIZONTAL CATEGORY NAVIGATION BAR */}
      <div className="sticky top-16 z-30 bg-[#0c0a07]/95 backdrop-blur-md border-b border-[#d4af37]/20 py-3 px-4 sm:px-6 lg:px-8 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {categoryDefinitions.map((cat) => {
            const isSelected = selectedCategoryTab === cat.key;
            const count =
              cat.key === 'ALL'
                ? listings.length
                : listings.filter((l) => (cat.matchFn ? cat.matchFn(l) : l.category.toUpperCase() === cat.key)).length;

            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategoryTab(cat.key)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-sans whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 shrink-0 border ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#2a2212] to-[#18140c] border-[#d4af37] text-[#fae69e] font-bold shadow-[0_0_15px_rgba(212,175,55,0.3)] scale-[1.02]'
                    : 'bg-[#14120e]/80 border-[#d4af37]/20 text-[#8e8b82] hover:text-[#fcfbf7] hover:border-[#d4af37]/45'
                }`}
              >
                <span className="text-sm">{cat.emoji}</span>
                <span>{t(cat.labelKey, cat.defaultLabel)}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-[#d4af37]/25 text-[#fae69e]' : 'bg-white/5 text-[#6e6b63]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. MAIN PRODUCT CATALOG CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-12">
        {/* AI SHOPPING RECOMMENDATIONS: "Picked for You" */}
        {!searchQuery && selectedCategoryTab === 'ALL' && seasonalRecommendations.length > 0 && (
          <section className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#16120b] via-[#100e0a] to-[#0a0a0a] border-2 border-[#d4af37]/35 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#d4af37]" />
                <h2 className="font-serif text-lg sm:text-xl font-bold text-[#fae69e]">
                  Picked for You • Fresh Dawn Recommendations
                </h2>
              </div>
              <span className="text-[10px] font-mono text-[#8e8b82] uppercase">
                Verified Indian Growers
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {seasonalRecommendations.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => setSelectedProduct(prod)}
                  className="p-2.5 rounded-2xl bg-[#14110c] border border-[#d4af37]/30 hover:border-[#fae69e] transition-all cursor-pointer flex flex-col justify-between space-y-2 group shadow-[0_0_15px_-5px_rgba(212,175,55,0.15)] hover:shadow-[0_0_25px_0_rgba(212,175,55,0.3)]"
                >
                  <div className="h-28 rounded-xl overflow-hidden bg-[#1a160e]">
                    <img
                      src={getProduceImage(prod)}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-xs sm:text-sm text-[#fcfbf7] truncate">
                      {prod.name}
                    </h4>
                    <div className="text-[10px] font-mono text-[#8e8b82] truncate mt-0.5">
                      👨🌾 {prod.farmerName}
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between font-mono text-xs pt-1 border-t border-[#d4af37]/15">
                    <span className="font-bold text-[#fae69e]">₹{prod.pricePerUnit}</span>
                    <span className="text-[10px] text-[#8e8b82]">/{prod.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* LOADING STATE SKELETON */}
        {isLoading ? (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-mono text-[#fae69e]">Loading fresh harvest manifests from PostgreSQL...</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="rounded-3xl bg-[#0f0e0c] border border-[#d4af37]/20 p-4 space-y-3 animate-pulse">
                  <div className="h-40 bg-[#1c180e] rounded-2xl" />
                  <div className="h-4 bg-[#241c0e] rounded w-3/4" />
                  <div className="h-3 bg-[#18140c] rounded w-1/2" />
                  <div className="pt-2 border-t border-[#d4af37]/10 flex justify-between">
                    <div className="h-5 bg-[#2a2010] rounded w-16" />
                    <div className="h-5 bg-[#2a2010] rounded w-20" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="py-20 text-center space-y-4 max-w-md mx-auto p-8 rounded-3xl bg-[#141010] border border-[#f87171]/40">
            <X className="w-10 h-10 text-[#f87171] mx-auto" />
            <h3 className="font-serif text-lg font-bold text-[#fcfbf7]">
              {t('market.error', 'Unable to load produce right now. Please try again.')}
            </h3>
          </div>
        ) : sortedListings.length === 0 ? (
          /* Empty / AI-Assisted Search Empty State */
          <div className="py-20 text-center space-y-5 max-w-md mx-auto p-8 rounded-3xl bg-[#12100c] border border-[#d4af37]/30 shadow-lg">
            <div className="w-14 h-14 rounded-full bg-[#1c180e] border border-[#d4af37]/50 flex items-center justify-center text-[#fae69e] mx-auto shadow-[0_0_20px_rgba(212,175,55,0.2)]">
              <ShoppingBag className="w-6 h-6 text-[#d4af37]" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#fcfbf7]">
              {searchQuery ? t('market.noResults', 'No matching produce found.') : t('market.categoryEmpty', 'No produce available in this category yet.')}
            </h3>
            <p className="text-xs text-[#aba79c] leading-relaxed">
              {searchQuery
                ? 'Try refining your query or let Auric Arohi AI suggest seasonal alternatives from active growers.'
                : t('market.checkOtherCategory', 'Explore our other direct farm categories above.')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategoryTab('ALL');
                  setInStockOnly(false);
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#201a0e] border border-[#d4af37]/40 text-xs font-mono text-[#fae69e] hover:bg-[#2e2412] cursor-pointer"
              >
                {t('market.clearSearch', 'Clear Search & Filters')}
              </button>
            </div>
          </div>
        ) : selectedCategoryTab === 'ALL' && activeCategorySections && activeCategorySections.length > 0 ? (
          /* CATEGORY-FIRST SECTIONED SHOPPING (WHEN "ALL" IS SELECTED) */
          <div className="space-y-12">
            {activeCategorySections.map((sec) => (
              <section key={sec.definition.key} className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#d4af37]/20">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{sec.definition.emoji}</span>
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#fcfbf7]">
                      {t(sec.definition.sectionTitleKey || sec.definition.labelKey, sec.definition.sectionDefault || sec.definition.defaultLabel)}
                    </h2>
                    <span className="text-xs font-mono text-[#8e8b82]">({sec.items.length})</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedCategoryTab(sec.definition.key)}
                    className="text-xs font-mono text-[#fae69e] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{t('market.viewAllCategory', 'View Category')}</span>
                    <ArrowRight className="w-3 h-3 text-[#d4af37]" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
                  {sec.items.map((prod) => (
                    <ProductCard
                      key={prod.id}
                      produce={prod}
                      imageSrc={getProduceImage(prod)}
                      onOpenDetail={() => setSelectedProduct(prod)}
                      onOpenFarmer={(e) => handleOpenFarmerProfile(prod, e)}
                      onAddToCart={(e) => handleAddToCartQuick(prod, e)}
                      isAdded={cartSuccessId === prod.id}
                      t={t}
                      stats={getProductStats(prod.id)}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          /* SINGLE CATEGORY / FILTERED GRID VIEW */
          <div>
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#d4af37]/20">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#fcfbf7] flex items-center gap-2">
                <span>{selectedCategoryTab}</span>
                <span className="text-xs font-mono text-[#8e8b82]">({sortedListings.length} {t('market.items', 'items')})</span>
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
              {sortedListings.map((prod) => (
                <ProductCard
                  key={prod.id}
                  produce={prod}
                  imageSrc={getProduceImage(prod)}
                  onOpenDetail={() => setSelectedProduct(prod)}
                  onOpenFarmer={(e) => handleOpenFarmerProfile(prod, e)}
                  onAddToCart={(e) => handleAddToCartQuick(prod, e)}
                  isAdded={cartSuccessId === prod.id}
                  t={t}
                  stats={getProductStats(prod.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* PART 10 & 12: EXPLORE FARMERS ACROSS INDIA MAP SECTION */}
        <section className="pt-8 border-t border-[#d4af37]/20">
          <GoogleFarmMap
            onSelectFarmer={(farmerName) => {
              const prod = listings.find((l) => l.farmerName.toLowerCase().includes(farmerName.toLowerCase().split(' ')[0]));
              if (prod) {
                handleOpenFarmerProfile(prod, { stopPropagation: () => {} } as any);
              }
            }}
          />
        </section>
      </main>

      {/* MOBILE FILTER & SORT DRAWER */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm sm:hidden">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="w-full bg-[#12100c] border-t-2 border-[#d4af37]/50 rounded-t-3xl p-5 space-y-5 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#d4af37]/20">
                <h3 className="font-serif text-lg font-bold text-[#fcfbf7] flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#d4af37]" />
                  <span>{t('market.filterAndSort', 'Filter & Sort')}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 rounded-full text-[#aba79c] hover:text-[#fcfbf7]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sort By */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-[#d4af37] font-semibold block">
                  {t('market.sortBy', 'Sort By')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'recommended', label: t('market.sortRecommended', 'Recommended') },
                    { id: 'price-low', label: t('market.priceLow', 'Price: Low to High') },
                    { id: 'price-high', label: t('market.priceHigh', 'Price: High to Low') },
                    { id: 'newest', label: t('market.sortNewest', 'Newest') },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSortBy(s.id as any)}
                      className={`p-2.5 rounded-xl text-xs font-sans text-left border ${
                        sortBy === s.id
                          ? 'bg-[#241c0e] border-[#d4af37] text-[#fae69e] font-bold'
                          : 'bg-[#18150e] border-[#d4af37]/20 text-[#8e8b82]'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability Filter */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-[#d4af37] font-semibold block">
                  {t('market.availability', 'Availability')}
                </label>
                <button
                  type="button"
                  onClick={() => setInStockOnly(!inStockOnly)}
                  className={`w-full p-3 rounded-xl border text-xs font-mono flex items-center justify-between ${
                    inStockOnly
                      ? 'bg-[#221c10] border-[#d4af37] text-[#fae69e]'
                      : 'bg-[#18150e] border-[#d4af37]/20 text-[#8e8b82]'
                  }`}
                >
                  <span>{t('market.inStockOnly', 'Show In-Stock Only')}</span>
                  <div
                    className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                      inStockOnly ? 'bg-[#d4af37] border-[#fae69e]' : 'border-[#8e8b82]'
                    }`}
                  >
                    {inStockOnly && <Check className="w-3 h-3 text-[#0a0a0a]" />}
                  </div>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSortBy('recommended');
                    setInStockOnly(false);
                    setSelectedCategoryTab('ALL');
                    setIsMobileFilterOpen(false);
                  }}
                  className="flex-1 py-3 rounded-xl bg-[#1c180e] border border-[#d4af37]/40 text-xs font-mono text-[#aba79c]"
                >
                  {t('market.reset', 'Reset')}
                </button>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#fae69e] to-[#d4af37] text-[#0a0a0a] font-serif font-bold text-xs uppercase"
                >
                  {t('market.apply', 'Apply Filters')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          produce={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onFarmerClick={(farmerName) => {
            const farmerSlug = farmerName.toLowerCase().includes('ravi')
              ? 'ravi-kumar'
              : farmerName.toLowerCase().includes('lakshmi')
              ? 'lakshmi-devi'
              : 'suresh-naidu';

            setSelectedFarmer({
              id: farmerSlug,
              name: farmerName,
              farmerId: selectedProduct.farmerId || 'AV-FARM-1001',
              role: 'Verified Direct Grower',
              location: selectedProduct.farmLocation,
              experience: '12+ Years Natural Cultivation',
              specialty: selectedProduct.category,
              acreage: '8 Acres Heritage Soil',
              initials: farmerName.split(' ').map((n) => n[0]).join(''),
              highlightBadge: 'Direct Producer',
            });
          }}
        />
      )}

      {/* Farmer Profile Modal */}
      {selectedFarmer && (
        <FarmerProfileModal
          farmer={selectedFarmer}
          onClose={() => setSelectedFarmer(null)}
          onSelectProduce={(prodId) => {
            const found = listings.find((l) => l.id === prodId);
            if (found) {
              setSelectedFarmer(null);
              setSelectedProduct(found);
            }
          }}
        />
      )}
    </div>
  );
};

// Reusable Product Card Component
interface ProductCardProps {
  produce: ProduceListing;
  imageSrc: string;
  onOpenDetail: () => void;
  onOpenFarmer: (e: React.MouseEvent) => void;
  onAddToCart: (e: React.MouseEvent) => void;
  isAdded: boolean;
  t: (key: string, fallback: string) => string;
  stats: { average: number; totalCount: number };
}

const ProductCard: React.FC<ProductCardProps> = ({
  produce,
  imageSrc,
  onOpenDetail,
  onOpenFarmer,
  onAddToCart,
  isAdded,
  t,
  stats,
}) => {
  const isSoldOut = produce.status === 'Sold Out' || produce.quantity <= 0;

  return (
    <div
      onClick={onOpenDetail}
      className="group relative rounded-2xl sm:rounded-3xl bg-[#0e0d0b]/90 border border-[#d4af37]/25 hover:border-[#d4af37]/75 backdrop-blur-md transition-all duration-300 shadow-[0_0_20px_-8px_rgba(212,175,55,0.15)] hover:shadow-[0_0_35px_-5px_rgba(212,175,55,0.35)] flex flex-col justify-between overflow-hidden cursor-pointer hover:-translate-y-1"
    >
      {/* Product Image */}
      <div className="relative h-36 sm:h-48 w-full overflow-hidden bg-[#16130e]">
        <img
          src={imageSrc}
          alt={produce.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0d0b] via-transparent to-transparent opacity-80" />

        {/* Category Pill Tag */}
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#d4af37]/40 text-[9px] sm:text-[10px] font-mono text-[#fae69e] uppercase font-semibold shadow-md">
          {produce.category}
        </div>

        {/* Stock Status Pill */}
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
          {isSoldOut ? (
            <span className="px-2 py-0.5 rounded-full bg-[#2a1010]/90 border border-[#f87171]/50 text-[9px] sm:text-[10px] font-mono font-bold text-[#f87171] uppercase">
              {t('market.soldOut', 'Sold Out')}
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full bg-[#102414]/90 border border-[#34d399]/50 text-[9px] sm:text-[10px] font-mono font-bold text-[#34d399] uppercase flex items-center gap-1 shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" />
              <span>{t('market.inStock', 'In Stock')}</span>
            </span>
          )}
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Crop Name */}
          <h3 className="font-serif text-sm sm:text-base md:text-lg font-bold text-[#fcfbf7] group-hover:text-[#fae69e] transition-colors line-clamp-1">
            {produce.name}
          </h3>

          {/* Farmer Name, Location & Real Farmer ID */}
          <div
            onClick={onOpenFarmer}
            className="mt-1 flex items-center justify-between text-[11px] sm:text-xs text-[#aba79c] hover:text-[#fae69e] transition-colors cursor-pointer"
            title="View verified farmer profile"
          >
            <span className="line-clamp-1 font-medium flex items-center gap-1">
              <span>👨🌾</span>
              <span>{produce.farmerName}</span>
            </span>
            {produce.farmerId && (
              <span className="text-[9px] sm:text-[10px] font-mono font-bold text-[#fae69e] bg-[#1c180e] px-1.5 py-0.2 rounded border border-[#d4af37]/35 shrink-0 ml-1">
                {produce.farmerId}
              </span>
            )}
          </div>

          {/* Location line */}
          <div className="text-[10px] font-mono text-[#8e8b82] flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-[#d4af37] shrink-0" />
            <span className="truncate">{produce.farmLocation || 'Mandya, Karnataka'}</span>
          </div>

          {/* Rating (ONLY if real reviews exist) */}
          {stats.totalCount > 0 && (
            <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-mono text-[#fae69e]">
              <span>★ {stats.average.toFixed(1)}</span>
              <span className="text-[10px] text-[#736f66]">({stats.totalCount})</span>
            </div>
          )}
        </div>

        {/* Pricing & Stock Details */}
        <div className="pt-2 sm:pt-3 border-t border-[#d4af37]/15">
          <div className="flex items-baseline justify-between gap-1 mb-1">
            <div className="flex items-baseline gap-1">
              <span className="font-serif text-base sm:text-xl font-bold text-[#fae69e]">
                ₹{produce.pricePerUnit}
              </span>
              <span className="text-[10px] sm:text-xs font-mono text-[#8e8b82]">/{produce.unit}</span>
            </div>
            <span className="text-[10px] font-mono text-[#8e8b82]">
              {t('market.available', 'Available')}: <strong className="text-[#f5f3eb]">{produce.quantity} {produce.unit}</strong>
            </span>
          </div>

          {/* Dual Action Buttons */}
          <div className="grid grid-cols-2 gap-2 mt-2">
            <button
              type="button"
              onClick={onOpenDetail}
              className="py-2.5 px-2 rounded-xl bg-[#14120e] hover:bg-[#201c10] border border-[#d4af37]/40 text-[10px] sm:text-xs font-mono font-bold text-[#fae69e] hover:text-white transition-all cursor-pointer text-center active:scale-95"
            >
              {t('market.viewDetails', 'Details')}
            </button>

            <button
              type="button"
              onClick={onAddToCart}
              disabled={isSoldOut}
              className={`py-2.5 px-2 rounded-xl font-serif font-bold text-[10px] sm:text-xs uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer shadow-md disabled:opacity-40 disabled:cursor-not-allowed ${
                isAdded
                  ? 'bg-[#10b981] text-white'
                  : 'bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#b89120] text-[#0a0a0a] hover:brightness-110 active:scale-95'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{t('cart.added', 'Added')}</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{t('market.addToCart', 'Add')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
