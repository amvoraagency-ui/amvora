import Image from 'next/image';
import Reveal from '@/components/Reveal';
import LangSetter from '@/components/LangSetter';
import MobileNav, { DesktopNav } from '@/components/Nav';
import LangSwitchLink from '@/components/LangSwitchLink';
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
import GoogleAnalytics from '@/components/GoogleAnalytics';
import BackToTop from '@/components/BackToTop';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Amvora | Custom Digital Platform Engineering',
  description:
    'Amvora builds fully custom, clean-coded digital platforms: professional profile sites for doctors, engineers, and restaurants, real estate, e-commerce stores, and payment gateway integrations engineered for speed and stability.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://amvora.vercel.app'}/en`,
    languages: {
      'ar-EG': process.env.NEXT_PUBLIC_SITE_URL || 'https://amvora.vercel.app',
      en: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://amvora.vercel.app'}/en`,
      'x-default': process.env.NEXT_PUBLIC_SITE_URL || 'https://amvora.vercel.app',
    },
  },
  openGraph: {
    title: 'Amvora | Custom Digital Platform Engineering',
    description: 'We engineer custom digital platforms with complete technical stability.',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Amvora | Custom Digital Platform Engineering',
    description: 'We engineer custom digital platforms with complete technical stability.',
  },
};

