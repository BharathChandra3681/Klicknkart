'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { Customer, CustomerUserError } from '@/lib/shopify/types';

type CustomerContextValue = {
  customer: Customer | null;
  loading: boolean;
  login: () => void;               // redirects to Shopify OAuth
  logout: () => void;              // redirects to /api/auth/logout
  refreshCustomer: () => Promise<void>;
  // Legacy stubs kept so existing pages that import these don't break at compile time
  token: string | null;
  register: (input: {
    firstName: string; lastName: string; email: string;
    password: string; acceptsMarketing?: boolean;
  }) => Promise<CustomerUserError[]>;
  updateProfile: (input: {
    firstName?: string; lastName?: string;
    email?: string; phone?: string; password?: string;
  }) => Promise<CustomerUserError[]>;
};

const CustomerContext = createContext<CustomerContextValue | null>(null);

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading]   = useState(true);

  // Fetch customer from our server-side /api/auth/me route (uses httpOnly cookies)
  const refreshCustomer = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const { customer: c } = await res.json();
        setCustomer(c ?? null);
      } else {
        setCustomer(null);
      }
    } catch {
      setCustomer(null);
    }
  }, []);

  useEffect(() => {
    refreshCustomer().finally(() => setLoading(false));
  }, [refreshCustomer]);

  // Redirect to Shopify OAuth — handled server-side
  const login = useCallback(() => {
    window.location.href = '/api/auth';
  }, []);

  // Redirect to our logout route which clears cookies + goes to Shopify logout
  const logout = useCallback(() => {
    setCustomer(null);
    window.location.href = '/api/auth/logout';
  }, []);

  // ── Legacy stubs ─────────────────────────────────────────────────────────────
  // These existed in the Storefront-API version of the context.
  // They are no-ops now that everything flows through OAuth; kept so existing
  // pages that reference them continue to compile without changes.
  const register = useCallback(async (_input: {
    firstName: string; lastName: string; email: string;
    password: string; acceptsMarketing?: boolean;
  }): Promise<CustomerUserError[]> => {
    // Redirect to the same OAuth flow — Shopify handles account creation there
    window.location.href = '/api/auth';
    return [];
  }, []);

  const updateProfile = useCallback(async (_input: {
    firstName?: string; lastName?: string;
    email?: string; phone?: string; password?: string;
  }): Promise<CustomerUserError[]> => {
    // Profile updates are done via Customer Account API GraphQL directly
    // (handled in /account/edit/page.tsx using the access token from /api/auth/me)
    return [{ code: 'NOT_SUPPORTED', field: null, message: 'Use the account edit page.' }];
  }, []);

  return (
    <CustomerContext.Provider value={{
      customer, loading, token: null,
      login, logout, refreshCustomer,
      register, updateProfile,
    }}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  const ctx = useContext(CustomerContext);
  if (!ctx) throw new Error('useCustomer must be used inside CustomerProvider');
  return ctx;
}
