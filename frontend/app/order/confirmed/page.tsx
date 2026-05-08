'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCustomer } from '@/context/CustomerContext';
import Footer from '@/components/Footer';

type OrderLine = { title: string; quantity: number };
type Order = {
  id: string;
  orderNumber: number;
  processedAt: string;
  financialStatus: string;
  fulfillmentStatus: string;
  currentTotalPrice: { amount: string; currencyCode: string };
  lineItems: { edges: { node: OrderLine }[] };
};

export default function OrderConfirmedPage() {
  const { customer, loading } = useCustomer();
  const [order, setOrder]     = useState<Order | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  useEffect(() => {
    // Shopify appends ?order_number= and ?name= via Additional Scripts
    const params = new URLSearchParams(window.location.search);
    const num = params.get('order_number') ?? params.get('order');
    if (num) setOrderNumber(num);
  }, []);

  useEffect(() => {
    if (!customer) return;
    // Find the matching order from the customer's order list
    const orders = customer.orders.edges.map((e) => e.node);
    if (orderNumber) {
      const match = orders.find((o) => String(o.orderNumber) === orderNumber);
      if (match) { setOrder(match); return; }
    }
    // Fallback: show most recent order
    if (orders.length > 0) setOrder(orders[0]);
  }, [customer, orderNumber]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-secondary text-4xl">autorenew</span>
      </main>
    );
  }

  const lines = order?.lineItems.edges.map((e) => e.node) ?? [];

  return (
    <>
      <main className="min-h-screen flex flex-col items-center justify-start px-6 py-16 max-w-2xl mx-auto w-full">

        {/* Success icon */}
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ background: 'rgba(22,163,74,0.1)', border: '2px solid rgba(22,163,74,0.2)' }}>
          <span className="material-symbols-outlined text-[48px]"
            style={{ color: '#16a34a', fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-[32px] font-extrabold text-primary text-center tracking-tight mb-2">
          Order Confirmed!
        </h1>
        <p className="text-on-surface-variant text-center text-base mb-8">
          {order
            ? `Thank you! Order #${order.orderNumber} has been placed successfully.`
            : orderNumber
            ? `Thank you! Order #${orderNumber} has been placed successfully.`
            : 'Thank you for your purchase! Your order has been placed.'}
        </p>

        {/* Order summary card (if we have order data) */}
        {order && (
          <div className="w-full rounded-2xl p-6 mb-6"
            style={{ background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(40px)', border: '1px solid rgba(255,255,255,0.8)', boxShadow: '0 8px 32px rgba(0,35,102,0.06)' }}>
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-outline-variant/20">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Order</p>
                <p className="text-lg font-bold text-primary">#{order.orderNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Total</p>
                <p className="text-lg font-bold text-secondary">
                  {order.currentTotalPrice.currencyCode} {parseFloat(order.currentTotalPrice.amount).toFixed(2)}
                </p>
              </div>
            </div>

            {lines.length > 0 && (
              <div className="space-y-3 mb-4">
                {lines.map((line, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-on-surface font-medium">{line.title}</span>
                    <span className="text-on-surface-variant">×{line.quantity}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 pt-3 border-t border-outline-variant/20">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              <span className="text-sm text-on-surface-variant capitalize">
                Payment {order.financialStatus.toLowerCase()}
              </span>
            </div>
          </div>
        )}

        {/* What happens next */}
        <div className="w-full rounded-2xl p-6 mb-8"
          style={{ background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(30px)', border: '1px solid rgba(255,255,255,0.7)' }}>
          <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4">What happens next</h2>
          <div className="space-y-4">
            {[
              { icon: 'mail', title: 'Confirmation email', body: 'A receipt has been sent to your email address.' },
              { icon: 'inventory_2', title: 'Order processing', body: 'We\'ll prepare your order and notify you when it ships.' },
              { icon: 'local_shipping', title: 'Delivery', body: 'You\'ll receive a tracking number once your order is dispatched.' },
            ].map(({ icon, title, body }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(0,88,188,0.08)' }}>
                  <span className="material-symbols-outlined text-[18px] text-primary">{icon}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-on-surface">{title}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          {customer && (
            <Link href="/account"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm border border-outline-variant hover:bg-surface-variant/30 transition-colors text-primary">
              <span className="material-symbols-outlined text-[18px]">receipt_long</span>
              View My Orders
            </Link>
          )}
          <Link href="/products"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white transition-colors"
            style={{ background: '#0058bc', boxShadow: '0 4px 14px rgba(0,88,188,0.2)' }}>
            <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
            Continue Shopping
          </Link>
        </div>

      </main>
      <Footer />
    </>
  );
}
