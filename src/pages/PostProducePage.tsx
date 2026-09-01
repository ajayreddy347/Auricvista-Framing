import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Tractor,
  UploadCloud,
  X,
  Plus,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Calendar,
  MapPin,
  Tag,
  AlertCircle,
  FileText,
  Eye,
  Camera,
  Image as ImageIcon,
  Bot,
  Lock,
  LogIn,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  useProduce,
  ProduceCategory,
  ProduceUnit,
  ProduceListing,
  AIQualityRatingData,
} from '../context/ProduceContext';
import { AIQualityInspector } from '../components/AIQualityInspector';
import { Footer } from '../components/Footer';

// Sample demo images for quick testing
const SAMPLE_HARVEST_PHOTOS = [
  {
    name: 'Fresh Tomatoes',
    url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'Organic Spinach',
    url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'Alphonso Mangoes',
    url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'Golden Carrots',
    url: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=800',
  },
];

export const PostProducePage: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, userRole, user } = useAuth();
  const { addListing, saveDraft } = useProduce();

  // Form states
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState<ProduceCategory>('Vegetables');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState<ProduceUnit>('kg');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [harvestDate, setHarvestDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [farmLocation, setFarmLocation] = useState('');
  const [description, setDescription] = useState('');

  // Image Upload state
  const [images, setImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Validation & UI State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publishedListing, setPublishedListing] = useState<ProduceListing | null>(null);
  const [draftSavedToast, setDraftSavedToast] = useState(false);
  const [aiRating, setAiRating] = useState<AIQualityRatingData | null>(null);

  // Auto-fill farm location from user profile if available
  useEffect(() => {
    if (user?.role === 'farmer') {
      const defaultLoc = user.farmName
        ? `${user.farmName}, ${user.location || 'Karnataka'}`
        : user.location || 'Kumar Organic Heritage Farm, Chikkaballapur Valley';
      setFarmLocation((prev) => prev || defaultLoc);
    } else {
      setFarmLocation((prev) => prev || 'Kumar Organic Heritage Farm, Chikkaballapur Valley');
    }
  }, [user]);

  // Clean up any blob URLs created locally when component unmounts
  useEffect(() => {
    return () => {
      images.forEach((url) => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [images]);

  // Handle Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
    }
  };

  const processFiles = (files: File[]) => {
    const validImages = files.filter((file) => file.type.startsWith('image/'));
    if (validImages.length === 0) {
      setErrors((prev) => ({ ...prev, images: 'Please select valid image files (JPG, PNG, WEBP).' }));
      return;
    }

    const newPreviewUrls = validImages.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...newPreviewUrls]);
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.images;
      return copy;
    });
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => {
      const removedUrl = prev[indexToRemove];
      if (removedUrl && removedUrl.startsWith('blob:')) {
        URL.revokeObjectURL(removedUrl);
      }
      return prev.filter((_, idx) => idx !== indexToRemove);
    });
  };

  const handleAddSampleImage = (url: string) => {
    if (!images.includes(url)) {
      setImages((prev) => [...prev, url]);
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.images;
        return copy;
      });
    }
  };

  // Form Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!productName.trim()) {
      newErrors.productName = 'Product name is required (e.g. Heirloom Tomatoes).';
    }
    if (!category) {
      newErrors.category = 'Please select a produce category.';
    }
    if (!quantity || isNaN(Number(quantity)) || Number(quantity) <= 0) {
      newErrors.quantity = 'Please enter a valid quantity greater than 0.';
    }
    if (!pricePerUnit || isNaN(Number(pricePerUnit)) || Number(pricePerUnit) <= 0) {
      newErrors.pricePerUnit = 'Please enter a valid price in ₹ per unit.';
    }
    if (!harvestDate) {
      newErrors.harvestDate = 'Please select the harvest date.';
    }
    if (!farmLocation.trim()) {
      newErrors.farmLocation = 'Farm location is required for buyer verification.';
    }
    if (images.length === 0) {
      newErrors.images = 'Please upload at least 1 photo of your fresh harvest for AI inspection.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Listing Handler
  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      // Scroll up slightly to view errors
      window.scrollTo({ top: 250, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    // Direct network broadcast & AI quality indexing
    setTimeout(() => {
      const created = addListing({
        name: productName.trim(),
        category,
        quantity: Number(quantity),
        unit,
        pricePerUnit: Number(pricePerUnit),
        harvestDate,
        farmLocation: farmLocation.trim(),
        farmerName: isLoggedIn && user?.name ? user.name : 'Ravi Kumar',
        farmerEmail: user?.email || 'ravi.kumar@auricvista.farm',
        description: description.trim(),
        images: images.length > 0 ? images : [SAMPLE_HARVEST_PHOTOS[0].url],
        status: 'Active',
        aiQualityRating: aiRating || undefined,
      });

      setIsSubmitting(false);
      setPublishedListing(created);
    }, 600);
  };

  // Save as Draft Handler
  const handleSaveDraft = () => {
    if (!productName.trim()) {
      setErrors((prev) => ({ ...prev, productName: 'Enter at least a product name to save draft.' }));
      return;
    }

    saveDraft({
      name: productName.trim(),
      category: category || 'Vegetables',
      quantity: Number(quantity) || 10,
      unit,
      pricePerUnit: Number(pricePerUnit) || 0,
      harvestDate: harvestDate || new Date().toISOString().split('T')[0],
      farmLocation: farmLocation.trim() || 'My Farm',
      farmerName: isLoggedIn && user?.name ? user.name : 'Ravi Kumar',
      farmerEmail: user?.email,
      description: description.trim(),
      images: images.length > 0 ? images : [SAMPLE_HARVEST_PHOTOS[0].url],
      status: 'Draft',
      aiQualityRating: aiRating || undefined,
    });

    setDraftSavedToast(true);
    setTimeout(() => setDraftSavedToast(false), 3000);
  };

  const handleResetForm = () => {
    setProductName('');
    setCategory('Vegetables');
    setQuantity('');
    setUnit('kg');
    setPricePerUnit('');
    setHarvestDate(new Date().toISOString().split('T')[0]);
    setDescription('');
    setImages([]);
    setErrors({});
    setAiRating(null);
    setPublishedListing(null);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemFadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="min-h-screen bg-[#070707] text-[#fcfbf7] pt-24 pb-20 relative overflow-hidden"
    >
      {/* Background ambient gold aura */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[550px] rounded-full gold-ambient-radial blur-3xl opacity-35" />
        <div className="absolute inset-0 bg-subtle-grid opacity-25 mask-gradient" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Navigation Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <Link
            to="/farmer-dashboard"
            id="back-to-dashboard-btn"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#aba79c] hover:text-[#fae69e] transition-colors py-1 px-2.5 rounded-lg bg-[#14120e]/60 border border-[#d4af37]/20 hover:border-[#d4af37]/50 backdrop-blur-md"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Farmer Dashboard</span>
          </Link>
        </motion.div>

        {/* Page Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center sm:text-left mb-8 sm:mb-10"
        >
          <motion.div variants={itemFadeUp} className="mb-3 inline-block">
            <div
              id="post-produce-pill"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14120c]/80 border border-[#d4af37]/30 backdrop-blur-md shadow-[0_0_15px_-5px_rgba(212,175,55,0.15)]"
            >
              <Tractor className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="text-[11px] font-mono font-medium tracking-[0.2em] text-[#e8dfca] uppercase">
                Farmer Listing Portal
              </span>
            </div>
          </motion.div>

          <motion.h1
            variants={itemFadeUp}
            id="post-produce-heading"
            className="font-serif text-3xl sm:text-5xl font-medium tracking-[-0.02em] text-[#fcfbf7] leading-tight"
          >
            List Your Produce
          </motion.h1>

          <motion.p
            variants={itemFadeUp}
            id="post-produce-subtext"
            className="mt-3 text-sm sm:text-base text-[#aba79c] font-normal leading-relaxed max-w-2xl"
          >
            Add details about what you're harvesting — customers will see this listing directly.
          </motion.p>

          {/* If user is not signed in as a farmer, show a guidance banner */}
          {(!isLoggedIn || userRole !== 'farmer') && (
            <motion.div variants={itemFadeUp} className="mt-5">
              <div className="p-3.5 sm:p-4 rounded-2xl bg-[#18140c] border border-[#d4af37]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#fae69e]">
                <div className="flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-[#d4af37] shrink-0" />
                  <span>
                    <strong>Producer Notice:</strong> You are viewing in Farmer Mode. Sign in to link your real bank payout credentials.
                  </span>
                </div>
                <Link
                  to="/login?role=farmer"
                  className="px-3.5 py-1.5 rounded-full bg-[#fae69e] text-[#0a0a0a] font-mono font-semibold uppercase tracking-wider hover:brightness-110 shrink-0 inline-flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(212,175,55,0.3)]"
                >
                  <LogIn className="w-3 h-3" />
                  Sign In as Farmer
                </Link>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Draft Toast Notification */}
        <AnimatePresence>
          {draftSavedToast && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-24 right-6 z-50 p-4 rounded-2xl bg-[#14120e] border border-[#d4af37]/50 shadow-[0_0_30px_rgba(212,175,55,0.3)] flex items-center gap-3 text-xs text-[#fae69e] font-mono"
            >
              <CheckCircle2 className="w-5 h-5 text-[#34d399]" />
              <span>Draft saved successfully! You can resume editing anytime.</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========================================================================= */}
        {/* SUCCESS PUBLISHED STATE                                                  */}
        {/* ========================================================================= */}
        <AnimatePresence mode="wait">
          {publishedListing ? (
            <motion.div
              key="success-card"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
              id="post-produce-success-card"
              className="p-8 sm:p-12 rounded-3xl bg-[#0e0d0b]/95 border-2 border-[#d4af37]/60 shadow-[0_0_60px_-15px_rgba(212,175,55,0.35)] backdrop-blur-2xl text-center"
            >
              {/* Animated Checkmark Badge */}
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-[#2a2412] to-[#12100a] border-2 border-[#d4af37] flex items-center justify-center text-[#fae69e] shadow-[0_0_30px_rgba(212,175,55,0.4)] mb-6">
                <CheckCircle2 className="w-10 h-10 text-[#34d399] animate-pulse" />
              </div>

              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
                Direct Marketplace Broadcast
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#fcfbf7] mt-2 mb-3">
                Your produce is now live on AuricVista!
              </h2>
              <p className="text-sm text-[#aba79c] max-w-lg mx-auto font-sans leading-relaxed">
                Direct consumer buyers in your zone can now place escrow-backed orders for{' '}
                <strong className="text-[#fae69e]">{publishedListing.name}</strong>.
              </p>

              {/* Published Item Snapshot Card */}
              <div className="my-8 max-w-md mx-auto p-5 rounded-2xl bg-[#14120e] border border-[#d4af37]/30 text-left flex items-center gap-4">
                {publishedListing.images[0] && (
                  <img
                    src={publishedListing.images[0]}
                    alt={publishedListing.name}
                    className="w-20 h-20 rounded-xl object-cover border border-[#d4af37]/30 shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-[#1d190e] border border-[#d4af37]/30 text-[#d4af37]">
                      {publishedListing.category}
                    </span>
                    <span className="text-xs font-mono text-[#34d399] font-bold">● Active Live</span>
                  </div>
                  <h4 className="font-serif text-base font-bold text-[#fcfbf7] truncate mt-1">
                    {publishedListing.name}
                  </h4>
                  <div className="flex items-center justify-between text-xs font-mono text-[#8e8b82] mt-1">
                    <span>
                      Stock: <strong className="text-[#e8dfca]">{publishedListing.quantity} {publishedListing.unit}</strong>
                    </span>
                    <span className="text-[#fae69e] font-bold">
                      ₹{publishedListing.pricePerUnit}/{publishedListing.unit}
                    </span>
                  </div>
                </div>
              </div>

              {/* AI Quality Badge Indicator */}
              {publishedListing.aiQualityRating && (
                <div className="mb-8 max-w-md mx-auto p-4 rounded-xl bg-[#18140c] border border-[#d4af37]/35 text-left flex items-start gap-3 shadow-[0_0_20px_-5px_rgba(212,175,55,0.2)]">
                  <div className="w-9 h-9 rounded-lg bg-[#221b0e] border border-[#d4af37]/50 flex items-center justify-center text-[#fae69e] shrink-0 mt-0.5">
                    <Bot className="w-5 h-5 text-[#d4af37]" />
                  </div>
                  <div className="text-xs flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <span className="font-mono font-bold text-[#fae69e]">
                        AI Quality Score: {publishedListing.aiQualityRating.qualityScore ? `${publishedListing.aiQualityRating.qualityScore.toFixed(1)}/10` : `${publishedListing.aiQualityRating.freshnessScore}%`}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-[#201a0e] text-[#fae69e] border border-[#d4af37]/40">
                        {publishedListing.aiQualityRating.freshnessLabel || 'Excellent'} Quality
                      </span>
                    </div>
                    <p className="text-[11px] text-[#aba79c] mt-1 font-serif italic">
                      "{publishedListing.aiQualityRating.notes || publishedListing.aiQualityRating.analysisNote}"
                    </p>
                    {publishedListing.aiQualityRating.tags && publishedListing.aiQualityRating.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {publishedListing.aiQualityRating.tags.map((t, idx) => (
                          <span key={idx} className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#100f0b] text-[#d4af37] border border-[#d4af37]/25">
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  type="button"
                  id="add-another-produce-btn"
                  onClick={handleResetForm}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-xs font-mono uppercase tracking-wider text-[#fae69e] bg-[#14120e] border border-[#d4af37]/40 hover:border-[#d4af37] hover:bg-[#1a1710] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>List Another Harvest</span>
                </button>

                <Link
                  to="/farmer-dashboard"
                  id="view-in-dashboard-btn"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-[#0a0a0a] bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#b89120] hover:brightness-110 shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center gap-2"
                >
                  <Tractor className="w-4 h-4" />
                  <span>View in Farmer Dashboard →</span>
                </Link>

                <Link
                  to="/marketplace"
                  id="browse-marketplace-btn"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-xs font-mono uppercase tracking-wider text-[#aba79c] hover:text-[#fcfbf7] transition-colors flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>View in Marketplace</span>
                </Link>
              </div>
            </motion.div>
          ) : (
            /* ========================================================================= */
            /* MAIN POST PRODUCE FORM                                                    */
            /* ========================================================================= */
            <motion.div
              key="post-form-card"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
              id="post-produce-form-card"
              className="p-6 sm:p-10 rounded-3xl bg-[#0e0d0b]/90 border-2 border-[#d4af37]/35 backdrop-blur-2xl shadow-[0_0_50px_-15px_rgba(212,175,55,0.25)] relative"
            >
              <form onSubmit={handlePublish} className="space-y-6 sm:space-y-7">
                {/* 1. Product Name */}
                <div id="field-product-name">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-mono uppercase tracking-widest text-[#d4af37] font-semibold">
                      1. Product Name <span className="text-[#f87171]">*</span>
                    </label>
                    <span className="text-[11px] text-[#8e8b82] font-mono">e.g. Cherry Tomatoes</span>
                  </div>
                  <input
                    type="text"
                    id="input-product-name"
                    value={productName}
                    onChange={(e) => {
                      setProductName(e.target.value);
                      if (errors.productName) setErrors((prev) => ({ ...prev, productName: '' }));
                    }}
                    placeholder="e.g. Vine-Ripened Heirloom Tomatoes"
                    className={`w-full px-4 py-3.5 rounded-xl bg-[#14120e] border text-sm text-[#fcfbf7] placeholder-[#66635c] focus:outline-none transition-colors ${
                      errors.productName ? 'border-[#f87171] focus:border-[#f87171]' : 'border-[#d4af37]/30 focus:border-[#fae69e]'
                    }`}
                  />
                  {errors.productName && (
                    <p className="mt-1.5 text-xs text-[#f87171] font-mono flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.productName}</span>
                    </p>
                  )}
                </div>

                {/* 2. Category & Quantity (2 cols on desktop) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                  {/* 2. Category */}
                  <div id="field-category">
                    <label className="block text-xs font-mono uppercase tracking-widest text-[#d4af37] font-semibold mb-1.5">
                      2. Category <span className="text-[#f87171]">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="select-category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value as ProduceCategory)}
                        className="w-full px-4 py-3.5 rounded-xl bg-[#14120e] border border-[#d4af37]/30 text-sm text-[#fcfbf7] focus:outline-none focus:border-[#fae69e] appearance-none cursor-pointer"
                      >
                        <option value="Vegetables" className="bg-[#14120e] text-[#fcfbf7]">Vegetables</option>
                        <option value="Fruits" className="bg-[#14120e] text-[#fcfbf7]">Fruits</option>
                        <option value="Grains" className="bg-[#14120e] text-[#fcfbf7]">Grains</option>
                        <option value="Pulses" className="bg-[#14120e] text-[#fcfbf7]">Pulses</option>
                        <option value="Farm Fresh" className="bg-[#14120e] text-[#fcfbf7]">Farm Fresh (Dairy / Poultry)</option>
                        <option value="Organic / Natural" className="bg-[#14120e] text-[#fcfbf7]">Organic / Natural</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#d4af37]">
                        ▼
                      </div>
                    </div>
                  </div>

                  {/* 3. Quantity Available + Unit */}
                  <div id="field-quantity">
                    <label className="block text-xs font-mono uppercase tracking-widest text-[#d4af37] font-semibold mb-1.5">
                      3. Quantity Available <span className="text-[#f87171]">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        id="input-quantity"
                        min="1"
                        step="any"
                        value={quantity}
                        onChange={(e) => {
                          setQuantity(e.target.value);
                          if (errors.quantity) setErrors((prev) => ({ ...prev, quantity: '' }));
                        }}
                        placeholder="e.g. 50"
                        className={`flex-1 px-4 py-3.5 rounded-xl bg-[#14120e] border text-sm text-[#fcfbf7] placeholder-[#66635c] focus:outline-none transition-colors ${
                          errors.quantity ? 'border-[#f87171] focus:border-[#f87171]' : 'border-[#d4af37]/30 focus:border-[#fae69e]'
                        }`}
                      />
                      <select
                        id="select-unit"
                        value={unit}
                        onChange={(e) => setUnit(e.target.value as ProduceUnit)}
                        className="w-28 px-3 py-3.5 rounded-xl bg-[#14120e] border border-[#d4af37]/30 text-sm text-[#fae69e] font-mono focus:outline-none focus:border-[#fae69e] cursor-pointer"
                      >
                        <option value="kg">kg</option>
                        <option value="dozen">dozen</option>
                        <option value="litre">litre</option>
                        <option value="piece">piece</option>
                        <option value="bunch">bunch</option>
                        <option value="quintal">quintal</option>
                      </select>
                    </div>
                    {errors.quantity && (
                      <p className="mt-1.5 text-xs text-[#f87171] font-mono flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{errors.quantity}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* 4. Price per unit & 5. Harvest Date (2 cols on desktop) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                  {/* 4. Price per unit */}
                  <div id="field-price">
                    <label className="block text-xs font-mono uppercase tracking-widest text-[#d4af37] font-semibold mb-1.5">
                      4. Price per unit <span className="text-[#f87171]">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#fae69e] font-serif font-bold text-base pointer-events-none">
                        ₹
                      </div>
                      <input
                        type="number"
                        id="input-price"
                        min="1"
                        step="any"
                        value={pricePerUnit}
                        onChange={(e) => {
                          setPricePerUnit(e.target.value);
                          if (errors.pricePerUnit) setErrors((prev) => ({ ...prev, pricePerUnit: '' }));
                        }}
                        placeholder="e.g. 45"
                        className={`w-full pl-9 pr-14 py-3.5 rounded-xl bg-[#14120e] border text-sm text-[#fcfbf7] placeholder-[#66635c] focus:outline-none transition-colors ${
                          errors.pricePerUnit ? 'border-[#f87171] focus:border-[#f87171]' : 'border-[#d4af37]/30 focus:border-[#fae69e]'
                        }`}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-[#8e8b82] pointer-events-none">
                        /{unit}
                      </span>
                    </div>
                    {errors.pricePerUnit && (
                      <p className="mt-1.5 text-xs text-[#f87171] font-mono flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{errors.pricePerUnit}</span>
                      </p>
                    )}
                  </div>

                  {/* 5. Harvest Date */}
                  <div id="field-harvest-date">
                    <label className="block text-xs font-mono uppercase tracking-widest text-[#d4af37] font-semibold mb-1.5">
                      5. Harvest Date <span className="text-[#f87171]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        id="input-harvest-date"
                        value={harvestDate}
                        onChange={(e) => {
                          setHarvestDate(e.target.value);
                          if (errors.harvestDate) setErrors((prev) => ({ ...prev, harvestDate: '' }));
                        }}
                        className={`w-full px-4 py-3.5 rounded-xl bg-[#14120e] border text-sm text-[#fcfbf7] focus:outline-none transition-colors cursor-pointer ${
                          errors.harvestDate ? 'border-[#f87171] focus:border-[#f87171]' : 'border-[#d4af37]/30 focus:border-[#fae69e]'
                        }`}
                      />
                    </div>
                    {errors.harvestDate && (
                      <p className="mt-1.5 text-xs text-[#f87171] font-mono flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{errors.harvestDate}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* 6. Farm Location */}
                <div id="field-farm-location">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-mono uppercase tracking-widest text-[#d4af37] font-semibold">
                      6. Farm Location <span className="text-[#f87171]">*</span>
                    </label>
                    <span className="text-[11px] text-[#8e8b82] font-mono">Auto-filled from farm profile</span>
                  </div>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#d4af37] pointer-events-none">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      id="input-farm-location"
                      value={farmLocation}
                      onChange={(e) => {
                        setFarmLocation(e.target.value);
                        if (errors.farmLocation) setErrors((prev) => ({ ...prev, farmLocation: '' }));
                      }}
                      placeholder="Farm Name, Village/District, State"
                      className={`w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#14120e] border text-sm text-[#fcfbf7] placeholder-[#66635c] focus:outline-none transition-colors ${
                        errors.farmLocation ? 'border-[#f87171] focus:border-[#f87171]' : 'border-[#d4af37]/30 focus:border-[#fae69e]'
                      }`}
                    />
                  </div>
                  {errors.farmLocation && (
                    <p className="mt-1.5 text-xs text-[#f87171] font-mono flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.farmLocation}</span>
                    </p>
                  )}
                </div>

                {/* 7. Description (Optional) */}
                <div id="field-description">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-mono uppercase tracking-widest text-[#d4af37] font-semibold">
                      7. Description <span className="text-[11px] text-[#8e8b82] font-normal">(Optional notes)</span>
                    </label>
                    <span className="text-[11px] text-[#8e8b82] font-mono">Farming method, taste, certifications</span>
                  </div>
                  <textarea
                    id="input-description"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Naturally grown with zero chemical pesticides. Picked this morning for maximum sweetness and crisp texture."
                    className="w-full px-4 py-3 rounded-xl bg-[#14120e] border border-[#d4af37]/30 text-sm text-[#fcfbf7] placeholder-[#66635c] focus:outline-none focus:border-[#fae69e] resize-none"
                  />
                </div>

                {/* 8. Image Upload Area */}
                <div id="field-images" className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-mono uppercase tracking-widest text-[#d4af37] font-semibold">
                      8. Produce Photos <span className="text-[#f87171]">*</span>
                    </label>
                    <span className="text-[11px] text-[#8e8b82] font-mono">At least 1 photo required</span>
                  </div>

                  {/* Drag and Drop Zone */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center group ${
                      isDragging
                        ? 'border-[#fae69e] bg-[#221c10]'
                        : errors.images
                        ? 'border-[#f87171] bg-[#14120e]'
                        : 'border-[#d4af37]/40 bg-[#12110c] hover:border-[#d4af37] hover:bg-[#18150d]'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="produce-photo-file-input"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    <div className="w-12 h-12 rounded-2xl bg-[#1d190e] border border-[#d4af37]/30 flex items-center justify-center text-[#fae69e] group-hover:scale-110 transition-transform mb-3 shadow-[0_0_15px_-3px_rgba(212,175,55,0.2)]">
                      <Camera className="w-6 h-6" />
                    </div>

                    <p className="text-sm font-medium text-[#fcfbf7]">
                      Drag & drop photos or <span className="text-[#fae69e] underline underline-offset-4">click to upload</span>
                    </p>
                    <p className="text-xs text-[#8e8b82] mt-1 font-mono">
                      Supports JPG, PNG, WEBP • Upload multiple harvest angles
                    </p>
                  </div>

                  {/* Sample Photos Quick-Picker */}
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-mono">
                    <span className="text-[#8e8b82]">Or click to test with sample photos:</span>
                    {SAMPLE_HARVEST_PHOTOS.map((sample, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleAddSampleImage(sample.url)}
                        className="px-2.5 py-1 rounded-lg bg-[#14120e] border border-[#d4af37]/25 text-[#fae69e] hover:border-[#d4af37] hover:bg-[#1d190e] transition-all flex items-center gap-1.5 cursor-pointer text-[11px]"
                      >
                        <Plus className="w-3 h-3" />
                        <span>{sample.name}</span>
                      </button>
                    ))}
                  </div>

                  {errors.images && (
                    <p className="mt-2 text-xs text-[#f87171] font-mono flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.images}</span>
                    </p>
                  )}

                  {/* Image Thumbnails Row */}
                  {images.length > 0 && (
                    <div className="mt-4">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-[#8e8b82] block mb-2">
                        Uploaded Photos ({images.length})
                      </span>
                      <div className="flex flex-wrap gap-3">
                        {images.map((imgUrl, index) => (
                          <div
                            key={index}
                            className="relative group rounded-xl overflow-hidden border border-[#d4af37]/40 w-24 h-24 sm:w-28 sm:h-28 bg-[#14120e] shadow-md"
                          >
                            <img
                              src={imgUrl}
                              alt={`Harvest preview ${index + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            {/* Primary Badge */}
                            {index === 0 && (
                              <span className="absolute bottom-1 left-1 right-1 text-[9px] font-mono font-bold uppercase text-center py-0.5 rounded bg-black/80 text-[#fae69e] border border-[#d4af37]/30">
                                Primary Photo
                              </span>
                            )}
                            {/* Remove button */}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/80 border border-[#d4af37]/50 text-[#fae69e] hover:bg-[#f87171] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                              title="Remove photo"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI Quality Check Inspector Component */}
                  <AIQualityInspector
                    images={images}
                    productName={productName}
                    category={category}
                    onRatingGenerated={setAiRating}
                  />
                </div>

                {/* Form Action Buttons */}
                <div className="pt-6 border-t border-[#d4af37]/20 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
                  <button
                    type="button"
                    id="save-draft-btn"
                    onClick={handleSaveDraft}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-xs font-mono uppercase tracking-[0.14em] text-[#fae69e] bg-[#14120e] border border-[#d4af37]/40 hover:border-[#d4af37] hover:bg-[#1b170e] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Save as Draft</span>
                  </button>

                  <button
                    type="submit"
                    id="publish-produce-btn"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-[0.16em] text-[#0a0a0a] bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#b89120] hover:brightness-110 shadow-[0_0_25px_-5px_rgba(212,175,55,0.45)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>Publishing to Marketplace...</span>
                      </>
                    ) : (
                      <>
                        <span>Publish Listing →</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-20">
        <Footer />
      </div>
    </motion.div>
  );
};
