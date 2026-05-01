'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="glass-panel rounded-2xl p-10 w-full max-w-md">
        <Link href="/" className="text-xl font-extrabold text-primary block text-center mb-8">KlicknKart</Link>

        <h1 className="text-2xl font-bold text-on-surface mb-1">Create account</h1>
        <p className="text-sm text-on-surface-variant mb-6">Join KlicknKart today</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            // Shopify Customer Account API integration goes here
          }}
          className="flex flex-col gap-4"
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-on-surface block mb-1">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                placeholder="John"
                className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-white/70 focus:outline-none focus:ring-2 focus:ring-secondary/40"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-on-surface block mb-1">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                placeholder="Doe"
                className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-white/70 focus:outline-none focus:ring-2 focus:ring-secondary/40"
              />
            </div>
          </div>
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
              placeholder="Min. 8 characters"
              minLength={8}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-white/70 focus:outline-none focus:ring-2 focus:ring-secondary/40"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-secondary text-white rounded-xl font-semibold hover:bg-primary transition-colors btn-primary mt-2"
          >
            Create Account
          </button>
        </form>

        <p className="text-sm text-center text-on-surface-variant mt-6">
          Already have an account?{' '}
          <Link href="/account/login" className="text-secondary font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
