import React from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  ArrowRight,
  ShoppingBag,
  Calendar,
  MapPin,
  Clock,
  ShieldCheck,
  Wheat,
  Share2,
  FileText,
  Truck,
  Sparkles,
  Tractor,
} from 'lucide-react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useOrders, Order } from '../context/OrdersContext';

/* NOTE: In the next development phase, all local/mock states (cart, orders, checkout) 
   should be replaced with real backend/database calls and payment gateways (e.g. Razorpay/Stripe). */

export const OrderConfirmedPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orders, getOrderById } = useOrders();

  const queryParams = new URLSearchParams(location.search);
  const orderIdFromQuery = queryParams.get('orderId');

  // Retrieve order from route state or context by ID
  const orderState = location.state?.order as Order | undefined;
  const order: Order | undefined =
    orderState || (orderIdFromQuery ? getOrderById(orderIdFromQuery) : orders[0]);

  if (!order) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-[#070707] flex items-center justify-center">
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#0e0d0b] border border-[#d4af37]/40 text-center space-y-4">
          <Wheat className="w-12 h-12 text-[#d4af37] mx-auto" />
          <h2 className="font-serif text-2xl font-bold text-[#fcfbf7]">No Order Found</h2>
          <p className="text-xs text-[#aba79c]">We couldn't retrieve the details for this order reference.</p>
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 py-3 px-6 rounded-xl text-xs font-bold uppercase bg-[#fae69e] text-[#0a0a0a]"
          >
            Go to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-[#070707] text-[#f5f3eb] font-sans">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] rounded-full gold-ambient-radial blur-3xl opacity-30" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto w-full">
        {/* Celebration Header with Animated Gold Checkmark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-4 mb-10"
        >
          {/* Glowing Animated Icon */}
          <div className="relative inline-flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 20 }}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-[#2a2412] to-[#12100a] border-2 border-[#fae69e] flex items-center justify-center shadow-[0_0_50px_rgba(212,175,55,0.6)]"
            >
              <CheckCircle2 className="w-12 h-12 text-[#fae69e]" />
            </motion.div>
            
            {/* Ambient Pulse Ring */}
            <div className="absolute inset-0 rounded-full bg-[#d4af37]/20 animate-ping pointer-events-none" />
          </div>

          <div>
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#fae69e] font-semibold">
              Direct Farm Order Placed
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#fcfbf7] mt-1">
              Order Placed Successfully!
            </h1>
            <p className="text-sm sm:text-base text-[#aba79c] max-w-xl mx-auto mt-2">
              Your harvest order has been queued directly with the regional farm fields.
            </p>
          </div>

          {/* Order ID Tag */}
          <div className="pt-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#18150d] border border-[#d4af37]/50 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
              <span className="text-xs font-mono text-[#8e8b82]">Order Reference:</span>
              <span className="text-xs font-mono font-bold text-[#fae69e] tracking-wider">
                {order.id}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Order Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-6 sm:p-10 rounded-3xl bg-[#0e0d0b]/90 border-2 border-[#d4af37]/35 backdrop-blur-2xl shadow-[0_0_50px_-10px_rgba(212,175,55,0.25)] space-y-8"
        >
          {/* Top Status & Estimated Harvest Time */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 border-b border-[#d4af37]/20">
            <div className="p-4 rounded-2xl bg-[#14120e] border border-[#d4af37]/20">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8e8b82] block mb-1">
                Order Status
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#34d399] bg-[#142318] px-2.5 py-1 rounded-full border border-[#34d399]/40">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" />
                {order.status}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#14120e] border border-[#d4af37]/20">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8e8b82] block mb-1">
                Target Harvest Delivery
              </span>
              <span className="text-xs font-mono font-bold text-[#fcfbf7] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                {order.preferredDeliveryDate}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#14120e] border border-[#d4af37]/20">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8e8b82] block mb-1">
                Payment Mode
              </span>
              <span className="text-xs font-mono font-bold text-[#fae69e]">
                {order.paymentMethod} (Escrow Secured)
              </span>
            </div>
          </div>

          {/* Ordered Harvest Items */}
          <div>
            <h3 className="font-serif text-lg font-bold text-[#fcfbf7] mb-4 flex items-center justify-between">
              <span>Harvested Produce Manifest</span>
              <span className="text-xs font-mono text-[#fae69e]">
                {order.items.length} {order.items.length === 1 ? 'Produce item' : 'Produce items'}
              </span>
            </h3>

            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#12110c] border border-[#d4af37]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-xl overflow-hidden border border-[#d4af37]/25 shrink-0 bg-[#0a0a0a]">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-serif text-sm font-semibold text-[#fcfbf7]">
                        {item.name}
                      </h4>
                      <p className="text-xs text-[#aba79c] flex items-center gap-1 mt-0.5">
                        <Tractor className="w-3 h-3 text-[#d4af37]" />
                        <span>Grower: {item.farmerName}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-[#d4af37]/15">
                    <span className="text-xs font-mono text-[#fae69e]">
                      {item.quantity} {item.unit} @ ₹{item.price}/{item.unit}
                    </span>
                    <span className="font-mono text-sm font-bold text-[#fcfbf7]">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery & Total Summary Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[#d4af37]/20">
            {/* Fulfillment Address */}
            <div className="p-4 rounded-2xl bg-[#14120e] border border-[#d4af37]/25 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#fae69e]">
                <Truck className="w-4 h-4" />
                <span>{order.deliveryMethod}</span>
              </div>
              <p className="text-xs text-[#f5f3eb] font-sans leading-relaxed">
                {order.deliveryAddress}
              </p>
              <p className="text-[11px] font-mono text-[#8e8b82]">
                Recipient: {order.customerName} ({order.customerPhone})
              </p>
            </div>

            {/* Price Calculations */}
            <div className="p-4 rounded-2xl bg-[#14120e] border border-[#d4af37]/25 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-[#aba79c]">
                <span>Produce Value</span>
                <span className="text-[#fcfbf7]">₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between text-[#aba79c]">
                <span>Direct Cold Chain Delivery</span>
                <span className={order.deliveryFee === 0 ? 'text-[#34d399]' : 'text-[#fcfbf7]'}>
                  {order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}
                </span>
              </div>
              <div className="pt-2 border-t border-[#d4af37]/20 flex justify-between items-center text-sm font-bold">
                <span className="font-serif text-[#fcfbf7]">Total Billed</span>
                <span className="text-base text-[#fae69e]">₹{order.total}</span>
              </div>
            </div>
          </div>

          {/* Trust Banner */}
          <div className="p-4 rounded-2xl bg-[#18150d] border border-[#d4af37]/40 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#34d399] shrink-0 mt-0.5" />
            <div className="text-xs text-[#aba79c]">
              <strong className="text-[#fcfbf7] font-sans block">Sub-24hr Field Freshness Guarantee</strong>
              The grower picks these crops in the dawn hours before departure. If freshness doesn't match the AI Inspection certificate, 100% refund is guaranteed through Escrow.
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <Link
              to="/customer-dashboard"
              id="order-confirmed-track-order-btn"
              className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#b89120] text-[#0a0a0a] font-serif font-bold text-sm uppercase tracking-wider hover:brightness-110 active:scale-[0.99] transition-all shadow-[0_0_30px_rgba(212,175,55,0.4)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Track Order in Dashboard</span>
              <ArrowRight className="w-4 h-4 text-[#0a0a0a]" />
            </Link>

            <Link
              to="/marketplace"
              id="order-confirmed-continue-shopping-btn"
              className="flex-1 py-4 px-6 rounded-2xl bg-[#14120e] border border-[#d4af37]/45 text-[#fae69e] font-mono font-medium text-xs uppercase tracking-wider hover:bg-[#1a1710] hover:border-[#d4af37] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
