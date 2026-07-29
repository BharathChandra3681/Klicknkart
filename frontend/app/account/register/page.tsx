'use client';

import { useEffect } from 'react';

export default function RegisterPage() {
  useEffect(() => {
    window.location.href = '/api/auth';
  }, []);

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Manrope', sans-serif", background: '#eef0f4', color: '#00113a'
    }}>
      <p style={{ fontWeight: 600, fontSize: '15px' }}>Redirecting to secure account portal...</p>
    </div>
  );
}
