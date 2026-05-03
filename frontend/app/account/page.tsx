'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { useCustomer } from '@/context/CustomerContext';
import {
  createCustomerAddress,
  updateCustomerAddress,
  deleteCustomerAddress,
} from '@/lib/shopify';
import type { CustomerOrder, CustomerAddress } from '@/lib/shopify/types';

type Tab = 'profile' | 'orders' | 'addresses';

const GLASS = {
  background: 'rgba(255,255,255,0.4)',
  backdropFilter: 'blur(40px)',
  WebkitBackdropFilter: 'blur(40px)',
  borderTop: '1px solid rgba(255,255,255,0.8)',
  borderLeft: '1px solid rgba(255,255,255,0.8)',
  borderRight: '1px solid rgba(0,35,102,0.1)',
  borderBottom: '1px solid rgba(0,35,102,0.1)',
  boxShadow: '0 8px 32px 0 rgba(0,35,102,0.05)',
} as const;

function statusColor(status: string) {
  const s = status?.toUpperCase();
  if (s === 'PAID' || s === 'FULFILLED') return { text: '#0058bc', dot: '#0058bc' };
  if (s === 'PENDING') return { text: '#b8860b', dot: '#b8860b' };
  if (s === 'REFUNDED' || s === 'VOIDED') return { text: '#ba1a1a', dot: '#ba1a1a' };
  return { text: '#444650', dot: '#757682' };
}

function formatStatus(status: string) {
  return status
    ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase().replace(/_/g, ' ')
    : '—';
}

