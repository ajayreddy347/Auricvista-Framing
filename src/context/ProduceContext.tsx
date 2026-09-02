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
  farmerId?: string;
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

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  try {
    const token = localStorage.getItem('auricvista_auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  } catch {
    // Storage restricted
  }
  return headers;
}

export const ProduceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [listings, setListings] = useState<ProduceListing[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
        const errorData = await res.json().catch(() => ({}));
        setError(errorData.error || 'Failed to load produce catalog from server');
      }
    } catch (err: any) {
      console.error('Failed to fetch produce catalog:', err);
      setError('Unable to connect to produce service. Please check your network connection.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshListings();
  }, [refreshListings]);

  const addListing = async (data: Omit<ProduceListing, 'id' | 'createdAt'>): Promise<ProduceListing> => {
    const res = await fetch('/api/produce', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        ...data,
        pricePerUnit: data.pricePerUnit,
        quantity: data.quantity,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      const msg = result.error || 'Failed to create produce listing';
      throw new Error(msg);
    }

    const created: ProduceListing = result;
    setListings((prev) => [created, ...prev.filter((item) => item.id !== created.id)]);
    return created;
  };

  const saveDraft = async (data: Omit<ProduceListing, 'id' | 'createdAt'>): Promise<ProduceListing> => {
    const res = await fetch('/api/produce', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        ...data,
        status: 'Draft',
        pricePerUnit: data.pricePerUnit,
        quantity: data.quantity,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      const msg = result.error || 'Failed to save draft listing';
      throw new Error(msg);
    }

    const created: ProduceListing = result;
    setListings((prev) => [created, ...prev.filter((item) => item.id !== created.id)]);
    return created;
  };

  const removeListing = async (id: string): Promise<void> => {
    const res = await fetch(`/api/produce/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to delete listing ${id}`);
    }

    setListings((prev) => prev.filter((item) => item.id !== id));
  };

  const updateListingStatus = async (id: string, status: 'Active' | 'Draft' | 'Sold Out'): Promise<void> => {
    const res = await fetch(`/api/produce/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to update listing status for ${id}`);
    }

    const updated = await res.json();
    setListings((prev) =>
      prev.map((item) => (item.id === id ? { ...updated } : item))
    );
  };

  const updateListing = async (id: string, updates: Partial<ProduceListing>): Promise<ProduceListing | null> => {
    const res = await fetch(`/api/produce/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to update listing ${id}`);
    }

    const saved = await res.json();
    setListings((prev) =>
      prev.map((item) => (item.id === id ? { ...saved } : item))
    );
    return saved;
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
