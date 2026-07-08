import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found – Halahello',
  description: 'The page you are looking for does not exist. Return to the Halahello boutique homepage.',
};

/**
 * Custom 404 page for /[locale]/* routes.
 * Server component — no 'use client' needed.
 */
export default function NotFoundPage() {
  return (
    <div className="error-page">
      <div className="error-card">

        {/* Large 404 display */}
        <div style={{
          fontFamily: 'var(--font-heading, serif)',
          fontSize: 'clamp(5rem, 15vw, 7rem)',
          fontWeight: 700,
          background: 'linear-gradient(135deg, rgba(207,161,141,0.6), rgba(227,184,167,0.3))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: 1,
          marginBottom: 8,
          userSelect: 'none',
        }}>
          404
        </div>

        {/* Brand label */}
        <div style={{
          fontSize: '0.7rem', color: '#CFA18D',
          letterSpacing: '0.2em', textTransform: 'uppercase',
          marginBottom: 24, fontFamily: 'var(--font-body, Inter, sans-serif)',
        }}>
          Halahello · Page Not Found
        </div>

        <h1 style={{
          fontSize: '1.3rem', fontWeight: 700, color: '#FAF7F5',
          margin: '0 0 12px', letterSpacing: '-0.01em',
          fontFamily: 'var(--font-heading, serif)',
        }}>
          Lost in the collection?
        </h1>

        <p style={{
          color: 'rgba(250,247,245,0.4)', fontSize: '0.875rem',
          lineHeight: 1.7, marginBottom: 36,
          fontFamily: 'var(--font-body, Inter, sans-serif)',
        }}>
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
          Let&apos;s get you back to the boutique.
        </p>

        {/* Quick links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Link
            href="/"
            id="not-found-home-link"
            style={{
              display: 'block', padding: '14px',
              background: 'linear-gradient(135deg, #CFA18D, #E3B8A7)',
              borderRadius: 12, color: '#3A2E2A',
              fontWeight: 700, fontSize: '0.9rem',
              textDecoration: 'none', textAlign: 'center',
              transition: 'opacity 0.2s',
              fontFamily: 'var(--font-body, Inter, sans-serif)',
            }}
          >
            ← Back to Home
          </Link>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Link
              href="/#hijab"
              id="not-found-hijab-link"
              style={{
                display: 'block', padding: '12px 8px',
                background: 'rgba(207,161,141,0.06)',
                border: '1px solid rgba(207,161,141,0.15)',
                borderRadius: 10, color: 'rgba(250,247,245,0.65)',
                fontWeight: 500, fontSize: '0.82rem',
                textDecoration: 'none', textAlign: 'center',
                transition: 'all 0.2s',
                fontFamily: 'var(--font-body, Inter, sans-serif)',
              }}
            >
              Hijab Collection
            </Link>
            <Link
              href="/#plexi"
              id="not-found-plexi-link"
              style={{
                display: 'block', padding: '12px 8px',
                background: 'rgba(207,161,141,0.06)',
                border: '1px solid rgba(207,161,141,0.15)',
                borderRadius: 10, color: 'rgba(250,247,245,0.65)',
                fontWeight: 500, fontSize: '0.82rem',
                textDecoration: 'none', textAlign: 'center',
                transition: 'all 0.2s',
                fontFamily: 'var(--font-body, Inter, sans-serif)',
              }}
            >
              Plexi Collection
            </Link>
          </div>
        </div>

        {/* Decorative dots */}
        <div style={{
          display: 'flex', gap: 6, justifyContent: 'center',
          marginTop: 32,
        }}>
          {[0, 0.2, 0.4].map((delay, i) => (
            <div key={i} style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#CFA18D', opacity: 0.4,
              animation: `skeleton-pulse 1.5s ${delay}s ease-in-out infinite`,
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}
