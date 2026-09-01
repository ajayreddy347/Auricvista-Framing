import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * =========================================================================
 * PRODUCE LISTINGS CONTEXT & LOCAL STORAGE STATE
 * =========================================================================
 * NOTE / BACKEND & AI INTEGRATION PLACEHOLDER:
 * - This provides mock client-side persistence (LocalStorage) for farmer listings.
 * - In the next build step, image uploads will be sent to cloud storage (e.g. S3,
 *   Cloud Storage / Firebase Storage) and the AI quality analysis will call the
 *   Gemini Multimodal API to compute freshness, ripeness, and grading metrics.
 * =========================================================================
 */

export type ProduceCategory =
  | 'Vegetables'
  | 'Fruits'
  | 'Grains'
  | 'Pulses'
  | 'Farm Fresh'
  | 'Organic / Natural';

export type ProduceUnit = 'kg' | 'dozen' | 'litre' | 'piece' | 'bunch' | 'quintal';

export interface AIQualityRatingData {
  qualityScore: number; // 1.0 to 10.0
  freshnessScore: number; // e.g. 94 (%)
  freshnessLabel: 'Excellent' | 'Good' | 'Fair' | 'Needs Improvement';
  notes: string;
  tags: string[];
  grade?: string;
  badge?: string;
  analysisNote?: string;
  analyzedPhotosCount?: number;
  perImageResults?: Array<{
    imageUrl?: string;
    qualityScore: number;
    freshnessLabel: string;
    notes: string;
    tags: string[];
  }>;
}

export interface ProduceListing {
  id: string;
  name: string;
  category: ProduceCategory;
  quantity: number;
  unit: ProduceUnit;
  pricePerUnit: number;
  harvestDate: string;
  farmLocation: string;
  farmerName: string;
  farmerEmail?: string;
  description?: string;
  images: string[]; // local URLs / base64 thumbnails
  status: 'Active' | 'Draft' | 'Sold Out';
  createdAt: string;
  aiQualityRating?: AIQualityRatingData;
}

interface ProduceContextType {
  listings: ProduceListing[];
  addListing: (listing: Omit<ProduceListing, 'id' | 'createdAt'>) => ProduceListing;
  saveDraft: (listing: Omit<ProduceListing, 'id' | 'createdAt'>) => ProduceListing;
  removeListing: (id: string) => void;
  updateListingStatus: (id: string, status: 'Active' | 'Draft' | 'Sold Out') => void;
}

const ProduceContext = createContext<ProduceContextType | undefined>(undefined);

const PRODUCE_STORAGE_KEY = 'auricvista_produce_listings';

