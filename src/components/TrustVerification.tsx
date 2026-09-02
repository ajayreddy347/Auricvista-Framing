import React from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Navigation,
  RefreshCw,
  Star,
  AlertTriangle,
  Headphones,
  Award,
  Sparkles,
  UserCheck,
  MapPin,
  FileCheck,
  MessageSquare,
} from 'lucide-react';

export const TrustVerification: React.FC = () => {
  const verifiedList = [
    { label: 'Identity', desc: 'Government KYC & landholding deed verification', icon: UserCheck },
    { label: 'Farm Information', desc: 'Soil test reports & certified natural/organic cultivation practices', icon: FileCheck },
    { label: 'Location', desc: 'GPS-tagged regional farm plots with geo-radius routing', icon: MapPin },
    { label: 'Product Information', desc: 'Strict daily harvest manifests with zero post-harvest chemicals', icon: CheckCircle2 },
    { label: 'Customer Reviews', desc: '100% verified consumer purchase ratings and feedback', icon: Star },
  ];

  const safetyList = [
    { label: 'Secure Payments', desc: 'Direct-to-farmer bank escrow with 256-bit encryption', icon: Lock },
    { label: 'Order Tracking', desc: 'Real-time harvest, packing, and dispatch telemetry', icon: Navigation },
    { label: 'Refund & Support System', desc: 'Instant fresh-quality replacement guarantee', icon: RefreshCw },
    { label: 'Reviews', desc: 'Authentic unfiltered grower ratings', icon: Star },
    { label: 'Report an Issue', desc: 'One-tap claim lodging with automated photo validation', icon: AlertTriangle },
    { label: 'Customer Support', desc: 'Dedicated 7-days concierge assistance for farmers & buyers', icon: Headphones },
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
      id="trust-verification-section"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#070707] border-t border-[#d4af37]/15 overflow-hidden"
    >
      {/* Ambient background gold lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] rounded-full gold-ambient-secondary blur-3xl opacity-35" />
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
              id="trust-eyebrow-pill"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14120c]/80 border border-[#d4af37]/30 backdrop-blur-md shadow-[0_0_15px_-5px_rgba(212,175,55,0.15)]"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="text-[11px] font-mono font-medium tracking-[0.2em] text-[#e8dfca] uppercase">
                Institutional Integrity
              </span>
            </div>
          </motion.div>

          <motion.h2
            variants={itemFadeUp}
            id="trust-heading"
            className="font-serif text-3xl sm:text-5xl md:text-6xl font-medium tracking-[-0.02em] leading-[1.12] text-[#fcfbf7]"
          >
            <span className="block text-[#fcfbf7]">
              Built on Trust
            </span>
          </motion.h2>

          <motion.p
            variants={itemFadeUp}
            id="trust-subtext"
            className="mt-4 sm:mt-5 text-base sm:text-lg md:text-xl text-[#aba79c] font-normal leading-relaxed font-sans"
          >
            Every farmer, every order, every transaction — verified and protected.
          </motion.p>
        </motion.div>

        {/* ========================================================================= */}
        {/* TWO-COLUMN LAYOUT: VERIFIED FARMER BADGE & SAFETY/SUPPORT                 */}
        {/* ========================================================================= */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-16 sm:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* COLUMN 1 — "Verified Farmer" Badge Showcase */}
          <motion.div
            variants={cardVariants}
            id="verified-farmer-showcase-card"
            className="group relative p-7 sm:p-9 rounded-3xl bg-[#0e0d0b]/85 border-2 border-[#d4af37]/35 hover:border-[#d4af37] backdrop-blur-xl transition-all duration-300 shadow-[0_0_30px_-10px_rgba(212,175,55,0.2)] hover:shadow-[0_0_45px_-5px_rgba(212,175,55,0.4)] flex flex-col justify-between"
          >
            <div>
              {/* Badge Header Preview */}
              <div className="flex items-center gap-4 p-5 rounded-2xl bg-[#14120e] border border-[#d4af37]/30 mb-7 shadow-[0_0_20px_-5px_rgba(212,175,55,0.2)]">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#d4af37] via-[#fae69e] to-[#9b7617] flex items-center justify-center text-[#0a0a0a] shadow-[0_0_18px_rgba(212,175,55,0.4)] shrink-0">
                  <Award className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#34d399] flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3 h-3" /> Certified Standard
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#fcfbf7] tracking-wide">
                    Verified Farmer
                  </h3>
                  <p className="text-xs text-[#aba79c] font-sans">
                    Rigorous 5-point physical & digital agricultural credentialing
                  </p>
                </div>
              </div>

              {/* Verified Checklist */}
              <div className="space-y-4">
                {verifiedList.map((item, idx) => {
                  const IconComp = item.icon;
                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-[#12100c] border border-[#d4af37]/20 flex items-start gap-3.5 hover:border-[#d4af37]/50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-xl bg-[#1c180e] border border-[#d4af37]/30 flex items-center justify-center text-[#fae69e] shrink-0 mt-0.5">
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-[#f5f3eb] font-sans">
                          {item.label}
                        </h4>
                        <p className="text-xs text-[#8e8b82] font-sans leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#d4af37]/15">
              <span className="text-[11px] font-mono text-[#c9a227] flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#34d399]" />
                100% of Auric Arohi Growers Physically Audited
              </span>
            </div>
          </motion.div>

          {/* COLUMN 2 — "Safety & Support" Bullet List */}
          <motion.div
            variants={cardVariants}
            id="safety-support-card"
            className="group relative p-7 sm:p-9 rounded-3xl bg-[#0e0d0b]/85 border-2 border-[#d4af37]/35 hover:border-[#d4af37] backdrop-blur-xl transition-all duration-300 shadow-[0_0_30px_-10px_rgba(212,175,55,0.2)] hover:shadow-[0_0_45px_-5px_rgba(212,175,55,0.4)] flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#d4af37]/20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2a2412] to-[#12100a] border border-[#d4af37]/40 flex items-center justify-center text-[#fae69e] shadow-[0_0_15px_-3px_rgba(212,175,55,0.25)]">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c9a227] block">
                      PURCHASE PROTECTION
                    </span>
                    <h3 className="font-serif text-2xl font-semibold text-[#f5f3eb] tracking-wide">
                      Safety & Support
                    </h3>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#18150d] border border-[#d4af37]/25 text-[#34d399]">
                  24/7 Guarded
                </span>
              </div>

              {/* Safety Features Grid / List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {safetyList.map((item, idx) => {
                  const IconComp = item.icon;
                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-[#12100c] border border-[#d4af37]/20 flex flex-col justify-between hover:border-[#d4af37]/50 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className="w-7 h-7 rounded-lg bg-[#1c180e] border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] shrink-0">
                          <IconComp className="w-3.5 h-3.5" />
                        </div>
                        <h4 className="text-xs font-semibold text-[#f5f3eb] font-sans">
                          {item.label}
                        </h4>
                      </div>
                      <p className="text-[11px] text-[#8e8b82] font-sans leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#d4af37]/15">
              <button className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-medium uppercase tracking-[0.14em] text-[#f5f3eb] bg-[#14120c]/70 hover:bg-[#d4af37]/15 border border-[#d4af37]/40 hover:border-[#d4af37] transition-all duration-300 cursor-pointer">
                <span>View Full Protection Policy</span>
                <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
