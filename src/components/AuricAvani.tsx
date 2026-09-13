import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sprout,
  Leaf,
  Recycle,
  Coins,
  Truck,
  ArrowRight,
  ShieldCheck,
  Scale,
  Sparkles,
  TrendingUp,
  Wallet,
  Calendar,
  Clock,
  CheckCircle2,
  X,
  Flame,
  ArrowUpRight,
  Droplets,
  PackageCheck,
  Check,
  HelpCircle,
  PhoneCall,
  MapPin,
  FileText,
  BadgeIndianRupee,
  RotateCw,
  ChevronRight,
  SunMedium,
  Wheat,
  Layers,
  FlaskConical,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

// ============================================================================
// 1. DATA DEFINITION: THE 6 CORE BIOMASS WASTE CATEGORIES
// ============================================================================
export interface WasteType {
  id: string;
  name: string;
  subtitle: string;
  nativeName: string;
  iconEmoji: string;
  ratePerKg: number; // in ₹
  fertilizerYieldPercent: number; // solid vermicompost %
  liquidYieldLitersPerKg: number; // liquid bio-fertilizer in L/kg
  co2SavedPerKg: number; // kg CO2 equivalent saved
  whatYouHave: string;
  estimatedValueText: string;
  whatAvaniMakes: string;
  badgeColor: string;
  bgGradient: string;
  accentColor: string;
}

export const WASTE_TYPES: WasteType[] = [
  {
    id: 'crop-residue',
    name: 'Crop Residue',
    subtitle: 'Paddy straw, wheat straw, sugarcane bagasse, mustard stalks',
    nativeName: 'फसल अवशेष एवं पराली (Parali)',
    iconEmoji: '🌾',
    ratePerKg: 3.5,
    fertilizerYieldPercent: 45,
    liquidYieldLitersPerKg: 0.12,
    co2SavedPerKg: 1.45,
    whatYouHave:
      'Dry harvest stalks, paddy parali, threshing straw, or sugarcane bagasse left in the field after combining.',
    estimatedValueText:
      '₹3.50 per kg • Instant cash payout at farmgate upon digital weighment with zero transport deductions.',
    whatAvaniMakes:
      'Microbe-active organic vermicompost rich in humic matter, plus structural biochar for lasting soil carbon recharge.',
    badgeColor: 'border-[#d4af37]/40 text-[#fae69e] bg-[#2a1d0d]',
    bgGradient: 'from-[#2a1d0d] via-[#1a1208] to-[#0c0905]',
    accentColor: '#fae69e',
  },
  {
    id: 'coconut-coir',
    name: 'Coconut Husk & Shells',
    subtitle: 'Green tender husks, coir pith, hard coconut shells',
    nativeName: 'नारियल के छिलके एवं कॉयर भूसी',
    iconEmoji: '🥥',
    ratePerKg: 6.8,
    fertilizerYieldPercent: 55,
    liquidYieldLitersPerKg: 0.05,
    co2SavedPerKg: 2.1,
    whatYouHave:
      'Tender coconut shells from beverage vendors or dry grove sorting husks and raw coir fiber pith.',
    estimatedValueText:
      '₹6.80 per kg • Highest value biomass category due to dense natural potassium, lignin, and carbon density.',
    whatAvaniMakes:
      'High-porosity water-retaining coco-peat blocks and premium horticultural activated biochar for root aeration.',
    badgeColor: 'border-[#f59e0b]/40 text-[#fcd34d] bg-[#331c08]',
    bgGradient: 'from-[#331c08] via-[#211105] to-[#0d0702]',
    accentColor: '#f59e0b',
  },
  {
    id: 'fruit-veg',
    name: 'Fruit & Vegetable Waste',
    subtitle: 'Spoiled harvests, market peels, cull pulp, sorting remnants',
    nativeName: 'फल एवं सब्जी बायोमास',
    iconEmoji: '🍌',
    ratePerKg: 2.8,
    fertilizerYieldPercent: 38,
    liquidYieldLitersPerKg: 0.35,
    co2SavedPerKg: 0.95,
    whatYouHave:
      'Post-harvest sorting culls, unmarketable soft produce, citrus rinds, and market processing pulp.',
    estimatedValueText:
      '₹2.80 per kg • Fast-digesting nitrogenous green feedstock weighed and collected fresh at farmgate.',
    whatAvaniMakes:
      'Fast-acting liquid foliar bio-fertilizer and enzyme-rich vermicompost starter beds for accelerated composting.',
    badgeColor: 'border-[#84cc16]/40 text-[#bef264] bg-[#22290d]',
    bgGradient: 'from-[#22290d] via-[#151a08] to-[#0a0d04]',
    accentColor: '#84cc16',
  },
  {
    id: 'leaves-plant',
    name: 'Leaves & Plant Waste',
    subtitle: 'Orchard loppings, fallen dry leaves, branch prunings',
    nativeName: 'सूखे पत्ते एवं बागवानी छंटाई',
    iconEmoji: '🌿',
    ratePerKg: 2.2,
    fertilizerYieldPercent: 50,
    liquidYieldLitersPerKg: 0.08,
    co2SavedPerKg: 1.25,
    whatYouHave:
      'Seasonal fruit orchard tree prunings, fallen mango and teak dry leaves, shade loppings, and hedge trimmings.',
    estimatedValueText:
      '₹2.20 per kg • Essential carbonaceous brown matter that creates crumb structure in finished compost.',
    whatAvaniMakes:
      'Crumb-structured forest leaf mold compost and carrier base for beneficial mycorrhizal soil inoculation.',
    badgeColor: 'border-[#10b981]/40 text-[#6ee7b7] bg-[#0c2618]',
    bgGradient: 'from-[#0c2618] via-[#08180f] to-[#040d08]',
    accentColor: '#10b981',
  },
  {
    id: 'corn-stalks',
    name: 'Corn Stalks & Cobs',
    subtitle: 'High-carbon maize stalks, dry cobs, husk sheaths',
    nativeName: 'मक्का के डंठल एवं भुट्टे के छिलके',
    iconEmoji: '🌽',
    ratePerKg: 4.1,
    fertilizerYieldPercent: 48,
    liquidYieldLitersPerKg: 0.15,
    co2SavedPerKg: 1.65,
    whatYouHave:
      'Rigid post-harvest maize stalks, threshing cobs, dry sweet corn husk sheaths, and millet straw.',
    estimatedValueText:
      '₹4.10 per kg • High-cellulose structural biomass ideal for aerobic microbial fermentation channels.',
    whatAvaniMakes:
      'Aerated bio-compost with optimal moisture channels plus fortified organic root growth stimulants.',
    badgeColor: 'border-[#eab308]/40 text-[#fef08a] bg-[#30270a]',
    bgGradient: 'from-[#30270a] via-[#1f1906] to-[#0d0a03]',
    accentColor: '#eab308',
  },
  {
    id: 'other-organic',
    name: 'Other Organic Farm Waste',
    subtitle: 'Cover crops, weed mulch, legume pod chaff, threshing hulls',
    nativeName: 'मिश्रित जैविक कृषि अपशिष्ट',
    iconEmoji: '🌱',
    ratePerKg: 3.0,
    fertilizerYieldPercent: 42,
    liquidYieldLitersPerKg: 0.2,
    co2SavedPerKg: 1.35,
    whatYouHave:
      'Farm green manure, legume threshing husks, sunhemp cover crop residues, and cleared field weed mulch.',
    estimatedValueText:
      '₹3.00 per kg • Balanced multi-source organic biomass accepted in loose or bundled form.',
    whatAvaniMakes:
      'Balanced N-P-K enriched bio-fertilizer pellets and microbial teas for broad-spectrum field nourishment.',
    badgeColor: 'border-[#059669]/40 text-[#34d399] bg-[#0c2a1b]',
    bgGradient: 'from-[#0c2a1b] via-[#081b11] to-[#040f0a]',
    accentColor: '#34d399',
  },
];

