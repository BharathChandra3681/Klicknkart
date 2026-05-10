'use client';

import Link from 'next/link';

export default function RegisterPage() {
  function handleShopifySignup() {
    // Shopify's Customer Account OAuth handles both login AND account creation
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

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <Link href="/" style={{ display: 'block', fontSize: '22px', fontWeight: 900, color: '#1a3faa', letterSpacing: '-0.5px', marginBottom: '20px', textDecoration: 'none' }}>
              KlicknKart
            </Link>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#00113a', margin: '0 0 8px', lineHeight: 1.2 }}>Create Account</h1>
            <p style={{ fontSize: '14px', color: '#444650', margin: 0, lineHeight: 1.5 }}>
              Sign up securely through Shopify — no password stored on our servers.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Primary CTA */}
            <button
              onClick={handleShopifySignup}
              style={{
                width: '100%', padding: '14px', borderRadius: '8px', border: 'none',
                cursor: 'pointer',
                background: '#0058bc', color: '#fff', fontSize: '15px', fontWeight: 700, fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: '0 4px 16px rgba(0,88,188,0.3)',
                transition: 'opacity 0.2s',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>person_add</span>
              Create Account
            </button>

            {/* Already have account */}
            <p style={{ textAlign: 'center', fontSize: '14px', color: '#444650', margin: 0 }}>
              Already have an account?{' '}
              <Link href="/account/login" style={{ color: '#0058bc', fontWeight: 700, textDecoration: 'none' }}>Sign in</Link>
            </p>

          </div>

          {/* Info note */}
          <div style={{ marginTop: '28px', padding: '14px 16px', background: 'rgba(0,88,188,0.05)', borderRadius: '8px', border: '1px solid rgba(0,88,188,0.12)' }}>
            <p style={{ fontSize: '12px', color: '#444650', margin: 0, lineHeight: 1.6, textAlign: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '4px', color: '#0058bc' }}>shield</span>
              Account creation is handled by Shopify. KlicknKart never stores your password.
            </p>
          </div>

          {/* T&C */}
          <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(0,17,58,0.08)' }}>
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
    </div>
  );
}
