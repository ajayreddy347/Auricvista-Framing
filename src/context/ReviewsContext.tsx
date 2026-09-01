import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * =========================================================================
 * CUSTOMER RATINGS & REVIEWS CONTEXT & ENGINE (MOCK / LOCAL)
 * =========================================================================
 * NOTE / BACKEND INTEGRATION PLACEHOLDER:
 * This is currently a client-side mock review engine utilizing browser
 * LocalStorage. In production, real review submission, customer order
 * verification, image storage buckets, and automated content moderation
 * will be handled by a secure backend database (e.g., Firestore / Cloud SQL).
 * =========================================================================
 */

export interface CustomerReview {
  id: string;
  farmerId: string; // e.g. 'ravi-kumar', 'lakshmi-devi', 'suresh-naidu'
  farmerName?: string;
  produceId?: string;
  produceName?: string;
  customerName: string;
  customerEmail?: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  verified: boolean; // Verified Purchase badge
  photos?: string[]; // Optional user uploaded harvest photos
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
  getFarmerReviews: (farmerId: string) => CustomerReview[];
  getFarmerStats: (farmerId: string) => RatingStats;
  getProductReviews: (produceId: string) => CustomerReview[];
  getProductStats: (produceId: string) => { average: number; totalCount: number };
  addReview: (data: Omit<CustomerReview, 'id' | 'date'>) => CustomerReview;
  toggleHelpful: (reviewId: string) => void;
}

const STORAGE_KEY = 'auricvista_customer_reviews';

