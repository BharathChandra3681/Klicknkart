import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <span className="material-symbols-outlined text-8xl text-outline mb-6">search_off</span>
      <h1 className="text-6xl font-extrabold text-primary mb-3">404</h1>
      <p className="text-xl font-semibold text-on-surface mb-2">Page not found</p>
      <p className="text-on-surface-variant max-w-md mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex gap-3 flex-wrap justify-center">
        <Link href="/"
          className="px-6 py-3 rounded-xl text-white font-semibold transition-all"
          style={{ background: '#0058bc', boxShadow: '0 4px 14px rgba(0,88,188,0.25)' }}>
          Back to Home
        </Link>
        <Link href="/products"
          className="px-6 py-3 rounded-xl font-semibold text-primary border border-outline-variant hover:bg-surface-container transition-colors">
          Browse Products
        </Link>
      </div>
    </div>
  );
}
