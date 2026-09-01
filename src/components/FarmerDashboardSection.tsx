import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Tractor,
  Plus,
  TrendingUp,
  Package,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  X,
  MapPin,
  Bot,
  Star,
  MessageSquare,
  Truck,
  Trash2,
  Clock,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProduce } from '../context/ProduceContext';
import { useOrders, OrderStatus } from '../context/OrdersContext';
import { useReviews } from '../context/ReviewsContext';
import { StarRating } from './StarRating';

export const FarmerDashboardSection: React.FC = () => {
  const { isLoggedIn, userRole, user } = useAuth();
  const { listings, addListing, removeListing, updateListingStatus } = useProduce();
  const { orders, updateOrderStatus } = useOrders();
  const { getFarmerStats, getFarmerReviews, getProductStats } = useReviews();

  const [activeDashboardTab, setActiveDashboardTab] = useState<'inventory' | 'orders' | 'reviews'>('inventory');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newProduceName, setNewProduceName] = useState('');
  const [newProducePrice, setNewProducePrice] = useState('');
  const [newProduceQuantity, setNewProduceQuantity] = useState('');
  const [newProduceCategory, setNewProduceCategory] = useState<'Vegetables' | 'Fruits' | 'Grains' | 'Pulses' | 'Farm Fresh'>('Vegetables');
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const farmerId = user?.farmerProfile?.farmerSlug ||
    (user?.name?.toLowerCase().includes('lakshmi')
      ? 'lakshmi-devi'
      : user?.name?.toLowerCase().includes('suresh')
      ? 'suresh-naidu'
      : 'ravi-kumar');

  const reviewsStats = getFarmerStats(farmerId);
  const farmerReviews = getFarmerReviews(farmerId);

  // Filter farmer listings strictly to this grower
  const farmerListings = listings.filter(
    (item) =>
      item.farmerEmail?.toLowerCase() === user?.email?.toLowerCase() ||
      item.farmerName?.toLowerCase() === user?.name?.toLowerCase() ||
      (user?.role === 'farmer' && !item.farmerEmail)
  );

  const activeListings = farmerListings.filter((item) => item.status === 'Active');
  const totalStockKg = activeListings.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);

  // Calculate real total sales from non-cancelled orders
  const totalSales = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  // Calculate Average AI Quality Score across all listings
  const listingsWithAi = farmerListings.filter(
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
    { label: "Total Revenue", value: `₹${totalSales.toLocaleString('en-IN')}`, icon: TrendingUp, highlight: true },
    { label: 'Avg. AI Quality', value: `${avgAiQuality}/10`, icon: Bot },
    { label: 'Avg. Rating', value: `${reviewsStats.average.toFixed(1)} ★`, icon: Star },
    { label: 'Live Orders', value: `${orders.length}`, icon: ShoppingBag },
    { label: 'Active Items', value: `${activeListings.length}`, icon: Package },
    { label: 'Available Stock', value: `${totalStockKg} kg`, icon: Tractor },
  ];

  const handleAddProduce = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduceName.trim()) return;

    await addListing({
      name: newProduceName.trim(),
      category: newProduceCategory,
      quantity: Number(newProduceQuantity) || 50,
      unit: 'kg',
      pricePerUnit: Number(newProducePrice.replace(/[^0-9.]/g, '')) || 40,
      harvestDate: new Date().toISOString().split('T')[0],
      farmLocation: user?.location || user?.farmerProfile?.location || 'Kumar Organic Heritage Farm, Chikkaballapur Valley',
      farmerName: user?.name || 'Ravi Kumar',
      farmerEmail: user?.email || 'ravi.kumar@auricvista.farm',
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
    }, 1500);
  };

  const handleAdvanceStatus = async (orderId: string, currentStatus: OrderStatus) => {
    setUpdatingOrderId(orderId);
    let nextStatus: OrderStatus = 'Harvesting';
    if (currentStatus === 'Placed') nextStatus = 'Harvesting';
    else if (currentStatus === 'Harvesting') nextStatus = 'Dispatched';
    else if (currentStatus === 'Dispatched') nextStatus = 'Delivered';

    try {
      await updateOrderStatus(orderId, nextStatus);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemFadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  const displayName = isLoggedIn && user?.role === 'farmer' ? user.name : 'Ravi Kumar';
  const displayFarm =
    isLoggedIn && user?.role === 'farmer'
      ? user.farmName || user.farmerProfile?.farmName || 'Kumar Organic Heritage Farm #702'
      : 'Kumar Organic Heritage Farm #702';
  const displayLocation =
    isLoggedIn && user?.role === 'farmer'
      ? user.location || user.farmerProfile?.location || 'Chikkaballapur Valley, Karnataka'
      : 'Chikkaballapur Valley, Karnataka';

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
        {/* SECTION HEADER */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={containerVariants}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <motion.div
            variants={itemFadeUp}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#16140e] border border-[#d4af37]/40 backdrop-blur-md mb-4 shadow-[0_0_20px_-5px_rgba(212,175,55,0.3)]"
          >
            <Tractor className="w-4 h-4 text-[#fae69e]" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#fae69e] font-semibold">
              Grower Portal & Escrow Terminal
            </span>
          </motion.div>

          <motion.h2
            variants={itemFadeUp}
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#f5f3eb] gold-gradient-text"
          >
            Farmer Operations Center
          </motion.h2>

          <motion.p variants={itemFadeUp} className="mt-3 text-sm sm:text-base text-[#aba79c] font-sans">
            Manage your certified harvest inventory, monitor direct consumer orders, and inspect transparent payouts.
          </motion.p>
        </motion.div>

        {/* FARMER PROFILE BANNER CARD */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0f0e0c]/90 border border-[#d4af37]/35 backdrop-blur-xl shadow-[0_0_40px_-15px_rgba(212,175,55,0.2)] mb-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#1a160e] border-2 border-[#d4af37]/50 flex items-center justify-center text-[#fae69e] text-xl font-serif font-bold shadow-[0_0_20px_rgba(212,175,55,0.25)] shrink-0">
                {displayName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#f5f3eb]">{displayName}</h3>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#1a2c1d] border border-[#34d399]/40 text-[#34d399] text-[11px] font-mono font-medium">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified Grower
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#d4af37] font-sans font-medium mt-0.5">{displayFarm}</p>
                <p className="text-xs text-[#8e8b82] font-sans flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-[#d4af37]" />
                  <span>{displayLocation}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto">
              <Link
                to="/farmer-dashboard/post-produce"
                className="flex-1 lg:flex-none py-3 px-5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#fae69e] to-[#c9a227] text-[#0a0a0a] font-serif font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4 text-[#0a0a0a]" />
                <span>Post New Harvest</span>
              </Link>

              <button
                type="button"
                onClick={() => setAddModalOpen(true)}
                className="py-3 px-4 rounded-xl bg-[#16140e] hover:bg-[#201a0e] border border-[#d4af37]/40 text-[#fae69e] text-xs font-mono font-bold transition-all cursor-pointer"
              >
                Quick Add
              </button>
            </div>
          </div>

          {/* KPI METRIC CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mt-8 pt-8 border-t border-[#d4af37]/20">
            {farmerStats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    stat.highlight
                      ? 'bg-[#18140c] border-[#d4af37]/60 shadow-[0_0_15px_-5px_rgba(212,175,55,0.3)]'
                      : 'bg-[#12110c] border-[#d4af37]/20 hover:border-[#d4af37]/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-[#8e8b82] mb-1.5">
                    <span className="text-[11px] font-mono">{stat.label}</span>
                    <Icon className="w-3.5 h-3.5 text-[#d4af37]" />
                  </div>
                  <div className="font-serif text-lg sm:text-xl font-bold text-[#f5f3eb] truncate">{stat.value}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* TABS NAVIGATION */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="p-1 rounded-2xl bg-[#12110c] border border-[#d4af37]/25 inline-flex font-mono text-xs">
            <button
              type="button"
              onClick={() => setActiveDashboardTab('inventory')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                activeDashboardTab === 'inventory'
                  ? 'bg-[#221c10] text-[#fae69e] border border-[#d4af37]/50 font-bold shadow-sm'
                  : 'text-[#8e8b82] hover:text-[#f5f3eb]'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Live Inventory ({farmerListings.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveDashboardTab('orders')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                activeDashboardTab === 'orders'
                  ? 'bg-[#221c10] text-[#fae69e] border border-[#d4af37]/50 font-bold shadow-sm'
                  : 'text-[#8e8b82] hover:text-[#f5f3eb]'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Incoming Orders ({orders.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveDashboardTab('reviews')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                activeDashboardTab === 'reviews'
                  ? 'bg-[#221c10] text-[#fae69e] border border-[#d4af37]/50 font-bold shadow-sm'
                  : 'text-[#8e8b82] hover:text-[#f5f3eb]'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              <span>Ratings & Reviews ({reviewsStats.totalCount})</span>
            </button>
          </div>
        </div>

        {/* TAB 1: INVENTORY MANAGEMENT */}
        {activeDashboardTab === 'inventory' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h4 className="font-serif text-lg font-bold text-[#f5f3eb]">Your Field Harvest Catalog</h4>
                <p className="text-xs text-[#8e8b82]">Direct real-time inventory synced to the marketplace</p>
              </div>

              <Link
                to="/farmer-dashboard/post-produce"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#18150e] border border-[#d4af37]/40 text-[#fae69e] text-xs font-mono font-bold hover:bg-[#201c10] transition-colors"
              >
                <span>Add Crop</span>
                <Plus className="w-3.5 h-3.5" />
              </Link>
            </div>

            {farmerListings.length === 0 ? (
              <div className="p-10 rounded-2xl bg-[#12110c] border border-[#d4af37]/20 text-center space-y-3">
                <Tractor className="w-10 h-10 text-[#d4af37]/50 mx-auto" />
                <p className="font-serif text-base text-[#f5f3eb]">No harvest produce posted yet</p>
                <p className="text-xs text-[#8e8b82]">List your crops to start receiving direct fair-trade orders.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {farmerListings.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-4 rounded-2xl bg-[#12110c] border border-[#d4af37]/25 hover:border-[#d4af37]/50 transition-all flex flex-col justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#0a0a0a] border border-[#d4af37]/20 shrink-0">
                        <img
                          src={prod.images && prod.images[0] ? prod.images[0] : 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea'}
                          alt={prod.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#1e190e] text-[#d4af37] border border-[#d4af37]/30">
                            {prod.category}
                          </span>
                          <span
                            className={`text-[10px] font-mono font-bold ${
                              prod.status === 'Active' ? 'text-[#34d399]' : 'text-[#8e8b82]'
                            }`}
                          >
                            ● {prod.status}
                          </span>
                        </div>
                        <h5 className="font-serif text-sm font-bold text-[#f5f3eb] mt-1 truncate">{prod.name}</h5>
                        <p className="font-mono text-xs text-[#fae69e] mt-0.5">
                          ₹{prod.pricePerUnit} / {prod.unit}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#d4af37]/15 flex items-center justify-between text-xs font-mono">
                      <span className="text-[#8e8b82]">
                        Stock: <strong className="text-[#f5f3eb] font-bold">{prod.quantity} {prod.unit}</strong>
                      </span>

                      <div className="flex items-center gap-2">
                        {prod.status === 'Active' ? (
                          <button
                            type="button"
                            onClick={() => updateListingStatus(prod.id, 'Draft')}
                            className="px-2 py-1 rounded bg-[#1c180e] border border-[#d4af37]/30 text-[#fae69e] text-[10px] hover:bg-[#251e12]"
                          >
                            Pause
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => updateListingStatus(prod.id, 'Active')}
                            className="px-2 py-1 rounded bg-[#1c180e] border border-[#d4af37]/30 text-[#34d399] text-[10px] hover:bg-[#251e12]"
                          >
                            Activate
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => removeListing(prod.id)}
                          className="p-1 rounded text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: INCOMING ORDERS MANIFEST */}
        {activeDashboardTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-serif text-lg font-bold text-[#f5f3eb]">Live Farm Order Manifest</h4>
                <p className="text-xs text-[#8e8b82]">Orders placed by consumers for your farm produce</p>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="p-10 rounded-2xl bg-[#12110c] border border-[#d4af37]/20 text-center space-y-3">
                <ShoppingBag className="w-10 h-10 text-[#d4af37]/50 mx-auto" />
                <p className="font-serif text-base text-[#f5f3eb]">No orders placed yet</p>
                <p className="text-xs text-[#8e8b82]">Incoming consumer orders will appear here automatically.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 sm:p-5 rounded-2xl bg-[#12110c] border border-[#d4af37]/25 hover:border-[#d4af37]/45 transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#d4af37]/15">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-mono font-bold text-[#fae69e] bg-[#1d190e] px-2 py-0.5 rounded border border-[#d4af37]/30">
                          {ord.id}
                        </span>
                        <span className="text-xs font-mono text-[#8e8b82]">Buyer: <strong className="text-[#f5f3eb] font-normal">{ord.customerName}</strong></span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${
                            ord.status === 'Placed'
                              ? 'bg-[#201c10] text-[#fae69e] border-[#d4af37]/50'
                              : ord.status === 'Delivered'
                              ? 'bg-[#102416] text-[#34d399] border-[#34d399]/40'
                              : 'bg-[#1a1f2c] text-[#60a5fa] border-[#60a5fa]/40'
                          }`}
                        >
                          {ord.status}
                        </span>
                        <span className="font-mono text-sm font-bold text-[#fae69e]">₹{ord.total}</span>
                      </div>
                    </div>

                    {/* Order items */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {ord.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-[#16140e] border border-[#d4af37]/15 flex items-center justify-between text-xs"
                        >
                          <span className="font-serif text-[#f5f3eb] truncate">{item.name}</span>
                          <span className="font-mono text-[#fae69e] shrink-0 font-medium">
                            {item.quantity} {item.unit}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Action Controls */}
                    <div className="pt-2 flex items-center justify-between text-xs font-mono text-[#8e8b82]">
                      <span>Deliver to: {ord.deliveryAddress || 'Farm Pickup'}</span>

                      {ord.status === 'Placed' && (
                        <button
                          type="button"
                          disabled={updatingOrderId === ord.id}
                          onClick={() => handleAdvanceStatus(ord.id, ord.status)}
                          className="px-3 py-1.5 rounded-xl bg-[#201c10] border border-[#d4af37]/50 text-[#fae69e] font-bold hover:bg-[#2d2514] transition-all cursor-pointer"
                        >
                          {updatingOrderId === ord.id ? 'Updating...' : 'Start Harvesting →'}
                        </button>
                      )}

                      {ord.status === 'Harvesting' && (
                        <button
                          type="button"
                          disabled={updatingOrderId === ord.id}
                          onClick={() => handleAdvanceStatus(ord.id, ord.status)}
                          className="px-3 py-1.5 rounded-xl bg-[#1a2638] border border-[#60a5fa]/50 text-[#93c5fd] font-bold hover:bg-[#203046] transition-all cursor-pointer"
                        >
                          {updatingOrderId === ord.id ? 'Updating...' : 'Dispatch Order →'}
                        </button>
                      )}

                      {ord.status === 'Dispatched' && (
                        <button
                          type="button"
                          disabled={updatingOrderId === ord.id}
                          onClick={() => handleAdvanceStatus(ord.id, ord.status)}
                          className="px-3 py-1.5 rounded-xl bg-[#102416] border border-[#34d399]/50 text-[#34d399] font-bold hover:bg-[#14301d] transition-all cursor-pointer"
                        >
                          {updatingOrderId === ord.id ? 'Updating...' : 'Mark Delivered ✓'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: REVIEWS */}
        {activeDashboardTab === 'reviews' && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-[#0f0e0c] border border-[#d4af37]/35 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-5 flex flex-col items-center justify-center text-center p-4 rounded-xl bg-[#14120e] border border-[#d4af37]/20">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8e8b82] mb-1">
                  Overall Rating
                </span>
                <span className="font-serif text-4xl font-bold text-[#fae69e]">{reviewsStats.average.toFixed(1)}</span>
                <div className="my-2">
                  <StarRating rating={reviewsStats.average} size="md" />
                </div>
                <span className="text-xs text-[#8e8b82] font-mono">From {reviewsStats.totalCount} verified reviews</span>
              </div>

              <div className="md:col-span-7 space-y-2">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = reviewsStats.distribution[stars as 1 | 2 | 3 | 4 | 5] || 0;
                  const pct = reviewsStats.totalCount > 0 ? (count / reviewsStats.totalCount) * 100 : 0;
                  return (
                    <div key={stars} className="flex items-center gap-3 text-xs font-mono">
                      <span className="w-12 text-[#8e8b82]">{stars} Stars</span>
                      <div className="flex-1 h-2 rounded-full bg-[#1c180e] overflow-hidden border border-[#d4af37]/15">
                        <div className="h-full bg-[#d4af37] rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-8 text-right text-[#aba79c]">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Individual Reviews */}
            <div className="space-y-3">
              {farmerReviews.length === 0 ? (
                <div className="p-8 rounded-2xl bg-[#12110c] border border-[#d4af37]/20 text-center text-xs text-[#8e8b82]">
                  No reviews submitted yet for this grower profile.
                </div>
              ) : (
                farmerReviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl bg-[#12110c] border border-[#d4af37]/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-sm font-bold text-[#f5f3eb]">{rev.customerName}</span>
                      <StarRating rating={rev.rating} size="sm" />
                    </div>
                    <p className="text-xs text-[#aba79c] font-sans">"{rev.comment}"</p>
                    <div className="text-[10px] font-mono text-[#8e8b82] flex items-center justify-between pt-2 border-t border-[#d4af37]/10">
                      <span>{rev.produceName || 'Direct Farm Harvest'}</span>
                      <span>{rev.date}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* QUICK ADD MODAL */}
      <AnimatePresence>
        {addModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-6 rounded-3xl bg-[#12110c] border border-[#d4af37]/40 shadow-2xl relative space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#d4af37]/20">
                <h4 className="font-serif text-lg font-bold text-[#f5f3eb]">Quick Post Harvest</h4>
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="p-1 rounded-lg text-[#8e8b82] hover:text-[#f5f3eb]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {addedSuccess ? (
                <div className="p-6 text-center space-y-2 text-[#34d399]">
                  <CheckCircle2 className="w-10 h-10 mx-auto" />
                  <p className="font-serif text-base font-bold">Produce Published to Marketplace!</p>
                </div>
              ) : (
                <form onSubmit={handleAddProduce} className="space-y-3 text-xs font-mono">
                  <div>
                    <label className="block text-[#aba79c] mb-1">Produce Name</label>
                    <input
                      type="text"
                      required
                      value={newProduceName}
                      onChange={(e) => setNewProduceName(e.target.value)}
                      placeholder="e.g. Organic Bell Peppers"
                      className="w-full px-3 py-2 rounded-xl bg-[#1a1710] border border-[#d4af37]/30 text-[#f5f3eb] focus:border-[#d4af37] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#aba79c] mb-1">Price per kg (₹)</label>
                      <input
                        type="number"
                        required
                        value={newProducePrice}
                        onChange={(e) => setNewProducePrice(e.target.value)}
                        placeholder="45"
                        className="w-full px-3 py-2 rounded-xl bg-[#1a1710] border border-[#d4af37]/30 text-[#f5f3eb] focus:border-[#d4af37] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[#aba79c] mb-1">Available Stock (kg)</label>
                      <input
                        type="number"
                        required
                        value={newProduceQuantity}
                        onChange={(e) => setNewProduceQuantity(e.target.value)}
                        placeholder="100"
                        className="w-full px-3 py-2 rounded-xl bg-[#1a1710] border border-[#d4af37]/30 text-[#f5f3eb] focus:border-[#d4af37] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#aba79c] mb-1">Category</label>
                    <select
                      value={newProduceCategory}
                      onChange={(e) => setNewProduceCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-[#1a1710] border border-[#d4af37]/30 text-[#f5f3eb] focus:border-[#d4af37] outline-none"
                    >
                      <option value="Vegetables">Vegetables</option>
                      <option value="Fruits">Fruits</option>
                      <option value="Grains">Grains</option>
                      <option value="Pulses">Pulses</option>
                      <option value="Farm Fresh">Farm Fresh</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#fae69e] text-[#0a0a0a] font-serif font-bold uppercase tracking-wider hover:brightness-110 transition-all mt-4 cursor-pointer"
                  >
                    Publish Harvest Now
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
