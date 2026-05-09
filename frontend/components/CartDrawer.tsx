'use client';

import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import type { CartItem } from '@/lib/shopify/types';

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, updateItem, removeItem, isLoading } = useCart();

  const lines: CartItem[] = cart?.lines.edges.map((e) => e.node) ?? [];

  return (
    <>
      {/* Backdrop */}
      {cartOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={() => setCartOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-white shadow-xl transition-transform duration-300 ${
          cartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b px-4 py-4">
          <h2 className="text-lg font-semibold text-zinc-900">
            Cart ({cart?.totalQuantity ?? 0})
          </h2>
          <button
            onClick={() => setCartOpen(false)}
            className="rounded-md p-1 text-zinc-400 hover:text-zinc-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 items-center justify-center text-sm text-zinc-500">
            Your cart is empty
          </div>
        ) : (
          <ul className="flex-1 overflow-y-auto divide-y px-4">
            {lines.map((line) => (
              <li key={line.id} className="flex gap-4 py-4">
                {line.merchandise.product.featuredImage && (
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-zinc-200">
                    <Image
                      src={line.merchandise.product.featuredImage.url}
                      alt={line.merchandise.product.featuredImage.altText ?? line.merchandise.product.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col gap-1">
                  <p className="text-sm font-medium text-zinc-900 leading-snug">
                    {line.merchandise.product.title}
                  </p>
                  <p className="text-xs text-zinc-500">{line.merchandise.title}</p>
                  <p className="text-sm font-semibold text-zinc-900">
                    {line.merchandise.price.currencyCode}{' '}
                    {parseFloat(line.merchandise.price.amount).toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => removeItem(line.id)}
                    disabled={isLoading}
                    className="text-xs text-zinc-400 hover:text-red-500 transition-colors"
                  >
                    Remove
                  </button>
                  <div className="flex items-center gap-2 rounded-md border px-2 py-1">
                    <button
                      onClick={() => updateItem(line.id, line.quantity - 1)}
                      disabled={isLoading || line.quantity <= 1}
                      className="text-zinc-500 hover:text-zinc-900 disabled:opacity-30"
                    >
                      −
                    </button>
                    <span className="w-4 text-center text-sm">{line.quantity}</span>
                    <button
                      onClick={() => updateItem(line.id, line.quantity + 1)}
                      disabled={isLoading}
                      className="text-zinc-500 hover:text-zinc-900"
                    >
                      +
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {lines.length > 0 && (
          <div className="border-t px-4 py-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600">Subtotal</span>
              <span className="font-semibold text-zinc-900">
                {cart?.cost.subtotalAmount.currencyCode}{' '}
                {parseFloat(cart?.cost.subtotalAmount.amount ?? '0').toFixed(2)}
              </span>
            </div>
            <a
              href={cart?.checkoutUrl}
              onClick={(e) => {
                if (!cart?.checkoutUrl) return;
                const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin;
                const target = new URL(cart.checkoutUrl);
                target.searchParams.set('return_to', `${appUrl}/order/confirmed`);
                (e.currentTarget as HTMLAnchorElement).href = target.toString();
              }}
              className="block w-full rounded-full bg-zinc-900 py-3 text-center text-sm font-semibold text-white hover:bg-zinc-700 transition-colors"
            >
              Checkout
            </a>
          </div>
        )}
      </div>
    </>
  );
}
