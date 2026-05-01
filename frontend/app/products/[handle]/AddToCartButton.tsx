'use client';

import { useCart } from '@/context/CartContext';

type Props = {
  variantId: string | undefined;
  availableForSale: boolean;
};

export default function AddToCartButton({ variantId, availableForSale }: Props) {
  const { addItem, isLoading } = useCart();

  if (!availableForSale) {
    return (
      <button disabled className="w-full rounded-full bg-zinc-200 py-3 text-sm font-semibold text-zinc-400 cursor-not-allowed">
        Sold Out
      </button>
    );
  }

  return (
    <button
      onClick={() => variantId && addItem(variantId)}
      disabled={isLoading || !variantId}
      className="w-full rounded-full bg-zinc-900 py-3 text-sm font-semibold text-white hover:bg-zinc-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {isLoading ? 'Adding…' : 'Add to Cart'}
    </button>
  );
}
