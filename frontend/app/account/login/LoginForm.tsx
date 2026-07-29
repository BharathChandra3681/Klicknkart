'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  function handleShopifyLogin() {
    window.location.href = '/api/auth';
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      background: 'radial-gradient(ellipse at 10% 15%, rgba(179,197,255,0.3) 0%, transparent 50%), radial-gradient(ellipse at 90% 85%, rgba(137,208,237,0.2) 0%, transparent 50%), #eef0f4',
      fontFamily: "'Manrope', sans-serif",
    }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
        <div style={{
          width: '100%', maxWidth: '420px',
          background: '#ffffff', borderRadius: '16px',
          padding: '48px 40px 40px',
          boxShadow: '0 4px 48px rgba(0,17,58,0.10)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <Link href="/" style={{ display: 'block', fontSize: '22px', fontWeight: 900, color: '#1a3faa', letterSpacing: '-0.5px', marginBottom: '20px', textDecoration: 'none' }}>
              KlicknKart
            </Link>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#00113a', margin: '0 0 8px', lineHeight: 1.2 }}>Welcome Back</h1>
            <p style={{ fontSize: '14px', color: '#444650', margin: 0, lineHeight: 1.5 }}>
              Sign in securely. Choose your preferred method below.
            </p>
          </div>

          {error && (
            <div style={{ marginBottom: '20px', padding: '12px', borderRadius: '8px', background: 'rgba(255,82,82,0.08)', border: '1px solid rgba(255,82,82,0.12)', color: '#7a1515', fontWeight: 600, textAlign: 'center' }}>
              {error === 'auth_failed' && 'Authentication failed. Try again.'}
              {error === 'token_failed' && 'Sign-in failed during token exchange. Check server logs.'}
              {error !== 'auth_failed' && error !== 'token_failed' && `Error: ${error}`}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <button
              onClick={handleShopifyLogin}
              style={{
                width: '100%', padding: '16px', borderRadius: '8px', border: 'none',
                cursor: 'pointer',
                background: '#0058bc', color: '#fff', fontSize: '15px', fontWeight: 700, fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                boxShadow: '0 4px 16px rgba(0,88,188,0.3)',
                transition: 'opacity 0.2s',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>lock</span>
              Sign In or Create Account
            </button>
          </div>

          <div style={{ marginTop: '28px', padding: '14px 16px', background: 'rgba(0,88,188,0.05)', borderRadius: '8px', border: '1px solid rgba(0,88,188,0.12)' }}>
            <p style={{ fontSize: '12px', color: '#444650', margin: 0, lineHeight: 1.6, textAlign: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '4px', color: '#0058bc' }}>shield</span>
              Your credentials are handled securely by Shopify. KlicknKart never stores your password.
            </p>
          </div>
        </div>
      </div>

      <footer style={{ borderTop: '1px solid #e2e5e9', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', padding: '24px 64px', gap: '12px' }}>
        <span style={{ fontSize: '14px', fontWeight: 800, color: '#00113a', letterSpacing: '-0.3px' }}>KlicknKart</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
          {['Privacy Policy', 'Terms of Service', 'Shipping & Returns', 'Bulk Orders', 'Support'].map((t) => (
            <a key={t} href="#" style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#9ea0ab', textDecoration: 'none' }}>{t}</a>
          ))}
        </div>
        <span style={{ fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#9ea0ab' }}>© 2024 KlicknKart. Precision engineered for professionals.</span>
      </footer>
    </div>
  );
}
