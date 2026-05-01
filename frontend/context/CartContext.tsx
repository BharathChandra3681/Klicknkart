'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import {
  createCart,
  getCart,
  addToCart,
  updateCartLine,
  removeFromCart,
} from '@/lib/shopify';
import type { Cart } from '@/lib/shopify/types';

type CartContextValue = {
  cart: Cart | null;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addItem: (merchandiseId: string, quantity?: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  isLoading: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

const CART_ID_KEY = 'shopify_cart_id';

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedCartId = localStorage.getItem(CART_ID_KEY);
    if (!savedCartId) return;
    getCart(savedCartId)
      .then((c) => {
        if (c) setCart(c);
        else localStorage.removeItem(CART_ID_KEY);
      })
      .catch(() => localStorage.removeItem(CART_ID_KEY));
  }, []);

  const ensureCart = useCallback(async (): Promise<string> => {
    if (cart) return cart.id;
    const newCart = await createCart();
    localStorage.setItem(CART_ID_KEY, newCart.id);
    setCart(newCart);
    return newCart.id;
  }, [cart]);

  const addItem = useCallback(
    async (merchandiseId: string, quantity = 1) => {
      setIsLoading(true);
      try {
        const cartId = await ensureCart();
        const updated = await addToCart(cartId, [{ merchandiseId, quantity }]);
        setCart(updated);
        setCartOpen(true);
      } finally {
        setIsLoading(false);
      }
    },
    [ensureCart]
  );

  const updateItem = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cart) return;
      setIsLoading(true);
      try {
        const updated = await updateCartLine(cart.id, lineId, quantity);
        setCart(updated);
      } finally {
        setIsLoading(false);
      }
    },
    [cart]
  );

  const removeItem = useCallback(
    async (lineId: string) => {
      if (!cart) return;
      setIsLoading(true);
      try {
        const updated = await removeFromCart(cart.id, [lineId]);
        setCart(updated);
      } finally {
        setIsLoading(false);
      }
    },
    [cart]
  );

  return (
    <CartContext.Provider
      value={{ cart, cartOpen, setCartOpen, addItem, updateItem, removeItem, isLoading }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
