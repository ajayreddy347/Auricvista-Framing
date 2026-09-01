import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Sparkles,
  Wheat,
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
  Mail,
  ShieldCheck,
  Heart,
} from 'lucide-react';

export const FinalCTAAndFooter: React.FC = () => {
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

  const footerLinks = {
    marketplace: [
      { name: 'Vegetables', href: '#produce-marketplace-section' },
      { name: 'Fruits', href: '#produce-marketplace-section' },
      { name: 'Grains & Millets', href: '#produce-marketplace-section' },
      { name: 'Dairy & Farm Eggs', href: '#produce-marketplace-section' },
      { name: 'Seasonal Baskets', href: '#smart-cart-section' },
    ],
    company: [
      { name: 'About AuricVista', href: '#' },
      { name: 'Farmer Impact Story', href: '#community-impact-section' },
      { name: 'Traceability Standard', href: '#traceability-section' },
      { name: 'Careers & Fellows', href: '#' },
      { name: 'Press & Media', href: '#' },
    ],
    support: [
      { name: 'Help Center', href: '#' },
      { name: 'Contact Concierge', href: '#' },
      { name: 'Report an Issue', href: '#trust-verification-section' },
      { name: 'Farmer Verification', href: '#trust-verification-section' },
      { name: 'Terms of Direct Sale', href: '#' },
    ],
  };

  return (
    <section id="final-cta-footer-section" className="relative bg-[#070707] overflow-hidden">
      {/* ========================================================================= */}
      {/* FINAL CTA AREA                                                            */}
      {/* ========================================================================= */}
      <div className="relative py-28 sm:py-36 px-4 sm:px-6 lg:px-8 border-t border-[#d4af37]/20">
        {/* Background ambient lighting */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] rounded-full gold-ambient-radial blur-3xl opacity-40" />
          <div className="absolute inset-0 bg-subtle-grid opacity-30 mask-gradient" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto w-full text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={containerVariants}
            className="flex flex-col items-center"
          >
            {/* Small Eyebrow */}
            <motion.div variants={itemFadeUp} className="mb-6 inline-block">
              <div
                id="final-eyebrow-pill"
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#14120c]/90 border border-[#d4af37]/40 backdrop-blur-md shadow-[0_0_20px_-5px_rgba(212,175,55,0.25)]"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#fae69e]" />
                <span className="text-[11px] font-mono font-medium tracking-[0.2em] text-[#fae69e] uppercase">
                  The Direct Agricultural Future
                </span>
              </div>
            </motion.div>

            {/* Large Two-Line Premium Typography Heading */}
            <motion.h2
              variants={itemFadeUp}
              id="final-heading"
              className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-[-0.03em] leading-[1.08] text-[#fcfbf7]"
            >
              <span className="block text-[#fcfbf7]">
                A Better Way to Buy.
              </span>
              <span className="block text-gradient-gold drop-shadow-sm mt-1 sm:mt-2">
                A Fairer Way to Farm.
              </span>
            </motion.h2>

            {/* Subtext */}
            <motion.p
              variants={itemFadeUp}
              id="final-subtext"
              className="mt-6 sm:mt-8 text-base sm:text-xl md:text-2xl text-[#c4bfae] font-normal max-w-2xl mx-auto leading-relaxed font-sans"
            >
              When farmers earn fairly, communities grow stronger.
            </motion.p>

            {/* Two Centered Action Buttons */}
            <motion.div
              variants={itemFadeUp}
              className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-md mx-auto"
            >
              {/* Primary Gold Button */}
              <a
                href="#produce-marketplace-section"
                id="start-shopping-final-btn"
                className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-9 py-4 rounded-full font-semibold text-xs sm:text-sm uppercase tracking-[0.14em] text-[#0a0a0a] bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#b89120] hover:from-[#fff0b8] hover:via-[#e6c24d] hover:to-[#c99f2b] shadow-[0_0_30px_-5px_rgba(212,175,55,0.4)] hover:shadow-[0_0_45px_0_rgba(212,175,55,0.6)] hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 cursor-pointer"
              >
                <span>START SHOPPING</span>
                <ArrowRight className="w-4 h-4 text-[#0a0a0a] group-hover:translate-x-1 transition-transform duration-300" />
              </a>

              {/* Secondary Outlined Button */}
              <a
                href="#dashboards-section"
                id="become-farmer-final-btn"
                className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-9 py-4 rounded-full font-medium text-xs sm:text-sm uppercase tracking-[0.14em] text-[#f5f3eb] bg-[#12110c]/80 hover:bg-[#d4af37]/15 border border-[#d4af37]/45 hover:border-[#d4af37] backdrop-blur-md shadow-[0_0_20px_-8px_rgba(212,175,55,0.15)] hover:shadow-[0_0_30px_-5px_rgba(212,175,55,0.35)] hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 cursor-pointer"
              >
                <span>BECOME A FARMER</span>
                <ArrowRight className="w-4 h-4 text-[#d4af37] group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FULL WIDTH FOOTER                                                         */}
      {/* ========================================================================= */}
      <footer className="relative w-full border-t border-[#d4af37]/25 bg-[#050505] text-[#aba79c] pt-16 pb-12 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-[#d4af37]/15">
            {/* Left: Logo Wordmark + Tagline */}
            <div className="md:col-span-4 flex flex-col justify-between">
              <div>
                <a href="#" className="inline-flex items-center gap-3 group">
                  <div className="w-9 h-9 rounded-xl bg-[#1d1910] border border-[#d4af37]/50 flex items-center justify-center text-[#fae69e] group-hover:scale-105 transition-transform shadow-[0_0_15px_-3px_rgba(212,175,55,0.3)]">
                    <Wheat className="w-5 h-5" />
                  </div>
                  <span className="font-serif text-2xl font-bold tracking-[0.18em] text-[#fcfbf7] group-hover:text-[#fae69e] transition-colors uppercase">
                    AURICVISTA
                  </span>
                </a>
                <p className="mt-3 text-sm text-[#8e8b82] font-mono tracking-wider">
                  Direct From the Farm.
                </p>
                <p className="mt-4 text-xs text-[#6e6b63] leading-relaxed max-w-sm font-sans">
                  The direct agricultural exchange uniting regenerative regional growers with conscious consumers, restaurants, and wholesale institutions.
                </p>
              </div>

              <div className="mt-6 flex items-center gap-2 text-xs font-mono text-[#c9a227]">
                <ShieldCheck className="w-4 h-4 text-[#34d399]" />
                <span>Zero-Intermediary Guarantee</span>
              </div>
            </div>

            {/* Middle: Simple Link Columns */}
            <div className="md:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-8">
              {/* Marketplace Column */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-[#f5f3eb] font-semibold mb-4">
                  Marketplace
                </h4>
                <ul className="space-y-2.5 text-xs font-sans">
                  {footerLinks.marketplace.map((item, idx) => (
                    <li key={idx}>
                      <a
                        href={item.href}
                        className="text-[#9e9b92] hover:text-[#fae69e] transition-colors"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company Column */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-[#f5f3eb] font-semibold mb-4">
                  Company
                </h4>
                <ul className="space-y-2.5 text-xs font-sans">
                  {footerLinks.company.map((item, idx) => (
                    <li key={idx}>
                      <a
                        href={item.href}
                        className="text-[#9e9b92] hover:text-[#fae69e] transition-colors"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support Column */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-[#f5f3eb] font-semibold mb-4">
                  Support
                </h4>
                <ul className="space-y-2.5 text-xs font-sans">
                  {footerLinks.support.map((item, idx) => (
                    <li key={idx}>
                      <a
                        href={item.href}
                        className="text-[#9e9b92] hover:text-[#fae69e] transition-colors"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: Social Icon Placeholders */}
            <div className="md:col-span-2 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-[#f5f3eb] font-semibold mb-4">
                  Connect
                </h4>
                <div className="flex items-center gap-3">
                  <a
                    href="#"
                    aria-label="Instagram"
                    className="w-8 h-8 rounded-lg bg-[#14120e] border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] hover:text-[#fae69e] hover:border-[#fae69e] transition-all"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a
                    href="#"
                    aria-label="Twitter"
                    className="w-8 h-8 rounded-lg bg-[#14120e] border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] hover:text-[#fae69e] hover:border-[#fae69e] transition-all"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a
                    href="#"
                    aria-label="LinkedIn"
                    className="w-8 h-8 rounded-lg bg-[#14120e] border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] hover:text-[#fae69e] hover:border-[#fae69e] transition-all"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a
                    href="#"
                    aria-label="Facebook"
                    className="w-8 h-8 rounded-lg bg-[#14120e] border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] hover:text-[#fae69e] hover:border-[#fae69e] transition-all"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="mt-6">
                <span className="text-[11px] font-mono text-[#6e6b63] block mb-1">
                  HQ: Bengaluru, Karnataka
                </span>
                <span className="text-[10px] font-mono text-[#c9a227]">
                  agri-network@auricvista.com
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Line, Small Gray Text, Centered */}
          <div className="pt-8 text-center">
            <p className="text-xs font-mono text-[#66635a]">
              © 2026 AuricVista. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </section>
  );
};
