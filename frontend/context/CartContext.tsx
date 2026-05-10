'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';
import {
  createCart,
  getCart,
  addToCart,
  updateCartLine,
  removeFromCart,
  updateCartBuyerIdentity,
} from '@/lib/shopify';
import type { Cart } from '@/lib/shopify/types';

type CartLineError = {
  lineId: string;
  message: string;
};

type CartContextValue = {
  cart: Cart | null;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addItem: (merchandiseId: string, quantity?: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  isLoading: boolean;
  refreshCart: () => Promise<void>;
  cartErrors: CartLineError[];
};

const CartContext = createContext<CartContextValue | null>(null);

const CART_ID_KEY = 'shopify_cart_id';

async function fetchCustomerEmail(): Promise<string | null> {
  try {
    const res = await fetch('/api/auth/me');
    if (!res.ok) return null;
    const { customer } = await res.json();
    return customer?.email ?? null;
  } catch {
    return null;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart]         = useState<Cart | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cartErrors, setCartErrors] = useState<CartLineError[]>([]);
  const linkedEmail = useRef<string | null>(null);

  // Load cart from localStorage, then link customer if logged in
  useEffect(() => {
    const savedCartId = localStorage.getItem(CART_ID_KEY);
    if (!savedCartId) return;

    getCart(savedCartId)
      .then(async (c) => {
        if (!c) { localStorage.removeItem(CART_ID_KEY); return; }
        setCart(c);
        // Link customer email to cart for address pre-fill at checkout
        const email = await fetchCustomerEmail();
        if (email && email !== linkedEmail.current) {
          linkedEmail.current = email;
          const updated = await updateCartBuyerIdentity(c.id, email).catch(() => c);
          setCart(updated);
        }
      })
      .catch(() => localStorage.removeItem(CART_ID_KEY));
  }, []);

  const ensureCart = useCallback(async (): Promise<string> => {
    if (cart) return cart.id;
    const newCart = await createCart();
    localStorage.setItem(CART_ID_KEY, newCart.id);

    // Link customer to newly created cart
    const email = await fetchCustomerEmail();
    if (email) {
      linkedEmail.current = email;
      const linked = await updateCartBuyerIdentity(newCart.id, email).catch(() => newCart);
      setCart(linked);
      return linked.id;
    }

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
        setCartErrors((prev) => prev.filter((e) => e.lineId !== lineId));
      } finally {
        setIsLoading(false);
      }
    },
    [cart]
  );

  const refreshCart = useCallback(async () => {
    if (!cart) return;
    setIsLoading(true);
    try {
      const refreshed = await getCart(cart.id);
      if (refreshed) {
        setCart(refreshed);
        const errors: CartLineError[] = [];
        refreshed.lines.edges.forEach((e) => {
          const line = e.node;
          if (!line.merchandise.availableForSale) {
            errors.push({ lineId: line.id, message: 'Out of stock' });
          }
        });
        setCartErrors(errors);
      } else {
        localStorage.removeItem(CART_ID_KEY);
        setCart(null);
        setCartErrors([]);
      }
    } catch {
      /* ignore */
    } finally {
      setIsLoading(false);
    }
  }, [cart]);

  // Refresh cart when drawer opens to catch stock changes
  useEffect(() => {
    if (cartOpen && cart) {
      refreshCart();
    }
  }, [cartOpen, cart, refreshCart]);

  return (
    <CartContext.Provider
      value={{ cart, cartOpen, setCartOpen, addItem, updateItem, removeItem, isLoading, refreshCart, cartErrors }}
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
