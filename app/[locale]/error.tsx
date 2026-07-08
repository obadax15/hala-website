'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Global error boundary for /[locale]/* routes.
 * Renders a branded, dark-themed error card with retry + home CTAs.
 * This file must be a Client Component (Next.js requirement for error.tsx).
 */
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log the error to an error reporting service in production
    console.error('[App Error Boundary]', error);
  }, [error]);

  return (
    <div className="error-page">
      <div className="error-card">

        {/* Animated icon */}
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'rgba(239,68,68,0.08)',
          border: '2px solid rgba(239,68,68,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2rem', margin: '0 auto 24px',
          animation: 'pulse-error 2s ease-in-out infinite',
        }}>
          ⚠️
        </div>

        {/* Brand */}
        <div style={{
          fontFamily: 'var(--font-heading, serif)',
          fontSize: '0.9rem', color: '#CFA18D',
          letterSpacing: '0.15em', textTransform: 'uppercase',
          marginBottom: 20,
        }}>
          Halahello
        </div>

        <h1 style={{
          fontSize: '1.4rem', fontWeight: 700, color: '#FAF7F5',
          margin: '0 0 12px', letterSpacing: '-0.01em',
        }}>
          Something went wrong
        </h1>

        <p style={{
          color: 'rgba(250,247,245,0.45)', fontSize: '0.875rem',
          lineHeight: 1.7, marginBottom: 32,
        }}>
          We encountered an unexpected error. This has been logged and we&apos;ll look into it.
          {error.digest && (
            <span style={{ display: 'block', marginTop: 8, fontFamily: 'monospace', fontSize: '0.75rem', color: 'rgba(250,247,245,0.25)' }}>
              Error ID: {error.digest}
            </span>
          )}
        </p>

        {/* Action buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            id="error-retry-btn"
            onClick={reset}
            aria-label="Try loading the page again"
            style={{
              width: '100%', padding: '14px',
              background: 'linear-gradient(135deg, #CFA18D, #E3B8A7)',
              border: 'none', borderRadius: 12,
              color: '#3A2E2A', fontWeight: 700, fontSize: '0.9rem',
              cursor: 'pointer', transition: 'opacity 0.2s',
              fontFamily: 'var(--font-body, Inter, sans-serif)',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            ↻ Try Again
          </button>

          <Link
            href="/"
            id="error-home-link"
            style={{
              display: 'block', width: '100%', padding: '14px',
              background: 'rgba(207,161,141,0.06)',
              border: '1px solid rgba(207,161,141,0.2)',
              borderRadius: 12, color: '#CFA18D',
              fontWeight: 600, fontSize: '0.9rem',
              textDecoration: 'none', textAlign: 'center',
              transition: 'all 0.2s',
              fontFamily: 'var(--font-body, Inter, sans-serif)',
            }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes pulse-error {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.1); }
          50% { box-shadow: 0 0 0 12px rgba(239, 68, 68, 0); }
        }
      `}</style>
    </div>
  );
}
