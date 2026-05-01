import Link from 'next/link';
import Image from 'next/image';
import { getCollections } from '@/lib/shopify';

export const revalidate = 60;

export default async function CollectionsPage() {
  const collections = await getCollections(20);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-zinc-900">Shop by Category</h1>
      <p className="mb-8 text-zinc-500">Browse our full range of stationery and office supplies</p>

      {collections.length === 0 ? (
        <p className="text-zinc-500">No categories yet. Add collections in your Shopify admin.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {collections.map((collection) => {
            const image =
              collection.image ??
              collection.products.edges[0]?.node.featuredImage ?? null;

            return (
              <Link
                key={collection.id}
                href={`/collections/${collection.handle}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-square overflow-hidden bg-zinc-100">
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
                  <p className="font-semibold text-zinc-900 group-hover:text-zinc-600 transition-colors">
                    {collection.title}
                  </p>
                  {collection.description && (
                    <p className="mt-1 text-xs text-zinc-500 line-clamp-2">{collection.description}</p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
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
