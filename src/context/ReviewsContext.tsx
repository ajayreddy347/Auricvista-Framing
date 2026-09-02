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

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export const ReviewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
      } else {
        const errData = await res.json().catch(() => ({}));
        setError(errData.error || 'Failed to load reviews from server');
      }
    } catch (err: any) {
      console.error('Failed to fetch reviews:', err);
      setError('Unable to reach reviews service. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshReviews();
  }, [refreshReviews]);

  const getFarmerReviews = useCallback(
    (farmerId: string) => {
      const normId = farmerId.toLowerCase().trim();
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
          average: 5.0,
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
        return { average: 5.0, totalCount: 0 };
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
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      const errorMsg = result.error || (Array.isArray(result.details) ? result.details.join('. ') : 'Failed to submit review');
      throw new Error(errorMsg);
    }

    const saved: CustomerReview = { ...result, isUserReviewed: true };
    setReviews((prev) => [saved, ...prev.filter((r) => r.id !== saved.id)]);
    return saved;
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
