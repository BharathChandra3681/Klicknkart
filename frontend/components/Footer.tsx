import Link from 'next/link';

const CATEGORIES = [
  ['Stationery & Paper', '/collections/paper'],
  ['ICT & Computing', '/collections/ict-accessories'],
  ['Files & Folders', '/collections/files-folders'],
  ['Ink & Toners', '/collections/printer-toners'],
  ['All Categories', '/collections'],
];

const SUPPORT = [
  ['Shipping Information', '/shipping'],
  ['Return Policy', '/returns'],
  ['Corporate Accounts', '/corporate'],
  ['Privacy Policy', '/privacy'],
];

export default function Footer() {
  return (
    <footer className="w-full py-16 px-12 border-t border-outline-variant/30"
      style={{ background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

        {/* Brand */}
        <div className="flex flex-col gap-6">
          <Link href="/" className="text-2xl font-extrabold text-primary">KlicknKart</Link>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            Premium office solutions for modern professionals. From physical archives to digital workflows,
            we provide the tools that matter.
          </p>
          <div className="flex gap-4">
            <a href="mailto:hello@klicknkart.com"
              className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
              <span className="material-symbols-outlined text-sm">mail</span>
            </a>
            <a href="#"
              className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
              <span className="material-symbols-outlined text-sm">share</span>
            </a>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-col gap-6">
          <h4 className="font-bold text-primary uppercase text-xs tracking-widest">Categories</h4>
          <ul className="flex flex-col gap-3 text-sm text-on-surface-variant">
            {CATEGORIES.map(([label, href]) => (
              <li key={label}>
                <Link href={href} className="hover:text-secondary transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div className="flex flex-col gap-6">
          <h4 className="font-bold text-primary uppercase text-xs tracking-widest">Support</h4>
          <ul className="flex flex-col gap-3 text-sm text-on-surface-variant">
            {SUPPORT.map(([label, href]) => (
              <li key={label}>
                <Link href={href} className="hover:text-secondary transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-6">
          <h4 className="font-bold text-primary uppercase text-xs tracking-widest">Contact</h4>
          <ul className="flex flex-col gap-3 text-sm text-on-surface-variant">
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">location_on</span> 123 Business Way, Tech Park
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">call</span> +1 (800) KLICK-CART
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">schedule</span> Mon – Fri, 9am – 6pm
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-on-surface-variant">© 2024 KlicknKart. All rights reserved. Engineered for Precision.</p>
        <div className="flex items-center gap-6 opacity-60">
          <span className="material-symbols-outlined text-[32px]">credit_card</span>
          <span className="material-symbols-outlined text-[32px]">account_balance</span>
          <span className="material-symbols-outlined text-[32px]">wallet</span>
        </div>
      </div>
    </footer>
  );
}
