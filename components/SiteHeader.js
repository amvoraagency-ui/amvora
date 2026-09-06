import Image from 'next/image';
import MobileNav, { DesktopNav } from '@/components/Nav';
import LangSwitchLink from '@/components/LangSwitchLink';

export default function SiteHeader({ locale = 'ar', wa, homeHref }) {
  const home = homeHref || (locale === 'en' ? '/en' : '/');
  const label = locale === 'en' ? 'Contact us' : 'تواصل معنا';
  const langTo = locale === 'en' ? '/' : '/en';
  const langLabel = locale === 'en' ? 'AR' : 'EN';

  return (
    <header className="relative border-b border-gray-200 bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        <a href={home} className="flex items-center gap-3 sm:gap-4">
          <Image
            src="/logo.png"
            alt="Amvora Logo"
            width={56}
            height={56}
            className="w-11 h-11 sm:w-14 sm:h-14 object-contain rounded-full border border-[#c5a059]/40 shadow-lg bg-[#f6f1e6] p-1"
          />
          <span className="text-xl sm:text-2xl font-black tracking-wider text-gray-900 font-mono">
            <span className="brand-gradient-text">AMVORA</span><span className="text-gold">.</span>
          </span>
        </a>
        <DesktopNav locale={locale} />
        <div className="flex items-center gap-3">
          <LangSwitchLink to={langTo} label={langLabel} className="hidden sm:flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-gold border border-gray-200 rounded-lg px-3 py-2 transition-colors" />
          <a href={wa} target="_blank" rel="noopener noreferrer" className="gold-bg-gradient hover:opacity-90 text-black font-black px-3 sm:px-4 xl:px-6 py-2 rounded-xl text-xs sm:text-sm transition-all shadow-lg flex items-center gap-2 shrink-0">
            <i className="fa-brands fa-whatsapp" /> <span className="hidden xl:inline">{label}</span>
          </a>
          <MobileNav locale={locale} />
        </div>
      </div>
    </header>
  );
}
