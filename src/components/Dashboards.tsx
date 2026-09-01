import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Tractor,
  User,
  Plus,
  ArrowRight,
  TrendingUp,
  Package,
  Users,
  ShoppingBag,
  Heart,
  BookmarkCheck,
  Calendar,
  Navigation,
  CreditCard,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const Dashboards: React.FC = () => {
  const [modalType, setModalType] = useState<'farmer' | 'customer' | null>(null);

  const farmerStats = [
    { label: "Today's Sales", value: '₹4,850', icon: TrendingUp, highlight: true },
    { label: 'Active Products', value: '12', icon: Package },
    { label: 'Orders', value: '28', icon: ShoppingBag },
    { label: 'Customers', value: '19', icon: Users },
    { label: 'Available Stock', value: '245 kg', icon: Tractor },
  ];

  const customerItems = [
    { label: 'My Orders', icon: ShoppingBag, desc: 'Real-time live harvest status & receipts' },
    { label: 'Saved Farmers', icon: BookmarkCheck, desc: 'Direct access to your trusted growers' },
    { label: 'Favourite Products', icon: Heart, desc: 'One-click seasonal replenishment' },
    { label: 'Subscriptions', icon: Calendar, desc: 'Weekly farm basket schedule & cadence' },
    { label: 'Delivery Tracking', icon: Navigation, desc: 'Farm-to-doorstep live temperature sensor' },
    { label: 'Wallet / Payments', icon: CreditCard, desc: 'Direct escrow balances & instant payouts' },
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

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <section
      id="dashboards-section"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#070707] border-t border-[#d4af37]/15 overflow-hidden"
    >
      {/* Background ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] rounded-full gold-ambient-radial blur-3xl opacity-35" />
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
          <motion.div variants={itemFadeUp} className="mb-5 inline-block">
            <div
              id="dashboards-eyebrow-pill"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14120c]/80 border border-[#d4af37]/30 backdrop-blur-md shadow-[0_0_15px_-5px_rgba(212,175,55,0.15)]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="text-[11px] font-mono font-medium tracking-[0.2em] text-[#e8dfca] uppercase">
                Unified Ecosystem Controls
              </span>
            </div>
          </motion.div>

          <motion.h2
            variants={itemFadeUp}
            id="dashboards-heading"
            className="font-serif text-3xl sm:text-5xl md:text-6xl font-medium tracking-[-0.02em] leading-[1.12] text-[#fcfbf7]"
          >
            <span className="block text-[#fcfbf7]">
              Built for Both Sides
            </span>
          </motion.h2>

          <motion.p
            variants={itemFadeUp}
            id="dashboards-subtext"
            className="mt-4 sm:mt-5 text-base sm:text-lg md:text-xl text-[#aba79c] font-normal leading-relaxed font-sans"
          >
            Simple tools for farmers. Powerful control for customers.
          </motion.p>
        </motion.div>

        {/* ========================================================================= */}
        {/* TWO-COLUMN LAYOUT: FARMER DASHBOARD & CUSTOMER DASHBOARD                  */}
        {/* ========================================================================= */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-16 sm:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* CARD 1 — Farmer Dashboard ("My Farm") */}
          <motion.div
            variants={cardVariants}
            id="farmer-dashboard-card"
            className="group relative p-7 sm:p-9 rounded-3xl bg-[#0e0d0b]/85 border border-[#d4af37]/30 hover:border-[#d4af37] backdrop-blur-xl transition-all duration-300 shadow-[0_0_25px_-10px_rgba(212,175,55,0.12)] hover:shadow-[0_0_40px_-5px_rgba(212,175,55,0.35)] hover:-translate-y-1.5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2a2412] to-[#12100a] border border-[#d4af37]/40 flex items-center justify-center text-[#fae69e] shadow-[0_0_15px_-3px_rgba(212,175,55,0.25)]">
                    <Tractor className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c9a227] block">
                      PRODUCER PORTAL
                    </span>
                    <h3 className="font-serif text-2xl font-semibold text-[#f5f3eb] tracking-wide">
                      Farmer Dashboard
                    </h3>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#18150d] border border-[#d4af37]/25 text-[#fae69e]">
                  "My Farm"
                </span>
              </div>

              {/* Small Stat Tiles Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                {farmerStats.map((stat, idx) => {
                  const IconComp = stat.icon;
                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        stat.highlight
                          ? 'bg-[#1c180e] border-[#d4af37]/50 shadow-[0_0_15px_-3px_rgba(212,175,55,0.25)] col-span-2 sm:col-span-1'
                          : 'bg-[#14120e] border-[#d4af37]/20'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[#8e8b82] mb-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider">{stat.label}</span>
                        <IconComp className="w-3.5 h-3.5 text-[#d4af37]" />
                      </div>
                      <div className={`text-lg sm:text-xl font-serif font-bold ${stat.highlight ? 'text-[#fae69e]' : 'text-[#f5f3eb]'}`}>
                        {stat.value}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Below Stats: Gold Outlined Button */}
            <div className="pt-6 border-t border-[#d4af37]/15">
              <button
                id="add-new-produce-btn"
                className="w-full group/btn inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-medium uppercase tracking-[0.14em] text-[#f5f3eb] bg-[#14120c]/70 hover:bg-[#d4af37]/15 border border-[#d4af37]/40 hover:border-[#d4af37] transition-all duration-300 cursor-pointer shadow-[0_0_15px_-5px_rgba(212,175,55,0.15)]"
              >
                <Plus className="w-4 h-4 text-[#d4af37] group-hover/btn:rotate-90 transition-transform duration-300" />
                <span>Add New Produce +</span>
              </button>
            </div>
          </motion.div>

          {/* CARD 2 — Customer Dashboard ("My AuricVista") */}
          <motion.div
            variants={cardVariants}
            id="customer-dashboard-card"
            className="group relative p-7 sm:p-9 rounded-3xl bg-[#0e0d0b]/85 border border-[#d4af37]/30 hover:border-[#d4af37] backdrop-blur-xl transition-all duration-300 shadow-[0_0_25px_-10px_rgba(212,175,55,0.12)] hover:shadow-[0_0_40px_-5px_rgba(212,175,55,0.35)] hover:-translate-y-1.5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2a2412] to-[#12100a] border border-[#d4af37]/40 flex items-center justify-center text-[#fae69e] shadow-[0_0_15px_-3px_rgba(212,175,55,0.25)]">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c9a227] block">
                      CONSUMER PORTAL
                    </span>
                    <h3 className="font-serif text-2xl font-semibold text-[#f5f3eb] tracking-wide">
                      Customer Dashboard
                    </h3>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#18150d] border border-[#d4af37]/25 text-[#fae69e]">
                  "My AuricVista"
                </span>
              </div>

              {/* Simple Bullet/Icon List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
                {customerItems.map((item, idx) => {
                  const IconComp = item.icon;
                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-[#14120e] border border-[#d4af37]/20 flex items-center gap-3 hover:border-[#d4af37]/50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-xl bg-[#1d1911] border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] shrink-0">
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-[#f5f3eb] font-sans">
                          {item.label}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Button */}
            <div className="pt-6 border-t border-[#d4af37]/15">
              <button
                id="open-customer-portal-btn"
                className="w-full group/btn inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-medium uppercase tracking-[0.14em] text-[#f5f3eb] bg-[#14120c]/70 hover:bg-[#d4af37]/15 border border-[#d4af37]/40 hover:border-[#d4af37] transition-all duration-300 cursor-pointer shadow-[0_0_15px_-5px_rgba(212,175,55,0.15)]"
              >
                <span>Access My AuricVista</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#d4af37] group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
