import Link from 'next/link';
import Footer from '@/components/Footer';

export default function AccountPage() {
  return (
    <>
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="glass-panel rounded-2xl p-10 w-full max-w-md text-center">
          <span className="material-symbols-outlined text-6xl text-secondary mb-4 block">account_circle</span>
          <h1 className="text-2xl font-extrabold text-primary mb-2">My Account</h1>
          <p className="text-on-surface-variant text-sm mb-8">
            Sign in to view your orders and manage your profile.
          </p>

          <div className="flex flex-col gap-3">
            <Link
              href="/account/login"
              className="w-full py-3 bg-secondary text-white rounded-xl font-semibold hover:bg-primary transition-colors btn-primary"
            >
              Sign In
            </Link>
            <Link
              href="/account/register"
              className="w-full py-3 border border-secondary text-secondary rounded-xl font-semibold hover:bg-secondary/5 transition-colors"
            >
              Create Account
            </Link>
          </div>

          <p className="text-xs text-outline mt-6">
            Secure checkout powered by Shopify
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
