import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number; // 0 to 5 (e.g. 4.6 or 5)
  totalStars?: number; // default 5
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
  onChange?: (rating: number) => void;
  showNumeric?: boolean;
  reviewCount?: number;
  className?: string;
  id?: string;
}

const SIZE_MAP = {
  xs: 'w-3 h-3',
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
  xl: 'w-6 h-6',
};

const RATING_LABELS: Record<number, string> = {
  1: '1 Star — Poor Quality',
  2: '2 Stars — Below Expectations',
  3: '3 Stars — Average / Satisfactory',
  4: '4 Stars — Very Good & Fresh',
  5: '5 Stars — Exceptional Direct Farm Produce',
};

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  totalStars = 5,
  size = 'md',
  interactive = false,
  onChange,
  showNumeric = false,
  reviewCount,
  className = '',
  id,
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const activeRating = interactive && hoverRating !== null ? hoverRating : rating;
  const iconSizeClass = SIZE_MAP[size] || SIZE_MAP.md;

  const handleStarClick = (starValue: number) => {
    if (interactive && onChange) {
      onChange(starValue);
    }
  };

  return (
    <div
      id={id}
      className={`inline-flex items-center gap-1.5 ${className}`}
      onMouseLeave={() => interactive && setHoverRating(null)}
      role={interactive ? 'radiogroup' : undefined}
      aria-label={interactive ? 'Rating selector' : `Rating: ${rating} out of ${totalStars}`}
    >
      <div className="inline-flex items-center gap-0.5">
        {Array.from({ length: totalStars }, (_, index) => {
          const starValue = index + 1;
          const isFilled = activeRating >= starValue;
          const isHalf = !isFilled && activeRating >= starValue - 0.5 && !interactive;

          return (
            <button
              key={index}
              type={interactive ? 'button' : undefined}
              disabled={!interactive}
              onClick={() => handleStarClick(starValue)}
              onMouseEnter={() => interactive && setHoverRating(starValue)}
              className={`relative p-0.5 transition-transform duration-150 ${
                interactive
                  ? 'cursor-pointer hover:scale-125 focus:outline-none focus:ring-1 focus:ring-[#d4af37]'
                  : 'cursor-default pointer-events-none'
              }`}
              title={interactive ? RATING_LABELS[starValue] || `${starValue} Stars` : `${rating} Stars`}
              aria-label={`${starValue} Stars`}
            >
              {isHalf ? (
                <div className="relative">
                  {/* Background Empty Star */}
                  <Star className={`${iconSizeClass} text-[#4a4639]`} strokeWidth={1.5} />
                  {/* Half Clipped Gold Star */}
                  <div className="absolute inset-0 overflow-hidden w-1/2">
                    <Star
                      className={`${iconSizeClass} text-[#d4af37] fill-[#d4af37]`}
                      strokeWidth={1.5}
                    />
                  </div>
                </div>
              ) : (
                <Star
                  className={`${iconSizeClass} transition-colors duration-150 ${
                    isFilled
                      ? 'text-[#d4af37] fill-[#d4af37] filter drop-shadow-[0_0_6px_rgba(212,175,55,0.4)]'
                      : 'text-[#4a4639] fill-transparent'
                  }`}
                  strokeWidth={1.5}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Optional Numeric & Review Count Display */}
      {showNumeric && (
        <span className="text-xs font-mono font-bold text-[#fae69e] ml-1">
          {rating.toFixed(1)}
        </span>
      )}

      {typeof reviewCount === 'number' && (
        <span className="text-[11px] font-sans text-[#8e8b82] tracking-normal">
          ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
        </span>
      )}

      {/* Interactive Helper Label */}
      {interactive && hoverRating !== null && (
        <span className="text-[11px] font-mono text-[#fae69e] ml-2 animate-fadeIn hidden sm:inline">
          {RATING_LABELS[hoverRating]}
        </span>
      )}
    </div>
  );
};
