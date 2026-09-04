import { getCanonicalProduct, CANONICAL_PRODUCTS, CanonicalProduct } from './canonicalProducts';

export interface ProduceLike {
  id?: string;
  name?: string;
  category?: string;
  images?: string[] | string;
  image?: string;
}

// Neutral placeholder if a product is ever completely unrecognized (NEVER return a wrong crop)
export const NEUTRAL_CROP_PLACEHOLDER =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800" fill="%230c0a07"><rect width="800" height="800" fill="%2312100c"/><circle cx="400" cy="380" r="140" fill="%231c180e" stroke="%23d4af37" stroke-width="3" stroke-dasharray="6,6"/><path d="M400 300 C430 300 450 330 450 370 C450 410 420 440 400 450 C380 440 350 410 350 370 C350 330 370 300 400 300 Z" fill="none" stroke="%23d4af37" stroke-width="4"/><text x="400" y="580" text-anchor="middle" font-family="sans-serif" font-size="22" font-weight="bold" fill="%23fae69e" letter-spacing="2">AUTHENTIC INDIAN HARVEST</text><text x="400" y="615" text-anchor="middle" font-family="monospace" font-size="14" fill="%238e8b82">Direct from Verified Organic Farm</text></svg>';

/**
 * Returns the exact verified canonical image URL for any agricultural produce item.
 * Strictly resolves to the single authoritative product identity.
 */
export function getProduceImage(produce?: ProduceLike | string | null): string {
  if (!produce) {
    return NEUTRAL_CROP_PLACEHOLDER;
  }

  // 1. Strict Canonical Product Registry Resolution (Priority 1)
  const canonical = getCanonicalProduct(produce);
  if (canonical) {
    return canonical.image;
  }

  // 2. If object with explicit verified local asset path
  if (typeof produce === 'object') {
    if (Array.isArray(produce.images) && produce.images.length > 0 && typeof produce.images[0] === 'string') {
      const url = produce.images[0].trim();
      if (url.startsWith('/assets/')) return url;
    }
    if (typeof produce.image === 'string' && produce.image.trim().startsWith('/assets/')) {
      return produce.image.trim();
    }
  }

  // 3. Neutral fallback: NEVER return a wrong crop
  return NEUTRAL_CROP_PLACEHOLDER;
}

/**
 * Returns the canonical slug ID (e.g. "dragon-fruit", "rajma", "toor-dal")
 */
export function getProduceCanonicalId(produce?: ProduceLike | string | null): string {
  const canonical = getCanonicalProduct(produce);
  return canonical ? canonical.id : 'unknown-produce';
}

/**
 * Returns the canonical display name
 */
export function getProduceCanonicalName(produce?: ProduceLike | string | null): string {
  const canonical = getCanonicalProduct(produce);
  return canonical ? canonical.name : (typeof produce === 'string' ? produce : produce?.name || 'Produce');
}

export { CANONICAL_PRODUCTS };
export type { CanonicalProduct };
