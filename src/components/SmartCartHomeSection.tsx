import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ShoppingCart, Calendar, ArrowRight, ShieldCheck, Repeat, Clock, Layers } from 'lucide-react';
import { SmartCartBuilderModal } from './SmartCartBuilderModal';
import { ProductImage } from './ProductImage';
import { useTheme } from '../context/ThemeContext';

export const SmartCartHomeSection: React.FC = () => {
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const { isDark } = useTheme();

  return (
    <section
      id="smart-cart-routine"
      className={`relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 transition-colors duration-300 overflow-hidden ${
        isDark
          ? 'bg-gradient-to-b from-[#14120c] via-[#1a150e] to-[#12140e]'
          : 'bg-white'
      }`}
    >
      {/* Subtle amber & golden ambient backlight in Dark Mode */}
      {isDark && (
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-[radial-gradient(ellipse,rgba(245,158,11,0.08)_0%,rgba(212,175,55,0.04)_50%,transparent_75%)] blur-3xl" />
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Value Proposition */}
          <div className="lg:col-span-6">
            <div
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border mb-4 shadow-xs transition-colors ${
                isDark
                  ? 'bg-[#241c10] border-[#d4af37]/40 text-[#fae69e]'
                  : 'bg-[#faf8f5] border-[#d4af37]/60 text-[#8f6208]'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${isDark ? 'text-[#d4af37]' : 'text-[#8f6208]'}`} />
              <span className="text-[11px] font-mono font-bold tracking-widest uppercase">
                Automated Farm Baskets
              </span>
            </div>

            <h2
              className={`font-serif text-3xl sm:text-5xl font-bold tracking-tight leading-[1.15] ${
                isDark ? 'text-[#fcfbf7]' : 'text-[#1c1917]'
              }`}
            >
              Personalized Smart Cart Routines.
            </h2>

            <p
              className={`mt-5 text-base sm:text-lg leading-relaxed font-sans ${
                isDark ? 'text-[#d0cbc0]' : 'text-[#57534e]'
              }`}
            >
              Set up your essential fruits, vegetables, unpolished pulses, and cold-pressed oils on a custom recurring schedule. Fresh morning harvests delivered automatically directly from verified farmers.
            </p>

            {/* Routine Feature Highlights */}
            <div className="mt-8 space-y-4 font-sans text-sm">
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 shadow-xs ${
                    isDark
                      ? 'bg-[#221c12] border-[#d4af37]/40 text-[#fae69e]'
                      : 'bg-[#faf8f5] border-[#d4af37]/50 text-[#8f6208]'
                  }`}
                >
                  <Repeat className="w-4 h-4" />
                </div>
                <div>
                  <h4 className={`font-bold font-serif text-base ${isDark ? 'text-[#fcfbf7]' : 'text-[#1c1917]'}`}>
                    Flexible Cadence
                  </h4>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-[#aba79c]' : 'text-[#57534e]'}`}>
                    Choose Daily, Weekly, or Bi-weekly schedules. Pause, edit, or cancel anytime with one tap.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div
                  className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 shadow-xs ${
                    isDark
                      ? 'bg-[#221c12] border-[#d4af37]/40 text-[#fae69e]'
                      : 'bg-[#faf8f5] border-[#d4af37]/50 text-[#8f6208]'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h4 className={`font-bold font-serif text-base ${isDark ? 'text-[#fcfbf7]' : 'text-[#1c1917]'}`}>
                    Multi-Farmer Consolidation
                  </h4>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-[#aba79c]' : 'text-[#57534e]'}`}>
                    Combine Alphonso mangoes from Karnataka, Basmati from Punjab, and spices from Kerala in a single routine basket.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div
                  className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 shadow-xs ${
                    isDark
                      ? 'bg-[#221c12] border-[#d4af37]/40 text-[#34d399]'
                      : 'bg-[#faf8f5] border-[#d4af37]/50 text-[#059669]'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className={`font-bold font-serif text-base ${isDark ? 'text-[#fcfbf7]' : 'text-[#1c1917]'}`}>
                    Zero Middleman Markup
                  </h4>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-[#aba79c]' : 'text-[#57534e]'}`}>
                    Direct farm-gate pricing with guaranteed fresh morning harvest packing.
                  </p>
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
            <div
              className={`p-7 sm:p-9 rounded-3xl border transition-all duration-300 relative overflow-hidden backdrop-blur-md ${
                isDark
                  ? 'bg-gradient-to-br from-[#201b13]/95 via-[#18140e]/95 to-[#120f0a]/95 border-[#d4af37]/35 shadow-2xl'
                  : 'bg-white border-[#e7e4dc] shadow-lg hover:shadow-xl'
              }`}
            >
              <div
                className={`flex items-center justify-between pb-5 border-b ${
                  isDark ? 'border-[#d4af37]/20' : 'border-[#e7e4dc]'
                }`}
              >
                <div>
                  <span
                    className={`text-[10px] font-mono font-bold uppercase tracking-widest ${
                      isDark ? 'text-[#fae69e]' : 'text-[#8f6208]'
                    }`}
                  >
                    Smart Routine Preview
                  </span>
                  <h3
                    className={`font-serif font-bold text-xl mt-0.5 ${
                      isDark ? 'text-[#fcfbf7]' : 'text-[#1c1917]'
                    }`}
                  >
                    Weekly Farm Essentials Basket
                  </h3>
                </div>
                <span
                  className={`px-3 py-1 rounded-full border text-xs font-mono font-bold ${
                    isDark
                      ? 'bg-[#2a2214] border-[#d4af37]/45 text-[#fae69e]'
                      : 'bg-[#faf8f5] border-[#d4af37]/50 text-[#8f6208]'
                  }`}
                >
                  Every Monday
                </span>
              </div>

              {/* Sample Items */}
              <div className="py-6 space-y-3.5">
                <div
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-colors ${
                    isDark
                      ? 'bg-[#1a150e]/80 border-[#d4af37]/20'
                      : 'bg-[#faf8f5] border-[#e7e4dc]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl overflow-hidden border shrink-0 ${
                        isDark ? 'border-[#d4af37]/30' : 'border-[#e7e4dc]'
                      }`}
                    >
                      <ProductImage
                        src="/assets/produce/vegetables/tomato.jpg"
                        alt="Tomatoes"
                        productName="Heirloom Vine Tomatoes"
                        category="Vegetables"
                        size="xs"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4
                        className={`font-serif font-bold text-sm ${
                          isDark ? 'text-[#fcfbf7]' : 'text-[#1c1917]'
                        }`}
                      >
                        Heirloom Vine Tomatoes
                      </h4>
                      <span className={`text-[11px] ${isDark ? 'text-[#aba79c]' : 'text-[#57534e]'}`}>
                        2 kg • Organic Certified
                      </span>
                    </div>
                  </div>
                  <span className={`font-serif font-bold text-sm ${isDark ? 'text-[#fae69e]' : 'text-[#8f6208]'}`}>
                    ₹90
                  </span>
                </div>

                <div
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-colors ${
                    isDark
                      ? 'bg-[#1a150e]/80 border-[#d4af37]/20'
                      : 'bg-[#faf8f5] border-[#e7e4dc]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl overflow-hidden border shrink-0 ${
                        isDark ? 'border-[#d4af37]/30' : 'border-[#e7e4dc]'
                      }`}
                    >
                      <ProductImage
                        src="/assets/produce/organic-natural/coconut-oil.jpg"
                        alt="Coconut Oil"
                        productName="Cold-Pressed Coconut Oil"
                        category="Organic & Natural"
                        size="xs"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4
                        className={`font-serif font-bold text-sm ${
                          isDark ? 'text-[#fcfbf7]' : 'text-[#1c1917]'
                        }`}
                      >
                        Cold-Pressed Coconut Oil
                      </h4>
                      <span className={`text-[11px] ${isDark ? 'text-[#aba79c]' : 'text-[#57534e]'}`}>
                        1 Litre • Marachekku
                      </span>
                    </div>
                  </div>
                  <span className={`font-serif font-bold text-sm ${isDark ? 'text-[#fae69e]' : 'text-[#8f6208]'}`}>
                    ₹380
                  </span>
                </div>

                <div
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-colors ${
                    isDark
                      ? 'bg-[#1a150e]/80 border-[#d4af37]/20'
                      : 'bg-[#faf8f5] border-[#e7e4dc]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl overflow-hidden border shrink-0 ${
                        isDark ? 'border-[#d4af37]/30' : 'border-[#e7e4dc]'
                      }`}
                    >
                      <ProductImage
                        src="/assets/produce/herbs/spinach.jpg"
                        alt="Spinach"
                        productName="Hydroponic Baby Spinach"
                        category="Herbs & Leafy Greens"
                        size="xs"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4
                        className={`font-serif font-bold text-sm ${
                          isDark ? 'text-[#fcfbf7]' : 'text-[#1c1917]'
                        }`}
                      >
                        Hydroponic Baby Spinach
                      </h4>
                      <span className={`text-[11px] ${isDark ? 'text-[#aba79c]' : 'text-[#57534e]'}`}>
                        500 g • Dawn Harvest
                      </span>
                    </div>
                  </div>
                  <span className={`font-serif font-bold text-sm ${isDark ? 'text-[#fae69e]' : 'text-[#8f6208]'}`}>
                    ₹45
                  </span>
                </div>
              </div>

              {/* Card Footer */}
              <div
                className={`pt-4 border-t flex items-center justify-between ${
                  isDark ? 'border-[#d4af37]/20' : 'border-[#e7e4dc]'
                }`}
              >
                <div>
                  <span className={`text-xs block font-mono ${isDark ? 'text-[#aba79c]' : 'text-[#78716c]'}`}>
                    Estimated Routine Cost
                  </span>
                  <span className={`font-serif font-bold text-xl ${isDark ? 'text-[#fae69e]' : 'text-[#8f6208]'}`}>
                    ₹515 <span className={`text-xs font-normal font-sans ${isDark ? 'text-[#aba79c]' : 'text-[#78716c]'}`}>/ delivery</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBuilderOpen(true)}
                  className={`px-5 py-2.5 rounded-xl font-serif font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-xs ${
                    isDark
                      ? 'text-[#fae69e] bg-[#2a2215] hover:bg-[#362b1a] border border-[#d4af37]/50'
                      : 'text-[#8f6208] bg-[#faf8f5] hover:bg-[#f5efe4] border border-[#d4af37]/50'
                  }`}
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

