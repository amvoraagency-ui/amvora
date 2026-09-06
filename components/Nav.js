'use client';
import { useState } from 'react';

const LINKS = {
  ar: [
    { href: '/services', label: 'خدماتنا' },
    { href: '/portfolio', label: 'أعمالنا' },
    { href: '/#testimonials', label: 'آراء العملاء' },
    { href: '/about', label: 'من نحن' },
    { href: '/pricing', label: 'الباقات' },
    { href: '/blog', label: 'المدونة' },
    { href: '/contact', label: 'تواصل معنا' },
  ],
  en: [
    { href: '/en/services', label: 'Services' },
    { href: '/en/portfolio', label: 'Work' },
    { href: '/en#testimonials', label: 'Reviews' },
    { href: '/en/about', label: 'About' },
    { href: '/en/pricing', label: 'Pricing' },
    { href: '/en/blog', label: 'Blog' },
    { href: '/en/contact', label: 'Contact' },
  ],
};

export function DesktopNav({ locale = 'ar' }) {
  const links = LINKS[locale] || LINKS.ar;
  return (
    <nav className="hidden lg:flex items-center gap-3 xl:gap-5 text-xs xl:text-sm font-bold text-gray-600 shrink-0">
      {links.map((l) => (
        <a key={l.href} href={l.href} className="hover:text-[#8a6d1f] transition-colors whitespace-nowrap">
          {l.label}
        </a>
      ))}
    </nav>
  );
}

export default function MobileNav({ locale = 'ar' }) {
  const links = LINKS[locale] || LINKS.ar;
  const [open, setOpen] = useState(false);
  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-700"
        aria-label="Menu"
      >
        <i className="fa-solid fa-bars" />
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full border-t border-gray-200 bg-white px-4 py-4 space-y-3 text-sm font-bold text-gray-600 shadow-lg">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block hover:text-[#8a6d1f] transition-colors">
              {l.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
