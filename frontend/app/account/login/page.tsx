'use client';

import Link from 'next/link';

export default function LoginPage() {
  function handleShopifyLogin() {
    window.location.href = '/api/auth';
  }

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
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <Link href="/" style={{ display: 'block', fontSize: '22px', fontWeight: 900, color: '#1a3faa', letterSpacing: '-0.5px', marginBottom: '20px', textDecoration: 'none' }}>
              KlicknKart
            </Link>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#00113a', margin: '0 0 8px', lineHeight: 1.2 }}>Welcome Back</h1>
            <p style={{ fontSize: '14px', color: '#444650', margin: 0, lineHeight: 1.5 }}>
              Sign in securely through your Shopify account.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Primary CTA — Shopify OAuth */}
            <button
              onClick={handleShopifyLogin}
              style={{
                width: '100%', padding: '14px', borderRadius: '8px', border: 'none',
                cursor: 'pointer',
                background: '#0058bc', color: '#fff', fontSize: '15px', fontWeight: 700, fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: '0 4px 16px rgba(0,88,188,0.3)',
                transition: 'opacity 0.2s',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>login</span>
              Continue with Email / Password
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(0,17,58,0.08)' }} />
              <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9ea0ab', whiteSpace: 'nowrap' }}>or continue with</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(0,17,58,0.08)' }} />
            </div>

            {/* Shop Pay */}
            <button
              onClick={handleShopifyLogin}
              style={{
                width: '100%', padding: '13px', borderRadius: '8px',
                border: '1px solid rgba(0,17,58,0.15)', background: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                fontSize: '14px', fontWeight: 600, color: '#00113a', cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path d="M17.4334 11.1925C17.7025 10.9234 17.85 10.5591 17.85 10.1775V3.1275C17.85 2.22881 17.1212 1.5 16.2225 1.5H7.7775C6.87881 1.5 6.15 2.22881 6.15 3.1275V10.1775C6.15 10.5591 6.2975 10.9234 6.56656 11.1925L12 16.6259L17.4334 11.1925Z" fill="#5A2FF1"/>
                <path d="M12 22.5C14.4853 22.5 16.5 20.4853 16.5 18C16.5 15.5147 14.4853 13.5 12 13.5C9.51472 13.5 7.5 15.5147 7.5 18C7.5 20.4853 9.51472 22.5 12 22.5Z" fill="#5A2FF1"/>
              </svg>
              Sign in with Shop
            </button>

            {/* Google + Facebook */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button
                onClick={handleShopifyLogin}
                style={{ padding: '13px', borderRadius: '8px', border: '1px solid rgba(0,17,58,0.15)', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#00113a', fontFamily: 'inherit' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button
                onClick={handleShopifyLogin}
                style={{ padding: '13px', borderRadius: '8px', border: '1px solid rgba(0,17,58,0.15)', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#00113a', fontFamily: 'inherit' }}
              >
                <svg width="18" height="18" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>
            </div>

          </div>

          {/* Info note */}
          <div style={{ marginTop: '28px', padding: '14px 16px', background: 'rgba(0,88,188,0.05)', borderRadius: '8px', border: '1px solid rgba(0,88,188,0.12)' }}>
            <p style={{ fontSize: '12px', color: '#444650', margin: 0, lineHeight: 1.6, textAlign: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '4px', color: '#0058bc' }}>shield</span>
              Your credentials are handled securely by Shopify. KlicknKart never sees your password.
            </p>
          </div>

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
    </div>
  );
}
