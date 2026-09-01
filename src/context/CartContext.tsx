import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * =========================================================================
 * CART CONTEXT & STATE ENGINE (LOCAL / MOCK STATE)
 * =========================================================================
 * NOTE / BACKEND INTEGRATION PLACEHOLDER:
 * In production, this local cart state should synchronize with the user's
 * cloud profile or backend cart API (e.g. Firestore / Redis cart session).
 * =========================================================================
 */

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  unit: string;
  farmerName: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'auricvista_cart_items';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage restricted
    }
  }, [items]);

  const addToCart = (newItem: Omit<CartItem, 'quantity'>, quantityToAdd: number = 1) => {
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.productId === newItem.productId);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantityToAdd,
        };
        return updated;
      }
      return [...prevItems, { ...newItem, quantity: quantityToAdd }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        isCartOpen,
        setIsCartOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
