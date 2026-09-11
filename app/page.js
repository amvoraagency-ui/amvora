import Reveal from '@/components/Reveal';
import TickerBar from '@/components/TickerBar';
import HeroCarousel from '@/components/HeroCarousel';
import TestimonialsSection from '@/components/TestimonialsSection';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import BackToTop from '@/components/BackToTop';
import PortfolioGrid from '@/components/PortfolioGrid';
import ImageMarquee from '@/components/ImageMarquee';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ConsultationCTA from '@/components/ConsultationCTA';
import WaveDivider from '@/components/WaveDivider';
import { fetchSiteContent } from '@/lib/content';
import { safeJsonLd } from '@/lib/safeJsonLd';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const { portfolioItems, testimonialItems, settings, faqs, heroSlides, reality, specialties, pricingPlans, wa } = await fetchSiteContent('ar');

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://amvora.vercel.app';
  const sameAs = [settings.facebook_url, settings.instagram_url, settings.linkedin_url].filter(Boolean);

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Amvora',
    url: siteUrl,
    image: `${siteUrl}/logo.png`,
    description: 'وكالة هندسة منصات رقمية مخصصة: مواقع تعريفية للمهنيين، عقارات، متاجر إلكترونية، وتكامل بوابات دفع.',
    areaServed: 'EG',
    priceRange: '$$',
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };

  const faqSchema = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.slice(0, 5).map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  } : null;

  return (
    <main id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(orgSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqSchema) }} />}
      <GoogleAnalytics measurementId={settings.ga_measurement_id} />
      <TickerBar text={settings.ticker_text} />
      <SiteHeader locale="ar" wa={wa} />

      {/* Hero */}
      <section className="relative pt-16 pb-20 sm:pt-20 sm:pb-24 overflow-hidden bg-gradient-to-b from-[#fdf9ee] to-white">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-gold/10 rounded-full blur-3xl pointer-events-none blob-float" aria-hidden="true" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none blob-float" aria-hidden="true" style={{ animationDelay: '-6s' }} />
        <HeroCarousel slides={heroSlides} />
        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 relative z-10 pt-6 sm:pt-10">
          <Reveal>
          <span className="inline-block bg-gold/20 text-[#8a6d1f] border border-gold/40 text-[10px] sm:text-xs font-bold uppercase tracking-widest px-3 py-1 sm:px-4 sm:py-1.5 rounded-full mb-6 font-mono">
            AMVORA DIGITAL ARCHITECTURE
          </span>
          <h1 className="text-3xl md:text-7xl font-black text-gray-900 leading-tight mb-6 sm:mb-8">{settings.hero_title}</h1>
          <p className="text-base md:text-2xl text-gray-600 max-w-3xl mx-auto mb-3 leading-relaxed">{settings.hero_subtitle}</p>
          <p className="text-sm md:text-lg text-[#8a6d1f]/80 max-w-2xl mx-auto mb-10 sm:mb-12 leading-relaxed">{settings.hero_subtitle2}</p>
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
            <a href={wa} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto gold-bg-gradient hover:opacity-90 text-black font-black text-lg sm:text-xl px-8 sm:px-10 py-4 sm:py-5 rounded-2xl transition-all shadow-2xl inline-flex items-center justify-center gap-3 active:scale-95 focus-visible:ring-4 focus-visible:ring-gold/50 focus-visible:outline-none pulse-cta">
              ابدأ مراجعة متطلباتك عبر الواتساب
            </a>
            {settings.calendly_url && (
              <a href={settings.calendly_url} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto border-2 border-gold text-[#8a6d1f] font-black text-lg sm:text-xl px-8 sm:px-10 py-4 sm:py-5 rounded-2xl transition-all inline-flex items-center justify-center gap-3 active:scale-95 hover:bg-gold/10 focus-visible:ring-4 focus-visible:ring-gold/30 focus-visible:outline-none">
                <i className="fa-solid fa-calendar-check" /> احجز مكالمة
              </a>
            )}
          </div>
          <p className="text-xs sm:text-sm text-gray-400 mt-4">مراجعة أولية لمتطلباتك من غير أي التزام.</p>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mt-12 sm:mt-14">
            {[
              { icon: 'fa-code', label: 'كود مخصص 100%' },
              { icon: 'fa-bolt', label: 'أداء وسرعة عالية' },
              { icon: 'fa-shield-halved', label: 'أمان وحماية كاملة' },
              { icon: 'fa-headset', label: 'دعم فني مستمر' },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-2 text-gray-500 text-xs sm:text-sm font-bold">
                <span className="w-8 h-8 rounded-full bg-gold/10 text-[#8a6d1f] flex items-center justify-center text-sm shrink-0">
                  <i className={`fa-solid ${f.icon}`} />
                </span>
                {f.label}
              </div>
            ))}
          </div>
          </Reveal>
        </div>
      </section>

      {/* Moving strip */}
      <ImageMarquee items={portfolioItems} locale="ar" />

      {/* Stats - only shows once real numbers are filled in from the dashboard */}
      {(settings.stat_projects || settings.stat_years || settings.stat_satisfaction || settings.stat_support) && (
        <>
        <WaveDivider fromColor="#ffffff" toColor="#0f1f3d" />
        <section className="py-14 sm:py-20 navy-bg-gradient">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
              {settings.stat_projects && (
                <div>
                  <div className="text-3xl sm:text-5xl font-black text-gold font-mono">{settings.stat_projects}</div>
                  <div className="text-gray-300 text-xs sm:text-sm mt-2 font-bold">مشروع مُسلَّم</div>
                </div>
              )}
              {settings.stat_years && (
                <div>
                  <div className="text-3xl sm:text-5xl font-black text-gold font-mono">{settings.stat_years}</div>
                  <div className="text-gray-300 text-xs sm:text-sm mt-2 font-bold">سنوات خبرة</div>
                </div>
              )}
              {settings.stat_satisfaction && (
                <div>
                  <div className="text-3xl sm:text-5xl font-black text-gold font-mono">{settings.stat_satisfaction}</div>
                  <div className="text-gray-300 text-xs sm:text-sm mt-2 font-bold">رضا العملاء</div>
                </div>
              )}
              {settings.stat_support && (
                <div>
                  <div className="text-3xl sm:text-5xl font-black text-gold font-mono">{settings.stat_support}</div>
                  <div className="text-gray-300 text-xs sm:text-sm mt-2 font-bold">دعم فني</div>
                </div>
              )}
            </div>
          </div>
        </section>
        <WaveDivider fromColor="#0f1f3d" toColor="#ffffff" flip />
        </>
      )}

      {/* About teaser */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <Reveal>
          <div className="premium-card-bg border border-gray-200 rounded-3xl p-6 sm:p-10 md:p-12 shadow-lg text-center sm:text-right">
            <span className="text-gold font-bold text-xs sm:text-sm uppercase tracking-wider block mb-3 font-mono">// من نحن</span>
            <h2 className="text-2xl md:text-4xl font-black text-gray-900 mb-5">{settings.about_title}</h2>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-6">{settings.about_text1}</p>
            <a href="/about" className="inline-flex items-center gap-2 text-[#8a6d1f] font-bold hover:underline">
              اعرف أكتر عننا <i className="fa-solid fa-arrow-left" />
            </a>
          </div>
          </Reveal>
        </div>
      </section>

      {/* Reality Matrix (Problem) */}
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

      {/* Services teaser */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16 sm:mb-20">
          <span className="text-gold font-bold text-xs sm:text-sm uppercase tracking-wider block mb-2 font-mono">// WHAT WE BUILD</span>
          <h2 className="text-2xl md:text-5xl font-black text-gray-900 mb-4">تخصصاتنا البرمجية</h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-base sm:text-lg">من الأبراج العقارية للعيادات الطبية والمطاعم - كل نشاط له بنية رقمية تناسبه.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {specialties.slice(0, 3).map((s, idx) => (
            <Reveal key={s.title} delay={idx * 100}>
            <div className="premium-card-bg border border-gray-200 p-6 sm:p-8 rounded-3xl hover:border-gold/60 transition-all glow-gold h-full hover-lift">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${idx % 2 === 0 ? 'bg-gold/20 text-[#8a6d1f]' : 'bg-teal/15 text-teal'}`}>
                <i className={`fa-solid ${s.icon} text-2xl`} />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-3">{s.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{s.body}</p>
            </div>
            </Reveal>
          ))}
        </div>
        <div className="text-center mt-12">
          <a href="/services" className="inline-flex items-center gap-2 gold-bg-gradient text-black font-black px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover-lift">
            شاهد كل خدماتنا وطريقة شغلنا <i className="fa-solid fa-arrow-left" />
          </a>
        </div>
      </section>

      {/* Portfolio (Proof) */}
      {portfolioItems.length > 0 && (
        <section id="portfolio" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-gold font-bold text-xs sm:text-sm uppercase tracking-wider block mb-2 font-mono">// OUR WORK</span>
            <h2 className="text-2xl md:text-5xl font-black text-gray-900 mb-4">أعمالنا</h2>
          </div>
          <PortfolioGrid items={portfolioItems} locale="ar" limit={6} />
        </section>
      )}

      {/* Testimonials (Social proof) */}
      <WaveDivider fromColor="#ffffff" toColor="#efe8d8" />
      <section id="testimonials" className="py-16 sm:py-24 bg-[#efe8d8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-gold font-bold text-xs sm:text-sm uppercase tracking-wider block mb-2 font-mono">// PARTNER FEEDBACK</span>
            <h2 className="text-2xl md:text-5xl font-black text-gray-900 mb-4">آراء شركائنا</h2>
            {testimonialItems.length > 0 && (() => {
              const avg = testimonialItems.reduce((sum, t) => sum + (t.rating || 5), 0) / testimonialItems.length;
              const rounded = Math.round(avg);
              return (
                <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm">
                  <span className="text-gold font-black text-lg font-mono">{avg.toFixed(1)}</span>
                  <div className="flex text-sm">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <i key={n} className={`fa-solid fa-star ${n <= rounded ? 'text-gold' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="text-gray-500 text-xs">
                    ({testimonialItems.length} {testimonialItems.length === 1 ? 'رأي' : 'آراء'})
                  </span>
                </div>
              );
            })()}
          </div>
          <TestimonialsSection initialItems={testimonialItems} />
        </div>
      </section>

      <WaveDivider fromColor="#efe8d8" toColor="#ffffff" flip />

      {/* Pricing teaser */}
      <section className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <span className="text-gold font-bold text-xs sm:text-sm uppercase tracking-wider block mb-2 font-mono">// PACKAGES</span>
        <h2 className="text-2xl md:text-5xl font-black text-gray-900 mb-4">باقاتنا</h2>
        <p className="text-gray-500 max-w-xl mx-auto mb-10">أسعار تقديرية مبدئية تبدأ من <span className="text-gold font-black font-mono">{pricingPlans[0]?.price || '—'}</span> - كل مشروع يُدرس على حدة.</p>
        <a href="/pricing" className="inline-flex items-center gap-2 gold-bg-gradient text-black font-black px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover-lift">
          شاهد كل الباقات بالتفصيل <i className="fa-solid fa-arrow-left" />
        </a>
      </section>

      {/* Contact */}
      <section id="contact-section" className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="premium-card-bg border border-gray-200 p-8 sm:p-12 md:p-20 rounded-[30px] sm:rounded-[40px] shadow-2xl">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gold/20 text-[#8a6d1f] rounded-3xl flex items-center justify-center mb-6 sm:mb-8 mx-auto shadow-md">
            <i className="fa-solid fa-headset text-3xl sm:text-4xl" />
          </div>
          <h2 className="text-2xl md:text-5xl font-black text-gray-900 mb-6">دعنا نُهندس مظهرك الرقمي القادم</h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <a href={wa} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto inline-flex gold-bg-gradient hover:opacity-90 text-black font-black text-base sm:text-xl px-6 sm:px-10 py-4 sm:py-5 rounded-2xl transition-all shadow-2xl items-center gap-3 active:scale-95 justify-center pulse-cta">
              <i className="fa-brands fa-whatsapp" /> تواصل سريع عبر الواتساب
            </a>
            <ConsultationCTA locale="ar" wa={wa} email={settings.contact_email || 'amvora.agency@gmail.com'} className="w-full sm:w-auto inline-flex items-center gap-3 border-2 border-gold text-[#8a6d1f] font-black text-base sm:text-xl px-6 sm:px-10 py-4 sm:py-5 rounded-2xl transition-all hover:bg-gold/10 justify-center" />
          </div>
          <p className="text-gray-500 text-sm mt-8">
            <a href="/contact" className="text-[#8a6d1f] font-bold hover:underline">أو راسلنا من نموذج التواصل الكامل وشوف أسئلة شائعة ←</a>
          </p>
        </div>
      </section>

      <WaveDivider fromColor="#ffffff" toColor="#0f1f3d" />
      <SiteFooter locale="ar" settings={settings} wa={wa} />
      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="تواصل عبر واتساب"
        className="fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full bg-[#25D366] text-white shadow-2xl flex items-center justify-center text-2xl hover:scale-110 transition-transform focus-visible:ring-4 focus-visible:ring-[#25D366]/50 focus-visible:outline-none"
      >
        <i className="fa-brands fa-whatsapp" />
      </a>
      <BackToTop />
    </main>
  );
}
