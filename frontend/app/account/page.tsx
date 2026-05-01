'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { useCustomer } from '@/context/CustomerContext';
import type { CustomerOrder } from '@/lib/shopify/types';

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
  const { customer, loading, logout } = useCustomer();
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  useEffect(() => {
    if (!loading && !customer) {
      router.replace('/account/login');
    }
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
      <main className="flex-grow w-full max-w-[1920px] mx-auto px-16 py-12 flex flex-col md:flex-row gap-6">
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

          {activeTab === 'profile' && (
            <>
              {/* Profile card */}
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
                        {[addr.address1, addr.address2, addr.city, addr.province, addr.zip, addr.country]
                          .filter(Boolean).join(', ')}
                      </span>
                    ) : (
                      <span className="text-base text-on-surface-variant">No address saved</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Recent orders */}
              {orders.length > 0 && (
                <>
                  <h2 className="text-[20px] font-semibold text-primary mt-2">Recent Activity</h2>
                  <OrdersTable orders={orders.slice(0, 3)} />
                </>
              )}
            </>
          )}

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

          {activeTab === 'addresses' && (
            <div className="rounded-xl p-8" style={GLASS}>
              {customer.addresses.edges.length === 0 ? (
                <div className="text-center py-8">
                  <span className="material-symbols-outlined text-5xl text-outline mb-3 block">location_on</span>
                  <p className="text-on-surface-variant">No saved addresses yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {customer.addresses.edges.map(({ node: a }) => (
                    <div key={a.id} className="rounded-xl p-5 border border-outline-variant/30 bg-surface-container-low/50">
                      <p className="text-base text-primary">
                        {[a.address1, a.address2, a.city, a.province, a.zip, a.country].filter(Boolean).join(', ')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

function OrdersTable({ orders }: { orders: CustomerOrder[] }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{
      background: 'rgba(255,255,255,0.4)',
      backdropFilter: 'blur(40px)',
      WebkitBackdropFilter: 'blur(40px)',
      borderTop: '1px solid rgba(255,255,255,0.8)',
      borderLeft: '1px solid rgba(255,255,255,0.8)',
      borderRight: '1px solid rgba(0,35,102,0.1)',
      borderBottom: '1px solid rgba(0,35,102,0.1)',
      boxShadow: '0 8px 32px 0 rgba(0,35,102,0.05)',
    }}>
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
                  className={`hover:bg-surface-variant/10 transition-colors cursor-pointer ${i < orders.length - 1 ? 'border-b border-outline-variant/10' : ''}`}>
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