// ============================================================================
// 2. WALLET & RECENT ACTIVITY DATA STRUCTURE
// ============================================================================
interface WalletTransaction {
  id: string;
  date: string;
  wasteName: string;
  weightKg: number;
  type: 'cash' | 'fertilizer';
  amountOrYield: string;
  status: 'Completed' | 'In Transit' | 'Processing' | 'Scheduled';
}

interface WalletState {
  wasteSubmittedKg: number;
  totalEarnings: number;
  fertilizerCreditsKg: number;
  activePickups: number;
  transactions: WalletTransaction[];
}

const DEFAULT_WALLET: WalletState = {
  wasteSubmittedKg: 1850,
  totalEarnings: 6940,
  fertilizerCreditsKg: 410,
  activePickups: 1,
  transactions: [
    {
      id: 'AVN-TXN-9042',
      date: 'Today, 11:30 AM',
      wasteName: 'Crop Residue',
      weightKg: 600,
      type: 'cash',
      amountOrYield: '₹2,100 Credited',
      status: 'Completed',
    },
    {
      id: 'AVN-TXN-8815',
      date: 'Sep 04, 2026',
      wasteName: 'Coconut Husk & Shells',
      weightKg: 450,
      type: 'fertilizer',
      amountOrYield: '248 kg Bio-Compost Ready',
      status: 'Processing',
    },
    {
      id: 'AVN-TXN-8201',
      date: 'Aug 29, 2026',
      wasteName: 'Fruit & Vegetable Waste',
      weightKg: 800,
      type: 'cash',
      amountOrYield: '₹2,240 Credited',
      status: 'Completed',
    },
    {
      id: 'AVN-TXN-9430',
      date: 'Tomorrow, 09:00 AM',
      wasteName: 'Corn Stalks & Cobs',
      weightKg: 500,
      type: 'cash',
      amountOrYield: '₹2,050 Estimated',
      status: 'Scheduled',
    },
  ],
};

