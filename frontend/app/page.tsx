import Link from 'next/link';
import Image from 'next/image';
import { getProducts, getCollections } from '@/lib/shopify';
import HeroCarousel from '@/components/HeroCarousel';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import QuickAddButton from '@/components/QuickAddButton';

export const revalidate = 60;


export default async function HomePage() {
  const [{ products }, collections] = await Promise.all([
    getProducts(8),
    getCollections(20),
  ]);

  const stationeryProducts = products.slice(0, 3);

  return (
    <main className="flex flex-col items-center">

      {/* ── Hero Carousel ── */}
      <HeroCarousel />

      {/* ── Essential Office Stationery ── */}
      <section className="w-full max-w-7xl mx-auto py-16 px-6">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-[32px] font-semibold leading-tight tracking-tight text-primary mb-2">Essential Office Stationery</h2>
            <p className="text-base text-on-surface-variant">High-quality paper, pens, and desk organisation.</p>
          </div>
          <Link href="/products" className="text-secondary font-bold flex items-center gap-1 hover:underline">
            View All Stationery <span className="material-symbols-outlined">chevron_right</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stationeryProducts.length > 0 ? stationeryProducts.map((p) => (
            <div key={p.id} className="glass-card rounded-xl p-4 group">
              <div className="aspect-square bg-white rounded-lg mb-4 overflow-hidden">
                {p.featuredImage ? (
                  <Image
                    src={p.featuredImage.url}
                    alt={p.featuredImage.altText ?? p.title}
                    width={400} height={400}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-[80px] text-outline-variant">inventory_2</span>
                  </div>
                )}
              </div>
              <h3 className="font-bold text-primary mb-1">{p.title}</h3>
              <p className="text-sm text-on-surface-variant mb-3">{p.description?.slice(0, 50) || 'Office stationery'}</p>
              <div className="flex justify-between items-center">
                <span className="text-secondary font-bold">
                  {parseFloat(p.priceRange.minVariantPrice.amount) > 0
                    ? `${p.priceRange.minVariantPrice.currencyCode} ${parseFloat(p.priceRange.minVariantPrice.amount).toFixed(2)}`
                    : 'Price on request'}
                </span>
                <QuickAddButton variantId={p.variants.edges[0]?.node.id} availableForSale={p.availableForSale} />
              </div>
            </div>
          )) : (
            <div className="col-span-full glass-card rounded-2xl p-10 text-center">
              <span className="material-symbols-outlined text-[64px] text-outline-variant block mb-3">inventory_2</span>
              <p className="text-on-surface-variant">No products are available in Shopify yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Promotional Banners ── */}
      <section className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
        <div className="relative rounded-2xl overflow-hidden h-[240px] glass-panel border border-primary/10">
          <div className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuD11Fbr40O5T_MQV37FMZ665Mj5UtsjR9IL9VVmrBHNNdXTnueBKjSaipZCvUc49Bw7FhX8V6CzAHxYRGrtUKBKnyMg6gxxx5rAHKeglg1sL2rzFuZYoTYoRxzL6TAd-Ohwc9qzVb36cg8GQ2RUXfHT4aJPVoMRKAho7pHBfYh9kRc2edfVg6O5G7PFHIiY4P0vibT5uAzn9dsDmY-GUez_VWgYSkm10tq35zMTOFFPJ9vizBsn2vIAdVFH5lb09C3UUrW318WNgls')` }} />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-container/90 to-primary/40 z-10 p-8 flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-white mb-2">Corporate Bulk Orders</h3>
            <p className="text-white/80 mb-6 max-w-[280px]">Save up to 25% on wholesale stationery and equipment for your entire office.</p>
            <button className="bg-white text-primary px-6 py-2 rounded-full w-fit font-bold text-sm hover:bg-surface-bright transition-colors">Get a Quote</button>
          </div>
        </div>
        <div className="relative rounded-2xl overflow-hidden h-[240px] glass-panel border border-secondary/10">
          <div className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuD11Fbr40O5T_MQV37FMZ665Mj5UtsjR9IL9VVmrBHNNdXTnueBKjSaipZCvUc49Bw7FhX8V6CzAHxYRGrtUKBKnyMg6gxxx5rAHKeglg1sL2rzFuZYoTYoRxzL6TAd-Ohwc9qzVb36cg8GQ2RUXfHT4aJPVoMRKAho7pHBfYh9kRc2edfVg6O5G7PFHIiY4P0vibT5uAzn9dsDmY-GUez_VWgYSkm10tq35zMTOFFPJ9vizBsn2vIAdVFH5lb09C3UUrW318WNgls')` }} />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary-container/90 to-secondary/40 z-10 p-8 flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-white mb-2">Tech Refresh 2025</h3>
            <p className="text-white/80 mb-6 max-w-[280px]">Latest ergonomic mice and peripheral hardware just arrived in stock.</p>
            <Link href="/collections/ict-accessories"
              className="bg-white text-secondary px-6 py-2 rounded-full w-fit font-bold text-sm hover:bg-surface-bright transition-colors">
              Shop Hardware
            </Link>
          </div>
        </div>
      </section>

      {/* ── Live Categories ── */}
      <section className="w-full py-16 mt-8" style={{ background: 'rgba(0,17,58,0.03)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-12">
            <span className="text-xs font-bold text-secondary uppercase tracking-widest mb-2">Live catalog</span>
            <h2 className="text-[32px] font-semibold tracking-tight text-primary">Shop every Shopify category</h2>
            <p className="text-base text-on-surface-variant max-w-2xl mt-2">Tap any collection to open the live browse page with current products, tags, and pricing.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {collections.length > 0 ? collections.map((collection) => {
              const image = collection.image ?? collection.products.edges[0]?.node.featuredImage ?? null;

              return (
                <Link
                  key={collection.id}
                  href={`/collections/${collection.handle}`}
                  className="group glass-card rounded-xl overflow-hidden flex flex-col"
                >
                  <div className="relative aspect-square overflow-hidden bg-surface-container-low">
                    {image ? (
                      <Image
                        src={image.url}
                        alt={image.altText ?? collection.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-primary-fixed/20">
                        <span className="text-4xl">{getCategoryEmoji(collection.handle)}</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <p className="font-bold text-on-surface group-hover:text-secondary transition-colors">{collection.title}</p>
                    {collection.description && (
                      <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">{collection.description}</p>
                    )}
                    <p className="text-xs text-secondary font-semibold mt-2 flex items-center gap-1">
                      Shop now <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </p>
                  </div>
                </Link>
              );
            }) : (
              <div className="col-span-full glass-card rounded-2xl p-10 text-center">
                <span className="material-symbols-outlined text-[64px] text-outline-variant block mb-3">category</span>
                <p className="text-on-surface-variant">No Shopify collections are available yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Best Sellers ── */}
      {products.length > 0 && (
        <section className="w-full max-w-7xl mx-auto py-16 px-6">
          <h2 className="text-[32px] font-semibold tracking-tight text-primary mb-10 text-center">Bestselling Business Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 8).map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
          <div className="mt-10 text-center">
            <Link href="/products"
              className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-8 py-3 rounded-full btn-primary hover:bg-primary-container transition-colors">
              View All Products <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
        </section>
      )}

      {/* ── Footer ── */}
      <Footer />
    </main>
  );
}

function getCategoryEmoji(handle: string): string {
  const map: Record<string, string> = {
    paper: '📄',
    'pens-pencils': '✏️',
    'files-folders': '🗂️',
    'envelopes-holders': '✉️',
    'staplers-punches': '📌',
    batteries: '🔋',
    'binders-clips': '📎',
    calculators: '🧮',
    'ict-accessories': '💾',
    'books-notes': '📓',
    'board-markers': '🖊️',
    'tapes-glue': '🧲',
    'scissors-pins': '✂️',
    'trays-dispensers': '🗳️',
    'rulers-stamps-tissue': '📏',
    'printer-toners': '🖨️',
  };
  return map[handle] ?? '📦';
}
