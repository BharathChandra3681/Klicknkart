'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="glass-panel rounded-2xl p-10 w-full max-w-md">
        <Link href="/" className="text-xl font-extrabold text-primary block text-center mb-8">KlicknKart</Link>

        <h1 className="text-2xl font-bold text-on-surface mb-1">Welcome back</h1>
        <p className="text-sm text-on-surface-variant mb-6">Sign in to your account</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            // Shopify Customer Account API integration goes here
          }}
          className="flex flex-col gap-4"
        >
          <div>
            <label className="text-sm font-medium text-on-surface block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-white/70 focus:outline-none focus:ring-2 focus:ring-secondary/40"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-on-surface block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-white/70 focus:outline-none focus:ring-2 focus:ring-secondary/40"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-secondary text-white rounded-xl font-semibold hover:bg-primary transition-colors btn-primary mt-2"
          >
            Sign In
          </button>
        </form>

        <p className="text-sm text-center text-on-surface-variant mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/account/register" className="text-secondary font-semibold hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
