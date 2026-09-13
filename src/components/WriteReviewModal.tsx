import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Star,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  User,
} from 'lucide-react';
import { StarRating } from './StarRating';
import { useAuth } from '../context/AuthContext';
import { useReviews } from '../context/ReviewsContext';
import { useTheme } from '../context/ThemeContext';

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  farmerId: string;
  farmerName: string;
  produceId?: string;
  produceName?: string;
  onSuccess?: () => void;
}

export const WriteReviewModal: React.FC<WriteReviewModalProps> = ({
  isOpen,
  onClose,
  farmerId,
  farmerName,
  produceId,
  produceName,
  onSuccess,
}) => {
  const { user, isLoggedIn, userRole } = useAuth();
  const { isDark } = useTheme();
  const { addReview } = useReviews();

  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Handle image upload / drop
  const processFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newPhotos: string[] = [];
    const maxPhotos = 3;

    Array.from(files).slice(0, maxPhotos - photos.length).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setPhotos((prev) => [...prev, reader.result as string]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation: star rating is required
    if (rating === 0) {
      setErrorMsg('Please select a star rating (1 to 5 stars) for this farmer.');
      return;
    }

    if (!isLoggedIn || userRole !== 'customer') {
      setErrorMsg('Please login as a customer to submit a verified farm review.');
      return;
    }

    setIsSubmitting(true);

    try {
      await addReview({
        farmerId,
        farmerName,
        produceId: produceId || undefined,
        produceName: produceName || undefined,
        customerName: user?.name || 'Verified Customer',
        customerEmail: user?.email,
        rating,
        comment: comment.trim() || 'Exceptional direct harvest produce with outstanding farm freshness.',
        verified: true,
        photos: photos.length > 0 ? photos : undefined,
      });

      setShowSuccessToast(true);

      setTimeout(() => {
        setShowSuccessToast(false);
        if (onSuccess) onSuccess();
        onClose();
        setRating(0);
        setComment('');
        setPhotos([]);
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-4 overflow-hidden">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className={`fixed inset-0 transition-colors duration-200 ${
          isDark ? 'bg-black/85 backdrop-blur-md' : 'bg-stone-900/40 backdrop-blur-sm'
        }`}
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
        className={`relative w-full max-w-md max-h-[76vh] overflow-y-auto overscroll-contain rounded-2xl sm:rounded-3xl p-4 sm:p-5 z-10 transition-colors duration-200 ${
          isDark
            ? 'bg-gradient-to-b from-[#14120e] via-[#0f0e0c] to-[#090807] border-2 border-[#d4af37]/45 text-[#fcfbf7] shadow-[0_0_50px_-15px_rgba(212,175,55,0.3)]'
            : 'bg-[#fcfbf7] border-2 border-[#d4af37]/40 text-[#1c1917] shadow-xl'
        }`}
      >
        {/* Ambient Top Glow */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 rounded-full blur-2xl pointer-events-none ${
          isDark ? 'bg-[#d4af37]/15' : 'bg-[#d4af37]/10'
        }`} />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className={`absolute top-5 right-5 p-2 rounded-full transition-colors cursor-pointer ${
            isDark
              ? 'text-[#aba79c] hover:text-[#fae69e] hover:bg-[#201a0e]'
              : 'text-stone-500 hover:text-stone-900 hover:bg-stone-200/60'
          }`}
          aria-label="Close review modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Toast Overlay */}
        <AnimatePresence>
          {showSuccessToast && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`absolute inset-0 z-30 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 ${
                isDark ? 'bg-[#0f0e0c]/95' : 'bg-white/95'
              }`}
            >
              <div className={`w-16 h-16 rounded-full border flex items-center justify-center text-[#34d399] mb-4 shadow-md ${
                isDark ? 'bg-[#1e190e] border-[#d4af37]' : 'bg-[#f0fdf4] border-[#86efac]'
              }`}>
                <CheckCircle2 className="w-9 h-9 text-[#166534] dark:text-[#34d399]" />
              </div>
              <h3 className={`font-serif text-2xl font-bold ${
                isDark ? 'text-[#fae69e]' : 'text-[#8f6208]'
              }`}>
                Thanks for your review!
              </h3>
              <p className={`text-xs mt-2 font-sans max-w-xs ${
                isDark ? 'text-[#aba79c]' : 'text-stone-600'
              }`}>
                Your direct farm rating has been verified and published to {farmerName}’s public dossier.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Header */}
        <div className="mb-6 pr-6">
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-mono uppercase tracking-wider mb-2 ${
            isDark
              ? 'bg-[#201a0e] border-[#d4af37]/30 text-[#fae69e]'
              : 'bg-[#faf6ee] border-[#d4af37]/40 text-[#8f6208]'
          }`}>
            <Sparkles className="w-3 h-3 text-[#d4af37]" />
            <span>Verified Customer Feedback</span>
          </div>
          <h2 className={`font-serif text-2xl sm:text-3xl font-bold tracking-tight ${
            isDark ? 'text-[#fcfbf7]' : 'text-[#1c1917]'
          }`}>
            Review {farmerName}
          </h2>
          {produceName ? (
            <p className={`text-xs font-sans mt-0.5 ${
              isDark ? 'text-[#d4af37]' : 'text-[#8f6208]'
            }`}>
              Produce: <span className={`font-medium ${isDark ? 'text-[#f5f3eb]' : 'text-stone-800'}`}>{produceName}</span>
            </p>
          ) : (
            <p className={`text-xs font-sans mt-0.5 ${
              isDark ? 'text-[#aba79c]' : 'text-stone-600'
            }`}>
              Direct Farmer Experience & Harvest Quality
            </p>
          )}
        </div>

        {/* Review Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Rating Stars Input */}
          <div className={`p-4 rounded-2xl border shadow-xs ${
            isDark ? 'bg-[#0a0a09] border-[#d4af37]/25' : 'bg-white border-stone-200'
          }`}>
            <label className={`block text-xs font-mono uppercase tracking-wider mb-2 font-semibold ${
              isDark ? 'text-[#fae69e]' : 'text-[#8f6208]'
            }`}>
              Select Your Rating <span className="text-[#f87171]">*</span>
            </label>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <StarRating
                rating={rating}
                size="lg"
                interactive={true}
                onChange={(val) => {
                  setRating(val);
                  setErrorMsg(null);
                }}
              />
              <span className={`text-xs font-mono font-medium ${
                isDark ? 'text-[#d4af37]' : 'text-[#8f6208]'
              }`}>
                {rating > 0 ? `${rating} of 5 Stars` : 'Tap stars to rate'}
              </span>
            </div>
          </div>

          {/* Comment Textarea */}
          <div>
            <label className={`block text-xs font-mono uppercase tracking-wider mb-1.5 font-medium ${
              isDark ? 'text-[#dcd7c9]' : 'text-stone-700'
            }`}>
              Review Comments (Optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="Share your experience with this farmer's produce (e.g. freshness, taste, packaging, ripeness)..."
              className={`w-full px-4 py-3 rounded-xl border text-xs sm:text-sm resize-none outline-hidden transition-all ${
                isDark
                  ? 'bg-[#0a0a09] border-[#d4af37]/25 focus:border-[#d4af37] text-[#fcfbf7] placeholder-[#6b675d]'
                  : 'bg-white border-stone-300 focus:border-[#d4af37] text-[#1c1917] placeholder-stone-400'
              }`}
            />
          </div>

          {/* Optional Photo Attachment Upload */}
          <div>
            <label className={`block text-xs font-mono uppercase tracking-wider mb-1.5 font-medium flex items-center justify-between ${
              isDark ? 'text-[#dcd7c9]' : 'text-stone-700'
            }`}>
              <span>Attach Photos (Optional)</span>
              <span className={`text-[10px] ${isDark ? 'text-[#8e8b82]' : 'text-stone-400'}`}>{photos.length}/3 photos</span>
            </label>

            {/* Drag and Drop Zone */}
            {photos.length < 3 && (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-3.5 rounded-xl border border-dashed transition-all cursor-pointer text-center ${
                  isDragging
                    ? 'border-[#d4af37] bg-[#d4af37]/10'
                    : isDark
                    ? 'border-[#d4af37]/30 hover:border-[#d4af37]/60 bg-[#0a0a09]'
                    : 'border-stone-300 hover:border-[#d4af37] bg-white'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => processFiles(e.target.files)}
                />
                <div className={`flex items-center justify-center gap-2 text-xs ${
                  isDark ? 'text-[#aba79c]' : 'text-stone-600'
                }`}>
                  <Upload className="w-4 h-4 text-[#d4af37]" />
                  <span>Click or drag harvest photos here</span>
                </div>
              </div>
            )}

            {/* Thumbnail Previews */}
            {photos.length > 0 && (
              <div className="mt-2.5 flex items-center gap-2.5 flex-wrap">
                {photos.map((src, idx) => (
                  <div
                    key={idx}
                    className={`relative w-14 h-14 rounded-lg overflow-hidden border group ${
                      isDark ? 'border-[#d4af37]/40' : 'border-stone-300'
                    }`}
                  >
                    <img src={src} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemovePhoto(idx);
                      }}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[#f87171] transition-opacity cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Error Message Notice */}
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-[#261210] border border-[#f87171]/40 text-xs text-[#fca5a5] flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 text-[#f87171] shrink-0" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {/* User Sign-In Role Status */}
          <div className={`p-3 rounded-xl border flex items-center justify-between text-[11px] ${
            isDark ? 'bg-[#14120e] border-[#d4af37]/20 text-[#aba79c]' : 'bg-white border-stone-200 text-stone-600'
          }`}>
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>
                Posting as:{' '}
                <strong className={isDark ? 'text-[#fae69e]' : 'text-[#8f6208]'}>{user?.name || 'Verified Customer'}</strong>
              </span>
            </div>
            <span className="flex items-center gap-1 font-mono text-[10px] text-[#166534] dark:text-[#34d399]">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Escrow
            </span>
          </div>

          {/* Submit Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 py-3 px-4 rounded-xl border font-mono text-xs uppercase tracking-wider transition-all cursor-pointer ${
                isDark
                  ? 'bg-[#14120c] border-[#d4af37]/30 text-[#aba79c] hover:text-[#fcfbf7]'
                  : 'bg-white border-stone-300 text-stone-600 hover:text-[#1c1917]'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-2 py-3 px-6 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#fae69e] to-[#c9a227] text-stone-900 font-bold text-xs uppercase tracking-widest hover:brightness-110 active:scale-[0.99] transition-all shadow-md disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Submitting...</span>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Submit Review</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
