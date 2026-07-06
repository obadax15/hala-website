'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await signIn('credentials', {
        email, password, redirect: false,
      });
      if (result?.error) {
        setError('Invalid credentials. Please try again.');
      } else {
        router.push('/en/admin');
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0F0D0C 0%, #1A1412 50%, #0F0D0C 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: 'var(--font-body, Inter, sans-serif)' }}>
      {/* Background decoration */}
      <div style={{ position: 'fixed', top: '20%', left: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(207,161,141,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '20%', right: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontFamily: 'var(--font-heading, serif)', fontSize: '2rem', fontWeight: 600, color: '#FAF7F5', letterSpacing: '-0.02em' }}>Halahello</div>
          <div style={{ fontSize: '0.72rem', color: '#CFA18D', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 6 }}>Admin Studio</div>
        </div>

        {/* Card */}
        <div style={{ background: 'linear-gradient(135deg, #1E1816 0%, #1A1412 100%)', border: '1px solid rgba(207,161,141,0.15)', borderRadius: 24, padding: '40px 36px', boxShadow: '0 40px 100px rgba(0,0,0,0.5)' }}>
          <h1 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#FAF7F5', margin: '0 0 8px', letterSpacing: '-0.01em' }}>Welcome back</h1>
          <p style={{ fontSize: '0.85rem', color: 'rgba(250,247,245,0.4)', marginBottom: 32 }}>Sign in to manage your store</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(250,247,245,0.45)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Email</label>
              <input id="admin-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="admin@halahello.com"
                style={{ width: '100%', background: 'rgba(207,161,141,0.06)', border: '1px solid rgba(207,161,141,0.15)', borderRadius: 10, padding: '13px 16px', color: '#FAF7F5', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                onFocus={e => (e.target.style.borderColor = 'rgba(207,161,141,0.5)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(207,161,141,0.15)')}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(250,247,245,0.45)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Password</label>
              <input id="admin-password" type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                style={{ width: '100%', background: 'rgba(207,161,141,0.06)', border: '1px solid rgba(207,161,141,0.15)', borderRadius: 10, padding: '13px 16px', color: '#FAF7F5', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                onFocus={e => (e.target.style.borderColor = 'rgba(207,161,141,0.5)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(207,161,141,0.15)')}
              />
            </div>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '10px 14px', color: '#f87171', fontSize: '0.85rem' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{ marginTop: 8, padding: '14px', background: loading ? 'rgba(207,161,141,0.4)' : 'linear-gradient(135deg, #CFA18D, #E3B8A7)', border: 'none', borderRadius: 10, color: '#3A2E2A', fontWeight: 700, fontSize: '0.9rem', cursor: loading ? 'not-allowed' : 'pointer', transition: 'opacity 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              {loading ? (
                <><span style={{ width: 16, height: 16, border: '2px solid rgba(58,46,42,0.3)', borderTopColor: '#3A2E2A', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />Signing in…</>
              ) : 'Sign in →'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.8rem', color: 'rgba(250,247,245,0.2)' }}>
          Halahello Admin Studio · Restricted Access
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: rgba(250,247,245,0.2); }
      `}</style>
    </div>
  );
}
