import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getProductByHandle, getProducts } from '@/lib/shopify';
import AddToCartButton from './AddToCartButton';

export const revalidate = 60;

export async function generateStaticParams() {
  const products = await getProducts(50);
  return products.map((p) => ({ handle: p.handle }));
}

type Props = { params: Promise<{ handle: string }> };

export default async function ProductPage({ params }: Props) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);
  if (!product) notFound();

  const images = product.images.edges.map((e) => e.node);
  const mainImage = images[0] ?? product.featuredImage;
  const variants = product.variants.edges.map((e) => e.node);
  const firstVariant = variants[0];

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-zinc-100">
            {mainImage && (
              <Image
                src={mainImage.url}
                alt={mainImage.altText ?? product.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            )}
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.slice(1, 5).map((img, i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-lg bg-zinc-100">
                  <Image
                    src={img.url}
                    alt={img.altText ?? product.title}
                    fill
                    className="object-cover"
                    sizes="25vw"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">{product.title}</h1>
            <p className="mt-2 text-2xl font-semibold text-zinc-900">
              {firstVariant?.price.currencyCode}{' '}
              {parseFloat(firstVariant?.price.amount ?? '0').toFixed(2)}
            </p>
          </div>

          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <AddToCartButton
            variantId={firstVariant?.id}
            availableForSale={product.availableForSale}
          />

          {product.descriptionHtml ? (
            <div
              className="prose prose-sm text-zinc-600"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          ) : (
            <p className="text-sm text-zinc-600">{product.description}</p>
          )}
        </div>
      </div>
    </main>
  );
}