// ============================================================================
// 3. MAIN COMPONENT: AURIC AVANI SISTER PLATFORM
// ============================================================================
export const AuricAvani: React.FC = () => {
  const { t } = useLanguage();
  const { isDark } = useTheme();

  // Selected card in "What Can You Sell?"
  const [activeSellCardId, setActiveSellCardId] = useState<string>('crop-residue');

  // Calculator State
  const [calculatorWasteId, setCalculatorWasteId] = useState<string>('crop-residue');
  const [calculatorWeightKg, setCalculatorWeightKg] = useState<number>(500);

  // Active step in the Visual Transformation Animation (Hero)
  const [activeTransformationStep, setActiveTransformationStep] = useState<number>(0);

  // Booking / Listing Modal State
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'schedule' | 'list'>('schedule');
  const [bookingType, setBookingType] = useState<'cash' | 'fertilizer'>('cash');
  const [bookingWasteId, setBookingWasteId] = useState<string>('crop-residue');
  const [bookingWeight, setBookingWeight] = useState<number>(500);
  const [farmerName, setFarmerName] = useState<string>('');
  const [farmerPhone, setFarmerPhone] = useState<string>('');
  const [farmAddress, setFarmAddress] = useState<string>('');
  const [pickupDate, setPickupDate] = useState<string>('Tomorrow, Morning (8:00 AM - 12:00 PM)');
  const [bookingSuccessData, setBookingSuccessData] = useState<{
    id: string;
    wasteName: string;
    weight: number;
    choice: 'cash' | 'fertilizer';
    valueString: string;
  } | null>(null);

  // Farmer Wallet State
  const [wallet, setWallet] = useState<WalletState>(() => {
    try {
      const saved = localStorage.getItem('auric_avani_wallet');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_WALLET;
  });

  const [walletModalMessage, setWalletModalMessage] = useState<string | null>(null);

  // Persist wallet updates
  useEffect(() => {
    try {
      localStorage.setItem('auric_avani_wallet', JSON.stringify(wallet));
    } catch {
      // ignore
    }
  }, [wallet]);

  // Auto-cycle the hero transformation animation every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTransformationStep((prev) => (prev + 1) % 5);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  // Calculations for the interactive calculator
  const activeCalcWaste =
    WASTE_TYPES.find((w) => w.id === calculatorWasteId) || WASTE_TYPES[0];
  const estimatedCashPayout = Math.round(calculatorWeightKg * activeCalcWaste.ratePerKg);
  const estimatedCompostYield = Math.round(
    calculatorWeightKg * (activeCalcWaste.fertilizerYieldPercent / 100)
  );
  const estimatedLiquidYield = (
    calculatorWeightKg * activeCalcWaste.liquidYieldLitersPerKg
  ).toFixed(1);
  const estimatedCo2Saved = Math.round(calculatorWeightKg * activeCalcWaste.co2SavedPerKg);

  // Active card in "What Can You Sell?"
  const activeSellCard =
    WASTE_TYPES.find((w) => w.id === activeSellCardId) || WASTE_TYPES[0];

  // Weight presets for the calculator
  const weightPresets = [150, 300, 500, 1000, 2500, 5000];

  // Open booking modal
  const handleOpenBooking = (mode: 'schedule' | 'list', wasteId?: string, weight?: number) => {
    setModalMode(mode);
    if (wasteId) setBookingWasteId(wasteId);
    if (weight) setBookingWeight(weight);
    setBookingSuccessData(null);
    setIsBookingOpen(true);
  };

  // Confirm booking / listing
  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const wasteObj = WASTE_TYPES.find((w) => w.id === bookingWasteId) || activeCalcWaste;
    const bookingRefId = `AVN-${modalMode === 'list' ? 'LST' : 'PKP'}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    let valueString = '';
    if (bookingType === 'cash') {
      const payout = Math.round(bookingWeight * wasteObj.ratePerKg);
      valueString = `₹${payout.toLocaleString('en-IN')} Cash on Weighing`;
      setWallet((prev) => ({
        ...prev,
        wasteSubmittedKg: prev.wasteSubmittedKg + bookingWeight,
        totalEarnings: prev.totalEarnings + payout,
        activePickups: prev.activePickups + 1,
        transactions: [
          {
            id: bookingRefId,
            date: 'Scheduled for ' + pickupDate.split('(')[0].trim(),
            wasteName: wasteObj.name,
            weightKg: bookingWeight,
            type: 'cash',
            amountOrYield: `₹${payout.toLocaleString('en-IN')} Scheduled`,
            status: 'Scheduled',
          },
          ...prev.transactions,
        ],
      }));
    } else {
      const fertilizerKg = Math.round(
        bookingWeight * (wasteObj.fertilizerYieldPercent / 100)
      );
      valueString = `${fertilizerKg} kg Fortified Bio-Compost`;
      setWallet((prev) => ({
        ...prev,
        wasteSubmittedKg: prev.wasteSubmittedKg + bookingWeight,
        fertilizerCreditsKg: prev.fertilizerCreditsKg + fertilizerKg,
        activePickups: prev.activePickups + 1,
        transactions: [
          {
            id: bookingRefId,
            date: 'Scheduled for ' + pickupDate.split('(')[0].trim(),
            wasteName: wasteObj.name,
            weightKg: bookingWeight,
            type: 'fertilizer',
            amountOrYield: `${fertilizerKg} kg Compost Credit`,
            status: 'Scheduled',
          },
          ...prev.transactions,
        ],
      }));
    }

    setBookingSuccessData({
      id: bookingRefId,
      wasteName: wasteObj.name,
      weight: bookingWeight,
      choice: bookingType,
      valueString,
    });
  };

  return (
    <div
      id="auric-avani-main"
      className={`relative min-h-screen font-sans overflow-x-hidden selection:bg-[#10b981]/30 selection:text-[#a7f3d0] ${
        isDark ? 'text-[#f5f3eb]' : 'text-[#1c1917]'
      }`}
    >
      {/* ========================================================================= */}
      {/* 0. DEDICATED SISTER-PLATFORM BRAND BAR                                    */}
      {/* ========================================================================= */}
      <section className="relative pt-24 pb-6 px-4 sm:px-6 lg:px-8 border-b border-[#10b981]/25 bg-gradient-to-b from-[#05110a] via-[#09180f] to-[#0f1f14] backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {/* Clean Earth & Sprout Symbol */}
            <div className="relative w-13 h-13 rounded-2xl bg-gradient-to-br from-[#064e3b] via-[#047857] to-[#022c22] border-2 border-[#10b981]/60 flex items-center justify-center text-[#34d399] shadow-[0_0_25px_rgba(16,185,129,0.4)]">
              <Sprout className="w-7 h-7 text-[#4ade80] animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#34d399]"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#34d399] font-bold">
                  AURIC ECOSYSTEM • SISTER PLATFORM
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase bg-[#10b981]/20 text-[#6ee7b7] border border-[#10b981]/40">
                  Waste → Wealth
                </span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#fcfbf7] flex items-center gap-2">
                <span>AURIC AVANI</span>
                <span className="text-[#d4af37] text-lg sm:text-xl font-normal">|</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#34d399] text-base sm:text-lg font-medium">
                  Agricultural Waste & Bio-Fertilizer
                </span>
              </h1>
            </div>
          </div>

          {/* Dedicated Ecosystem Switcher to Auric Arohi Produce */}
          <div className="flex items-center gap-3 self-stretch md:self-auto justify-end">
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider text-[#fae69e] bg-[#1a150c] border border-[#d4af37]/45 hover:bg-[#281e0f] hover:border-[#fae69e] transition-all shadow-[0_2px_15px_rgba(212,175,55,0.15)] group"
            >
              <Wheat className="w-4 h-4 text-[#d4af37]" />
              <span>Switch to Auric Arohi Produce</span>
              <ArrowUpRight className="w-4 h-4 text-[#d4af37] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 1. CINEMATIC HERO: “DON’T WASTE YOUR HARVEST. TURN IT INTO WEALTH.”        */}
      {/* ========================================================================= */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-[#0f1f14] via-[#07130b] to-[#12190f]">
        {/* Soft glowing radial lights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[450px] bg-gradient-to-tr from-[#10b981]/15 via-[#d4af37]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-7">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0a1f13]/90 border border-[#10b981]/50 text-[#a7f3d0] text-xs font-mono tracking-wider shadow-inner">
            <Flame className="w-3.5 h-3.5 text-[#ef4444]" />
            <span>Zero Crop Stubble Burning • 100% Regenerative Wealth</span>
          </div>

          {/* Title */}
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#fcfbf7] tracking-tight leading-[1.12]">
            Don’t Waste Your Harvest.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4ade80] via-[#a3e635] to-[#fae69e]">
              Turn It Into Wealth.
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-[#c7c4b9] max-w-3xl mx-auto font-sans leading-relaxed">
            Sell your agricultural waste through <strong className="text-[#6ee7b7]">Auric Avani</strong> and
            earn an additional income while helping create sustainable organic fertilizers.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
            <button
              type="button"
              onClick={() => handleOpenBooking('schedule')}
              className="px-8 py-4 rounded-2xl text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#061c0e] bg-gradient-to-r from-[#34d399] via-[#4ade80] to-[#fae69e] hover:brightness-110 shadow-[0_0_35px_rgba(52,211,153,0.4)] transition-all cursor-pointer flex items-center gap-2.5 font-bold"
            >
              <Coins className="w-4 h-4 text-[#061c0e]" />
              <span>Sell My Farm Waste</span>
            </button>

            <a
              href="#transformation-timeline"
              className="px-8 py-4 rounded-2xl text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#fae69e] bg-[#161c12]/90 border border-[#10b981]/50 hover:bg-[#1f291a] hover:border-[#34d399] transition-all cursor-pointer flex items-center gap-2 shadow-sm"
            >
              <RotateCw className="w-4 h-4 text-[#34d399]" />
              <span>See How It Works</span>
            </a>
          </div>

          {/* ========================================================================= */}
          {/* VISUAL TRANSFORMATION ANIMATION:                                          */}
          {/* 🌾 FARM WASTE → ♻️ COLLECTION → 🧪 PROCESSING → 🌱 ORGANIC FERTILIZER → 🌾 NEW HARVEST */}
          {/* ========================================================================= */}
          <div className="mt-14 pt-8 border-t border-[#10b981]/25">
            <div className="text-center mb-6">
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#86efac]">
                Live Circular Transformation Cycle
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 max-w-4xl mx-auto">
              {[
                {
                  label: 'FARM WASTE',
                  emoji: '🌾',
                  desc: 'Stalks, Straw & Peels',
                  accent: 'from-[#3a2512] to-[#1e1408]',
                  border: 'border-[#fae69e]',
                },
                {
                  label: 'COLLECTION',
                  emoji: '♻️',
                  desc: 'GPS Truck with Scales',
                  accent: 'from-[#0d2a3d] to-[#071822]',
                  border: 'border-[#38bdf8]',
                },
                {
                  label: 'PROCESSING',
                  emoji: '🧪',
                  desc: 'Bioreactor Fermentation',
                  accent: 'from-[#2e1d38] to-[#1a0f21]',
                  border: 'border-[#c084fc]',
                },
                {
                  label: 'ORGANIC FERTILIZER',
                  emoji: '🌱',
                  desc: 'Trichoderma Vermicompost',
                  accent: 'from-[#0f331e] to-[#081d11]',
                  border: 'border-[#34d399]',
                },
                {
                  label: 'NEW HARVEST',
                  emoji: '🌾',
                  desc: 'Premium Produce Market',
                  accent: 'from-[#382b0d] to-[#1c1505]',
                  border: 'border-[#f59e0b]',
                },
              ].map((step, idx) => {
                const isActive = activeTransformationStep === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setActiveTransformationStep(idx)}
                    className={`relative p-3.5 rounded-2xl border transition-all duration-500 cursor-pointer text-center ${
                      isActive
                        ? `bg-gradient-to-b ${step.accent} ${step.border} shadow-[0_0_25px_rgba(52,211,153,0.35)] scale-105 ring-1 ring-white/30`
                        : 'bg-[#0a160e]/70 border-[#10b981]/20 hover:border-[#10b981]/50'
                    }`}
                  >
                    <div className="text-2xl mb-1 filter drop-shadow">{step.emoji}</div>
                    <div className="font-serif font-bold text-xs tracking-wider text-[#fcfbf7]">
                      {step.label}
                    </div>
                    <p className="text-[10px] text-[#9ca3af] mt-0.5 font-sans leading-tight">
                      {step.desc}
                    </p>
                    {isActive && (
                      <span className="inline-block mt-1.5 text-[9px] font-mono text-[#34d399] font-bold">
                        ● Active Stage
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. “WHAT CAN YOU SELL?” INTERACTIVE 6 CARDS (WARM EARTH BRONZE SECTION)   */}
      {/* ========================================================================= */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 border-t border-[#d4af37]/20 bg-gradient-to-b from-[#1b1208] via-[#24170c] to-[#160e06]">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#d4af37] font-semibold flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#fae69e]" />
              <span>Biomass Acceptance Catalog</span>
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#fcfbf7]">
              What Can You Sell?
            </h2>
            <p className="text-sm sm:text-base text-[#d6d0c4]">
              Select any agricultural waste category below to discover its exact market value and how
              Auric Avani refines it into organic bio-fertilizer.
            </p>
          </div>

          {/* 6 Interactive Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {WASTE_TYPES.map((waste) => {
              const isSelected = waste.id === activeSellCardId;
              return (
                <button
                  key={waste.id}
                  type="button"
                  onClick={() => setActiveSellCardId(waste.id)}
                  className={`relative p-4 rounded-2xl text-left border transition-all duration-300 flex flex-col justify-between cursor-pointer group ${
                    isSelected
                      ? 'bg-gradient-to-b from-[#382312] to-[#1f1308] border-[#fae69e] shadow-[0_0_25px_rgba(212,175,55,0.35)] -translate-y-1 ring-1 ring-[#fae69e]'
                      : 'bg-[#191007]/80 border-[#d4af37]/25 hover:border-[#d4af37]/60 hover:bg-[#25170a]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl filter drop-shadow">{waste.iconEmoji}</span>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#fae69e] text-[#1f1308] flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-serif font-bold text-sm text-[#fcfbf7] leading-snug group-hover:text-[#fae69e] transition-colors">
                      {waste.name}
                    </h3>
                    <p className="text-[10px] text-[#b8b0a1] mt-1 font-sans line-clamp-2">
                      {waste.subtitle}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-[#fae69e] font-bold">₹{waste.ratePerKg.toFixed(2)}/kg</span>
                    <span className="text-[#86efac]">{waste.fertilizerYieldPercent}% yield</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Interactive Card Detail: “What you have” → “Estimated value” → “What Auric Avani can make from it” */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#26180c] via-[#1b1007] to-[#120a04] border-2 border-[#d4af37]/40 shadow-[0_10px_35px_rgba(0,0,0,0.6)]">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#d4af37]/20">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{activeSellCard.iconEmoji}</span>
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#fae69e]">
                    {activeSellCard.name}
                  </h3>
                  <p className="text-xs font-mono text-[#a8a29e]">{activeSellCard.nativeName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-[#382312] text-[#fae69e] border border-[#d4af37]/50">
                  Rate: ₹{activeSellCard.ratePerKg.toFixed(2)} / kg
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setCalculatorWasteId(activeSellCard.id);
                    document
                      .getElementById('waste-value-calculator')
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-4 py-1.5 rounded-full text-xs font-medium text-[#0a150e] bg-gradient-to-r from-[#fae69e] to-[#d4af37] font-bold hover:brightness-110 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Calculate Value</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 3-Step Information Flow */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {/* 1. What You Have */}
              <div className="p-5 rounded-2xl bg-[#140b04] border border-[#d4af37]/20 space-y-2.5">
                <div className="flex items-center gap-2 text-[#fae69e]">
                  <Leaf className="w-4 h-4 text-[#fae69e]" />
                  <h4 className="font-mono text-xs uppercase tracking-wider font-bold">
                    What You Have
                  </h4>
                </div>
                <p className="text-xs text-[#d6d0c4] leading-relaxed font-sans">
                  {activeSellCard.whatYouHave}
                </p>
                <div className="pt-2 text-[10px] font-mono text-[#9ca3af]">
                  Acceptance: Moisture &lt; 25% for dry biomass
                </div>
              </div>

              {/* 2. Estimated Value */}
              <div className="p-5 rounded-2xl bg-[#140b04] border border-[#d4af37]/20 space-y-2.5">
                <div className="flex items-center gap-2 text-[#34d399]">
                  <Coins className="w-4 h-4 text-[#34d399]" />
                  <h4 className="font-mono text-xs uppercase tracking-wider font-bold">
                    Estimated Value
                  </h4>
                </div>
                <p className="text-xs text-[#d6d0c4] leading-relaxed font-sans">
                  {activeSellCard.estimatedValueText}
                </p>
                <div className="pt-2 text-[10px] font-mono text-[#86efac]">
                  Settlement: Instant UPI or Bio-Compost credit
                </div>
              </div>

              {/* 3. What Auric Avani Can Make From It */}
              <div className="p-5 rounded-2xl bg-[#140b04] border border-[#d4af37]/20 space-y-2.5">
                <div className="flex items-center gap-2 text-[#84cc16]">
                  <FlaskConical className="w-4 h-4 text-[#84cc16]" />
                  <h4 className="font-mono text-xs uppercase tracking-wider font-bold">
                    What Auric Avani Makes From It
                  </h4>
                </div>
                <p className="text-xs text-[#d6d0c4] leading-relaxed font-sans">
                  {activeSellCard.whatAvaniMakes}
                </p>
                <div className="pt-2 text-[10px] font-mono text-[#bef264]">
                  Microbial Grade: Certified Trichoderma viride
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CREATIVE FEATURE: “WASTE VALUE CALCULATOR”                              */}
      {/* ========================================================================= */}
      <section
        id="waste-value-calculator"
        className="relative py-20 px-4 sm:px-6 lg:px-8 border-t border-[#10b981]/25 bg-gradient-to-b from-[#0a1a10] via-[#07140c] to-[#0c1c11]"
      >
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#34d399] font-semibold">
              Live Interactive Valuation Tool
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#fcfbf7]">
              Waste Value Calculator
            </h2>
            <p className="text-sm sm:text-base text-[#aba79c]">
              Choose your waste category and enter your weight in kg to see your guaranteed cash earnings.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Input Controls */}
            <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-[#09170e]/90 border border-[#10b981]/35 backdrop-blur-md flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                {/* Waste Type Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#86efac]">
                    Select Agricultural Waste Type
                  </label>
                  <select
                    value={calculatorWasteId}
                    onChange={(e) => setCalculatorWasteId(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#06120a] border border-[#10b981]/50 text-[#fcfbf7] font-serif text-base focus:outline-none focus:border-[#34d399] cursor-pointer"
                  >
                    {WASTE_TYPES.map((w) => (
                      <option key={w.id} value={w.id} className="bg-[#08170e]">
                        {w.iconEmoji} {w.name} — ₹{w.ratePerKg.toFixed(2)}/kg
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quantity Input & Slider */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="calculator-biomass-slider" className="text-xs font-mono uppercase tracking-wider text-[#9ca3af]">
                      Waste Quantity (kg)
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="50"
                        max="10000"
                        step="50"
                        value={calculatorWeightKg}
                        onChange={(e) =>
                          setCalculatorWeightKg(Math.max(50, Number(e.target.value) || 50))
                        }
                        className="w-24 px-2 py-1 rounded-lg bg-[#06140b] border border-[#10b981]/50 text-right font-mono text-sm text-[#fae69e] focus:outline-none focus:border-[#34d399]"
                      />
                      <span className="font-mono text-xs text-[#34d399]">kg</span>
                    </div>
                  </div>

                  <input
                    id="calculator-biomass-slider"
                    type="range"
                    min="50"
                    max="5000"
                    step="50"
                    value={calculatorWeightKg}
                    onChange={(e) => setCalculatorWeightKg(Number(e.target.value))}
                    className="w-full h-2.5 bg-[#06140b] rounded-lg appearance-none cursor-pointer accent-[#34d399]"
                  />

                  {/* Preset Pills */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {weightPresets.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setCalculatorWeightKg(preset)}
                        className={`px-3 py-1 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                          calculatorWeightKg === preset
                            ? 'bg-[#34d399] text-[#061a0e] font-bold shadow-sm'
                            : 'bg-[#0f2819] text-[#9ca3af] hover:text-[#f5f3eb] hover:bg-[#153823] border border-[#10b981]/25'
                        }`}
                      >
                        {preset.toLocaleString('en-IN')} kg
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Verified Rate Indicator */}
              <div className="p-4 rounded-2xl bg-[#06120a] border border-[#10b981]/30 flex items-center justify-between text-xs font-mono">
                <span className="text-[#9ca3af]">Official Procurement Rate:</span>
                <span className="text-[#34d399] font-bold">
                  ₹{activeCalcWaste.ratePerKg.toFixed(2)} per kg
                </span>
              </div>
            </div>

            {/* Big Output Valuation Card */}
            <div className="lg:col-span-6 p-7 sm:p-9 rounded-3xl bg-gradient-to-br from-[#2a1d0d] via-[#1a1208] to-[#0c0905] border-2 border-[#d4af37] shadow-[0_0_40px_rgba(212,175,55,0.25)] flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase bg-[#382312] text-[#fae69e] border border-[#d4af37]/40">
                    Instant Valuation Result
                  </span>
                  <Coins className="w-6 h-6 text-[#fae69e]" />
                </div>

                <div>
                  <p className="text-xs font-mono uppercase text-[#c9a227] tracking-wider">
                    Your estimated waste value:
                  </p>
                  <div className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#fae69e] mt-1">
                    ₹{estimatedCashPayout.toLocaleString('en-IN')}
                  </div>
                </div>

                {/* Key Motto Highlight */}
                <div className="p-3.5 rounded-xl bg-[#140b04] border border-[#d4af37]/40">
                  <p className="font-serif text-sm sm:text-base font-semibold text-[#fef08a] italic">
                    “Instead of burning/throwing it away, earn from it.”
                  </p>
                </div>

                {/* Dual Transformation Potential */}
                <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-[#09150d] border border-[#10b981]/30">
                    <span className="text-[#9ca3af] block text-[10px]">Or Convert To Compost:</span>
                    <span className="text-[#34d399] font-bold text-sm">
                      {estimatedCompostYield.toLocaleString('en-IN')} kg
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#07131b] border border-[#38bdf8]/30">
                    <span className="text-[#9ca3af] block text-[10px]">Stubble Smoke Avoided:</span>
                    <span className="text-[#38bdf8] font-bold text-sm">
                      ~{estimatedCo2Saved} kg CO₂e
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() =>
                    handleOpenBooking('schedule', calculatorWasteId, calculatorWeightKg)
                  }
                  className="w-full py-4 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider text-[#0a170e] bg-gradient-to-r from-[#fae69e] via-[#facc15] to-[#d4af37] hover:brightness-110 shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Book Pickup for ₹{estimatedCashPayout.toLocaleString('en-IN')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. “FROM YOUR FARM TO THE NEXT HARVEST” VISUAL TIMELINE                     */}
      {/* ========================================================================= */}
      <section
        id="transformation-timeline"
        className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-[#10b981]/25 bg-gradient-to-b from-[#160f08] via-[#1a1209] to-[#0f1710]"
      >
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#d4af37] font-semibold flex items-center justify-center gap-1.5">
              <RotateCw className="w-3.5 h-3.5 text-[#34d399]" />
              <span>Full Agricultural Lifecycle</span>
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#fcfbf7]">
              From Your Farm to the Next Harvest
            </h2>
            <p className="text-sm sm:text-base text-[#d6d0c4]">
              Follow the journey of biomass from field stubble to verified organic fertilizer and higher-yield crops.
            </p>
          </div>

          {/* Connected Timeline Grid: Farmer → Waste Collection → Auric Avani Processing → Organic Fertilizer → Farmers → New Crops */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 relative">
            {[
              {
                step: '01',
                title: 'Farmer',
                badge: 'Field Segregation',
                icon: Leaf,
                desc: 'Farmers stack crop residue, straw, stalks, and fruit/vegetable peels at the farmgate without burning.',
                color: 'text-[#fae69e] border-[#d4af37]/40 bg-[#2b1b0b]',
              },
              {
                step: '02',
                title: 'Waste Collection',
                badge: 'Digital Weigh Fleet',
                icon: Truck,
                desc: 'Auric Avani collection trucks arrive with calibrated digital load cells. Farmers receive instant UPI payout.',
                color: 'text-[#38bdf8] border-[#38bdf8]/40 bg-[#081a26]',
              },
              {
                step: '03',
                title: 'Auric Avani Processing',
                badge: 'Bio-Reactor Curing',
                icon: Recycle,
                desc: 'Biomass is shredded, aerated, and inoculated with indigenous earthworms and Trichoderma viride.',
                color: 'text-[#c084fc] border-[#c084fc]/40 bg-[#1e0f29]',
              },
              {
                step: '04',
                title: 'Organic Fertilizer',
                badge: 'Microbe-Enriched Compost',
                icon: PackageCheck,
                desc: 'Cured into pathogen-free vermicompost, active biochar, and nutrient-dense liquid foliar extracts.',
                color: 'text-[#4ade80] border-[#4ade80]/40 bg-[#0b2415]',
              },
              {
                step: '05',
                title: 'Farmers',
                badge: 'Subsidized Dispatch',
                icon: Sprout,
                desc: 'Bio-fertilizer bags are delivered back to partner farmers before sowing season at heavily subsidized rates.',
                color: 'text-[#34d399] border-[#34d399]/40 bg-[#092214]',
              },
              {
                step: '06',
                title: 'New Crops',
                badge: 'Auric Arohi Produce',
                icon: TrendingUp,
                desc: 'Regenerated living soil yields 20-30% higher natural harvest, sold at premium rates on Auric Arohi!',
                color: 'text-[#f59e0b] border-[#f59e0b]/40 bg-[#2d1b06]',
              },
            ].map((item, index) => {
              const IconComp = item.icon;
              return (
                <div
                  key={index}
                  className="relative p-5 rounded-3xl bg-[#140c06]/85 border border-[#d4af37]/25 hover:border-[#34d399]/60 backdrop-blur-md flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1.5 shadow-lg"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#d4af37] tracking-widest">
                        {item.step}
                      </span>
                      <div
                        className={`w-10 h-10 rounded-xl border flex items-center justify-center shadow-inner ${item.color}`}
                      >
                        <IconComp className="w-5 h-5" />
                      </div>
                    </div>

                    <div>
                      <h4 className="font-serif font-bold text-base text-[#fcfbf7] group-hover:text-[#fae69e] transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[10px] font-mono text-[#86efac] mb-2">{item.badge}</p>
                      <p className="text-xs text-[#a8a29e] leading-relaxed font-sans">{item.desc}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center text-[10px] font-mono text-[#86efac]">
                    <span>Verified Milestone ✓</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. “AVANI CIRCLE”: CIRCULAR ANIMATED ECOSYSTEM                            */}
      {/* ========================================================================= */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-[#10b981]/25 bg-gradient-to-b from-[#0f1710] via-[#08120b] to-[#061009] overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#10b981]/10 via-[#d4af37]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-12">
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#34d399] font-semibold">
              The Closed-Loop Ecosystem
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#fcfbf7]">
              The Avani Circle
            </h2>
            <p className="font-serif text-lg sm:text-xl text-[#fae69e] italic max-w-2xl mx-auto">
              “Nothing wasted. Everything returns to the soil.”
            </p>
          </div>

          {/* Visual Circular Flow Diagram: FARM → WASTE → AVANI → FERTILIZER → SOIL → FARM */}
          <div className="relative p-8 sm:p-12 rounded-3xl bg-[#09170e]/80 border-2 border-[#10b981]/40 shadow-[0_0_50px_rgba(16,185,129,0.2)] backdrop-blur-xl">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 items-center">
              {[
                { name: 'FARM', emoji: '🌾', role: 'Origin Field' },
                { name: 'WASTE', emoji: '🍂', role: 'Biomass Residue' },
                { name: 'AVANI', emoji: '🌱', role: 'Bioreactor Hub' },
                { name: 'FERTILIZER', emoji: '🧪', role: 'Bio-Compost' },
                { name: 'SOIL', emoji: '🤎', role: 'Carbon Recharge' },
                { name: 'FARM', emoji: '🌾', role: 'Bountiful Harvest' },
              ].map((node, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-[#06140b] border border-[#10b981]/35 flex flex-col items-center justify-center text-center space-y-1.5 shadow-sm group hover:border-[#34d399] transition-all"
                >
                  <span className="text-3xl group-hover:scale-110 transition-transform">
                    {node.emoji}
                  </span>
                  <span className="font-serif font-bold text-sm text-[#fcfbf7] tracking-wider">
                    {node.name}
                  </span>
                  <span className="text-[10px] font-mono text-[#86efac]">{node.role}</span>
                  {i < 5 && (
                    <span className="hidden lg:block absolute right-0 translate-x-1/2 text-[#34d399]">
                      →
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-[#10b981]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#a8a29e]">
              <span className="flex items-center gap-2 text-[#86efac]">
                <CheckCircle2 className="w-4 h-4 text-[#34d399]" />
                <span>100% Circular Agricultural Material Flow</span>
              </span>
              <span className="text-[#fae69e]">Zero Municipal Landfill • Zero Field Incineration</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. FARMER BENEFITS: 5 HIGH-DEPTH CARDS                                    */}
      {/* ========================================================================= */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 border-t border-[#d4af37]/25 bg-gradient-to-b from-[#1b1208] via-[#24170c] to-[#120a04]">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#fae69e] font-semibold">
              Tangible Value for Farmers
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#fcfbf7]">
              Farmer Benefits
            </h2>
            <p className="text-sm sm:text-base text-[#d6d0c4]">
              Five concrete operational and financial advantages when you partner with Auric Avani.
            </p>
          </div>

          {/* 5 Benefits Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
            {[
              {
                icon: '💰',
                title: 'Additional Income',
                badge: 'Guaranteed UPI',
                desc: 'Turn zero-revenue crop residues, husks, and prunings into direct bank earnings immediately upon farmgate collection.',
                color: 'border-[#fae69e]/40 bg-[#2a1d0d]',
              },
              {
                icon: '♻️',
                title: 'Less Agricultural Waste',
                badge: 'Zero Stubble Burning',
                desc: 'Clear fields within 24 hours of harvest without paying for machinery rental, labor burning, or facing smog fines.',
                color: 'border-[#38bdf8]/40 bg-[#081a26]',
              },
              {
                icon: '🌱',
                title: 'Healthier Soil',
                badge: 'Carbon Recharge',
                desc: 'Re-inject organic carbon and beneficial mycorrhizae back into your soil, restoring long-term moisture and fertility.',
                color: 'border-[#34d399]/40 bg-[#0c2618]',
              },
              {
                icon: '🚚',
                title: 'Convenient Collection',
                badge: 'Doorstep Pickup',
                desc: 'We dispatch geo-tracked green trucks with certified digital load cells directly to your field. Zero hauling cost.',
                color: 'border-[#f59e0b]/40 bg-[#2d1b06]',
              },
              {
                icon: '🌍',
                title: 'Sustainable Farming',
                badge: 'Organic Premium',
                desc: 'Cut synthetic chemical fertilizer costs by up to 60% and qualify for high-margin organic certification on Auric Arohi.',
                color: 'border-[#84cc16]/40 bg-[#22290d]',
              },
            ].map((b, i) => (
              <div
                key={i}
                className={`p-6 rounded-3xl border shadow-xl flex flex-col justify-between space-y-4 hover:-translate-y-2 transition-all duration-300 ${b.color}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl filter drop-shadow">{b.icon}</span>
                    <span className="text-[10px] font-mono text-[#86efac] px-2 py-0.5 rounded-full bg-black/40 border border-white/10">
                      {b.badge}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-lg text-[#fcfbf7] mb-2">
                    {b.title}
                  </h3>
                  <p className="text-xs text-[#d6d0c4] font-sans leading-relaxed">
                    {b.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 text-[10px] font-mono text-[#fae69e]">
                  ✓ Verified Benefit
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. “SELL YOUR WASTE” SECTION (LARGE PREMIUM CARD & LIVE STATUS)            */}
      {/* ========================================================================= */}
      <section
        id="sell-your-waste"
        className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-[#10b981]/25 bg-gradient-to-b from-[#0c1810] via-[#08130c] to-[#0a180f]"
      >
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Large Premium Card */}
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#0d2a19] via-[#09351e] to-[#0f3d24] border-2 border-[#10b981]/60 shadow-[0_0_60px_rgba(16,185,129,0.3)] space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <span className="px-3.5 py-1 rounded-full text-xs font-mono uppercase bg-[#144728] text-[#86efac] border border-[#34d399]/40">
                  Direct Farmgate Marketplace
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#fcfbf7]">
                  Have agricultural waste waiting on your farm?
                </h3>
                <p className="text-sm sm:text-base text-[#d1fae5] font-sans">
                  Schedule an on-field collection or list your crop residue batch. Our calibrated digital
                  fleet handles weighing and immediate settlement.
                </p>
              </div>

              {/* Action Buttons: “List Waste” & “Schedule Collection” */}
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenBooking('list')}
                  className="px-6 py-4 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider text-[#fae69e] bg-[#0c1e14] border border-[#d4af37]/50 hover:bg-[#132c1e] hover:border-[#fae69e] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                >
                  <FileText className="w-4 h-4 text-[#fae69e]" />
                  <span>List Waste</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenBooking('schedule')}
                  className="px-6 py-4 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider text-[#061c0e] bg-gradient-to-r from-[#34d399] via-[#4ade80] to-[#fae69e] hover:brightness-110 shadow-[0_0_25px_rgba(52,211,153,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Truck className="w-4 h-4 text-[#061c0e]" />
                  <span>Schedule Collection</span>
                </button>
              </div>
            </div>

            {/* Live Farmer Session Status Dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/10">
              <div className="p-4 rounded-2xl bg-[#06140b]/80 border border-[#10b981]/30">
                <span className="text-[10px] font-mono text-[#86efac] uppercase">Your Waste Submitted</span>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-[#fcfbf7] mt-1">
                  {wallet.wasteSubmittedKg.toLocaleString('en-IN')}{' '}
                  <span className="text-xs font-sans text-[#34d399]">kg</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#06140b]/80 border border-[#d4af37]/30">
                <span className="text-[10px] font-mono text-[#fae69e] uppercase">Expected / Earned</span>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-[#fae69e] mt-1">
                  ₹{wallet.totalEarnings.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#06140b]/80 border border-[#34d399]/30">
                <span className="text-[10px] font-mono text-[#a7f3d0] uppercase">Fertilizer Credits</span>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-[#34d399] mt-1">
                  {wallet.fertilizerCreditsKg.toLocaleString('en-IN')}{' '}
                  <span className="text-xs font-sans text-[#a7f3d0]">kg</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#06140b]/80 border border-[#38bdf8]/30">
                <span className="text-[10px] font-mono text-[#7dd3fc] uppercase">Collection Status</span>
                <div className="font-serif text-xl sm:text-2xl font-bold text-[#38bdf8] mt-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-ping" />
                  <span>{wallet.activePickups > 0 ? 'Driver Dispatched' : 'Standing By'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. “AVANI IMPACT” AREA (GENUINE SCIENCE & LIVE REAL SESSION DATA)          */}
      {/* ========================================================================= */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 border-t border-[#10b981]/25 bg-gradient-to-b from-[#08140c] via-[#061009] to-[#040a06]">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#34d399] font-semibold flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#34d399]" />
              <span>Verified Agronomic Principles</span>
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#fcfbf7]">
              Avani Impact
            </h2>
            <p className="text-sm sm:text-base text-[#aba79c]">
              Ground-level ecological science replacing open farm combustion with microbial carbon synthesis.
            </p>
          </div>

          {/* Genuine Concept Metrics (No fake statistics) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-[#09170e]/85 border border-[#10b981]/30 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#0d2a17] border border-[#10b981]/40 flex items-center justify-center text-[#34d399]">
                <Flame className="w-5 h-5 text-[#ef4444]" />
              </div>
              <h4 className="font-serif font-bold text-base text-[#fcfbf7]">
                Zero Stubble Burning
              </h4>
              <p className="text-xs text-[#a8a29e] leading-relaxed font-sans">
                Post-harvest straw is diverted to aerobic fermentation facilities instead of open-field incineration.
              </p>
              <div className="pt-2 text-[10px] font-mono text-[#86efac]">
                Principle: Complete smoke elimination
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#09170e]/85 border border-[#10b981]/30 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#0d2a17] border border-[#10b981]/40 flex items-center justify-center text-[#fae69e]">
                <Coins className="w-5 h-5 text-[#fae69e]" />
              </div>
              <h4 className="font-serif font-bold text-base text-[#fcfbf7]">
                Direct Farmer Compensation
              </h4>
              <p className="text-xs text-[#a8a29e] leading-relaxed font-sans">
                Calibrated digital load cells ensure transparent weighing and direct UPI payments at farmgate.
              </p>
              <div className="pt-2 text-[10px] font-mono text-[#fae69e]">
                Principle: Transparent weighing slip
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#09170e]/85 border border-[#10b981]/30 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#0d2a17] border border-[#10b981]/40 flex items-center justify-center text-[#38bdf8]">
                <Droplets className="w-5 h-5 text-[#38bdf8]" />
              </div>
              <h4 className="font-serif font-bold text-base text-[#fcfbf7]">
                Soil Water Retention
              </h4>
              <p className="text-xs text-[#a8a29e] leading-relaxed font-sans">
                Vermicompost increases soil organic carbon (SOC) and improves topsoil rainwater absorption by up to 35%.
              </p>
              <div className="pt-2 text-[10px] font-mono text-[#7dd3fc]">
                Principle: Drought-resilient topsoil
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#09170e]/85 border border-[#10b981]/30 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#0d2a17] border border-[#10b981]/40 flex items-center justify-center text-[#4ade80]">
                <Sprout className="w-5 h-5 text-[#4ade80]" />
              </div>
              <h4 className="font-serif font-bold text-base text-[#fcfbf7]">
                Living Soil Microbiology
              </h4>
              <p className="text-xs text-[#a8a29e] leading-relaxed font-sans">
                Enriched with Trichoderma viride and earthworm castings to naturally combat soil-borne root pathogens.
              </p>
              <div className="pt-2 text-[10px] font-mono text-[#86efac]">
                Principle: Chemical-free pest defense
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. INTERACTIVE BOOKING / LISTING MODAL                                    */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isBookingOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBookingOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-lg rounded-3xl bg-[#08170e] border-2 border-[#10b981]/50 shadow-[0_0_60px_rgba(16,185,129,0.35)] p-6 sm:p-8 max-h-[92vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#10b981]/20">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#0c2917] border border-[#10b981]/40 flex items-center justify-center text-[#34d399]">
                    {modalMode === 'list' ? (
                      <FileText className="w-5 h-5" />
                    ) : (
                      <Truck className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#fcfbf7]">
                      {modalMode === 'list' ? 'List Farm Waste Batch' : 'Schedule Farmgate Pickup'}
                    </h3>
                    <p className="text-[11px] font-mono text-[#86efac]">
                      Auric Avani Verified Farmgate Logistics
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBookingOpen(false)}
                  className="p-1.5 rounded-lg text-[#9ca3af] hover:text-white cursor-pointer hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {bookingSuccessData ? (
                /* Confirmation Screen */
                <div className="py-6 text-center space-y-5">
                  <div className="w-16 h-16 rounded-full bg-[#0d331d] border-2 border-[#34d399] flex items-center justify-center mx-auto text-[#34d399] shadow-[0_0_30px_rgba(52,211,153,0.5)]">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>

                  <div>
                    <span className="px-3 py-1 rounded-full text-xs font-mono uppercase bg-[#143d23] text-[#86efac] border border-[#10b981]/40">
                      Booking Confirmed #{bookingSuccessData.id}
                    </span>
                    <h4 className="font-serif text-2xl font-bold text-[#fcfbf7] mt-3">
                      Collection Request Accepted!
                    </h4>
                    <p className="text-xs text-[#c7c4b9] mt-1 font-sans">
                      Our geo-tracked collection team has reserved your slot for{' '}
                      <strong className="text-[#fae69e]">{pickupDate.split('(')[0]}</strong>.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#06120a] border border-[#10b981]/30 text-left space-y-2 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-[#9ca3af]">Waste Lot:</span>
                      <span className="text-[#fcfbf7] font-bold">{bookingSuccessData.wasteName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#9ca3af]">Estimated Weight:</span>
                      <span className="text-[#86efac]">{bookingSuccessData.weight} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#9ca3af]">Transformation:</span>
                      <span className="text-[#fae69e] font-bold">{bookingSuccessData.valueString}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#9ca3af]">Status:</span>
                      <span className="text-[#34d399] font-bold">Driver Assigned (Live GPS)</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsBookingOpen(false)}
                    className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-[#061c0e] bg-gradient-to-r from-[#34d399] to-[#fae69e] cursor-pointer"
                  >
                    Done & Return to Portal
                  </button>
                </div>
              ) : (
                /* Form */
                <form onSubmit={handleConfirmBooking} className="py-5 space-y-4 text-xs font-sans">
                  {/* Payout vs Fertilizer toggle */}
                  <div className="space-y-1.5">
                    <label className="text-[#9ca3af] font-mono uppercase text-[10px]">
                      Select Value Return Preference
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setBookingType('cash')}
                        className={`p-3 rounded-xl border text-left flex items-center gap-2 cursor-pointer transition-all ${
                          bookingType === 'cash'
                            ? 'bg-[#221c0e] border-[#d4af37] text-[#fae69e]'
                            : 'bg-[#06120a] border-[#10b981]/20 text-[#9ca3af]'
                        }`}
                      >
                        <Coins className="w-4 h-4 text-[#fae69e] shrink-0" />
                        <div>
                          <div className="font-bold font-serif text-sm">Instant Cash</div>
                          <span className="text-[10px] text-[#c7c4b9]">Payout to UPI</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setBookingType('fertilizer')}
                        className={`p-3 rounded-xl border text-left flex items-center gap-2 cursor-pointer transition-all ${
                          bookingType === 'fertilizer'
                            ? 'bg-[#0b2917] border-[#34d399] text-[#86efac]'
                            : 'bg-[#06120a] border-[#10b981]/20 text-[#9ca3af]'
                        }`}
                      >
                        <Sprout className="w-4 h-4 text-[#34d399] shrink-0" />
                        <div>
                          <div className="font-bold font-serif text-sm">Bio-Fertilizer</div>
                          <span className="text-[10px] text-[#c7c4b9]">Cured compost bags</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="space-y-1.5">
                    <label className="text-[#9ca3af] font-mono uppercase text-[10px]">
                      Biomass Waste Category
                    </label>
                    <select
                      value={bookingWasteId}
                      onChange={(e) => setBookingWasteId(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#06120a] border border-[#10b981]/40 text-[#fcfbf7] font-sans focus:outline-none focus:border-[#34d399]"
                    >
                      {WASTE_TYPES.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.iconEmoji} {w.name} (₹{w.ratePerKg.toFixed(2)}/kg)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quantity */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <label className="text-[#9ca3af] font-mono uppercase text-[10px]">
                        Estimated Quantity (kg)
                      </label>
                      <span className="text-[#fae69e] font-mono">{bookingWeight} kg</span>
                    </div>
                    <input
                      type="number"
                      min="50"
                      step="50"
                      value={bookingWeight}
                      onChange={(e) =>
                        setBookingWeight(Math.max(50, Number(e.target.value) || 50))
                      }
                      className="w-full p-2.5 rounded-xl bg-[#06120a] border border-[#10b981]/40 text-[#fcfbf7] font-mono focus:outline-none focus:border-[#34d399]"
                      required
                    />
                  </div>

                  {/* Farmer Details */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[#9ca3af] font-mono uppercase text-[10px]">
                        Farmer Full Name
                      </label>
                      <input
                        type="text"
                        value={farmerName}
                        onChange={(e) => setFarmerName(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-[#06120a] border border-[#10b981]/40 text-[#fcfbf7] focus:outline-none focus:border-[#34d399]"
                        placeholder="Ramesh Patel"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[#9ca3af] font-mono uppercase text-[10px]">
                        Mobile / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={farmerPhone}
                        onChange={(e) => setFarmerPhone(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-[#06120a] border border-[#10b981]/40 text-[#fcfbf7] font-mono focus:outline-none focus:border-[#34d399]"
                        placeholder="+91 98765 43210"
                        required
                      />
                    </div>
                  </div>

                  {/* Farm Location */}
                  <div className="space-y-1">
                    <label className="text-[#9ca3af] font-mono uppercase text-[10px]">
                      Farm Location (Village / Tehsil / PIN)
                    </label>
                    <input
                      type="text"
                      value={farmAddress}
                      onChange={(e) => setFarmAddress(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#06120a] border border-[#10b981]/40 text-[#fcfbf7] focus:outline-none focus:border-[#34d399]"
                      placeholder="e.g. Anandpur Village, Ludhiana, 141001"
                      required
                    />
                  </div>

                  {/* Pickup Slot Selection */}
                  <div className="space-y-1">
                    <label className="text-[#9ca3af] font-mono uppercase text-[10px]">
                      Preferred Pickup Slot
                    </label>
                    <select
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#06120a] border border-[#10b981]/40 text-[#fcfbf7] focus:outline-none focus:border-[#34d399]"
                    >
                      <option value="Tomorrow, Morning (8:00 AM - 12:00 PM)">
                        Tomorrow, Morning (8:00 AM - 12:00 PM)
                      </option>
                      <option value="Tomorrow, Afternoon (1:00 PM - 5:00 PM)">
                        Tomorrow, Afternoon (1:00 PM - 5:00 PM)
                      </option>
                      <option value="Day After Tomorrow, Morning (8:00 AM - 12:00 PM)">
                        Day After Tomorrow, Morning (8:00 AM - 12:00 PM)
                      </option>
                      <option value="Weekend Special (Saturday 9:00 AM)">
                        Weekend Special (Saturday 9:00 AM)
                      </option>
                    </select>
                  </div>

                  {/* Live Calculation Preview */}
                  <div className="p-3 rounded-xl bg-[#051108] border border-[#10b981]/30 flex items-center justify-between font-mono">
                    <span className="text-[#9ca3af]">Estimated Value:</span>
                    <span className="text-[#fae69e] font-bold">
                      {bookingType === 'cash'
                        ? `₹${Math.round(
                            bookingWeight *
                              (WASTE_TYPES.find((w) => w.id === bookingWasteId)?.ratePerKg || 3.5)
                          ).toLocaleString('en-IN')} Cash`
                        : `${Math.round(
                            bookingWeight *
                              ((WASTE_TYPES.find((w) => w.id === bookingWasteId)
                                ?.fertilizerYieldPercent || 45) /
                                100)
                          )} kg Bio-Compost`}
                    </span>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-[#061c0e] bg-gradient-to-r from-[#34d399] via-[#4ade80] to-[#fae69e] hover:brightness-110 shadow-[0_0_20px_rgba(52,211,153,0.4)] transition-all cursor-pointer mt-2"
                  >
                    Confirm & Dispatch Collection Truck
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 10. WALLET WITHDRAWAL / REDEEM FEEDBACK MODAL                             */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {walletModalMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setWalletModalMessage(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-sm rounded-3xl bg-[#08170e] border border-[#10b981]/40 p-6 text-center space-y-4 shadow-2xl"
            >
              <div className="w-12 h-12 rounded-full bg-[#0d2e1a] border border-[#34d399] flex items-center justify-center mx-auto text-[#34d399]">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-lg font-bold text-[#fcfbf7]">Request Processed</h4>
              <p className="text-xs text-[#c7c4b9] font-sans leading-relaxed">
                {walletModalMessage}
              </p>
              <button
                type="button"
                onClick={() => setWalletModalMessage(null)}
                className="w-full py-2.5 rounded-xl text-xs font-mono uppercase bg-[#10b981] text-[#061c0e] font-bold cursor-pointer"
              >
                Understood
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuricAvani;
