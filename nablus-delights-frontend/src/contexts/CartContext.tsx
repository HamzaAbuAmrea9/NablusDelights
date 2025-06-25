// File: src/contexts/CartContext.tsx
'use client';

import { createContext, useState, useContext, ReactNode } from 'react';
import { Dish } from '@/services/api';

export interface CartItem extends Dish {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (dish: Dish) => void;
  clearCart: () => void;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (dish: Dish) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === dish.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...dish, quantity: 1 }];
    });
  };
  
  const clearCart = () => {
      setCartItems([]);
  };

  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, clearCart, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}