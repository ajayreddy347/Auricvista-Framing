import React from 'react';
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
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

/* NOTE: In the next development phase, all local/mock states (cart, orders, checkout) 
   should be replaced with real backend/database calls and payment gateways (e.g. Razorpay/Stripe). */

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
  const navigate = useNavigate();

  const handleProceedToCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

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
                      Harvest Cart
                      {totalItems > 0 && (
                        <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[#fae69e] text-[#0a0a0a] font-bold">
                          {totalItems} {totalItems === 1 ? 'item' : 'items'}
                        </span>
                      )}
                    </h3>
                    <p className="text-[11px] font-mono text-[#8e8b82]">
                      Direct grower allocation
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {items.length > 0 && (
                    <button
                      type="button"
                      onClick={clearCart}
                      title="Clear Cart"
                      className="p-2 rounded-lg text-[#8e8b82] hover:text-[#f87171] hover:bg-white/5 transition-colors text-xs font-mono"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={closeCart}
                    className="p-2 rounded-xl bg-[#18150d] border border-[#d4af37]/30 text-[#8e8b82] hover:text-[#fcfbf7] hover:border-[#d4af37] transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

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
                        Your cart is empty
                      </h4>
                      <p className="text-xs text-[#aba79c] leading-relaxed">
                        Explore freshly harvested crops directly from verified regional growers.
                      </p>
                    </div>
                    <Link
                      to="/marketplace"
                      onClick={closeCart}
                      className="mt-2 inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-xs font-semibold uppercase tracking-wider text-[#0a0a0a] bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#b89120] hover:brightness-110 shadow-[0_0_20px_-5px_rgba(212,175,55,0.4)] transition-all cursor-pointer"
                    >
                      <span>Explore Fresh Produce</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ) : (
                  /* Cart Items */
                  items.map((item) => (
                    <div
                      key={item.productId}
                      className="p-4 rounded-2xl bg-[#12100c] border border-[#d4af37]/30 hover:border-[#d4af37]/60 transition-all flex gap-3.5 card-lift-glow-subtle relative group"
                    >
                      {/* Item Thumbnail */}
                      <div className="w-20 h-20 rounded-xl overflow-hidden border border-[#d4af37]/25 shrink-0 bg-[#0a0a0a] relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Item Info */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-serif text-sm font-bold text-[#fcfbf7] truncate">
                              {item.name}
                            </h4>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.productId)}
                              className="text-[#6e6b63] hover:text-[#f87171] p-1 transition-colors cursor-pointer"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <p className="text-[11px] text-[#aba79c] flex items-center gap-1 mt-0.5 truncate">
                            <MapPin className="w-3 h-3 text-[#d4af37] shrink-0" />
                            <span className="truncate">{item.farmerName}</span>
                          </p>
                        </div>

                        {/* Price & Quantity Stepper */}
                        <div className="flex items-center justify-between pt-2 mt-1 border-t border-[#d4af37]/15">
                          <div className="font-mono text-xs font-bold text-[#fae69e]">
                            ₹{item.price * item.quantity}
                            <span className="text-[10px] text-[#8e8b82] font-normal ml-1">
                              (₹{item.price}/{item.unit})
                            </span>
                          </div>

                          {/* Stepper */}
                          <div className="inline-flex items-center rounded-lg bg-[#1a1710] border border-[#d4af37]/40 p-0.5">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="w-6 h-6 rounded flex items-center justify-center text-[#fae69e] hover:bg-white/10 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-xs font-mono font-bold text-[#fcfbf7]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="w-6 h-6 rounded flex items-center justify-center text-[#fae69e] hover:bg-white/10 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
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
                  {/* Escrow badge */}
                  <div className="p-2.5 rounded-xl bg-[#18150d] border border-[#d4af37]/30 flex items-center gap-2 text-[11px] text-[#aba79c]">
                    <ShieldCheck className="w-4 h-4 text-[#34d399] shrink-0" />
                    <span>Zero-Intermediary Escrow • Direct Farmer Remittance</span>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between text-[#8e8b82]">
                      <span>Produce Subtotal</span>
                      <span className="text-[#fcfbf7] font-bold text-sm">₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-[#8e8b82]">
                      <span>Direct Transport / Cold Chain</span>
                      <span className="text-[#aba79c]">Calculated at Checkout</span>
                    </div>
                  </div>

                  {/* Checkout CTA */}
                  <button
                    type="button"
                    onClick={handleProceedToCheckout}
                    id="cart-proceed-checkout-btn"
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#b89120] text-[#0a0a0a] font-serif font-bold text-sm uppercase tracking-wider hover:brightness-110 active:scale-[0.99] transition-all shadow-[0_0_30px_rgba(212,175,55,0.4)] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4 text-[#0a0a0a]" />
                  </button>

                  <p className="text-center text-[10px] font-mono text-[#6e6b63]">
                    100% farm-gate fair pricing guaranteed
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
