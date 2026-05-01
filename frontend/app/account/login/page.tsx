'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCustomer } from '@/context/CustomerContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useCustomer();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const errors = await login(email, password);
      if (errors.length > 0) setError(errors[0].message);
      else router.push('/account');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    padding: '13px 14px 13px 40px', fontSize: '14px', color: '#191c1e',
    background: 'rgba(0,17,58,0.04)', border: '1px solid rgba(117,118,130,0.3)',
    borderRadius: '8px', outline: 'none', fontFamily: 'inherit',
  };

  const iconStyle: React.CSSProperties = {
    position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
    fontSize: '18px', color: '#9ea0ab', fontVariationSettings: "'wght' 300",
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      background: 'radial-gradient(ellipse at 10% 15%, rgba(179,197,255,0.3) 0%, transparent 50%), radial-gradient(ellipse at 90% 85%, rgba(137,208,237,0.2) 0%, transparent 50%), #eef0f4',
      fontFamily: "'Manrope', sans-serif",
    }}>

      {/* Page body */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>

        {/* Card */}
        <div style={{
          width: '100%', maxWidth: '420px',
          background: '#ffffff', borderRadius: '16px',
          padding: '48px 40px 40px',
          boxShadow: '0 4px 48px rgba(0,17,58,0.10)',
        }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#00113a', margin: '0 0 6px', lineHeight: 1.2 }}>Welcome Back</h1>
            <p style={{ fontSize: '14px', color: '#444650', margin: 0 }}>Sign in to your KlicknKart account.</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {error && (
              <div style={{ fontSize: '13px', color: '#ba1a1a', background: '#ffdad6', border: '1px solid rgba(186,26,26,0.2)', borderRadius: '8px', padding: '10px 14px' }}>
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" style={{ display: 'block', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#757682', marginBottom: '6px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <span className="material-symbols-outlined" style={iconStyle}>mail</span>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="email@example.com" style={inputStyle} />
              </div>
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label htmlFor="password" style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#757682' }}>
                  Password
                </label>
                <a href="#" style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#0058bc', textDecoration: 'none' }}>
                  Forgot Password?
                </a>
              </div>
              <div style={{ position: 'relative' }}>
                <span className="material-symbols-outlined" style={iconStyle}>lock</span>
                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" style={inputStyle} />
              </div>
            </div>

            {/* Sign In */}
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '14px', borderRadius: '8px', border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              background: '#0058bc', color: '#fff', fontSize: '15px', fontWeight: 700, fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: '0 4px 16px rgba(0,88,188,0.3)', opacity: loading ? 0.7 : 1,
            }}>
              {loading
                ? <span className="material-symbols-outlined" style={{ fontSize: '18px', animation: 'spin 1s linear infinite' }}>autorenew</span>
                : <> Sign In <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span> </>}
            </button>

            {/* Create Account ghost button */}
            <Link href="/account/register" style={{
              display: 'block', textAlign: 'center', width: '100%', padding: '14px',
              borderRadius: '8px', border: '1px solid rgba(0,17,58,0.15)',
              color: '#00113a', fontSize: '15px', fontWeight: 600, fontFamily: 'inherit',
              textDecoration: 'none', background: '#fff', boxSizing: 'border-box',
            }}>
              Create Account
            </Link>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(0,17,58,0.08)' }} />
              <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9ea0ab', whiteSpace: 'nowrap' }}>or continue with</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(0,17,58,0.08)' }} />
            </div>

            {/* Shop */}
            <button type="button" style={{
              width: '100%', padding: '13px', borderRadius: '8px',
              border: '1px solid rgba(0,17,58,0.15)', background: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              fontSize: '14px', fontWeight: 600, color: '#00113a', cursor: 'pointer', fontFamily: 'inherit',
            }}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path d="M17.4334 11.1925C17.7025 10.9234 17.85 10.5591 17.85 10.1775V3.1275C17.85 2.22881 17.1212 1.5 16.2225 1.5H7.7775C6.87881 1.5 6.15 2.22881 6.15 3.1275V10.1775C6.15 10.5591 6.2975 10.9234 6.56656 11.1925L12 16.6259L17.4334 11.1925Z" fill="#5A2FF1"/>
                <path d="M12 22.5C14.4853 22.5 16.5 20.4853 16.5 18C16.5 15.5147 14.4853 13.5 12 13.5C9.51472 13.5 7.5 15.5147 7.5 18C7.5 20.4853 9.51472 22.5 12 22.5Z" fill="#5A2FF1"/>
              </svg>
              Sign in with Shop
            </button>

            {/* Google + Facebook */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button type="button" style={{ padding: '13px', borderRadius: '8px', border: '1px solid rgba(0,17,58,0.15)', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </button>
              <button type="button" style={{ padding: '13px', borderRadius: '8px', border: '1px solid rgba(0,17,58,0.15)', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <svg width="20" height="20" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
            </div>

          </form>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #e2e5e9', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', padding: '24px 64px', gap: '12px' }}>
        <span style={{ fontSize: '14px', fontWeight: 800, color: '#00113a', letterSpacing: '-0.3px' }}>KlicknKart</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
          {['Privacy Policy', 'Terms of Service', 'Shipping & Returns', 'Bulk Orders', 'Support'].map((t) => (
            <a key={t} href="#" style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#9ea0ab', textDecoration: 'none' }}>{t}</a>
          ))}
        </div>
        <span style={{ fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#9ea0ab' }}>© 2024 KlicknKart. Precision engineered for professionals.</span>
      </footer>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
