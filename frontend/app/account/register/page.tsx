'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCustomer } from '@/context/CustomerContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useCustomer();

  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [marketing, setMarketing] = useState(false);
  const [error,     setError]     = useState('');
  const [loading,   setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const errors = await register({ firstName, lastName, email, password, acceptsMarketing: marketing });
      if (errors.length > 0) setError(errors[0].message);
      else router.push('/account');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'radial-gradient(ellipse at 10% 15%, rgba(179,197,255,0.3) 0%, transparent 50%), radial-gradient(ellipse at 90% 85%, rgba(137,208,237,0.2) 0%, transparent 50%), #eef0f4',
      fontFamily: "'Manrope', sans-serif",
    }}>

      {/* Page body */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>

        {/* Card */}
        <div style={{
          width: '100%',
          maxWidth: '420px',
          background: '#ffffff',
          borderRadius: '16px',
          padding: '48px 40px 40px',
          boxShadow: '0 4px 48px rgba(0,17,58,0.10)',
        }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Link href="/" style={{ display: 'block', fontSize: '22px', fontWeight: 900, color: '#1a3faa', letterSpacing: '-0.5px', marginBottom: '16px', textDecoration: 'none' }}>
              KlicknKart
            </Link>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#00113a', margin: '0 0 6px', lineHeight: 1.2 }}>Create Account</h1>
            <p style={{ fontSize: '14px', color: '#444650', margin: 0, lineHeight: 1.5 }}>Sign up to access exclusive features and track orders.</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {error && (
              <div style={{ fontSize: '13px', color: '#ba1a1a', background: '#ffdad6', border: '1px solid rgba(186,26,26,0.2)', borderRadius: '8px', padding: '10px 14px' }}>
                {error}
              </div>
            )}

            {/* First + Last Name */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                { id: 'firstName', label: 'First Name', value: firstName, set: setFirstName, placeholder: 'Jane' },
                { id: 'lastName',  label: 'Last Name',  value: lastName,  set: setLastName,  placeholder: 'Doe' },
              ].map(({ id, label, value, set, placeholder }) => (
                <div key={id}>
                  <label htmlFor={id} style={{ display: 'block', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#757682', marginBottom: '6px' }}>
                    {label}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span className="material-symbols-outlined" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: '#9ea0ab', fontVariationSettings: "'wght' 300" }}>person</span>
                    <input
                      id={id} type="text" value={value} onChange={(e) => set(e.target.value)} required placeholder={placeholder}
                      style={{ width: '100%', boxSizing: 'border-box', padding: '11px 14px 11px 36px', fontSize: '14px', color: '#191c1e', background: 'rgba(0,17,58,0.04)', border: '1px solid rgba(117,118,130,0.3)', borderRadius: '8px', outline: 'none', fontFamily: 'inherit' }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" style={{ display: 'block', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#757682', marginBottom: '6px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <span className="material-symbols-outlined" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: '#9ea0ab', fontVariationSettings: "'wght' 300" }}>mail</span>
                <input
                  id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="jane.doe@example.com"
                  style={{ width: '100%', boxSizing: 'border-box', padding: '11px 14px 11px 38px', fontSize: '14px', color: '#191c1e', background: 'rgba(0,17,58,0.04)', border: '1px solid rgba(117,118,130,0.3)', borderRadius: '8px', outline: 'none', fontFamily: 'inherit' }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" style={{ display: 'block', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#757682', marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <span className="material-symbols-outlined" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: '#9ea0ab', fontVariationSettings: "'wght' 300" }}>lock</span>
                <input
                  id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={5} placeholder="Min. 5 characters"
                  style={{ width: '100%', boxSizing: 'border-box', padding: '11px 14px 11px 38px', fontSize: '14px', color: '#191c1e', background: 'rgba(0,17,58,0.04)', border: '1px solid rgba(117,118,130,0.3)', borderRadius: '8px', outline: 'none', fontFamily: 'inherit' }}
                />
              </div>
            </div>

            {/* Marketing checkbox */}
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
              <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)}
                style={{ marginTop: '2px', width: '16px', height: '16px', accentColor: '#0058bc', flexShrink: 0, cursor: 'pointer' }} />
              <span style={{ fontSize: '13px', color: '#444650', lineHeight: 1.4 }}>Sign up for news and exclusive offers</span>
            </label>

            {/* Submit */}
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '14px', borderRadius: '8px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              background: '#0058bc', color: '#fff', fontSize: '15px', fontWeight: 700, fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: '0 4px 16px rgba(0,88,188,0.3)', opacity: loading ? 0.7 : 1, transition: 'opacity 0.2s',
            }}>
              {loading
                ? <span className="material-symbols-outlined" style={{ fontSize: '18px', animation: 'spin 1s linear infinite' }}>autorenew</span>
                : <> Create Account <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span> </>}
            </button>

            <p style={{ textAlign: 'center', fontSize: '14px', color: '#444650', margin: 0 }}>
              Already have an account?{' '}
              <Link href="/account/login" style={{ color: '#0058bc', fontWeight: 700, textDecoration: 'none' }}>Log in</Link>
            </p>

          </form>

          {/* T&C */}
          <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid rgba(0,17,58,0.08)' }}>
            <p style={{ fontSize: '11px', color: 'rgba(68,70,80,0.55)', textAlign: 'center', lineHeight: 1.6, margin: 0 }}>
              By creating an account, you agree to our{' '}
              <a href="#" style={{ color: 'inherit', textDecoration: 'underline' }}>Terms of Service</a> and{' '}
              <a href="#" style={{ color: 'inherit', textDecoration: 'underline' }}>Privacy Policy</a>.
            </p>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #e2e5e9', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', padding: '24px 64px', gap: '12px' }}>
        <span style={{ fontSize: '14px', fontWeight: 800, color: '#00113a', letterSpacing: '-0.3px' }}>KlicknKart</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
          {['Privacy Policy', 'Terms of Service', 'Shipping & Returns', 'Support'].map((t) => (
            <a key={t} href="#" style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#9ea0ab', textDecoration: 'none' }}>{t}</a>
          ))}
        </div>
        <span style={{ fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#9ea0ab' }}>© 2024 KlicknKart. All rights reserved.</span>
      </footer>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
