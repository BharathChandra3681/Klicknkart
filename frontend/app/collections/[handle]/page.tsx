import { notFound } from 'next/navigation';
import { getCollectionByHandle, getCollections } from '@/lib/shopify';
import ProductCard from '@/components/ProductCard';

export const revalidate = 60;

export async function generateStaticParams() {
  const collections = await getCollections(20);
  return collections.map((c) => ({ handle: c.handle }));
}

type Props = { params: Promise<{ handle: string }> };

export default async function CollectionPage({ params }: Props) {
  const { handle } = await params;
  const collection = await getCollectionByHandle(handle, 48);
  if (!collection) notFound();

  const products = collection.products.edges.map((e) => e.node);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm text-zinc-500">
          <a href="/collections" className="hover:text-zinc-900 transition-colors">Categories</a>
          {' / '}
          <span className="text-zinc-900">{collection.title}</span>
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">{collection.title}</h1>
        {collection.description && (
          <p className="mt-2 text-zinc-500">{collection.description}</p>
        )}
        <p className="mt-1 text-sm text-zinc-400">{products.length} products</p>
      </div>

      {products.length === 0 ? (
        <p className="text-zinc-500">No products in this category yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
