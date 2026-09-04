import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingCart,
  Calendar,
  Sparkles,
  CheckCircle2,
  Plus,
  Minus,
  Trash2,
  X,
  ArrowRight,
  RotateCcw,
  TrendingUp,
  BookmarkCheck,
  Check,
  Package,
  Layers,
  Search,
} from 'lucide-react';
import { useProduce, ProduceListing } from '../context/ProduceContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { getProduceImage } from '../utils/produceImages';

export interface SmartRoutineItem {
  productId: string;
  name: string;
  category: string;
  farmerName: string;
  farmerId: string;
  price: number;
  unit: string;
  quantity: number;
  frequency: 'Daily' | 'Weekly' | 'Biweekly';
}

export interface SmartRoutine {
  id: string;
  name: string;
  cadence: 'Daily' | 'Weekly' | 'Custom';
  items: SmartRoutineItem[];
  savedAt: string;
}

interface SmartCartBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SmartCartBuilderModal: React.FC<SmartCartBuilderModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { listings } = useProduce();
  const { addToCart } = useCart();
  const { t } = useLanguage();

  // Wizard Steps: 1 (Cadence) -> 2 (Categories & Products) -> 3 (Review & Basket)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [routineCadence, setRoutineCadence] = useState<'Daily' | 'Weekly' | 'Custom'>('Weekly');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected routine items in current edit session
  const [basketItems, setBasketItems] = useState<SmartRoutineItem[]>([]);

  // Saved routine from local storage
  const [savedRoutine, setSavedRoutine] = useState<SmartRoutine | null>(null);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<boolean>(false);
  const [addAllSuccessNotice, setAddAllSuccessNotice] = useState<boolean>(false);

  // Load saved routine on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('auric_saved_smart_routine');
      if (stored) {
        const parsed = JSON.parse(stored);
        setSavedRoutine(parsed);
        if (parsed.items && parsed.items.length > 0) {
          setBasketItems(parsed.items);
          setRoutineCadence(parsed.cadence || 'Weekly');
        }
      }
    } catch (e) {
      console.warn('Could not load smart routine:', e);
    }
  }, [isOpen]);

  // Categories list
  const categories = useMemo(() => {
    const cats = Array.from(new Set(listings.map((l) => l.category))).filter(Boolean);
    return ['All', ...cats];
  }, [listings]);

  // Filtered available products from PostgreSQL
  const availableProduce = useMemo(() => {
    return listings.filter((item) => {
      const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.farmerName.toLowerCase().includes(searchQuery.toLowerCase());
      const isAvailable = item.status === 'Active' && Number(item.quantity) > 0;
      return matchesCat && matchesSearch && isAvailable;
    });
  }, [listings, selectedCategory, searchQuery]);

  // Smart Real-Data Recommendations
  const smartRecommendations = useMemo(() => {
    // Recommend top seasonal items from real database that are not yet in the basket
    const basketIds = new Set(basketItems.map((b) => b.productId));
    const recs: Array<{
      produce: ProduceListing;
      reason: string;
      badge: string;
    }> = [];

    listings.forEach((item) => {
      if (basketIds.has(item.id) || item.status !== 'Active' || Number(item.quantity) <= 0) {
        return;
      }

      const nameLower = item.name.toLowerCase();
      if (nameLower.includes('mango') || nameLower.includes('pomegranate') || nameLower.includes('dragon')) {
        recs.push({
          produce: item,
          reason: 'Peak dawn season harvest with high demand',
          badge: '🌟 Seasonal Harvest',
        });
      } else if (nameLower.includes('onion') || nameLower.includes('potato') || nameLower.includes('tomato')) {
        recs.push({
          produce: item,
          reason: 'Essential staple recommended for weekly kitchen needs',
          badge: '🍳 Kitchen Essential',
        });
      } else if (String(item.category).toLowerCase().includes('pulse') || String(item.category).toLowerCase().includes('organic')) {
        recs.push({
          produce: item,
          reason: 'Unpolished chemical-free staple directly from source farm',
          badge: '🌾 Unpolished Dal',
        });
      }
    });

    return recs.slice(0, 4);
  }, [listings, basketItems]);

  // Add / Increment product in basket
  const handleAddOrIncrement = (produce: ProduceListing) => {
    setBasketItems((prev) => {
      const existing = prev.find((it) => it.productId === produce.id);
      if (existing) {
        return prev.map((it) =>
          it.productId === produce.id
            ? { ...it, quantity: Math.min(it.quantity + 1, Number(produce.quantity)) }
            : it
        );
      }
      return [
        ...prev,
        {
          productId: produce.id,
          name: produce.name,
          category: produce.category,
          farmerName: produce.farmerName,
          farmerId: produce.farmerId || 'AV-FARM-1001',
          price: Number(produce.pricePerUnit),
          unit: produce.unit,
          quantity: 1,
          frequency: routineCadence === 'Daily' ? 'Daily' : 'Weekly',
        },
      ];
    });
  };

  // Decrement or Remove product in basket
  const handleDecrement = (productId: string) => {
    setBasketItems((prev) => {
      const existing = prev.find((it) => it.productId === productId);
      if (!existing) return prev;
      if (existing.quantity <= 1) {
        return prev.filter((it) => it.productId !== productId);
      }
      return prev.map((it) =>
        it.productId === productId ? { ...it, quantity: it.quantity - 1 } : it
      );
    });
  };

  // Remove completely
  const handleRemove = (productId: string) => {
    setBasketItems((prev) => prev.filter((it) => it.productId !== productId));
  };

  // Total estimated price of basket
  const basketTotal = useMemo(() => {
    return basketItems.reduce((acc, it) => acc + it.price * it.quantity, 0);
  }, [basketItems]);

  // Distinct farmers in the basket
  const distinctFarmers = useMemo(() => {
    const map = new Map<string, string>();
    basketItems.forEach((it) => {
      map.set(it.farmerName, it.farmerId);
    });
    return Array.from(map.entries()).map(([name, id]) => ({ name, id }));
  }, [basketItems]);

  // Save routine
  const handleSaveRoutine = () => {
    const routine: SmartRoutine = {
      id: `routine-${Date.now()}`,
      name: `My ${routineCadence} Produce Basket`,
      cadence: routineCadence,
      items: basketItems,
      savedAt: new Date().toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };
    try {
      localStorage.setItem('auric_saved_smart_routine', JSON.stringify(routine));
      setSavedRoutine(routine);
      setSaveSuccessNotice(true);
      setTimeout(() => setSaveSuccessNotice(false), 3000);
    } catch (e) {
      console.warn('Failed to save routine:', e);
    }
  };

  // Clear routine
  const handleClearRoutine = () => {
    try {
      localStorage.removeItem('auric_saved_smart_routine');
      setSavedRoutine(null);
      setBasketItems([]);
    } catch (e) {
      console.warn('Failed to clear routine:', e);
    }
  };

  // Add all basket items to real Cart
  const handleAddAllToCart = () => {
    if (basketItems.length === 0) return;

    basketItems.forEach((item) => {
      const listing = listings.find((l) => l.id === item.productId);
      const maxAvailable = listing ? Number(listing.quantity) : item.quantity;

      addToCart(
        {
          productId: item.productId,
          name: item.name,
          image: getProduceImage({ name: item.name, category: item.category }),
          price: item.price,
          unit: item.unit,
          farmerName: item.farmerName,
          farmerId: item.farmerId,
          maxAvailable,
        },
        item.quantity
      );
    });

    setAddAllSuccessNotice(true);
    setTimeout(() => {
      setAddAllSuccessNotice(false);
      onClose();
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-4xl max-h-[92vh] rounded-3xl bg-[#0e0d0b] border-2 border-[#d4af37]/50 shadow-2xl flex flex-col overflow-hidden text-[#fcfbf7] font-sans"
        >
          {/* ========================================================= */}
          {/* 1. STICKY MODAL HEADER                                    */}
          {/* ========================================================= */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-[#1a150c] via-[#12100a] to-[#0a0a0a] border-b border-[#d4af37]/30 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#241c0e] border border-[#d4af37]/60 flex items-center justify-center text-[#fae69e] shadow-[0_0_15px_rgba(212,175,55,0.3)] shrink-0">
                <Sparkles className="w-6 h-6 text-[#d4af37]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#d4af37] font-bold">
                    Personalized Produce Routine
                  </span>
                  {savedRoutine && (
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#34d399]/20 text-[#34d399] border border-[#34d399]/40 flex items-center gap-1">
                      <BookmarkCheck className="w-3 h-3" /> Saved Routine Active
                    </span>
                  )}
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#fcfbf7]">
                  Smart Cart & Weekly Basket Builder
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2.5 rounded-xl bg-[#1c180e] hover:bg-[#2c2414] border border-[#d4af37]/30 text-[#8e8b82] hover:text-[#fcfbf7] transition-all cursor-pointer"
              aria-label="Close Smart Cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ========================================================= */}
          {/* 2. STEPS BREADCRUMB INDICATOR                             */}
          {/* ========================================================= */}
          <div className="px-6 py-3 bg-[#14110b] border-b border-[#d4af37]/20 flex items-center justify-between text-xs font-mono shrink-0 overflow-x-auto no-scrollbar">
            {[
              { step: 1, label: '1. Delivery Cadence' },
              { step: 2, label: '2. Select Fresh Produce' },
              { step: 3, label: '3. Basket & Recommendations' },
            ].map((s) => (
              <button
                key={s.step}
                type="button"
                onClick={() => setCurrentStep(s.step)}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                  currentStep === s.step
                    ? 'bg-[#221c10] border border-[#d4af37] text-[#fae69e] font-bold'
                    : 'text-[#8e8b82] hover:text-[#fcfbf7]'
                }`}
              >
                <span>{s.label}</span>
                {s.step === 3 && basketItems.length > 0 && (
                  <span className="text-[10px] bg-[#d4af37] text-[#0a0a0a] px-1.5 py-0.2 rounded-full font-bold">
                    {basketItems.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ========================================================= */}
          {/* 3. SCROLLABLE CONTENT BODY                                */}
          {/* ========================================================= */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
            
            {/* STEP 1: CHOOSE CADENCE */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#fcfbf7]">
                    How often do you need fresh farm produce?
                  </h3>
                  <p className="text-xs sm:text-sm text-[#aba79c] mt-1">
                    Tell Auric Arohi what you normally need, and we will help build your regular farm produce basket.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    {
                      id: 'Weekly',
                      title: 'Weekly Farm Basket',
                      tag: 'Most Popular',
                      desc: 'Delivered once every week on your preferred harvest day. Perfect for family kitchens.',
                      icon: Calendar,
                    },
                    {
                      id: 'Daily',
                      title: 'Daily Dawn Harvest',
                      tag: 'Peak Freshness',
                      desc: 'Sub-24hr morning deliveries for daily greens, tender vegetables, and table fruits.',
                      icon: Sparkles,
                    },
                    {
                      id: 'Custom',
                      title: 'Custom Routine',
                      tag: 'Flexible Schedule',
                      desc: 'Order on-demand on your exact dates with zero lock-in or recurring auto-charge.',
                      icon: Layers,
                    },
                  ].map((cad) => (
                    <div
                      key={cad.id}
                      onClick={() => setRoutineCadence(cad.id as any)}
                      className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                        routineCadence === cad.id
                          ? 'bg-[#1c180e] border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.25)]'
                          : 'bg-[#12100c] border-[#d4af37]/20 hover:border-[#d4af37]/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <cad.icon className="w-6 h-6 text-[#d4af37]" />
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#241c0e] text-[#fae69e] border border-[#d4af37]/30 font-bold">
                          {cad.tag}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-lg text-[#fcfbf7]">{cad.title}</h4>
                        <p className="text-xs text-[#aba79c] mt-1 leading-relaxed">{cad.desc}</p>
                      </div>
                      <div className="pt-2 text-xs font-mono font-bold text-[#fae69e] flex items-center gap-1">
                        {routineCadence === cad.id ? '✓ Selected' : 'Tap to Select'}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#b89120] text-[#0a0a0a] font-serif font-bold text-xs sm:text-sm uppercase tracking-wider hover:brightness-110 shadow-lg flex items-center gap-2 cursor-pointer"
                  >
                    <span>Next: Select Produce Items</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: SELECT EXACT REAL PRODUCTS FROM POSTGRESQL */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#fcfbf7]">
                      Select Your Regular Farm Produce
                    </h3>
                    <p className="text-xs text-[#aba79c] mt-0.5">
                      Choose products directly from verified Indian farmers across PostgreSQL.
                    </p>
                  </div>

                  {/* Search Bar */}
                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-[#d4af37] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search produce or farmer..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#14120e] border border-[#d4af37]/30 text-xs text-[#fcfbf7] focus:outline-none focus:border-[#fae69e]"
                    />
                  </div>
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all border cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-[#221c10] border-[#d4af37] text-[#fae69e] font-bold shadow-sm'
                          : 'bg-[#14120e] border-[#d4af37]/20 text-[#8e8b82] hover:text-[#fcfbf7]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[380px] overflow-y-auto pr-1">
                  {availableProduce.map((produce) => {
                    const inBasket = basketItems.find((b) => b.productId === produce.id);
                    const qty = inBasket ? inBasket.quantity : 0;

                    return (
                      <div
                        key={produce.id}
                        className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                          qty > 0
                            ? 'bg-[#1c180e] border-[#d4af37] shadow-md'
                            : 'bg-[#12100c] border-[#d4af37]/20 hover:border-[#d4af37]/45'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={getProduceImage(produce)}
                            alt={produce.name}
                            className="w-14 h-14 rounded-xl object-cover border border-[#d4af37]/30 shrink-0"
                            loading="lazy"
                          />
                          <div className="min-w-0">
                            <h4 className="font-serif font-bold text-xs sm:text-sm text-[#fcfbf7] truncate">
                              {produce.name}
                            </h4>
                            <div className="text-[10px] font-mono text-[#8e8b82] truncate">
                              👨🌾 {produce.farmerName} • <span className="text-[#fae69e]">₹{produce.pricePerUnit}/{produce.unit}</span>
                            </div>
                          </div>
                        </div>

                        {/* Quantity Increment/Decrement Controls */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {qty > 0 ? (
                            <div className="flex items-center gap-1 bg-[#14120e] p-1 rounded-xl border border-[#d4af37]/40">
                              <button
                                type="button"
                                onClick={() => handleDecrement(produce.id)}
                                className="w-6 h-6 rounded-lg bg-[#241c0e] hover:bg-[#342812] text-[#fae69e] flex items-center justify-center cursor-pointer text-xs"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-6 text-center font-mono font-bold text-xs text-[#fae69e]">
                                {qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleAddOrIncrement(produce)}
                                className="w-6 h-6 rounded-lg bg-[#d4af37] hover:bg-[#fae69e] text-[#0a0a0a] font-bold flex items-center justify-center cursor-pointer text-xs"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleAddOrIncrement(produce)}
                              className="px-3 py-2 rounded-xl bg-[#221c10] hover:bg-[#2c2414] border border-[#d4af37]/40 text-[#fae69e] font-mono text-xs font-bold cursor-pointer flex items-center gap-1"
                            >
                              <Plus className="w-3.5 h-3.5 text-[#d4af37]" />
                              <span>Add</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-3 border-t border-[#d4af37]/20 flex items-center justify-between">
                  <span className="text-xs font-mono text-[#aba79c]">
                    {basketItems.length} products selected in routine
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    disabled={basketItems.length === 0}
                    className="px-7 py-3 rounded-2xl bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#b89120] text-[#0a0a0a] font-serif font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-lg disabled:opacity-40 flex items-center gap-2 cursor-pointer"
                  >
                    <span>View Basket & Recommendations</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: REVIEW BASKET & SMART RECOMMENDATIONS */}
            {currentStep === 3 && (
              <div className="space-y-6">
                {/* 1. Basket Summary */}
                <div className="p-5 sm:p-6 rounded-2xl bg-[#14120e] border-2 border-[#d4af37]/40 shadow-xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#d4af37]/25">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#d4af37]">
                        Custom Routine Manifest
                      </span>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#fcfbf7]">
                        My {routineCadence} Produce Basket
                      </h3>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-xs text-[#8e8b82] block">Estimated Total</span>
                      <span className="font-serif text-2xl font-bold text-[#fae69e]">₹{basketTotal}</span>
                    </div>
                  </div>

                  {/* Multi-Farmer Origin Tags */}
                  <div className="flex items-center gap-2 flex-wrap text-xs font-mono text-[#8e8b82]">
                    <span>Fulfillment Sources:</span>
                    {distinctFarmers.map((f) => (
                      <span
                        key={f.id}
                        className="px-2.5 py-0.5 rounded-full bg-[#1c180e] border border-[#d4af37]/30 text-[#fae69e] text-[11px]"
                      >
                        👨🌾 {f.name} ({f.id})
                      </span>
                    ))}
                  </div>

                  {/* Selected Items List */}
                  {basketItems.length === 0 ? (
                    <div className="p-8 text-center text-xs text-[#8e8b82] font-mono">
                      No items in basket. Tap "Select Fresh Produce" to add crops.
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                      {basketItems.map((item) => (
                        <div
                          key={item.productId}
                          className="p-3 rounded-xl bg-[#0e0d0b] border border-[#d4af37]/20 flex items-center justify-between gap-3 text-xs font-mono"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={getProduceImage({ name: item.name, category: item.category })}
                              alt={item.name}
                              className="w-10 h-10 rounded-lg object-cover border border-[#d4af37]/30 shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="font-serif font-bold text-sm text-[#fcfbf7] truncate">
                                {item.name}
                              </div>
                              <div className="text-[10px] text-[#8e8b82]">
                                {item.farmerName} • ₹{item.price}/{item.unit}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <span className="font-bold text-[#fae69e]">
                              {item.quantity} {item.unit} = ₹{item.price * item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemove(item.productId)}
                              className="text-[#8e8b82] hover:text-[#f87171] p-1 cursor-pointer"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. Real-Data Smart Recommendations */}
                {smartRecommendations.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[#d4af37]" />
                      <h4 className="font-serif text-lg font-bold text-[#fae69e]">
                        Smart Recommendations For Your Basket
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {smartRecommendations.map((rec) => (
                        <div
                          key={rec.produce.id}
                          className="p-3.5 rounded-2xl bg-[#14120e] border border-[#d4af37]/30 flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={getProduceImage(rec.produce)}
                              alt={rec.produce.name}
                              className="w-12 h-12 rounded-xl object-cover border border-[#d4af37]/30 shrink-0"
                            />
                            <div className="min-w-0">
                              <span className="text-[9px] font-mono text-[#34d399] font-bold block">
                                {rec.badge}
                              </span>
                              <h5 className="font-serif font-bold text-xs sm:text-sm text-[#fcfbf7] truncate">
                                {rec.produce.name}
                              </h5>
                              <p className="text-[10px] text-[#8e8b82] truncate">
                                ₹{rec.produce.pricePerUnit}/{rec.produce.unit} • {rec.reason}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleAddOrIncrement(rec.produce)}
                            className="px-3 py-1.5 rounded-xl bg-[#241c0e] hover:bg-[#342812] border border-[#d4af37]/40 text-xs font-mono font-bold text-[#fae69e] cursor-pointer shrink-0 flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notices */}
                {saveSuccessNotice && (
                  <div className="p-3 rounded-xl bg-[#142814] text-xs font-mono text-[#34d399] border border-[#34d399]/40 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Your produce routine has been saved! You can load it anytime.</span>
                  </div>
                )}

                {addAllSuccessNotice && (
                  <div className="p-3 rounded-xl bg-[#142814] text-xs font-mono text-[#34d399] border border-[#34d399]/40 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Added all items to your active Cart successfully!</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* 4. MODAL FOOTER ACTIONS                                   */}
          {/* ========================================================= */}
          <div className="p-5 sm:p-6 bg-[#14120e] border-t border-[#d4af37]/25 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleSaveRoutine}
                disabled={basketItems.length === 0}
                className="px-5 py-3 rounded-2xl bg-[#1c180e] hover:bg-[#282012] border border-[#d4af37]/45 text-xs font-mono font-bold text-[#fae69e] flex items-center gap-2 cursor-pointer disabled:opacity-40"
              >
                <BookmarkCheck className="w-4 h-4 text-[#d4af37]" />
                <span>Save My Routine</span>
              </button>

              {savedRoutine && (
                <button
                  type="button"
                  onClick={handleClearRoutine}
                  className="px-4 py-3 rounded-2xl bg-[#2a1414] hover:bg-[#381a1a] border border-[#f87171]/40 text-xs font-mono font-bold text-[#f87171] cursor-pointer"
                  title="Delete saved routine"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  className="px-5 py-3 rounded-2xl bg-[#1a160e] text-[#aba79c] text-xs font-mono cursor-pointer"
                >
                  Back
                </button>
              )}

              <button
                type="button"
                onClick={handleAddAllToCart}
                disabled={basketItems.length === 0}
                className="flex-1 sm:flex-initial px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#b89120] text-[#0a0a0a] font-serif font-bold text-xs sm:text-sm uppercase tracking-wider hover:brightness-110 shadow-lg cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>+ Add All {basketItems.length} Items to Cart (₹{basketTotal})</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
