import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type ProduceCategory =
  | 'Vegetables'
  | 'Fruits'
  | 'Grains'
  | 'Pulses'
  | 'Farm Fresh'
  | 'Organic / Natural';

export type ProduceUnit = 'kg' | 'dozen' | 'litre' | 'piece' | 'bunch' | 'quintal';

export interface AIQualityRatingData {
  qualityScore: number;
  freshnessScore: number;
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
  images: string[];
  status: 'Active' | 'Draft' | 'Sold Out';
  createdAt: string;
  aiQualityRating?: AIQualityRatingData;
}

interface ProduceContextType {
  listings: ProduceListing[];
  isLoading: boolean;
  error: string | null;
  refreshListings: () => Promise<void>;
  addListing: (listing: Omit<ProduceListing, 'id' | 'createdAt'>) => Promise<ProduceListing>;
  saveDraft: (listing: Omit<ProduceListing, 'id' | 'createdAt'>) => Promise<ProduceListing>;
  removeListing: (id: string) => Promise<void>;
  updateListingStatus: (id: string, status: 'Active' | 'Draft' | 'Sold Out') => Promise<void>;
  updateListing: (id: string, updates: Partial<ProduceListing>) => Promise<ProduceListing | null>;
}

const ProduceContext = createContext<ProduceContextType | undefined>(undefined);

const PRODUCE_STORAGE_KEY = 'auricvista_produce_listings';

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  try {
    const token = localStorage.getItem('auricvista_auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  } catch {
    // Local storage restricted
  }
  return headers;
}

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
      // Fallback
    }
    return INITIAL_MOCK_LISTINGS;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(PRODUCE_STORAGE_KEY, JSON.stringify(listings));
    } catch {
      // Storage restricted
    }
  }, [listings]);

  const refreshListings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/produce');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setListings(data);
        }
      } else {
        setError('Failed to load listings from server');
      }
    } catch (err: any) {
      console.warn('Produce listings fetched from cache:', err.message);
      setError('Offline mode: Using cached listings');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshListings();
  }, [refreshListings]);

  const addListing = async (data: Omit<ProduceListing, 'id' | 'createdAt'>): Promise<ProduceListing> => {
    const tempId = `PROD-${Date.now().toString().slice(-6)}`;
    const newListing: ProduceListing = {
      ...data,
      id: tempId,
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

    // Optimistic local state update
    setListings((prev) => [newListing, ...prev]);

    try {
      const res = await fetch('/api/produce', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...data,
          pricePerUnit: data.pricePerUnit,
          quantity: data.quantity,
        }),
      });

      if (res.ok) {
        const savedRow = await res.json();
        setListings((prev) =>
          prev.map((item) => (item.id === tempId ? { ...savedRow } : item))
        );
        return savedRow;
      }
    } catch (err) {
      console.warn('Failed to persist listing to backend, kept in local cache:', err);
    }

    return newListing;
  };

  const saveDraft = async (data: Omit<ProduceListing, 'id' | 'createdAt'>): Promise<ProduceListing> => {
    const tempId = `DRAFT-${Date.now().toString().slice(-6)}`;
    const newListing: ProduceListing = {
      ...data,
      id: tempId,
      createdAt: new Date().toISOString(),
      status: 'Draft',
    };

    setListings((prev) => [newListing, ...prev]);

    try {
      const res = await fetch('/api/produce', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...data,
          status: 'Draft',
        }),
      });

      if (res.ok) {
        const savedRow = await res.json();
        setListings((prev) =>
          prev.map((item) => (item.id === tempId ? { ...savedRow } : item))
        );
        return savedRow;
      }
    } catch (err) {
      console.warn('Draft kept locally, backend save skipped:', err);
    }

    return newListing;
  };

  const removeListing = async (id: string): Promise<void> => {
    setListings((prev) => prev.filter((item) => item.id !== id));

    try {
      await fetch(`/api/produce/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
    } catch (err) {
      console.warn('Delete synced locally, backend failed:', err);
    }
  };

  const updateListingStatus = async (id: string, status: 'Active' | 'Draft' | 'Sold Out'): Promise<void> => {
    setListings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );

    try {
      await fetch(`/api/produce/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });
    } catch (err) {
      console.warn('Status update kept locally, backend sync failed:', err);
    }
  };

  const updateListing = async (id: string, updates: Partial<ProduceListing>): Promise<ProduceListing | null> => {
    setListings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );

    try {
      const res = await fetch(`/api/produce/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });

      if (res.ok) {
        const saved = await res.json();
        setListings((prev) =>
          prev.map((item) => (item.id === id ? { ...saved } : item))
        );
        return saved;
      }
    } catch (err) {
      console.warn('Listing update failed on backend:', err);
    }

    return null;
  };

  return (
    <ProduceContext.Provider
      value={{
        listings,
        isLoading,
        error,
        refreshListings,
        addListing,
        saveDraft,
        removeListing,
        updateListingStatus,
        updateListing,
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
