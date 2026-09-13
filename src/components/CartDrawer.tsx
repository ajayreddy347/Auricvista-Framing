import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Wheat,
  MapPin,
  Truck,
  CheckCircle2,
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { getProduceImage } from '../utils/produceImages';
import { getLocalizedProduceName, getLocalizedCategory, getLocalizedUnit } from '../utils/produceLocalization';
import { SmartCartBuilderModal } from './SmartCartBuilderModal';
import { ProductImage } from './ProductImage';
import { useTheme } from '../context/ThemeContext';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
  } = useCart();
  const { language, t } = useLanguage();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [isSmartCartOpen, setIsSmartCartOpen] = React.useState(false);

  useEffect(() => {
    if (!isCartOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, closeCart]);

  const handleProceedToCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  const freeDeliveryThreshold = 500;
  const isFreeDelivery = subtotal >= freeDeliveryThreshold;
  const amountNeeded = Math.max(0, freeDeliveryThreshold - subtotal);
  const deliveryProgressPercent = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            className={`absolute inset-0 ${isDark ? 'bg-black/80 backdrop-blur-md' : 'bg-black/50 backdrop-blur-sm'}`}
            aria-hidden="true"
          />

          {/* Slide-in Panel from Right */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className={`w-screen max-w-md sm:max-w-lg ${
                isDark
                  ? 'bg-[#0c0b09]/98 border-l border-[#d4af37]/40 shadow-[0_0_60px_rgba(0,0,0,0.9)] text-[#fcfbf7]'
                  : 'bg-white border-l border-[#d4af37]/40 shadow-2xl text-[#1c1917]'
              } flex flex-col justify-between`}
            >
              {/* Top Header */}
              <div className={`p-5 sm:p-6 border-b flex items-center justify-between ${
                isDark ? 'border-[#d4af37]/25 bg-[#12100b]' : 'border-[#d4af37]/30 bg-white'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shadow-sm ${
                    isDark
                      ? 'bg-gradient-to-br from-[#262010] to-[#0d0d0d] border-[#d4af37]/45 text-[#fae69e]'
                      : 'bg-[#faf7ee] border-[#d4af37]/50 text-[#b89120]'
                  }`}>
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`font-serif text-lg sm:text-xl font-bold flex items-center gap-2 ${
                      isDark ? 'text-[#fcfbf7]' : 'text-[#1c1917]'
                    }`}>
                      {t('cart.title', 'Harvest Basket')}
                      {totalItems > 0 && (
                        <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#fae69e] to-[#d4af37] text-[#0a0a0a] font-bold">
                          {totalItems} items
                        </span>
                      )}
                    </h3>
                    <p className={`text-[11px] font-mono ${isDark ? 'text-[#8e8b82]' : 'text-stone-500'}`}>
                      Direct grower allocation • Farm fresh
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {items.length > 0 && (
                    <button
                      type="button"
                      onClick={clearCart}
                      title="Clear Cart"
                      className="p-2 rounded-lg text-stone-500 hover:text-red-500 hover:bg-stone-200/50 transition-colors text-xs font-mono cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={closeCart}
                    className={`p-2 rounded-xl border transition-all cursor-pointer ${
                      isDark
                        ? 'bg-[#18150d] border-[#d4af37]/30 text-[#8e8b82] hover:text-[#fcfbf7] hover:border-[#d4af37]'
                        : 'bg-[#faf7ee] border-[#d4af37]/40 text-stone-600 hover:text-stone-950'
                    }`}
                    aria-label="Close cart"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Free Delivery Progress Bar */}
              {items.length > 0 && (
                <div className={`px-5 py-3 border-b ${
                  isDark ? 'bg-[#16130e] border-[#d4af37]/20' : 'bg-[#faf7ee] border-[#d4af37]/30'
                }`}>
                  <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                    {isFreeDelivery ? (
                      <span className="text-[#10b981] font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>🎉 You unlocked FREE Direct Farm Delivery!</span>
                      </span>
                    ) : (
                      <span className={`flex items-center gap-1.5 ${isDark ? 'text-[#fae69e]' : 'text-[#92700c]'}`}>
                        <Truck className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>Add <strong>₹{amountNeeded}</strong> more for FREE Delivery!</span>
                      </span>
                    )}
                    <span className={isDark ? 'text-[#8e8b82]' : 'text-stone-500'}>Goal: ₹500</span>
                  </div>
                  <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-[#201c14]' : 'bg-stone-200'}`}>
                    <div
                      className="h-full bg-gradient-to-r from-[#d4af37] via-[#fae69e] to-[#10b981] transition-all duration-300 rounded-full"
                      style={{ width: `${deliveryProgressPercent}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Middle: Items List or Empty State */}
              <div className={`flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 ${isDark ? 'bg-transparent' : 'bg-[#faf8f5]'}`}>
                {items.length === 0 ? (
                  /* Empty State */
                  <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4 space-y-4">
                    <div className={`w-20 h-20 rounded-3xl border flex items-center justify-center shadow-md ${
                      isDark
                        ? 'bg-[#14120e] border-[#d4af37]/30 text-[#d4af37]'
                        : 'bg-white border-[#d4af37]/40 text-[#b89120]'
                    }`}>
                      <Wheat className="w-10 h-10 opacity-70" />
                    </div>
                    <div className="max-w-xs space-y-2">
                      <h4 className={`font-serif text-xl font-bold ${isDark ? 'text-[#fcfbf7]' : 'text-[#1c1917]'}`}>
                        {t('cart.empty', 'Your harvest basket is empty.')}
                      </h4>
                      <p className={`text-xs leading-relaxed ${isDark ? 'text-[#aba79c]' : 'text-stone-600'}`}>
                        {t('cart.emptySub', 'Explore our live marketplace to select fresh produce directly from certified regional farmers.')}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsSmartCartOpen(true)}
                        className={`w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl text-xs font-semibold font-serif uppercase tracking-wider border shadow-md transition-all cursor-pointer ${
                          isDark
                            ? 'text-[#fae69e] bg-[#221c10] hover:bg-[#2e2616] border-[#d4af37]/50'
                            : 'text-[#92700c] bg-[#faf7ee] hover:bg-[#fae69e]/30 border-[#d4af37]/50'
                        }`}
                      >
                        <Sparkles className="w-4 h-4 text-[#d4af37]" />
                        <span>Build Smart Routine</span>
                      </button>
                      <Link
                        to="/marketplace"
                        onClick={closeCart}
                        className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl text-xs font-semibold uppercase tracking-wider text-[#0a0a0a] bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#b89120] hover:brightness-110 shadow-[0_0_20px_-5px_rgba(212,175,55,0.4)] transition-all cursor-pointer"
                      >
                        <span>{t('cart.exploreMarket', 'Browse Marketplace')}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  /* Cart Items */
                  items.map((item) => (
                    <div
                      key={item.productId}
                      className={`p-4 rounded-2xl border transition-all flex gap-3.5 relative group shadow-md ${
                        isDark
                          ? 'bg-[#12100c] border-[#d4af37]/30 hover:border-[#d4af37]/60'
                          : 'bg-white border-[#d4af37]/40 hover:border-[#d4af37]'
                      }`}
                    >
                      {/* Item Thumbnail */}
                      <div className={`w-20 h-20 rounded-xl overflow-hidden border border-[#d4af37]/35 shrink-0 ${
                        isDark ? 'bg-neutral-900' : 'bg-stone-100'
                      } relative`}>
                        <ProductImage
                          src={getProduceImage(item)}
                          alt={item.name}
                          productName={item.name}
                          category={item.category}
                          size="sm"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Item Info */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className={`font-serif text-sm sm:text-base font-bold truncate ${
                              isDark ? 'text-[#fcfbf7]' : 'text-[#1c1917]'
                            }`}>
                              {getLocalizedProduceName(item.name, language)}
                            </h4>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.productId)}
                              className="text-stone-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                              title={t('cart.remove', 'Remove')}
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={`text-[11px] truncate font-mono ${isDark ? 'text-[#aba79c]' : 'text-stone-600'}`}>
                              👨🌾 {item.farmerName}
                            </span>
                            {item.farmerId && (
                              <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${
                                isDark
                                  ? 'bg-[#1c180e] text-[#fae69e] border-[#d4af37]/35'
                                  : 'bg-[#faf7ee] text-[#92700c] border-[#d4af37]/40'
                              }`}>
                                {item.farmerId}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Price & Quantity Stepper */}
                        <div className={`flex items-center justify-between pt-2 mt-1 border-t ${
                          isDark ? 'border-[#d4af37]/15' : 'border-[#d4af37]/25'
                        }`}>
                          <div className={`font-mono text-sm font-bold ${isDark ? 'text-[#fae69e]' : 'text-[#92700c]'}`}>
                            ₹{item.price * item.quantity}
                            <span className={`text-[10px] font-normal ml-1 ${isDark ? 'text-[#8e8b82]' : 'text-stone-500'}`}>
                              (₹{item.price}/{getLocalizedUnit(item.unit, language)})
                            </span>
                          </div>

                          {/* Stepper */}
                          <div className={`inline-flex items-center rounded-xl border p-0.5 shadow-inner ${
                            isDark
                              ? 'bg-[#1c180e] border-[#d4af37]/45'
                              : 'bg-stone-100 border-stone-300'
                          }`}>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                                isDark ? 'text-[#fae69e] hover:bg-white/10' : 'text-stone-700 hover:bg-stone-200'
                              }`}
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className={`w-8 text-center text-xs font-mono font-bold ${
                              isDark ? 'text-[#fcfbf7]' : 'text-[#1c1917]'
                            }`}>
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                                isDark ? 'text-[#fae69e] hover:bg-white/10' : 'text-stone-700 hover:bg-stone-200'
                              }`}
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Bottom Footer with Subtotal & Checkout Button */}
              {items.length > 0 && (
                <div className={`p-5 sm:p-6 border-t space-y-4 ${
                  isDark ? 'border-[#d4af37]/25 bg-[#0f0e0c]' : 'border-[#d4af37]/30 bg-white shadow-lg'
                }`}>
                  <div className="space-y-1.5 text-xs font-mono">
                    <div className={`flex items-center justify-between ${isDark ? 'text-[#aba79c]' : 'text-stone-600'}`}>
                      <span>{t('cart.itemSubtotal', 'Basket Subtotal')}</span>
                      <span>₹{subtotal}</span>
                    </div>
                    <div className={`flex items-center justify-between ${isDark ? 'text-[#aba79c]' : 'text-stone-600'}`}>
                      <span>{t('cart.deliveryFee', 'Delivery Settlement')}</span>
                      <span className="text-[#10b981] font-medium">
                        {isFreeDelivery ? 'FREE (Orders > ₹500)' : '₹40'}
                      </span>
                    </div>
                    <div className={`flex items-center justify-between text-base font-bold pt-2 border-t ${
                      isDark ? 'text-[#fcfbf7] border-[#d4af37]/20' : 'text-[#1c1917] border-[#d4af37]/30'
                    }`}>
                      <span>{t('cart.grandTotal', 'Final Amount')}</span>
                      <span className={`font-serif text-xl font-bold ${isDark ? 'text-[#fae69e]' : 'text-[#92700c]'}`}>
                        ₹{isFreeDelivery ? subtotal : subtotal + 40}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleProceedToCheckout}
                    className="w-full py-4 rounded-2xl font-bold font-serif text-xs sm:text-sm uppercase tracking-wider text-[#0a0a0a] bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#b89120] hover:brightness-110 shadow-[0_0_25px_rgba(212,175,55,0.4)] flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
                  >
                    <span>Proceed to Secure Farm Checkout →</span>
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}

      {/* Personalized Smart Cart Routine Builder Modal */}
      <SmartCartBuilderModal
        isOpen={isSmartCartOpen}
        onClose={() => setIsSmartCartOpen(false)}
      />
    </AnimatePresence>
  );
};