export default function AccountPage() {
  const router = useRouter();
  const { customer, loading, logout, token, refreshCustomer } = useCustomer();
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  useEffect(() => {
    if (!loading && !customer) router.replace('/account/login');
  }, [loading, customer, router]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-secondary text-4xl">autorenew</span>
      </main>
    );
  }

  if (!customer) return null;

  const orders: CustomerOrder[] = customer.orders.edges.map((e) => e.node);
  const fullName = [customer.firstName, customer.lastName].filter(Boolean).join(' ') || customer.email;
  const addr = customer.defaultAddress;

  const NAV: { id: Tab; icon: string; label: string }[] = [
    { id: 'profile',   icon: 'person',      label: 'Account Details' },
    { id: 'orders',    icon: 'receipt_long', label: 'Order History' },
    { id: 'addresses', icon: 'location_on',  label: 'Addresses' },
  ];

  return (
    <>
      <main className="flex-grow w-full max-w-[1920px] mx-auto px-6 lg:px-16 py-12 flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full md:w-[280px] flex-shrink-0">
          <div className="rounded-xl p-6 flex flex-col gap-1 sticky top-24" style={GLASS}>
            <h3 className="text-[20px] font-semibold text-primary mb-3 px-4">Account</h3>
            <nav className="flex flex-col">
              {NAV.map(({ id, icon, label }) => {
                const active = activeTab === id;
                return (
                  <button key={id} onClick={() => setActiveTab(id)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors text-base"
                    style={active
                      ? { background: 'rgba(0,17,58,0.05)', color: '#00113a', fontWeight: 500, borderLeft: '2px solid #00113a' }
                      : { color: '#444650', borderLeft: '2px solid transparent' }}>
                    <span className="material-symbols-outlined text-[20px]"
                      style={{ fontVariationSettings: "'wght' 300" }}>{icon}</span>
                    {label}
                  </button>
                );
              })}
            </nav>
            <div className="mt-4 pt-4 border-t border-outline-variant/30">
              <button onClick={() => { logout(); router.push('/'); }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-error hover:bg-error-container/20 transition-colors text-base w-full">
                <span className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: "'wght' 300" }}>logout</span>
                Sign Out
              </button>
            </div>
          </div>
        </aside>

        {/* Content */}
        <section className="flex-grow flex flex-col gap-6">
          <h1 className="text-[32px] font-semibold leading-tight tracking-tight text-primary">Account Profile</h1>

          {/* ── Profile tab ── */}
          {activeTab === 'profile' && (
            <>
              <div className="rounded-xl p-6" style={GLASS}>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-[20px] font-semibold text-primary">{fullName}</h2>
                    <p className="text-base text-on-surface-variant">{customer.email}</p>
                  </div>
                  <Link href="/account/edit"
                    className="px-6 py-2 rounded-full border border-outline-variant text-primary text-[14px] font-semibold hover:bg-surface-variant/50 transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                    Edit Profile
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-outline-variant/30 pt-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-[12px] font-bold tracking-widest uppercase text-on-surface-variant">Full Name</span>
                    <span className="text-base text-primary">{fullName}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[12px] font-bold tracking-widest uppercase text-on-surface-variant">Email Address</span>
                    <span className="text-base text-primary">{customer.email}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[12px] font-bold tracking-widest uppercase text-on-surface-variant">Phone Number</span>
                    <span className="text-base text-primary">{customer.phone ?? '—'}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[12px] font-bold tracking-widest uppercase text-on-surface-variant">Default Shipping Address</span>
                    {addr ? (
                      <span className="text-base text-primary">
                        {[addr.address1, addr.address2, addr.city, addr.province, addr.zip, addr.country].filter(Boolean).join(', ')}
                      </span>
                    ) : (
                      <span className="text-base text-on-surface-variant">No address saved</span>
                    )}
                  </div>
                </div>
              </div>
              {orders.length > 0 && (
                <>
                  <h2 className="text-[20px] font-semibold text-primary mt-2">Recent Activity</h2>
                  <OrdersTable orders={orders.slice(0, 3)} />
                </>
              )}
            </>
          )}

          {/* ── Orders tab ── */}
          {activeTab === 'orders' && (
            orders.length === 0 ? (
              <div className="rounded-xl p-12 text-center" style={GLASS}>
                <span className="material-symbols-outlined text-5xl text-outline mb-3 block">receipt_long</span>
                <p className="text-on-surface-variant">No orders yet.</p>
                <Link href="/products" className="mt-4 inline-block px-6 py-2 rounded-lg text-white text-sm font-semibold"
                  style={{ background: '#0058bc' }}>Shop Now</Link>
              </div>
            ) : (
              <OrdersTable orders={orders} />
            )
          )}

          {/* ── Addresses tab ── */}
          {activeTab === 'addresses' && (
            <AddressesTab
              token={token}
              addresses={customer.addresses.edges.map((e) => e.node)}
              onRefresh={refreshCustomer}
            />
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

// ── Addresses Tab ─────────────────────────────────────────────────────────────

type AddressForm = {
  firstName: string; lastName: string;
  address1: string; address2: string;
  city: string; province: string; zip: string; country: string; phone: string;
};

const BLANK: AddressForm = {
  firstName: '', lastName: '', address1: '', address2: '',
  city: '', province: '', zip: '', country: '', phone: '',
};

function AddressesTab({
  token,
  addresses,
  onRefresh,
}: {
  token: string | null;
  addresses: CustomerAddress[];
  onRefresh: () => Promise<void>;
}) {
  const [showForm, setShowForm] = useState(false);
  const [editId,   setEditId]   = useState<string | null>(null);
  const [form,     setForm]     = useState<AddressForm>(BLANK);
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error,    setError]    = useState('');

  function openAdd() { setForm(BLANK); setEditId(null); setError(''); setShowForm(true); }

  function openEdit(a: CustomerAddress) {
    setForm({
      firstName: a.firstName ?? '', lastName: a.lastName ?? '',
      address1:  a.address1  ?? '', address2: a.address2 ?? '',
      city:      a.city      ?? '', province: a.province ?? '',
      zip:       a.zip       ?? '', country:  a.country  ?? '',
      phone:     a.phone     ?? '',
    });
    setEditId(a.id);
    setError('');
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    setError('');
    try {
      const errors = editId
        ? await updateCustomerAddress(token, editId, form)
        : (await createCustomerAddress(token, form)).errors;
      if (errors.length > 0) { setError(errors[0].message); return; }
      await onRefresh();
      setShowForm(false);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!token) return;
    setDeleting(id);
    try {
      await deleteCustomerAddress(token, id);
      await onRefresh();
    } finally {
      setDeleting(null);
    }
  }

  const inputCls = 'w-full px-4 py-3 rounded-xl border border-outline-variant/50 bg-white/50 text-on-surface text-sm focus:outline-none focus:border-secondary transition-colors';
  const labelCls = 'block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2';

  function field(label: string, key: keyof AddressForm, placeholder = '') {
    return (
      <div>
        <label className={labelCls}>{label}</label>
        <input
          value={form[key]}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          className={inputCls}
          placeholder={placeholder}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Address cards */}
      {addresses.length === 0 && !showForm && (
        <div className="rounded-xl p-12 text-center" style={GLASS}>
          <span className="material-symbols-outlined text-5xl text-outline mb-3 block">location_on</span>
          <p className="text-on-surface-variant">No saved addresses yet.</p>
        </div>
      )}

      {addresses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((a) => (
            <div key={a.id} className="rounded-xl p-5 flex flex-col gap-3"
              style={{ background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.7)' }}>
              {(a.firstName || a.lastName) && (
                <p className="font-semibold text-primary text-sm">
                  {[a.firstName, a.lastName].filter(Boolean).join(' ')}
                </p>
              )}
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {[a.address1, a.address2, a.city, a.province, a.zip, a.country].filter(Boolean).join(', ')}
              </p>
              {a.phone && <p className="text-xs text-on-surface-variant">{a.phone}</p>}
              <div className="flex gap-2 mt-1">
                <button onClick={() => openEdit(a)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-secondary border border-secondary/30 hover:bg-secondary/5 transition-colors">
                  <span className="material-symbols-outlined text-[14px]">edit</span> Edit
                </button>
                <button onClick={() => handleDelete(a.id)} disabled={deleting === a.id}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-error border border-error/30 hover:bg-error-container/20 transition-colors disabled:opacity-50">
                  {deleting === a.id
                    ? <span className="material-symbols-outlined text-[14px] animate-spin">autorenew</span>
                    : <span className="material-symbols-outlined text-[14px]">delete</span>}
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit form */}
      {showForm ? (
        <form onSubmit={handleSave} className="rounded-2xl p-6 flex flex-col gap-4"
          style={{ background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(40px)', border: '1px solid rgba(255,255,255,0.7)' }}>
          <h3 className="font-bold text-primary text-base">
            {editId ? 'Edit Address' : 'New Address'}
          </h3>
          {error && (
            <div className="rounded-xl px-4 py-3 text-sm"
              style={{ background: '#ffdad6', color: '#ba1a1a', border: '1px solid rgba(186,26,26,0.2)' }}>
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field('First Name',         'firstName', 'Jane')}
            {field('Last Name',          'lastName',  'Doe')}
            {field('Address Line 1',     'address1',  '123 Main Street')}
            {field('Address Line 2',     'address2',  'Apt, Suite (optional)')}
            {field('City',               'city',      'Nairobi')}
            {field('Province / County',  'province',  'Nairobi County')}
            {field('ZIP / Postal Code',  'zip',       '00100')}
            {field('Country',            'country',   'Kenya')}
            <div className="sm:col-span-2">{field('Phone', 'phone', '+254 700 000 000')}</div>
          </div>
          <div className="flex gap-3 mt-2">
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm transition-all disabled:opacity-60"
              style={{ background: '#0058bc', boxShadow: '0 4px 14px rgba(0,88,188,0.2)' }}>
              {saving
                ? <span className="material-symbols-outlined animate-spin text-[18px]">autorenew</span>
                : <span className="material-symbols-outlined text-[18px]">save</span>}
              {saving ? 'Saving…' : 'Save Address'}
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="px-6 py-3 rounded-xl font-semibold text-primary border border-outline-variant hover:bg-surface-container transition-colors text-sm">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button onClick={openAdd}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-secondary border border-secondary/30 hover:bg-secondary/5 transition-colors text-sm w-fit">
          <span className="material-symbols-outlined text-[18px]">add_location_alt</span>
          Add New Address
        </button>
      )}
    </div>
  );
}

// ── Orders Table ──────────────────────────────────────────────────────────────

function OrdersTable({ orders }: { orders: CustomerOrder[] }) {
  return (
    <div className="rounded-xl overflow-hidden" style={GLASS}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant/30" style={{ background: 'rgba(224,227,230,0.2)' }}>
              {['Order ID', 'Date', 'Status', 'Total'].map((h) => (
                <th key={h} className={`py-4 px-6 text-[12px] font-bold tracking-widest uppercase text-on-surface-variant ${h === 'Total' ? 'text-right' : ''}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="text-base text-primary">
            {orders.map((order, i) => {
              const { text, dot } = statusColor(order.financialStatus);
              const date = new Date(order.processedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
              return (
                <tr key={order.id}
                  className={`hover:bg-surface-variant/10 transition-colors ${i < orders.length - 1 ? 'border-b border-outline-variant/10' : ''}`}>
                  <td className="py-4 px-6 font-medium">#{order.orderNumber}</td>
                  <td className="py-4 px-6">{date}</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5" style={{ color: text }}>
                      <span className="w-2 h-2 rounded-full inline-block flex-shrink-0" style={{ background: dot }} />
                      {formatStatus(order.financialStatus)}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right font-medium">
                    {order.currentTotalPrice.currencyCode} {parseFloat(order.currentTotalPrice.amount).toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
