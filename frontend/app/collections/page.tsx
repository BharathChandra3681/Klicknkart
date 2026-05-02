import Link from 'next/link';
import Image from 'next/image';
import { getCollections } from '@/lib/shopify';
import Footer from '@/components/Footer';

export const revalidate = 60;

export default async function CollectionsPage() {
  const collections = await getCollections(20);

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-primary">Shop by Category</h1>
          <p className="text-on-surface-variant mt-1">Browse our full range of stationery and office supplies</p>
        </div>

        {collections.length === 0 ? (
          <div className="glass-card rounded-2xl p-16 text-center">
            <span className="material-symbols-outlined text-6xl text-outline block mb-4">category</span>
            <p className="text-on-surface-variant">No categories yet. Add collections in your Shopify admin.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {collections.map((collection) => {
              const image =
                collection.image ??
                collection.products.edges[0]?.node.featuredImage ?? null;

              return (
                <Link
                  key={collection.id}
                  href={`/collections/${collection.handle}`}
                  className="group flex flex-col overflow-hidden rounded-2xl glass-card hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative aspect-square overflow-hidden rounded-t-2xl bg-surface-container">
                    {image ? (
                      <Image
                        src={image.url}
                        alt={image.altText ?? collection.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-4xl">{getCategoryEmoji(collection.handle)}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-on-surface group-hover:text-primary transition-colors">
                      {collection.title}
                    </p>
                    {collection.description && (
                      <p className="mt-1 text-xs text-on-surface-variant line-clamp-2">{collection.description}</p>
                    )}
                    <div className="mt-3 flex items-center gap-1 text-xs text-secondary font-medium">
                      <span>Shop now</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </>
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
