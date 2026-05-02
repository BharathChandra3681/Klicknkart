'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import CartDrawer from './CartDrawer';

const NAV_ITEMS = [
  {
    label: 'Paper',
    href: '/collections/paper',
    mega: [
      { heading: 'Copy Paper', links: [['A4 Office Paper', '/collections/paper'], ['A3 Paper', '/collections/paper'], ['Color Paper', '/collections/paper']] },
      { heading: 'Specialty', links: [['Binding Plastic', '/collections/files-folders'], ['Recycled Paper', '/collections/paper']] },
    ],
  },
  {
    label: 'Pens & Pencils',
    href: '/collections/pens-pencils',
    mega: [
      { heading: 'Pens', links: [['Gel Pens', '/collections/pens-pencils'], ['Ballpoint', '/collections/pens-pencils'], ['Markers', '/collections/board-markers']] },
      { heading: 'Pencils', links: [['Graphite', '/collections/pens-pencils'], ['Mechanical', '/collections/pens-pencils'], ['Erasers', '/collections/pens-pencils']] },
    ],
  },
  {
    label: 'Files & Folders',
    href: '/collections/files-folders',
    mega: [
      { heading: 'Filing', links: [['Binder Files', '/collections/files-folders'], ['Box Files', '/collections/files-folders'], ['Hanging Files', '/collections/files-folders']] },
      { heading: 'Folders', links: [['Manila Folders', '/collections/files-folders'], ['Plastic Folders', '/collections/files-folders']] },
    ],
  },
  { label: 'ICT & Accessories', href: '/collections/ict-accessories' },
  { label: 'All Categories', href: '/collections' },
];

export default function Navbar() {
  const { cart, setCartOpen } = useCart();
  const itemCount = cart?.totalQuantity ?? 0;
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav
        className="fixed top-0 w-full z-50 border-b border-white/20 shadow-[0_8px_32px_0_rgba(0,35,102,0.05)]"
        style={{ background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)' }}
      >
        <div className="flex justify-between items-center h-20 px-6 lg:px-12">
          {/* Brand */}
          <Link href="/" className="text-2xl font-extrabold tracking-tighter text-primary">
            KlicknKart
          </Link>

          {/* Desktop nav */}
          <ul className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.label} className="nav-item relative group px-1">
                <Link
                  href={item.href}
                  className="text-primary/70 font-medium hover:bg-white/50 transition-all duration-300 px-4 py-2 rounded-lg flex items-center gap-1"
                >
                  {item.label}
                  {item.mega && <span className="material-symbols-outlined text-[16px] opacity-50">expand_more</span>}
                </Link>
                {item.mega && (
                  <div className="mega-menu absolute top-full left-0 w-[400px] bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl rounded-xl p-6 mt-2 grid grid-cols-2 gap-8 z-50">
                    {item.mega.map((col) => (
                      <div key={col.heading}>
                        <h4 className="font-bold text-primary mb-3">{col.heading}</h4>
                        <ul className="space-y-2 text-sm text-on-surface-variant">
                          {col.links.map(([text, href]) => (
                            <li key={text}>
                              <Link href={href} className="hover:text-secondary transition-colors">{text}</Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* Right icons */}
          <div className="flex items-center gap-1 text-primary">
            <Link href="/search" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/50 transition-all">
              <span className="material-symbols-outlined">search</span>
            </Link>
            <button
              onClick={() => setCartOpen(true)}
              className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/50 transition-all"
              aria-label="Open cart"
            >
              <span className="material-symbols-outlined">shopping_cart</span>
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center rounded-full bg-secondary text-white text-[10px] font-bold">
                  {itemCount}
                </span>
              )}
            </button>
            <Link href="/account" className="w-10 h-10 hidden sm:flex items-center justify-center rounded-full hover:bg-white/50 transition-all">
              <span className="material-symbols-outlined">person</span>
            </Link>
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/50 transition-all"
              aria-label="Menu"
            >
              <span className="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-white/20" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)' }}>
            <div className="px-6 py-4 flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="py-3 px-4 rounded-lg text-primary font-medium hover:bg-primary/5 transition-colors border-b border-outline-variant/20 last:border-0"
                >
                  {item.label}
                </Link>
              ))}
              <Link href="/account" onClick={() => setMobileOpen(false)}
                className="py-3 px-4 rounded-lg text-primary font-medium hover:bg-primary/5 transition-colors flex items-center gap-2 mt-2">
                <span className="material-symbols-outlined text-[18px]">person</span> My Account
              </Link>
            </div>
          </div>
        )}
      </nav>

      <CartDrawer />
    </>
  );
}
