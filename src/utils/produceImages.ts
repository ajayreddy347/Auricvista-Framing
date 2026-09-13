import {
  getCanonicalProduct,
  CANONICAL_PRODUCTS,
  CanonicalProduct,
  NEUTRAL_CROP_PLACEHOLDER,
  DATABASE_LISTING_ASSETS,
} from './canonicalProducts';

export interface ProduceLike {
  id?: string;
  name?: string;
  category?: string;
  images?: string[] | string;
  image?: string;
}

export { NEUTRAL_CROP_PLACEHOLDER };

/**
 * Returns the exact verified canonical image URL for any agricultural produce item.
 * Strictly resolves to the single authoritative product identity.
 * 
 * Order of Resolution:
 * 1. Direct database ID lookup or strict canonical product matching
 * 2. Explicit verified local asset path (/assets/produce/...)
 * 3. Clean neutral placeholder (NEVER a wrong crop or unrelated food)
 */
export function getProduceImage(produce?: ProduceLike | string | null): string {
  if (!produce) {
    return NEUTRAL_CROP_PLACEHOLDER;
  }

  // 1. Direct Product ID or Name Canonical Resolution
  const canonical = getCanonicalProduct(produce);
  if (canonical && canonical.image) {
    return canonical.image;
  }

  // 2. If object with explicit verified local asset path
  if (typeof produce === 'object') {
    if (Array.isArray(produce.images) && produce.images.length > 0 && typeof produce.images[0] === 'string') {
      const url = produce.images[0].trim();
      if (url.startsWith('/assets/produce/')) return url;
    }
    if (typeof produce.image === 'string' && produce.image.trim().startsWith('/assets/produce/')) {
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

export { CANONICAL_PRODUCTS, DATABASE_LISTING_ASSETS };
export type { CanonicalProduct };
