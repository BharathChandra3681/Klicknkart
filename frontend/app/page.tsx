import Link from 'next/link';
import Image from 'next/image';
import { getProducts, getCollections } from '@/lib/shopify';
import HeroCarousel from '@/components/HeroCarousel';
import Footer from '@/components/Footer';
import type { Product } from '@/lib/shopify/types';

export const revalidate = 60;

const ICT_CATEGORIES = [
  { icon: 'mouse', label: 'Wireless Mice', sub: 'Precision ergonomic designs', href: '/collections/ict-accessories' },
  { icon: 'usb', label: 'Storage Media', sub: 'Flash drives & SSDs', href: '/collections/ict-accessories' },
  { icon: 'settings_input_hdmi', label: 'Cables & Adapters', sub: 'High-speed connectivity', href: '/collections/ict-accessories' },
  { icon: 'keyboard', label: 'Workstation Kits', sub: 'Keyboard & mouse bundles', href: '/collections/ict-accessories' },
];

function ProductCard({ product }: { product: Product }) {
  const price = product.priceRange.minVariantPrice;
  const image = product.featuredImage;

  return (
    <div className="group relative bg-white/50 border border-outline-variant/30 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="aspect-square relative overflow-hidden bg-white">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText ?? product.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-container">
            <span className="material-symbols-outlined text-[64px] text-outline">inventory_2</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        <Link
          href={`/products/${product.handle}`}
          className="absolute bottom-4 left-4 right-4 bg-primary text-white py-3 rounded-lg flex items-center justify-center gap-2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 text-sm font-medium"
        >
          <span className="material-symbols-outlined text-sm">shopping_cart</span>
          View Product
        </Link>
      </div>
      <div className="p-4">
        <p className="text-xs text-secondary font-bold uppercase tracking-wider mb-1">
          {product.tags[0] ?? 'Stationery'}
        </p>
        <h3 className="text-primary font-bold line-clamp-1">{product.title}</h3>
        <div className="flex items-center gap-2 mt-2">
          <span className="font-bold text-lg text-primary">
            {parseFloat(price.amount) > 0
              ? `${price.currencyCode} ${parseFloat(price.amount).toFixed(2)}`
              : 'Price on request'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default async function HomePage() {
  const [products, collections] = await Promise.all([
    getProducts(8),
    getCollections(8),
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
                <Link href={`/products/${p.handle}`}
                  className="bg-primary text-white p-2 rounded-full hover:bg-secondary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                </Link>
              </div>
            </div>
          )) : (
            /* Placeholder cards when no products yet */
            [
              { title: 'A4 Premium Bond Paper', sub: 'Ream of 500 sheets, 80gsm', price: '$12.99', icon: 'description' },
              { title: 'Titan Executive Fountain Pen', sub: 'Brushed silver, fine nib', price: '$45.00', icon: 'edit' },
              { title: 'Modern Desk Organizer', sub: 'Stackable, matte black steel', price: '$24.95', icon: 'inventory_2' },
            ].map((item) => (
              <div key={item.title} className="glass-card rounded-xl p-4 group">
                <div className="aspect-square bg-white rounded-lg mb-4 overflow-hidden flex items-center justify-center">
                  <span className="material-symbols-outlined text-[100px] text-outline-variant">{item.icon}</span>
                </div>
                <h3 className="font-bold text-primary mb-1">{item.title}</h3>
                <p className="text-sm text-on-surface-variant mb-3">{item.sub}</p>
                <div className="flex justify-between items-center">
                  <span className="text-secondary font-bold">{item.price}</span>
                  <button className="bg-primary text-white p-2 rounded-full hover:bg-secondary transition-colors">
                    <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                  </button>
                </div>
              </div>
            ))
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

      {/* ── ICT & Accessories ── */}
      <section className="w-full py-16 mt-8" style={{ background: 'rgba(0,17,58,0.03)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-12">
            <span className="text-xs font-bold text-secondary uppercase tracking-widest mb-2">Digital Core</span>
            <h2 className="text-[32px] font-semibold tracking-tight text-primary">Computer Hardware & ICT</h2>
            <p className="text-base text-on-surface-variant max-w-2xl mt-2">Professional-grade peripherals and connectivity solutions for the modern workstation.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {ICT_CATEGORIES.map((item) => (
              <div key={item.label} className="glass-card rounded-xl p-6 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(0,17,58,0.08)' }}>
                  <span className="material-symbols-outlined text-[40px] text-primary">{item.icon}</span>
                </div>
                <h3 className="font-bold text-primary">{item.label}</h3>
                <p className="text-xs text-on-surface-variant mt-1 mb-4">{item.sub}</p>
                <Link href={item.href} className="text-secondary text-sm font-bold flex items-center gap-1">
                  Shop Now <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            ))}
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
