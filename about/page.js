import Reveal from '@/components/Reveal';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import BackToTop from '@/components/BackToTop';
import WaveDivider from '@/components/WaveDivider';
import { fetchSiteContent } from '@/lib/content';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'من نحن',
  description: 'تعرف على Amvora - وكالة هندسة منصات رقمية مخصصة للعقارات والمتاجر الإلكترونية والمهن الحرة.',
  alternates: { canonical: '/about' },
};

export default async function AboutPage() {
  const { settings, reality, wa } = await fetchSiteContent('ar');

  return (
    <main className="min-h-screen bg-white">
      <SiteHeader locale="ar" wa={wa} />

      <section className="relative pt-16 pb-14 sm:pt-20 sm:pb-16 overflow-hidden bg-gradient-to-b from-[#fdf9ee] to-white text-center px-4 sm:px-6">
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none blob-float" aria-hidden="true" />
        <span className="text-gold font-bold text-xs sm:text-sm uppercase tracking-wider block mb-2 font-mono relative">// WHO WE ARE</span>
        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 mb-4 relative">من نحن</h1>
      </section>

      <section className="py-16 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6">
        <Reveal>
        <div className="premium-card-bg border border-gray-200 rounded-3xl p-6 sm:p-10 md:p-12 shadow-lg">
          <h2 className="text-2xl md:text-4xl font-black text-gray-900 mb-5">{settings.about_title}</h2>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-4">{settings.about_text1}</p>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">{settings.about_text2}</p>
        </div>
        </Reveal>
      </section>

      <WaveDivider fromColor="#ffffff" toColor="#efe8d8" />
      <section className="py-16 sm:py-24 bg-[#efe8d8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 sm:mb-20">
            <span className="text-gold font-bold text-xs sm:text-sm uppercase tracking-wider block mb-2 font-mono">// THE REALITY MATRIX</span>
            <h2 className="text-2xl md:text-5xl font-black text-gray-900 mb-4">تشريح برمجي: الفرق بين المنصات الجاهزة والمخصصة</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            <div className="bg-white border-r-4 border-red-500 border-t border-l border-b border-gray-200 rounded-3xl p-6 sm:p-8 shadow-lg">
              <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-6">المنصات التجارية التقليدية</h3>
              <div className="space-y-6">
                {reality.map((r) => (
                  <div key={r.title} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                    <h4 className="text-gray-900 font-bold text-base mb-2"><i className={`fa-solid ${r.icon} text-gray-400 ml-2`} /> {r.title}</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">{r.body}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white border-r-4 border-emerald-500 border-t border-l border-b border-gray-200 rounded-3xl p-6 sm:p-8 shadow-lg glow-gold">
              <h3 className="text-xl sm:text-2xl font-black gold-text-gradient mb-6">المنصات المهندسة خصيصاً (مع Amvora)</h3>
              <div className="space-y-6">
                {reality.map((r) => (
                  <div key={r.title + '-good'} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                    <h4 className="text-gray-900 font-bold text-base mb-2"><i className={`fa-solid ${r.icon} text-gold ml-2`} /> {r.title}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{r.body2}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <WaveDivider fromColor="#efe8d8" toColor="#ffffff" flip />


      <section className="py-16 sm:py-20 max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-xl sm:text-3xl font-black text-gray-900 mb-4">جاهز تبدأ مشروعك معانا؟</h2>
        <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-block gold-bg-gradient hover:opacity-90 text-black font-black px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition-all shadow-lg pulse-cta">
          تواصل معنا عبر الواتساب
        </a>
      </section>

      <SiteFooter locale="ar" settings={settings} wa={wa} />
      <a href={wa} target="_blank" rel="noopener noreferrer" aria-label="تواصل عبر واتساب" className="fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full bg-[#25D366] text-white shadow-2xl flex items-center justify-center text-2xl hover:scale-110 transition-transform focus-visible:ring-4 focus-visible:ring-[#25D366]/50 focus-visible:outline-none">
        <i className="fa-brands fa-whatsapp" />
      </a>
      <BackToTop />
    </main>
  );
}
