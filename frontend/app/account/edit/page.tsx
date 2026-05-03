'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { useCustomer } from '@/context/CustomerContext';

const GLASS = {
  background: 'rgba(255,255,255,0.4)',
  backdropFilter: 'blur(40px)',
  WebkitBackdropFilter: 'blur(40px)',
  borderTop: '1px solid rgba(255,255,255,0.8)',
  borderLeft: '1px solid rgba(255,255,255,0.8)',
  borderRight: '1px solid rgba(0,35,102,0.1)',
  borderBottom: '1px solid rgba(0,35,102,0.1)',
  boxShadow: '0 8px 32px 0 rgba(0,35,102,0.05)',
} as const;

export default function EditProfilePage() {
  const router  = useRouter();
  const { customer, loading, updateProfile } = useCustomer();

  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [email,     setEmail]     = useState('');
  const [phone,     setPhone]     = useState('');
  const [newPass,   setNewPass]   = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const [saving,   setSaving]  = useState(false);
  const [error,    setError]   = useState('');
  const [success,  setSuccess] = useState(false);

  useEffect(() => {
    if (!loading && !customer) router.replace('/account/login');
  }, [loading, customer, router]);

  useEffect(() => {
    if (customer) {
      setFirstName(customer.firstName ?? '');
      setLastName(customer.lastName  ?? '');
      setEmail(customer.email);
      setPhone(customer.phone ?? '');
    }
  }, [customer]);

  if (loading) return (
    <main className="min-h-screen flex items-center justify-center">
      <span className="material-symbols-outlined animate-spin text-secondary text-4xl">autorenew</span>
    </main>
  );
  if (!customer) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (newPass && newPass !== confirmPass) {
      setError('Passwords do not match.');
      return;
    }
    if (newPass && newPass.length < 5) {
      setError('Password must be at least 5 characters.');
      return;
    }

    setSaving(true);
    try {
      const input: Record<string, string> = { firstName, lastName, email, phone };
      if (newPass) input.password = newPass;

      const errors = await updateProfile(input);
      if (errors.length > 0) setError(errors[0].message);
      else {
        setSuccess(true);
        setNewPass('');
        setConfirmPass('');
        setTimeout(() => router.push('/account'), 1500);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  const inputCls = "w-full px-4 py-3 rounded-xl border border-outline-variant/50 bg-white/50 text-on-surface text-sm focus:outline-none focus:border-secondary transition-colors";
  const labelCls = "block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2";

  return (
    <>
      <main className="max-w-3xl mx-auto px-6 lg:px-8 py-10">
        {/* Back link */}
        <Link href="/account" className="inline-flex items-center gap-1 text-sm text-secondary font-semibold mb-8 hover:underline">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Back to Account
        </Link>

        <h1 className="text-3xl font-extrabold text-primary mb-8">Edit Profile</h1>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">

            {/* Personal info */}
            <div className="rounded-2xl p-6" style={GLASS}>
              <h2 className="text-base font-bold text-primary mb-5 flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-secondary">person</span>
                Personal Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>First Name</label>
                  <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputCls} placeholder="Jane" />
                </div>
                <div>
                  <label className={labelCls}>Last Name</label>
                  <input value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputCls} placeholder="Doe" />
                </div>
                <div>
                  <label className={labelCls}>Email Address</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputCls} placeholder="jane@example.com" />
                </div>
                <div>
                  <label className={labelCls}>Phone Number</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} placeholder="+254 700 000 000" />
                </div>
              </div>
            </div>

            {/* Change password */}
            <div className="rounded-2xl p-6" style={GLASS}>
              <h2 className="text-base font-bold text-primary mb-1 flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-secondary">lock</span>
                Change Password
              </h2>
              <p className="text-xs text-on-surface-variant mb-5">Leave blank to keep your current password.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>New Password</label>
                  <input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} className={inputCls} placeholder="Min. 5 characters" minLength={5} />
                </div>
                <div>
                  <label className={labelCls}>Confirm Password</label>
                  <input type="password" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} className={inputCls} placeholder="Repeat new password" />
                </div>
              </div>
            </div>

            {/* Error / success */}
            {error && (
              <div className="rounded-xl px-4 py-3 text-sm" style={{ background: '#ffdad6', color: '#ba1a1a', border: '1px solid rgba(186,26,26,0.2)' }}>
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-xl px-4 py-3 text-sm flex items-center gap-2" style={{ background: '#d4edda', color: '#1e7d3c', border: '1px solid rgba(30,125,60,0.2)' }}>
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                Profile updated successfully. Redirecting…
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-3 rounded-xl text-white font-bold text-base flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                style={{ background: '#0058bc', boxShadow: '0 4px 14px rgba(0,88,188,0.25)' }}
              >
                {saving
                  ? <span className="material-symbols-outlined animate-spin">autorenew</span>
                  : <><span className="material-symbols-outlined">save</span> Save Changes</>}
              </button>
              <Link
                href="/account"
                className="px-6 py-3 rounded-xl font-semibold text-primary border border-outline-variant hover:bg-surface-container transition-colors text-base flex items-center gap-2"
              >
                Cancel
              </Link>
            </div>

          </div>
        </form>
      </main>
      <Footer />
    </>
  );
}
