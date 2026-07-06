'use client';

import { useEffect, useState } from 'react';

type Status = 'SUBMITTED' | 'QUOTED' | 'PAID' | 'IN_PRODUCTION' | 'SHIPPED' | 'CANCELLED';

interface CustomRequest {
  id: string;
  name: string;
  email: string;
  details: string;
  status: Status;
  quotePrice: number | null;
  imageUrls: string[];
  createdAt: string;
}

const COLUMNS: { status: Status; label: string; icon: string; color: string }[] = [
  { status: 'SUBMITTED',     label: 'Submitted',     icon: '📬', color: '#CFA18D' },
  { status: 'QUOTED',        label: 'Quoted',         icon: '💰', color: '#a78bfa' },
  { status: 'PAID',          label: 'Paid',           icon: '✅', color: '#34d399' },
  { status: 'IN_PRODUCTION', label: 'In Production',  icon: '🔨', color: '#60a5fa' },
  { status: 'SHIPPED',       label: 'Shipped',        icon: '📦', color: '#fbbf24' },
];

function RequestCard({ req, onMove }: { req: CustomRequest; onMove: (id: string, status: Status) => void }) {
  const [open, setOpen] = useState(false);
  const nextStatuses = COLUMNS.map(c => c.status).filter(s => s !== req.status && s !== 'CANCELLED');

  return (
    <div style={{ background: 'linear-gradient(135deg, #1E1816, #1A1412)', border: '1px solid rgba(207,161,141,0.12)', borderRadius: 12, padding: 16, cursor: 'pointer', transition: 'all 0.2s' }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(207,161,141,0.3)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(207,161,141,0.12)')}
      onClick={() => setOpen(o => !o)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div style={{ fontWeight: 600, color: '#FAF7F5', fontSize: '0.9rem' }}>{req.name}</div>
        <div style={{ fontSize: '0.72rem', color: 'rgba(250,247,245,0.35)' }}>
          {new Date(req.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </div>
      </div>
      <div style={{ fontSize: '0.8rem', color: 'rgba(250,247,245,0.45)', marginBottom: 10 }}>{req.email}</div>
      <div style={{ fontSize: '0.82rem', color: 'rgba(250,247,245,0.6)', lineHeight: 1.5, maxHeight: open ? 'none' : 48, overflow: 'hidden', transition: 'max-height 0.3s' }}>
        {req.details}
      </div>
      {req.quotePrice && (
        <div style={{ marginTop: 10, fontSize: '0.85rem', color: '#34d399', fontWeight: 600 }}>Quote: ${req.quotePrice}</div>
      )}
      {open && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(207,161,141,0.1)' }}>
          <div style={{ fontSize: '0.72rem', color: 'rgba(250,247,245,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Move to →</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {nextStatuses.map(s => (
              <button key={s} onClick={e => { e.stopPropagation(); onMove(req.id, s); }}
                style={{ fontSize: '0.72rem', padding: '4px 10px', borderRadius: 6, border: '1px solid rgba(207,161,141,0.2)', background: 'rgba(207,161,141,0.08)', color: '#CFA18D', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(207,161,141,0.2)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(207,161,141,0.08)'; }}
              >
                {s.replace('_', ' ')}
              </button>
            ))}
            <button onClick={e => { e.stopPropagation(); onMove(req.id, 'CANCELLED'); }}
              style={{ fontSize: '0.72rem', padding: '4px 10px', borderRadius: 6, border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.06)', color: '#f87171', cursor: 'pointer' }}
            >CANCEL</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CustomRequestsPage() {
  const [requests, setRequests] = useState<CustomRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/custom-requests')
      .then(r => r.json())
      .then(d => setRequests(d.requests))
      .finally(() => setLoading(false));
  }, []);

  const moveCard = async (id: string, status: Status) => {
    // Optimistic update
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    try {
      await fetch(`/api/admin/custom-requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch {
      // Revert on failure - refetch
      fetch('/api/admin/custom-requests').then(r => r.json()).then(d => setRequests(d.requests));
    }
  };

  const byStatus = (status: Status) => requests.filter(r => r.status === status);

  return (
    <div style={{ padding: '40px 48px', minHeight: '100vh' }}>
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#FAF7F5', margin: 0, letterSpacing: '-0.02em' }}>Custom Requests</h1>
        <p style={{ color: 'rgba(250,247,245,0.45)', marginTop: 6, fontSize: '0.9rem' }}>
          {requests.length} total · {byStatus('SUBMITTED').length} pending review
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', gap: 20 }}>
          {COLUMNS.map(c => (
            <div key={c.status} style={{ flex: 1, background: '#1A1412', border: '1px solid rgba(207,161,141,0.08)', borderRadius: 16, height: 300, animation: 'pulse 1.5s ease-in-out infinite' }} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', overflowX: 'auto', paddingBottom: 20 }}>
          {COLUMNS.map(col => (
            <div key={col.status} style={{ minWidth: 260, flex: '0 0 260px' }}>
              {/* Column Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, padding: '10px 14px', background: 'rgba(207,161,141,0.06)', borderRadius: 10, border: '1px solid rgba(207,161,141,0.08)' }}>
                <span>{col.icon}</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: col.color, letterSpacing: '0.04em', textTransform: 'uppercase', flex: 1 }}>{col.label}</span>
                <span style={{ fontSize: '0.75rem', background: `${col.color}20`, color: col.color, padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>
                  {byStatus(col.status).length}
                </span>
              </div>
              {/* Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: 100 }}>
                {byStatus(col.status).length === 0 ? (
                  <div style={{ padding: '24px 16px', textAlign: 'center', color: 'rgba(250,247,245,0.2)', fontSize: '0.82rem', border: '2px dashed rgba(207,161,141,0.08)', borderRadius: 10 }}>Empty</div>
                ) : byStatus(col.status).map(req => (
                  <RequestCard key={req.id} req={req} onMove={moveCard} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
    </div>
  );
}
