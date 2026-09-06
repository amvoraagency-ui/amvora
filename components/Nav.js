'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = {
  ar: [
    { href: '/', label: 'الرئيسية' },
    { href: '/services', label: 'خدماتنا' },
    { href: '/portfolio', label: 'أعمالنا' },
    { href: '/#testimonials', label: 'آراء العملاء' },
    { href: '/about', label: 'من نحن' },
    { href: '/pricing', label: 'الباقات' },
    { href: '/blog', label: 'المدونة' },
    { href: '/contact', label: 'تواصل معنا' },
  ],
  en: [
    { href: '/en', label: 'Home' },
    { href: '/en/services', label: 'Services' },
    { href: '/en/portfolio', label: 'Work' },
    { href: '/en#testimonials', label: 'Reviews' },
    { href: '/en/about', label: 'About' },
    { href: '/en/pricing', label: 'Pricing' },
    { href: '/en/blog', label: 'Blog' },
    { href: '/en/contact', label: 'Contact' },
  ],
};

function isActive(pathname, href) {
  const clean = href.split('#')[0];
  if (clean === '/' || clean === '/en') return pathname === clean;
  return pathname === clean || pathname.startsWith(clean + '/');
}

export function DesktopNav({ locale = 'ar' }) {
  const links = LINKS[locale] || LINKS.ar;
  const pathname = usePathname();
  return (
    <nav className="hidden lg:flex items-center gap-3 xl:gap-5 text-xs xl:text-sm font-bold text-gray-600 shrink-0">
      {links.map((l) => {
        const active = isActive(pathname, l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? 'page' : undefined}
            className={`relative pb-1 transition-colors whitespace-nowrap ${active ? 'text-gold' : 'hover:text-[#8a6d1f]'}`}
          >
            {l.label}
            {active && <span className="absolute -bottom-0.5 right-0 left-0 h-0.5 bg-gold rounded-full" />}
          </Link>
        );
      })}
    </nav>
  );
}

export default function MobileNav({ locale = 'ar' }) {
  const links = LINKS[locale] || LINKS.ar;
  const pathname = usePathname();
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
          {links.map((l) => {
            const active = isActive(pathname, l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                aria-current={active ? 'page' : undefined}
                className={`block transition-colors ${active ? 'text-gold' : 'hover:text-[#8a6d1f]'}`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
