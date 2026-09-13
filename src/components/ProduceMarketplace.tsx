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
  Menu,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ProductDetailModal } from './ProductDetailModal';
import { FarmerProfileModal, FarmerProfileData } from './FarmerProfileModal';
import { useProduce, ProduceListing } from '../context/ProduceContext';
import { useReviews } from '../context/ReviewsContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { getProduceImage } from '../utils/produceImages';
import { getLocalizedProduceName, getLocalizedCategory, getLocalizedUnit } from '../utils/produceLocalization';
import { findFarmerByListingOrName } from '../utils/farmerLocalization';
import { GoogleFarmMap } from './GoogleFarmMap';
import { ProductImage } from './ProductImage';

export const ProduceMarketplace: React.FC = () => {
  const { listings, isLoading, error } = useProduce();
  const { getProductStats } = useReviews();
  const { addToCart } = useCart();
  const { language, t } = useLanguage();
  const { isDark } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-low' | 'price-high' | 'newest' | 'in-stock'>('recommended');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(1000);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProduceListing | null>(null);
  const [selectedFarmer, setSelectedFarmer] = useState<FarmerProfileData | null>(null);
  const [cartSuccessId, setCartSuccessId] = useState<string | null>(null);

  // Category collapsible bar state (initially collapsed)
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false);

  // Category section product limits state (first 4 items initially)
  const [expandedCategorySections, setExpandedCategorySections] = useState<Record<string, boolean>>({});
  const [isSingleCategoryExpanded, setIsSingleCategoryExpanded] = useState(false);

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
        const cat = (item.category || '').toLowerCase();
        const name = (item.name || '').toLowerCase();
        return (
          (cat === 'vegetables' || cat.includes('veg')) &&
          !cat.includes('herb') &&
          !cat.includes('green')
        ) ||
        name.includes('onion') ||
        name.includes('potato') ||
        name.includes('tomato') ||
        name.includes('cauliflower') ||
        name.includes('cabbage') ||
        name.includes('capsicum') ||
        name.includes('green chilli') ||
        name.includes('carrot') ||
        name.includes('beetroot') ||
        name.includes('brinjal') ||
        name.includes('eggplant') ||
        name.includes('okra') ||
        name.includes('bhindi') ||
        name.includes('cucumber') ||
        name.includes('kheera') ||
        name.includes('bottle gourd') ||
        name.includes('bitter gourd') ||
        name.includes('ridge gourd') ||
        name.includes('pumpkin') ||
        name.includes('radish') ||
        name.includes('french beans') ||
        name.includes('green peas') ||
        name.includes('sweet corn') ||
        name.includes('drumstick') ||
        name.includes('ginger') ||
        name.includes('garlic');
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
        const cat = (item.category || '').toLowerCase();
        const name = (item.name || '').toLowerCase();
        return (
          cat === 'fruits' ||
          cat.includes('fruit') ||
          name.includes('mango') ||
          name.includes('banana') ||
          name.includes('orange') ||
          name.includes('pineapple') ||
          name.includes('apple') ||
          name.includes('papaya') ||
          name.includes('pomegranate') ||
          name.includes('watermelon') ||
          name.includes('muskmelon') ||
          name.includes('guava') ||
          name.includes('grapes') ||
          name.includes('dragon fruit') ||
          name.includes('custard apple') ||
          name.includes('sapota') ||
          name.includes('jackfruit') ||
          name.includes('coconut') ||
          name.includes('lemon') ||
          name.includes('strawberry')
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
        const cat = (item.category || '').toLowerCase();
        const name = (item.name || '').toLowerCase();
        return (
          cat.includes('spice') ||
          cat.includes('seasoning') ||
          name.includes('turmeric') ||
          name.includes('black pepper') ||
          name.includes('cardamom') ||
          name.includes('clove') ||
          name.includes('cinnamon') ||
          name.includes('coriander seeds') ||
          name.includes('dhaniya seeds') ||
          name.includes('cumin') ||
          name.includes('jeera') ||
          name.includes('red chilli') ||
          name.includes('mustard') ||
          name.includes('fennel') ||
          name.includes('saunf') ||
          name.includes('fenugreek seeds') ||
          name.includes('methi dana') ||
          name.includes('saffron') ||
          name.includes('kesar')
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
        const cat = (item.category || '').toLowerCase();
        const name = (item.name || '').toLowerCase();
        return (
          cat.includes('grain') ||
          cat.includes('cereal') ||
          name.includes('rice') ||
          name.includes('basmati') ||
          name.includes('wheat') ||
          name.includes('ragi') ||
          name.includes('jowar') ||
          name.includes('bajra') ||
          name.includes('maize') ||
          name.includes('millet')
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
        const cat = (item.category || '').toLowerCase();
        const name = (item.name || '').toLowerCase();
        return (
          cat.includes('pulse') ||
          cat.includes('dal') ||
          name.includes('toor') ||
          name.includes('moong') ||
          name.includes('urad') ||
          name.includes('chana') ||
          name.includes('chickpea') ||
          name.includes('rajma') ||
          name.includes('lentil')
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
        const cat = (item.category || '').toLowerCase();
        const name = (item.name || '').toLowerCase();
        return (
          cat.includes('herb') ||
          cat.includes('leafy') ||
          name.includes('spinach') ||
          name.includes('palak') ||
          name.includes('coriander leaves') ||
          name.includes('dhaniya leaves') ||
          name.includes('mint') ||
          name.includes('pudina') ||
          name.includes('curry leaves') ||
          name.includes('kadi patta') ||
          name.includes('methi leaves') ||
          name.includes('amaranth') ||
          name.includes('lettuce')
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
        const cat = (item.category || '').toLowerCase();
        const name = (item.name || '').toLowerCase();
        return (
          cat.includes('organic') ||
          cat.includes('natural') ||
          name.includes('jaggery') ||
          name.includes('gur') ||
          name.includes('honey') ||
          name.includes('oil') ||
          name.includes('walnut') ||
          name.includes('dry fruits')
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
    const farmerData = findFarmerByListingOrName(prod.farmerName, prod.farmerId);
    setSelectedFarmer(farmerData);
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
    <div className={`w-full bg-transparent min-h-screen pb-28 ${isDark ? 'text-[#fcfbf7]' : 'text-[#1c1917]'}`}>
      {/* 1. MARKETPLACE HEADER */}
      <section className={`relative pt-6 sm:pt-8 pb-8 px-4 sm:px-6 lg:px-8 border-b transition-colors duration-300 ${
        isDark
          ? 'bg-gradient-to-b from-[#16120b]/80 via-[#0c0a07]/75 to-transparent backdrop-blur-[2px] border-[#d4af37]/25'
          : 'bg-white/95 border-[#e7e4dc] shadow-xs'
      }`}>
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className={`text-[11px] font-mono uppercase tracking-[0.25em] font-semibold block mb-1 ${
                isDark ? 'text-[#d4af37]' : 'text-[#8f6208]'
              }`}>
                {t('nav.brand', 'AURIC AROHI')} {t('nav.marketplace', 'MARKETPLACE')}
              </span>
              <h1 className={`font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight ${
                isDark ? 'text-[#fcfbf7]' : 'text-[#1c1917]'
              }`}>
                {t('market.title', 'Fresh produce, directly from Indian farmers.')}
              </h1>
            </div>

            {/* In-Stock Harvest Live Badge */}
            <div className={`inline-flex items-center gap-2 font-mono text-xs px-4 py-2 rounded-2xl border shadow-xs ${
              isDark
                ? 'text-[#fae69e] bg-[#14120c] border-[#d4af37]/35 shadow-[0_0_20px_rgba(212,175,55,0.15)]'
                : 'text-[#8f6208] bg-white border-[#e7e4dc]'
            }`}>
              <span className="w-2 h-2 rounded-full bg-[#16a34a] animate-pulse" />
              <span>
                <strong>{listings.filter((l) => l.status === 'Active').length}</strong> {t('market.inStock', 'Active Crops in PostgreSQL')}
              </span>
            </div>
          </div>

          {/* 2. SEARCH BAR & ACTION ROW */}
          <div className="mt-7 flex flex-col sm:flex-row items-center gap-3">
            {/* Full-width Search Input */}
            <div className="relative flex-1 w-full">
              <Search className={`w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none ${
                isDark ? 'text-[#d4af37]' : 'text-[#8f6208]'
              }`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('market.searchPlaceholder', 'Search for fruits, vegetables, spices, grains or farmers...')}
                className={`w-full pl-11 pr-10 py-3.5 rounded-2xl border text-xs sm:text-sm focus:outline-none transition-all ${
                  isDark
                    ? 'bg-[#14120e] border-[#d4af37]/40 text-[#fcfbf7] placeholder-[#7a766e] focus:border-[#fae69e] focus:ring-1 focus:ring-[#fae69e] shadow-inner'
                    : 'bg-white border-[#e7e4dc] text-[#1c1917] placeholder-[#a8a29e] focus:border-[#b89120] focus:ring-1 focus:ring-[#b89120] shadow-xs'
                }`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className={`absolute right-3.5 top-1/2 -translate-y-1/2 text-xs p-1 cursor-pointer ${
                    isDark ? 'text-[#8e8b82] hover:text-[#fcfbf7]' : 'text-[#78716c] hover:text-[#1c1917]'
                  }`}
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
              className={`sm:hidden w-full py-3.5 px-4 rounded-2xl border text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-pointer ${
                isDark
                  ? 'bg-[#1a160f] border-[#d4af37]/40 text-[#fae69e]'
                  : 'bg-white border-[#e7e4dc] text-[#8f6208] shadow-xs'
              }`}
            >
              <SlidersHorizontal className={`w-4 h-4 ${isDark ? 'text-[#d4af37]' : 'text-[#8f6208]'}`} />
              <span>{t('market.filterAndSort', 'Filter & Sort')}</span>
              {(inStockOnly || sortBy !== 'recommended' || selectedCategoryTab !== 'ALL') && (
                <span className="w-2 h-2 rounded-full bg-[#d4af37]" />
              )}
            </button>
          </div>

          {/* Desktop Filter / Sort Bar */}
          <div className={`hidden sm:flex items-center justify-between gap-4 mt-4 pt-4 border-t ${
            isDark ? 'border-[#d4af37]/15' : 'border-[#e7e4dc]'
          }`}>
            <div className={`text-xs font-mono ${isDark ? 'text-[#aba79c]' : 'text-[#78716c]'}`}>
              {t('market.showing', 'Showing')}{' '}
              <strong className={isDark ? 'text-[#fae69e]' : 'text-[#8f6208]'}>{sortedListings.length}</strong>{' '}
              {t('market.produceItems', 'verified farm produce listings')}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setInStockOnly(!inStockOnly)}
                className={`py-2 px-3.5 rounded-xl border text-xs font-mono font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  inStockOnly
                    ? isDark
                      ? 'bg-[#221c10] border-[#d4af37] text-[#fae69e] shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                      : 'bg-[#fbf9f4] border-[#b89120] text-[#8f6208] shadow-xs'
                    : isDark
                    ? 'bg-[#14120e] border-[#d4af37]/25 text-[#8e8b82] hover:text-[#fcfbf7]'
                    : 'bg-white border-[#e7e4dc] text-[#57534e] hover:border-[#b89120] hover:text-[#1c1917]'
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-md border flex items-center justify-center ${
                    inStockOnly
                      ? 'bg-[#d4af37] border-[#fae69e]'
                      : isDark
                      ? 'border-[#8e8b82]'
                      : 'border-[#a8a29e]'
                  }`}
                >
                  {inStockOnly && <Check className="w-3 h-3 text-[#0a0a0a]" />}
                </div>
                <span>{t('market.inStockOnly', 'In-Stock Only')}</span>
              </button>

              <div className="relative">
                <ArrowUpDown className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                  isDark ? 'text-[#d4af37]' : 'text-[#8f6208]'
                }`} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className={`pl-8 pr-4 py-2 rounded-xl border text-xs cursor-pointer focus:outline-none ${
                    isDark
                      ? 'bg-[#14120e] border-[#d4af37]/35 text-[#fcfbf7] focus:border-[#fae69e]'
                      : 'bg-white border-[#e7e4dc] text-[#1c1917] focus:border-[#b89120] shadow-xs'
                  }`}
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

      {/* 3. MAIN PRODUCT CATALOG CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-8">
        {/* SLEEK HORIZONTAL CATEGORY FILTER TABS (COLLAPSIBLE) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              {/* Clear "=" / Hamburger-style Toggle Button */}
              <button
                type="button"
                id="categories-hamburger-toggle"
                onClick={() => setIsCategoriesExpanded((prev) => !prev)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono font-semibold transition-all duration-200 cursor-pointer shadow-xs select-none ${
                  isCategoriesExpanded
                    ? isDark
                      ? 'bg-[#d4af37]/25 border-[#d4af37] text-[#fae69e] shadow-[0_0_12px_rgba(212,175,55,0.3)]'
                      : 'bg-[#faf6ee] border-[#b89120] text-[#8f6208] shadow-xs'
                    : isDark
                    ? 'bg-[#14120e] hover:bg-[#201a10] border-[#d4af37]/35 text-[#d4af37] hover:border-[#d4af37]'
                    : 'bg-white hover:bg-[#faf8f4] border-[#d4af37]/45 text-[#8f6208] hover:border-[#b89120]'
                }`}
                title={isCategoriesExpanded ? 'Collapse categories' : 'Expand all categories'}
                aria-label="Toggle categories list"
                aria-expanded={isCategoriesExpanded}
              >
                <Menu className="w-4 h-4 text-[#d4af37]" />
                <span className="font-bold text-sm leading-none">=</span>
                <span className="text-[11px] uppercase tracking-wider">
                  {isCategoriesExpanded ? t('common.collapse', 'Collapse') : t('market.browseCategories', 'Categories')}
                </span>
                {isCategoriesExpanded ? (
                  <ChevronUp className="w-3.5 h-3.5 text-[#d4af37]" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-[#d4af37]" />
                )}
              </button>

              <h2 className={`text-xs font-mono uppercase tracking-wider font-semibold flex items-center gap-2 ${
                isDark ? 'text-[#d4af37]' : 'text-[#8f6208]'
              }`}>
                <Layers className={`w-4 h-4 ${isDark ? 'text-[#d4af37]' : 'text-[#8f6208]'}`} />
                <span>{t('market.browseCategories', 'Categories')}</span>
              </h2>
            </div>

            <span className={`text-[11px] font-mono ${isDark ? 'text-[#aba79c]' : 'text-[#78716c]'}`}>
              {selectedCategoryTab === 'ALL'
                ? t('market.allCategoriesActive', 'All Produce')
                : `${t('market.categoryActive', 'Filtered')}: ${selectedCategoryTab}`}
            </span>
          </div>

          {/* Collapsible Category Pill Drawer */}
          <AnimatePresence>
            {isCategoriesExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar">
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
                        className={`group inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-medium transition-all duration-200 cursor-pointer shrink-0 ${
                          isSelected
                            ? isDark
                              ? 'bg-gradient-to-r from-[#2c2210] to-[#1c160b] border-[#d4af37] text-[#fae69e] shadow-[0_0_15px_rgba(212,175,55,0.25)] font-semibold'
                              : 'bg-[#fbf9f4] border-[#b89120] text-[#8f6208] shadow-xs font-semibold'
                            : isDark
                            ? 'bg-[#12100d]/90 border-[#d4af37]/20 text-[#aba79c] hover:border-[#d4af37]/50 hover:text-[#fcfbf7]'
                            : 'bg-white border-[#e7e4dc] text-[#57534e] hover:border-[#b89120] hover:text-[#1c1917]'
                        }`}
                      >
                        <span className="text-base">{cat.emoji}</span>
                        <span>{t(cat.labelKey, cat.defaultLabel)}</span>
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                            isSelected
                              ? 'bg-[#d4af37] text-[#0a0a0a] font-bold'
                              : isDark
                              ? 'bg-[#1e1a12] text-[#8e8b82]'
                              : 'bg-[#f5f3eb] text-[#78716c]'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

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
          <div className={`py-20 text-center space-y-5 max-w-md mx-auto p-8 rounded-3xl border shadow-lg ${
            isDark ? 'bg-[#12100c] border-[#d4af37]/30' : 'bg-white border-[#e7e4dc]'
          }`}>
            <div className={`w-14 h-14 rounded-full border flex items-center justify-center mx-auto shadow-xs ${
              isDark ? 'bg-[#1c180e] border-[#d4af37]/50 text-[#fae69e]' : 'bg-[#faf8f5] border-[#d4af37]/45 text-[#8f6208]'
            }`}>
              <ShoppingBag className={`w-6 h-6 ${isDark ? 'text-[#d4af37]' : 'text-[#8f6208]'}`} />
            </div>
            <h3 className={`font-serif text-xl font-bold ${isDark ? 'text-[#fcfbf7]' : 'text-[#1c1917]'}`}>
              {searchQuery ? t('market.noResults', 'No matching produce found.') : t('market.categoryEmpty', 'No produce available in this category yet.')}
            </h3>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-[#aba79c]' : 'text-[#78716c]'}`}>
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
                className={`w-full sm:w-auto px-5 py-2.5 rounded-xl border text-xs font-mono cursor-pointer transition-colors ${
                  isDark
                    ? 'bg-[#201a0e] border-[#d4af37]/40 text-[#fae69e] hover:bg-[#2e2412]'
                    : 'bg-white border-[#d4af37]/45 text-[#8f6208] hover:bg-[#faf8f5] shadow-xs'
                }`}
              >
                {t('market.clearSearch', 'Clear Search & Filters')}
              </button>
            </div>
          </div>
        ) : selectedCategoryTab === 'ALL' && activeCategorySections && activeCategorySections.length > 0 ? (
          /* CATEGORY-FIRST SECTIONED SHOPPING (WHEN "ALL" IS SELECTED) */
          <div className="space-y-12">
            {activeCategorySections.map((sec) => {
              const isCategoryExpanded = Boolean(expandedCategorySections[sec.definition.key]);
              const visibleItems = isCategoryExpanded ? sec.items : sec.items.slice(0, 4);
              const hasMore = sec.items.length > 4;

              return (
                <section key={sec.definition.key} className="space-y-4">
                  <div className={`flex items-center justify-between pb-2 border-b ${
                    isDark ? 'border-[#d4af37]/20' : 'border-[#e7e4dc]'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{sec.definition.emoji}</span>
                      <h2 className={`font-serif text-xl sm:text-2xl font-bold ${isDark ? 'text-[#fcfbf7]' : 'text-[#1c1917]'}`}>
                        {t(sec.definition.sectionTitleKey || sec.definition.labelKey, sec.definition.sectionDefault || sec.definition.defaultLabel)}
                      </h2>
                      <span className={`text-xs font-mono ${isDark ? 'text-[#8e8b82]' : 'text-[#78716c]'}`}>({sec.items.length})</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedCategoryTab(sec.definition.key)}
                      className={`text-xs font-mono hover:underline flex items-center gap-1 cursor-pointer ${
                        isDark ? 'text-[#fae69e]' : 'text-[#8f6208]'
                      }`}
                    >
                      <span>{t('market.viewAllCategory', 'View Category')}</span>
                      <ArrowRight className={`w-3 h-3 ${isDark ? 'text-[#d4af37]' : 'text-[#8f6208]'}`} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3.5 md:gap-4">
                    {visibleItems.map((prod) => (
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

                  {/* View More Items / Show Less Button */}
                  {hasMore && (
                    <div className="pt-2 flex justify-center">
                      <button
                        type="button"
                        id={`view-more-cat-${sec.definition.key.toLowerCase()}`}
                        onClick={() => {
                          setExpandedCategorySections((prev) => ({
                            ...prev,
                            [sec.definition.key]: !prev[sec.definition.key],
                          }));
                        }}
                        className={`group inline-flex items-center justify-center gap-2 py-2 px-5 rounded-xl border text-xs font-mono font-semibold transition-all duration-200 cursor-pointer shadow-xs ${
                          isDark
                            ? 'bg-[#14120c]/80 hover:bg-[#d4af37]/15 border-[#d4af37]/35 hover:border-[#d4af37] text-[#fae69e]'
                            : 'bg-white hover:bg-[#faf8f4] border-[#d4af37]/45 hover:border-[#b89120] text-[#8f6208]'
                        }`}
                      >
                        {isCategoryExpanded ? (
                          <>
                            <span>{t('farmer.showLess', 'Show Less')}</span>
                            <ChevronUp className="w-3.5 h-3.5 text-[#d4af37]" />
                          </>
                        ) : (
                          <>
                            <span>{t('farmer.viewMoreItems', 'View More Items')} ({sec.items.length - 4} more)</span>
                            <ChevronDown className="w-3.5 h-3.5 text-[#d4af37]" />
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        ) : (
          /* SINGLE CATEGORY / FILTERED GRID VIEW */
          <div>
            <div className={`flex items-center justify-between mb-6 pb-2 border-b ${
              isDark ? 'border-[#d4af37]/20' : 'border-[#e7e4dc]'
            }`}>
              <h2 className={`font-serif text-xl sm:text-2xl font-bold flex items-center gap-2 ${
                isDark ? 'text-[#fcfbf7]' : 'text-[#1c1917]'
              }`}>
                <span>{selectedCategoryTab}</span>
                <span className={`text-xs font-mono ${isDark ? 'text-[#8e8b82]' : 'text-[#78716c]'}`}>({sortedListings.length} {t('market.items', 'items')})</span>
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3.5 md:gap-4">
              {(isSingleCategoryExpanded ? sortedListings : sortedListings.slice(0, 4)).map((prod) => (
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

            {sortedListings.length > 4 && (
              <div className="pt-4 flex justify-center">
                <button
                  type="button"
                  id="view-more-single-cat-btn"
                  onClick={() => setIsSingleCategoryExpanded((prev) => !prev)}
                  className={`group inline-flex items-center justify-center gap-2 py-2 px-5 rounded-xl border text-xs font-mono font-semibold transition-all duration-200 cursor-pointer shadow-xs ${
                    isDark
                      ? 'bg-[#14120c]/80 hover:bg-[#d4af37]/15 border-[#d4af37]/35 hover:border-[#d4af37] text-[#fae69e]'
                      : 'bg-white hover:bg-[#faf8f4] border-[#d4af37]/45 hover:border-[#b89120] text-[#8f6208]'
                  }`}
                >
                  {isSingleCategoryExpanded ? (
                    <>
                      <span>{t('farmer.showLess', 'Show Less')}</span>
                      <ChevronUp className="w-3.5 h-3.5 text-[#d4af37]" />
                    </>
                  ) : (
                    <>
                      <span>{t('farmer.viewMoreItems', 'View More Items')} ({sortedListings.length - 4} more)</span>
                      <ChevronDown className="w-3.5 h-3.5 text-[#d4af37]" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* PART 10 & 12: EXPLORE FARMERS ACROSS INDIA MAP SECTION */}
        <section className={`pt-8 border-t ${isDark ? 'border-[#d4af37]/20' : 'border-[#e7e4dc]'}`}>
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
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:hidden">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className={`w-full border-t-2 rounded-t-3xl p-5 space-y-5 max-h-[85vh] overflow-y-auto shadow-2xl ${
                isDark ? 'bg-[#12100c] border-[#d4af37]/50 text-[#fcfbf7]' : 'bg-white border-[#e7e4dc] text-[#1c1917]'
              }`}
            >
              <div className={`flex items-center justify-between pb-3 border-b ${isDark ? 'border-[#d4af37]/20' : 'border-[#e7e4dc]'}`}>
                <h3 className={`font-serif text-lg font-bold flex items-center gap-2 ${isDark ? 'text-[#fcfbf7]' : 'text-[#1c1917]'}`}>
                  <SlidersHorizontal className={`w-4 h-4 ${isDark ? 'text-[#d4af37]' : 'text-[#8f6208]'}`} />
                  <span>{t('market.filterAndSort', 'Filter & Sort')}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className={`p-1 rounded-full ${isDark ? 'text-[#aba79c] hover:text-[#fcfbf7]' : 'text-[#78716c] hover:text-[#1c1917]'}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sort By */}
              <div className="space-y-2">
                <label className={`text-xs font-mono uppercase font-semibold block ${isDark ? 'text-[#d4af37]' : 'text-[#8f6208]'}`}>
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
                      className={`p-2.5 rounded-xl text-xs font-sans text-left border cursor-pointer ${
                        sortBy === s.id
                          ? isDark
                            ? 'bg-[#241c0e] border-[#d4af37] text-[#fae69e] font-bold'
                            : 'bg-[#fbf9f4] border-[#b89120] text-[#8f6208] font-bold shadow-xs'
                          : isDark
                          ? 'bg-[#18150e] border-[#d4af37]/20 text-[#8e8b82]'
                          : 'bg-white border-[#e7e4dc] text-[#57534e]'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability Filter */}
              <div className="space-y-2">
                <label className={`text-xs font-mono uppercase font-semibold block ${isDark ? 'text-[#d4af37]' : 'text-[#8f6208]'}`}>
                  {t('market.availability', 'Availability')}
                </label>
                <button
                  type="button"
                  onClick={() => setInStockOnly(!inStockOnly)}
                  className={`w-full p-3 rounded-xl border text-xs font-mono flex items-center justify-between cursor-pointer ${
                    inStockOnly
                      ? isDark
                        ? 'bg-[#221c10] border-[#d4af37] text-[#fae69e]'
                        : 'bg-[#fbf9f4] border-[#b89120] text-[#8f6208] shadow-xs'
                      : isDark
                      ? 'bg-[#18150e] border-[#d4af37]/20 text-[#8e8b82]'
                      : 'bg-white border-[#e7e4dc] text-[#57534e]'
                  }`}
                >
                  <span>{t('market.inStockOnly', 'Show In-Stock Only')}</span>
                  <div
                    className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                      inStockOnly
                        ? 'bg-[#d4af37] border-[#fae69e]'
                        : isDark
                        ? 'border-[#8e8b82]'
                        : 'border-[#a8a29e]'
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
                  className={`flex-1 py-3 rounded-xl border text-xs font-mono cursor-pointer ${
                    isDark ? 'bg-[#1c180e] border-[#d4af37]/40 text-[#aba79c]' : 'bg-[#faf8f5] border-[#e7e4dc] text-[#57534e]'
                  }`}
                >
                  {t('market.reset', 'Reset')}
                </button>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#b89120] text-[#0a0a0a] font-serif font-bold text-xs uppercase cursor-pointer shadow-sm"
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
            const farmerData = findFarmerByListingOrName(farmerName, selectedProduct.farmerId);
            setSelectedFarmer(farmerData);
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
  const { language } = useLanguage();
  const { isDark } = useTheme();
  const isSoldOut = produce.status === 'Sold Out' || produce.quantity <= 0;

  return (
    <div
      onClick={onOpenDetail}
      className={`group relative rounded-xl sm:rounded-2xl border backdrop-blur-md transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer hover:-translate-y-1 ${
        isDark
          ? 'bg-[#0e0d0b]/90 border-[#d4af37]/25 hover:border-[#d4af37]/70 shadow-md hover:shadow-[0_0_25px_-5px_rgba(212,175,55,0.3)]'
          : 'bg-white border-[#e7e4dc] hover:border-[#b89120] shadow-sm hover:shadow-xl hover:shadow-black/5'
      }`}
    >
      {/* Product Image */}
      <div className={`relative h-32 sm:h-36 md:h-40 w-full overflow-hidden ${
        isDark ? 'bg-[#16130e]' : 'bg-[#f4efe6]'
      }`}>
        <ProductImage
          src={imageSrc}
          alt={produce.name}
          productName={getLocalizedProduceName(produce.name, language)}
          category={produce.category}
          size="md"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {isDark && (
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0d0b] via-transparent to-transparent opacity-80 pointer-events-none" />
        )}

        {/* Category Pill Tag */}
        <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-full backdrop-blur-md border text-[8px] sm:text-[9px] font-mono uppercase font-semibold shadow-xs ${
          isDark
            ? 'bg-black/80 border-[#d4af37]/40 text-[#fae69e]'
            : 'bg-white/95 border-[#e7e4dc] text-[#8f6208]'
        }`}>
          {getLocalizedCategory(produce.category, language)}
        </div>

        {/* Stock Status Pill */}
        <div className="absolute top-2 right-2">
          {isSoldOut ? (
            <span className={`px-2 py-0.5 rounded-full border text-[8px] sm:text-[9px] font-mono font-bold uppercase ${
              isDark ? 'bg-[#2a1010]/90 border-[#f87171]/50 text-[#f87171]' : 'bg-[#fef2f2] border-[#fecaca] text-[#dc2626]'
            }`}>
              {t('market.soldOut', 'Sold Out')}
            </span>
          ) : (
            <span className={`px-2 py-0.5 rounded-full border text-[8px] sm:text-[9px] font-mono font-bold uppercase flex items-center gap-1 shadow-xs ${
              isDark ? 'bg-[#102414]/90 border-[#34d399]/50 text-[#34d399]' : 'bg-[#f0fdf4] border-[#86efac] text-[#166534]'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isDark ? 'bg-[#34d399]' : 'bg-[#16a34a]'}`} />
              <span>{t('market.inStock', 'In Stock')}</span>
            </span>
          )}
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-2.5 sm:p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
        <div>
          {/* Crop Name */}
          <h3 className={`font-serif text-xs sm:text-sm md:text-base font-bold transition-colors line-clamp-1 ${
            isDark ? 'text-[#fcfbf7] group-hover:text-[#fae69e]' : 'text-[#1c1917] group-hover:text-[#8f6208]'
          }`}>
            {getLocalizedProduceName(produce.name, language)}
          </h3>

          {/* Farmer Name, Location & Real Farmer ID */}
          <div
            onClick={onOpenFarmer}
            className={`mt-1 flex items-center justify-between text-[10px] sm:text-xs transition-colors cursor-pointer ${
              isDark ? 'text-[#aba79c] hover:text-[#fae69e]' : 'text-[#78716c] hover:text-[#8f6208]'
            }`}
            title="View verified farmer profile"
          >
            <span className="line-clamp-1 font-medium flex items-center gap-1">
              <span>👨‍🌾</span>
              <span className="truncate">{produce.farmerName}</span>
            </span>
            {produce.farmerId && (
              <span className={`text-[8px] sm:text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border shrink-0 ml-1 ${
                isDark
                  ? 'text-[#fae69e] bg-[#1c180e] border-[#d4af37]/35'
                  : 'text-[#8f6208] bg-[#fbf9f4] border-[#d4af37]/40'
              }`}>
                {produce.farmerId}
              </span>
            )}
          </div>

          {/* Location line */}
          <div className={`text-[9px] sm:text-[10px] font-mono flex items-center gap-1 mt-0.5 ${
            isDark ? 'text-[#8e8b82]' : 'text-[#78716c]'
          }`}>
            <MapPin className={`w-2.5 h-2.5 shrink-0 ${isDark ? 'text-[#d4af37]' : 'text-[#8f6208]'}`} />
            <span className="truncate">{produce.farmLocation || 'Mandya, Karnataka'}</span>
          </div>

          {/* Rating (ONLY if real reviews exist) */}
          {stats.totalCount > 0 && (
            <div className={`mt-1 flex items-center gap-1 text-[10px] sm:text-[11px] font-mono ${
              isDark ? 'text-[#fae69e]' : 'text-[#8f6208]'
            }`}>
              <span>★ {stats.average.toFixed(1)}</span>
              <span className={`text-[9px] ${isDark ? 'text-[#736f66]' : 'text-[#a8a29e]'}`}>({stats.totalCount})</span>
            </div>
          )}
        </div>

        {/* Pricing & Stock Details */}
        <div className={`pt-2 border-t ${isDark ? 'border-[#d4af37]/15' : 'border-[#e7e4dc]'}`}>
          <div className="flex items-baseline justify-between gap-1 mb-1">
            <div className="flex items-baseline gap-1">
              <span className={`font-serif text-base sm:text-lg md:text-xl font-bold ${
                isDark ? 'text-[#fae69e]' : 'text-[#8f6208]'
              }`}>
                ₹{produce.pricePerUnit}
              </span>
              <span className={`text-[9px] sm:text-[10px] font-mono ${isDark ? 'text-[#8e8b82]' : 'text-[#78716c]'}`}>/{getLocalizedUnit(produce.unit, language)}</span>
            </div>
            <span className={`text-[9px] sm:text-[10px] font-mono ${isDark ? 'text-[#8e8b82]' : 'text-[#78716c]'}`}>
              {t('market.available', 'Available')}: <strong className={isDark ? 'text-[#f5f3eb]' : 'text-[#1c1917]'}>{produce.quantity} {getLocalizedUnit(produce.unit, language)}</strong>
            </span>
          </div>

          {/* Dual Action Buttons */}
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mt-1.5">
            <button
              type="button"
              onClick={onOpenDetail}
              className={`py-1.5 sm:py-2 px-1 rounded-lg sm:rounded-xl border text-[9px] sm:text-[11px] font-mono font-bold transition-all cursor-pointer text-center active:scale-95 ${
                isDark
                  ? 'bg-[#14120e] hover:bg-[#201c10] border-[#d4af37]/40 text-[#fae69e] hover:text-white'
                  : 'bg-white hover:bg-[#faf8f5] border-[#d4af37]/45 text-[#8f6208] hover:text-[#1c1917] shadow-xs'
              }`}
            >
              {t('market.viewDetails', 'Details')}
            </button>

            <button
              type="button"
              onClick={onAddToCart}
              disabled={isSoldOut}
              className={`py-1.5 sm:py-2 px-1 rounded-lg sm:rounded-xl font-serif font-bold text-[9px] sm:text-[11px] uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer shadow-md disabled:opacity-40 disabled:cursor-not-allowed ${
                isAdded
                  ? 'bg-[#10b981] text-white'
                  : 'bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#b89120] text-[#0a0a0a] hover:brightness-110 active:scale-95'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-3 h-3" />
                  <span>{t('cart.added', 'Added')}</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3 h-3" />
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
