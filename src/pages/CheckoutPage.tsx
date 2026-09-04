import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Calendar,
  CreditCard,
  Truck,
  CheckCircle2,
  AlertCircle,
  Wheat,
  Lock,
  ArrowLeft,
  Banknote,
  QrCode,
  Trash2,
  Plus,
  Minus,
  Check,
  Sparkles,
  Info,
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrdersContext';
import { useLanguage } from '../context/LanguageContext';
import { getProduceImage } from '../utils/produceImages';
import { getLocalizedProduceName, getLocalizedCategory, getLocalizedUnit } from '../utils/produceLocalization';

export const CheckoutPage: React.FC = () => {
  const { items, subtotal, clearCart, removeFromCart, updateQuantity } = useCart();
  const { isLoggedIn, userRole, user } = useAuth();
  const { placeOrder } = useOrders();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  // Delivery method & Delivery fields
  const [deliveryMethod, setDeliveryMethod] = useState<'Home Delivery' | 'Farm Pickup'>('Home Delivery');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [stateName, setStateName] = useState('Karnataka');
  const [pincode, setPincode] = useState('560038');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'UPI' | 'Card'>('UPI');
  const [orderNotes, setOrderNotes] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill from user profile
  useEffect(() => {
    if (user) {
      setRecipientName(user.name || '');
      setRecipientPhone(user.phone || '+91 98450 12890');
      if (user.location) {
        setCity(user.location.split(',')[0]?.trim() || 'Bengaluru');
      }
      setAddressLine('Flat 402, Green Meadows, 12th Main, Indiranagar');
    }

    // Default harvest delivery date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    setDeliveryDate(`${yyyy}-${mm}-${dd}`);
  }, [user]);

  // Delivery fee calculation
  const deliveryFee = deliveryMethod === 'Farm Pickup' ? 0 : subtotal >= 500 ? 0 : 40;
  const totalAmount = subtotal + deliveryFee;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!recipientName.trim()) {
      newErrors.recipientName = t('checkout.errName', 'Recipient full name is required.');
    }
    if (!recipientPhone.trim() || recipientPhone.trim().length < 8) {
      newErrors.recipientPhone = t('checkout.errPhone', 'Valid 10-digit mobile number is required.');
    }
    if (deliveryMethod === 'Home Delivery') {
      if (!addressLine.trim()) {
        newErrors.addressLine = t('checkout.errAddress', 'Street address / flat details are required.');
      }
      if (!city.trim()) {
        newErrors.city = t('checkout.errCity', 'City name is required.');
      }
      if (!pincode.trim() || pincode.trim().length < 6) {
        newErrors.pincode = t('checkout.errPincode', 'Valid 6-digit Indian PIN code is required.');
      }
    }
    if (!deliveryDate) {
      newErrors.deliveryDate = t('checkout.errDate', 'Please select a preferred delivery date.');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setGeneralError(null);

    if (items.length === 0) {
      setGeneralError(t('checkout.errEmptyCart', 'Your cart is empty. Add fresh harvests before checking out.'));
      return;
    }

    // Ensure all items have valid positive quantities
    const hasInvalidQty = items.some((i) => !i.quantity || i.quantity <= 0);
    if (hasInvalidQty) {
      setGeneralError(t('checkout.errInvalidQty', 'All produce items must have a quantity of at least 1.'));
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const fullAddress =
      deliveryMethod === 'Home Delivery'
        ? `${addressLine.trim()}, ${city.trim()}, ${stateName.trim()} - ${pincode.trim()}`
        : 'Direct Farm Gate Pickup (Mandya Heritage Orchard, Mandya District)';

    try {
      const placed = await placeOrder({
        items: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          unit: item.unit,
          farmerName: item.farmerName,
          farmerId: item.farmerId || 'AV-FARM-1001',
          image: item.image,
          subtotal: item.price * item.quantity,
        })),
        subtotal,
        deliveryFee,
        total: totalAmount,
        deliveryAddress: fullAddress,
        deliveryMethod,
        paymentMethod,
        preferredDeliveryDate: deliveryDate,
        customerName: recipientName.trim(),
        customerEmail: user?.email || 'customer@auricvista.farm',
        customerPhone: recipientPhone.trim(),
      });

      clearCart();
      setIsSubmitting(false);

      navigate(`/order-confirmed?orderId=${placed.id}`, {
        state: { order: placed },
      });
    } catch (err: any) {
      setIsSubmitting(false);
      setGeneralError(
        err.message && !err.message.includes('<!DOCTYPE')
          ? err.message
          : t('checkout.errGeneric', 'Unable to complete order. Please verify your details and try again.')
      );
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex flex-col items-center justify-center text-center bg-[#070707] text-[#fcfbf7]">
        <div className="w-20 h-20 rounded-3xl bg-[#14120e] border border-[#d4af37]/40 flex items-center justify-center text-[#fae69e] mb-5 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
          <ShoppingBag className="w-10 h-10 text-[#d4af37]" />
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#fcfbf7] mb-2">
          {t('cart.empty', 'Your Cart is Empty')}
        </h2>
        <p className="text-xs sm:text-sm text-[#aba79c] max-w-sm mb-6">
          {t('checkout.emptyDesc', 'Explore our marketplace to discover dawn-harvested produce directly from Indian farmers.')}
        </p>
        <Link
          to="/marketplace"
          className="py-3.5 px-7 rounded-2xl bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#b89120] text-[#0a0a0a] font-serif font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-lg cursor-pointer"
        >
          {t('nav.marketplace', 'Explore Marketplace')}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-28 px-4 sm:px-6 lg:px-8 bg-[#070707] text-[#fcfbf7] font-sans">
      <div className="max-w-7xl mx-auto">
        {/* A. CHECKOUT HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#d4af37]/20">
          <div>
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[#d4af37] hover:text-[#fae69e] mb-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t('checkout.backToMarket', 'Back to Marketplace')}</span>
            </Link>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#fcfbf7] flex items-center gap-3">
              <span>{t('checkout.title', 'Direct Farm Checkout')}</span>
            </h1>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14120e] border border-[#34d399]/40 text-[#34d399] text-xs font-mono">
            <ShieldCheck className="w-4 h-4 text-[#34d399]" />
            <span>{t('checkout.secureGuaranteed', '100% Direct Farm Settlement')}</span>
          </div>
        </div>

        {generalError && (
          <div className="mb-6 p-4 rounded-2xl bg-[#2a1010] border border-[#f87171]/50 text-xs font-mono text-[#f87171] flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{generalError}</span>
          </div>
        )}

        {/* MAIN TWO-COLUMN CHECKOUT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: DELIVERY & PAYMENT DETAILS */}
          <div className="lg:col-span-7 space-y-6">
            {/* Delivery Method Selection */}
            <div className="p-5 sm:p-6 rounded-3xl bg-[#0f0e0c] border border-[#d4af37]/30 space-y-4">
              <span className="text-xs font-mono uppercase text-[#d4af37] font-semibold tracking-wider block">
                1. {t('checkout.deliveryMethod', 'Fulfillment Method')}
              </span>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('Home Delivery')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                    deliveryMethod === 'Home Delivery'
                      ? 'bg-[#221c10] border-[#d4af37] text-[#fae69e] shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                      : 'bg-[#14120e] border-[#d4af37]/20 text-[#8e8b82] hover:text-[#fcfbf7]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Truck className="w-5 h-5 text-[#d4af37]" />
                    {deliveryMethod === 'Home Delivery' && <Check className="w-4 h-4 text-[#34d399]" />}
                  </div>
                  <div>
                    <div className="font-serif font-bold text-sm text-[#fcfbf7]">
                      {t('checkout.homeDelivery', 'Doorstep Delivery')}
                    </div>
                    <div className="text-[10px] font-mono text-[#8e8b82] mt-0.5">
                      {subtotal >= 500 ? 'FREE on orders ₹500+' : '₹40 Direct Delivery'}
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryMethod('Farm Pickup')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                    deliveryMethod === 'Farm Pickup'
                      ? 'bg-[#221c10] border-[#d4af37] text-[#fae69e] shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                      : 'bg-[#14120e] border-[#d4af37]/20 text-[#8e8b82] hover:text-[#fcfbf7]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Wheat className="w-5 h-5 text-[#d4af37]" />
                    {deliveryMethod === 'Farm Pickup' && <Check className="w-4 h-4 text-[#34d399]" />}
                  </div>
                  <div>
                    <div className="font-serif font-bold text-sm text-[#fcfbf7]">
                      {t('checkout.farmPickup', 'Farm Gate Pickup')}
                    </div>
                    <div className="text-[10px] font-mono text-[#34d399] mt-0.5">
                      FREE • Mandya Estate
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Delivery Address Form */}
            <div className="p-5 sm:p-6 rounded-3xl bg-[#0f0e0c] border border-[#d4af37]/30 space-y-4">
              <span className="text-xs font-mono uppercase text-[#d4af37] font-semibold tracking-wider block">
                2. {t('checkout.deliveryDetails', 'Delivery Information')}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-[#aba79c]">
                    {t('checkout.recipientName', 'Recipient Full Name')} *
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="e.g. Ananya Sharma"
                    className="w-full px-4 py-3 rounded-xl bg-[#16130e] border border-[#d4af37]/30 text-xs sm:text-sm text-[#fcfbf7] focus:outline-none focus:border-[#fae69e]"
                  />
                  {errors.recipientName && (
                    <span className="text-[10px] font-mono text-[#f87171]">{errors.recipientName}</span>
                  )}
                </div>

                {/* Mobile Number */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-[#aba79c]">
                    {t('checkout.phone', 'Mobile Contact Number')} *
                  </label>
                  <input
                    type="tel"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    placeholder="+91 98450 12890"
                    className="w-full px-4 py-3 rounded-xl bg-[#16130e] border border-[#d4af37]/30 text-xs sm:text-sm text-[#fcfbf7] focus:outline-none focus:border-[#fae69e]"
                  />
                  {errors.recipientPhone && (
                    <span className="text-[10px] font-mono text-[#f87171]">{errors.recipientPhone}</span>
                  )}
                </div>

                {deliveryMethod === 'Home Delivery' && (
                  <>
                    {/* Street Address */}
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[11px] font-mono text-[#aba79c]">
                        {t('checkout.address', 'Street Address / Apartment / House No.')} *
                      </label>
                      <input
                        type="text"
                        value={addressLine}
                        onChange={(e) => setAddressLine(e.target.value)}
                        placeholder="e.g. Flat 402, Green Meadows, 12th Main Road"
                        className="w-full px-4 py-3 rounded-xl bg-[#16130e] border border-[#d4af37]/30 text-xs sm:text-sm text-[#fcfbf7] focus:outline-none focus:border-[#fae69e]"
                      />
                      {errors.addressLine && (
                        <span className="text-[10px] font-mono text-[#f87171]">{errors.addressLine}</span>
                      )}
                    </div>

                    {/* City */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-[#aba79c]">
                        {t('checkout.city', 'City / District')} *
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Bengaluru"
                        className="w-full px-4 py-3 rounded-xl bg-[#16130e] border border-[#d4af37]/30 text-xs sm:text-sm text-[#fcfbf7] focus:outline-none focus:border-[#fae69e]"
                      />
                      {errors.city && (
                        <span className="text-[10px] font-mono text-[#f87171]">{errors.city}</span>
                      )}
                    </div>

                    {/* State & Pincode */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-[#aba79c]">
                          {t('checkout.state', 'State')}
                        </label>
                        <input
                          type="text"
                          value={stateName}
                          onChange={(e) => setStateName(e.target.value)}
                          placeholder="Karnataka"
                          className="w-full px-3 py-3 rounded-xl bg-[#16130e] border border-[#d4af37]/30 text-xs sm:text-sm text-[#fcfbf7] focus:outline-none focus:border-[#fae69e]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-[#aba79c]">
                          {t('checkout.pincode', 'PIN Code')} *
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          placeholder="560038"
                          className="w-full px-3 py-3 rounded-xl bg-[#16130e] border border-[#d4af37]/30 text-xs sm:text-sm text-[#fcfbf7] focus:outline-none focus:border-[#fae69e]"
                        />
                        {errors.pincode && (
                          <span className="text-[10px] font-mono text-[#f87171]">{errors.pincode}</span>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Preferred Harvest Delivery Date */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[11px] font-mono text-[#aba79c]">
                    {t('checkout.preferredDate', 'Preferred Harvest Delivery Date')} *
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-[#d4af37] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#16130e] border border-[#d4af37]/30 text-xs sm:text-sm text-[#fcfbf7] focus:outline-none focus:border-[#fae69e]"
                    />
                  </div>
                  {errors.deliveryDate && (
                    <span className="text-[10px] font-mono text-[#f87171]">{errors.deliveryDate}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="p-5 sm:p-6 rounded-3xl bg-[#0f0e0c] border border-[#d4af37]/30 space-y-4">
              <span className="text-xs font-mono uppercase text-[#d4af37] font-semibold tracking-wider block">
                3. {t('checkout.paymentMethod', 'Payment Method')}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'UPI', label: 'UPI / QR', icon: QrCode, desc: 'Instant Settlement' },
                  { id: 'Card', label: 'Card / Net Banking', icon: CreditCard, desc: 'Direct Pay' },
                  { id: 'Cash on Delivery', label: 'Cash on Delivery', icon: Banknote, desc: 'Pay at Doorstep' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPaymentMethod(p.id as any)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-1.5 ${
                      paymentMethod === p.id
                        ? 'bg-[#221c10] border-[#d4af37] text-[#fae69e] shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                        : 'bg-[#14120e] border-[#d4af37]/20 text-[#8e8b82] hover:text-[#fcfbf7]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p.icon className="w-4 h-4 text-[#d4af37]" />
                      {paymentMethod === p.id && <Check className="w-3.5 h-3.5 text-[#34d399]" />}
                    </div>
                    <div>
                      <div className="font-serif font-bold text-xs text-[#fcfbf7]">{p.label}</div>
                      <div className="text-[10px] font-mono text-[#8e8b82]">{p.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: ORDER SUMMARY & PRICE BREAKDOWN */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-5 sm:p-6 rounded-3xl bg-[#0f0e0c] border-2 border-[#d4af37]/40 shadow-xl space-y-6 sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-[#d4af37]/20">
                <span className="font-serif text-lg font-bold text-[#fcfbf7] flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#d4af37]" />
                  <span>{t('checkout.orderSummary', 'Order Summary')}</span>
                </span>
                <span className="text-xs font-mono text-[#fae69e] bg-[#201a0e] px-2.5 py-0.5 rounded-full border border-[#d4af37]/40">
                  {items.reduce((s, i) => s + i.quantity, 0)} {t('market.items', 'items')}
                </span>
              </div>

              {/* Cart Items List with Quantity Controls */}
              <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="p-3 rounded-2xl bg-[#14120e] border border-[#d4af37]/20 flex items-center justify-between gap-3"
                  >
                    <img
                      src={getProduceImage(item)}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover border border-[#d4af37]/30 shrink-0"
                    />

                    <div className="min-w-0 flex-1">
                      <h4 className="font-serif font-bold text-xs sm:text-sm text-[#fcfbf7] truncate">
                        {getLocalizedProduceName(item.name, language)}
                      </h4>
                      <div className="text-[10px] font-mono text-[#8e8b82] flex items-center gap-1">
                        <span>👨🌾 {item.farmerName}</span>
                        {item.farmerId && (
                          <span className="text-[#fae69e] bg-[#221c10] px-1 rounded text-[9px]">
                            {item.farmerId}
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-mono text-[#fae69e] font-bold mt-0.5">
                        ₹{item.price} /{getLocalizedUnit(item.unit, language)}
                      </div>
                    </div>

                    {/* Quantity Adjustment */}
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <div className="flex items-center gap-1.5 bg-[#1e1a12] px-2 py-1 rounded-lg border border-[#d4af37]/30">
                        <button
                          type="button"
                          onClick={() => {
                            if (item.quantity > 1) {
                              updateQuantity(item.productId, item.quantity - 1);
                            } else {
                              removeFromCart(item.productId);
                            }
                          }}
                          className="text-[#8e8b82] hover:text-[#fcfbf7]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-mono font-bold text-[#fae69e] px-1">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="text-[#8e8b82] hover:text-[#fcfbf7]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-mono font-bold text-[#fcfbf7]">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="pt-4 border-t border-[#d4af37]/20 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-[#aba79c]">
                  <span>{t('checkout.subtotal', 'Items Subtotal')}:</span>
                  <span className="text-[#fcfbf7]">₹{subtotal}</span>
                </div>

                <div className="flex items-center justify-between text-[#aba79c]">
                  <span>{t('checkout.deliveryFee', 'Direct Farm Logistics')}:</span>
                  <span className={deliveryFee === 0 ? 'text-[#34d399] font-bold' : 'text-[#fcfbf7]'}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>

                <div className="pt-3 border-t border-[#d4af37]/25 flex items-center justify-between text-base font-bold">
                  <span className="text-[#fcfbf7] font-serif">{t('checkout.total', 'Total Amount')}:</span>
                  <span className="font-serif text-xl sm:text-2xl text-[#fae69e]">₹{totalAmount}</span>
                </div>
              </div>

              {/* Submit Order Button */}
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#b89120] text-[#0a0a0a] font-serif font-bold text-sm uppercase tracking-wider hover:brightness-110 active:scale-[0.99] transition-all shadow-[0_0_30px_rgba(212,175,55,0.45)] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#0a0a0a] border-t-transparent rounded-full animate-spin" />
                    <span>{t('checkout.processing', 'Registering Order in PostgreSQL...')}</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-[#0a0a0a]" />
                    <span>{t('checkout.placeOrder', 'Place Order')} (₹{totalAmount})</span>
                    <ArrowRight className="w-4 h-4 text-[#0a0a0a]" />
                  </>
                )}
              </button>

              <p className="text-[10px] font-mono text-[#736f66] text-center">
                100% of payment goes directly to verified Indian growers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
