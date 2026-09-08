import Reveal from '@/components/Reveal';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import BackToTop from '@/components/BackToTop';
import ConsultationCTA from '@/components/ConsultationCTA';
import { fetchSiteContent } from '@/lib/content';

export const dynamic = 'force-dynamic';

function groupBySection(tiers) {
  const map = new Map();
  const order = [];
  for (const t of tiers) {
    const key = t.section || '';
    if (!map.has(key)) { map.set(key, []); order.push(key); }
    map.get(key).push(t);
  }
  return order.map((key) => ({ section: key || null, items: map.get(key) }));
}

export const metadata = {
  title: 'باقاتنا وأسعارنا',
  description: 'باقات تصميم وبرمجة المواقع الإلكترونية من Amvora - أسعار تقديرية مبدئية حسب متطلبات مشروعك.',
  alternates: { canonical: '/pricing' },
};

export default async function PricingPage() {
  const { settings, pricingPlans, wa } = await fetchSiteContent('ar');

  const tiers = pricingPlans.map((p) => ({
    key: p.id, name: p.name, price: p.price, tagline: p.tagline, features: p.features, highlight: p.highlighted, section: p.section,
  }));

  const groups = groupBySection(tiers);

  return (
    <main className="min-h-screen bg-white">
      <SiteHeader locale="ar" wa={wa} />

      <section className="relative pt-16 pb-14 sm:pt-20 sm:pb-16 overflow-hidden bg-gradient-to-b from-[#fdf9ee] to-white text-center px-4 sm:px-6">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-gold/10 rounded-full blur-3xl pointer-events-none blob-float" aria-hidden="true" />
        <span className="text-gold font-bold text-xs sm:text-sm uppercase tracking-wider block mb-2 font-mono relative">// PACKAGES</span>
        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 mb-4 relative">باقاتنا</h1>
        <p className="text-gray-500 max-w-xl mx-auto relative">أسعار تقديرية مبدئية - كل مشروع يُدرس على حدة حسب متطلباته الفعلية.</p>
        <div className="mt-6 relative">
          <ConsultationCTA locale="ar" wa={wa} email={settings.contact_email || 'amvora.agency@gmail.com'} className="inline-block gold-bg-gradient hover:opacity-90 text-black font-black px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition-all shadow-lg pulse-cta" />
        </div>
      </section>

      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 space-y-20 sm:space-y-24">
        {tiers.length === 0 && (
          <p className="text-center text-gray-400 text-sm">لسه معملتش أي باقة - أضفها من لوحة التحكم.</p>
        )}
        {groups.map((group, gIdx) => (
          <div key={group.section || `_none_${gIdx}`}>
            {group.section && (
              <div className="text-center mb-10 sm:mb-14">
                <span className="text-gold font-bold text-xs sm:text-sm uppercase tracking-wider block mb-2 font-mono">// {group.section}</span>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900">{group.section}</h2>
              </div>
            )}
            <div className={`grid grid-cols-1 gap-6 sm:gap-8 items-stretch mx-auto ${group.items.length >= 3 ? 'md:grid-cols-3' : group.items.length === 2 ? 'md:grid-cols-2 max-w-4xl' : 'max-w-md'}`}>
              {group.items.map((tier, idx) => {
                const featureList = (tier.features || '').split('\n').map((f) => f.trim()).filter(Boolean);
                return (
                  <Reveal key={tier.key} delay={idx * 100}>
                    <div className={`flex flex-col h-full rounded-3xl p-6 sm:p-8 transition-all hover-lift ${tier.highlight ? 'premium-card-bg border-2 border-gold shadow-2xl glow-gold relative' : 'premium-card-bg border border-gray-200 shadow-lg'}`}>
                      {tier.highlight && (
                        <span className="absolute -top-3 right-6 bg-gold text-black text-xs font-black px-3 py-1 rounded-full">الأكثر طلباً</span>
                      )}
                      <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-2">{tier.name}</h3>
                      <div className="text-2xl sm:text-3xl font-black text-gold mb-3 font-mono">{tier.price}</div>
                      {tier.tagline && <p className="text-gray-500 text-sm leading-relaxed mb-6">{tier.tagline}</p>}
                      {featureList.length > 0 && (
                        <ul className="space-y-3 mb-8 flex-1">
                          {featureList.map((f) => (
                            <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                              <i className={`fa-solid fa-circle-check mt-0.5 shrink-0 ${tier.highlight ? 'text-gold' : 'text-emerald-500'}`} />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      <a
                        href={wa}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`block text-center font-bold py-3 rounded-xl transition-all focus-visible:ring-4 focus-visible:outline-none mt-auto ${tier.highlight ? 'gold-bg-gradient text-black font-black hover:opacity-90 focus-visible:ring-gold/50' : 'border border-gold/50 text-[#8a6d1f] hover:bg-gold/10 focus-visible:ring-gold/30'}`}
                      >
                        اطلب استشارة
                      </a>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        ))}
        {tiers.length > 0 && (
          <p className="text-center text-gray-400 text-xs sm:text-sm">
            الأسعار تقديرية ومبدئية، وممكن تختلف حسب حجم المشروع والميزات المطلوبة بالظبط - كل مشروع بياخد استشارة مجانية قبل تحديد السعر النهائي.
          </p>
        )}
      </section>

      <section className="py-16 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6">
        <Reveal>
        <div className="premium-card-bg border-2 border-gold/50 rounded-3xl p-8 sm:p-12 text-center glow-gold">
          <i className="fa-solid fa-crown text-3xl text-gold mb-4" />
          <h2 className="text-xl sm:text-3xl font-black text-gray-900 mb-4">{settings.vip_title}</h2>
          <p className="text-gray-600 text-sm sm:text-lg leading-relaxed max-w-3xl mx-auto">{settings.vip_text}</p>
        </div>
        </Reveal>
      </section>

      <SiteFooter locale="ar" settings={settings} wa={wa} />
      <a href={wa} target="_blank" rel="noopener noreferrer" aria-label="تواصل عبر واتساب" className="fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full bg-[#25D366] text-white shadow-2xl flex items-center justify-center text-2xl hover:scale-110 transition-transform focus-visible:ring-4 focus-visible:ring-[#25D366]/50 focus-visible:outline-none">
        <i className="fa-brands fa-whatsapp" />
      </a>
      <BackToTop />
    </main>
  );
}
