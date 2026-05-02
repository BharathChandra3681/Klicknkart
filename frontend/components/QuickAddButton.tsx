'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';

type Props = { variantId: string | undefined; availableForSale?: boolean };

export default function QuickAddButton({ variantId, availableForSale = true }: Props) {
  const { addItem, isLoading } = useCart();
  const [added, setAdded] = useState(false);

  async function handle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!variantId || !availableForSale) return;
    await addItem(variantId, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (!availableForSale) return null;

  return (
    <button
      onClick={handle}
      disabled={isLoading || !variantId}
      className="bg-primary text-white p-2 rounded-full hover:bg-secondary transition-colors disabled:opacity-50"
      title="Add to cart"
    >
      <span className="material-symbols-outlined text-[20px]">
        {added ? 'check' : 'add_shopping_cart'}
      </span>
    </button>
  );
}