const INITIAL_MOCK_LISTINGS: ProduceListing[] = [
  {
    id: 'PROD-101',
    name: 'Heirloom Vine Tomatoes',
    category: 'Vegetables',
    quantity: 80,
    unit: 'kg',
    pricePerUnit: 35,
    harvestDate: '2026-08-31',
    farmLocation: 'Kumar Organic Heritage Farm, Chikkaballapur Valley',
    farmerName: 'Ravi Kumar',
    farmerEmail: 'ravi.kumar@auricvista.farm',
    description: 'Vine-ripened, sun-kissed naturally pollinated tomatoes harvested at dawn with exceptional sweetness and high lycopene content.',
    images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800'],
    status: 'Active',
    createdAt: '2026-08-31T06:00:00Z',
    aiQualityRating: {
      qualityScore: 9.8,
      freshnessScore: 98,
      freshnessLabel: 'Excellent',
      grade: 'Grade A+ Premium',
      badge: 'Peak Crispness',
      notes: 'High turgor pressure detected; uniform vibrant pigmentation with zero blemish markers.',
      analysisNote: 'High turgor pressure detected; uniform vibrant pigmentation with zero blemish markers.',
      tags: ['Peak Crispness', 'Uniform Color', 'Grade A+'],
    },
  },
  {
    id: 'PROD-102',
    name: 'Hydroponic Baby Spinach',
    category: 'Vegetables',
    quantity: 45,
    unit: 'bunch',
    pricePerUnit: 40,
    harvestDate: '2026-08-31',
    farmLocation: 'Kumar Organic Heritage Farm, Chikkaballapur Valley',
    farmerName: 'Ravi Kumar',
    farmerEmail: 'ravi.kumar@auricvista.farm',
    description: 'Pesticide-free hydroponically grown crisp baby spinach leaves harvested fresh with roots intact in mineral-rich cold water.',
    images: ['https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=800'],
    status: 'Active',
    createdAt: '2026-08-31T05:30:00Z',
    aiQualityRating: {
      qualityScore: 9.9,
      freshnessScore: 99,
      freshnessLabel: 'Excellent',
      grade: 'Grade A+ Organic',
      badge: 'Zero-Nitrate Residue',
      notes: 'Pristine chlorophyll density and intact crisp leaf margins.',
      analysisNote: 'Pristine chlorophyll density and intact crisp leaf margins.',
      tags: ['Zero Chemical', 'Crisp Leaves', 'Hydroponic'],
    },
  },
  {
    id: 'PROD-103',
    name: 'Heritage Rainbow Carrots',
    category: 'Vegetables',
    quantity: 120,
    unit: 'kg',
    pricePerUnit: 50,
    harvestDate: '2026-08-30',
    farmLocation: 'Kumar Organic Heritage Farm, Chikkaballapur Valley',
    farmerName: 'Ravi Kumar',
    farmerEmail: 'ravi.kumar@auricvista.farm',
    description: 'Deep purple, yellow and deep orange sweet heirloom carrots rich in natural antioxidants and soil minerals.',
    images: ['https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=800'],
    status: 'Active',
    createdAt: '2026-08-30T10:00:00Z',
    aiQualityRating: {
      qualityScore: 9.6,
      freshnessScore: 96,
      freshnessLabel: 'Excellent',
      grade: 'Grade A Export',
      badge: 'Mineral Rich',
      notes: 'Excellent root firmness and intact natural skin bloom.',
      analysisNote: 'Excellent root firmness and intact natural skin bloom.',
      tags: ['Heritage Heirloom', 'Firm Root', 'High Lycopene'],
    },
  },
];

export const ProduceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [listings, setListings] = useState<ProduceListing[]>(() => {
    try {
      const saved = localStorage.getItem(PRODUCE_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return INITIAL_MOCK_LISTINGS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(PRODUCE_STORAGE_KEY, JSON.stringify(listings));
    } catch {
      // storage quota or restriction
    }
  }, [listings]);

  const addListing = (data: Omit<ProduceListing, 'id' | 'createdAt'>): ProduceListing => {
    const newListing: ProduceListing = {
      ...data,
      id: `PROD-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      status: 'Active',
      aiQualityRating: data.aiQualityRating || {
        qualityScore: 9.6,
        freshnessScore: 96,
        freshnessLabel: 'Excellent',
        grade: 'Grade A+ Premium',
        badge: 'Direct Farm Harvest',
        notes: 'Visual analysis suggests optimal harvest maturity and high moisture retention.',
        tags: ['Fresh Picked', 'Grade A+'],
      },
    };

    setListings((prev) => [newListing, ...prev]);
    return newListing;
  };

  const saveDraft = (data: Omit<ProduceListing, 'id' | 'createdAt'>): ProduceListing => {
    const newListing: ProduceListing = {
      ...data,
      id: `DRAFT-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      status: 'Draft',
    };

    setListings((prev) => [newListing, ...prev]);
    return newListing;
  };

  const removeListing = (id: string) => {
    setListings((prev) => prev.filter((item) => item.id !== id));
  };

  const updateListingStatus = (id: string, status: 'Active' | 'Draft' | 'Sold Out') => {
    setListings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  return (
    <ProduceContext.Provider
      value={{
        listings,
        addListing,
        saveDraft,
        removeListing,
        updateListingStatus,
      }}
    >
      {children}
    </ProduceContext.Provider>
  );
};

export const useProduce = (): ProduceContextType => {
  const context = useContext(ProduceContext);
  if (!context) {
    throw new Error('useProduce must be used within a ProduceProvider');
  }
  return context;
};
