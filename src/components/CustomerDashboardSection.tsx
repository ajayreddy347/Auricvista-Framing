import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  ShoppingBag,
  Heart,
  BookmarkCheck,
  Calendar,
  Navigation,
  CreditCard,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  LogIn,
  MapPin,
  Star,
  MessageSquare,
  Truck,
  Tractor,
  CheckCircle2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrdersContext';
import { WriteReviewModal } from './WriteReviewModal';

export const CustomerDashboardSection: React.FC = () => {
  const { isLoggedIn, userRole, user } = useAuth();
  const { orders } = useOrders();
  const [selectedTab, setSelectedTab] = useState<'All' | 'Active' | 'Delivered'>('All');
  const [reviewModalData, setReviewModalData] = useState<{
    farmerId: string;
    farmerName: string;
    produceName?: string;
  } | null>(null);

  const customerItems = [
    { label: 'My Orders', icon: ShoppingBag, desc: 'Real-time live harvest status & manifests', value: `${orders.length} Orders` },
    { label: 'Saved Farmers', icon: BookmarkCheck, desc: 'Direct access to your trusted growers', value: '5 Saved' },
    { label: 'Favourite Products', icon: Heart, desc: 'One-click seasonal replenishment', value: '14 Items' },
    { label: 'Subscriptions', icon: Calendar, desc: 'Weekly farm basket schedule & cadence', value: 'Weekly Active' },
    { label: 'Delivery Tracking', icon: Navigation, desc: 'Farm-to-doorstep live temperature sensor', value: 'On Route' },
    { label: 'Wallet / Escrow', icon: CreditCard, desc: 'Direct escrow balances & instant payouts', value: '₹1,240' },
  ];

  const recentPurchases = [
    { id: 'REC-901', farm: 'Ravi Kumar (Chikkaballapur)', item: 'Fresh Vine Tomatoes (5 kg)', status: 'Harvested this morning', eta: 'Delivery today 4:30 PM' },
    { id: 'REC-902', farm: 'Lakshmi Devi (Kolar)', item: 'Hydroponic Salad Greens Box (1 kg)', status: 'Dispatched', eta: 'Delivery today 5:00 PM' },
  ];

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

  const displayName = isLoggedIn && user?.role === 'customer' ? user.name : 'Ananya Sharma';
  const displayAddress = isLoggedIn && user?.role === 'customer' && (user.address || user.location)
    ? (user.address || user.location)
    : 'Indiranagar, Bengaluru • Zone 2';

  return (
    <section
      id="customer-dashboard-section"
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
              id="customer-dash-pill"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14120c]/80 border border-[#d4af37]/30 backdrop-blur-md shadow-[0_0_15px_-5px_rgba(212,175,55,0.15)]"
            >
              <User className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="text-[11px] font-mono font-medium tracking-[0.2em] text-[#e8dfca] uppercase">
                Consumer Hub • "My AuricVista"
              </span>
            </div>
          </motion.div>

          <motion.h1
            variants={itemFadeUp}
            id="customer-dash-heading"
            className="font-serif text-3xl sm:text-5xl md:text-6xl font-medium tracking-[-0.02em] leading-[1.12] text-[#fcfbf7]"
          >
            <span className="block text-[#fcfbf7]">
              Customer Experience Hub
            </span>
          </motion.h1>

          <motion.p
            variants={itemFadeUp}
            id="customer-dash-subtext"
            className="mt-4 sm:mt-5 text-base sm:text-lg md:text-xl text-[#aba79c] font-normal leading-relaxed font-sans"
          >
            Track morning field harvests, manage recurring farm subscriptions, and verify farmer fair trade shares.
          </motion.p>

          {/* If not logged in as customer, show helpful banner */}
          {(!isLoggedIn || userRole !== 'customer') && (
            <motion.div variants={itemFadeUp} className="mt-6">
              <div className="inline-flex flex-wrap items-center justify-center gap-3 p-3 px-5 rounded-2xl bg-[#14120c] border border-[#d4af37]/40 text-xs text-[#fae69e]">
                <span>Preview Mode: Sign in to manage your active orders & personal subscriptions.</span>
                <Link
                  to="/login?role=customer"
                  className="px-3 py-1 rounded-full bg-[#fae69e] text-[#0a0a0a] font-mono font-semibold uppercase tracking-wider hover:brightness-110 flex items-center gap-1"
                >
                  <LogIn className="w-3 h-3" />
                  Customer Sign In
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
            id="customer-dashboard-main-card"
            className="p-7 sm:p-10 rounded-3xl bg-[#0e0d0b]/90 border-2 border-[#d4af37]/35 hover:border-[#d4af37] backdrop-blur-2xl shadow-[0_0_50px_-15px_rgba(212,175,55,0.25)] transition-all duration-300"
          >
            {/* Header / Profile Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#d4af37]/20">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2a2412] to-[#12100a] border border-[#d4af37]/45 flex items-center justify-center text-[#fae69e] shadow-[0_0_15px_-3px_rgba(212,175,55,0.25)]">
                  <User className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#fcfbf7]">
                      {displayName}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#18150d] border border-[#d4af37]/30 text-[#fae69e]">
                      <ShieldCheck className="w-3 h-3 text-[#34d399]" /> Verified Patron
                    </span>
                  </div>
                  <p className="text-xs text-[#8e8b82] font-mono mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                    <span>Delivery Address: {displayAddress}</span>
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <Link
                to="/marketplace"
                id="customer-browse-market-btn"
                className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-xs font-semibold uppercase tracking-[0.14em] text-[#0a0a0a] bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#b89120] hover:brightness-110 shadow-[0_0_20px_-5px_rgba(212,175,55,0.4)] transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-[#0a0a0a]" />
                <span>Shop Fresh Harvest</span>
              </Link>
            </div>

            {/* Hub Quick Nav Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
              {customerItems.map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-[#14120e] border border-[#d4af37]/20 hover:border-[#d4af37]/60 hover:bg-[#1a1710] transition-all group flex items-start justify-between cursor-pointer"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#1d190e] border border-[#d4af37]/30 flex items-center justify-center text-[#fae69e] group-hover:scale-105 transition-transform shrink-0">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-serif text-base font-semibold text-[#f5f3eb] group-hover:text-[#fae69e] transition-colors">
                          {item.label}
                        </h4>
                        <p className="text-xs text-[#8e8b82] font-sans mt-0.5 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-[#1c180e] border border-[#d4af37]/30 text-[#fae69e] shrink-0 font-medium">
                      {item.value}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Live Harvest Delivery Tracker & My Orders Manifest */}
            <div className="pt-6 border-t border-[#d4af37]/20">
              <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#fae69e] font-semibold block">
                    My Harvest Orders ({orders.length})
                  </span>
                  <span className="text-[11px] text-[#8e8b82]">
                    Sub-24hr cold-chain fulfillment & transparent farm escrow
                  </span>
                </div>
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#14120e] border border-[#d4af37]/25 text-xs font-mono">
                  {(['All', 'Active', 'Delivered'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setSelectedTab(tab)}
                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                        selectedTab === tab
                          ? 'bg-[#221c10] text-[#fae69e] border border-[#d4af37]/50 font-bold'
                          : 'text-[#8e8b82] hover:text-[#f5f3eb]'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="p-8 rounded-2xl bg-[#12110c] border border-[#d4af37]/20 text-center space-y-3">
                  <ShoppingBag className="w-8 h-8 text-[#d4af37]/50 mx-auto" />
                  <p className="text-sm font-serif text-[#fcfbf7]">No orders placed yet</p>
                  <p className="text-xs text-[#8e8b82]">
                    Browse regional farmer harvests to allocate direct morning produce.
                  </p>
                  <Link
                    to="/marketplace"
                    className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl bg-[#fae69e] text-[#0a0a0a] text-xs font-serif font-bold uppercase tracking-wider hover:brightness-110"
                  >
                    <span>Browse Marketplace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders
                    .filter((ord) => {
                      if (selectedTab === 'Active') return ord.status !== 'Delivered';
                      if (selectedTab === 'Delivered') return ord.status === 'Delivered';
                      return true;
                    })
                    .map((ord) => (
                      <div
                        key={ord.id}
                        className="p-5 rounded-2xl bg-[#12110c] border border-[#d4af37]/25 hover:border-[#d4af37]/50 transition-all space-y-4 shadow-sm"
                      >
                        {/* Order Top Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#d4af37]/15">
                          <div className="flex items-center gap-2.5">
                            <span className="text-xs font-mono font-bold text-[#fae69e] bg-[#1d190e] px-2.5 py-1 rounded-lg border border-[#d4af37]/35">
                              {ord.id}
                            </span>
                            <span className="text-xs font-mono text-[#8e8b82]">
                              Placed {ord.createdAt}
                            </span>
                          </div>

                          <div className="flex items-center gap-2.5">
                            <span
                              className={`px-3 py-1 rounded-full text-[11px] font-mono font-semibold border flex items-center gap-1.5 ${
                                ord.status === 'Placed'
                                  ? 'bg-[#201c10] text-[#fae69e] border-[#d4af37]/50'
                                  : ord.status === 'Delivered'
                                  ? 'bg-[#102416] text-[#34d399] border-[#34d399]/40'
                                  : 'bg-[#1a1f2c] text-[#60a5fa] border-[#60a5fa]/40'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  ord.status === 'Delivered'
                                    ? 'bg-[#34d399]'
                                    : 'bg-[#fae69e] animate-pulse'
                                }`}
                              />
                              {ord.status}
                            </span>

                            <span className="font-mono text-sm font-bold text-[#fcfbf7]">
                              ₹{ord.total}
                            </span>
                          </div>
                        </div>

                        {/* Order Produce Manifest */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {ord.items.map((item, itemIdx) => (
                            <div
                              key={itemIdx}
                              className="p-3 rounded-xl bg-[#18150e] border border-[#d4af37]/15 flex items-center justify-between gap-3"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#d4af37]/20 shrink-0 bg-[#0a0a0a]">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <h5 className="font-serif text-xs font-semibold text-[#fcfbf7] truncate">
                                    {item.name}
                                  </h5>
                                  <p className="text-[10px] text-[#aba79c] truncate flex items-center gap-1">
                                    <Tractor className="w-2.5 h-2.5 text-[#d4af37]" />
                                    <span>{item.farmerName}</span>
                                  </p>
                                </div>
                              </div>
                              <span className="text-[11px] font-mono text-[#fae69e] shrink-0 font-medium">
                                {item.quantity} {item.unit}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Order Footer / Meta & Review Action */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs font-mono text-[#8e8b82]">
                          <div className="flex items-center gap-4 flex-wrap">
                            <span className="flex items-center gap-1 text-[#f5f3eb]">
                              <Truck className="w-3.5 h-3.5 text-[#d4af37]" />
                              <span>{ord.deliveryMethod}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                              <span>ETA: {ord.preferredDeliveryDate}</span>
                            </span>
                            <span className="text-[10px] text-[#aba79c]">
                              Payment: {ord.paymentMethod}
                            </span>
                          </div>

                          {isLoggedIn && userRole === 'customer' && ord.items.length > 0 && (
                            <button
                              type="button"
                              onClick={() =>
                                setReviewModalData({
                                  farmerId: ord.items[0].farmerName.toLowerCase().includes('ravi')
                                    ? 'ravi-kumar'
                                    : ord.items[0].farmerName.toLowerCase().includes('lakshmi')
                                    ? 'lakshmi-devi'
                                    : 'suresh-naidu',
                                  farmerName: ord.items[0].farmerName,
                                  produceName: ord.items[0].name,
                                })
                              }
                              className="px-3 py-1.5 rounded-xl bg-[#1c180e] hover:bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#fae69e] text-xs font-mono flex items-center justify-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
                            >
                              <Star className="w-3.5 h-3.5 text-[#d4af37] fill-[#d4af37]" />
                              <span>Review Farmer</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {reviewModalData && (
          <WriteReviewModal
            isOpen={!!reviewModalData}
            onClose={() => setReviewModalData(null)}
            farmerId={reviewModalData.farmerId}
            farmerName={reviewModalData.farmerName}
            produceName={reviewModalData.produceName}
          />
        )}
      </AnimatePresence>
    </section>
  );
};
