import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Calendar,
  MapPin,
  Truck,
  Sparkles,
  Tractor,
  Download,
  Copy,
  Check,
  Package,
  Clock,
  User,
  ExternalLink,
} from 'lucide-react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Order } from '../context/OrdersContext';
import { useLanguage } from '../context/LanguageContext';
import { FarmerProfileModal, FarmerProfileData } from '../components/FarmerProfileModal';
import { getProduceImage } from '../utils/produceImages';
import { getLocalizedProduceName, getLocalizedCategory, getLocalizedUnit } from '../utils/produceLocalization';
import { ProductImage } from '../components/ProductImage';

export const OrderConfirmedPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState<FarmerProfileData | null>(null);

  // Retrieve placed order from route state
  const order = (location.state as { order?: Order })?.order;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCopyOrderId = () => {
    if (!order?.id) return;
    navigator.clipboard.writeText(order.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenFarmerProfile = (farmerName: string, farmerId?: string) => {
    const farmerSlug = farmerName.toLowerCase().includes('ravi')
      ? 'ravi-kumar'
      : farmerName.toLowerCase().includes('lakshmi')
      ? 'lakshmi-devi'
      : 'suresh-naidu';

    setSelectedFarmer({
      id: farmerSlug,
      name: farmerName,
      farmerId: farmerId || (farmerName.toLowerCase().includes('ravi') ? 'AV-FARM-1001' : 'AV-FARM-1002'),
      role: 'Verified Direct Grower',
      location: 'Karnataka Farmlands',
      experience: '12+ Years Natural Cultivation',
      specialty: 'Farm Fresh Produce',
      acreage: '8 Acres Heritage Soil',
      initials: farmerName.split(' ').map((n) => n[0]).join(''),
      highlightBadge: 'Direct Producer',
    });
  };

  if (!order) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex flex-col items-center justify-center text-center bg-transparent text-[#fcfbf7]">
        <div className="w-20 h-20 rounded-3xl bg-[#14120e] border border-[#d4af37]/40 flex items-center justify-center text-[#fae69e] mb-5 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
          <ShoppingBag className="w-10 h-10 text-[#d4af37]" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#fcfbf7] mb-2">
          {t('confirmed.title', 'Order Confirmed')}
        </h2>
        <p className="text-xs text-[#aba79c] max-w-sm mb-6">
          {t('confirmed.subtitle', 'You can track all your harvest orders directly in the Customer Dashboard.')}
        </p>
        <Link
          to="/customer-dashboard"
          className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#fae69e] to-[#d4af37] text-[#0a0a0a] font-serif font-bold text-xs uppercase tracking-wider"
        >
          {t('confirmed.trackOrder', 'View My Orders')}
        </Link>
      </div>
    );
  }

  const steps = [
    { label: t('order.placed', 'Placed'), icon: ShoppingBag, desc: 'Order Registered' },
    { label: t('order.harvesting', 'Harvesting'), icon: Tractor, desc: 'Dawn Farm Harvest' },
    { label: t('order.dispatched', 'Dispatched'), icon: Truck, desc: 'Direct Dispatch' },
    { label: t('order.delivered', 'Delivered'), icon: CheckCircle2, desc: 'Doorstep Drop' },
  ];

  return (
    <div className="min-h-screen pt-28 pb-24 px-4 sm:px-6 lg:px-8 bg-transparent text-[#fcfbf7] font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* SUCCESS ICON & HEADLINE */}
        <div className="text-center space-y-3">
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#262010] to-[#12100a] border-2 border-[#d4af37] flex items-center justify-center text-[#fae69e] mx-auto shadow-[0_0_40px_rgba(212,175,55,0.4)]"
          >
            <CheckCircle2 className="w-10 h-10 text-[#34d399]" />
          </motion.div>

          <div>
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#d4af37] font-bold block mb-1">
              {t('checkout.secureGuaranteed', '100% Direct Farm Settlement')}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#fcfbf7]">
              {t('confirmed.title', 'Harvest Order Confirmed!')}
            </h1>
            <p className="text-xs sm:text-sm text-[#aba79c] mt-1 max-w-md mx-auto">
              {t('confirmed.subtitle', 'Your order has been assigned directly to the grower and entered into PostgreSQL.')}
            </p>
          </div>

          {/* Reference Order ID Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#14120e] border border-[#d4af37]/45 shadow-inner">
            <span className="text-xs text-[#8e8b82] font-mono">{t('confirmed.orderId', 'Order ID')}:</span>
            <span className="text-xs font-mono font-bold text-[#fae69e] tracking-wider">
              #{order.id.slice(-6).toUpperCase()}
            </span>
            <button
              type="button"
              onClick={handleCopyOrderId}
              className="p-1 rounded text-[#8e8b82] hover:text-[#fae69e] transition-colors cursor-pointer"
              title="Copy Order ID"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#34d399]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* ORDER DETAILS MANIFEST CARD */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0e0d0b] border-2 border-[#d4af37]/40 shadow-[0_0_50px_-10px_rgba(212,175,55,0.25)] space-y-6">
          {/* Status Timeline */}
          <div className="pb-6 border-b border-[#d4af37]/20">
            <span className="text-xs font-mono uppercase text-[#d4af37] font-semibold block mb-4">
              Live Harvest Status
            </span>

            <div className="relative">
              <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-0.5 bg-[#201c14] z-0" />
              <div className="relative z-10 flex items-center justify-between">
                {steps.map((step, idx) => {
                  const isFirst = idx === 0;
                  return (
                    <div key={step.label} className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isFirst
                            ? 'bg-gradient-to-br from-[#fae69e] to-[#d4af37] text-[#0a0a0a] ring-2 ring-[#fae69e] ring-offset-2 ring-offset-black scale-110 shadow-[0_0_15px_rgba(212,175,55,0.5)]'
                            : 'bg-[#18150e] border border-[#d4af37]/30 text-[#6e6b63]'
                        }`}
                      >
                        <step.icon className="w-4 h-4" />
                      </div>
                      <span className={`mt-2 text-[10px] sm:text-xs font-mono ${isFirst ? 'text-[#fae69e] font-bold' : 'text-[#6e6b63]'}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono p-4 rounded-2xl bg-[#14120e] border border-[#d4af37]/20">
            <div>
              <span className="text-[#8e8b82] text-[10px] block">Order Date:</span>
              <span className="text-[#f5f3eb] font-bold">{order.createdAt}</span>
            </div>
            <div>
              <span className="text-[#8e8b82] text-[10px] block">Total Items:</span>
              <span className="text-[#fae69e] font-bold">{order.items.length} crops</span>
            </div>
            <div>
              <span className="text-[#8e8b82] text-[10px] block">Payment:</span>
              <span className="text-[#34d399] font-bold">{order.paymentMethod}</span>
            </div>
            <div>
              <span className="text-[#8e8b82] text-[10px] block">Total Settled:</span>
              <span className="text-[#fae69e] font-bold text-sm">₹{order.total}</span>
            </div>
          </div>

          {/* Harvest Crops Ordered */}
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase text-[#d4af37] font-semibold block">
              Ordered Fresh Produce
            </span>
            <div className="space-y-2.5">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-[#14120e] border border-[#d4af37]/20 flex items-center justify-between gap-3 text-xs font-mono"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-[#d4af37]/30">
                      <ProductImage
                        src={getProduceImage(item)}
                        alt={item.name}
                        productName={item.name}
                        size="xs"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-serif font-bold text-sm text-[#fcfbf7]">{getLocalizedProduceName(item.name, language)}</div>
                      <div className="text-[10px] text-[#8e8b82]">
                        {item.quantity} {getLocalizedUnit(item.unit, language)} × ₹{item.price}
                      </div>
                      <div
                        onClick={() => handleOpenFarmerProfile(item.farmerName, item.farmerId)}
                        className="inline-flex items-center gap-1 text-[10px] text-[#d4af37] hover:text-[#fae69e] hover:underline cursor-pointer mt-0.5"
                      >
                        <span>👨🌾 {item.farmerName}</span>
                        {item.farmerId && (
                          <span className="text-[9px] bg-[#221c10] px-1 rounded text-[#fae69e]">
                            {item.farmerId}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right font-bold text-sm text-[#fae69e]">
                    ₹{item.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Destination */}
          <div className="p-4 rounded-2xl bg-[#14120e] border border-[#d4af37]/20 text-xs space-y-1">
            <span className="font-mono text-[10px] uppercase text-[#d4af37] font-semibold block">
              Delivery Destination:
            </span>
            <p className="text-[#f5f3eb] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
              <span>{order.deliveryAddress}</span>
            </p>
          </div>

          {/* Action CTAs: Track Order / View My Orders / Continue Shopping */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <Link
              to="/customer-dashboard"
              className="w-full sm:flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#b89120] text-[#0a0a0a] font-serif font-bold text-xs uppercase tracking-wider text-center hover:brightness-110 shadow-lg cursor-pointer"
            >
              {t('confirmed.trackOrder', 'Track Order in Dashboard')}
            </Link>

            <Link
              to="/marketplace"
              className="w-full sm:flex-1 py-3.5 rounded-2xl bg-[#1a160e] hover:bg-[#262012] border border-[#d4af37]/40 text-xs font-mono font-bold text-[#fae69e] text-center transition-all cursor-pointer"
            >
              {t('dash.continueShopping', 'Continue Shopping')}
            </Link>
          </div>
        </div>
      </div>

      {/* FARMER PROFILE MODAL */}
      {selectedFarmer && (
        <FarmerProfileModal
          farmer={selectedFarmer}
          onClose={() => setSelectedFarmer(null)}
          onSelectProduce={() => {
            setSelectedFarmer(null);
            navigate('/marketplace');
          }}
        />
      )}
    </div>
  );
};
