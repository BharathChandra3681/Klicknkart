import { getProducts } from '@/lib/shopify';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';

export const revalidate = 60;

export default async function ProductsPage() {
  const products = await getProducts(48);

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-primary">All Products</h1>
          <p className="text-on-surface-variant mt-1">
            {products.length > 0 ? `${products.length} products available` : 'Browse our full catalogue'}
          </p>
        </div>

        {products.length === 0 ? (
          <div className="glass-card rounded-2xl p-16 text-center">
            <span className="material-symbols-outlined text-6xl text-outline block mb-4">inventory_2</span>
            <p className="text-on-surface-variant">No products yet. Import your catalogue in Shopify Admin.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
