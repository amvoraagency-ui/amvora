import Reveal from '@/components/Reveal';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import BackToTop from '@/components/BackToTop';
import ConsultationCTA from '@/components/ConsultationCTA';
import { fetchSiteContent } from '@/lib/content';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Our Services',
  description: 'Custom web design and development for real estate, e-commerce, and independent professionals, with payment gateway integration.',
  alternates: { canonical: '/en/services' },
};

export default async function ServicesPageEn() {
  const { settings, strategicValue, specialties, processSteps, wa } = await fetchSiteContent('en');

  return (
    <main className="min-h-screen bg-white">
      <SiteHeader locale="en" wa={wa} />

      <section className="relative pt-16 pb-14 sm:pt-20 sm:pb-16 overflow-hidden bg-gradient-to-b from-[#fdf9ee] to-white text-center px-4 sm:px-6">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-gold/10 rounded-full blur-3xl pointer-events-none blob-float" aria-hidden="true" />
        <span className="text-gold font-bold text-xs sm:text-sm uppercase tracking-wider block mb-2 font-mono relative">// OUR SERVICES</span>
        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 mb-4 relative">Our Services</h1>
        <p className="text-gray-500 max-w-xl mx-auto relative">From real estate towers to medical clinics and restaurants — every business gets a digital structure that fits it.</p>
      </section>

      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="text-gold font-bold text-xs sm:text-sm uppercase tracking-wider block mb-2 font-mono">// WHY IT MATTERS</span>
          <h2 className="text-2xl md:text-4xl font-black text-gray-900">Why your business needs a real website</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {strategicValue.map((v, idx) => (
            <Reveal key={v.title} delay={idx * 80}>
            <div className="premium-card-bg border border-gray-200 p-6 sm:p-8 rounded-3xl hover:border-gold/40 transition-all shadow-lg h-full hover-lift">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-6 ${idx % 3 === 1 ? 'bg-teal/15 text-teal' : 'bg-gold/10 text-[#8a6d1f]'}`}>
                <i className={`fa-solid ${v.icon}`} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">{v.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{v.body}</p>
            </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-[#efe8d8] border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 sm:mb-20">
            <span className="text-gold font-bold text-xs sm:text-sm uppercase tracking-wider block mb-2 font-mono">// WHAT WE BUILD</span>
            <h2 className="text-2xl md:text-5xl font-black text-gray-900 mb-4">What We Build</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {specialties.map((s, idx) => (
              <Reveal key={s.title} delay={idx * 100}>
              <div className="bg-white border border-gray-200 p-6 sm:p-10 rounded-3xl hover:border-gold/60 transition-all glow-gold h-full hover-lift">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${idx % 2 === 0 ? 'bg-gold/20 text-[#8a6d1f]' : 'bg-teal/15 text-teal'}`}>
                  <i className={`fa-solid ${s.icon} text-2xl`} />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-4">{s.title}</h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{s.body}</p>
                <div className="mt-8 border-t border-gray-200 pt-6">
                  <span className="text-xs text-gold font-bold tracking-widest uppercase font-mono">{s.tag}</span>
                </div>
              </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16 sm:mb-20">
          <span className="text-gold font-bold text-xs sm:text-sm uppercase tracking-wider block mb-2 font-mono">// OUR PROCESS</span>
          <h2 className="text-2xl md:text-5xl font-black text-gray-900 mb-4">How we work with you</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {processSteps.map((step, idx) => (
            <Reveal key={step.id || idx} delay={idx * 100}>
            <div className="premium-card-bg border border-gray-200 rounded-3xl p-6 sm:p-8 text-center h-full hover-lift">
              <div className="w-12 h-12 mx-auto bg-gold/20 text-[#8a6d1f] rounded-2xl flex items-center justify-center text-lg font-black mb-5 font-mono">{String(idx + 1).padStart(2, '0')}</div>
              <h3 className="text-gray-900 font-bold text-base sm:text-lg mb-2">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{step.body}</p>
            </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="py-16 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="premium-card-bg border-2 border-gold/40 rounded-3xl p-8 sm:p-12 glow-gold">
          <h2 className="text-xl sm:text-3xl font-black text-gray-900 mb-4">Don't see your industry? Let's talk</h2>
          <p className="text-gray-500 mb-6">Whatever your business, we can build a website tailored exactly to how you work.</p>
          <ConsultationCTA locale="en" wa={wa} email={settings.contact_email || 'amvora.agency@gmail.com'} className="inline-block gold-bg-gradient hover:opacity-90 text-black font-black px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition-all shadow-lg pulse-cta" />
        </div>
      </section>

      <SiteFooter locale="en" settings={settings} wa={wa} />
      <a href={wa} target="_blank" rel="noopener noreferrer" aria-label="Contact us on WhatsApp" className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#25D366] text-white shadow-2xl flex items-center justify-center text-2xl hover:scale-110 transition-transform focus-visible:ring-4 focus-visible:ring-[#25D366]/50 focus-visible:outline-none">
        <i className="fa-brands fa-whatsapp" />
      </a>
      <BackToTop />
    </main>
  );
}
