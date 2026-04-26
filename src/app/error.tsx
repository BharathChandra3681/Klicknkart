'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
      <h1 className="text-2xl font-semibold text-gray-900">Something went wrong</h1>
      <p className="mt-2 text-sm text-gray-500">{error.message || 'An unexpected error occurred.'}</p>
      <button
        onClick={reset}
        className="mt-6 rounded-md bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-700"
      >
        Try again
      </button>
    </main>
  );
}
