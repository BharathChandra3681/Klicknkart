import Link from 'next/link';
import { getProducts } from '@/lib/shopify';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';

export const revalidate = 60;

const PAGE_SIZE = 24;

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Best Selling' },
  { value: 'title-asc', label: 'Title: A–Z' },
  { value: 'title-desc', label: 'Title: Z–A' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
] as const;

type SearchParams = { after?: string | string[]; sort?: string | string[] };
type Props = { searchParams?: Promise<SearchParams> };

function firstValue(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

function sortProducts(products: Awaited<ReturnType<typeof getProducts>>['products'], sort: string) {
  const items = [...products];
  switch (sort) {
    case 'title-asc':  return items.sort((a, b) => a.title.localeCompare(b.title));
    case 'title-desc': return items.sort((a, b) => b.title.localeCompare(a.title));
    case 'price-asc':  return items.sort((a, b) => parseFloat(a.priceRange.minVariantPrice.amount) - parseFloat(b.priceRange.minVariantPrice.amount));
    case 'price-desc': return items.sort((a, b) => parseFloat(b.priceRange.minVariantPrice.amount) - parseFloat(a.priceRange.minVariantPrice.amount));
    default:           return items;
  }
}

export default async function ProductsPage({ searchParams }: Props) {
  const query  = searchParams ? await searchParams : {};
  const after  = firstValue(query.after);
  const sort   = firstValue(query.sort) ?? 'relevance';

  const { products: raw, pageInfo } = await getProducts(PAGE_SIZE, after);
  const products = sortProducts(raw, sort);

  function sortHref(newSort: string) {
    const p = new URLSearchParams();
    if (newSort !== 'relevance') p.set('sort', newSort);
    return `/products${p.toString() ? `?${p}` : ''}`;
  }

  function nextHref() {
    const p = new URLSearchParams();
    if (pageInfo.endCursor) p.set('after', pageInfo.endCursor);
    if (sort !== 'relevance') p.set('sort', sort);
    return `/products?${p}`;
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-10">

        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-primary">All Products</h1>
            <p className="text-on-surface-variant mt-1">
              {products.length > 0
                ? `Showing ${products.length} product${products.length !== 1 ? 's' : ''}${after ? ' (continued)' : ''}`
                : 'Browse our full catalogue'}
            </p>
          </div>

          {/* Sort */}
          <div className="flex flex-wrap gap-2">
            {SORT_OPTIONS.map((opt) => (
              <Link
                key={opt.value}
                href={sortHref(opt.value)}
                className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors ${
                  sort === opt.value
                    ? 'border-primary bg-primary text-white'
                    : 'border-outline-variant/40 bg-white/70 text-on-surface-variant hover:border-primary/30 hover:text-primary'
                }`}
              >
                {opt.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Grid */}
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

        {/* Pagination */}
        {(after || pageInfo.hasNextPage) && (
          <div className="flex items-center justify-center gap-3 mt-10">
            {after && (
              <Link
                href={`/products${sort !== 'relevance' ? `?sort=${sort}` : ''}`}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-outline-variant/40 bg-white/70 text-sm font-semibold text-on-surface-variant hover:border-primary/30 hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                Back to start
              </Link>
            )}
            {pageInfo.hasNextPage && (
              <Link
                href={nextHref()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm"
              >
                Next page
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            )}
          </div>
        )}

      </div>
      <Footer />
    </>
  );
}
