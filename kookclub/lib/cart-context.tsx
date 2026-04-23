'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Recipe } from './types';

export interface CartItem {
  recipeId: string;
  servings: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (recipeId: string, servings: number) => void;
  removeFromCart: (recipeId: string) => void;
  updateServings: (recipeId: string, servings: number) => void;
  clearCart: () => void;
  isInCart: (recipeId: string) => boolean;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('kookclub-cart');
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('kookclub-cart', JSON.stringify(items));
    }
  }, [items, mounted]);

  const addToCart = (recipeId: string, servings: number) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.recipeId === recipeId);
      if (existing) {
        return prev.map((i) =>
          i.recipeId === recipeId ? { ...i, servings } : i
        );
      }
      return [...prev, { recipeId, servings }];
    });
  };

  const removeFromCart = (recipeId: string) => {
    setItems((prev) => prev.filter((i) => i.recipeId !== recipeId));
  };

  const updateServings = (recipeId: string, servings: number) => {
    setItems((prev) =>
      prev.map((i) => (i.recipeId === recipeId ? { ...i, servings } : i))
    );
  };

  const clearCart = () => setItems([]);

  const isInCart = (recipeId: string) => items.some((i) => i.recipeId === recipeId);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateServings,
        clearCart,
        isInCart,
        itemCount: items.length,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
