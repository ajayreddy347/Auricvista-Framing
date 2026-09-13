import React, { useState, useEffect } from 'react';
import {
  Wheat,
  Carrot,
  Apple,
  Leaf,
  Sprout,
  Sparkles,
  Flame,
  Droplets,
  CircleDot,
  ShoppingBag,
} from 'lucide-react';

export interface ProductImageProps {
  src?: string | null;
  alt: string;
  productName?: string;
  category?: string;
  className?: string;
  containerClassName?: string;
  loading?: 'lazy' | 'eager';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'detail' | 'fill';
  showLabel?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

interface ProductIconMeta {
  icon: React.ElementType;
  label: string;
  accentColor: string;
}

/**
 * Resolves a product-specific line illustration / icon based on category and name keywords.
 */
export function getProductIconMeta(name?: string, category?: string): ProductIconMeta {
  const n = (name || '').toLowerCase();
  const c = (category || '').toLowerCase();

  // 1. Grains & Cereals
  if (
    c.includes('grain') ||
    c.includes('cereal') ||
    n.includes('rice') ||
    n.includes('wheat') ||
    n.includes('atta') ||
    n.includes('basmati') ||
    n.includes('gobindobhog') ||
    n.includes('brown rice') ||
    n.includes('black rice') ||
    n.includes('dheki') ||
    n.includes('kala bhat') ||
    n.includes('barley') ||
    n.includes('millet') ||
    n.includes('ragi') ||
    n.includes('jowar') ||
    n.includes('bajra') ||
    n.includes('oats')
  ) {
    return { icon: Wheat, label: 'Heritage Grain', accentColor: 'text-[#fae69e]' };
  }

  // 2. Pulses & Dals
  if (
    c.includes('pulse') ||
    c.includes('dal') ||
    n.includes('dal') ||
    n.includes('chana') ||
    n.includes('rajma') ||
    n.includes('gram') ||
    n.includes('lentil') ||
    n.includes('beans') ||
    n.includes('peas') ||
    n.includes('matar') ||
    n.includes('kala chana') ||
    n.includes('toor') ||
    n.includes('moong') ||
    n.includes('urad') ||
    n.includes('masoor')
  ) {
    return { icon: CircleDot, label: 'Native Pulse', accentColor: 'text-[#fcd34d]' };
  }

  // 3. Spices & Seasonings
  if (
    c.includes('spice') ||
    c.includes('seasoning') ||
    n.includes('saffron') ||
    n.includes('clove') ||
    n.includes('cardamom') ||
    n.includes('cinnamon') ||
    n.includes('pepper') ||
    n.includes('turmeric') ||
    n.includes('mustard seed') ||
    n.includes('sarson') ||
    n.includes('dhaniya') ||
    n.includes('coriander seed') ||
    n.includes('cumin') ||
    n.includes('jeera') ||
    n.includes('fennel') ||
    n.includes('kokum') ||
    n.includes('aamsul') ||
    n.includes('ginger') ||
    n.includes('garlic')
  ) {
    return { icon: Sparkles, label: 'Aromatic Spice', accentColor: 'text-[#f59e0b]' };
  }

  // 4. Herbs & Leafy Greens
  if (
    c.includes('herb') ||
    c.includes('leaf') ||
    c.includes('green') ||
    n.includes('saag') ||
    n.includes('spinach') ||
    n.includes('palak') ||
    n.includes('methi') ||
    n.includes('mustard green') ||
    n.includes('mint') ||
    n.includes('pudina') ||
    n.includes('coriander leaf') ||
    n.includes('curry leaf')
  ) {
    return { icon: Leaf, label: 'Fresh Green', accentColor: 'text-[#86efac]' };
  }

  // 5. Fruits
  if (
    c.includes('fruit') ||
    n.includes('mango') ||
    n.includes('banana') ||
    n.includes('apple') ||
    n.includes('guava') ||
    n.includes('coconut') ||
    n.includes('pomegranate') ||
    n.includes('dragon') ||
    n.includes('orange') ||
    n.includes('papaya') ||
    n.includes('melon') ||
    n.includes('grapes')
  ) {
    return { icon: Apple, label: 'Fresh Fruit', accentColor: 'text-[#f87171]' };
  }

  // 6. Vegetables
  if (
    c.includes('vegetable') ||
    n.includes('carrot') ||
    n.includes('beetroot') ||
    n.includes('drumstick') ||
    n.includes('moringa') ||
    n.includes('brinjal') ||
    n.includes('eggplant') ||
    n.includes('radish') ||
    n.includes('mooli') ||
    n.includes('tapioca') ||
    n.includes('potato') ||
    n.includes('onion') ||
    n.includes('tomato') ||
    n.includes('cauliflower') ||
    n.includes('cabbage') ||
    n.includes('capsicum') ||
    n.includes('chilli') ||
    n.includes('okra') ||
    n.includes('bhindi') ||
    n.includes('gourd') ||
    n.includes('cucumber')
  ) {
    return { icon: Carrot, label: 'Farm Vegetable', accentColor: 'text-[#fb923c]' };
  }

  // 7. Oils, Ghee & Sweeteners
  if (
    n.includes('oil') ||
    n.includes('ghee') ||
    n.includes('honey') ||
    n.includes('jaggery') ||
    n.includes('gur')
  ) {
    return { icon: Droplets, label: 'Cold-Pressed & Pure', accentColor: 'text-[#38bdf8]' };
  }

  // Default General Produce
  return { icon: Sprout, label: 'Organic Produce', accentColor: 'text-[#34d399]' };
}

/**
 * Reusable, bulletproof product image component for Auric Arohi.
 * 
 * Rules:
 * 1. Verified correct product photo -> displays it cleanly.
 * 2. Missing/unverified/neutral-placeholder image -> displays a bespoke, luxury
 *    Auric Arohi product fallback with dark earthy background, metallic gold glow,
 *    product-specific line icon, and title.
 * 3. Automatic error handling -> if an image fails to load, immediately switches
 *    to the fallback without showing any broken image icons or blank boxes.
 * 4. Never pretends to be a photograph; clearly functions as a dignified artisan crest.
 */
import { useTheme } from '../context/ThemeContext';

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  productName,
  category,
  className = 'w-full h-full object-cover',
  containerClassName = '',
  loading = 'lazy',
  size = 'fill',
  showLabel,
  onClick,
}) => {
  const { isDark } = useTheme();
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Reset states whenever src changes
  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);
  }, [src]);

  const displayName = productName || alt || 'Organic Produce';
  const iconMeta = getProductIconMeta(displayName, category);
  const IconComponent = iconMeta.icon;

  // Determine if we should display the fallback placeholder
  const isNeutralPlaceholder = typeof src === 'string' && src.includes('neutral-placeholder');
  const isBlank = !src || src.trim() === '';
  const shouldShowFallback = isBlank || isNeutralPlaceholder || hasError;

  // Determine if "Image coming soon" label should display
  const shouldDisplayBadge =
    showLabel !== undefined ? showLabel : size === 'md' || size === 'lg' || size === 'detail' || size === 'fill';

  // Small thumbnail mode (e.g. Cart, Checkout, Order confirmed item thumbs)
  const isThumbnail = size === 'xs' || size === 'sm';

  if (shouldShowFallback) {
    if (isThumbnail) {
      return (
        <div
          onClick={onClick}
          className={`relative w-full h-full flex flex-col items-center justify-center border rounded-xl overflow-hidden select-none transition-colors ${
            isDark
              ? 'bg-gradient-to-br from-[#16130d] via-[#100e0a] to-[#0a0907] border-[#d4af37]/30'
              : 'bg-gradient-to-br from-[#fcfbf9] via-[#f7f4ed] to-[#ede7dc] border-[#d4af37]/30'
          } ${containerClassName}`}
          title={`${displayName} - Image coming soon`}
        >
          {/* Subtle concentric gold glow */}
          <div className="absolute inset-0 bg-radial from-[#d4af37]/15 to-transparent pointer-events-none" />
          <div
            className={`relative z-10 w-7 h-7 rounded-lg border flex items-center justify-center shadow-sm ${
              isDark
                ? 'bg-[#1c180f] border-[#d4af37]/30 text-[#fae69e]'
                : 'bg-white border-[#d4af37]/40 text-[#8f6208]'
            }`}
          >
            <IconComponent className="w-4 h-4" />
          </div>
        </div>
      );
    }

    // Medium / Large / Detail / Grid card mode
    return (
      <div
        onClick={onClick}
        className={`relative w-full h-full flex flex-col items-center justify-center p-4 text-center overflow-hidden border transition-colors select-none ${
          isDark
            ? 'bg-gradient-to-b from-[#18140e] via-[#110f0a] to-[#090806] border-[#d4af37]/25 shadow-[inset_0_0_30px_rgba(212,175,55,0.06)]'
            : 'bg-gradient-to-b from-[#ffffff] via-[#faf8f4] to-[#f2ede4] border-[#e7e3da] shadow-[inset_0_0_20px_rgba(212,175,55,0.04)]'
        } ${containerClassName}`}
      >
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute inset-0 bg-radial from-[#d4af37]/10 via-[#d4af37]/3 to-transparent pointer-events-none" />

        {/* Decorative Concentric Circular Hairlines */}
        <svg
          className={`absolute inset-0 w-full h-full pointer-events-none ${isDark ? 'opacity-20' : 'opacity-30'}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="50%" cy="45%" r="55" fill="none" stroke="#d4af37" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="50%" cy="45%" r="85" fill="none" stroke="#d4af37" strokeWidth="0.75" opacity="0.5" />
        </svg>

        {/* Floating Artisan Icon Crest */}
        <div
          className={`relative z-10 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 flex items-center justify-center shadow-md mb-2 group-hover:scale-105 transition-transform duration-300 ${
            isDark
              ? 'bg-gradient-to-br from-[#241d12] via-[#1a150d] to-[#0d0b07] border-[#d4af37]/45 text-[#fae69e] shadow-[0_0_20px_rgba(212,175,55,0.25)]'
              : 'bg-white border-[#d4af37]/50 text-[#8f6208] shadow-[0_4px_15px_rgba(184,134,11,0.15)]'
          }`}
        >
          <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 filter drop-shadow-sm" />
        </div>

        {/* Product Identity Typography */}
        <div className="relative z-10 max-w-[90%] space-y-1">
          <h4
            className={`font-serif font-bold text-xs sm:text-sm tracking-wide line-clamp-1 transition-colors drop-shadow-sm ${
              isDark ? 'text-[#fcfbf7] group-hover:text-[#fae69e]' : 'text-[#1c1917] group-hover:text-[#8f6208]'
            }`}
          >
            {displayName}
          </h4>
          <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-[#a16207]">
            {category || iconMeta.label}
          </p>
        </div>

        {/* Coming Soon Pill Tag */}
        {shouldDisplayBadge && (
          <div
            className={`relative z-10 mt-2.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[8px] sm:text-[9px] font-mono uppercase tracking-widest shadow-xs ${
              isDark
                ? 'bg-[#14110b]/90 border-[#d4af37]/30 text-[#a8a29e]'
                : 'bg-white border-[#d4af37]/35 text-[#57534e]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
            <span>Image coming soon</span>
          </div>
        )}
      </div>
    );
  }

  // If verified photo exists, render with seamless error handling
  return (
    <div
      onClick={onClick}
      className={`relative w-full h-full overflow-hidden ${
        isDark ? 'bg-[#16130e]' : 'bg-[#f4efe6]'
      } ${containerClassName}`}
    >
      <img
        src={src!}
        alt={alt}
        className={`${className} ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-300`}
        loading={loading}
        onError={() => setHasError(true)}
        onLoad={() => setIsLoaded(true)}
      />

      {/* Loading Skeleton Placeholder before image fully paints */}
      {!isLoaded && !hasError && (
        <div
          className={`absolute inset-0 flex items-center justify-center animate-pulse ${
            isDark
              ? 'bg-gradient-to-br from-[#18140e] to-[#0a0907]'
              : 'bg-gradient-to-br from-[#fbf9f6] to-[#ebe4d8]'
          }`}
        >
          <div className="w-8 h-8 rounded-full border-2 border-[#d4af37]/30 border-t-[#fae69e] animate-spin" />
        </div>
      )}
    </div>
  );
};
