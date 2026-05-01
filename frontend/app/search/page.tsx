'use client';

import { useState, useEffect, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';
import type { Product } from '@/lib/shopify/types';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [searched, setSearched] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q') ?? '';
    if (q) {
      setQuery(q);
      doSearch(q);
    }
  }, []);

  function doSearch(q: string) {
    if (!q.trim()) return;
    setSearched(true);
    startTransition(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.products ?? []);
    });
  }

  return (
    <>
      <main className="min-h-screen px-8 py-12 max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold text-primary mb-8">Search Products</h1>

        {/* Search bar */}
        <form
          onSubmit={(e) => { e.preventDefault(); doSearch(query); }}
          className="flex gap-3 mb-10"
        >
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for pens, paper, folders…"
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-outline-variant bg-white/80 backdrop-blur focus:outline-none focus:ring-2 focus:ring-secondary/40 text-on-surface"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-secondary text-white font-semibold hover:bg-primary transition-colors btn-primary"
          >
            Search
          </button>
        </form>

        {/* Results */}
        {isPending && (
          <div className="flex justify-center py-20">
            <span className="material-symbols-outlined animate-spin text-secondary text-4xl">autorenew</span>
          </div>
        )}

        {!isPending && searched && results.length === 0 && (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-outline mb-4 block">search_off</span>
            <p className="text-on-surface-variant text-lg">No products found for &ldquo;{query}&rdquo;</p>
            <Link href="/products" className="mt-4 inline-block text-secondary font-semibold hover:underline">
              Browse all products
            </Link>
          </div>
        )}

        {!isPending && results.length > 0 && (
          <>
            <p className="text-sm text-on-surface-variant mb-6">{results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {results.map((product) => {
                const price = product.priceRange.minVariantPrice;
                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.handle}`}
                    className="group glass-card rounded-xl overflow-hidden"
                  >
                    <div className="aspect-square relative bg-surface-container-low overflow-hidden">
                      {product.featuredImage ? (
                        <Image
                          src={product.featuredImage.url}
                          alt={product.featuredImage.altText ?? product.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="material-symbols-outlined text-5xl text-outline">inventory_2</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-sm font-semibold text-on-surface line-clamp-2">{product.title}</p>
                      <p className="text-sm font-bold text-secondary mt-1">
                        {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}

        {!searched && (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-outline mb-4 block">manage_search</span>
            <p className="text-on-surface-variant">Start typing to search across all products</p>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
