import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/shopify/types';

type Props = { product: Product };

export default function ProductCard({ product }: Props) {
  const price = product.priceRange.minVariantPrice;
  const image = product.featuredImage;

  return (
    <Link
      href={`/products/${product.handle}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-square overflow-hidden bg-zinc-100">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText ?? product.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-400 text-sm">
            No image
          </div>
        )}
        {!product.availableForSale && (
          <span className="absolute top-2 left-2 rounded-full bg-zinc-900 px-2 py-0.5 text-xs font-medium text-white">
            Sold out
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-sm font-medium text-zinc-900 line-clamp-2 leading-snug">
          {product.title}
        </p>
        <p className="mt-auto text-sm font-semibold text-zinc-900">
          {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
        </p>
      </div>
    </Link>
  );
}
