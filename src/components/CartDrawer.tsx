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
  const { t } = useLanguage();
  const navigate = useNavigate();

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
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Slide-in Panel from Right */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="w-screen max-w-md sm:max-w-lg bg-[#0c0b09]/98 border-l border-[#d4af37]/40 shadow-[0_0_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl flex flex-col justify-between"
            >
              {/* Top Header */}
              <div className="p-5 sm:p-6 border-b border-[#d4af37]/25 flex items-center justify-between bg-[#12100b]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#262010] to-[#0d0d0d] border border-[#d4af37]/45 flex items-center justify-center text-[#fae69e] shadow-[0_0_15px_-3px_rgba(212,175,55,0.3)]">
                    <ShoppingBag className="w-5 h-5 text-[#fae69e]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-[#fcfbf7] flex items-center gap-2">
                      {t('cart.title', 'Harvest Basket')}
                      {totalItems > 0 && (
                        <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#fae69e] to-[#d4af37] text-[#0a0a0a] font-bold">
                          {totalItems} items
                        </span>
                      )}
                    </h3>
                    <p className="text-[11px] font-mono text-[#8e8b82]">
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
                      className="p-2 rounded-lg text-[#8e8b82] hover:text-[#f87171] hover:bg-white/5 transition-colors text-xs font-mono cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={closeCart}
                    className="p-2 rounded-xl bg-[#18150d] border border-[#d4af37]/30 text-[#8e8b82] hover:text-[#fcfbf7] hover:border-[#d4af37] transition-all cursor-pointer"
                    aria-label="Close cart"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Free Delivery Progress Bar */}
              {items.length > 0 && (
                <div className="px-5 py-3 bg-[#16130e] border-b border-[#d4af37]/20">
                  <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                    {isFreeDelivery ? (
                      <span className="text-[#34d399] font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>🎉 You unlocked FREE Direct Farm Delivery!</span>
                      </span>
                    ) : (
                      <span className="text-[#fae69e] flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>Add <strong>₹{amountNeeded}</strong> more for FREE Delivery!</span>
                      </span>
                    )}
                    <span className="text-[#8e8b82]">Goal: ₹500</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#201c14] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#d4af37] via-[#fae69e] to-[#34d399] transition-all duration-300 rounded-full"
                      style={{ width: `${deliveryProgressPercent}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Middle: Items List or Empty State */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {items.length === 0 ? (
                  /* Empty State */
                  <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4 space-y-4">
                    <div className="w-20 h-20 rounded-3xl bg-[#14120e] border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] shadow-[0_0_30px_rgba(212,175,55,0.15)]">
                      <Wheat className="w-10 h-10 opacity-70" />
                    </div>
                    <div className="max-w-xs space-y-2">
                      <h4 className="font-serif text-xl font-bold text-[#fcfbf7]">
                        {t('cart.empty', 'Your harvest basket is empty.')}
                      </h4>
                      <p className="text-xs text-[#aba79c] leading-relaxed">
                        {t('cart.emptySub', 'Explore our live marketplace to select fresh produce directly from certified regional farmers.')}
                      </p>
                    </div>
                    <Link
                      to="/marketplace"
                      onClick={closeCart}
                      className="mt-2 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl text-xs font-semibold uppercase tracking-wider text-[#0a0a0a] bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#b89120] hover:brightness-110 shadow-[0_0_20px_-5px_rgba(212,175,55,0.4)] transition-all cursor-pointer"
                    >
                      <span>{t('cart.exploreMarket', 'Browse Marketplace')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ) : (
                  /* Cart Items */
                  items.map((item) => (
                    <div
                      key={item.productId}
                      className="p-4 rounded-2xl bg-[#12100c] border border-[#d4af37]/30 hover:border-[#d4af37]/60 transition-all flex gap-3.5 relative group shadow-md"
                    >
                      {/* Item Thumbnail */}
                      <div className="w-20 h-20 rounded-xl overflow-hidden border border-[#d4af37]/35 shrink-0 bg-[#0a0a0a] relative">
                        <img
                          src={getProduceImage(item)}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>

                      {/* Item Info */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-serif text-sm sm:text-base font-bold text-[#fcfbf7] truncate">
                              {item.name}
                            </h4>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.productId)}
                              className="text-[#6e6b63] hover:text-[#f87171] p-1 transition-colors cursor-pointer"
                              title={t('cart.remove', 'Remove')}
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[11px] text-[#aba79c] truncate font-mono">
                              👨🌾 {item.farmerName}
                            </span>
                            {item.farmerId && (
                              <span className="text-[9px] font-mono bg-[#1c180e] text-[#fae69e] px-1.5 py-0.2 rounded border border-[#d4af37]/35">
                                {item.farmerId}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Price & Quantity Stepper */}
                        <div className="flex items-center justify-between pt-2 mt-1 border-t border-[#d4af37]/15">
                          <div className="font-mono text-sm font-bold text-[#fae69e]">
                            ₹{item.price * item.quantity}
                            <span className="text-[10px] text-[#8e8b82] font-normal ml-1">
                              (₹{item.price}/{item.unit})
                            </span>
                          </div>

                          {/* Stepper */}
                          <div className="inline-flex items-center rounded-xl bg-[#1c180e] border border-[#d4af37]/45 p-0.5 shadow-inner">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#fae69e] hover:bg-white/10 transition-colors cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center text-xs font-mono font-bold text-[#fcfbf7]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#fae69e] hover:bg-white/10 transition-colors cursor-pointer"
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
                <div className="p-5 sm:p-6 border-t border-[#d4af37]/25 bg-[#0f0e0c] space-y-4">
                  <div className="space-y-1.5 text-xs font-mono">
                    <div className="flex items-center justify-between text-[#aba79c]">
                      <span>{t('cart.itemSubtotal', 'Basket Subtotal')}</span>
                      <span>₹{subtotal}</span>
                    </div>
                    <div className="flex items-center justify-between text-[#aba79c]">
                      <span>{t('cart.deliveryFee', 'Delivery Settlement')}</span>
                      <span className="text-[#34d399] font-medium">
                        {isFreeDelivery ? 'FREE (Orders > ₹500)' : '₹40'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-base font-bold text-[#fcfbf7] pt-2 border-t border-[#d4af37]/20">
                      <span>{t('cart.grandTotal', 'Final Amount')}</span>
                      <span className="text-[#fae69e] font-serif text-xl font-bold">
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
    </AnimatePresence>
  );
};
