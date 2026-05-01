import { getProducts } from '@/lib/shopify';
import ProductCard from '@/components/ProductCard';

export const revalidate = 60;

export default async function ProductsPage() {
  const products = await getProducts(24);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-zinc-900">All Products</h1>
      {products.length === 0 ? (
        <p className="text-zinc-500">No products found. Add some in your Shopify admin.</p>
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
