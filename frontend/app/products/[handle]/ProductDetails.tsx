'use client';

import { useState } from 'react';
import { useEffect } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/lib/shopify/types';

type Variant = Product['variants']['edges'][number]['node'];
type ImageNode = { url: string; altText: string | null };

export default function ProductDetails({ product }: { product: Product }) {
  const images: ImageNode[] = product.images.edges.map((e) => e.node);
  if (images.length === 0 && product.featuredImage) images.push(product.featuredImage);

  const variants = product.variants.edges.map((e) => e.node);
  const hasVariants = variants.length > 1 && variants[0]?.title !== 'Default Title';

  const [activeImg, setActiveImg] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<Variant | undefined>(variants[0]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [localTags, setLocalTags] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const { addItem, isLoading } = useCart();

  const price = selectedVariant?.price;
  const comparePrice = selectedVariant?.compareAtPrice;
  const discount =
    price && comparePrice && parseFloat(comparePrice.amount) > parseFloat(price.amount)
      ? Math.round((1 - parseFloat(price.amount) / parseFloat(comparePrice.amount)) * 100)
      : null;

  async function handleAdd() {
    if (!selectedVariant?.id) return;
    await addItem(selectedVariant.id, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const currentImage = images[activeImg] ?? null;

  // Merge server-side tags with client-side overrides (localStorage)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(`product-tags-${product.id}`);
      if (raw) setLocalTags(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
    // admin mode: enable tag editing when localStorage flag is set or query param present
    try {
      const adminFlag = localStorage.getItem('klicknkart-admin');
      const qp = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('adminTagEdit') : null;
      if (adminFlag === '1' || qp === '1') setIsAdmin(true);
    } catch (e) {
      // ignore
    }
  }, [product.id]);

  // Do not show Shopify/server tags by default. Only show client-side tags
  // (local overrides) to avoid displaying tags on every product.
  const allTags = Array.from(new Set([...localTags]));

  function addLocalTag(tag: string) {
    const t = tag.trim();
    if (!t) return;
    const updated = Array.from(new Set([...localTags, t]));
    setLocalTags(updated);
    localStorage.setItem(`product-tags-${product.id}`, JSON.stringify(updated));
    setNewTag('');
  }

  function removeLocalTag(tag: string) {
    const updated = localTags.filter((t) => t !== tag);
    setLocalTags(updated);
    localStorage.setItem(`product-tags-${product.id}`, JSON.stringify(updated));
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

      {/* ── Left: Image Gallery (7 cols) ── */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        {/* Main image */}
        <div
          className="relative w-full aspect-square overflow-hidden rounded-xl border border-white/50 flex items-center justify-center p-6"
          style={{
            background: 'rgba(255,255,255,0.4)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            boxShadow: '0 30px 50px rgba(0,17,58,0.05)',
          }}
        >
          {currentImage ? (
            <Image
              src={currentImage.url}
              alt={currentImage.altText ?? product.title}
              fill
              priority
              className="object-contain mix-blend-multiply"
              sizes="(max-width: 1024px) 100vw, 58vw"
            />
          ) : (
            <span className="material-symbols-outlined text-8xl text-outline">inventory_2</span>
          )}
          {allTags.length > 0 && (
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {allTags.slice(0, 3).map((t) => (
                <div
                  key={t}
                  className="px-3 py-1 rounded-full border border-white/60 text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2"
                  style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(12px)' }}
                >
                  <span>{t}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-4">
            {images.slice(0, 4).map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`aspect-square overflow-hidden rounded-lg p-2 flex items-center justify-center border transition-all ${
                  activeImg === i
                    ? 'border-primary ring-2 ring-primary ring-offset-2'
                    : 'border-white/50 hover:bg-white/50'
                }`}
                style={{ background: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(12px)' }}
              >
                <Image
                  src={img.url}
                  alt={img.altText ?? product.title}
                  width={120}
                  height={120}
                  className="object-contain mix-blend-multiply w-full h-full"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Right: Details (5 cols) ── */}
      <div className="lg:col-span-5 flex flex-col gap-5 lg:pt-2">

        {/* Title */}
        <h1
          className="text-primary"
          style={{ fontSize: '40px', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em' }}
        >
          {product.title}
        </h1>

        {/* Tags row + small tag manager */}
        {/* Only display local/client-side tags. Show tag editor only to admins. */}
        {allTags.length > 0 && (
          <div className="flex items-center gap-3 flex-wrap">
            {allTags.map((t) => (
              <span
                key={t}
                className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-primary border border-white/30"
                style={{ background: 'rgba(255,255,255,0.35)' }}
              >
                {t}
                {localTags.includes(t) && isAdmin && (
                  <button
                    onClick={() => removeLocalTag(t)}
                    className="ml-2 text-xs text-outline"
                    aria-label={`Remove ${t}`}
                  >
                    ×
                  </button>
                )}
              </span>
            ))}
          </div>
        )}

        {isAdmin && (
          <div className="flex items-center gap-2 mt-2">
            <input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add tag (e.g. Best Seller)"
              className="px-3 py-1 rounded-lg text-sm bg-white/20 placeholder:text-on-surface-variant"
            />
            <button
              onClick={() => addLocalTag(newTag)}
              className="px-3 py-1 rounded-lg text-sm font-semibold text-primary"
              style={{ background: 'rgba(219,225,255,0.6)' }}
            >
              Add tag (admin)
            </button>
          </div>
        )}

        {/* Price row */}
        <div className="flex items-center gap-4 pb-5 border-b border-outline-variant/40">
          <span className="text-secondary" style={{ fontSize: '36px', fontWeight: 700 }}>
            {price?.currencyCode}{' '}
            {parseFloat(price?.amount ?? '0').toFixed(2)}
          </span>
          {discount && comparePrice && (
            <>
              <span className="text-outline line-through text-lg">
                {comparePrice.currencyCode} {parseFloat(comparePrice.amount).toFixed(2)}
              </span>
              <span
                className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-primary"
                style={{ background: 'rgba(219,225,255,0.8)' }}
              >
                Save {discount}%
              </span>
            </>
          )}
        </div>

        {/* Description */}
        {product.description && (
          <p className="text-on-surface-variant leading-relaxed">{product.description}</p>
        )}

        {/* Variant selector */}
        {hasVariants && (
          <div>
            <h3 className="text-sm font-bold text-on-surface mb-3 uppercase tracking-wider">Options</h3>
            <div className="grid grid-cols-3 gap-3">
              {variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  disabled={!v.availableForSale}
                  className={`py-2 px-4 rounded-lg text-sm font-semibold text-center transition-all ${
                    selectedVariant?.id === v.id
                      ? 'border-2 border-primary text-primary'
                      : v.availableForSale
                      ? 'border border-white/50 text-on-surface-variant hover:bg-white/40'
                      : 'border border-outline-variant/30 text-outline line-through cursor-not-allowed'
                  }`}
                  style={
                    selectedVariant?.id === v.id
                      ? { background: 'rgba(255,255,255,0.5)' }
                      : { background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }
                  }
                >
                  {v.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity + Add to Cart + Wishlist */}
        {product.availableForSale ? (
          <div className="flex items-center gap-3 pt-2">
            {/* Qty stepper */}
            <div
              className="flex items-center rounded-lg p-1 border border-white/50 shrink-0"
              style={{ background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(20px)' }}
            >
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center text-on-surface hover:bg-surface-variant rounded-md transition-colors"
              >
                <span className="material-symbols-outlined">remove</span>
              </button>
              <span className="w-12 text-center font-bold text-primary text-base">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-10 h-10 flex items-center justify-center text-on-surface hover:bg-surface-variant rounded-md transition-colors"
              >
                <span className="material-symbols-outlined">add</span>
              </button>
            </div>

            {/* Add to cart button */}
            <button
              onClick={handleAdd}
              disabled={isLoading || !selectedVariant?.id}
              className="flex-1 h-12 rounded-lg flex items-center justify-center gap-2 text-white font-semibold text-base transition-all disabled:opacity-60"
              style={{
                background: added ? '#1e7d3c' : '#0058bc',
                boxShadow: '0 10px 20px rgba(0,88,188,0.2)',
              }}
            >
              {isLoading ? (
                <span className="material-symbols-outlined animate-spin">autorenew</span>
              ) : added ? (
                <>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                  Added!
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    shopping_bag
                  </span>
                  Add to Cart
                </>
              )}
            </button>

            {/* Wishlist */}
            <button
              className="w-12 h-12 rounded-lg flex items-center justify-center text-primary border border-primary/20 hover:bg-surface-variant transition-colors shrink-0"
              style={{ background: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(20px)' }}
            >
              <span className="material-symbols-outlined">favorite_border</span>
            </button>
          </div>
        ) : (
          <div
            className="rounded-xl p-4 text-center border border-outline-variant/30"
            style={{ background: 'rgba(255,255,255,0.3)' }}
          >
            <p className="text-on-surface-variant font-semibold">Out of Stock</p>
            <p className="text-sm text-outline mt-1">This item is currently unavailable</p>
          </div>
        )}

        {/* Spec bento */}
        <div className="grid grid-cols-2 gap-4 mt-2">
          {[
            { icon: 'local_shipping', title: 'Free Shipping', body: 'On orders over KES 5,000' },
            { icon: 'verified', title: 'Genuine Products', body: '100% authentic items' },
            { icon: 'water_drop', title: 'Quick Dry Ink', body: 'Smear-resistant formula' },
            { icon: 'support_agent', title: '24/7 Support', body: 'Mon–Sat 8am–6pm' },
          ].map(({ icon, title, body }) => (
            <div
              key={title}
              className="flex items-start gap-3 p-4 rounded-xl border border-white/40"
              style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(30px)' }}
            >
              <span className="material-symbols-outlined text-secondary mt-0.5">{icon}</span>
              <div>
                <h4 className="font-semibold text-primary text-sm">{title}</h4>
                <p className="text-xs text-on-surface-variant mt-0.5">{body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Description HTML */}
        {product.descriptionHtml && (
          <div
            className="rounded-xl p-5 border border-white/40"
            style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(20px)' }}
          >
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">Product Details</p>
            <div
              className="prose prose-sm text-on-surface-variant"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
