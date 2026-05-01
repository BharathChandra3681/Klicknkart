'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { cart, updateItem, removeItem, isLoading: loading } = useCart();
  const lines = cart?.lines.edges.map((e) => e.node) ?? [];

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-secondary text-4xl">autorenew</span>
      </main>
    );
  }

  if (lines.length === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4">
        <span className="material-symbols-outlined text-7xl text-outline">shopping_cart</span>
        <h1 className="text-2xl font-bold text-primary">Your cart is empty</h1>
        <p className="text-on-surface-variant">Add some products to get started</p>
        <Link
          href="/products"
          className="mt-2 px-6 py-3 bg-secondary text-white rounded-xl font-semibold hover:bg-primary transition-colors btn-primary"
        >
          Shop Now
        </Link>
      </main>
    );
  }

  const subtotal = cart!.cost.subtotalAmount;
  const total = cart!.cost.totalAmount;

  return (
    <main className="min-h-screen px-8 py-12 max-w-5xl mx-auto">
      <h1 className="text-3xl font-extrabold text-primary mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Line items */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {lines.map((line) => {
            const img = line.merchandise.product.featuredImage;
            return (
              <div key={line.id} className="glass-card rounded-xl p-4 flex gap-4 items-start">
                <div className="w-20 h-20 relative rounded-lg overflow-hidden bg-surface-container-low flex-shrink-0">
                  {img ? (
                    <Image src={img.url} alt={img.altText ?? line.merchandise.product.title} fill className="object-cover" sizes="80px" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="material-symbols-outlined text-outline text-2xl">inventory_2</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-on-surface text-sm line-clamp-2">{line.merchandise.product.title}</p>
                  {line.merchandise.title !== 'Default Title' && (
                    <p className="text-xs text-on-surface-variant mt-0.5">{line.merchandise.title}</p>
                  )}
                  <p className="text-sm font-bold text-secondary mt-1">
                    {line.merchandise.price.currencyCode} {parseFloat(line.merchandise.price.amount).toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => updateItem(line.id, line.quantity - 1)}
                    className="w-7 h-7 flex items-center justify-center rounded-full border border-outline-variant hover:bg-surface-container transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <span className="material-symbols-outlined text-sm">remove</span>
                  </button>
                  <span className="w-6 text-center text-sm font-semibold">{line.quantity}</span>
                  <button
                    onClick={() => updateItem(line.id, line.quantity + 1)}
                    className="w-7 h-7 flex items-center justify-center rounded-full border border-outline-variant hover:bg-surface-container transition-colors"
                    aria-label="Increase quantity"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                  </button>
                  <button
                    onClick={() => removeItem(line.id)}
                    className="ml-2 w-7 h-7 flex items-center justify-center rounded-full text-error hover:bg-error-container/30 transition-colors"
                    aria-label="Remove item"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order summary */}
        <div className="glass-card rounded-xl p-6 h-fit">
          <h2 className="text-lg font-bold text-primary mb-4">Order Summary</h2>
          <div className="flex justify-between text-sm text-on-surface-variant mb-2">
            <span>Subtotal</span>
            <span>{subtotal.currencyCode} {parseFloat(subtotal.amount).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-on-surface-variant mb-4">
            <span>Shipping</span>
            <span className="text-secondary font-medium">Calculated at checkout</span>
          </div>
          <div className="border-t border-outline-variant pt-4 flex justify-between font-bold text-on-surface mb-6">
            <span>Total</span>
            <span>{total.currencyCode} {parseFloat(total.amount).toFixed(2)}</span>
          </div>
          <a
            href={cart!.checkoutUrl}
            className="w-full block text-center py-3 bg-secondary text-white rounded-xl font-semibold hover:bg-primary transition-colors btn-primary"
          >
            Proceed to Checkout
          </a>
          <Link
            href="/products"
            className="w-full block text-center py-3 mt-3 text-secondary font-semibold hover:underline text-sm"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
