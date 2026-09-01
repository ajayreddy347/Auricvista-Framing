import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface CustomerReview {
  id: string;
  farmerId: string;
  farmerName?: string;
  produceId?: string;
  produceName?: string;
  customerName: string;
  customerEmail?: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  verified: boolean;
  photos?: string[];
  helpfulCount?: number;
  isUserReviewed?: boolean;
}

export interface RatingStats {
  average: number;
  totalCount: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

interface ReviewsContextType {
  reviews: CustomerReview[];
  isLoading: boolean;
  error: string | null;
  refreshReviews: () => Promise<void>;
  getFarmerReviews: (farmerId: string) => CustomerReview[];
  getFarmerStats: (farmerId: string) => RatingStats;
  getProductReviews: (produceId: string) => CustomerReview[];
  getProductStats: (produceId: string) => { average: number; totalCount: number };
  addReview: (data: Omit<CustomerReview, 'id' | 'date'>) => Promise<CustomerReview>;
  toggleHelpful: (reviewId: string) => void;
}

const STORAGE_KEY = 'auricvista_customer_reviews';

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

const INITIAL_MOCK_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-rk-1',
    farmerId: 'ravi-kumar',
    farmerName: 'Ravi Kumar',
    produceId: 'PROD-101',
    produceName: 'Heirloom Vine Tomatoes',
    customerName: 'Ananya Sharma',
    rating: 5,
    comment:
      'The heirloom vine tomatoes arrived within 14 hours of dawn harvest. The aroma took me back to my grandparents farm in Karnataka. Super juicy with vibrant deep crimson flesh!',
    date: '2026-08-28',
    verified: true,
    photos: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400'],
    helpfulCount: 24,
  },
  {
    id: 'rev-rk-2',
    farmerId: 'ravi-kumar',
    farmerName: 'Ravi Kumar',
    produceId: 'PROD-102',
    produceName: 'Hydroponic Baby Spinach',
    customerName: 'Vikramaditya Sengupta',
    rating: 5,
    comment:
      'The hydroponic baby spinach had crisp, unbruised leaves with zero pesticide residue. You can taste the purity right in raw salads.',
    date: '2026-08-25',
    verified: true,
    photos: ['https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=400'],
    helpfulCount: 18,
  },
  {
    id: 'rev-ld-1',
    farmerId: 'lakshmi-devi',
    farmerName: 'Lakshmi Devi',
    customerName: 'Priya Nambiar',
    rating: 5,
    comment:
      'Lakshmi Devi’s hydroponic salad greens are the best in Bengaluru. Crisp, immaculate, and stay fresh in the fridge for over a week.',
    date: '2026-08-20',
    verified: true,
    helpfulCount: 31,
  },
];

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export const ReviewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<CustomerReview[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_MOCK_REVIEWS;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
    } catch {
      // Storage restricted
    }
  }, [reviews]);

  const refreshReviews = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/reviews');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setReviews(data);
        }
      }
    } catch (err: any) {
      console.warn('Reviews loaded from cache:', err.message);
      setError('Offline mode: Using cached reviews');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshReviews();
  }, [refreshReviews]);

  const getFarmerReviews = useCallback(
    (farmerId: string) => {
      const normId = farmerId.toLowerCase();
      return reviews.filter(
        (r) =>
          r.farmerId.toLowerCase() === normId ||
          (r.farmerName && r.farmerName.toLowerCase().replace(/[^a-z0-9]+/g, '-').includes(normId))
      );
    },
    [reviews]
  );

  const getFarmerStats = useCallback(
    (farmerId: string): RatingStats => {
      const farmerReviews = getFarmerReviews(farmerId);
      if (farmerReviews.length === 0) {
        return {
          average: 4.9,
          totalCount: 0,
          distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        };
      }

      const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      let sum = 0;

      farmerReviews.forEach((r) => {
        sum += r.rating;
        const rounded = Math.round(r.rating) as 1 | 2 | 3 | 4 | 5;
        if (rounded >= 1 && rounded <= 5) {
          distribution[rounded] = (distribution[rounded] || 0) + 1;
        }
      });

      return {
        average: parseFloat((sum / farmerReviews.length).toFixed(1)),
        totalCount: farmerReviews.length,
        distribution,
      };
    },
    [getFarmerReviews]
  );

  const getProductReviews = useCallback(
    (produceId: string) => {
      return reviews.filter((r) => r.produceId === produceId);
    },
    [reviews]
  );

  const getProductStats = useCallback(
    (produceId: string) => {
      const productReviews = getProductReviews(produceId);
      if (productReviews.length === 0) {
        return { average: 4.9, totalCount: 12 };
      }
      const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
      return {
        average: parseFloat((sum / productReviews.length).toFixed(1)),
        totalCount: productReviews.length,
      };
    },
    [getProductReviews]
  );

  const addReview = async (data: Omit<CustomerReview, 'id' | 'date'>): Promise<CustomerReview> => {
    const tempId = `REV-${Date.now().toString().slice(-6)}`;
    const newReview: CustomerReview = {
      ...data,
      id: tempId,
      date: new Date().toISOString().split('T')[0],
      helpfulCount: 0,
      isUserReviewed: true,
    };

    setReviews((prev) => [newReview, ...prev]);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const saved = await res.json();
        setReviews((prev) =>
          prev.map((r) => (r.id === tempId ? { ...saved, isUserReviewed: true } : r))
        );
        return saved;
      }
    } catch (err) {
      console.warn('Review saved locally, backend sync failed:', err);
    }

    return newReview;
  };

  const toggleHelpful = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          return {
            ...r,
            helpfulCount: (r.helpfulCount || 0) + 1,
          };
        }
        return r;
      })
    );
  };

  return (
    <ReviewsContext.Provider
      value={{
        reviews,
        isLoading,
        error,
        refreshReviews,
        getFarmerReviews,
        getFarmerStats,
        getProductReviews,
        getProductStats,
        addReview,
        toggleHelpful,
      }}
    >
      {children}
    </ReviewsContext.Provider>
  );
};

export const useReviews = (): ReviewsContextType => {
  const context = useContext(ReviewsContext);
  if (!context) {
    throw new Error('useReviews must be used within a ReviewsProvider');
  }
  return context;
};
