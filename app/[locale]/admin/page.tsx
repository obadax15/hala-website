'use client';

import { useEffect, useState } from 'react';

interface DashboardStats {
  totalCustomRequests: number;
  pendingCustomRequests: number;
  totalProducts: number;
  totalOrders: number;
}

interface RecentRequest {
  id: string;
  name: string;
  email: string;
  status: string;
  createdAt: string;
}

const STATUS_COLOR: Record<string, string> = {
  SUBMITTED: '#CFA18D',
  QUOTED: '#a78bfa',
  PAID: '#34d399',
  IN_PRODUCTION: '#60a5fa',
  SHIPPED: '#fbbf24',
  CANCELLED: '#f87171',
};

const StatCard = ({ label, value, icon, sub }: { label: string; value: number | string; icon: string; sub?: string }) => (
  <div style={{
    background: 'linear-gradient(135deg, #1E1816 0%, #1A1412 100%)',
    border: '1px solid rgba(207,161,141,0.1)',
    borderRadius: 16, padding: '28px 24px',
    display: 'flex', alignItems: 'flex-start', gap: 16,
  }}>
    <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(207,161,141,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>{icon}</div>
    <div>
      <div style={{ fontSize: '2rem', fontWeight: 700, color: '#FAF7F5', letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '0.8rem', color: 'rgba(250,247,245,0.5)', marginTop: 6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</div>
      {sub && <div style={{ fontSize: '0.78rem', color: '#CFA18D', marginTop: 4 }}>{sub}</div>}
    </div>
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recent, setRecent] = useState<RecentRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then(r => r.json())
      .then(d => { setStats(d.stats); setRecent(d.recentRequests); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: '40px 48px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#FAF7F5', margin: 0, letterSpacing: '-0.02em' }}>Dashboard</h1>
        <p style={{ color: 'rgba(250,247,245,0.45)', marginTop: 6, fontSize: '0.9rem' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 40 }}>
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{ background: '#1E1816', border: '1px solid rgba(207,161,141,0.1)', borderRadius: 16, padding: 28, height: 110, animation: 'pulse 1.5s ease-in-out infinite' }} />
          ))
        ) : (
          <>
            <StatCard icon="✦" label="Custom Requests" value={stats?.totalCustomRequests ?? 0} />
            <StatCard icon="⏳" label="Pending Review" value={stats?.pendingCustomRequests ?? 0} sub="Need your attention" />
            <StatCard icon="▦" label="Active Products" value={stats?.totalProducts ?? 0} />
            <StatCard icon="◉" label="Total Orders" value={stats?.totalOrders ?? 0} />
          </>
        )}
      </div>

      {/* Recent Custom Requests */}
      <div style={{ background: 'linear-gradient(135deg, #1E1816, #1A1412)', border: '1px solid rgba(207,161,141,0.1)', borderRadius: 20, overflow: 'hidden' }}>
        <div style={{ padding: '24px 28px', borderBottom: '1px solid rgba(207,161,141,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#FAF7F5', margin: 0 }}>Recent Custom Requests</h2>
            <p style={{ fontSize: '0.78rem', color: 'rgba(250,247,245,0.4)', marginTop: 4 }}>Latest 5 submissions</p>
          </div>
          <a href="/en/admin/custom-requests" style={{ fontSize: '0.8rem', color: '#CFA18D', textDecoration: 'none', padding: '8px 16px', border: '1px solid rgba(207,161,141,0.25)', borderRadius: 8, transition: 'all 0.2s' }}>View All →</a>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(207,161,141,0.06)' }}>
              {['Customer', 'Email', 'Status', 'Submitted'].map(h => (
                <th key={h} style={{ padding: '14px 28px', textAlign: 'left', fontSize: '0.72rem', fontWeight: 600, color: 'rgba(250,247,245,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i}><td colSpan={4} style={{ padding: '20px 28px' }}><div style={{ height: 20, background: 'rgba(207,161,141,0.06)', borderRadius: 6, animation: 'pulse 1.5s ease-in-out infinite' }} /></td></tr>
              ))
            ) : recent.length === 0 ? (
              <tr><td colSpan={4} style={{ padding: '48px 28px', textAlign: 'center', color: 'rgba(250,247,245,0.3)', fontSize: '0.9rem' }}>No requests yet. They will appear here when customers submit custom orders.</td></tr>
            ) : recent.map((r, i) => (
              <tr key={r.id} style={{ borderBottom: i < recent.length - 1 ? '1px solid rgba(207,161,141,0.05)' : 'none' }}>
                <td style={{ padding: '16px 28px', color: '#FAF7F5', fontWeight: 500, fontSize: '0.9rem' }}>{r.name}</td>
                <td style={{ padding: '16px 28px', color: 'rgba(250,247,245,0.5)', fontSize: '0.88rem' }}>{r.email}</td>
                <td style={{ padding: '16px 28px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '4px 12px', borderRadius: 20, background: `${STATUS_COLOR[r.status]}18`, color: STATUS_COLOR[r.status], border: `1px solid ${STATUS_COLOR[r.status]}30`, letterSpacing: '0.04em' }}>
                    {r.status.replace('_', ' ')}
                  </span>
                </td>
                <td style={{ padding: '16px 28px', color: 'rgba(250,247,245,0.4)', fontSize: '0.85rem' }}>
                  {new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  );
}
