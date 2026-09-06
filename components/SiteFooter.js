import Image from 'next/image';

const T = {
  ar: {
    tagline: 'وكالة هندسة منصات رقمية مخصصة: مواقع تعريفية للمهنيين، عقارات، متاجر إلكترونية، وتكامل بوابات دفع.',
    quickLinks: 'روابط سريعة',
    services: 'خدماتنا', portfolio: 'أعمالنا', about: 'من نحن', pricing: 'الباقات', blog: 'المدونة', contact: 'تواصل معنا',
    contactTitle: 'تواصل معنا', whatsapp: 'واتساب', contactForm: 'نموذج تواصل',
    follow: 'تابعنا', addLinks: 'أضف روابطك من لوحة التحكم',
    rights: 'جميع الحقوق محفوظة', privacy: 'سياسة الخصوصية', terms: 'الشروط والأحكام', admin: 'لوحة التحكم',
  },
  en: {
    tagline: 'A custom digital platform agency: profile sites for professionals, real estate, e-commerce, and payment gateway integration.',
    quickLinks: 'Quick Links',
    services: 'Services', portfolio: 'Work', about: 'About', pricing: 'Pricing', blog: 'Blog', contact: 'Contact',
    contactTitle: 'Contact Us', whatsapp: 'WhatsApp', contactForm: 'Contact form',
    follow: 'Follow Us', addLinks: 'Add your links from the dashboard',
    rights: 'ALL RIGHTS RESERVED', privacy: 'Privacy Policy', terms: 'Terms & Conditions', admin: 'Admin',
  },
};

export default function SiteFooter({ locale = 'ar', settings = {}, wa }) {
  const t = T[locale] || T.ar;
  const p = locale === 'en' ? '/en' : '';

  return (
    <footer className="navy-bg-gradient text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-sm">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Image src="/logo.png" alt="Amvora Logo" width={40} height={40} className="w-10 h-10 object-contain rounded-full border border-gold/40 bg-white p-1" />
            <span className="text-lg font-black tracking-wider text-gray-900 font-mono"><span className="brand-gradient-text">AMVORA</span><span className="text-gold">.</span></span>
          </div>
          <p className="leading-relaxed">{t.tagline}</p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">{t.quickLinks}</h4>
          <ul className="space-y-2">
            <li><a href={`${p}/services`} className="hover:text-gold transition-colors">{t.services}</a></li>
            <li><a href={`${p}/portfolio`} className="hover:text-gold transition-colors">{t.portfolio}</a></li>
            <li><a href={`${p}/about`} className="hover:text-gold transition-colors">{t.about}</a></li>
            <li><a href={`${p}/pricing`} className="hover:text-gold transition-colors">{t.pricing}</a></li>
            <li><a href={`${p}/blog`} className="hover:text-gold transition-colors">{t.blog}</a></li>
            <li><a href={`${p}/contact`} className="hover:text-gold transition-colors">{t.contact}</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">{t.contactTitle}</h4>
          <ul className="space-y-2">
            <li><a href={wa} target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors flex items-center gap-2"><i className="fa-brands fa-whatsapp" /> {t.whatsapp}</a></li>
            {settings.contact_email && (
              <li><a href={`mailto:${settings.contact_email}`} className="hover:text-gold transition-colors flex items-center gap-2"><i className="fa-solid fa-envelope" /> {settings.contact_email}</a></li>
            )}
            <li><a href={`${p}/contact`} className="hover:text-gold transition-colors flex items-center gap-2"><i className="fa-solid fa-headset" /> {t.contactForm}</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">{t.follow}</h4>
          <div className="flex gap-4 text-lg">
            {settings.facebook_url && <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gold transition-colors" aria-label="Facebook"><i className="fa-brands fa-facebook" /></a>}
            {settings.instagram_url && <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gold transition-colors" aria-label="Instagram"><i className="fa-brands fa-instagram" /></a>}
            {settings.linkedin_url && <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gold transition-colors" aria-label="LinkedIn"><i className="fa-brands fa-linkedin" /></a>}
            {settings.tiktok_url && <a href={settings.tiktok_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gold transition-colors" aria-label="TikTok"><i className="fa-brands fa-tiktok" /></a>}
            {settings.youtube_url && <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gold transition-colors" aria-label="YouTube"><i className="fa-brands fa-youtube" /></a>}
            {settings.twitter_url && <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gold transition-colors" aria-label="X"><i className="fa-brands fa-x-twitter" /></a>}
            {!settings.facebook_url && !settings.instagram_url && !settings.linkedin_url && (
              <span className="text-gray-500 text-xs">{t.addLinks}</span>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 text-center text-[10px] sm:text-xs py-6 px-4">
        <p className="font-mono mb-1 text-white font-bold">&copy; {new Date().getFullYear()} AMVORA AGENCY. {t.rights}.</p>
        <p className="mt-2">
          <a href="/privacy" className="text-gray-400 hover:text-gold transition-colors">{t.privacy}</a>
          <span className="mx-2">·</span>
          <a href="/terms" className="text-gray-400 hover:text-gold transition-colors">{t.terms}</a>
          <span className="mx-2">·</span>
          <a href="/admin" className="text-gray-400 hover:text-gold transition-colors">{t.admin}</a>
        </p>
      </div>
    </footer>
  );
}
