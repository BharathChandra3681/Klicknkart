import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
      <h1 className="text-2xl font-semibold text-gray-900">Page not found</h1>
      <p className="mt-2 text-sm text-gray-500">The page you're looking for doesn't exist.</p>
      <Link
        href="/"
        className="mt-6 rounded-md bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-700"
      >
        Back to home
      </Link>
    </main>
  );
}
