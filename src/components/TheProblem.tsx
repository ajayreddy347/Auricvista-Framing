import React from 'react';
import { motion } from 'motion/react';
import {
  Tractor,
  Store,
  Warehouse,
  Truck,
  ShoppingBag,
  User,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export const TheProblem: React.FC = () => {
  // Chain nodes definition for traditional intermediary supply chain
  const chainNodes = [
    {
      id: 'farmer',
      label: 'Farmer',
      sublabel: 'Grows & harvests',
      icon: Tractor,
      costTag: 'Base Price',
    },
    {
      id: 'local-trader',
      label: 'Local Trader',
      sublabel: 'Middleman markup',
      icon: Store,
      costTag: '+ Cost',
    },
    {
      id: 'wholesaler',
      label: 'Wholesaler',
      sublabel: 'Regional aggregation',
      icon: Warehouse,
      costTag: '+ Margin',
    },
    {
      id: 'distributor',
      label: 'Distributor',
      sublabel: 'Logistics handling',
      icon: Truck,
      costTag: '+ Freight',
    },
    {
      id: 'retailer',
      label: 'Retailer',
      sublabel: 'Shelf inventory',
      icon: ShoppingBag,
      costTag: '+ Markup',
    },
    {
      id: 'customer',
      label: 'Customer',
      sublabel: 'Inflated cost',
      icon: User,
      costTag: 'High End-Price',
    },
  ];

  // Motion Variants
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

  const chainContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const chainNodeVariants = {
    hidden: { opacity: 0, y: 16, scale: 0.95 },
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
      id="the-problem-section"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#070707] border-t border-[#d4af37]/15 overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full gold-ambient-secondary blur-3xl opacity-40" />
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
          className="text-center max-w-4xl mx-auto"
        >
          {/* Eyebrow Pill */}
          <motion.div variants={itemFadeUp} className="mb-5 inline-block">
            <div
              id="problem-eyebrow-pill"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14120c]/80 border border-[#d4af37]/30 backdrop-blur-md shadow-[0_0_15px_-5px_rgba(212,175,55,0.15)]"
            >
              <AlertCircle className="w-3.5 h-3.5 text-[#c9a227]" />
              <span className="text-[11px] font-mono font-medium tracking-[0.2em] text-[#e8dfca] uppercase">
                The Inefficiency Dilemma
              </span>
            </div>
          </motion.div>

          {/* Section Heading (Two Lines) */}
          <motion.h2
            variants={itemFadeUp}
            id="problem-main-heading"
            className="font-serif text-3xl sm:text-5xl md:text-6xl font-medium tracking-[-0.02em] leading-[1.12] text-[#fcfbf7]"
          >
            <span className="block text-[#fcfbf7]">
              The Farmer Grows It.
            </span>
            <span className="block gold-text-metallic font-semibold tracking-[-0.015em] mt-1 sm:mt-2">
              But Someone Else Often Profits From It.
            </span>
          </motion.h2>

          {/* Supporting Subtext */}
          <motion.p
            variants={itemFadeUp}
            id="problem-subtext"
            className="mt-6 text-base sm:text-lg md:text-xl text-[#aba79c] font-normal leading-relaxed max-w-3xl mx-auto font-sans"
          >
            Every step in the traditional supply chain can add cost — often without
            adding value for the farmer or the customer.
          </motion.p>
        </motion.div>

        {/* ========================================================================= */}
        {/* TRADITIONAL MARKET FLOW DIAGRAM (HORIZONTAL / VERTICAL RESPONSIVE)       */}
        {/* ========================================================================= */}
        <div className="mt-16 sm:mt-20">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-[1px] w-10 bg-gradient-to-r from-transparent to-[#d4af37]/35" />
            <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#c9a227]">
              TRADITIONAL INTERMEDIARY MULTIPLIER
            </span>
            <div className="h-[1px] w-10 bg-gradient-to-l from-transparent to-[#d4af37]/35" />
          </div>

          <motion.div
            variants={chainContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            id="traditional-chain-diagram"
            className="p-5 sm:p-7 md:p-8 rounded-3xl bg-[#0c0b09]/80 border border-[#d4af37]/20 backdrop-blur-xl shadow-[0_0_40px_-15px_rgba(0,0,0,0.8)]"
          >
            {/* Grid of Nodes with Connectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3 sm:gap-4 md:gap-2 items-center">
              {chainNodes.map((node, index) => {
                const IconComponent = node.icon;
                const isFarmer = index === 0;
                const isCustomer = index === chainNodes.length - 1;
                const isMiddleman = !isFarmer && !isCustomer;

                return (
                  <React.Fragment key={node.id}>
                    {/* Chain Node Card */}
                    <motion.div
                      variants={chainNodeVariants}
                      id={`chain-node-${node.id}`}
                      className={`relative flex flex-col items-center text-center p-4 rounded-2xl transition-all duration-300 ${
                        isMiddleman
                          ? 'bg-[#11100d]/60 border border-[#d4af37]/15 hover:border-[#d4af37]/30 text-[#8e8b82]'
                          : 'bg-[#16140f] border border-[#d4af37]/35 hover:border-[#d4af37]/60 text-[#e8dfca] shadow-[0_0_20px_-8px_rgba(212,175,55,0.15)]'
                      }`}
                    >
                      {/* Micro Badge for step sequence */}
                      <span className="absolute top-2 right-2 text-[9px] font-mono text-[#736f66]">
                        0{index + 1}
                      </span>

                      {/* Icon container */}
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2.5 ${
                          isMiddleman
                            ? 'bg-[#171510] border border-[#d4af37]/15 text-[#a19e95]'
                            : 'bg-gradient-to-br from-[#262010] to-[#12100a] border border-[#d4af37]/40 text-[#fae69e] shadow-[0_0_12px_-3px_rgba(212,175,55,0.25)]'
                        }`}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>

                      {/* Node Label */}
                      <span
                        className={`text-xs font-mono font-semibold tracking-wider uppercase ${
                          isMiddleman ? 'text-[#c2beaf]' : 'text-[#fae69e]'
                        }`}
                      >
                        {node.label}
                      </span>

                      {/* Node Sublabel */}
                      <span className="text-[11px] text-[#736f66] mt-0.5 leading-tight font-sans">
                        {node.sublabel}
                      </span>

                      {/* Cost Tag */}
                      <span
                        className={`mt-2 text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                          isMiddleman
                            ? 'bg-[#1c1912]/80 border-red-500/20 text-red-400/80'
                            : 'bg-[#d4af37]/10 border-[#d4af37]/25 text-[#d4af37]'
                        }`}
                      >
                        {node.costTag}
                      </span>
                    </motion.div>
                  </React.Fragment>
                );
              })}
            </div>

            {/* Explanatory summary bar underneath chain */}
            <div className="mt-6 pt-5 border-t border-[#d4af37]/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8e8b82] font-mono">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-400/80" />
                4 Middlemen Layers add markups, delays, and shelf-degradation
              </span>
              <span className="text-[#c9a227]">
                Produce travels through 5+ transit handoffs
              </span>
            </div>
          </motion.div>
        </div>

        {/* ========================================================================= */}
        {/* TWO-COLUMN COMPARISON LAYOUT (SIDE-BY-SIDE CARDS)                         */}
        {/* ========================================================================= */}
        <div className="mt-14 sm:mt-18">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* CARD 1 — Traditional Market (Muted/Dim, Less Gold Emphasis) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
              id="comparison-traditional-card"
              className="relative p-6 sm:p-8 rounded-3xl bg-[#0e0d0b]/80 border border-[#2b271d] backdrop-blur-md flex flex-col justify-between group hover:border-[#3d3728] transition-all duration-300"
            >
              <div>
                {/* Card Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#78756d]">
                      CONVENTIONAL ECOSYSTEM
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#dcd7c9] mt-1">
                      Traditional Market
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-[#141310] border border-white/10 flex items-center justify-center text-[#78756d]">
                    <TrendingDown className="w-5 h-5 text-red-400/80" />
                  </div>
                </div>

                {/* Pricing Metrics */}
                <div className="space-y-4 mb-6">
                  {/* Metric 1: Farmer Receives */}
                  <div className="p-4 rounded-2xl bg-[#13120e]/60 border border-white/5 flex items-center justify-between">
                    <div>
                      <span className="block text-xs uppercase font-mono tracking-wider text-[#8e8b82]">
                        Farmer Receives
                      </span>
                      <span className="text-xs text-[#615e57]">Low farm-gate yield</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl sm:text-3xl font-serif font-bold text-[#b5b0a3]">
                        ₹20
                      </span>
                      <span className="block text-[10px] font-mono text-red-400/80">
                        ~44% of consumer price
                      </span>
                    </div>
                  </div>

                  {/* Metric 2: Customer Pays */}
                  <div className="p-4 rounded-2xl bg-[#13120e]/60 border border-white/5 flex items-center justify-between">
                    <div>
                      <span className="block text-xs uppercase font-mono tracking-wider text-[#8e8b82]">
                        Customer Pays
                      </span>
                      <span className="text-xs text-[#615e57]">Markups & margin stack</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl sm:text-3xl font-serif font-bold text-[#b5b0a3]">
                        ₹45
                      </span>
                      <span className="block text-[10px] font-mono text-red-400/80">
                        +₹25 lost to middlemen
                      </span>
                    </div>
                  </div>
                </div>

                {/* Highlights breakdown */}
                <div className="space-y-2 text-xs text-[#78756d] font-sans">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-400/70 shrink-0" />
                    <span>Farmer bears crop risk, middlemen take bulk margin</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-400/70 shrink-0" />
                    <span>Customer receives aged produce through multi-day transit</span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mt-8 pt-4 border-t border-white/5 text-center text-xs font-mono text-[#615e57]">
                Inefficient Value Extraction
              </div>
            </motion.div>

            {/* CARD 2 — Auric Arohi (Stronger Gold Glow/Border Emphasis) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] as const }}
              id="comparison-auric-arohi-card"
              className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#18150d] via-[#12100b] to-[#0d0c09] border-2 border-[#d4af37]/60 shadow-[0_0_50px_-10px_rgba(212,175,55,0.35)] backdrop-blur-md flex flex-col justify-between group card-lift-glow"
            >
              {/* Highlight Aura Pill */}
              <div className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#d4af37] via-[#fae69e] to-[#c9a227] text-[#0a0a0a] text-[10px] font-mono font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(212,175,55,0.6)]">
                FAIR VALUE PROTOCOL
              </div>

              <div>
                {/* Card Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#d4af37]/20">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
                      DIRECT FARM ALLOCATION
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl font-semibold gold-text-pure mt-1">
                      Auric Arohi
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3d3216] to-[#1a160b] border border-[#d4af37]/50 flex items-center justify-center text-[#fae69e] shadow-[0_0_15px_-2px_rgba(212,175,55,0.4)]">
                    <TrendingUp className="w-5 h-5 text-[#34d399]" />
                  </div>
                </div>

                {/* Pricing Metrics */}
                <div className="space-y-4 mb-6">
                  {/* Metric 1: Farmer Receives */}
                  <div className="p-4 rounded-2xl bg-[#1d190f]/90 border border-[#d4af37]/35 flex items-center justify-between shadow-[0_0_20px_-8px_rgba(212,175,55,0.2)]">
                    <div>
                      <span className="block text-xs uppercase font-mono tracking-wider text-[#fae69e] font-semibold">
                        Farmer Receives
                      </span>
                      <span className="text-xs text-[#a19e95]">+60% higher income</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl sm:text-3xl font-serif font-bold text-[#fae69e]">
                        ₹32
                      </span>
                      <span className="block text-[10px] font-mono text-[#34d399] font-medium">
                        80% retained by grower
                      </span>
                    </div>
                  </div>

                  {/* Metric 2: Customer Pays */}
                  <div className="p-4 rounded-2xl bg-[#1d190f]/90 border border-[#d4af37]/35 flex items-center justify-between shadow-[0_0_20px_-8px_rgba(212,175,55,0.2)]">
                    <div>
                      <span className="block text-xs uppercase font-mono tracking-wider text-[#fae69e] font-semibold">
                        Customer Pays
                      </span>
                      <span className="text-xs text-[#a19e95]">Guaranteed fresh pick</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl sm:text-3xl font-serif font-bold text-[#f5f3eb]">
                        ₹40
                      </span>
                      <span className="block text-[10px] font-mono text-[#34d399] font-medium">
                        Save ₹5 & get peak fresh
                      </span>
                    </div>
                  </div>
                </div>

                {/* Highlights breakdown */}
                <div className="space-y-2 text-xs text-[#dcd7c9] font-sans">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#34d399] shrink-0" />
                    <span>Fair pricing indexed autonomously by AI demand routing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#34d399] shrink-0" />
                    <span>Customer receives harvest within hours of picking</span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mt-8 pt-4 border-t border-[#d4af37]/20 flex items-center justify-center gap-2 text-xs font-mono text-[#d4af37]">
                <Sparkles className="w-3.5 h-3.5 text-[#fae69e]" />
                <span>Optimal Direct Value Equilibrium</span>
              </div>
            </motion.div>
          </div>

          {/* ========================================================================= */}
          {/* DISCLAIMER TEXT */}
          {/* ========================================================================= */}
          <div className="mt-6 text-center">
            <p
              id="problem-disclaimer"
              className="text-xs text-[#6e6b63] font-mono tracking-normal max-w-xl mx-auto"
            >
              Figures shown are illustrative examples, not fixed or guaranteed prices.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
