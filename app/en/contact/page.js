import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import BackToTop from '@/components/BackToTop';
import ConsultationCTA from '@/components/ConsultationCTA';
import { fetchSiteContent } from '@/lib/content';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the Amvora team on WhatsApp or via the form, and start discussing your next digital project.',
  alternates: { canonical: '/en/contact' },
};

export default async function ContactPageEn() {
  const { settings, faqs, wa } = await fetchSiteContent('en');

  const faqSchema = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  } : null;

  return (
    <main className="min-h-screen bg-white">
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <SiteHeader locale="en" wa={wa} />

      <section className="relative pt-16 pb-14 sm:pt-20 sm:pb-16 overflow-hidden bg-gradient-to-b from-[#fdf9ee] to-white text-center px-4 sm:px-6">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-gold/10 rounded-full blur-3xl pointer-events-none blob-float" aria-hidden="true" />
        <span className="text-gold font-bold text-xs sm:text-sm uppercase tracking-wider block mb-2 font-mono relative">// GET IN TOUCH</span>
        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 mb-4 relative">Contact Us</h1>
        <p className="text-gray-500 max-w-xl mx-auto relative">We'll review your project and get back to you shortly.</p>
      </section>

      <section className="py-16 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="premium-card-bg border border-gray-200 p-8 sm:p-12 md:p-16 rounded-[30px] sm:rounded-[40px] shadow-2xl">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gold/20 text-[#8a6d1f] rounded-3xl flex items-center justify-center mb-6 sm:mb-8 mx-auto shadow-md">
            <i className="fa-solid fa-headset text-3xl sm:text-4xl" />
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-gray-900 mb-6">Let&apos;s engineer your next digital presence</h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex gold-bg-gradient hover:opacity-90 text-black font-black text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-2xl transition-all shadow-2xl items-center gap-3 active:scale-95 w-full sm:w-auto justify-center pulse-cta">
              <i className="fa-brands fa-whatsapp" /> Quick chat on WhatsApp
            </a>
            <ConsultationCTA locale="en" wa={wa} email={settings.contact_email || 'amvora.agency@gmail.com'} className="inline-flex items-center gap-3 border-2 border-gold text-[#8a6d1f] font-black text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-2xl transition-all hover:bg-gold/10 w-full sm:w-auto justify-center" />
          </div>
          <p className="text-gray-500 text-sm mt-6">Choose "Request a consultation" to answer a few quick questions so we understand your project exactly from the first message.</p>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-[#efe8d8] border-y border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-gold font-bold text-xs sm:text-sm uppercase tracking-wider block mb-2 font-mono">// FAQ</span>
            <h2 className="text-2xl md:text-4xl font-black text-gray-900 mb-4">Frequently asked questions</h2>
          </div>
          <div className="space-y-6">
            {faqs.length === 0 && <p className="text-center text-gray-500 text-sm">No questions added yet — manage these from the dashboard.</p>}
            {faqs.map((f, i) => (
              <details key={f.id} className="group bg-white border-2 border-gray-200 rounded-2xl p-5 sm:p-6 cursor-pointer shadow-md" open={i === 0}>
                <summary className="flex items-center justify-between text-gray-900 font-black text-base sm:text-xl">
                  <span>{f.question}</span>
                  <span className="transition group-open:rotate-180 text-gold text-lg"><i className="fa-solid fa-chevron-down" /></span>
                </summary>
                <p className="mt-4 text-gray-600 text-sm sm:text-lg leading-relaxed border-t border-gray-200 pt-4">{f.answer}</p>
              </details>
            ))}
          </div>
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
