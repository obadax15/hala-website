'use client';

import { useEffect, useState } from 'react';

interface Product {
  id: string;
  sanityId: string;
  price: number;
  stock: number;
  isActive: boolean;
}

function EditableCell({ value, type = 'number', onSave }: { value: number; type?: string; onSave: (v: number) => void }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(String(value));

  const commit = () => {
    const n = Number(val);
    if (!isNaN(n) && n >= 0) onSave(n);
    setEditing(false);
  };

  if (editing) return (
    <input autoFocus type={type} value={val}
      onChange={e => setVal(e.target.value)}
      onBlur={commit}
      onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEditing(false); }}
      style={{ background: 'rgba(207,161,141,0.12)', border: '1px solid rgba(207,161,141,0.4)', borderRadius: 6, padding: '4px 10px', color: '#FAF7F5', fontSize: '0.9rem', width: 80, outline: 'none' }}
    />
  );

  return (
    <span onClick={() => setEditing(true)} title="Click to edit" style={{ cursor: 'pointer', padding: '4px 10px', borderRadius: 6, border: '1px solid transparent', transition: 'all 0.15s', display: 'inline-block' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(207,161,141,0.2)'; (e.currentTarget as HTMLElement).style.background = 'rgba(207,161,141,0.06)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'transparent'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
    >
      {value}
    </span>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState({ sanityId: '', price: '', stock: '' });
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch('/api/admin/products').then(r => r.json()).then(d => setProducts(d.products)).finally(() => setLoading(false));
  }, []);

  const updateProduct = async (id: string, data: Partial<Product>) => {
    setSaving(id);
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
    await fetch(`/api/admin/products/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    setSaving(null);
  };

  const addProduct = async () => {
    if (!newProduct.sanityId || !newProduct.price) return;
    setAdding(true);
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sanityId: newProduct.sanityId, price: Number(newProduct.price), stock: Number(newProduct.stock) || 0 }),
    });
    const data = await res.json();
    if (res.ok) { setProducts(prev => [...prev, data.product]); setNewProduct({ sanityId: '', price: '', stock: '' }); setShowForm(false); }
    setAdding(false);
  };

  const typeLabel = (sanityId: string) => sanityId.startsWith('hijab') ? '🧣 Hijab' : '✦ Plexi';
  const typeBg = (sanityId: string) => sanityId.startsWith('hijab') ? 'rgba(207,161,141,0.12)' : 'rgba(167,139,250,0.12)';
  const typeColor = (sanityId: string) => sanityId.startsWith('hijab') ? '#CFA18D' : '#a78bfa';

  return (
    <div style={{ padding: '40px 48px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 36 }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#FAF7F5', margin: 0, letterSpacing: '-0.02em' }}>Products</h1>
          <p style={{ color: 'rgba(250,247,245,0.45)', marginTop: 6, fontSize: '0.9rem' }}>Click any price or stock value to edit inline</p>
        </div>
        <button onClick={() => setShowForm(f => !f)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'linear-gradient(135deg, #CFA18D, #E3B8A7)', border: 'none', borderRadius: 10, color: '#3A2E2A', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', transition: 'opacity 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          + Add Product
        </button>
      </div>

      {/* Add Product Form */}
      {showForm && (
        <div style={{ background: 'linear-gradient(135deg, #1E1816, #1A1412)', border: '1px solid rgba(207,161,141,0.2)', borderRadius: 16, padding: '24px 28px', marginBottom: 24, display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: '2 1 200px' }}>
            <label style={{ display: 'block', fontSize: '0.72rem', color: 'rgba(250,247,245,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Sanity ID</label>
            <input value={newProduct.sanityId} onChange={e => setNewProduct(p => ({ ...p, sanityId: e.target.value }))} placeholder="e.g. hijab-new-style" style={{ width: '100%', background: 'rgba(207,161,141,0.08)', border: '1px solid rgba(207,161,141,0.2)', borderRadius: 8, padding: '10px 14px', color: '#FAF7F5', fontSize: '0.9rem', outline: 'none' }} />
          </div>
          <div style={{ flex: '1 1 100px' }}>
            <label style={{ display: 'block', fontSize: '0.72rem', color: 'rgba(250,247,245,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Price ($)</label>
            <input type="number" value={newProduct.price} onChange={e => setNewProduct(p => ({ ...p, price: e.target.value }))} placeholder="0" style={{ width: '100%', background: 'rgba(207,161,141,0.08)', border: '1px solid rgba(207,161,141,0.2)', borderRadius: 8, padding: '10px 14px', color: '#FAF7F5', fontSize: '0.9rem', outline: 'none' }} />
          </div>
          <div style={{ flex: '1 1 100px' }}>
            <label style={{ display: 'block', fontSize: '0.72rem', color: 'rgba(250,247,245,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Stock</label>
            <input type="number" value={newProduct.stock} onChange={e => setNewProduct(p => ({ ...p, stock: e.target.value }))} placeholder="0" style={{ width: '100%', background: 'rgba(207,161,141,0.08)', border: '1px solid rgba(207,161,141,0.2)', borderRadius: 8, padding: '10px 14px', color: '#FAF7F5', fontSize: '0.9rem', outline: 'none' }} />
          </div>
          <button onClick={addProduct} disabled={adding} style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #CFA18D, #E3B8A7)', border: 'none', borderRadius: 10, color: '#3A2E2A', fontWeight: 600, cursor: 'pointer', opacity: adding ? 0.6 : 1 }}>
            {adding ? 'Saving…' : 'Save'}
          </button>
        </div>
      )}

      {/* Products Table */}
      <div style={{ background: 'linear-gradient(135deg, #1E1816, #1A1412)', border: '1px solid rgba(207,161,141,0.1)', borderRadius: 20, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(207,161,141,0.08)' }}>
              {['Type', 'Product ID', 'Price ($)', 'Stock', 'Status', ''].map(h => (
                <th key={h} style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.72rem', fontWeight: 600, color: 'rgba(250,247,245,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}><td colSpan={6} style={{ padding: '20px 24px' }}><div style={{ height: 20, background: 'rgba(207,161,141,0.06)', borderRadius: 6, animation: 'pulse 1.5s ease-in-out infinite' }} /></td></tr>
              ))
            ) : products.map((p, i) => (
              <tr key={p.id} style={{ borderBottom: i < products.length - 1 ? '1px solid rgba(207,161,141,0.05)' : 'none', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(207,161,141,0.03)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <td style={{ padding: '14px 24px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '4px 10px', borderRadius: 20, background: typeBg(p.sanityId), color: typeColor(p.sanityId) }}>{typeLabel(p.sanityId)}</span>
                </td>
                <td style={{ padding: '14px 24px', color: '#FAF7F5', fontSize: '0.88rem', fontFamily: 'monospace' }}>{p.sanityId}</td>
                <td style={{ padding: '14px 24px', color: '#FAF7F5', fontWeight: 600 }}>
                  $<EditableCell value={p.price} onSave={v => updateProduct(p.id, { price: v })} />
                </td>
                <td style={{ padding: '14px 24px', color: p.stock <= 3 ? '#f87171' : '#FAF7F5' }}>
                  <EditableCell value={p.stock} onSave={v => updateProduct(p.id, { stock: v })} />
                  {p.stock <= 3 && <span style={{ fontSize: '0.72rem', color: '#f87171', marginLeft: 6 }}>Low</span>}
                </td>
                <td style={{ padding: '14px 24px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '4px 12px', borderRadius: 20, background: p.isActive ? 'rgba(52,211,153,0.12)' : 'rgba(248,113,113,0.12)', color: p.isActive ? '#34d399' : '#f87171', border: `1px solid ${p.isActive ? 'rgba(52,211,153,0.2)' : 'rgba(248,113,113,0.2)'}` }}>
                    {p.isActive ? 'Active' : 'Hidden'}
                  </span>
                </td>
                <td style={{ padding: '14px 24px' }}>
                  <button onClick={() => updateProduct(p.id, { isActive: !p.isActive })} style={{ fontSize: '0.75rem', padding: '5px 12px', background: 'transparent', border: '1px solid rgba(207,161,141,0.2)', borderRadius: 6, color: '#CFA18D', cursor: 'pointer', transition: 'all 0.2s', opacity: saving === p.id ? 0.5 : 1 }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(207,161,141,0.1)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    {saving === p.id ? '…' : p.isActive ? 'Hide' : 'Show'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
    </div>
  );
}
