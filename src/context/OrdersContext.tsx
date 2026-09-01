import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * =========================================================================
 * ORDERS CONTEXT & STATE ENGINE (LOCAL / MOCK STATE)
 * =========================================================================
 * NOTE / BACKEND & PAYMENT INTEGRATION PLACEHOLDER:
 * In production, real payment processing (e.g., Razorpay, Stripe, Cashfree, UPI Deeplinks)
 * and durable database persistence (e.g., Firebase Firestore, PostgreSQL) will
 * replace this mock local state flow.
 * =========================================================================
 */

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  unit: string;
  farmerName: string;
}

export type OrderStatus = 'Placed' | 'Harvesting' | 'Dispatched' | 'Delivered';

export interface Order {
  id: string; // e.g. "AV-2026-00147"
  createdAt: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryMethod: 'Home Delivery' | 'Farm Pickup';
  deliveryAddress?: string;
  preferredDeliveryDate: string;
  paymentMethod: 'Cash on Delivery' | 'UPI' | 'Card';
  status: OrderStatus;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  estimatedDelivery?: string;
}

interface OrdersContextType {
  orders: Order[];
  placeOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => Order;
  getOrderById: (id: string) => Order | undefined;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

const ORDERS_STORAGE_KEY = 'auricvista_orders_list';

const INITIAL_MOCK_ORDERS: Order[] = [
  {
    id: 'AV-2026-00142',
    createdAt: '2026-08-31T06:30:00.000Z',
    items: [
      {
        productId: '1',
        name: 'Organic Heirloom Vine Tomatoes',
        image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
        price: 48,
        quantity: 5,
        unit: 'kg',
        farmerName: 'Ravi Kumar',
      },
    ],
    subtotal: 240,
    deliveryFee: 15,
    total: 255,
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
        productId: '2',
        name: 'Hydroponic Salad Greens Box',
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
        price: 180,
        quantity: 1,
        unit: 'kg box',
        farmerName: 'Lakshmi Devi',
      },
      {
        productId: '3',
        name: 'Unpolished Foxtail Millet (Navane)',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
        price: 95,
        quantity: 2,
        unit: 'kg',
        farmerName: 'Suresh Naidu',
      },
    ],
    subtotal: 370,
    deliveryFee: 15,
    total: 385,
    deliveryMethod: 'Home Delivery',
    deliveryAddress: 'Flat 402, Green Meadows, 12th Main, Indiranagar, Bengaluru',
    preferredDeliveryDate: '2026-08-31',
    paymentMethod: 'Card',
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

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch {
      // Storage restricted
    }
  }, [orders]);

  const placeOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Order => {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const newOrderId = `AV-2026-${randomSuffix}`;

    const newOrder: Order = {
      ...orderData,
      id: newOrderId,
      createdAt: new Date().toISOString(),
      status: 'Placed',
      estimatedDelivery: 'Scheduled for ' + orderData.preferredDeliveryDate,
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const getOrderById = (id: string) => {
    return orders.find((o) => o.id === id);
  };

  return (
    <OrdersContext.Provider
      value={{
        orders,
        placeOrder,
        getOrderById,
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
