import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ShoppingCart, Calendar, ArrowRight, ShieldCheck, Repeat, Clock, Layers } from 'lucide-react';
import { SmartCartBuilderModal } from './SmartCartBuilderModal';

export const SmartCartHomeSection: React.FC = () => {
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);

  return (
    <section
      id="smart-cart-routine"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#14120c] via-[#1a150e] to-[#12140e] overflow-hidden"
    >
      {/* Subtle amber & golden ambient backlight */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-[radial-gradient(ellipse,rgba(245,158,11,0.08)_0%,rgba(212,175,55,0.04)_50%,transparent_75%)] blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Value Proposition */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#241c10] border border-[#d4af37]/40 mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="text-[11px] font-mono font-bold tracking-widest text-[#fae69e] uppercase">
                Automated Farm Baskets
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#fcfbf7] tracking-tight leading-[1.15]">
              Personalized Smart Cart Routines.
            </h2>

            <p className="mt-5 text-base sm:text-lg text-[#d0cbc0] leading-relaxed font-sans">
              Set up your essential fruits, vegetables, unpolished pulses, and cold-pressed oils on a custom recurring schedule. Fresh morning harvests delivered automatically directly from verified farmers.
            </p>

            {/* Routine Feature Highlights */}
            <div className="mt-8 space-y-4 font-sans text-sm text-[#c4bfae]">
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-[#221c12] border border-[#d4af37]/40 flex items-center justify-center text-[#fae69e] shrink-0 mt-0.5 shadow-sm">
                  <Repeat className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-[#fcfbf7] font-serif text-base">Flexible Cadence</h4>
                  <p className="text-xs text-[#aba79c] mt-0.5">Choose Daily, Weekly, or Bi-weekly schedules. Pause, edit, or cancel anytime with one tap.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-[#221c12] border border-[#d4af37]/40 flex items-center justify-center text-[#fae69e] shrink-0 mt-0.5 shadow-sm">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-[#fcfbf7] font-serif text-base">Multi-Farmer Consolidation</h4>
                  <p className="text-xs text-[#aba79c] mt-0.5">Combine Alphonso mangoes from Karnataka, Basmati from Punjab, and spices from Kerala in a single routine basket.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-[#221c12] border border-[#d4af37]/40 flex items-center justify-center text-[#34d399] shrink-0 mt-0.5 shadow-sm">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-[#fcfbf7] font-serif text-base">Zero Middleman Markup</h4>
                  <p className="text-xs text-[#aba79c] mt-0.5">Direct farm-gate pricing with guaranteed fresh morning harvest packing.</p>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <button
                type="button"
                onClick={() => setIsBuilderOpen(true)}
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-full font-serif font-bold text-xs sm:text-sm uppercase tracking-wider text-[#0a0a0a] bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#c9a227] hover:brightness-110 shadow-[0_0_30px_rgba(212,175,55,0.45)] active:scale-[0.99] transition-all cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4 text-[#0a0a0a]" />
                <span>Build My Smart Cart</span>
                <ArrowRight className="w-4 h-4 text-[#0a0a0a] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right: Interactive Preview Card */}
          <div className="lg:col-span-6">
            <div className="p-7 sm:p-9 rounded-3xl bg-gradient-to-br from-[#201b13]/95 via-[#18140e]/95 to-[#120f0a]/95 border border-[#d4af37]/35 shadow-2xl relative overflow-hidden backdrop-blur-md">
              <div className="flex items-center justify-between pb-5 border-b border-[#d4af37]/20">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#fae69e]">Smart Routine Preview</span>
                  <h3 className="font-serif font-bold text-xl text-[#fcfbf7] mt-0.5">Weekly Farm Essentials Basket</h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#2a2214] border border-[#d4af37]/45 text-xs font-mono font-bold text-[#fae69e]">
                  Every Monday
                </span>
              </div>

              {/* Sample Items */}
              <div className="py-6 space-y-3.5">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#1a150e]/80 border border-[#d4af37]/20">
                  <div className="flex items-center gap-3">
                    <img src="/assets/produce/vegetables/tomato.jpg" alt="Tomatoes" className="w-11 h-11 rounded-xl object-cover border border-[#d4af37]/30" />
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#fcfbf7]">Heirloom Vine Tomatoes</h4>
                      <span className="text-[11px] text-[#aba79c]">2 kg • Organic Certified</span>
                    </div>
                  </div>
                  <span className="font-serif font-bold text-sm text-[#fae69e]">₹90</span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#1a150e]/80 border border-[#d4af37]/20">
                  <div className="flex items-center gap-3">
                    <img src="/assets/produce/organic-natural/coconut-oil.jpg" alt="Coconut Oil" className="w-11 h-11 rounded-xl object-cover border border-[#d4af37]/30" />
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#fcfbf7]">Cold-Pressed Coconut Oil</h4>
                      <span className="text-[11px] text-[#aba79c]">1 Litre • Marachekku</span>
                    </div>
                  </div>
                  <span className="font-serif font-bold text-sm text-[#fae69e]">₹380</span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#1a150e]/80 border border-[#d4af37]/20">
                  <div className="flex items-center gap-3">
                    <img src="/assets/produce/herbs/spinach.jpg" alt="Spinach" className="w-11 h-11 rounded-xl object-cover border border-[#d4af37]/30" />
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#fcfbf7]">Hydroponic Baby Spinach</h4>
                      <span className="text-[11px] text-[#aba79c]">500 g • Dawn Harvest</span>
                    </div>
                  </div>
                  <span className="font-serif font-bold text-sm text-[#fae69e]">₹45</span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-4 border-t border-[#d4af37]/20 flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#aba79c] block font-mono">Estimated Routine Cost</span>
                  <span className="font-serif font-bold text-xl text-[#fae69e]">₹515 <span className="text-xs font-normal text-[#aba79c] font-sans">/ delivery</span></span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBuilderOpen(true)}
                  className="px-5 py-2.5 rounded-xl font-serif font-bold text-xs uppercase tracking-wider text-[#fae69e] bg-[#2a2215] hover:bg-[#362b1a] border border-[#d4af37]/50 transition-colors cursor-pointer shadow-sm"
                >
                  Customize Basket
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Routine Builder Modal */}
      <SmartCartBuilderModal
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
      />
    </section>
  );
};
