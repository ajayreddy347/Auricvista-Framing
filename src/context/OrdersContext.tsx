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

export const OrdersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refreshOrders = useCallback(async () => {
    const token = localStorage.getItem('auricvista_auth_token');
    if (!token) {
      setOrders([]);
      setIsLoading(false);
      return;
    }

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
      } else {
        const errData = await res.json().catch(() => ({}));
        setError(errData.error || 'Failed to load orders from server');
      }
    } catch (err: any) {
      console.error('Failed to fetch orders:', err);
      setError('Unable to reach orders service. Please check your connection.');
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
      const errorMsg = data.error || (Array.isArray(data.details) ? data.details.join('. ') : 'Failed to place order.');
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
    const res = await fetch(`/api/orders/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Failed to update order ${id} status`);
    }

    const updated: Order = await res.json();
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...updated } : o))
    );
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
