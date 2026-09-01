import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  Tractor,
  Cpu,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Leaf,
  X,
  Layers,
  ChevronRight
} from 'lucide-react';

export const Hero: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'produce' | 'farmer' | null>(null);
  const navigate = useNavigate();

  // Motion variants for staged entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemFadeUp = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.85,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <section
      id="hero-section"
      className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center overflow-hidden py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#070707]"
    >
      {/* ========================================================================= */}
      {/* CSS AMBIENT BACKGROUND GLOW & PARTICLES */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        {/* Top Gold Radial Flare */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] sm:w-[900px] h-[550px] rounded-full gold-ambient-radial animate-gold-glow blur-3xl opacity-70" />

        {/* Center Secondary Ambient Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[400px] rounded-full gold-ambient-secondary blur-2xl opacity-60" />

        {/* Subtle Geometric Micro-Grid */}
        <div className="absolute inset-0 bg-subtle-grid opacity-60 mask-gradient" />

        {/* Floating Ambient Light Dust / Particles */}
        <div className="absolute top-1/4 left-[15%] w-1.5 h-1.5 rounded-full bg-[#fae69e] shadow-[0_0_12px_#fae69e] animate-particle-1" />
        <div className="absolute top-1/3 right-[18%] w-2 h-2 rounded-full bg-[#d4af37] shadow-[0_0_15px_#d4af37] animate-particle-2" />
        <div className="absolute bottom-1/4 left-[25%] w-1 h-1 rounded-full bg-[#fdf8e6] shadow-[0_0_8px_#fdf8e6] animate-particle-3" />
        <div className="absolute bottom-1/3 right-[30%] w-1.5 h-1.5 rounded-full bg-[#c9a227] shadow-[0_0_10px_#c9a227] animate-particle-1" />
      </div>

      {/* ========================================================================= */}
      {/* HERO MAIN CONTAINER */}
      {/* ========================================================================= */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl mx-auto w-full flex flex-col items-center text-center"
      >
        {/* Eyebrow Pill */}
        <motion.div variants={itemFadeUp} className="mb-6 sm:mb-8">
          <div
            id="hero-eyebrow-pill"
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#14120c]/80 border border-[#d4af37]/35 backdrop-blur-md shadow-[0_0_20px_-5px_rgba(212,175,55,0.2)]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="text-[11px] sm:text-xs font-mono font-medium tracking-[0.2em] text-[#e8dfca] uppercase">
              Decentralized Agricultural Intelligence
            </span>
          </div>
        </motion.div>

        {/* Large Heading (Two Lines) */}
        <motion.h1
          variants={itemFadeUp}
          id="hero-main-heading"
          className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-[5.25rem] font-medium tracking-[-0.02em] leading-[1.08] text-[#fcfbf7] max-w-4xl mx-auto"
        >
          <span className="block text-[#fcfbf7] drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)]">
            From Their Fields.
          </span>
          <span className="block gold-text-metallic font-semibold tracking-[-0.015em] mt-1 sm:mt-2">
            Directly to Your Table.
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          variants={itemFadeUp}
          id="hero-subtext"
          className="mt-6 sm:mt-8 text-base sm:text-lg md:text-xl text-[#aba79c] font-normal leading-relaxed max-w-2xl mx-auto tracking-normal font-sans"
        >
          AuricVista connects farmers directly with customers, reducing
          unnecessary intermediaries while making fresh, fairly priced produce
          accessible to everyone.
        </motion.p>

        {/* Two CTAs Side-by-Side */}
        <motion.div
          variants={itemFadeUp}
          id="hero-cta-group"
          className="mt-9 sm:mt-11 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          {/* Primary Gold Button */}
          <button
            id="primary-explore-produce-btn"
            onClick={() => setActiveModal('produce')}
            className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-semibold text-xs sm:text-sm uppercase tracking-[0.14em] text-[#0a0a0a] bg-gradient-to-r from-[#d4af37] via-[#f7e6a4] to-[#c9a227] shadow-[0_0_30px_-5px_rgba(212,175,55,0.45)] hover:shadow-[0_0_40px_2px_rgba(212,175,55,0.7)] hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 cursor-pointer overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              EXPLORE FRESH PRODUCE
              <ArrowRight className="w-4 h-4 text-[#0a0a0a] group-hover:translate-x-1 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>

          {/* Secondary Outlined Gold Button */}
          <button
            id="secondary-join-farmer-btn"
            onClick={() => setActiveModal('farmer')}
            className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-medium text-xs sm:text-sm uppercase tracking-[0.14em] text-[#f5f3eb] bg-[#12110c]/80 hover:bg-[#d4af37]/15 border border-[#d4af37]/45 hover:border-[#d4af37] backdrop-blur-md shadow-[0_0_20px_-8px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_-5px_rgba(212,175,55,0.35)] hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 cursor-pointer"
          >
            <span>JOIN AS A FARMER</span>
            <ArrowUpRight className="w-4 h-4 text-[#d4af37] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </button>
        </motion.div>

        {/* ========================================================================= */}
        {/* CONNECTED NODES DIAGRAM: FARMER → AURICVISTA → CUSTOMER */}
        {/* ========================================================================= */}
        <motion.div
          variants={itemFadeUp}
          id="hero-connected-diagram"
          className="mt-14 sm:mt-20 w-full max-w-4xl pt-6"
        >
          {/* Section Indicator */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#d4af37]/40" />
            <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#c9a227]">
              DIRECT VALUE CHAIN
            </span>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#d4af37]/40" />
          </div>

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 md:gap-3 p-4 sm:p-6 md:p-8 rounded-3xl bg-[#0e0d0a]/70 border border-[#d4af37]/25 backdrop-blur-xl shadow-[0_0_50px_-15px_rgba(212,175,55,0.15)]">
            
            {/* NODE 1: FARMER */}
            <div
              id="node-farmer"
              className="group relative flex-1 w-full md:w-auto p-5 sm:p-6 rounded-2xl bg-[#14120d]/90 border border-[#d4af37]/35 hover:border-[#d4af37] transition-all duration-300 shadow-[0_0_20px_-8px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_-5px_rgba(212,175,55,0.35)] flex flex-col items-center text-center"
            >
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[#2a2412] to-[#12100a] border border-[#d4af37]/40 flex items-center justify-center mb-3 shadow-[0_0_15px_-3px_rgba(212,175,55,0.3)] group-hover:scale-105 transition-transform">
                <Tractor className="w-6 h-6 text-[#fae69e]" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs uppercase font-mono tracking-[0.2em] text-[#d4af37] font-bold">
                  FARMER
                </span>
              </div>
              <p className="text-xs text-[#a19e95] mt-1.5 font-sans leading-tight">
                Direct Harvest & Fair Yield Value
              </p>
              <div className="mt-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#d4af37]/10 text-[10px] text-[#e8dfca] font-mono border border-[#d4af37]/20">
                <CheckCircle2 className="w-2.5 h-2.5 text-[#34d399]" />
                <span>100% Retained Margin</span>
              </div>
            </div>

            {/* CONNECTOR 1: Flow Line (Desktop horizontal, Mobile vertical) */}
            <div className="hidden md:flex flex-col items-center justify-center w-14 shrink-0 relative px-1">
              <div className="w-full h-[2px] animated-signal-line relative rounded-full" />
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-[#1b1810] border border-[#d4af37]/40 text-[9px] font-mono text-[#fae69e]">
                ZERO FEE
              </div>
              <ArrowRight className="w-4 h-4 text-[#d4af37] absolute -right-2 top-1/2 -translate-y-1/2" />
            </div>

            {/* Mobile Vertical Connector */}
            <div className="md:hidden flex flex-col items-center py-1">
              <div className="w-[2px] h-8 bg-gradient-to-b from-[#d4af37]/20 via-[#d4af37] to-[#d4af37]/20" />
              <div className="w-2 h-2 rounded-full bg-[#d4af37] shadow-[0_0_6px_#d4af37]" />
            </div>

            {/* NODE 2: AURICVISTA (Center Featured Node) */}
            <div
              id="node-auricvista"
              className="group relative flex-1 w-full md:w-auto p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#1c180e] to-[#12100b] border-2 border-[#d4af37]/60 hover:border-[#fae69e] transition-all duration-300 shadow-[0_0_35px_-8px_rgba(212,175,55,0.35)] hover:shadow-[0_0_45px_-5px_rgba(212,175,55,0.55)] flex flex-col items-center text-center transform md:-translate-y-1"
            >
              {/* Highlight Aura */}
              <div className="absolute -top-2.5 px-3 py-0.5 rounded-full bg-gradient-to-r from-[#d4af37] to-[#fae69e] text-[#0a0a0a] text-[9px] font-mono font-bold tracking-widest uppercase shadow-[0_0_12px_rgba(212,175,55,0.5)]">
                AI DIRECT CORE
              </div>

              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[#3d3216] to-[#1a160b] border border-[#fae69e]/60 flex items-center justify-center mb-3 mt-1 shadow-[0_0_20px_-3px_rgba(212,175,55,0.4)] group-hover:scale-105 transition-transform">
                <Cpu className="w-6 h-6 text-[#fae69e]" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs uppercase font-mono tracking-[0.25em] text-[#fae69e] font-bold">
                  AURICVISTA
                </span>
              </div>
              <p className="text-xs text-[#dcd7c9] mt-1.5 font-sans leading-tight">
                AI Quality Match & Transparent Routing
              </p>
              <div className="mt-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#d4af37]/20 text-[10px] text-[#fae69e] font-mono border border-[#d4af37]/40">
                <Sparkles className="w-2.5 h-2.5 text-[#fae69e]" />
                <span>Zero Middlemen</span>
              </div>
            </div>

            {/* CONNECTOR 2: Flow Line (Desktop horizontal, Mobile vertical) */}
            <div className="hidden md:flex flex-col items-center justify-center w-14 shrink-0 relative px-1">
              <div className="w-full h-[2px] animated-signal-line relative rounded-full" />
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-[#1b1810] border border-[#d4af37]/40 text-[9px] font-mono text-[#fae69e]">
                DIRECT
              </div>
              <ArrowRight className="w-4 h-4 text-[#d4af37] absolute -right-2 top-1/2 -translate-y-1/2" />
            </div>

            {/* Mobile Vertical Connector */}
            <div className="md:hidden flex flex-col items-center py-1">
              <div className="w-[2px] h-8 bg-gradient-to-b from-[#d4af37]/20 via-[#d4af37] to-[#d4af37]/20" />
              <div className="w-2 h-2 rounded-full bg-[#d4af37] shadow-[0_0_6px_#d4af37]" />
            </div>

            {/* NODE 3: CUSTOMER */}
            <div
              id="node-customer"
              className="group relative flex-1 w-full md:w-auto p-5 sm:p-6 rounded-2xl bg-[#14120d]/90 border border-[#d4af37]/35 hover:border-[#d4af37] transition-all duration-300 shadow-[0_0_20px_-8px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_-5px_rgba(212,175,55,0.35)] flex flex-col items-center text-center"
            >
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[#2a2412] to-[#12100a] border border-[#d4af37]/40 flex items-center justify-center mb-3 shadow-[0_0_15px_-3px_rgba(212,175,55,0.3)] group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-6 h-6 text-[#fae69e]" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs uppercase font-mono tracking-[0.2em] text-[#d4af37] font-bold">
                  CUSTOMER
                </span>
              </div>
              <p className="text-xs text-[#a19e95] mt-1.5 font-sans leading-tight">
                Peak Freshness Delivered to Your Table
              </p>
              <div className="mt-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#d4af37]/10 text-[10px] text-[#e8dfca] font-mono border border-[#d4af37]/20">
                <Leaf className="w-2.5 h-2.5 text-[#34d399]" />
                <span>Fair, Direct Pricing</span>
              </div>
            </div>

          </div>
        </motion.div>
      </motion.div>

      {/* ========================================================================= */}
      {/* INTERACTIVE MODALS FOR BUTTON INTERACTIONS */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg rounded-2xl bg-[#0f0e0c] border border-[#d4af37]/45 p-6 sm:p-8 shadow-[0_0_50px_-10px_rgba(212,175,55,0.35)] z-10"
            >
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-[#a19e95] hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {activeModal === 'produce' ? (
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/35 flex items-center justify-center mb-5 text-[#d4af37]">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#c9a227]">
                    DIRECT CATALOGUE ACCESS
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#f5f3eb] tracking-wide mt-1 mb-3">
                    Fresh Harvest Allocations
                  </h3>
                  <p className="text-sm text-[#a19e95] leading-relaxed mb-6 font-sans">
                    AuricVista sources directly from verified regional farms. Harvest orders are verified by AI quality sensors and dispatched within hours of picking.
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-[#16140f] border border-[#d4af37]/20 text-xs">
                      <span className="text-[#f5f3eb] font-medium">Heirloom Organic Honeycrisp Apples</span>
                      <span className="font-mono text-[#d4af37] font-semibold">Direct Farm: $2.40/lb</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-[#16140f] border border-[#d4af37]/20 text-xs">
                      <span className="text-[#f5f3eb] font-medium">Hydroponic Butterhead Lettuce</span>
                      <span className="font-mono text-[#d4af37] font-semibold">Direct Farm: $1.85/unit</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-[#16140f] border border-[#d4af37]/20 text-xs">
                      <span className="text-[#f5f3eb] font-medium">Artisanal Sun-Ripened Vine Tomatoes</span>
                      <span className="font-mono text-[#d4af37] font-semibold">Direct Farm: $3.10/lb</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveModal(null);
                      navigate('/marketplace');
                    }}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#fae69e] to-[#c9a227] text-[#0a0a0a] font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-[0_0_25px_-5px_rgba(212,175,55,0.4)] cursor-pointer"
                  >
                    Enter Private Market →
                  </button>
                </div>
              ) : (
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/35 flex items-center justify-center mb-5 text-[#d4af37]">
                    <Tractor className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#c9a227]">
                    GROWER ONBOARDING
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#f5f3eb] tracking-wide mt-1 mb-3">
                    Join the Direct Farm Network
                  </h3>
                  <p className="text-sm text-[#a19e95] leading-relaxed mb-6 font-sans">
                    Eliminate predatory middlemen. List your harvest directly on AuricVista's AI protocol, receive instant payouts, and retain true value for your hard work.
                  </p>

                  <div className="space-y-2.5 mb-6 text-xs text-[#dcd7c9]">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#34d399] shrink-0" />
                      <span>Zero commission extortion — 100% fair trade indexing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#34d399] shrink-0" />
                      <span>Direct-to-consumer automated logistics routing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#34d399] shrink-0" />
                      <span>Predictive demand matching for pre-harvest sales</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveModal(null);
                      navigate('/signup?role=farmer');
                    }}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#fae69e] to-[#c9a227] text-[#0a0a0a] font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-[0_0_25px_-5px_rgba(212,175,55,0.4)] cursor-pointer"
                  >
                    Submit Farm Credentials ↗
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
