import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  unit: string;
  farmerId?: string;
  farmerName: string;
  subtotal?: number;
}

export type OrderStatus = 'Placed' | 'Harvesting' | 'Dispatched' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  createdAt: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryMethod: 'Home Delivery' | 'Farm Pickup';
  deliveryAddress?: string;
  preferredDeliveryDate: string;
  paymentMethod: 'Cash on Delivery' | 'UPI' | 'Card';
  paymentStatus?: string;
  status: OrderStatus;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  estimatedDelivery?: string;
}

interface OrdersContextType {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  refreshOrders: () => Promise<void>;
  placeOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => Promise<Order>;
  getOrderById: (id: string) => Order | undefined;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

const ORDERS_STORAGE_KEY = 'auricvista_orders_list';

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

const INITIAL_MOCK_ORDERS: Order[] = [
  {
    id: 'AV-2026-00142',
    createdAt: '2026-08-31T06:30:00.000Z',
    items: [
      {
        productId: 'PROD-101',
        name: 'Organic Heirloom Vine Tomatoes',
        image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
        price: 35,
        quantity: 5,
        unit: 'kg',
        farmerName: 'Ravi Kumar',
      },
    ],
    subtotal: 175,
    deliveryFee: 15,
    total: 190,
    deliveryMethod: 'Home Delivery',
    deliveryAddress: 'Flat 402, Green Meadows, 12th Main, Indiranagar, Bengaluru',
    preferredDeliveryDate: '2026-09-01',
    paymentMethod: 'UPI',
    status: 'Harvesting',
    customerName: 'Ananya Sharma',
    customerEmail: 'ananya@example.com',
    customerPhone: '+91 98450 12890',
    estimatedDelivery: 'Today 4:30 PM',
  },
  {
    id: 'AV-2026-00139',
    createdAt: '2026-08-30T10:15:00.000Z',
    items: [
      {
        productId: 'PROD-102',
        name: 'Hydroponic Salad Greens Box',
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
        price: 40,
        quantity: 1,
        unit: 'bunch',
        farmerName: 'Lakshmi Devi',
      },
      {
        productId: 'PROD-103',
        name: 'Heritage Rainbow Carrots',
        image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80',
        price: 50,
        quantity: 2,
        unit: 'kg',
        farmerName: 'Suresh Naidu',
      },
    ],
    subtotal: 140,
    deliveryFee: 15,
    total: 155,
    deliveryMethod: 'Home Delivery',
    deliveryAddress: 'Flat 402, Green Meadows, 12th Main, Indiranagar, Bengaluru',
    preferredDeliveryDate: '2026-08-31',
    paymentMethod: 'Cash on Delivery',
    status: 'Delivered',
    customerName: 'Ananya Sharma',
    customerEmail: 'ananya@example.com',
    customerPhone: '+91 98450 12890',
    estimatedDelivery: 'Delivered Yesterday',
  },
];

export const OrdersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_MOCK_ORDERS;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch {
      // Storage restricted
    }
  }, [orders]);

  const refreshOrders = useCallback(async () => {
    const token = localStorage.getItem('auricvista_auth_token');
    if (!token) return;

    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/orders', {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setOrders(data);
        }
      }
    } catch (err: any) {
      console.warn('Orders loaded from local cache:', err.message);
      setError('Offline mode: Using cached orders');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshOrders();
  }, [refreshOrders]);

  const placeOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<Order> => {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData),
    });

    const data = await res.json();

    if (!res.ok) {
      const errorMsg = data.error || 'Failed to place order. Please try again.';
      throw new Error(errorMsg);
    }

    const savedOrder: Order = data;
    setOrders((prev) => [savedOrder, ...prev.filter((o) => o.id !== savedOrder.id)]);
    return savedOrder;
  };

  const getOrderById = (id: string) => {
    return orders.find((o) => o.id === id);
  };

  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );

    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        const updated = await res.json();
        setOrders((prev) =>
          prev.map((o) => (o.id === id ? { ...updated } : o))
        );
      }
    } catch (err) {
      console.warn('Status updated locally, backend sync failed:', err);
    }
  };

  return (
    <OrdersContext.Provider
      value={{
        orders,
        isLoading,
        error,
        refreshOrders,
        placeOrder,
        getOrderById,
        updateOrderStatus,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = (): OrdersContextType => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
};
