import Image from 'next/image';
import Reveal from '@/components/Reveal';
import {
  getPortfolioItems,
  getTestimonials,
  getSettings,
  getFaqs,
  getHeroSlides,
  getContentBlocks,
} from '@/lib/db';
import TickerBar from '@/components/TickerBar';
import HeroCarousel from '@/components/HeroCarousel';
import TestimonialsSection from '@/components/TestimonialsSection';
import MobileNav, { DesktopNav } from '@/components/Nav';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import BackToTop from '@/components/BackToTop';
import LangSwitchLink from '@/components/LangSwitchLink';

export const dynamic = 'force-dynamic';

async function safe(fn, fallback) {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

const DEFAULT_REALITY = [
  { icon: 'fa-city', title: 'في قطاع العقارات والإنشاءات:', body: 'الاعتماد على نصوص عشوائية دون إبراز للمشاريع بشكل منظم برمجياً، مما يجعل واجهة الموقع تبدو غير احترافية ولا تعكس جودة عمل الشركة على أرض الواقع.', body2: 'نهندس واجهات رقمية مخصصة تستعرض المشاريع الإنشائية بانسيابية فنية عالية، مما يعطي انطباعاً فورياً بالموثوقية العالية والجدية التقنية أمام العملاء والمستثمرين.' },
  { icon: 'fa-bag-shopping', title: 'في قطاع المتاجر والبراندات:', body: 'موقع مثقل بقوالب برمجية تجارية مكررة وبطيئة التحميل، تؤدي إلى تشتيت الزوار وتقليل معدلات الشراء الفورية بسبب انعدام السلاسة الفنية.', body2: 'بناء برمجي مستقل وسريع يمنع ارتداد الزائر، مع تصميم واجهات تبرز المنتجات بشكل احترافي مريح لتجربة مستخدم متكاملة تزيد من استجابة العميل لإتمام الطلب.' },
  { icon: 'fa-user-doctor', title: 'في المهن الحرة والاستشارية:', body: 'الاعتماد الكامل على صفحات التواصل الاجتماعي فقط، وهو ما يحد من مصداقيتك أمام عميل يبحث عنك بالاسم ولا يجد موقعاً رسمياً يوثّق خبرتك ومؤهلاتك.', body2: 'موقع تعريفي مخصص يعرض خبراتك ومؤهلاتك وأسلوب تواصلك بشكل منظم، ويكون أول ما يظهر لأي عميل يبحث عن اسمك أو تخصصك.' },
];

const DEFAULT_STRATEGIC_VALUE = [
  { icon: 'fa-clock', title: 'متاح على مدار اليوم', body: 'موقعك الإلكتروني متاح على مدار الساعة، مما يسمح للعملاء المحتملين بالتعرف على خدماتك ومنتجاتك والوصول إليك في أي وقت ومن أي مكان.' },
  { icon: 'fa-shield-heart', title: 'بناء الموثوقية والثقة', body: 'يمنح الموقع المحترف والمنظم انطباعاً إيجابياً وفخماً فورياً عن مؤسستك، مما يعزز من مصداقية عملك ويزيد من ثقة وولاء العملاء بك.' },
  { icon: 'fa-images', title: 'استعراض شامل وتفاعلي', body: 'يمكنك عرض باقة منتجاتك وخدماتك بكافة تفاصيلها الفنية بشكل منظم كلياً، مدعومة بالصور الحية ومقاطع الفيديو التوضيحية الجذابة.' },
  { icon: 'fa-headset', title: 'قناة مركزية للدعم', body: 'يمكن استخدام منصتك الرقمية كقناة مباشرة وفعالة للرد على كافة استفسارات العملاء، وتلقي الطلبات، وتقديم الدعم الفني السريع بمرونة تامة.' },
  { icon: 'fa-bullseye', title: 'قلب الاستراتيجية التسويقية', body: 'يعتبر الموقع الوجهة الأساسية التي يتم توجيه الزوار المهتمين والمستثمرين إليها من مختلف الحملات الإعلانية الممولة لتحويلهم إلى صفقات فعلية.' },
  { icon: 'fa-cart-shopping', title: 'قناة بيع جديدة ومستمرة', body: 'يفتح المتجر الإلكتروني المخصص للبراند منافذ تعاقدات ومبيعات متجددة تعمل بكفاءة على مدار الساعة لضمان نمو واستدامة حركة التدفق النقدي.' },
];

const DEFAULT_SPECIALTIES = [
  { icon: 'fa-city', title: 'الأبراج العقارية والإنشائية', body: 'نهندس لشركات التطوير العقاري والمقاولات واجهات رقمية تعكس جودة ومقاييس مشاريعكم على أرض الواقع، مع استعراض منظم للمشاريع ونماذج طلب استشارة مجهزة لاستقبال بيانات المهتمين بدقة.', tag: 'Real Estate & Towers //' },
  { icon: 'fa-bag-shopping', title: 'المتاجر الإلكترونية المخصصة', body: 'نبني متاجر متكاملة تركز على سرعة التحميل والاستجابة لتقليل ارتداد الزوار، مقتدين بالمقاييس التقنية المعتمدة في كبرى المنصات العالمية لزيادة معدلات التحويل.', tag: 'High-Conversion E-Commerce //' },
  { icon: 'fa-address-card', title: 'المواقع التعريفية للمهنيين وأصحاب الأعمال', body: 'مهما كان مجال عملك - طبيب، مهندس، مكتب استشاري، مطعم، كافيه، محل تجاري، أو حتى علامتك الشخصية - نصمم لك موقعاً تعريفياً احترافياً يعرض خبرتك وخدماتك بشكل منظم، ويكون أول ما يظهر لأي عميل يبحث عن اسمك أو تخصصك.', tag: 'Professional Profile Sites //' },
  { icon: 'fa-code-branch', title: 'التكامل والربط البرمجي', body: 'نوفر تكاملاً برمجياً مخصصاً لربط بوابات الدفع والتقسيط الإقليمية مع إعداد متطور لأنظمة التتبع والتحليل الرقمي، لضمان دقة تدفق البيانات وثبات أداء المنصة.', tag: 'Custom API Integrations //' },
];

const DEFAULT_PROCESS = [
  { title: 'استشارة مبدئية', body: 'نسمع فكرتك ومتطلبات مشروعك عبر الواتساب ونحدد الأنسب لك.' },
  { title: 'تصميم وعرض', body: 'نجهز تصور مبدئي لشكل المنصة قبل البدء في البناء الفعلي.' },
  { title: 'بناء وربط تقني', body: 'هندسة الكود، وربط بوابات الدفع وأدوات التحليل حسب مشروعك.' },
  { title: 'تسليم ودعم فني', body: 'تسليم المنصة مع فترة دعم فني مكفولة للتأكد من استقرارها.' },
];

export default async function Home() {
  const [portfolioItems, testimonialItems, settings, faqs, heroSlides, realityDb, strategicDb, specialtiesDb, processDb] = await Promise.all([
    safe(getPortfolioItems, []),
    safe(getTestimonials, []),
    safe(getSettings, {}),
    safe(() => getFaqs('ar'), []),
    safe(getHeroSlides, []),
    safe(() => getContentBlocks('reality'), []),
    safe(() => getContentBlocks('strategic_value'), []),
    safe(() => getContentBlocks('specialties'), []),
    safe(() => getContentBlocks('process'), []),
  ]);

  const reality = realityDb.length > 0 ? realityDb : DEFAULT_REALITY;
  const strategicValue = strategicDb.length > 0 ? strategicDb : DEFAULT_STRATEGIC_VALUE;
  const specialties = specialtiesDb.length > 0 ? specialtiesDb : DEFAULT_SPECIALTIES;
  const processSteps = processDb.length > 0 ? processDb : DEFAULT_PROCESS;

  const wa = `https://wa.me/${settings.whatsapp_number || '201000446294'}`;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://amvora.vercel.app';
  const sameAs = [settings.facebook_url, settings.instagram_url, settings.linkedin_url].filter(Boolean);

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Amvora',
    url: siteUrl,
    image: 'https://cdn.phototourl.com/free/2026-06-24-0aa1f689-c330-4cb3-aea7-37a383ae0fb7.png',
    description: 'وكالة هندسة منصات رقمية مخصصة: مواقع تعريفية للمهنيين، عقارات، متاجر إلكترونية، وتكامل بوابات دفع.',
    areaServed: 'EG',
    priceRange: '$$',
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };

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
    <main id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <GoogleAnalytics measurementId={settings.ga_measurement_id} />
      <TickerBar text={settings.ticker_text} />

      {/* Header */}
      <header className="relative border-b border-gray-200 bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 sm:gap-4">
            <Image
              src="https://cdn.phototourl.com/free/2026-06-24-0aa1f689-c330-4cb3-aea7-37a383ae0fb7.png"
              alt="Amvora Logo"
              width={56}
              height={56}
              className="w-11 h-11 sm:w-14 sm:h-14 object-contain rounded-full border border-[#c5a059]/40 shadow-lg bg-[#f6f1e6] p-1"
            />
            <span className="text-xl sm:text-2xl font-black tracking-wider text-gray-900 font-mono">
              AMVORA<span className="text-gold">.</span>
            </span>
          </div>
          <DesktopNav />
          <div className="flex items-center gap-3">
            <LangSwitchLink to="/en" label="EN" className="hidden sm:flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-gold border border-gray-200 rounded-lg px-3 py-2 transition-colors" />
            <a href={wa} target="_blank" rel="noopener noreferrer" className="gold-bg-gradient hover:opacity-90 text-black font-black px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm transition-all shadow-lg flex items-center gap-2">
              <i className="fa-brands fa-whatsapp" /> تواصل معنا
            </a>
            <MobileNav />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-16 pb-20 sm:pt-20 sm:pb-24 overflow-hidden bg-gradient-to-b from-[#fdf9ee] to-white">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-gold/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
        <HeroCarousel slides={heroSlides} />
        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 relative z-10 pt-6 sm:pt-10">
          <Reveal>
          <span className="inline-block bg-gold/20 text-[#8a6d1f] border border-gold/40 text-[10px] sm:text-xs font-bold uppercase tracking-widest px-3 py-1 sm:px-4 sm:py-1.5 rounded-full mb-6 font-mono">
            AMVORA DIGITAL ARCHITECTURE
          </span>
          <h1 className="text-3xl md:text-7xl font-black text-gray-900 leading-tight mb-6 sm:mb-8">{settings.hero_title}</h1>
          <p className="text-base md:text-2xl text-gray-600 max-w-3xl mx-auto mb-3 leading-relaxed">{settings.hero_subtitle}</p>
          <p className="text-sm md:text-lg text-[#8a6d1f]/80 max-w-2xl mx-auto mb-10 sm:mb-12 leading-relaxed">{settings.hero_subtitle2}</p>
          <a href={wa} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto gold-bg-gradient hover:opacity-90 text-black font-black text-lg sm:text-xl px-8 sm:px-10 py-4 sm:py-5 rounded-2xl transition-all shadow-2xl inline-flex items-center justify-center gap-3 active:scale-95 focus-visible:ring-4 focus-visible:ring-gold/50 focus-visible:outline-none">
            ابدأ مراجعة متطلباتك عبر الواتساب
          </a>
          <p className="text-xs sm:text-sm text-gray-400 mt-4">مراجعة أولية لمتطلباتك من غير أي التزام.</p>
          </Reveal>
        </div>
      </section>

      {/* Reality Matrix (Problem) */}
      <section className="py-16 sm:py-24 bg-[#efe8d8] border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 sm:mb-20">
            <span className="text-gold font-bold text-xs sm:text-sm uppercase tracking-wider block mb-2 font-mono">// THE REALITY MATRIX</span>
            <h2 className="text-2xl md:text-5xl font-black text-gray-900 mb-4">تشريح برمجي: الفرق بين المنصات الجاهزة والمخصصة</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            <div className="premium-card-bg border-r-4 border-red-500 border-t border-l border-b border-gray-200 rounded-3xl p-6 sm:p-8 shadow-lg">
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
            <div className="premium-card-bg border-r-4 border-emerald-500 border-t border-l border-b border-gray-200 rounded-3xl p-6 sm:p-8 shadow-lg glow-gold">
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

      {/* Strategic Value (Why it matters) */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl md:text-5xl font-black text-gray-900 mb-4">ليه موقعك الإلكتروني أهم استثمار في نشاطك؟</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {strategicValue.map((v, idx) => (
              <Reveal key={v.title} delay={idx * 80}>
              <div className="premium-card-bg border border-gray-200 p-6 sm:p-8 rounded-3xl hover:border-gold/40 transition-all shadow-lg h-full hover-lift">
                <div className="w-12 h-12 bg-gold/10 text-[#8a6d1f] rounded-xl flex items-center justify-center text-xl mb-6">
                  <i className={`fa-solid ${v.icon}`} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.body}</p>
              </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Specialties (What we build) */}
      <section id="services" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16 sm:mb-20">
          <span className="text-gold font-bold text-xs sm:text-sm uppercase tracking-wider block mb-2 font-mono">// WHAT WE BUILD</span>
          <h2 className="text-2xl md:text-5xl font-black text-gray-900 mb-4">تخصصاتنا البرمجية</h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-base sm:text-lg">من الأبراج العقارية للعيادات الطبية والمطاعم - كل نشاط له بنية رقمية تناسبه.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {specialties.map((s, idx) => (
            <Reveal key={s.title} delay={idx * 100}>
            <div className="premium-card-bg border border-gray-200 p-6 sm:p-10 rounded-3xl hover:border-gold/60 transition-all glow-gold h-full hover-lift">
              <div className="w-14 h-14 bg-gold/20 rounded-2xl flex items-center justify-center mb-8 text-[#8a6d1f]">
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
      </section>

      {/* Process (How we work) */}
      <section id="process" className="py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16 sm:mb-20">
          <span className="text-gold font-bold text-xs sm:text-sm uppercase tracking-wider block mb-2 font-mono">// OUR PROCESS</span>
          <h2 className="text-2xl md:text-5xl font-black text-gray-900 mb-4">إزاي بنشتغل معاك؟</h2>
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

      {/* Portfolio (Proof) */}
      <section id="portfolio" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16 sm:mb-20">
          <span className="text-gold font-bold text-xs sm:text-sm uppercase tracking-wider block mb-2 font-mono">// OUR WORK</span>
          <h2 className="text-2xl md:text-5xl font-black text-gray-900 mb-4">أعمالنا</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {portfolioItems.length === 0 && (
            <div className="premium-card-bg border border-dashed border-gray-300 rounded-3xl p-8 sm:p-10 flex flex-col items-center justify-center text-center min-h-[280px] md:col-span-3">
              <i className="fa-solid fa-hourglass-half text-3xl text-gold/60 mb-4" />
              <h3 className="text-gray-900 font-bold text-lg mb-2">مشروعك القادم هنا</h3>
              <p className="text-gray-500 text-sm leading-relaxed">نحن حالياً بصدد تسليم مجموعة من المشاريع، وسيتم إضافتها هنا فور اكتمالها.</p>
            </div>
          )}
          {portfolioItems.map((item, idx) => (
            <Reveal key={item.id} delay={Math.min(idx, 5) * 80}>
            <div className="premium-card-bg border border-gray-200 rounded-3xl overflow-hidden hover:border-gold/50 transition-all shadow-lg relative h-full hover-lift">
              {item.pinned && (
                <span className="absolute top-3 left-3 bg-gold text-black text-[10px] font-black px-2 py-1 rounded-full z-10">
                  <i className="fa-solid fa-thumbtack ml-1" /> مميز
                </span>
              )}
              {item.image_url && (
                <div className="relative w-full h-48">
                  <Image src={item.image_url} alt={item.title} fill className="object-cover" />
                </div>
              )}
              <div className="p-6">
                {item.tag && <span className="text-xs text-gold font-bold uppercase tracking-wider font-mono">{item.tag}</span>}
                <h3 className="text-gray-900 font-black text-lg mt-2 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                {item.link_url && (
                  <a href={item.link_url} target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-[#8a6d1f] text-sm font-bold hover:underline">
                    زيارة المشروع →
                  </a>
                )}
              </div>
            </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Testimonials (Social proof) */}
      <section id="testimonials" className="py-16 sm:py-24 bg-[#efe8d8] border-y border-gray-200">
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

      {/* About (Humanize, now that trust is built) */}
      <section id="about" className="py-16 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <Reveal>
          <div className="premium-card-bg border border-gray-200 rounded-3xl p-6 sm:p-10 md:p-12 shadow-lg">
            <span className="text-gold font-bold text-xs sm:text-sm uppercase tracking-wider block mb-3 font-mono">// من نحن</span>
            <h2 className="text-2xl md:text-4xl font-black text-gray-900 mb-5">{settings.about_title}</h2>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-4">{settings.about_text1}</p>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed">{settings.about_text2}</p>
          </div>
          </Reveal>
        </div>
      </section>

      {/* VIP Club */}
      <section className="py-16 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6">
        <Reveal>
        <div className="premium-card-bg border-2 border-gold/50 rounded-3xl p-8 sm:p-12 text-center glow-gold">
          <i className="fa-solid fa-crown text-3xl text-gold mb-4" />
          <h2 className="text-xl sm:text-3xl font-black text-gray-900 mb-4">{settings.vip_title}</h2>
          <p className="text-gray-600 text-sm sm:text-lg leading-relaxed max-w-3xl mx-auto">{settings.vip_text}</p>
        </div>
        </Reveal>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16 sm:mb-20">
          <span className="text-gold font-bold text-xs sm:text-sm uppercase tracking-wider block mb-2 font-mono">// PACKAGES</span>
          <h2 className="text-2xl md:text-5xl font-black text-gray-900 mb-4">باقاتنا</h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-base sm:text-lg">أسعار تقديرية مبدئية - كل مشروع يُدرس على حدة حسب متطلباته الفعلية.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <Reveal delay={0}>
          <div className="premium-card-bg border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-lg h-full hover-lift">
            <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-2">الأساسية</h3>
            <div className="text-2xl sm:text-3xl font-black text-gold mb-6 font-mono">{settings.price_basic}</div>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="block text-center border border-gold/50 text-[#8a6d1f] font-bold py-3 rounded-xl hover:bg-gold/10 transition-all focus-visible:ring-4 focus-visible:ring-gold/30 focus-visible:outline-none">اطلب استشارة</a>
          </div>
          </Reveal>
          <Reveal delay={100}>
          <div className="premium-card-bg border-2 border-gold rounded-3xl p-6 sm:p-8 shadow-2xl glow-gold relative h-full hover-lift">
            <span className="absolute -top-3 right-6 bg-gold text-black text-xs font-black px-3 py-1 rounded-full">الأكثر طلباً</span>
            <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-2">الاحترافية</h3>
            <div className="text-2xl sm:text-3xl font-black text-gold mb-6 font-mono">{settings.price_pro}</div>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="block text-center gold-bg-gradient text-black font-black py-3 rounded-xl hover:opacity-90 transition-all focus-visible:ring-4 focus-visible:ring-gold/50 focus-visible:outline-none">اطلب استشارة</a>
          </div>
          </Reveal>
          <Reveal delay={200}>
          <div className="premium-card-bg border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-lg h-full hover-lift">
            <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-2">المتكاملة</h3>
            <div className="text-2xl sm:text-3xl font-black text-gold mb-6 font-mono">{settings.price_premium}</div>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="block text-center border border-gold/50 text-[#8a6d1f] font-bold py-3 rounded-xl hover:bg-gold/10 transition-all focus-visible:ring-4 focus-visible:ring-gold/30 focus-visible:outline-none">اطلب استشارة</a>
          </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl md:text-4xl font-black text-gray-900 mb-4">أسئلة يطرحها شركاؤنا عادةً</h2>
        </div>
        <div className="space-y-6">
          {faqs.length === 0 && <p className="text-center text-gray-500 text-sm">لسه معملناش أسئلة شائعة - أضفها من لوحة التحكم.</p>}
          {faqs.map((f, i) => (
            <details key={f.id} className="group premium-card-bg border-2 border-gray-200 rounded-2xl p-5 sm:p-6 cursor-pointer shadow-md" open={i === 0}>
              <summary className="flex items-center justify-between text-gray-900 font-black text-base sm:text-xl">
                <span>{f.question}</span>
                <span className="transition group-open:rotate-180 text-gold text-lg"><i className="fa-solid fa-chevron-down" /></span>
              </summary>
              <p className="mt-4 text-gray-600 text-sm sm:text-lg leading-relaxed border-t border-gray-200 pt-4">{f.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact-section" className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="premium-card-bg border border-gray-200 p-8 sm:p-12 md:p-20 rounded-[30px] sm:rounded-[40px] shadow-2xl">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gold/20 text-[#8a6d1f] rounded-3xl flex items-center justify-center mb-6 sm:mb-8 mx-auto shadow-md">
            <i className="fa-solid fa-headset text-3xl sm:text-4xl" />
          </div>
          <h2 className="text-2xl md:text-5xl font-black text-gray-900 mb-6">دعنا نُهندس مظهرك الرقمي القادم</h2>
          <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex gold-bg-gradient hover:opacity-90 text-black font-black text-lg sm:text-xl px-8 sm:px-12 py-4 sm:py-6 rounded-2xl transition-all shadow-2xl items-center gap-4 active:scale-95 w-full sm:w-auto justify-center">
            اضغط هنا للتواصل ومناقشة مشروعك
          </a>
          {settings.contact_email && (
            <div className="mt-10 pt-10 border-t border-gray-200">
              <p className="text-gray-500 text-sm mb-6">أو راسلنا مباشرة</p>
              <form action={`https://formsubmit.co/${settings.contact_email}`} method="POST" className="max-w-md mx-auto space-y-4 text-right">
                <input type="hidden" name="_subject" value="طلب تواصل جديد من موقع Amvora" />
                <input type="hidden" name="_next" value={`${process.env.NEXT_PUBLIC_SITE_URL || ''}/#contact-section?sent=1`} />
                <label className="sr-only" htmlFor="c-name">الاسم</label>
                <input id="c-name" type="text" name="الاسم" required placeholder="الاسم" className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900" />
                <label className="sr-only" htmlFor="c-phone">رقم الهاتف</label>
                <input id="c-phone" type="text" name="رقم الهاتف" required placeholder="رقم الهاتف" className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900" />
                <label className="sr-only" htmlFor="c-details">تفاصيل المشروع</label>
                <textarea id="c-details" name="تفاصيل المشروع" rows="3" placeholder="تفاصيل مشروعك" className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900" />
                <button type="submit" className="w-full border border-gold/50 text-[#8a6d1f] font-bold py-3 rounded-xl hover:bg-gold/10 transition-all">إرسال الطلب</button>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-[#ece3cf] text-gray-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-sm">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image src="https://cdn.phototourl.com/free/2026-06-24-0aa1f689-c330-4cb3-aea7-37a383ae0fb7.png" alt="Amvora Logo" width={40} height={40} className="w-10 h-10 object-contain rounded-full border border-gold/40 bg-white p-1" />
              <span className="text-lg font-black tracking-wider text-gray-900 font-mono">AMVORA<span className="text-gold">.</span></span>
            </div>
            <p className="leading-relaxed">وكالة هندسة منصات رقمية مخصصة: مواقع تعريفية للمهنيين، عقارات، متاجر إلكترونية، وتكامل بوابات دفع.</p>
          </div>
          <div>
            <h4 className="text-gray-900 font-bold mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              <li><a href="#services" className="hover:text-[#8a6d1f]">خدماتنا</a></li>
              <li><a href="#process" className="hover:text-[#8a6d1f]">خطوات العمل</a></li>
              <li><a href="#portfolio" className="hover:text-[#8a6d1f]">أعمالنا</a></li>
              <li><a href="#testimonials" className="hover:text-[#8a6d1f]">آراء العملاء</a></li>
              <li><a href="#about" className="hover:text-[#8a6d1f]">من نحن</a></li>
              <li><a href="#pricing" className="hover:text-[#8a6d1f]">الباقات</a></li>
              <li><a href="#faq" className="hover:text-[#8a6d1f]">الأسئلة الشائعة</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-gray-900 font-bold mb-4">تواصل معنا</h4>
            <ul className="space-y-2">
              <li><a href={wa} target="_blank" rel="noopener noreferrer" className="hover:text-[#8a6d1f] flex items-center gap-2"><i className="fa-brands fa-whatsapp" /> واتساب</a></li>
              {settings.contact_email && (
                <li><a href={`mailto:${settings.contact_email}`} className="hover:text-[#8a6d1f] flex items-center gap-2"><i className="fa-solid fa-envelope" /> {settings.contact_email}</a></li>
              )}
              <li><a href="#contact-section" className="hover:text-[#8a6d1f] flex items-center gap-2"><i className="fa-solid fa-headset" /> نموذج تواصل</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-gray-900 font-bold mb-4">تابعنا</h4>
            <div className="flex gap-4 text-lg">
              {settings.facebook_url && <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gold" aria-label="فيسبوك"><i className="fa-brands fa-facebook" /></a>}
              {settings.instagram_url && <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gold" aria-label="إنستجرام"><i className="fa-brands fa-instagram" /></a>}
              {settings.linkedin_url && <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gold" aria-label="لينكد إن"><i className="fa-brands fa-linkedin" /></a>}
              {!settings.facebook_url && !settings.instagram_url && !settings.linkedin_url && (
                <span className="text-gray-400 text-xs">أضف روابطك من لوحة التحكم</span>
              )}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-300 text-center text-[10px] sm:text-xs py-6 px-4">
          <p className="font-mono mb-1 text-gray-900 font-bold">&copy; {new Date().getFullYear()} AMVORA AGENCY. ALL RIGHTS RESERVED.</p>
          <p className="mt-2">
            <a href="/privacy" className="text-gray-500 hover:text-gold">سياسة الخصوصية</a>
            <span className="mx-2">·</span>
            <a href="/terms" className="text-gray-500 hover:text-gold">الشروط والأحكام</a>
            <span className="mx-2">·</span>
            <a href="/admin" className="text-gray-500 hover:text-gold">لوحة التحكم</a>
          </p>
        </div>
      </footer>
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