// Rich, authentic initial mock reviews for featured farmers & produce
const INITIAL_MOCK_REVIEWS: CustomerReview[] = [
  // Ravi Kumar Reviews
  {
    id: 'rev-rk-1',
    farmerId: 'ravi-kumar',
    farmerName: 'Ravi Kumar',
    produceId: 'PROD-101',
    produceName: 'Heirloom Vine Tomatoes',
    customerName: 'Ananya Sharma',
    rating: 5,
    comment:
      'The heirloom vine tomatoes arrived within 14 hours of dawn harvest. The aroma took me back to my grandparents’ farm in Karnataka. Super juicy with vibrant deep crimson flesh!',
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
      'The hydroponic baby spinach had crisp, unbruised leaves with zero pesticide residue. You can taste the purity right in raw salads. Ravi Kumar’s farm is truly world-class.',
    date: '2026-08-25',
    verified: true,
    helpfulCount: 18,
  },
  {
    id: 'rev-rk-3',
    farmerId: 'ravi-kumar',
    farmerName: 'Ravi Kumar',
    produceId: 'PROD-103',
    produceName: 'Heritage Rainbow Carrots',
    customerName: 'Meera Kulkarni',
    rating: 5,
    comment:
      'The rainbow carrots were remarkably sweet and crunchy. Packed in biodegradable banana leaf wrapping. Loved the transparency in pricing!',
    date: '2026-08-20',
    verified: true,
    helpfulCount: 12,
  },
  {
    id: 'rev-rk-4',
    farmerId: 'ravi-kumar',
    farmerName: 'Ravi Kumar',
    customerName: 'Dr. Rajesh Patel',
    rating: 4,
    comment:
      'Consistently fresh produce directly dispatched from Chikkaballapur. Excellent turgor and color. Minor delivery delay during heavy rains, but produce remained pristine.',
    date: '2026-08-14',
    verified: true,
    helpfulCount: 7,
  },

  // Lakshmi Devi Reviews
  {
    id: 'rev-ld-1',
    farmerId: 'lakshmi-devi',
    farmerName: 'Lakshmi Devi',
    customerName: 'Priya Nambiar',
    rating: 5,
    comment:
      'Lakshmi Devi’s hydroponic salad greens are the best in Bengaluru. Crisp, immaculate, and stay fresh in the fridge for over a week.',
    date: '2026-08-29',
    verified: true,
    photos: ['https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=400'],
    helpfulCount: 31,
  },
  {
    id: 'rev-ld-2',
    farmerId: 'lakshmi-devi',
    farmerName: 'Lakshmi Devi',
    customerName: 'Gaurav Bansal',
    rating: 5,
    comment:
      'Sweet exotic honeydew melons harvested at peak ripeness. Zero bitter aftertaste, exactly as promised.',
    date: '2026-08-22',
    verified: true,
    helpfulCount: 15,
  },
  {
    id: 'rev-ld-3',
    farmerId: 'lakshmi-devi',
    farmerName: 'Lakshmi Devi',
    customerName: 'Kavita Menon',
    rating: 4,
    comment:
      'Very clean hydroponic greens. Love that 100% of my payment went straight to Lakshmi’s bank account without middlemen markups.',
    date: '2026-08-18',
    verified: false,
    helpfulCount: 9,
  },

  // Suresh Naidu Reviews
  {
    id: 'rev-sn-1',
    farmerId: 'suresh-naidu',
    farmerName: 'Suresh Naidu',
    customerName: 'Raghavan Iyer',
    rating: 5,
    comment:
      'Ancient foxtail and barnyard millets stone-ground naturally. The aroma and nutrition are unmatched. Suresh Naidu preserves our heritage crops with great care.',
    date: '2026-08-27',
    verified: true,
    helpfulCount: 22,
  },
  {
    id: 'rev-sn-2',
    farmerId: 'suresh-naidu',
    farmerName: 'Suresh Naidu',
    customerName: 'Siddharth Rao',
    rating: 4,
    comment:
      'Unprocessed native pulses and organic ghee. Authentic taste and wholesome packaging.',
    date: '2026-08-21',
    verified: true,
    helpfulCount: 8,
  },
  {
    id: 'rev-sn-3',
    farmerId: 'suresh-naidu',
    farmerName: 'Suresh Naidu',
    customerName: 'Rohini Deshmukh',
    rating: 5,
    comment:
      'Direct farm deliveries have completely changed our household cooking. Exceptional quality pulses.',
    date: '2026-08-16',
    verified: true,
    helpfulCount: 14,
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

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
    } catch (e) {
      console.warn('Failed to save reviews to localStorage:', e);
    }
  }, [reviews]);

  const getFarmerReviews = (farmerId: string): CustomerReview[] => {
    return reviews.filter((r) => r.farmerId === farmerId);
  };

  const getFarmerStats = (farmerId: string): RatingStats => {
    const farmerRevs = getFarmerReviews(farmerId);
    if (farmerRevs.length === 0) {
      // Default baseline stats for established certified farmers
      return {
        average: 4.8,
        totalCount: 1,
        distribution: { 5: 1, 4: 0, 3: 0, 2: 0, 1: 0 },
      };
    }

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;

    farmerRevs.forEach((r) => {
      sum += r.rating;
      const rounded = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
      distribution[rounded] = (distribution[rounded] || 0) + 1;
    });

    const average = Math.round((sum / farmerRevs.length) * 10) / 10;

    return {
      average,
      totalCount: farmerRevs.length,
      distribution,
    };
  };

  const getProductReviews = (produceId: string): CustomerReview[] => {
    return reviews.filter((r) => r.produceId === produceId);
  };

  const getProductStats = (produceId: string): { average: number; totalCount: number } => {
    const prodRevs = getProductReviews(produceId);
    if (prodRevs.length === 0) {
      // Return a realistic baseline score if new item
      return {
        average: 4.9,
        totalCount: 18,
      };
    }

    const sum = prodRevs.reduce((acc, r) => acc + r.rating, 0);
    const average = Math.round((sum / prodRevs.length) * 10) / 10;

    return {
      average,
      totalCount: prodRevs.length,
    };
  };

  const addReview = (data: Omit<CustomerReview, 'id' | 'date'>): CustomerReview => {
    const newReview: CustomerReview = {
      ...data,
      id: `REV-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().split('T')[0],
      helpfulCount: 0,
      isUserReviewed: true,
    };

    setReviews((prev) => [newReview, ...prev]);
    return newReview;
  };

  const toggleHelpful = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId ? { ...r, helpfulCount: (r.helpfulCount || 0) + 1 } : r
      )
    );
  };

  return (
    <ReviewsContext.Provider
      value={{
        reviews,
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

export const useReviews = () => {
  const context = useContext(ReviewsContext);
  if (!context) {
    throw new Error('useReviews must be used within a ReviewsProvider');
  }
  return context;
};
