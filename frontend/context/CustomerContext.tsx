'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { getCustomer, loginCustomer, logoutCustomer, createCustomer } from '@/lib/shopify';
import type { Customer, CustomerUserError } from '@/lib/shopify/types';

const TOKEN_KEY = 'shopify_customer_token';

type CustomerContextValue = {
  customer: Customer | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<CustomerUserError[]>;
  register: (input: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    acceptsMarketing?: boolean;
  }) => Promise<CustomerUserError[]>;
  logout: () => Promise<void>;
};

const CustomerContext = createContext<CustomerContextValue | null>(null);

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) { setLoading(false); return; }
    getCustomer(token)
      .then((c) => setCustomer(c))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { accessToken, errors } = await loginCustomer(email, password);
    if (accessToken) {
      localStorage.setItem(TOKEN_KEY, accessToken.accessToken);
      const c = await getCustomer(accessToken.accessToken);
      setCustomer(c);
    }
    return errors;
  }, []);

  const register = useCallback(async (input: {
    firstName: string; lastName: string; email: string;
    password: string; acceptsMarketing?: boolean;
  }) => {
    const { errors } = await createCustomer(input);
    if (errors.length === 0) {
      // Auto-login after register
      const loginErrors = await login(input.email, input.password);
      return loginErrors;
    }
    return errors;
  }, [login]);

  const logout = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      await logoutCustomer(token).catch(() => {});
      localStorage.removeItem(TOKEN_KEY);
    }
    setCustomer(null);
  }, []);

  return (
    <CustomerContext.Provider value={{ customer, loading, login, register, logout }}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  const ctx = useContext(CustomerContext);
  if (!ctx) throw new Error('useCustomer must be used inside CustomerProvider');
  return ctx;
}
