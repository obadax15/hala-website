'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

const nav = [
  { href: '/en/admin', label: 'Dashboard', icon: '◈' },
  { href: '/en/admin/custom-requests', label: 'Custom Requests', icon: '✦' },
  { href: '/en/admin/products', label: 'Products', icon: '▦' },
  { href: '/en/admin/orders', label: 'Orders', icon: '◉' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // Show no sidebar for the login page
  if (pathname.includes('/admin/login')) {
    return <>{children}</>;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0F0D0C', fontFamily: 'var(--font-body, Inter, sans-serif)' }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: collapsed ? 72 : 260,
        background: 'linear-gradient(180deg, #1A1412 0%, #140F0E 100%)',
        borderRight: '1px solid rgba(207,161,141,0.08)',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        flexShrink: 0, position: 'sticky', top: 0, height: '100vh', overflow: 'hidden',
      }}>
        {/* Logo */}
        <div style={{ padding: collapsed ? '28px 0' : '28px 24px', borderBottom: '1px solid rgba(207,161,141,0.08)', display: 'flex', alignItems: 'center', gap: 12, justifyContent: collapsed ? 'center' : 'space-between' }}>
          {!collapsed && (
            <div>
              <div style={{ fontFamily: 'var(--font-heading, serif)', fontSize: '1.3rem', fontWeight: 600, color: '#FAF7F5', letterSpacing: '-0.01em' }}>Halahello</div>
              <div style={{ fontSize: '0.7rem', color: '#CFA18D', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: 2 }}>Admin Studio</div>
            </div>
          )}
          <button onClick={() => setCollapsed(c => !c)} style={{ background: 'rgba(207,161,141,0.08)', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', color: '#CFA18D', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {collapsed ? '›' : '‹'}
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {nav.map(({ href, label, icon }) => {
            const active = pathname === href || (href !== '/en/admin' && pathname.startsWith(href));
            return (
              <Link key={href} href={href} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: collapsed ? '12px 0' : '12px 16px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                borderRadius: 10, textDecoration: 'none',
                background: active ? 'linear-gradient(135deg, rgba(207,161,141,0.2), rgba(227,184,167,0.1))' : 'transparent',
                border: active ? '1px solid rgba(207,161,141,0.2)' : '1px solid transparent',
                color: active ? '#CFA18D' : 'rgba(250,247,245,0.55)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'rgba(207,161,141,0.06)'; (e.currentTarget as HTMLElement).style.color = 'rgba(250,247,245,0.85)'; } }}
              onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'rgba(250,247,245,0.55)'; } }}
              >
                <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{icon}</span>
                {!collapsed && <span style={{ fontSize: '0.875rem', fontWeight: 500, whiteSpace: 'nowrap' }}>{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sign out */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(207,161,141,0.08)' }}>
          <button onClick={() => signOut({ callbackUrl: '/' })} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 12,
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? '12px 0' : '12px 16px',
            background: 'transparent', border: '1px solid transparent', borderRadius: 10,
            color: 'rgba(250,247,245,0.4)', cursor: 'pointer', fontSize: '0.875rem',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#ef4444'; (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.08)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(250,247,245,0.4)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
          >
            <span style={{ fontSize: '1rem' }}>⏻</span>
            {!collapsed && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main style={{ flex: 1, overflow: 'auto', background: '#0F0D0C' }}>
        {children}
      </main>
    </div>
  );
}
