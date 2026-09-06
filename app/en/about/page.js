import Reveal from '@/components/Reveal';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import BackToTop from '@/components/BackToTop';
import { fetchSiteContent } from '@/lib/content';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'About Us',
  description: 'Learn about Amvora - a custom digital platform agency for real estate, e-commerce, and independent professionals.',
  alternates: { canonical: '/en/about' },
};

export default async function AboutPageEn() {
  const { settings, reality, wa } = await fetchSiteContent('en');

  return (
    <main className="min-h-screen bg-white">
      <SiteHeader locale="en" wa={wa} />

      <section className="relative pt-16 pb-14 sm:pt-20 sm:pb-16 overflow-hidden bg-gradient-to-b from-[#fdf9ee] to-white text-center px-4 sm:px-6">
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none blob-float" aria-hidden="true" />
        <span className="text-gold font-bold text-xs sm:text-sm uppercase tracking-wider block mb-2 font-mono relative">// WHO WE ARE</span>
        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 mb-4 relative">About Us</h1>
      </section>

      <section className="py-16 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6">
        <Reveal>
        <div className="premium-card-bg border border-gray-200 rounded-3xl p-6 sm:p-10 md:p-12 shadow-lg">
          <h2 className="text-2xl md:text-4xl font-black text-gray-900 mb-5">A young agency, held to senior-level standards from project one</h2>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-4">
            Amvora was founded to solve a clear problem: most off-the-shelf platforms trade away speed and stability for convenience. We build every project on a clean technical foundation from day one, managing requirements fully from concept through delivery and ongoing support.
          </p>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
            We treat every project as a long-term partnership, not a one-off handoff.
          </p>
        </div>
        </Reveal>
      </section>

      <section className="py-16 sm:py-24 bg-[#efe8d8] border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 sm:mb-20">
            <span className="text-gold font-bold text-xs sm:text-sm uppercase tracking-wider block mb-2 font-mono">// THE REALITY MATRIX</span>
            <h2 className="text-2xl md:text-5xl font-black text-gray-900 mb-4">Off-the-shelf vs. custom-engineered</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            <div className="bg-white border-l-4 border-red-500 border-t border-r border-b border-gray-200 rounded-3xl p-6 sm:p-8 shadow-lg">
              <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-6">Traditional commercial platforms</h3>
              <div className="space-y-6">
                {reality.map((r) => (
                  <div key={r.title} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                    <h4 className="text-gray-900 font-bold text-base mb-2"><i className={`fa-solid ${r.icon} text-gray-400 mr-2`} /> {r.title}</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">{r.body}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white border-l-4 border-emerald-500 border-t border-r border-b border-gray-200 rounded-3xl p-6 sm:p-8 shadow-lg glow-gold">
              <h3 className="text-xl sm:text-2xl font-black gold-text-gradient mb-6">Purpose-engineered with Amvora</h3>
              <div className="space-y-6">
                {reality.map((r) => (
                  <div key={r.title + '-good'} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                    <h4 className="text-gray-900 font-bold text-base mb-2"><i className={`fa-solid ${r.icon} text-gold mr-2`} /> {r.title}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{r.body2}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-xl sm:text-3xl font-black text-gray-900 mb-4">Ready to start your project with us?</h2>
        <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-block gold-bg-gradient hover:opacity-90 text-black font-black px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition-all shadow-lg pulse-cta">
          Contact us on WhatsApp
        </a>
      </section>

      <SiteFooter locale="en" settings={settings} wa={wa} />
      <a href={wa} target="_blank" rel="noopener noreferrer" aria-label="Contact us on WhatsApp" className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#25D366] text-white shadow-2xl flex items-center justify-center text-2xl hover:scale-110 transition-transform focus-visible:ring-4 focus-visible:ring-[#25D366]/50 focus-visible:outline-none">
        <i className="fa-brands fa-whatsapp" />
      </a>
      <BackToTop />
    </main>
  );
}
