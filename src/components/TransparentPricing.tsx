import { useLanguage } from '../context/LanguageContext';
import React from 'react';
import { motion } from 'motion/react';
import {
  Coins,
  ShieldCheck,
  Truck,
  Settings,
  UserCheck,
  TrendingUp,
  Percent,
} from 'lucide-react';

export const TransparentPricing: React.FC = () => {
  const { t } = useLanguage();
  const breakdown = [
    {
      id: 'farmer',
      label: 'Farmer',
      sublabel: 'Direct Agricultural Escrow',
      amount: '₹78',
      percentage: 78,
      icon: UserCheck,
      color: 'from-[#d4af37] via-[#fae69e] to-[#c9a227]',
      textColor: 'text-[#fae69e]',
      borderColor: 'border-[#d4af37]/40',
      bgColor: 'bg-[#1c180e]',
    },
    {
      id: 'delivery',
      label: 'Delivery',
      sublabel: 'Cold-Chain Local Transit',
      amount: '₹12',
      percentage: 12,
      icon: Truck,
      color: 'from-[#9b7617] to-[#72540b]',
      textColor: 'text-[#d4af37]',
      borderColor: 'border-[#9b7617]/40',
      bgColor: 'bg-[#14120c]',
    },
    {
      id: 'platform',
      label: 'Auric Arohi Platform',
      sublabel: 'AI Verification & Infrastructure',
      amount: '₹10',
      percentage: 10,
      icon: Settings,
      color: 'from-[#4a3e1b] to-[#2b2410]',
      textColor: 'text-[#aba79c]',
      borderColor: 'border-[#d4af37]/20',
      bgColor: 'bg-[#100f0b]',
    },
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

  return (
    <section
      id="transparent-pricing-section"
      className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-transparent border-t border-[#d4af37]/15 backdrop-blur-[2px] overflow-hidden"
    >
      {/* Ambient gold glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full gold-ambient-secondary blur-3xl opacity-35" />
        <div className="absolute inset-0 bg-subtle-grid opacity-30 mask-gradient" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto w-full">
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
              id="pricing-eyebrow-pill"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14120c]/80 border border-[#d4af37]/30 backdrop-blur-md shadow-[0_0_15px_-5px_rgba(212,175,55,0.15)]"
            >
              <Coins className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="text-[11px] font-mono font-medium tracking-[0.2em] text-[#e8dfca] uppercase">
                {t('pricing.eyebrow', '100% Transparent Economics')}
              </span>
            </div>
          </motion.div>

          <motion.h2
            variants={itemFadeUp}
            id="pricing-heading"
            className="font-serif text-3xl sm:text-5xl md:text-6xl font-medium tracking-[-0.02em] leading-[1.12] text-[#fcfbf7]"
          >
            <span className="block text-[#fcfbf7]">
              {t('pricing.heading', 'Where Your Money Goes')}
            </span>
          </motion.h2>

          <motion.p
            variants={itemFadeUp}
            id="pricing-subtext"
            className="mt-4 sm:mt-5 text-base sm:text-lg md:text-xl text-[#aba79c] font-normal leading-relaxed font-sans"
          >
            {t('pricing.subtext', 'No hidden middleman markups. See exactly how every rupee is distributed.')}
          </motion.p>
        </motion.div>

        {/* ========================================================================= */}
        {/* TRANSPARENT PRICING CARD                                                 */}
        {/* ========================================================================= */}
        <motion.div
          variants={itemFadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-14 sm:mt-18"
        >
          <div
            id="transparent-breakdown-card"
            className="group relative p-7 sm:p-10 md:p-12 rounded-3xl bg-[#0e0d0b]/90 border-2 border-[#d4af37]/45 hover:border-[#d4af37] backdrop-blur-2xl transition-all duration-300 shadow-[0_0_50px_-15px_rgba(212,175,55,0.25)] hover:shadow-[0_0_60px_-10px_rgba(212,175,55,0.4)]"
          >
            {/* Top Row: Base Sample Benchmark */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#d4af37]/20">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#c9a227]">
                  {t('pricing.benchmarkTitle', 'SAMPLE ORDER BENCHMARK')}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#f5f3eb] mt-1">
                  {t('pricing.customerPays', 'Customer pays')} <span className="text-[#fae69e]">₹100</span>
                </h3>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#18150d] border border-[#d4af37]/30 text-xs font-mono text-[#dcd7c9] self-start sm:self-auto">
                <Percent className="w-3.5 h-3.5 text-[#34d399]" />
                <span>{t('pricing.zeroHidden', 'Zero Hidden Commissions')}</span>
              </div>
            </div>

            {/* Segmented Animated Progress Bar */}
            <div className="mt-8 mb-10">
              <div className="h-5 sm:h-6 w-full rounded-full bg-[#14120d] p-1 border border-[#d4af37]/30 overflow-hidden flex gap-1">
                {/* Farmer Segment (78%) */}
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '78%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] as const }}
                  className="h-full rounded-l-full bg-gradient-to-r from-[#d4af37] via-[#fae69e] to-[#c9a227] shadow-[0_0_12px_rgba(212,175,55,0.5)] relative group/segment"
                />

                {/* Delivery Segment (12%) */}
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '12%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
                  className="h-full bg-gradient-to-r from-[#9b7617] to-[#72540b] shadow-[0_0_10px_rgba(155,118,23,0.4)]"
                />

                {/* Platform Segment (10%) */}
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '10%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.1, delay: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
                  className="h-full rounded-r-full bg-gradient-to-r from-[#4a3e1b] to-[#2b2410] border-l border-black/40"
                />
              </div>

              {/* Bar Legend Labels */}
              <div className="flex justify-between text-[11px] font-mono mt-2.5 text-[#8e8b82]">
                <span className="text-[#fae69e] font-semibold">{t('pricing.farmerShare', '78% to Farmer')}</span>
                <span className="text-[#d4af37]">{t('pricing.deliveryShare', '12% Delivery')}</span>
                <span className="text-[#aba79c]">{t('pricing.platformShare', '10% Platform')}</span>
              </div>
            </div>

            {/* Detailed List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {breakdown.map((item) => {
                const IconComp = item.icon;
                return (
                  <div
                    key={item.id}
                    className={`p-5 rounded-2xl ${item.bgColor} border ${item.borderColor} flex flex-col justify-between`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-black/40 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className="text-xl sm:text-2xl font-serif font-bold text-[#f5f3eb]">
                        {item.amount}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-serif text-lg font-semibold text-[#f5f3eb]">
                        {item.label}
                      </h4>
                      <p className="text-[11px] text-[#8e8b82] font-sans">
                        {item.sublabel}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* BOLD GOLD LINE & DISCLAIMER                                               */}
        {/* ========================================================================= */}
        <motion.div
          variants={itemFadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <p
            id="pricing-bold-gold-line"
            className="text-lg sm:text-xl font-serif font-semibold text-[#fae69e] tracking-wide"
          >
            {t('pricing.boldLine', 'No Hidden Middleman Markups.')}
          </p>
          <p
            id="pricing-disclaimer"
            className="mt-2 text-xs text-[#78756d] font-sans"
          >
            {t('pricing.disclaimer', 'Actual distribution may vary by product, farmer, and delivery distance.')}
          </p>
        </motion.div>
      </div>
    </section>
  );
};
