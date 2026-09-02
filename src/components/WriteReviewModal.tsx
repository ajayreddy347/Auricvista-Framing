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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
        className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#14120e] via-[#0f0e0c] to-[#090807] border-2 border-[#d4af37]/45 p-6 sm:p-8 shadow-[0_0_60px_-15px_rgba(212,175,55,0.35)] z-10 overflow-hidden"
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 bg-[#d4af37]/15 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#aba79c] hover:text-[#fae69e] hover:bg-[#201a0e] transition-colors cursor-pointer"
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
              className="absolute inset-0 z-30 bg-[#0f0e0c]/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-6"
            >
              <div className="w-16 h-16 rounded-full bg-[#1e190e] border border-[#d4af37] flex items-center justify-center text-[#34d399] mb-4 shadow-[0_0_25px_rgba(52,211,153,0.3)]">
                <CheckCircle2 className="w-9 h-9 text-[#34d399]" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#fae69e]">
                Thanks for your review!
              </h3>
              <p className="text-xs text-[#aba79c] mt-2 font-sans max-w-xs">
                Your direct farm rating has been verified and published to {farmerName}’s public dossier.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Header */}
        <div className="mb-6 pr-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#201a0e] border border-[#d4af37]/30 text-[10px] font-mono text-[#fae69e] uppercase tracking-wider mb-2">
            <Sparkles className="w-3 h-3 text-[#d4af37]" />
            <span>Verified Customer Feedback</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#fcfbf7] tracking-tight">
            Review {farmerName}
          </h2>
          {produceName ? (
            <p className="text-xs text-[#d4af37] font-sans mt-0.5">
              Produce: <span className="text-[#f5f3eb] font-medium">{produceName}</span>
            </p>
          ) : (
            <p className="text-xs text-[#aba79c] font-sans mt-0.5">
              Direct Farmer Experience & Harvest Quality
            </p>
          )}
        </div>

        {/* Review Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Rating Stars Input */}
          <div className="p-4 rounded-2xl bg-[#0a0a09] border border-[#d4af37]/25 shadow-inner">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#fae69e] mb-2 font-semibold">
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
              <span className="text-xs font-mono text-[#d4af37]">
                {rating > 0 ? `${rating} of 5 Stars` : 'Tap stars to rate'}
              </span>
            </div>
          </div>

          {/* Comment Textarea */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#dcd7c9] mb-1.5 font-medium">
              Review Comments (Optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="Share your experience with this farmer's produce (e.g. freshness, taste, packaging, ripeness)..."
              className="w-full px-4 py-3 rounded-xl bg-[#0a0a09] border border-[#d4af37]/25 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] text-xs sm:text-sm text-[#fcfbf7] placeholder-[#6b675d] resize-none outline-none transition-all"
            />
          </div>

          {/* Optional Photo Attachment Upload */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#dcd7c9] mb-1.5 font-medium flex items-center justify-between">
              <span>Attach Photos (Optional)</span>
              <span className="text-[10px] text-[#8e8b82]">{photos.length}/3 photos</span>
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
                    : 'border-[#d4af37]/30 hover:border-[#d4af37]/60 bg-[#0a0a09]'
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
                <div className="flex items-center justify-center gap-2 text-xs text-[#aba79c]">
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
                    className="relative w-14 h-14 rounded-lg overflow-hidden border border-[#d4af37]/40 group"
                  >
                    <img src={src} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemovePhoto(idx);
                      }}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[#f87171] transition-opacity"
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
          <div className="p-3 rounded-xl bg-[#14120e] border border-[#d4af37]/20 flex items-center justify-between text-[11px] text-[#aba79c]">
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>
                Posting as:{' '}
                <strong className="text-[#fae69e]">{user?.name || 'Verified Customer'}</strong>
              </span>
            </div>
            <span className="flex items-center gap-1 text-[#34d399] font-mono text-[10px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Escrow
            </span>
          </div>

          {/* Submit Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl bg-[#14120c] border border-[#d4af37]/30 text-[#aba79c] hover:text-[#fcfbf7] hover:border-[#d4af37] font-mono text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-2 py-3 px-6 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#fae69e] to-[#c9a227] text-[#0a0a0a] font-bold text-xs uppercase tracking-widest hover:brightness-110 active:scale-[0.99] transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
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
