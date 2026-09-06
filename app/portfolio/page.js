import PortfolioGrid from '@/components/PortfolioGrid';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import BackToTop from '@/components/BackToTop';
import { getPortfolioItems, getSettings } from '@/lib/db';
import { fetchSiteContent } from '@/lib/content';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'أعمالنا',
  description: 'استعرض مشاريع Amvora في تصميم وبرمجة المواقع الإلكترونية للعقارات، المتاجر، والأعمال المهنية.',
  alternates: { canonical: '/portfolio' },
};

export default async function PortfolioIndex() {
  let items = [];
  let settings = {};
  try {
    items = await getPortfolioItems();
  } catch {
    items = [];
  }
  try {
    settings = await getSettings();
  } catch {
    settings = {};
  }
  const { wa } = await fetchSiteContent('ar');

  return (
    <main className="min-h-screen bg-white">
      <SiteHeader locale="ar" wa={wa} />

      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="text-gold font-bold text-xs sm:text-sm uppercase tracking-wider block mb-2 font-mono">// OUR WORK</span>
          <h1 className="text-3xl sm:text-5xl font-black text-gray-900 mb-4">أعمالنا</h1>
          <p className="text-gray-500 max-w-xl mx-auto">مجموعة من المشاريع التي صممناها وبرمجناها لعملائنا في مختلف القطاعات.</p>
        </div>

        <PortfolioGrid items={items} locale="ar" />
      </section>

      <SiteFooter locale="ar" settings={settings} wa={wa} />
      <a href={wa} target="_blank" rel="noopener noreferrer" aria-label="تواصل عبر واتساب" className="fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full bg-[#25D366] text-white shadow-2xl flex items-center justify-center text-2xl hover:scale-110 transition-transform focus-visible:ring-4 focus-visible:ring-[#25D366]/50 focus-visible:outline-none">
        <i className="fa-brands fa-whatsapp" />
      </a>
      <BackToTop />
    </main>
  );
}
