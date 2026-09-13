import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  ShoppingBag,
  Heart,
  BookmarkCheck,
  Calendar,
  CreditCard,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  MapPin,
  Star,
  MessageSquare,
  Truck,
  Tractor,
  CheckCircle2,
  Package,
  Check,
  X,
  Eye,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOrders, Order, OrderStatus } from '../context/OrdersContext';
import { useCart } from '../context/CartContext';
import { useProduce } from '../context/ProduceContext';
import { useLanguage } from '../context/LanguageContext';
import { WriteReviewModal } from './WriteReviewModal';
import { FarmerProfileModal, FarmerProfileData } from './FarmerProfileModal';
import { getProduceImage } from '../utils/produceImages';
import { getLocalizedProduceName, getLocalizedCategory, getLocalizedUnit } from '../utils/produceLocalization';
import { ProductImage } from './ProductImage';

export const CustomerDashboardSection: React.FC = () => {
  const { isLoggedIn, userRole, user } = useAuth();
  const { orders, isLoading } = useOrders();
  const { items: cartItems, subtotal, addToCart, removeFromCart, updateQuantity, openCart } = useCart();
  const { listings } = useProduce();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState<'orders' | 'cart' | 'recommendations'>('orders');
  const [selectedTab, setSelectedTab] = useState<'all' | 'active' | 'delivered' | 'cancelled'>('all');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);
  const [selectedFarmer, setSelectedFarmer] = useState<FarmerProfileData | null>(null);
  const [reviewModalData, setReviewModalData] = useState<{
    farmerId: string;
    farmerName: string;
    produceName?: string;
  } | null>(null);

  // Real Customer Name & Profile Data
  const displayName = user?.name || 'Ananya Sharma';
  const displayEmail = user?.email || 'customer@auricvista.farm';
  const displayLocation = user?.location || 'Bengaluru, Karnataka';

  // Compute live summary numbers from real PostgreSQL orders
  const totalOrdersCount = orders.length;
  const activeOrders = orders.filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled');
  const deliveredOrders = orders.filter((o) => o.status === 'Delivered');
  const cancelledOrders = orders.filter((o) => o.status === 'Cancelled');

  // Filter orders by selected tab
  const filteredOrders = useMemo(() => {
    if (selectedTab === 'active') return activeOrders;
    if (selectedTab === 'delivered') return deliveredOrders;
    if (selectedTab === 'cancelled') return cancelledOrders;
    return orders;
  }, [orders, selectedTab, activeOrders, deliveredOrders, cancelledOrders]);

  // Order lifecycle step calculation
  const getStepNumber = (status: OrderStatus) => {
    switch (status) {
      case 'Placed':
        return 1;
      case 'Harvesting':
        return 2;
      case 'Dispatched':
        return 3;
      case 'Delivered':
        return 4;
      default:
        return 1;
    }
  };

  const stepsList = [
    { key: 'Placed', label: t('order.placed', 'Placed'), icon: ShoppingBag },
    { key: 'Harvesting', label: t('order.harvesting', 'Harvesting'), icon: Tractor },
    { key: 'Dispatched', label: t('order.dispatched', 'Dispatched'), icon: Truck },
    { key: 'Delivered', label: t('order.delivered', 'Delivered'), icon: CheckCircle2 },
  ];

  const handleOpenFarmerProfile = (farmerName: string, farmerId?: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
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

  return (
    <section
      id="customer-dashboard-section"
      className="relative pt-6 sm:pt-8 pb-20 px-4 sm:px-6 lg:px-8 bg-transparent text-[#fcfbf7] min-h-screen"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 1. CUSTOMER WELCOME HEADER */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#18140e] via-[#12100c] to-[#0c0b08] border-2 border-[#d4af37]/40 shadow-[0_0_40px_-10px_rgba(212,175,55,0.25)]">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#241d10] border-2 border-[#d4af37]/60 flex items-center justify-center text-[#fae69e] text-2xl font-serif font-bold shadow-[0_0_20px_rgba(212,175,55,0.3)] shrink-0">
                {displayName.charAt(0)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#fcfbf7]">
                    {t('dash.welcome', 'Welcome')}, {displayName}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#102414] border border-[#34d399]/40 text-[#34d399] text-[11px] font-mono font-medium">
                    <CheckCircle2 className="w-3 h-3" />
                    {t('nav.roleCustomer', 'Verified Patron')}
                  </span>
                </div>
                <p className="text-xs text-[#aba79c] font-sans">
                  {t('dash.customerSubtitle', 'Discover fresh produce directly from Indian farmers.')}
                </p>
                <div className="flex items-center gap-3 text-xs font-mono text-[#8e8b82] pt-1">
                  <span>{displayEmail}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#d4af37]" />
                    {displayLocation}
                  </span>
                </div>
              </div>
            </div>

            {/* Explore Marketplace CTA */}
            <div className="w-full md:w-auto">
              <Link
                to="/marketplace"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#b89120] text-[#0a0a0a] font-serif font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-[0.99] transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-[#0a0a0a]" />
                <span>{t('dash.continueShopping', 'Continue Shopping')}</span>
              </Link>
            </div>
          </div>

          {/* 2. SUMMARY KPI CARDS (REAL DATA ONLY) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-[#d4af37]/20">
            {/* Total Orders */}
            <div className="p-4 rounded-2xl bg-[#12100c] border border-[#d4af37]/30 shadow-sm">
              <div className="flex items-center justify-between text-[#8e8b82] mb-1">
                <span className="text-[11px] font-mono uppercase">{t('dash.totalOrders', 'Total Orders')}</span>
                <ShoppingBag className="w-4 h-4 text-[#d4af37]" />
              </div>
              <div className="font-serif text-2xl font-bold text-[#f5f3eb]">{totalOrdersCount}</div>
            </div>

            {/* Active Orders */}
            <div className="p-4 rounded-2xl bg-[#14120c] border border-[#fae69e]/40 shadow-sm">
              <div className="flex items-center justify-between text-[#8e8b82] mb-1">
                <span className="text-[11px] font-mono uppercase text-[#fae69e]">{t('dash.activeDispatches', 'Active Orders')}</span>
                <Clock className="w-4 h-4 text-[#fae69e]" />
              </div>
              <div className="font-serif text-2xl font-bold text-[#fae69e]">{activeOrders.length}</div>
            </div>

            {/* Delivered Orders */}
            <div className="p-4 rounded-2xl bg-[#12100c] border border-[#34d399]/40 shadow-sm">
              <div className="flex items-center justify-between text-[#8e8b82] mb-1">
                <span className="text-[11px] font-mono uppercase text-[#34d399]">{t('dash.delivered', 'Delivered')}</span>
                <BookmarkCheck className="w-4 h-4 text-[#34d399]" />
              </div>
              <div className="font-serif text-2xl font-bold text-[#34d399]">{deliveredOrders.length}</div>
            </div>

            {/* Cancelled Orders */}
            <div className="p-4 rounded-2xl bg-[#12100c] border border-[#d4af37]/30 shadow-sm">
              <div className="flex items-center justify-between text-[#8e8b82] mb-1">
                <span className="text-[11px] font-mono uppercase text-[#8e8b82]">{t('order.cancelled', 'Cancelled')}</span>
                <AlertCircle className="w-4 h-4 text-[#8e8b82]" />
              </div>
              <div className="font-serif text-2xl font-bold text-[#aba79c]">{cancelledOrders.length}</div>
            </div>
          </div>
        </div>

        {/* 2.5 SECTION SELECTOR (ORDERS, CART, RECOMMENDATIONS) */}
        <div className="flex items-center gap-2 border-b border-[#d4af37]/25 pb-3 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveSection('orders')}
            className={`px-4 py-2 rounded-xl font-serif text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeSection === 'orders'
                ? 'bg-[#221c0e] text-[#fae69e] border border-[#d4af37] shadow-sm'
                : 'text-[#aba79c] hover:text-[#fcfbf7] hover:bg-white/5'
            }`}
          >
            <Package className="w-4 h-4 text-[#d4af37]" />
            <span>My Orders ({orders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('cart')}
            className={`px-4 py-2 rounded-xl font-serif text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeSection === 'cart'
                ? 'bg-[#221c0e] text-[#fae69e] border border-[#d4af37] shadow-sm'
                : 'text-[#aba79c] hover:text-[#fcfbf7] hover:bg-white/5'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-[#d4af37]" />
            <span>Harvest Cart ({cartItems.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('recommendations')}
            className={`px-4 py-2 rounded-xl font-serif text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeSection === 'recommendations'
                ? 'bg-[#221c0e] text-[#fae69e] border border-[#d4af37] shadow-sm'
                : 'text-[#aba79c] hover:text-[#fcfbf7] hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#d4af37]" />
            <span>Fresh Recommendations</span>
          </button>
        </div>

        {/* 3. ORDERS SECTION */}
        {activeSection === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4 pb-2 border-b border-[#d4af37]/20">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#fcfbf7]">{t('dash.myOrdersTitle', 'My Orders')}</h2>
                <p className="text-xs text-[#8e8b82]">{t('dash.myOrdersSub', 'Track real-time direct farm harvests and order delivery milestones.')}</p>
              </div>

              <div className="p-1 rounded-2xl bg-[#14120e] border border-[#d4af37]/30 inline-flex font-mono text-xs overflow-x-auto no-scrollbar">
                {[
                  { id: 'all', label: t('market.allCategories', 'All Orders') },
                  { id: 'active', label: t('dash.activeDispatches', 'Active') },
                  { id: 'delivered', label: t('dash.delivered', 'Delivered') },
                  { id: 'cancelled', label: t('order.cancelled', 'Cancelled') },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSelectedTab(tab.id as any)}
                    className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                      selectedTab === tab.id
                        ? 'bg-gradient-to-r from-[#241c0e] to-[#16130c] text-[#fae69e] border border-[#d4af37]/60 font-bold shadow-sm'
                        : 'text-[#8e8b82] hover:text-[#f5f3eb]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

        {/* 4. ORDERS LISTING (CARDS WITH STATUS TIMELINE) */}
        {isLoading ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-mono text-[#fae69e]">{t('common.loading', 'Loading your orders...')}</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          /* 5. EMPTY STATE */
          <div className="p-12 sm:p-16 rounded-3xl bg-[#12100c] border border-[#d4af37]/30 text-center space-y-4 max-w-md mx-auto shadow-lg">
            <div className="w-16 h-16 rounded-full bg-[#1c180e] border border-[#d4af37]/50 flex items-center justify-center text-[#fae69e] mx-auto">
              <ShoppingBag className="w-7 h-7 text-[#d4af37]" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#fcfbf7]">
              {t('dash.noOrdersYet', 'No orders yet')}
            </h3>
            <p className="text-xs text-[#aba79c] leading-relaxed">
              {t('dash.emptyOrdersDesc', 'Fresh produce from Indian farmers is waiting for you.')}
            </p>
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#b89120] text-[#0a0a0a] font-serif font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-md"
            >
              <span>{t('dash.exploreMarketplace', 'Explore Marketplace')}</span>
              <ArrowRight className="w-4 h-4 text-[#0a0a0a]" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const currentStep = getStepNumber(order.status);
              const isDelivered = order.status === 'Delivered';
              const isCancelled = order.status === 'Cancelled';

              return (
                <div
                  key={order.id}
                  className="rounded-3xl bg-[#0f0e0c] border border-[#d4af37]/30 overflow-hidden shadow-[0_0_25px_-8px_rgba(212,175,55,0.15)] hover:border-[#d4af37]/60 transition-all"
                >
                  {/* Order Card Header */}
                  <div className="p-5 sm:p-6 bg-gradient-to-r from-[#18140e] to-[#100e0a] border-b border-[#d4af37]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-bold text-[#fae69e]">
                          Order #{order.id.slice(-6).toUpperCase()}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono uppercase font-bold ${
                            isDelivered
                              ? 'bg-[#102414] text-[#34d399] border border-[#34d399]/40'
                              : isCancelled
                              ? 'bg-[#2a1010] text-[#f87171] border border-[#f87171]/40'
                              : 'bg-[#221c10] text-[#fae69e] border border-[#d4af37]/50'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-[#8e8b82] flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-[#d4af37]" />
                        <span>Placed: {order.createdAt}</span>
                      </div>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-xs text-[#8e8b82] font-mono">{t('checkout.total', 'Total')}:</span>
                      <span className="font-serif text-xl sm:text-2xl font-bold text-[#fae69e]">
                        ₹{order.total}
                      </span>
                    </div>
                  </div>

                  {/* Visual Status Timeline */}
                  <div className="px-5 sm:px-8 py-6 border-b border-[#d4af37]/15 bg-[#0b0a08]/80">
                    {isCancelled ? (
                      <div className="flex items-center gap-3 text-xs font-mono text-[#f87171]">
                        <AlertCircle className="w-4 h-4" />
                        <span>Order was cancelled.</span>
                      </div>
                    ) : (
                      <div className="relative">
                        {/* Connecting track line */}
                        <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-0.5 bg-[#201c14] z-0" />
                        <div
                          className="absolute top-1/2 left-4 -translate-y-1/2 h-0.5 bg-gradient-to-r from-[#d4af37] to-[#fae69e] transition-all duration-500 z-0"
                          style={{ width: `${Math.min(100, Math.max(0, ((currentStep - 1) / 3) * 100))}%` }}
                        />

                        {/* Step checkpoints */}
                        <div className="relative z-10 flex items-center justify-between">
                          {stepsList.map((step, idx) => {
                            const stepIdx = idx + 1;
                            const isReached = stepIdx <= currentStep;
                            const isCurrent = stepIdx === currentStep;

                            return (
                              <div key={step.key} className="flex flex-col items-center">
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                    isReached
                                      ? 'bg-gradient-to-br from-[#fae69e] to-[#d4af37] text-[#0a0a0a] shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                                      : 'bg-[#18150e] border border-[#d4af37]/30 text-[#6e6b63]'
                                  } ${isCurrent ? 'ring-2 ring-[#fae69e] ring-offset-2 ring-offset-black scale-110' : ''}`}
                                >
                                  <step.icon className="w-4 h-4" />
                                </div>
                                <span
                                  className={`mt-2 text-[10px] sm:text-xs font-mono font-medium text-center ${
                                    isReached ? 'text-[#fae69e] font-bold' : 'text-[#6e6b63]'
                                  }`}
                                >
                                  {step.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Order Items & Farmer Connection */}
                  <div className="p-5 sm:p-6 space-y-4">
                    <div className="space-y-3">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-2xl bg-[#14120e] border border-[#d4af37]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#d4af37]/30 shrink-0">
                              <ProductImage
                                src={getProduceImage(item)}
                                alt={item.name}
                                productName={item.name}
                                size="xs"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-serif font-bold text-sm text-[#f5f3eb]">{getLocalizedProduceName(item.name, language)}</h4>
                              <div className="text-[11px] font-mono text-[#8e8b82]">
                                {item.quantity} {getLocalizedUnit(item.unit, language)} × ₹{item.price}
                              </div>

                              {/* Clickable Farmer Connection with Farmer ID */}
                              <div
                                onClick={(e) => handleOpenFarmerProfile(item.farmerName, item.farmerId, e)}
                                className="inline-flex items-center gap-1 text-[11px] font-mono text-[#d4af37] hover:text-[#fae69e] hover:underline cursor-pointer mt-0.5"
                                title="Click to view verified farmer profile"
                              >
                                <span>👨🌾 {item.farmerName}</span>
                                {item.farmerId && (
                                  <span className="text-[9px] bg-[#221c10] px-1.5 py-0.2 rounded border border-[#d4af37]/40 text-[#fae69e]">
                                    {item.farmerId}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="text-right font-mono font-bold text-sm text-[#fae69e] self-end sm:self-center">
                            ₹{item.price * item.quantity}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Delivery & Order Details Footer */}
                    <div className="pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                      <div className="text-[#8e8b82] flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                        <span>{order.deliveryAddress || 'Doorstep Delivery'}</span>
                      </div>

                      {/* Action Buttons: [ View Details ] [ Rate & Review ] [ Buy Again ] */}
                      <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={() => setSelectedOrderDetails(order)}
                          className="px-3.5 py-2 rounded-xl bg-[#1a160e] hover:bg-[#262012] border border-[#d4af37]/40 text-xs font-mono font-semibold text-[#fae69e] transition-all cursor-pointer"
                        >
                          {t('order.viewDetails', 'Order Details')}
                        </button>

                        {/* Review Action ONLY if Delivered */}
                        {isDelivered && (
                          <button
                            type="button"
                            onClick={() => {
                              const firstItem = order.items[0];
                              setReviewModalData({
                                farmerId: firstItem.farmerId || 'ravi-kumar',
                                farmerName: firstItem.farmerName,
                                produceName: firstItem.name,
                              });
                            }}
                            className="px-3.5 py-2 rounded-xl bg-[#241c0e] hover:bg-[#322612] border border-[#d4af37] text-xs font-mono font-bold text-[#fae69e] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                          >
                            <Star className="w-3.5 h-3.5 text-[#d4af37] fill-[#d4af37]" />
                            <span>{t('product.rateReview', 'Rate & Review')}</span>
                          </button>
                        )}

                        {/* Buy Again Button */}
                        {isDelivered && (
                          <button
                            type="button"
                            onClick={() => {
                              order.items.forEach((it) => {
                                addToCart(
                                  {
                                    productId: it.productId,
                                    name: it.name,
                                    image: getProduceImage(it),
                                    price: it.price,
                                    unit: it.unit,
                                    farmerName: it.farmerName,
                                    farmerId: it.farmerId,
                                    maxAvailable: 100,
                                  },
                                  it.quantity
                                );
                              });
                              openCart();
                            }}
                            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#fae69e] to-[#d4af37] text-[#0a0a0a] text-xs font-serif font-bold uppercase tracking-wider hover:brightness-110 flex items-center gap-1 shadow-sm cursor-pointer active:scale-95"
                          >
                            <RefreshCw className="w-3 h-3 text-[#0a0a0a]" />
                            <span>{t('order.buyAgain', 'Buy Again')}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      )}

      {/* 4. CART OVERVIEW TAB */}
      {activeSection === 'cart' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-[#d4af37]/20">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#fcfbf7]">Your Harvest Cart</h2>
              <p className="text-xs text-[#8e8b82]">Review selected farm produce and finalize your direct order.</p>
            </div>
            <span className="text-xs font-mono text-[#fae69e] bg-[#1a150e] px-3 py-1.5 rounded-xl border border-[#d4af37]/30">
              {cartItems.length} items selected
            </span>
          </div>

          {cartItems.length === 0 ? (
            <div className="p-12 rounded-3xl bg-[#12100c] border border-[#d4af37]/30 text-center space-y-4 max-w-md mx-auto shadow-lg">
              <div className="w-16 h-16 rounded-full bg-[#1c180e] border border-[#d4af37]/50 flex items-center justify-center text-[#fae69e] mx-auto">
                <ShoppingBag className="w-7 h-7 text-[#d4af37]" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#fcfbf7]">Your Cart is Empty</h3>
              <p className="text-xs text-[#aba79c] leading-relaxed">
                Explore our marketplace to discover dawn-harvested produce directly from verified growers.
              </p>
              <Link
                to="/marketplace"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#b89120] text-[#0a0a0a] font-serif font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-md"
              >
                <span>Explore Marketplace</span>
                <ArrowRight className="w-4 h-4 text-[#0a0a0a]" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item.productId}
                    className="p-4 rounded-2xl bg-[#12100c] border border-[#d4af37]/25 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#18150e] shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-serif font-bold text-sm text-[#fcfbf7] truncate">{item.name}</h4>
                        <p className="text-xs font-mono text-[#aba79c]">👨🌾 {item.farmerName}</p>
                        <p className="text-xs font-mono font-bold text-[#fae69e]">₹{item.price}/{item.unit}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="flex items-center gap-2 bg-[#1c180e] px-2 py-1 rounded-xl border border-[#d4af37]/30">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-[#d4af37] hover:bg-white/10 font-bold"
                        >
                          -
                        </button>
                        <span className="font-mono text-xs font-bold text-[#fcfbf7] w-4 text-center">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-[#d4af37] hover:bg-white/10 font-bold"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-serif font-bold text-sm text-[#fae69e] w-16 text-right">
                        ₹{item.price * item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.productId)}
                        className="text-[#8e8b82] hover:text-[#f87171] p-1 cursor-pointer"
                        title="Remove item"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-4">
                <div className="p-6 rounded-2xl bg-[#12100c] border border-[#d4af37]/35 space-y-4 sticky top-28">
                  <h3 className="font-serif text-lg font-bold text-[#fcfbf7] pb-2 border-b border-[#d4af37]/20">
                    Cart Total
                  </h3>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between text-[#aba79c]">
                      <span>Items Subtotal:</span>
                      <span className="text-[#fcfbf7] font-bold">₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-[#aba79c]">
                      <span>Direct Farm Logistics:</span>
                      <span className="text-[#34d399] font-bold">{subtotal >= 500 ? 'FREE' : '₹40'}</span>
                    </div>
                    <div className="pt-2 border-t border-[#d4af37]/20 flex justify-between text-base font-bold text-[#fae69e]">
                      <span>Estimated Total:</span>
                      <span>₹{subtotal + (subtotal >= 500 ? 0 : 40)}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate('/checkout')}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#b89120] text-[#0a0a0a] font-serif font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-lg cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Direct Checkout</span>
                    <ArrowRight className="w-4 h-4 text-[#0a0a0a]" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. RECOMMENDATIONS TAB */}
      {activeSection === 'recommendations' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-[#d4af37]/20">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#fcfbf7]">Recommended Farm Harvests</h2>
              <p className="text-xs text-[#8e8b82]">Handpicked seasonal crops currently in stock from certified regional growers.</p>
            </div>
            <Link
              to="/marketplace"
              className="text-xs font-mono text-[#fae69e] hover:underline flex items-center gap-1"
            >
              <span>View All 81 Crops</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {listings
              .filter((p) => p.status === 'Active' && p.quantity > 0)
              .slice(0, 8)
              .map((produce) => (
                <div
                  key={produce.id}
                  className="p-3.5 rounded-2xl bg-[#12100c] border border-[#d4af37]/25 hover:border-[#fae69e] transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div className="aspect-square rounded-xl overflow-hidden bg-[#18150e]">
                    <img
                      src={getProduceImage(produce)}
                      alt={produce.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-xs sm:text-sm text-[#fcfbf7] truncate">{produce.name}</h4>
                    <p className="text-[10px] font-mono text-[#8e8b82] truncate mt-0.5">👨🌾 {produce.farmerName}</p>
                    <p className="text-xs font-serif font-bold text-[#fae69e] mt-1">₹{produce.pricePerUnit}/{produce.unit}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      addToCart({
                        productId: produce.id,
                        name: produce.name,
                        image: getProduceImage(produce),
                        price: produce.pricePerUnit,
                        unit: produce.unit,
                        farmerName: produce.farmerName,
                        maxAvailable: produce.quantity,
                      }, 1);
                      openCart();
                    }}
                    className="w-full py-2 rounded-lg bg-[#1e1910] hover:bg-[#282014] border border-[#d4af37]/40 text-[10px] font-serif font-bold text-[#fae69e] uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer"
                  >
                    <Plus className="w-3 h-3 text-[#d4af37]" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
      <AnimatePresence>
        {selectedOrderDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-3xl bg-[#12100c] border-2 border-[#d4af37]/60 p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#d4af37]/20">
                <div>
                  <span className="text-[10px] font-mono text-[#d4af37] uppercase tracking-wider block">
                    Order Manifest
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#fcfbf7]">
                    Order #{selectedOrderDetails.id.slice(-6).toUpperCase()}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedOrderDetails(null)}
                  className="p-1 rounded-full text-[#aba79c] hover:text-[#fcfbf7]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Order Metadata */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono p-3.5 rounded-2xl bg-[#18150e] border border-[#d4af37]/20">
                <div>
                  <span className="text-[#8e8b82] block text-[10px]">Order Status:</span>
                  <span className="text-[#34d399] font-bold">{selectedOrderDetails.status}</span>
                </div>
                <div>
                  <span className="text-[#8e8b82] block text-[10px]">Payment Method:</span>
                  <span className="text-[#fae69e] font-bold">{selectedOrderDetails.paymentMethod}</span>
                </div>
                <div>
                  <span className="text-[#8e8b82] block text-[10px]">Order Date:</span>
                  <span className="text-[#f5f3eb]">{selectedOrderDetails.createdAt}</span>
                </div>
                <div>
                  <span className="text-[#8e8b82] block text-[10px]">Preferred Delivery:</span>
                  <span className="text-[#f5f3eb]">{selectedOrderDetails.preferredDeliveryDate || 'Within 24 Hours'}</span>
                </div>
              </div>

              {/* Itemized Produce Breakdown */}
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase text-[#d4af37] font-semibold block">
                  Harvest Items
                </span>
                {selectedOrderDetails.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs font-mono p-2.5 rounded-xl bg-[#18150e]">
                    <div>
                      <div className="text-[#fcfbf7] font-bold">{item.name}</div>
                      <div className="text-[10px] text-[#8e8b82]">
                        {item.quantity} {item.unit} × ₹{item.price} • {item.farmerName}
                      </div>
                    </div>
                    <div className="text-[#fae69e] font-bold">₹{item.price * item.quantity}</div>
                  </div>
                ))}
              </div>

              {/* Price Calculation */}
              <div className="p-3.5 rounded-2xl bg-[#18150e] border border-[#d4af37]/20 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-[#aba79c]">
                  <span>Items Subtotal:</span>
                  <span>₹{selectedOrderDetails.subtotal}</span>
                </div>
                <div className="flex justify-between text-[#aba79c]">
                  <span>Direct Farm Logistics Fee:</span>
                  <span>{selectedOrderDetails.deliveryFee > 0 ? `₹${selectedOrderDetails.deliveryFee}` : 'FREE'}</span>
                </div>
                <div className="pt-2 border-t border-[#d4af37]/20 flex justify-between text-sm font-bold text-[#fae69e]">
                  <span>Total Amount Settled:</span>
                  <span>₹{selectedOrderDetails.total}</span>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="text-xs text-[#8e8b82] space-y-1 font-sans">
                <span className="font-mono text-[10px] uppercase text-[#d4af37] block font-semibold">Delivery Destination:</span>
                <p className="text-[#f5f3eb]">{selectedOrderDetails.deliveryAddress}</p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrderDetails(null)}
                  className="w-full py-3 rounded-xl bg-[#1e1910] border border-[#d4af37]/40 text-xs font-mono text-[#fae69e] hover:bg-[#282014]"
                >
                  Close Manifest
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. WRITE REVIEW MODAL */}
      {reviewModalData && (
        <WriteReviewModal
          isOpen={true}
          onClose={() => setReviewModalData(null)}
          farmerId={reviewModalData.farmerId}
          farmerName={reviewModalData.farmerName}
          produceName={reviewModalData.produceName}
        />
      )}

      {/* 8. FARMER PROFILE MODAL */}
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
    </section>
  );
};
