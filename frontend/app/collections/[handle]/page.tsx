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
  return collections.map((collection) => ({ handle: collection.handle }));
}

type SearchParams = {
  page?: string | string[];
  sort?: string | string[];
  tag?: string | string[];
};

type Props = {
  params: Promise<{ handle: string }>;
  searchParams?: Promise<SearchParams>;
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parsePage(value: string | string[] | undefined) {
  const page = Number.parseInt(firstValue(value) ?? '1', 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

function sortProducts<T extends { title: string; priceRange: { minVariantPrice: { amount: string } } }>(products: T[], sort: string) {
  const items = [...products];

  switch (sort) {
    case 'title-asc':
      return items.sort((left, right) => left.title.localeCompare(right.title));
    case 'title-desc':
      return items.sort((left, right) => right.title.localeCompare(left.title));
    case 'price-asc':
      return items.sort((left, right) => Number.parseFloat(left.priceRange.minVariantPrice.amount) - Number.parseFloat(right.priceRange.minVariantPrice.amount));
    case 'price-desc':
      return items.sort((left, right) => Number.parseFloat(right.priceRange.minVariantPrice.amount) - Number.parseFloat(left.priceRange.minVariantPrice.amount));
    default:
      return items;
  }
}

function getQueryHref(handle: string, current: { page: number; sort: string; tag: string }, updates: Partial<{ page: number; sort: string; tag: string }>) {
  const next = { ...current, ...updates };
  const params = new URLSearchParams();

  if (next.page > 1) params.set('page', String(next.page));
  if (next.sort && next.sort !== 'relevance') params.set('sort', next.sort);
  if (next.tag) params.set('tag', next.tag);

  const query = params.toString();
  return query ? `/collections/${handle}?${query}` : `/collections/${handle}`;
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const [{ handle }, query] = await Promise.all([
    params,
    (searchParams ?? Promise.resolve({})) as Promise<SearchParams>,
  ]);
  const [collection, collections] = await Promise.all([
    getCollectionByHandle(handle, 250),
    getCollections(250),
  ]);

  if (!collection) notFound();

  const page = parsePage(query.page);
  const sort = firstValue(query.sort) ?? 'relevance';
  const activeTag = firstValue(query.tag) ?? '';
  const allProducts = collection.products.edges.map((edge) => edge.node);
  const availableTags = Array.from(new Set(allProducts.flatMap((product) => product.tags))).sort((left, right) => left.localeCompare(right));
  const filteredProducts = activeTag ? allProducts.filter((product) => product.tags.includes(activeTag)) : allProducts;
  const sortedProducts = sortProducts(filteredProducts, sort);
  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedProducts = sortedProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const heroImage = collection.image ?? collection.products.edges[0]?.node.featuredImage ?? null;
  const activeCollection = collections.find((item) => item.handle === collection.handle);

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 lg:py-12">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-on-surface-variant mb-6">
          <Link href="/" className="hover:text-secondary transition-colors">Home</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <Link href="/collections" className="hover:text-secondary transition-colors">Categories</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-on-surface font-medium">{collection.title}</span>
        </nav>

        <section className="relative overflow-hidden rounded-[28px] border border-white/60 bg-white/50 shadow-[0_18px_60px_rgba(0,35,102,0.08)] backdrop-blur-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/65 to-primary-fixed/20" />
          <div className="relative grid gap-6 lg:grid-cols-[1.2fr_0.8fr] p-6 lg:p-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary-fixed/25 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Browse collection
              </div>
              <div>
                <h1 className="text-[clamp(2rem,4vw,3.25rem)] font-extrabold tracking-[-0.03em] text-primary leading-tight">
                  {collection.title}
                </h1>
                {collection.description && (
                  <p className="mt-3 max-w-2xl text-base leading-relaxed text-on-surface-variant">
                    {collection.description}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-on-surface-variant">
                <span className="rounded-full bg-white/80 px-3 py-1 font-medium text-on-surface shadow-sm">
                  {filteredProducts.length} product{filteredProducts.length === 1 ? '' : 's'}
                </span>
                <span className="rounded-full bg-white/70 px-3 py-1 font-medium">{availableTags.length} live tag filters</span>
                {activeCollection?.description ? (
                  <span className="rounded-full bg-white/70 px-3 py-1 font-medium">Shopify powered</span>
                ) : null}
              </div>
            </div>

            <div className="relative h-[220px] overflow-hidden rounded-[24px] border border-white/70 bg-surface-container-low shadow-[0_16px_48px_rgba(0,35,102,0.08)]">
              {heroImage ? (
                <Image
                  src={heroImage.url}
                  alt={heroImage.altText ?? collection.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary-fixed/35 via-white to-secondary-container/20">
                  <span className="material-symbols-outlined text-7xl text-primary/50">inventory_2</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/18 via-transparent to-transparent" />
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 xl:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
            <div className="rounded-[24px] border border-white/60 bg-white/65 p-4 shadow-[0_12px_40px_rgba(0,35,102,0.06)] backdrop-blur-xl">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-outline">Filters</p>
                <Link href={`/collections/${collection.handle}`} className="text-xs font-semibold text-secondary hover:underline">
                  Reset
                </Link>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-on-surface-variant">Collections</p>
                  <div className="flex flex-wrap gap-2 xl:flex-col">
                    {collections.map((item) => {
                      const active = item.handle === collection.handle;
                      return (
                        <Link
                          key={item.id}
                          href={`/collections/${item.handle}`}
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

                {availableTags.length > 0 && (
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-on-surface-variant">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={getQueryHref(collection.handle, { page: currentPage, sort, tag: activeTag }, { tag: '', page: 1 })}
                        className={`rounded-full border px-3 py-2 text-xs font-semibold transition-colors ${
                          activeTag
                            ? 'border-outline-variant/40 bg-white/70 text-on-surface-variant hover:border-primary/30 hover:text-primary'
                            : 'border-primary bg-primary text-white'
                        }`}
                      >
                        All
                      </Link>
                      {availableTags.slice(0, 16).map((tag) => {
                        const active = tag === activeTag;
                        return (
                          <Link
                            key={tag}
                            href={getQueryHref(collection.handle, { page: currentPage, sort, tag: activeTag }, { tag, page: 1 })}
                            className={`rounded-full border px-3 py-2 text-xs font-semibold transition-colors ${
                              active
                                ? 'border-primary bg-primary text-white'
                                : 'border-outline-variant/40 bg-white/70 text-on-surface-variant hover:border-primary/30 hover:text-primary'
                            }`}
                          >
                            {tag}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-on-surface-variant">Sort by</p>
                  <div className="grid grid-cols-2 gap-2">
                    {SORT_OPTIONS.map((option) => {
                      const active = option.value === sort;
                      return (
                        <Link
                          key={option.value}
                          href={getQueryHref(collection.handle, { page: currentPage, sort, tag: activeTag }, { sort: option.value, page: 1 })}
                          className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
                            active
                              ? 'border-primary bg-primary text-white'
                              : 'border-outline-variant/40 bg-white/70 text-on-surface-variant hover:border-primary/30 hover:text-primary'
                          }`}
                        >
                          {option.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <div className="space-y-4">
            <div className="rounded-[24px] border border-white/60 bg-white/60 p-4 shadow-[0_12px_40px_rgba(0,35,102,0.05)] backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-outline">Browse</p>
                  <p className="mt-1 text-sm text-on-surface-variant">
                    {sort === 'relevance' ? 'Showing live Shopify products in collection order.' : `Sorted by ${SORT_OPTIONS.find((option) => option.value === sort)?.label ?? 'Relevance'}.`}
                  </p>
                </div>
                <div className="rounded-full bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                  Page {currentPage} of {totalPages}
                </div>
              </div>
            </div>

            {paginatedProducts.length === 0 ? (
              <div className="rounded-[28px] border border-white/60 bg-white/60 p-14 text-center shadow-[0_12px_40px_rgba(0,35,102,0.05)] backdrop-blur-xl">
                <span className="material-symbols-outlined mb-4 block text-6xl text-outline">inventory_2</span>
                <p className="text-lg font-semibold text-on-surface">No products match this filter.</p>
                <p className="mt-2 text-sm text-on-surface-variant">Try a different tag or reset the collection filters.</p>
                <Link
                  href={`/collections/${collection.handle}`}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white"
                >
                  Reset filters
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {paginatedProducts.map((product) => {
                  const price = product.priceRange.minVariantPrice;
                  const image = product.featuredImage;
                  const tag = product.tags[0] ?? collection.title;

                  return (
                    <Link
                      key={product.id}
                      href={`/products/${product.handle}`}
                      className="group overflow-hidden rounded-[24px] border border-white/70 bg-white/70 shadow-[0_12px_36px_rgba(0,35,102,0.06)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1"
                    >
                      <div className="relative aspect-[1.1] overflow-hidden bg-surface-container-low">
                        {image ? (
                          <Image
                            src={image.url}
                            alt={image.altText ?? product.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary-fixed/25 to-white">
                            <span className="material-symbols-outlined text-7xl text-outline">inventory_2</span>
                          </div>
                        )}
                        {!product.availableForSale && (
                          <span className="absolute left-3 top-3 rounded-full bg-on-surface/80 px-3 py-1 text-[11px] font-semibold text-white">
                            Sold out
                          </span>
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
                              {price.currencyCode} {Number.parseFloat(price.amount).toFixed(2)}
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

            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2 py-4">
                <Link
                  href={getQueryHref(collection.handle, { page: currentPage, sort, tag: activeTag }, { page: Math.max(1, currentPage - 1) })}
                  className={`rounded-full border px-3 py-2 text-sm font-semibold transition-colors ${
                    currentPage === 1
                      ? 'pointer-events-none border-outline-variant/20 bg-white/50 text-outline/40'
                      : 'border-outline-variant/30 bg-white/80 text-on-surface-variant hover:border-primary/30 hover:text-primary'
                  }`}
                >
                  Prev
                </Link>

                {Array.from({ length: totalPages }, (_, index) => index + 1).slice(0, 5).map((item) => {
                  const active = item === currentPage;
                  return (
                    <Link
                      key={item}
                      href={getQueryHref(collection.handle, { page: currentPage, sort, tag: activeTag }, { page: item })}
                      className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition-colors ${
                        active
                          ? 'border-primary bg-primary text-white'
                          : 'border-outline-variant/30 bg-white/80 text-on-surface-variant hover:border-primary/30 hover:text-primary'
                      }`}
                    >
                      {item}
                    </Link>
                  );
                })}

                <Link
                  href={getQueryHref(collection.handle, { page: currentPage, sort, tag: activeTag }, { page: Math.min(totalPages, currentPage + 1) })}
                  className={`rounded-full border px-3 py-2 text-sm font-semibold transition-colors ${
                    currentPage === totalPages
                      ? 'pointer-events-none border-outline-variant/20 bg-white/50 text-outline/40'
                      : 'border-outline-variant/30 bg-white/80 text-on-surface-variant hover:border-primary/30 hover:text-primary'
                  }`}
                >
                  Next
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
