import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/shopify/types';
import QuickAddButton from './QuickAddButton';

type Props = { product: Product };

export default function ProductCard({ product }: Props) {
  const price = product.priceRange.minVariantPrice;
  const image = product.featuredImage;
  const variantId = product.variants.edges[0]?.node.id;

  return (
    <div className="group glass-card rounded-xl overflow-hidden flex flex-col relative">
      <Link href={`/products/${product.handle}`} className="flex flex-col flex-1">
        <div className="relative aspect-square overflow-hidden bg-surface-container-low">
          {image ? (
            <Image
              src={image.url}
              alt={image.altText ?? product.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="material-symbols-outlined text-5xl text-outline">inventory_2</span>
            </div>
          )}
          {!product.availableForSale && (
            <span className="absolute top-2 left-2 rounded-full bg-on-surface/80 px-2.5 py-0.5 text-[11px] font-semibold text-white">
              Sold Out
            </span>
          )}
        </div>
        <div className="p-4 flex flex-col gap-1 flex-1">
          <p className="text-sm font-semibold text-on-surface line-clamp-2 leading-snug pr-8">{product.title}</p>
          <p className="mt-auto text-sm font-bold text-secondary pt-2">
            {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
          </p>
        </div>
      </Link>

      <div className="absolute bottom-4 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <QuickAddButton variantId={variantId} availableForSale={product.availableForSale} />
      </div>
    </div>
  );
}
