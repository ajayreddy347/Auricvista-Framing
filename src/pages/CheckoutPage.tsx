import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Calendar,
  CreditCard,
  Truck,
  Building2,
  CheckCircle2,
  AlertCircle,
  Wheat,
  Lock,
  ArrowLeft,
  Banknote,
  QrCode,
  LogIn,
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrdersContext';

/* NOTE: In the next development phase, all local/mock states (cart, orders, checkout) 
   should be replaced with real backend/database calls and payment gateways (e.g. Razorpay/Stripe/UPI). */

export const CheckoutPage: React.FC = () => {
  const { items, subtotal, clearCart } = useCart();
  const { isLoggedIn, userRole, user } = useAuth();
  const { placeOrder } = useOrders();
  const navigate = useNavigate();

  // Form State
  const [deliveryMethod, setDeliveryMethod] = useState<'Home Delivery' | 'Farm Pickup'>('Home Delivery');
  const [address, setAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'UPI' | 'Card'>('UPI');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<{
    address?: string;
    deliveryDate?: string;
    recipientName?: string;
    recipientPhone?: string;
    paymentMethod?: string;
  }>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill from user profile
  useEffect(() => {
    if (user) {
      setRecipientName(user.name || '');
      setRecipientPhone(user.phone || '+91 98450 12890');
      if (user.address) {
        setAddress(user.address);
      } else if (user.location) {
        setAddress(`${user.location}, Karnataka`);
      } else {
        setAddress('Flat 402, Green Meadows, 12th Main, Indiranagar, Bengaluru');
      }
    }

    // Default preferred date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    setDeliveryDate(dateStr);
  }, [user]);

  // Today's date string for input min attribute
  const todayStr = new Date().toISOString().split('T')[0];

  const deliveryFee = deliveryMethod === 'Home Delivery' ? (items.length > 0 ? 15 : 0) : 0;
  const totalAmount = subtotal + deliveryFee;

  // If not logged in as a customer, show login prompt
  if (!isLoggedIn || userRole !== 'customer') {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-[#070707] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full p-8 rounded-3xl bg-[#0e0d0b] border border-[#d4af37]/40 shadow-[0_0_50px_rgba(212,175,55,0.2)] text-center space-y-6"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#1c180e] border border-[#d4af37]/50 flex items-center justify-center text-[#fae69e] mx-auto shadow-[0_0_20px_rgba(212,175,55,0.25)]">
            <Lock className="w-8 h-8 text-[#d4af37]" />
          </div>

          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-bold text-[#fcfbf7]">
              Customer Sign In Required
            </h2>
            <p className="text-xs text-[#aba79c] leading-relaxed">
              Please sign in with your customer account to place direct-from-farm harvest orders and access verified grower escrow.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              to="/login?role=customer&redirect=/checkout"
              className="w-full py-3.5 px-6 rounded-xl font-serif font-bold text-xs uppercase tracking-wider text-[#0a0a0a] bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#b89120] hover:brightness-110 shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In as Customer</span>
            </Link>

            <Link
              to="/marketplace"
              className="w-full py-3 px-6 rounded-xl font-mono text-xs uppercase tracking-wider text-[#fae69e] bg-[#14120e] border border-[#d4af37]/30 hover:border-[#d4af37] flex items-center justify-center gap-2"
            >
              <span>Back to Marketplace</span>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // If cart is empty
  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-[#070707] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full p-8 rounded-3xl bg-[#0e0d0b] border border-[#d4af37]/40 shadow-[0_0_50px_rgba(212,175,55,0.2)] text-center space-y-6"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#1c180e] border border-[#d4af37]/50 flex items-center justify-center text-[#fae69e] mx-auto">
            <ShoppingBag className="w-8 h-8 text-[#d4af37]" />
          </div>

          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-bold text-[#fcfbf7]">
              Your Cart is Empty
            </h2>
            <p className="text-xs text-[#aba79c] leading-relaxed">
              You don't have any harvest items in your cart to checkout. Browse our verified farm catalog to add fresh produce.
            </p>
          </div>

          <Link
            to="/marketplace"
            className="inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-serif font-bold text-xs uppercase tracking-wider text-[#0a0a0a] bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#b89120] hover:brightness-110 shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all cursor-pointer"
          >
            <span>Explore Fresh Harvest</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};

    if (!recipientName.trim()) {
      newErrors.recipientName = 'Recipient name is required';
    }
    if (!recipientPhone.trim()) {
      newErrors.recipientPhone = 'Contact phone number is required';
    }
    if (deliveryMethod === 'Home Delivery' && !address.trim()) {
      newErrors.address = 'Delivery address is required for doorstep delivery';
    }
    if (!deliveryDate) {
      newErrors.deliveryDate = 'Preferred harvest delivery date is required';
    }
    if (!paymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    setGeneralError(null);

    try {
      const placed = await placeOrder({
        items: [...items],
        subtotal,
        deliveryFee,
        total: totalAmount,
        deliveryMethod,
        deliveryAddress: deliveryMethod === 'Home Delivery' ? address : 'Direct Farm Pickup at Grower Fields',
        preferredDeliveryDate: deliveryDate,
        paymentMethod,
        customerName: recipientName,
        customerEmail: user.email,
        customerPhone: recipientPhone,
      });

      // Clear cart
      clearCart();
      setIsSubmitting(false);

      // Navigate to order confirmation
      navigate(`/order-confirmed?orderId=${placed.id}`, {
        state: { order: placed },
      });
    } catch (err: any) {
      setIsSubmitting(false);
      setGeneralError(err.message || 'Failed to place order.');
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-[#070707] text-[#f5f3eb] font-sans">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full gold-ambient-radial blur-3xl opacity-25" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#aba79c] hover:text-[#fae69e] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#d4af37]" />
            <span>Back to Produce Marketplace</span>
          </Link>

          <span className="text-[11px] font-mono uppercase tracking-wider text-[#fae69e] bg-[#1a1710] px-3 py-1 rounded-full border border-[#d4af37]/30">
            Escrow Protected Checkout
          </span>
        </div>

        {/* Page Title */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#fcfbf7]">
            Direct Farm Checkout
          </h1>
          <p className="text-sm sm:text-base text-[#aba79c] mt-2">
            Finalize your morning harvest allocation with verified regional growers.
          </p>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ================================================================= */}
          {/* LEFT COLUMN: ORDER SUMMARY (Read-only cart items & breakdown)      */}
          {/* ================================================================= */}
          <div className="lg:col-span-5 space-y-6 order-2 lg:order-1">
            <div className="p-6 sm:p-7 rounded-3xl bg-[#0e0d0b]/90 border-2 border-[#d4af37]/30 backdrop-blur-2xl shadow-[0_0_40px_-10px_rgba(212,175,55,0.2)] space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-[#d4af37]/20">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-5 h-5 text-[#fae69e]" />
                  <h3 className="font-serif text-lg font-bold text-[#fcfbf7]">
                    Harvest Summary
                  </h3>
                </div>
                <span className="text-xs font-mono text-[#fae69e]">
                  {items.length} {items.length === 1 ? 'Produce' : 'Produces'}
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-3.5 max-h-80 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="p-3 rounded-2xl bg-[#14120e] border border-[#d4af37]/20 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-14 h-14 rounded-xl overflow-hidden border border-[#d4af37]/25 shrink-0 bg-[#0a0a0a]">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-serif text-xs sm:text-sm font-semibold text-[#fcfbf7] truncate">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-[#aba79c] truncate">
                          Farmer: {item.farmerName}
                        </p>
                        <p className="text-[10px] font-mono text-[#fae69e] mt-0.5">
                          Qty: {item.quantity} {item.unit} × ₹{item.price}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 font-mono text-xs font-bold text-[#fcfbf7]">
                      ₹{item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing Breakdown */}
              <div className="pt-4 border-t border-[#d4af37]/20 space-y-2.5 text-xs font-mono">
                <div className="flex justify-between text-[#aba79c]">
                  <span>Produce Subtotal</span>
                  <span className="text-[#fcfbf7] font-semibold">₹{subtotal}</span>
                </div>

                <div className="flex justify-between text-[#aba79c]">
                  <span>
                    {deliveryMethod === 'Home Delivery' ? 'Sub-24hr Cold Chain Delivery' : 'Direct Farm Gate Pickup'}
                  </span>
                  <span className={deliveryFee === 0 ? 'text-[#34d399]' : 'text-[#fcfbf7] font-semibold'}>
                    {deliveryFee === 0 ? 'FREE (Pickup)' : `₹${deliveryFee}`}
                  </span>
                </div>

                <div className="pt-3 border-t border-[#d4af37]/20 flex justify-between items-center text-sm">
                  <span className="font-serif font-bold text-[#fcfbf7]">Total Payable</span>
                  <span className="font-mono text-lg font-bold text-[#fae69e]">
                    ₹{totalAmount}
                  </span>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="p-3.5 rounded-2xl bg-[#18150e] border border-[#d4af37]/35 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#34d399] shrink-0 mt-0.5" />
                <div className="text-xs text-[#aba79c]">
                  <strong className="text-[#fcfbf7] block font-sans">Zero Intermediary Escrow</strong>
                  100% of the produce value is allocated directly to the grower upon harvest delivery.
                </div>
              </div>
            </div>
          </div>

          {/* ================================================================= */}
          {/* RIGHT COLUMN: CHECKOUT FORM                                       */}
          {/* ================================================================= */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <form
              onSubmit={handlePlaceOrder}
              className="p-6 sm:p-8 rounded-3xl bg-[#0e0d0b]/90 border-2 border-[#d4af37]/35 backdrop-blur-2xl shadow-[0_0_50px_-15px_rgba(212,175,55,0.25)] space-y-7"
            >
              {generalError && (
                <div className="p-4 rounded-2xl bg-[#2a1215] border border-[#f87171]/40 text-[#fca5a5] text-xs font-mono flex items-start gap-2.5 shadow-sm">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#f87171]" />
                  <div className="flex-1">
                    <strong className="block text-[#fca5a5] font-semibold mb-0.5">Order Placement Issue</strong>
                    <span>{generalError}</span>
                  </div>
                </div>
              )}

              {/* Step 1: Delivery Mode Toggle */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-[#fae69e] mb-3">
                  1. Fulfillment Method
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('Home Delivery')}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                      deliveryMethod === 'Home Delivery'
                        ? 'bg-[#1e190e] border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.25)] text-[#fae69e]'
                        : 'bg-[#14120e] border-[#d4af37]/20 text-[#aba79c] hover:border-[#d4af37]/40'
                    }`}
                  >
                    <Truck className={`w-5 h-5 mt-0.5 shrink-0 ${deliveryMethod === 'Home Delivery' ? 'text-[#fae69e]' : 'text-[#8e8b82]'}`} />
                    <div>
                      <div className="font-serif font-bold text-sm text-[#fcfbf7]">
                        Home Delivery
                      </div>
                      <p className="text-[11px] text-[#aba79c] mt-0.5">
                        Direct doorstep drop in temperature-monitored crates (Flat ₹15).
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('Farm Pickup')}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                      deliveryMethod === 'Farm Pickup'
                        ? 'bg-[#1e190e] border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.25)] text-[#fae69e]'
                        : 'bg-[#14120e] border-[#d4af37]/20 text-[#aba79c] hover:border-[#d4af37]/40'
                    }`}
                  >
                    <Building2 className={`w-5 h-5 mt-0.5 shrink-0 ${deliveryMethod === 'Farm Pickup' ? 'text-[#fae69e]' : 'text-[#8e8b82]'}`} />
                    <div>
                      <div className="font-serif font-bold text-sm text-[#fcfbf7]">
                        Farm Gate Pickup
                      </div>
                      <p className="text-[11px] text-[#aba79c] mt-0.5">
                        Collect directly from the farmer's designated field hub (FREE).
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Step 2: Contact & Address Information */}
              <div className="space-y-4 pt-2 border-t border-[#d4af37]/20">
                <label className="block text-xs font-mono uppercase tracking-widest text-[#fae69e]">
                  2. Recipient & Delivery Details
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#aba79c] mb-1.5 font-medium">
                      Recipient Full Name *
                    </label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="e.g. Ananya Sharma"
                      className="w-full px-4 py-3 rounded-xl bg-[#14120e] border border-[#d4af37]/30 text-xs text-[#fcfbf7] placeholder-[#6e6b63] focus:outline-none focus:border-[#d4af37]"
                    />
                    {errors.recipientName && (
                      <p className="text-[11px] font-mono text-[#f87171] mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.recipientName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs text-[#aba79c] mb-1.5 font-medium">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      value={recipientPhone}
                      onChange={(e) => setRecipientPhone(e.target.value)}
                      placeholder="+91 98450 12890"
                      className="w-full px-4 py-3 rounded-xl bg-[#14120e] border border-[#d4af37]/30 text-xs font-mono text-[#fcfbf7] placeholder-[#6e6b63] focus:outline-none focus:border-[#d4af37]"
                    />
                    {errors.recipientPhone && (
                      <p className="text-[11px] font-mono text-[#f87171] mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.recipientPhone}
                      </p>
                    )}
                  </div>
                </div>

                {deliveryMethod === 'Home Delivery' && (
                  <div>
                    <label className="block text-xs text-[#aba79c] mb-1.5 font-medium">
                      Delivery Address *
                    </label>
                    <textarea
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Flat/House No., Building Name, Street, Landmark, City, Pincode"
                      className="w-full px-4 py-3 rounded-xl bg-[#14120e] border border-[#d4af37]/30 text-xs text-[#fcfbf7] placeholder-[#6e6b63] focus:outline-none focus:border-[#d4af37] resize-none"
                    />
                    {errors.address && (
                      <p className="text-[11px] font-mono text-[#f87171] mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.address}
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-xs text-[#aba79c] mb-1.5 font-medium">
                    Preferred Harvest Delivery Date *
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      min={todayStr}
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#14120e] border border-[#d4af37]/30 text-xs font-mono text-[#fcfbf7] focus:outline-none focus:border-[#d4af37] [color-scheme:dark]"
                    />
                  </div>
                  {errors.deliveryDate && (
                    <p className="text-[11px] font-mono text-[#f87171] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.deliveryDate}
                    </p>
                  )}
                  <p className="text-[10px] font-mono text-[#8e8b82] mt-1">
                    Direct harvest occurs in the early morning preceding your delivery window.
                  </p>
                </div>
              </div>

              {/* Step 3: Payment Method Selection (Mock) */}
              <div className="space-y-4 pt-2 border-t border-[#d4af37]/20">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono uppercase tracking-widest text-[#fae69e]">
                    3. Payment Method
                  </label>
                  <span className="text-[10px] font-mono text-[#d4af37] bg-[#1a1710] px-2 py-0.5 rounded border border-[#d4af37]/30">
                    Prototype Gateway
                  </span>
                </div>

                <div className="space-y-2.5">
                  {/* UPI */}
                  <label
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      paymentMethod === 'UPI'
                        ? 'bg-[#1d180d] border-[#d4af37] text-[#fae69e]'
                        : 'bg-[#14120e] border-[#d4af37]/20 text-[#aba79c] hover:border-[#d4af37]/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#262010] border border-[#d4af37]/40 flex items-center justify-center text-[#fae69e]">
                        <QrCode className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-medium text-xs text-[#fcfbf7] block">
                          Instant UPI Transfer
                        </span>
                        <span className="text-[10px] text-[#aba79c]">
                          Google Pay, PhonePe, Paytm, BHIM UPI
                        </span>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'UPI'}
                      onChange={() => setPaymentMethod('UPI')}
                      className="accent-[#d4af37]"
                    />
                  </label>

                  {/* Cash on Delivery */}
                  <label
                    onClick={() => setPaymentMethod('Cash on Delivery')}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      paymentMethod === 'Cash on Delivery'
                        ? 'bg-[#1d180d] border-[#d4af37] text-[#fae69e]'
                        : 'bg-[#14120e] border-[#d4af37]/20 text-[#aba79c] hover:border-[#d4af37]/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#262010] border border-[#d4af37]/40 flex items-center justify-center text-[#fae69e]">
                        <Banknote className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-medium text-xs text-[#fcfbf7] block">
                          Cash on Delivery (COD)
                        </span>
                        <span className="text-[10px] text-[#aba79c]">
                          Pay in cash upon inspecting produce freshness at doorstep
                        </span>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'Cash on Delivery'}
                      onChange={() => setPaymentMethod('Cash on Delivery')}
                      className="accent-[#d4af37]"
                    />
                  </label>

                  {/* Card */}
                  <label
                    onClick={() => setPaymentMethod('Card')}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      paymentMethod === 'Card'
                        ? 'bg-[#1d180d] border-[#d4af37] text-[#fae69e]'
                        : 'bg-[#14120e] border-[#d4af37]/20 text-[#aba79c] hover:border-[#d4af37]/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#262010] border border-[#d4af37]/40 flex items-center justify-center text-[#fae69e]">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-medium text-xs text-[#fcfbf7] block">
                          Credit / Debit Card (Escrow)
                        </span>
                        <span className="text-[10px] text-[#aba79c]">
                          Encrypted transaction held safely until harvest dispatch
                        </span>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'Card'}
                      onChange={() => setPaymentMethod('Card')}
                      className="accent-[#d4af37]"
                    />
                  </label>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-[#d4af37]/20 space-y-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  id="checkout-place-order-btn"
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#b89120] text-[#0a0a0a] font-serif font-bold text-sm sm:text-base uppercase tracking-wider hover:brightness-110 active:scale-[0.99] transition-all shadow-[0_0_35px_rgba(212,175,55,0.45)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Securing Direct Harvest...</span>
                  ) : (
                    <>
                      <span>Place Order • ₹{totalAmount}</span>
                      <ArrowRight className="w-4 h-4 text-[#0a0a0a]" />
                    </>
                  )}
                </button>

                <p className="text-center text-[10px] font-mono text-[#8e8b82]">
                  By placing this order, you support fair farm-gate pricing with zero intermediary deductions.
                </p>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};
