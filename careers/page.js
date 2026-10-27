import Reveal from '@/components/Reveal';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import BackToTop from '@/components/BackToTop';
import JobApplicationForm from '@/components/JobApplicationForm';
import { fetchSiteContent } from '@/lib/content';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'انضم لينا',
  description: 'ابحث عن فرص عمل في وكالة Amvora الرقمية - برمجة، تصميم، إدارة حسابات، ودعم فني.',
  alternates: { canonical: '/careers' },
};

const PERKS = [
  { icon: 'fa-laptop-house', title: 'عمل مرن', body: 'شغل عن بعد أو حضوري حسب الدور، المهم جودة التسليم.' },
  { icon: 'fa-arrow-trend-up', title: 'فرصة نمو حقيقية', body: 'Amvora وكالة بتكبر، وبندور على ناس تكبر معانا مش بس تنفذ مهام.' },
  { icon: 'fa-people-group', title: 'فريق صغير ومباشر', body: 'بتشتغل جنب صاحب القرار على طول، من غير بيروقراطية أو طبقات إدارية.' },
];

export default async function CareersPage({ searchParams }) {
  const { settings, wa } = await fetchSiteContent('ar');
  const submitted = searchParams?.submitted === '1';

  return (
    <main className="min-h-screen bg-white">
      <SiteHeader locale="ar" wa={wa} />

      <section className="relative pt-16 pb-14 sm:pt-20 sm:pb-16 overflow-hidden bg-gradient-to-b from-[#fdf9ee] to-white text-center px-4 sm:px-6">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-gold/10 rounded-full blur-3xl pointer-events-none blob-float" aria-hidden="true" />
        <span className="text-gold font-bold text-xs sm:text-sm uppercase tracking-wider block mb-2 font-mono relative">// JOIN THE TEAM</span>
        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 mb-4 relative">انضم لفريق Amvora</h1>
        <p className="text-gray-500 max-w-xl mx-auto relative">بندوّر على ناس شغوفة بالشغل الجيد، سواء في البرمجة، التصميم، أو إدارة العملاء.</p>
      </section>

      <section className="py-14 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16 sm:mb-20">
          {PERKS.map((p, idx) => (
            <Reveal key={p.title} delay={idx * 100}>
              <div className="premium-card-bg border border-gray-200 rounded-3xl p-6 text-center h-full">
                <div className="w-12 h-12 mx-auto bg-gold/20 text-[#8a6d1f] rounded-2xl flex items-center justify-center text-xl mb-4">
                  <i className={`fa-solid ${p.icon}`} />
                </div>
                <h3 className="text-gray-900 font-bold text-base mb-2">{p.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
        <div className="premium-card-bg border border-gray-200 rounded-3xl p-6 sm:p-10 md:p-12 shadow-lg">
          {submitted && (
            <div className="bg-emerald-50 border-2 border-emerald-400 text-emerald-800 rounded-2xl p-5 mb-8 text-center">
              <i className="fa-solid fa-circle-check text-3xl mb-2" />
              <p className="font-bold">تم استلام طلبك بنجاح! هنراجع بياناتك ونتواصل معاك لو في تطابق مع احتياجنا.</p>
            </div>
          )}
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">قدّم طلبك دلوقتي</h2>
          <p className="text-gray-500 text-sm mb-8">كل البيانات بتوصلنا مباشرة وبتتراجع بسرية تامة.</p>
          <JobApplicationForm locale="ar" email={settings.contact_email || 'amvora.agency@gmail.com'} />
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
