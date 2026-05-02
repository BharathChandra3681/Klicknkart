'use client';

import { useState } from 'react';
import Link from 'next/link';
import { recoverCustomer } from '@/lib/shopify';

type Stage = 'form' | 'sent';

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState('');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [stage,   setStage]   = useState<Stage>('form');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const errors = await recoverCustomer(email);
      if (errors.length > 0) setError(errors[0].message);
      else setStage('sent');
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

          {stage === 'sent' ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: 'rgba(0,88,188,0.08)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#0058bc' }}>mark_email_read</span>
              </div>
              <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#00113a', margin: '0 0 12px' }}>Check your inbox</h1>
              <p style={{ fontSize: '14px', color: '#444650', lineHeight: 1.6, margin: '0 0 32px' }}>
                If an account exists for <strong>{email}</strong>, you'll receive a password reset link shortly.
              </p>
              <Link href="/account/login" style={{
                display: 'block', width: '100%', boxSizing: 'border-box',
                padding: '14px', borderRadius: '8px', border: 'none',
                background: '#0058bc', color: '#fff', fontSize: '15px', fontWeight: 700,
                textAlign: 'center', textDecoration: 'none', fontFamily: 'inherit',
              }}>
                Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <Link href="/account/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#0058bc', textDecoration: 'none', fontWeight: 600, marginBottom: '20px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_back</span>
                  Back to Sign In
                </Link>
                <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#00113a', margin: '0 0 8px', lineHeight: 1.2 }}>Reset Password</h1>
                <p style={{ fontSize: '14px', color: '#444650', margin: 0, lineHeight: 1.5 }}>
                  Enter your email and we'll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {error && (
                  <div style={{ fontSize: '13px', color: '#ba1a1a', background: '#ffdad6', border: '1px solid rgba(186,26,26,0.2)', borderRadius: '8px', padding: '10px 14px' }}>
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="email" style={{ display: 'block', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#757682', marginBottom: '6px' }}>
                    Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span className="material-symbols-outlined" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px', color: '#9ea0ab', fontVariationSettings: "'wght' 300" }}>mail</span>
                    <input
                      id="email" type="email" value={email} required
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@example.com"
                      style={inputStyle}
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading} style={{
                  width: '100%', padding: '14px', borderRadius: '8px', border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  background: '#0058bc', color: '#fff', fontSize: '15px', fontWeight: 700, fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  boxShadow: '0 4px 16px rgba(0,88,188,0.3)', opacity: loading ? 0.7 : 1,
                }}>
                  {loading
                    ? <span className="material-symbols-outlined" style={{ fontSize: '18px', animation: 'spin 1s linear infinite' }}>autorenew</span>
                    : <><span className="material-symbols-outlined" style={{ fontSize: '18px' }}>send</span> Send Reset Link</>}
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      <footer style={{ borderTop: '1px solid #e2e5e9', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', padding: '24px 64px', gap: '12px' }}>
        <span style={{ fontSize: '14px', fontWeight: 800, color: '#00113a', letterSpacing: '-0.3px' }}>KlicknKart</span>
        <span style={{ fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#9ea0ab' }}>© 2024 KlicknKart. All rights reserved.</span>
      </footer>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
