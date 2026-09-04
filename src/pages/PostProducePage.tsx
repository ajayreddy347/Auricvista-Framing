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
import { useLanguage } from '../context/LanguageContext';
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
  const { language, t } = useLanguage();

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
  const [farmLocation, setFarmLocation] = useState(
    user?.location || 'Mandya Heritage Soil, Karnataka'
  );
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [customImageUrl, setCustomImageUrl] = useState('');

  // AI Description Generator state
  const [isGeneratingAiDesc, setIsGeneratingAiDesc] = useState(false);
  const [aiDescSuccessNotice, setAiDescSuccessNotice] = useState(false);

  // AI Quality Inspection result
  const [aiRating, setAiRating] = useState<AIQualityRatingData | null>(null);

  // Status & Validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draftSavedToast, setDraftSavedToast] = useState(false);
  const [publishedListing, setPublishedListing] = useState<ProduceListing | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync farm location with user state if available
  useEffect(() => {
    if (user?.location && !farmLocation) {
      setFarmLocation(user.location);
    }
  }, [user, farmLocation]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!productName.trim()) {
      newErrors.productName = t('post.errorName', 'Produce name is required.');
    }
    if (!quantity || Number(quantity) <= 0) {
      newErrors.quantity = t('post.errorQuantity', 'Please enter a valid quantity greater than zero.');
    }
    if (!pricePerUnit || Number(pricePerUnit) <= 0) {
      newErrors.pricePerUnit = t('post.errorPrice', 'Price per unit must be greater than ₹0.');
    }
    if (!harvestDate) {
      newErrors.harvestDate = t('post.errorHarvestDate', 'Harvest date is required.');
    }
    if (!farmLocation.trim()) {
      newErrors.farmLocation = t('post.errorLocation', 'Farm location is required.');
    }
    if (!description.trim() || description.trim().length < 10) {
      newErrors.description = t('post.errorDescription', 'Please provide a brief cultivation description (or use AI generation).');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerateAiDescription = async () => {
    if (!productName.trim()) {
      setErrors((prev) => ({
        ...prev,
        productName: t('post.errorNameFirst', 'Please enter the produce name first.'),
      }));
      return;
    }

    setIsGeneratingAiDesc(true);
    try {
      const prompt = `Generate a concise 2-sentence direct farm marketplace listing description for freshly harvested natural ${productName.trim()} (${category}) grown at ${farmLocation || 'our heritage farm'}. Emphasize morning dawn harvest, zero chemical residues, rich natural aroma, and peak crisp freshness.`;
      const res = await fetch('/api/farmer-ai-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          language,
        }),
      });
      const data = await res.json();
      if (data.reply) {
        setDescription(data.reply.trim());
        setAiDescSuccessNotice(true);
        setTimeout(() => setAiDescSuccessNotice(false), 4000);
        setErrors((prev) => {
          const next = { ...prev };
          delete next.description;
          return next;
        });
      }
    } catch (err) {
      console.error('Failed to generate AI description:', err);
    } finally {
      setIsGeneratingAiDesc(false);
    }
  };

  // Submit Listing Handler
  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 250, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    try {
      const created = await addListing({
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

      setPublishedListing(created);
    } finally {
      setIsSubmitting(false);
    }
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemFadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="min-h-screen bg-transparent text-[#fcfbf7] pt-24 pb-20 relative overflow-hidden"
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
            <span>{t('dash.farmerTitle', 'Back to Farmer Dashboard')}</span>
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
                {t('post.title', 'Farmer Listing Portal')}
              </span>
            </div>
          </motion.div>

          <motion.h1
            variants={itemFadeUp}
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#fcfbf7]"
          >
            {t('post.title', 'Post New Crop Listing')}
          </motion.h1>

          <motion.p
            variants={itemFadeUp}
            className="mt-3 text-sm sm:text-base text-[#aba79c] max-w-2xl font-sans"
          >
            {t('post.subtitle', 'List your harvested produce directly on the Auric Arohi marketplace for consumers across the region.')}
          </motion.p>
        </motion.div>

        {/* Success Modal / Published Confirmation */}
        <AnimatePresence>
          {publishedListing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#18150e] to-[#0f0e0c] border-2 border-[#d4af37] shadow-[0_0_50px_rgba(212,175,55,0.35)] text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-[#201c10] border border-[#d4af37] flex items-center justify-center text-[#fae69e] mx-auto shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                <CheckCircle2 className="w-8 h-8 text-[#34d399]" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#fcfbf7]">
                {t('post.success', 'Crop Published Successfully!')}
              </h3>
              <p className="text-xs sm:text-sm text-[#aba79c] max-w-md mx-auto">
                <strong>{publishedListing.name}</strong> ({publishedListing.quantity} {publishedListing.unit} @ ₹{publishedListing.pricePerUnit}/{publishedListing.unit}) is now live in the PostgreSQL marketplace.
              </p>

              <div className="flex items-center justify-center gap-3 pt-2">
                <Link
                  to="/marketplace"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#fae69e] to-[#d4af37] text-[#0a0a0a] font-serif font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-lg"
                >
                  {t('cart.exploreMarket', 'View in Marketplace')}
                </Link>
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-5 py-3 rounded-xl bg-[#14120e] border border-[#d4af37]/40 text-[#fae69e] font-mono text-xs hover:bg-[#201a0e] cursor-pointer"
                >
                  {t('dash.addNewCrop', 'Post Another Crop')}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Post Form Card */}
        {!publishedListing && (
          <form
            onSubmit={handlePublish}
            className="p-6 sm:p-8 rounded-3xl bg-[#0e0d0b]/90 border-2 border-[#d4af37]/35 backdrop-blur-2xl shadow-[0_0_50px_-15px_rgba(212,175,55,0.25)] space-y-6"
          >
            {/* Produce Name */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#d4af37] mb-1.5 font-semibold">
                {t('post.cropName', 'Crop / Produce Name')} *
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Heirloom Vine Tomatoes"
                className="w-full px-4 py-3 rounded-xl bg-[#14120e] border border-[#d4af37]/30 text-sm text-[#fcfbf7] placeholder-[#66635c] focus:outline-none focus:border-[#fae69e] focus:ring-1 focus:ring-[#fae69e]"
              />
              {errors.productName && (
                <p className="text-[11px] font-mono text-[#f87171] mt-1">{errors.productName}</p>
              )}
            </div>

            {/* Category & Quantity & Unit */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#d4af37] mb-1.5 font-semibold">
                  {t('post.category', 'Category')} *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ProduceCategory)}
                  className="w-full px-4 py-3 rounded-xl bg-[#14120e] border border-[#d4af37]/30 text-sm text-[#fcfbf7] focus:outline-none focus:border-[#fae69e]"
                >
                  <option value="Vegetables" className="bg-[#14120e]">{t('market.vegetables', 'Vegetables')}</option>
                  <option value="Fruits" className="bg-[#14120e]">{t('market.fruits', 'Fruits')}</option>
                  <option value="Grains" className="bg-[#14120e]">{t('market.grains', 'Grains & Pulses')}</option>
                  <option value="Spices" className="bg-[#14120e]">{t('market.spices', 'Spices & Herbs')}</option>
                  <option value="Dairy" className="bg-[#14120e]">{t('market.dairy', 'Desi Dairy')}</option>
                  <option value="Farm Fresh" className="bg-[#14120e]">{t('market.farmFresh', 'Farm Fresh')}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#d4af37] mb-1.5 font-semibold">
                  {t('post.quantity', 'Available Quantity')} *
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="e.g. 50"
                  className="w-full px-4 py-3 rounded-xl bg-[#14120e] border border-[#d4af37]/30 text-sm text-[#fcfbf7] placeholder-[#66635c] focus:outline-none focus:border-[#fae69e]"
                />
                {errors.quantity && (
                  <p className="text-[11px] font-mono text-[#f87171] mt-1">{errors.quantity}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#d4af37] mb-1.5 font-semibold">
                  {t('post.pricePerUnit', 'Price per Unit (₹)')} *
                </label>
                <input
                  type="number"
                  min="1"
                  value={pricePerUnit}
                  onChange={(e) => setPricePerUnit(e.target.value)}
                  placeholder="e.g. 85"
                  className="w-full px-4 py-3 rounded-xl bg-[#14120e] border border-[#d4af37]/30 text-sm text-[#fcfbf7] placeholder-[#66635c] focus:outline-none focus:border-[#fae69e]"
                />
                {errors.pricePerUnit && (
                  <p className="text-[11px] font-mono text-[#f87171] mt-1">{errors.pricePerUnit}</p>
                )}
              </div>
            </div>

            {/* Description with ✨ Generate with AI button */}
            <div>
              <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#d4af37] font-semibold">
                  {t('post.description', 'Produce Description & Cultivation Details')} *
                </label>
                <button
                  type="button"
                  id="generate-ai-description-btn"
                  onClick={handleGenerateAiDescription}
                  disabled={isGeneratingAiDesc}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-[#241c0e] to-[#12100a] border border-[#d4af37]/60 hover:border-[#fae69e] text-[#fae69e] text-xs font-mono font-bold transition-all hover:scale-[1.02] cursor-pointer shadow-sm disabled:opacity-50"
                  title="Generate a compelling marketplace description using AI"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>
                    {isGeneratingAiDesc
                      ? t('post.generatingDesc', 'Generating Description...')
                      : t('post.generateDescAi', '✨ Generate Description with AI')}
                  </span>
                </button>
              </div>

              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('post.descPlaceholder', 'Describe variety, soil nourishment, dawn harvest timing, and natural aroma...')}
                className="w-full px-4 py-3 rounded-xl bg-[#14120e] border border-[#d4af37]/30 text-sm text-[#fcfbf7] placeholder-[#66635c] focus:outline-none focus:border-[#fae69e]"
              />

              {aiDescSuccessNotice && (
                <p className="text-[11px] font-mono text-[#34d399] mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>
                    {t('post.aiDescSuccess', 'AI description generated! You can review or edit it before publishing.')}
                  </span>
                </p>
              )}

              {errors.description && (
                <p className="text-[11px] font-mono text-[#f87171] mt-1">{errors.description}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-[#d4af37]/20 flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-serif font-bold text-xs uppercase tracking-wider text-[#0a0a0a] bg-gradient-to-r from-[#fae69e] via-[#d4af37] to-[#b89120] hover:brightness-110 active:scale-[0.99] shadow-[0_0_25px_rgba(212,175,55,0.4)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>{t('post.publishing', 'Publishing Crop Listing...')}</span>
                ) : (
                  <>
                    <span>{t('post.submit', 'Publish Harvest to Marketplace')}</span>
                    <ArrowRight className="w-4 h-4 text-[#0a0a0a]" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      <Footer />
    </motion.div>
  );
};
