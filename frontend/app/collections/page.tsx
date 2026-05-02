import Link from 'next/link';
import Image from 'next/image';
import { getCollections } from '@/lib/shopify';
import Footer from '@/components/Footer';

export const revalidate = 60;

const CATEGORY_ICONS: Record<string, string> = {
  paper: 'description', 'pens-pencils': 'edit', 'files-folders': 'folder',
  'envelopes-holders': 'mail', 'staplers-punches': 'push_pin', batteries: 'battery_full',
  'binders-clips': 'attach_file', calculators: 'calculate', 'ict-accessories': 'devices',
  'books-notes': 'menu_book', 'board-markers': 'draw', 'tapes-glue': 'content_paste',
  'scissors-pins': 'content_cut', 'trays-dispensers': 'inbox', 'rulers-stamps-tissue': 'straighten',
  'printer-toners': 'print',
};

export default async function CollectionsPage() {
  const collections = await getCollections(250);

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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {collections.map((collection) => {
              const image = collection.image ?? collection.products.edges[0]?.node.featuredImage ?? null;
              const icon = CATEGORY_ICONS[collection.handle] ?? 'category';
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
                        <span className="material-symbols-outlined text-5xl text-secondary">{icon}</span>
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
            })}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
