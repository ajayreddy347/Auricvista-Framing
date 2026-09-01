import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Tractor,
  Plus,
  TrendingUp,
  Package,
  Users,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  X,
  MapPin,
  LogIn,
  Bot,
  Layers,
  Star,
  MessageSquare,
  BarChart3,
  ThumbsUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProduce } from '../context/ProduceContext';
import { useReviews } from '../context/ReviewsContext';
import { StarRating } from './StarRating';

/* NOTE: In the next development phase, all local/mock states (listings, reviews, auth) 
   should be replaced with real backend/database calls (e.g., Firebase Firestore, Cloud SQL, or custom API). */

export const FarmerDashboardSection: React.FC = () => {
  const { isLoggedIn, userRole, user } = useAuth();
  const { listings, addListing } = useProduce();
  const { getFarmerStats, getFarmerReviews, getProductStats } = useReviews();
  
  const [activeDashboardTab, setActiveDashboardTab] = useState<'inventory' | 'reviews'>('inventory');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newProduceName, setNewProduceName] = useState('');
  const [newProducePrice, setNewProducePrice] = useState('');
  const [newProduceQuantity, setNewProduceQuantity] = useState('');
  const [addedSuccess, setAddedSuccess] = useState(false);

  const farmerId = user?.name?.toLowerCase().includes('lakshmi')
    ? 'lakshmi-devi'
    : user?.name?.toLowerCase().includes('suresh')
    ? 'suresh-naidu'
    : 'ravi-kumar';

  const reviewsStats = getFarmerStats(farmerId);
  const farmerReviews = getFarmerReviews(farmerId);

  // Filter farmer active listings
  const activeListings = listings.filter((item) => item.status === 'Active');
  const totalStockKg = activeListings.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);

  // Calculate Average AI Quality Score across all listings
  const listingsWithAi = activeListings.filter(
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
      : '9.8';

  const farmerStats = [
    { label: "Today's Sales", value: '₹4,850', icon: TrendingUp, highlight: true },
    { label: 'Avg. AI Quality', value: `${avgAiQuality}/10`, icon: Bot },
    { label: 'Avg. Rating', value: `${reviewsStats.average.toFixed(1)} ★`, icon: Star },
    { label: 'Reviews', value: `${reviewsStats.totalCount}`, icon: MessageSquare },
    { label: 'Active Items', value: `${activeListings.length}`, icon: Package },
    { label: 'Available Stock', value: `${totalStockKg} kg`, icon: Tractor },
  ];

  const recentOrders = [
    { id: 'ORD-8921', item: 'Organic Cherry Tomatoes (40 kg)', buyer: 'Cafe Botanica', status: 'Packed & Dispatched', time: '10 mins ago', amount: '₹1,520' },
    { id: 'ORD-8920', item: 'Hydroponic Spinach (15 kg)', buyer: 'Ananya Sharma', status: 'Delivered', time: '1 hour ago', amount: '₹750' },
    { id: 'ORD-8919', item: 'Country Farm Eggs (60 pcs)', buyer: 'Grand Hotel Kitchen', status: 'Delivered', time: '3 hours ago', amount: '₹1,200' },
  ];

  const handleAddProduce = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduceName.trim()) return;

    addListing({
      name: newProduceName.trim(),
      category: 'Vegetables',
      quantity: Number(newProduceQuantity) || 50,
      unit: 'kg',
      pricePerUnit: Number(newProducePrice.replace(/[^0-9.]/g, '')) || 40,
      harvestDate: new Date().toISOString().split('T')[0],
      farmLocation: user?.location || 'Kumar Organic Heritage Farm, Chikkaballapur Valley',
      farmerName: user?.name || 'Ravi Kumar',
      farmerEmail: user?.email,
      images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800'],
      status: 'Active',
      aiQualityRating: {
        qualityScore: 9.6,
        freshnessScore: 96,
        freshnessLabel: 'Excellent',
        notes: 'Hand-harvested at optimal maturity with prime mineral content and crisp firmness.',
        tags: ['Grade A+', 'Direct Harvest', 'Peak Freshness'],
        grade: 'A+',
        badge: 'AI Verified Prime',
        analysisNote: 'Hand-harvested at optimal maturity with prime mineral content.',
      },
    });

    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      setAddModalOpen(false);
      setNewProduceName('');
      setNewProducePrice('');
      setNewProduceQuantity('');
    }, 1200);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
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

  const displayName = isLoggedIn && user?.role === 'farmer' ? user.name : 'Ravi Kumar';
  const displayFarm = isLoggedIn && user?.role === 'farmer' && user.farmName ? user.farmName : 'Kumar Organic Heritage Farm #702';
  const displayLocation = isLoggedIn && user?.role === 'farmer' && user.location ? user.location : 'Chikkaballapur Valley, Karnataka';

  return (
    <section
      id="farmer-dashboard-section"
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#070707] overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] rounded-full gold-ambient-radial blur-3xl opacity-35" />
        <div className="absolute inset-0 bg-subtle-grid opacity-30 mask-gradient" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full">
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
          <motion.div variants={itemFadeUp} className="mb-5 inline-block">
            <div
              id="farmer-dash-pill"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14120c]/80 border border-[#d4af37]/30 backdrop-blur-md shadow-[0_0_15px_-5px_rgba(212,175,55,0.15)]"
            >
              <Tractor className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="text-[11px] font-mono font-medium tracking-[0.2em] text-[#e8dfca] uppercase">
                Producer Portal • "My Farm"
              </span>
            </div>
          </motion.div>

          <motion.h1
            variants={itemFadeUp}
            id="farmer-dash-heading"
            className="font-serif text-3xl sm:text-5xl md:text-6xl font-medium tracking-[-0.02em] leading-[1.12] text-[#fcfbf7]"
          >
            <span className="block text-[#fcfbf7]">
              Farmer Command Dashboard
            </span>
          </motion.h1>

          <motion.p
            variants={itemFadeUp}
            id="farmer-dash-subtext"
            className="mt-4 sm:mt-5 text-base sm:text-lg md:text-xl text-[#aba79c] font-normal leading-relaxed font-sans"
          >
            Manage live harvest stock, fulfill direct buyer orders, and view zero-middleman daily sales.
          </motion.p>

          {/* If not logged in as farmer, show helpful banner */}
          {(!isLoggedIn || userRole !== 'farmer') && (
            <motion.div variants={itemFadeUp} className="mt-6">
              <div className="inline-flex flex-wrap items-center justify-center gap-3 p-3 px-5 rounded-2xl bg-[#14120c] border border-[#d4af37]/40 text-xs text-[#fae69e]">
                <span>Preview Mode: Sign in to unlock full farm inventory & instant bank payouts.</span>
                <Link
                  to="/login?role=farmer"
                  className="px-3 py-1 rounded-full bg-[#fae69e] text-[#0a0a0a] font-mono font-semibold uppercase tracking-wider hover:brightness-110 flex items-center gap-1"
                >
                  <LogIn className="w-3 h-3" />
                  Farmer Sign In
                </Link>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* ========================================================================= */}
        {/* MAIN DASHBOARD CONTENT                                                    */}
        {/* ========================================================================= */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={containerVariants}
          className="mt-14 sm:mt-18"
        >
          <div
            id="farmer-dashboard-main-card"
            className="p-7 sm:p-10 rounded-3xl bg-[#0e0d0b]/90 border-2 border-[#d4af37]/35 hover:border-[#d4af37] backdrop-blur-2xl shadow-[0_0_50px_-15px_rgba(212,175,55,0.25)] transition-all duration-300"
          >
            {/* Header / Profile Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#d4af37]/20">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2a2412] to-[#12100a] border border-[#d4af37]/45 flex items-center justify-center text-[#fae69e] shadow-[0_0_15px_-3px_rgba(212,175,55,0.25)]">
                  <Tractor className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#fcfbf7]">
                      {displayFarm}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#18150d] border border-[#d4af37]/30 text-[#34d399]">
                      <ShieldCheck className="w-3 h-3" /> Verified Producer
                    </span>
                  </div>
                  <p className="text-xs text-[#8e8b82] font-mono mt-0.5">
                    Lead Grower: {displayName} • {displayLocation}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <Link
                  to="/farmer-dashboard/post-produce"
                  id="post-produce-primary-btn"
                  className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-xs font-semibold uppercase tracking-[0.14em] text-[#0a0a0a] bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#b89120] hover:brightness-110 shadow-[0_0_20px_-5px_rgba(212,175,55,0.4)] transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#0a0a0a]" />
                  <span>List New Produce +</span>
                </Link>
              </div>
            </div>

            {/* Stat Tiles Grid (Includes Avg AI Quality & Customer Rating) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mb-8">
              {farmerStats.map((stat, idx) => {
                const IconComp = stat.icon;
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border card-lift-glow-subtle ${
                      stat.highlight
                        ? 'bg-[#1c180e] border-[#d4af37]/60 shadow-[0_0_20px_-3px_rgba(212,175,55,0.25)]'
                        : 'bg-[#14120e] border-[#d4af37]/20 hover:border-[#d4af37]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[#8e8b82] mb-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider">{stat.label}</span>
                      <IconComp className="w-4 h-4 text-[#d4af37]" />
                    </div>
                    <div className={`text-lg sm:text-xl font-serif font-bold ${stat.highlight ? 'text-[#fae69e]' : 'text-[#f5f3eb]'}`}>
                      {stat.value}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dashboard Section Tabs */}
            <div className="flex items-center gap-2 border-b border-[#d4af37]/20 pb-2 mb-8 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveDashboardTab('inventory')}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                  activeDashboardTab === 'inventory'
                    ? 'bg-[#201a0e] text-[#fae69e] border border-[#d4af37]/50 shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                    : 'text-[#aba79c] hover:text-[#fcfbf7] hover:bg-[#14120e]'
                }`}
              >
                <Package className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Active Inventory & Orders ({activeListings.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveDashboardTab('reviews')}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                  activeDashboardTab === 'reviews'
                    ? 'bg-[#201a0e] text-[#fae69e] border border-[#d4af37]/50 shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                    : 'text-[#aba79c] hover:text-[#fcfbf7] hover:bg-[#14120e]'
                }`}
              >
                <Star className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Reviews & Ratings Analytics ({reviewsStats.totalCount})</span>
              </button>
            </div>

            {/* TAB 1: ACTIVE INVENTORY & ORDERS */}
            {activeDashboardTab === 'inventory' && (
              <>
                {/* Active Harvest Inventory with AI score badge + star rating inline */}
                <div className="mb-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono uppercase tracking-widest text-[#fae69e] font-semibold">
                        Active Harvest Listings ({activeListings.length})
                      </span>
                      <span className="text-[11px] font-mono text-[#8e8b82]">
                        • Direct Escrow Protected
                      </span>
                    </div>
                    <Link
                      to="/farmer-dashboard/post-produce"
                      className="text-xs font-mono text-[#fae69e] hover:underline flex items-center gap-1 self-start sm:self-auto"
                    >
                      <span>Post Another Batch</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {activeListings.map((prod) => {
                      const prodStats = getProductStats(prod.id);
                      const hasAi = Boolean(
                        prod.aiQualityRating &&
                        typeof prod.aiQualityRating.qualityScore === 'number' &&
                        prod.aiQualityRating.qualityScore > 0
                      );

                      return (
                        <div
                          key={prod.id}
                          className="p-4 rounded-2xl bg-[#14120e] border border-[#d4af37]/25 flex items-start gap-3.5 card-lift-glow-md group"
                        >
                          {prod.images && prod.images[0] ? (
                            <img
                              src={prod.images[0]}
                              alt={prod.name}
                              className="w-16 h-16 rounded-xl object-cover border border-[#d4af37]/30 group-hover:scale-105 transition-transform shrink-0"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-xl bg-[#1d190e] border border-[#d4af37]/30 flex items-center justify-center text-[#fae69e] shrink-0">
                              <Package className="w-6 h-6" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#1e190e] text-[#d4af37] border border-[#d4af37]/30 truncate">
                                {prod.category}
                              </span>
                              <span className="text-[10px] font-mono text-[#34d399] font-semibold uppercase">
                                ● Active
                              </span>
                            </div>
                            <h4 className="text-sm font-serif font-semibold text-[#f5f3eb] truncate mt-1">
                              {prod.name}
                            </h4>
                            <div className="flex items-center justify-between text-xs font-mono mt-1">
                              <span className="text-[#8e8b82]">
                                Stock: <strong className="text-[#e8dfca]">{prod.quantity} {prod.unit}</strong>
                              </span>
                              <span className="font-bold text-[#fae69e]">
                                ₹{prod.pricePerUnit}/{prod.unit}
                              </span>
                            </div>

                            {/* Dual Mini Status: AI Score Badge + Inline Star Rating */}
                            <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-[#fae69e] pt-1.5 border-t border-[#d4af37]/15 gap-1 flex-wrap">
                              {/* AI Quality Badge */}
                              {hasAi ? (
                                <div className="flex items-center gap-1 bg-[#1d190f] px-1.5 py-0.5 rounded border border-[#d4af37]/40">
                                  <Bot className="w-3 h-3 text-[#d4af37]" />
                                  <span>
                                    AI: <strong>{prod.aiQualityRating!.qualityScore.toFixed(1)}/10</strong>
                                  </span>
                                </div>
                              ) : (
                                <span className="text-[#8e8b82]">Standard</span>
                              )}

                              {/* Customer Star Rating */}
                              <div className="flex items-center gap-1">
                                {prodStats.totalCount > 0 ? (
                                  <span className="text-[#fae69e] font-semibold">
                                    ⭐ {prodStats.average.toFixed(1)} ({prodStats.totalCount})
                                  </span>
                                ) : (
                                  <span className="text-[#8e8b82] text-[10px]">No reviews</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recent Orders Stream */}
                <div className="pt-6 border-t border-[#d4af37]/20">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono uppercase tracking-widest text-[#fae69e] font-semibold">
                      Today's Direct Harvest Orders
                    </span>
                    <span className="text-[11px] font-mono text-[#8e8b82]">Auto-settled via Escrow</span>
                  </div>

                  <div className="space-y-2.5">
                    {recentOrders.map((ord, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-[#12110c] border border-[#d4af37]/15 hover:border-[#d4af37]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono font-bold text-[#d4af37]">{ord.id}</span>
                          <span className="text-sm text-[#f5f3eb]">{ord.item}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-mono">
                          <span className="text-[#8e8b82]">Buyer: <strong className="text-[#e8dfca] font-normal">{ord.buyer}</strong></span>
                          <span className="px-2.5 py-0.5 rounded-full bg-[#1c180e] border border-[#d4af37]/30 text-[#34d399] text-[10px]">
                            {ord.status}
                          </span>
                          <span className="font-bold text-[#fae69e]">{ord.amount}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* TAB 2: REVIEWS & RATINGS ANALYTICS */}
            {activeDashboardTab === 'reviews' && (
              <div className="space-y-6">
                {/* Overall Rating & Horizontal Bar Breakdown */}
                <div className="p-5 sm:p-6 rounded-2xl bg-[#0f0e0c] border border-[#d4af37]/35 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Left: Overall Average Customer Rating */}
                  <div className="md:col-span-5 flex flex-col items-center justify-center text-center p-4 rounded-xl bg-[#14120e] border border-[#d4af37]/20">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#8e8b82] mb-1">
                      Overall Customer Rating
                    </span>
                    <div className="font-serif text-4xl sm:text-5xl font-bold text-[#fae69e] tracking-tight">
                      {reviewsStats.average.toFixed(1)}
                    </div>
                    <div className="mt-2">
                      <StarRating rating={reviewsStats.average} size="lg" />
                    </div>
                    <span className="text-xs font-mono text-[#aba79c] mt-2">
                      Based on {reviewsStats.totalCount} verified reviews
                    </span>
                  </div>

                  {/* Right: Horizontal Star Distribution Bars (5★ to 1★) */}
                  <div className="md:col-span-7 space-y-2 text-xs font-mono">
                    <div className="text-[11px] font-mono text-[#fae69e] uppercase tracking-wider mb-1">
                      Rating Breakdown
                    </div>
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = reviewsStats.distribution[star as 1 | 2 | 3 | 4 | 5] || 0;
                      const percentage =
                        reviewsStats.totalCount > 0
                          ? Math.round((count / reviewsStats.totalCount) * 100)
                          : 0;

                      return (
                        <div key={star} className="flex items-center gap-3">
                          <span className="w-10 text-right text-[11px] flex items-center justify-end gap-1 text-[#e8dfca]">
                            {star} <Star className="w-3 h-3 text-[#d4af37] fill-[#d4af37]" />
                          </span>
                          <div className="flex-1 h-2.5 rounded-full bg-[#1e1c17] overflow-hidden border border-[#d4af37]/10">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                              className="h-full bg-gradient-to-r from-[#d4af37] to-[#fae69e] rounded-full"
                            />
                          </div>
                          <span className="w-12 text-[11px] text-[#8e8b82] text-right">
                            {count} ({percentage}%)
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Scrollable List of Customer Reviews */}
                <div className="pt-4 border-t border-[#d4af37]/20">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono uppercase tracking-widest text-[#fae69e] font-semibold">
                      Recent Verified Reviews ({farmerReviews.length})
                    </span>
                    <span className="text-[11px] font-mono text-[#34d399]">100% Direct Buyer Verified</span>
                  </div>

                  <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                    {farmerReviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-4 rounded-xl bg-[#12110c] border border-[#d4af37]/20 hover:border-[#d4af37]/45 transition-colors space-y-2"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-[#fcfbf7]">{rev.customerName}</span>
                              {rev.verified && (
                                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#18261a] text-[#34d399] border border-[#34d399]/30">
                                  Verified Purchase
                                </span>
                              )}
                            </div>
                            {rev.produceName && (
                              <div className="text-[10px] font-mono text-[#d4af37] mt-0.5">
                                Produce: {rev.produceName}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <StarRating rating={rev.rating} size="xs" />
                            <span className="text-[10px] font-mono text-[#8e8b82]">{rev.date}</span>
                          </div>
                        </div>

                        <p className="text-xs text-[#aba79c] font-sans">
                          "{rev.comment}"
                        </p>

                        <div className="pt-2 border-t border-[#d4af37]/10 flex items-center justify-between text-[10px] font-mono text-[#8e8b82]">
                          <span>Order ref #AUR-{rev.id.slice(-4).toUpperCase()}</span>
                          <span className="text-[#fae69e]">★ {rev.rating.toFixed(1)} / 5.0</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Add Produce Modal */}
      <AnimatePresence>
        {addModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAddModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 w-full max-w-md rounded-3xl bg-[#0e0d0b] border-2 border-[#d4af37]/40 shadow-[0_0_50px_rgba(212,175,55,0.3)] p-6 sm:p-7"
            >
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#d4af37]/20">
                <div className="flex items-center gap-2.5">
                  <Package className="w-5 h-5 text-[#fae69e]" />
                  <h3 className="font-serif text-lg font-bold text-[#fcfbf7]">
                    List New Harvest Batch
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="p-1 rounded-lg text-[#8e8b82] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {addedSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-[#34d399] mx-auto animate-bounce" />
                  <h4 className="font-serif text-xl font-bold text-[#fae69e]">Harvest Listed Successfully!</h4>
                  <p className="text-xs text-[#aba79c]">Your produce is now visible to direct consumer hubs across your zone.</p>
                </div>
              ) : (
                <form onSubmit={handleAddProduce} className="space-y-4 text-xs font-sans">
                  <div>
                    <label className="block font-mono uppercase tracking-wider text-[#d4af37] mb-1">
                      Crop / Product Name *
                    </label>
                    <input
                      type="text"
                      value={newProduceName}
                      onChange={(e) => setNewProduceName(e.target.value)}
                      placeholder="e.g. Heirloom Yellow Bell Peppers"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#14120e] border border-[#d4af37]/30 text-[#f5f3eb] placeholder-[#66635c] text-sm focus:outline-none focus:border-[#fae69e]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-mono uppercase tracking-wider text-[#d4af37] mb-1">
                        Direct Farm Price *
                      </label>
                      <input
                        type="text"
                        value={newProducePrice}
                        onChange={(e) => setNewProducePrice(e.target.value)}
                        placeholder="e.g. ₹45/kg"
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#14120e] border border-[#d4af37]/30 text-[#f5f3eb] placeholder-[#66635c] text-sm focus:outline-none focus:border-[#fae69e]"
                      />
                    </div>

                    <div>
                      <label className="block font-mono uppercase tracking-wider text-[#d4af37] mb-1">
                        Available Stock *
                      </label>
                      <input
                        type="text"
                        value={newProduceQuantity}
                        onChange={(e) => setNewProduceQuantity(e.target.value)}
                        placeholder="e.g. 60 kg"
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#14120e] border border-[#d4af37]/30 text-[#f5f3eb] placeholder-[#66635c] text-sm focus:outline-none focus:border-[#fae69e]"
                      />
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl font-semibold text-xs uppercase tracking-wider text-[#0a0a0a] bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#b89120] hover:brightness-110 transition-all cursor-pointer"
                    >
                      Publish to Direct Marketplace
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
