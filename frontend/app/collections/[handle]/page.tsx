import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCollectionByHandle, getCollections } from '@/lib/shopify';
import Footer from '@/components/Footer';

export const revalidate = 60;

const PAGE_SIZE = 12;

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'title-asc', label: 'Title: A-Z' },
  { value: 'title-desc', label: 'Title: Z-A' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
] as const;

export async function generateStaticParams() {
  const collections = await getCollections(250);
  return collections.map((c) => ({ handle: c.handle }));
}

type SearchParams = { after?: string | string[]; sort?: string | string[]; tag?: string | string[] };
type Props = { params: Promise<{ handle: string }>; searchParams?: Promise<SearchParams> };

function firstValue(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

function sortProducts<T extends { title: string; priceRange: { minVariantPrice: { amount: string } } }>(items: T[], sort: string) {
  const list = [...items];
  switch (sort) {
    case 'title-asc':  return list.sort((a, b) => a.title.localeCompare(b.title));
    case 'title-desc': return list.sort((a, b) => b.title.localeCompare(a.title));
    case 'price-asc':  return list.sort((a, b) => parseFloat(a.priceRange.minVariantPrice.amount) - parseFloat(b.priceRange.minVariantPrice.amount));
    case 'price-desc': return list.sort((a, b) => parseFloat(b.priceRange.minVariantPrice.amount) - parseFloat(a.priceRange.minVariantPrice.amount));
    default:           return list;
  }
}

function buildHref(handle: string, params: { after?: string; sort?: string; tag?: string }) {
  const p = new URLSearchParams();
  if (params.after) p.set('after', params.after);
  if (params.sort && params.sort !== 'relevance') p.set('sort', params.sort);
  if (params.tag) p.set('tag', params.tag);
  const qs = p.toString();
  return `/collections/${handle}${qs ? `?${qs}` : ''}`;
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const [{ handle }, query] = await Promise.all([
    params,
    (searchParams ?? Promise.resolve({})) as Promise<SearchParams>,
  ]);

  const after     = firstValue(query.after);
  const sort      = firstValue(query.sort) ?? 'relevance';
  const activeTag = firstValue(query.tag) ?? '';

  const [result, collections] = await Promise.all([
    getCollectionByHandle(handle, PAGE_SIZE, after),
    getCollections(250),
  ]);

  if (!result) notFound();

  const { collection, hasNextPage, endCursor } = result;

  const allProducts    = collection.products.edges.map((e) => e.node);
  const filteredProducts = activeTag ? allProducts.filter((p) => p.tags.includes(activeTag)) : allProducts;
  const products       = sortProducts(filteredProducts, sort);
  const availableTags  = Array.from(new Set(allProducts.flatMap((p) => p.tags))).sort((a, b) => a.localeCompare(b));
  const heroImage      = collection.image ?? collection.products.edges[0]?.node.featuredImage ?? null;

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 lg:py-12">

        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-2 text-sm text-on-surface-variant mb-6">
          <Link href="/" className="hover:text-secondary transition-colors">Home</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <Link href="/collections" className="hover:text-secondary transition-colors">Categories</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-on-surface font-medium">{collection.title}</span>
        </nav>

        {/* Hero */}
        <section className="relative overflow-hidden rounded-[28px] border border-white/60 bg-white/50 shadow-[0_18px_60px_rgba(0,35,102,0.08)] backdrop-blur-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/65 to-primary-fixed/20" />
          <div className="relative grid gap-6 lg:grid-cols-[1.2fr_0.8fr] p-6 lg:p-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary-fixed/25 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Browse collection
              </div>
              <h1 className="text-[clamp(2rem,4vw,3.25rem)] font-extrabold tracking-[-0.03em] text-primary leading-tight">
                {collection.title}
              </h1>
              {collection.description && (
                <p className="max-w-2xl text-base leading-relaxed text-on-surface-variant">
                  {collection.description}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-3 text-sm text-on-surface-variant">
                <span className="rounded-full bg-white/80 px-3 py-1 font-medium text-on-surface shadow-sm">
                  {products.length} product{products.length !== 1 ? 's' : ''}{after ? ' this page' : ''}
                </span>
                {availableTags.length > 0 && (
                  <span className="rounded-full bg-white/70 px-3 py-1 font-medium">{availableTags.length} tag filters</span>
                )}
              </div>
            </div>
            <div className="relative h-[220px] overflow-hidden rounded-[24px] border border-white/70 bg-surface-container-low shadow-[0_16px_48px_rgba(0,35,102,0.08)]">
              {heroImage ? (
                <Image src={heroImage.url} alt={heroImage.altText ?? collection.title} fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 40vw" />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary-fixed/35 via-white to-secondary-container/20">
                  <span className="material-symbols-outlined text-7xl text-primary/50">inventory_2</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Layout: sidebar + grid */}
        <section className="mt-6 grid gap-4 xl:grid-cols-[260px_minmax(0,1fr)]">

          {/* Sidebar */}
          <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
            <div className="rounded-[24px] border border-white/60 bg-white/65 p-4 shadow-[0_12px_40px_rgba(0,35,102,0.06)] backdrop-blur-xl">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-outline">Filters</p>
                <Link href={`/collections/${handle}`} className="text-xs font-semibold text-secondary hover:underline">Reset</Link>
              </div>

              <div className="mt-4 space-y-4">
                {/* Collections list */}
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-on-surface-variant">Collections</p>
                  <div className="flex flex-wrap gap-2 xl:flex-col">
                    {collections.map((item) => {
                      const active = item.handle === handle;
                      return (
                        <Link key={item.id} href={`/collections/${item.handle}`}
                          className={`inline-flex items-center justify-between gap-2 rounded-full border px-3 py-2 text-sm font-medium transition-colors xl:w-full xl:rounded-xl ${
                            active
                              ? 'border-primary bg-primary text-white shadow-sm'
                              : 'border-outline-variant/30 bg-white/70 text-on-surface-variant hover:border-primary/20 hover:text-primary'
                          }`}
                        >
                          <span className="truncate">{item.title}</span>
                          <span className="rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-semibold">
                            {item.products.edges.length}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Tag filter */}
                {availableTags.length > 0 && (
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-on-surface-variant">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      <Link href={buildHref(handle, { sort })}
                        className={`rounded-full border px-3 py-2 text-xs font-semibold transition-colors ${
                          !activeTag ? 'border-primary bg-primary text-white' : 'border-outline-variant/40 bg-white/70 text-on-surface-variant hover:border-primary/30 hover:text-primary'
                        }`}
                      >
                        All
                      </Link>
                      {availableTags.slice(0, 16).map((tag) => (
                        <Link key={tag} href={buildHref(handle, { sort, tag: tag === activeTag ? '' : tag })}
                          className={`rounded-full border px-3 py-2 text-xs font-semibold transition-colors ${
                            tag === activeTag ? 'border-primary bg-primary text-white' : 'border-outline-variant/40 bg-white/70 text-on-surface-variant hover:border-primary/30 hover:text-primary'
                          }`}
                        >
                          {tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sort */}
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-on-surface-variant">Sort by</p>
                  <div className="grid grid-cols-2 gap-2">
                    {SORT_OPTIONS.map((opt) => (
                      <Link key={opt.value} href={buildHref(handle, { sort: opt.value, tag: activeTag })}
                        className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
                          opt.value === sort ? 'border-primary bg-primary text-white' : 'border-outline-variant/40 bg-white/70 text-on-surface-variant hover:border-primary/30 hover:text-primary'
                        }`}
                      >
                        {opt.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Product grid + pagination */}
          <div className="space-y-4">
            {/* Status bar */}
            <div className="rounded-[24px] border border-white/60 bg-white/60 p-4 shadow-[0_12px_40px_rgba(0,35,102,0.05)] backdrop-blur-xl">
              <p className="text-sm text-on-surface-variant">
                {sort === 'relevance'
                  ? 'Showing products in collection order.'
                  : `Sorted by ${SORT_OPTIONS.find((o) => o.value === sort)?.label ?? 'Relevance'}.`}
                {activeTag && <span className="ml-2 font-semibold text-primary">Tag: {activeTag}</span>}
              </p>
            </div>

            {/* Grid */}
            {products.length === 0 ? (
              <div className="rounded-[28px] border border-white/60 bg-white/60 p-14 text-center shadow-[0_12px_40px_rgba(0,35,102,0.05)] backdrop-blur-xl">
                <span className="material-symbols-outlined mb-4 block text-6xl text-outline">inventory_2</span>
                <p className="text-lg font-semibold text-on-surface">No products match this filter.</p>
                <Link href={`/collections/${handle}`}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white">
                  Reset filters
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => {
                  const price = product.priceRange.minVariantPrice;
                  const image = product.featuredImage;
                  const tag   = product.tags[0] ?? collection.title;
                  return (
                    <Link key={product.id} href={`/products/${product.handle}`}
                      className="group overflow-hidden rounded-[24px] border border-white/70 bg-white/70 shadow-[0_12px_36px_rgba(0,35,102,0.06)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1"
                    >
                      <div className="relative aspect-[1.1] overflow-hidden bg-surface-container-low">
                        {image ? (
                          <Image src={image.url} alt={image.altText ?? product.title} fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary-fixed/25 to-white">
                            <span className="material-symbols-outlined text-7xl text-outline">inventory_2</span>
                          </div>
                        )}
                        {!product.availableForSale && (
                          <span className="absolute left-3 top-3 rounded-full bg-on-surface/80 px-3 py-1 text-[11px] font-semibold text-white">Sold out</span>
                        )}
                        <span className="absolute right-3 top-3 rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold text-primary shadow-sm backdrop-blur">
                          {tag}
                        </span>
                      </div>
                      <div className="flex min-h-[180px] flex-col gap-3 p-4">
                        <div>
                          <h2 className="line-clamp-2 text-sm font-semibold leading-snug text-on-surface group-hover:text-primary">
                            {product.title}
                          </h2>
                          {product.description && (
                            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-on-surface-variant">
                              {product.description}
                            </p>
                          )}
                        </div>
                        <div className="mt-auto flex items-end justify-between gap-3">
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-outline">Price</p>
                            <p className="text-xl font-bold text-secondary">
                              {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
                            </p>
                          </div>
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-md transition-transform group-hover:scale-105">
                            <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {(after || hasNextPage) && (
              <div className="flex items-center justify-center gap-3 pt-2">
                {after && (
                  <Link href={buildHref(handle, { sort, tag: activeTag })}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-outline-variant/40 bg-white/70 text-sm font-semibold text-on-surface-variant hover:border-primary/30 hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                    Back to start
                  </Link>
                )}
                {hasNextPage && endCursor && (
                  <Link href={buildHref(handle, { after: endCursor, sort, tag: activeTag })}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm"
                  >
                    Next page
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </Link>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