async function safe(fn, fallback) {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

const DEFAULT_REALITY_EN = [
  {
    icon: 'fa-city',
    title: 'Real estate & construction:',
    body: 'Generic stock copy with no structured way to showcase projects — the site reads as unpolished and fails to reflect the developer\u2019s real-world credibility.',
    body2: 'We engineer custom digital interfaces that present construction projects with genuine technical polish, giving investors and clients an immediate impression of reliability.',
  },
  {
    icon: 'fa-bag-shopping',
    title: 'Retail & brands:',
    body: 'A site weighed down by bloated, slow-loading commercial templates that distract visitors and quietly kill conversion rates.',
    body2: 'An independent, fast codebase that keeps visitors on the page, with interfaces designed to showcase products cleanly and drive checkout completion.',
  },
  {
    icon: 'fa-user-doctor',
    title: 'Freelancers & consultants:',
    body: 'Relying entirely on social media pages, which limits your credibility when a client searches for you by name and finds no official site documenting your expertise and credentials.',
    body2: 'A dedicated profile site that presents your expertise, credentials, and way of working in a structured way — the first thing a client finds when they search your name or specialty.',
  },
];

const DEFAULT_STRATEGIC_VALUE_EN = [
  { icon: 'fa-clock', title: 'Always open', body: 'Your website works around the clock, letting potential clients discover your services and reach you anytime, from anywhere.' },
  { icon: 'fa-shield-heart', title: 'Instant credibility', body: 'A professional, well-structured site creates an immediate positive impression, strengthening trust and client loyalty.' },
  { icon: 'fa-images', title: 'A complete showcase', body: 'Present your full catalog of products and services in detail, backed by real photography and explainer video.' },
  { icon: 'fa-headset', title: 'A central support channel', body: 'Use your platform as a direct, effective channel for handling inquiries, taking orders, and providing fast support.' },
  { icon: 'fa-bullseye', title: 'The heart of your marketing', body: 'Your site is the destination every paid campaign points to — where interested visitors and investors convert into real deals.' },
  { icon: 'fa-cart-shopping', title: 'A new, constant sales channel', body: 'A dedicated online store opens fresh, recurring revenue streams that work efficiently around the clock.' },
];

const DEFAULT_SPECIALTIES_EN = [
  { icon: 'fa-city', title: 'Real Estate & Towers', body: 'We engineer digital interfaces for developers and contractors that reflect the true quality and scale of their projects, with smooth project showcases and consultation request forms built to capture lead data accurately.', tag: 'Real Estate & Towers //' },
  { icon: 'fa-bag-shopping', title: 'Custom E-Commerce', body: 'We build fully integrated stores focused on load-speed and responsiveness, following the same technical standards as major platforms — for higher stability and stronger conversion rates.', tag: 'High-Conversion E-Commerce //' },
  { icon: 'fa-address-card', title: 'Professional Profile Sites', body: 'Whatever your field — doctor, engineer, consultant, restaurant, café, retail shop, or your own personal brand — we design a professional profile site that presents your expertise and services clearly, and becomes the first thing a client finds when they search your name or specialty.', tag: 'Professional Profile Sites //' },
  { icon: 'fa-code-branch', title: 'Technical Integrations', body: 'Custom integration of regional payment and installment gateways, alongside advanced setup of digital tracking and analytics systems — for fully accurate, error-free data flow.', tag: 'Custom API Integrations //' },
  { icon: 'fa-bullhorn', title: 'Content & Social Media Management', body: 'We manage your social media presence (Facebook, Instagram) with strategically planned content that reflects your brand identity, complementing your website with a fully integrated digital presence instead of a website standing alone.', tag: 'Content & Social Media //' },
];

const DEFAULT_PROCESS_EN = [
  { title: 'Initial consultation', body: 'We hear out your idea and requirements over WhatsApp and scope the right approach.' },
  { title: 'Design & preview', body: 'We prepare an initial visual concept before any actual build work begins.' },
  { title: 'Build & integration', body: 'Engineering the codebase and integrating payment gateways and analytics tools as needed.' },
  { title: 'Delivery & support', body: 'Handover with a guaranteed support window to confirm everything runs stably.' },
];

export default async function EnglishHome() {
  const [portfolioItems, testimonialItems, settings, faqs, heroSlides, realityDb, strategicDb, specialtiesDb, processDb] = await Promise.all([
    safe(getPortfolioItems, []),
    safe(getTestimonials, []),
    safe(getSettings, {}),
    safe(() => getFaqs('en'), []),
    safe(getHeroSlides, []),
    safe(() => getContentBlocks('reality', 'en'), []),
    safe(() => getContentBlocks('strategic_value', 'en'), []),
    safe(() => getContentBlocks('specialties', 'en'), []),
    safe(() => getContentBlocks('process', 'en'), []),
  ]);

  const reality = realityDb.length > 0 ? realityDb : DEFAULT_REALITY_EN;
  const strategicValue = strategicDb.length > 0 ? strategicDb : DEFAULT_STRATEGIC_VALUE_EN;
  const specialties = specialtiesDb.length > 0 ? specialtiesDb : DEFAULT_SPECIALTIES_EN;
  const processSteps = processDb.length > 0 ? processDb : DEFAULT_PROCESS_EN;

  const waMessage = encodeURIComponent("Hi 👋, I saw the Amvora website and I'd like to ask about your services.");
  const wa = `https://wa.me/${settings.whatsapp_number || '201000446294'}?text=${waMessage}`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://amvora.vercel.app';
  const sameAs = [settings.facebook_url, settings.instagram_url, settings.linkedin_url].filter(Boolean);

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Amvora',
    url: `${siteUrl}/en`,
    image: `${siteUrl}/logo.png`,
    description: 'Custom digital platform engineering agency: websites, e-commerce stores, and payment gateway integrations.',
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
      <LangSetter />
      <GoogleAnalytics measurementId={settings.ga_measurement_id} />
      <TickerBar text={settings.ticker_text_en} />

      {/* Header */}
      <header className="relative border-b border-gray-200 bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 sm:gap-4">
            <Image
              src="/logo.png"
              alt="Amvora Logo"
              width={56}
              height={56}
              className="w-11 h-11 sm:w-14 sm:h-14 object-contain rounded-full border border-[#c5a059]/40 shadow-lg bg-[#f6f1e6] p-1"
            />
            <span className="text-xl sm:text-2xl font-black tracking-wider text-gray-900 font-mono">
              AMVORA<span className="text-gold">.</span>
            </span>
          </div>
          <DesktopNav locale="en" />
          <div className="flex items-center gap-3">
            <LangSwitchLink to="/" label="AR" className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-gold border border-gray-200 rounded-lg px-3 py-2 transition-colors" />
            <a href={wa} target="_blank" rel="noopener noreferrer" className="gold-bg-gradient hover:opacity-90 text-black font-black px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm transition-all shadow-lg flex items-center gap-2">
              <i className="fa-brands fa-whatsapp" /> Contact
            </a>
            <MobileNav locale="en" />
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
            <h1 className="text-3xl md:text-7xl font-black text-gray-900 leading-tight mb-6 sm:mb-8">
              We engineer custom digital platforms with complete technical stability.
            </h1>
            <p className="text-base md:text-2xl text-gray-600 max-w-3xl mx-auto mb-3 leading-relaxed">
              At Amvora, we build fully custom, clean-coded systems designed for fast browsing and long-term stability as your business grows.
            </p>
            <p className="text-sm md:text-lg text-[#8a6d1f]/80 max-w-2xl mx-auto mb-10 sm:mb-12 leading-relaxed">
              Your website is the first impression a client forms before they ever speak to you — make it reflect the real quality of your work.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
              <a href={wa} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto gold-bg-gradient hover:opacity-90 text-black font-black text-lg sm:text-xl px-8 sm:px-10 py-4 sm:py-5 rounded-2xl transition-all shadow-2xl inline-flex items-center justify-center gap-3 active:scale-95 focus-visible:ring-4 focus-visible:ring-gold/50 focus-visible:outline-none">
                Start a conversation on WhatsApp
              </a>
              {settings.calendly_url && (
                <a href={settings.calendly_url} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto border-2 border-gold text-[#8a6d1f] font-black text-lg sm:text-xl px-8 sm:px-10 py-4 sm:py-5 rounded-2xl transition-all inline-flex items-center justify-center gap-3 active:scale-95 hover:bg-gold/10 focus-visible:ring-4 focus-visible:ring-gold/30 focus-visible:outline-none">
                  <i className="fa-solid fa-calendar-check" /> Book a Call
                </a>
              )}
            </div>
            <p className="text-xs sm:text-sm text-gray-400 mt-4">An initial review of your requirements, no commitment required.</p>
          </Reveal>
        </div>
      </section>

      {/* Reality Matrix */}
      <section className="py-16 sm:py-24 bg-[#efe8d8] border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 sm:mb-20">
            <span className="text-gold font-bold text-xs sm:text-sm uppercase tracking-wider block mb-2 font-mono">// THE REALITY MATRIX</span>
            <h2 className="text-2xl md:text-5xl font-black text-gray-900 mb-4">Off-the-shelf vs. custom-engineered</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            <div className="premium-card-bg border-l-4 border-red-500 border-t border-r border-b border-gray-200 rounded-3xl p-6 sm:p-8 shadow-lg">
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
            <div className="premium-card-bg border-l-4 border-emerald-500 border-t border-r border-b border-gray-200 rounded-3xl p-6 sm:p-8 shadow-lg glow-gold">
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

      {/* Strategic Value */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl md:text-5xl font-black text-gray-900 mb-4">Why your business needs a real website</h2>
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

      {/* Specialties */}
      <section id="services" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16 sm:mb-20">
          <span className="text-gold font-bold text-xs sm:text-sm uppercase tracking-wider block mb-2 font-mono">// WHAT WE BUILD</span>
          <h2 className="text-2xl md:text-5xl font-black text-gray-900 mb-4">What We Build</h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-base sm:text-lg">From real estate towers to medical clinics and restaurants — every business gets a digital structure that fits it.</p>
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

      {/* Process */}
      <section id="process" className="py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-6">
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

      {/* Portfolio */}
      <section id="portfolio" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16 sm:mb-20">
          <span className="text-gold font-bold text-xs sm:text-sm uppercase tracking-wider block mb-2 font-mono">// OUR WORK</span>
          <h2 className="text-2xl md:text-5xl font-black text-gray-900 mb-4">Selected Work</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {portfolioItems.length === 0 && (
            <div className="premium-card-bg border border-dashed border-gray-300 rounded-3xl p-8 sm:p-10 flex flex-col items-center justify-center text-center min-h-[280px] md:col-span-3">
              <i className="fa-solid fa-hourglass-half text-3xl text-gold/60 mb-4" />
              <h3 className="text-gray-900 font-bold text-lg mb-2">Your project could be here</h3>
              <p className="text-gray-500 text-sm leading-relaxed">We&apos;re currently delivering a set of projects, and they&apos;ll be added here as soon as they&apos;re complete.</p>
            </div>
          )}
          {portfolioItems.map((item, idx) => (
            <Reveal key={item.id} delay={Math.min(idx, 5) * 80}>
              <div className="premium-card-bg border border-gray-200 rounded-3xl overflow-hidden hover:border-gold/50 transition-all shadow-lg relative h-full hover-lift">
                {item.pinned && (
                  <span className="absolute top-3 right-3 bg-gold text-black text-[10px] font-black px-2 py-1 rounded-full z-10">
                    <i className="fa-solid fa-thumbtack mr-1" /> Featured
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
                      Visit project →
                    </a>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 sm:py-24 bg-[#efe8d8] border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-gold font-bold text-xs sm:text-sm uppercase tracking-wider block mb-2 font-mono">// PARTNER FEEDBACK</span>
            <h2 className="text-2xl md:text-5xl font-black text-gray-900 mb-4">What our partners say</h2>
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
                    ({testimonialItems.length} {testimonialItems.length === 1 ? 'review' : 'reviews'})
                  </span>
                </div>
              );
            })()}
          </div>
          <TestimonialsSection initialItems={testimonialItems} locale="en" />
        </div>
      </section>

      {/* About (Humanize, now that trust is built) */}
      <section id="about" className="py-16 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <Reveal>
            <div className="premium-card-bg border border-gray-200 rounded-3xl p-6 sm:p-10 md:p-12 shadow-lg">
              <span className="text-gold font-bold text-xs sm:text-sm uppercase tracking-wider block mb-3 font-mono">// About Us</span>
              <h2 className="text-2xl md:text-4xl font-black text-gray-900 mb-5">A young agency, held to senior-level standards from project one</h2>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-4">
                Amvora was founded to solve a clear problem: most off-the-shelf platforms trade away speed and stability for convenience. We build every project on a clean technical foundation from day one, managing requirements fully from concept through delivery and ongoing support.
              </p>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                We treat every project as a long-term partnership, not a one-off handoff.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* VIP Club */}
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

      {/* Pricing */}
      <section id="pricing" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16 sm:mb-20">
          <span className="text-gold font-bold text-xs sm:text-sm uppercase tracking-wider block mb-2 font-mono">// PACKAGES</span>
          <h2 className="text-2xl md:text-5xl font-black text-gray-900 mb-4">Packages</h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-base sm:text-lg">Starting estimates below — every project is scoped individually based on real requirements.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="premium-card-bg border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-lg h-full hover-lift">
            <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-2">Essentials</h3>
            <div className="text-2xl sm:text-3xl font-black text-gold mb-6 font-mono">{settings.price_basic}</div>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="block text-center border border-gold/50 text-[#8a6d1f] font-bold py-3 rounded-xl hover:bg-gold/10 transition-all">Get a quote</a>
          </div>
          <div className="premium-card-bg border-2 border-gold rounded-3xl p-6 sm:p-8 shadow-2xl glow-gold relative h-full hover-lift">
            <span className="absolute -top-3 left-6 bg-gold text-black text-xs font-black px-3 py-1 rounded-full">Most popular</span>
            <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-2">Professional</h3>
            <div className="text-2xl sm:text-3xl font-black text-gold mb-6 font-mono">{settings.price_pro}</div>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="block text-center gold-bg-gradient text-black font-black py-3 rounded-xl hover:opacity-90 transition-all">Get a quote</a>
          </div>
          <div className="premium-card-bg border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-lg h-full hover-lift">
            <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-2">Integrated</h3>
            <div className="text-2xl sm:text-3xl font-black text-gold mb-6 font-mono">{settings.price_premium}</div>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="block text-center border border-gold/50 text-[#8a6d1f] font-bold py-3 rounded-xl hover:bg-gold/10 transition-all">Get a quote</a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl md:text-4xl font-black text-gray-900 mb-4">Frequently asked questions</h2>
        </div>
        <div className="space-y-6">
          {faqs.length === 0 && <p className="text-center text-gray-500 text-sm">No questions added yet — manage these from the dashboard.</p>}
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
          <h2 className="text-2xl md:text-5xl font-black text-gray-900 mb-6">Let&apos;s engineer your next digital presence</h2>
          <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex gold-bg-gradient hover:opacity-90 text-black font-black text-lg sm:text-xl px-8 sm:px-12 py-4 sm:py-6 rounded-2xl transition-all shadow-2xl items-center gap-4 active:scale-95 w-full sm:w-auto justify-center">
            Message us to discuss your project
          </a>
          {settings.contact_email && (
            <div className="mt-10 pt-10 border-t border-gray-200">
              <p className="text-gray-500 text-sm mb-6">Or email us directly</p>
              <form action={`https://formsubmit.co/${settings.contact_email}`} method="POST" className="max-w-md mx-auto space-y-4 text-left">
                <input type="hidden" name="_subject" value="New contact request from Amvora website (EN)" />
                <input type="hidden" name="_next" value={`${process.env.NEXT_PUBLIC_SITE_URL || ''}/en/#contact-section?sent=1`} />
                <label className="sr-only" htmlFor="c-name-en">Name</label>
                <input id="c-name-en" type="text" name="Name" required placeholder="Your name" className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900" />
                <label className="sr-only" htmlFor="c-phone-en">Phone</label>
                <input id="c-phone-en" type="text" name="Phone" required placeholder="Phone number" className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900" />
                <label className="sr-only" htmlFor="c-details-en">Project details</label>
                <textarea id="c-details-en" name="Project details" rows="3" placeholder="Tell us about your project" className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900" />
                <button type="submit" className="w-full border border-gold/50 text-[#8a6d1f] font-bold py-3 rounded-xl hover:bg-gold/10 transition-all">Send request</button>
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
              <Image src="/logo.png" alt="Amvora Logo" width={40} height={40} className="w-10 h-10 object-contain rounded-full border border-gold/40 bg-white p-1" />
              <span className="text-lg font-black tracking-wider text-gray-900 font-mono">AMVORA<span className="text-gold">.</span></span>
            </div>
            <p className="leading-relaxed">A digital engineering agency: custom websites, e-commerce stores, and payment gateway integrations.</p>
          </div>
          <div>
            <h4 className="text-gray-900 font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#services" className="hover:text-[#8a6d1f]">Services</a></li>
              <li><a href="#process" className="hover:text-[#8a6d1f]">Process</a></li>
              <li><a href="#portfolio" className="hover:text-[#8a6d1f]">Work</a></li>
              <li><a href="#testimonials" className="hover:text-[#8a6d1f]">Reviews</a></li>
              <li><a href="#about" className="hover:text-[#8a6d1f]">About</a></li>
              <li><a href="#pricing" className="hover:text-[#8a6d1f]">Pricing</a></li>
              <li><a href="#faq" className="hover:text-[#8a6d1f]">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-gray-900 font-bold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li><a href={wa} target="_blank" rel="noopener noreferrer" className="hover:text-[#8a6d1f] flex items-center gap-2"><i className="fa-brands fa-whatsapp" /> WhatsApp</a></li>
              {settings.contact_email && (
                <li><a href={`mailto:${settings.contact_email}`} className="hover:text-[#8a6d1f] flex items-center gap-2"><i className="fa-solid fa-envelope" /> {settings.contact_email}</a></li>
              )}
              <li><a href="#contact-section" className="hover:text-[#8a6d1f] flex items-center gap-2"><i className="fa-solid fa-headset" /> Contact form</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-gray-900 font-bold mb-4">Follow Us</h4>
            <div className="flex gap-4 text-lg">
              {settings.facebook_url && <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gold" aria-label="Facebook"><i className="fa-brands fa-facebook" /></a>}
              {settings.instagram_url && <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gold" aria-label="Instagram"><i className="fa-brands fa-instagram" /></a>}
              {settings.linkedin_url && <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gold" aria-label="LinkedIn"><i className="fa-brands fa-linkedin" /></a>}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-300 text-center text-[10px] sm:text-xs py-6 px-4">
          <p className="font-mono mb-1 text-gray-900 font-bold">&copy; {new Date().getFullYear()} AMVORA AGENCY. ALL RIGHTS RESERVED.</p>
          <p className="mt-2">
            <a href="/en/privacy" className="text-gray-500 hover:text-gold">Privacy Policy</a>
            <span className="mx-2">·</span>
            <a href="/en/terms" className="text-gray-500 hover:text-gold">Terms of Service</a>
            <span className="mx-2">·</span>
            <a href="/admin" className="text-gray-500 hover:text-gold">Dashboard</a>
          </p>
        </div>
      </footer>

      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact us on WhatsApp"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#25D366] text-white shadow-2xl flex items-center justify-center text-2xl hover:scale-110 transition-transform focus-visible:ring-4 focus-visible:ring-[#25D366]/50 focus-visible:outline-none"
      >
        <i className="fa-brands fa-whatsapp" />
      </a>
      <BackToTop side="left" />
    </main>
  );
}
