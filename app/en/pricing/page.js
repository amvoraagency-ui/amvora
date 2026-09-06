import Reveal from '@/components/Reveal';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import BackToTop from '@/components/BackToTop';
import ConsultationCTA from '@/components/ConsultationCTA';
import { fetchSiteContent } from '@/lib/content';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Packages & Pricing',
  description: 'Amvora web design and development packages — starting estimates, scoped individually per project.',
  alternates: { canonical: '/en/pricing' },
};

export default async function PricingPageEn() {
  const { settings, pricingPlans, wa } = await fetchSiteContent('en');

  const tiers = pricingPlans.map((p) => ({
    key: p.id, name: p.name, price: p.price, tagline: p.tagline, features: p.features, highlight: p.highlighted,
  }));

  return (
    <main className="min-h-screen bg-white">
      <SiteHeader locale="en" wa={wa} />

      <section className="relative pt-16 pb-14 sm:pt-20 sm:pb-16 overflow-hidden bg-gradient-to-b from-[#fdf9ee] to-white text-center px-4 sm:px-6">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-gold/10 rounded-full blur-3xl pointer-events-none blob-float" aria-hidden="true" />
        <span className="text-gold font-bold text-xs sm:text-sm uppercase tracking-wider block mb-2 font-mono relative">// PACKAGES</span>
        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 mb-4 relative">Packages</h1>
        <p className="text-gray-500 max-w-xl mx-auto relative">Starting estimates below — every project is scoped individually based on real requirements.</p>
        <div className="mt-6 relative">
          <ConsultationCTA locale="en" wa={wa} email={settings.contact_email || 'amvora.agency@gmail.com'} className="inline-block gold-bg-gradient hover:opacity-90 text-black font-black px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition-all shadow-lg pulse-cta" />
        </div>
      </section>

      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6">
        {tiers.length === 0 && (
          <p className="text-center text-gray-400 text-sm">No packages yet - add them from the dashboard.</p>
        )}
        <div className={`grid grid-cols-1 gap-6 sm:gap-8 items-stretch mx-auto ${tiers.length >= 3 ? 'md:grid-cols-3' : tiers.length === 2 ? 'md:grid-cols-2 max-w-4xl' : 'max-w-md'}`}>
          {tiers.map((tier, idx) => {
            const featureList = (tier.features || '').split('\n').map((f) => f.trim()).filter(Boolean);
            return (
              <Reveal key={tier.key} delay={idx * 100}>
                <div className={`flex flex-col h-full rounded-3xl p-6 sm:p-8 transition-all hover-lift ${tier.highlight ? 'premium-card-bg border-2 border-gold shadow-2xl glow-gold relative' : 'premium-card-bg border border-gray-200 shadow-lg'}`}>
                  {tier.highlight && (
                    <span className="absolute -top-3 left-6 bg-gold text-black text-xs font-black px-3 py-1 rounded-full">Most popular</span>
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
                    Get a quote
                  </a>
                </div>
              </Reveal>
            );
          })}
        </div>
        <p className="text-center text-gray-400 text-xs sm:text-sm mt-10">
          Prices are preliminary estimates and may vary based on project size and exact features required — every project gets a free consultation before a final price is set.
        </p>
      </section>

      <section className="py-16 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6">
        <Reveal>
        <div className="premium-card-bg border-2 border-gold/50 rounded-3xl p-8 sm:p-12 text-center glow-gold">
          <i className="fa-solid fa-crown text-3xl text-gold mb-4" />
          <h2 className="text-xl sm:text-3xl font-black text-gray-900 mb-4">Amvora VIP Client Club</h2>
          <p className="text-gray-600 text-sm sm:text-lg leading-relaxed max-w-3xl mx-auto">
            Our long-term partners and referred clients receive priority scheduling for project delivery, plus extended technical consultation.
          </p>
        </div>
        </Reveal>
      </section>

      <SiteFooter locale="en" settings={settings} wa={wa} />
      <a href={wa} target="_blank" rel="noopener noreferrer" aria-label="Contact us on WhatsApp" className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#25D366] text-white shadow-2xl flex items-center justify-center text-2xl hover:scale-110 transition-transform focus-visible:ring-4 focus-visible:ring-[#25D366]/50 focus-visible:outline-none">
        <i className="fa-brands fa-whatsapp" />
      </a>
      <BackToTop />
    </main>
  );
}
