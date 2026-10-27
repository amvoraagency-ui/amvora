import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { getPortfolioItems, getAllTestimonialsAdmin, getSettings, getAllFaqsAdmin, getHeroSlides, ensureSchema } from '@/lib/db';
import Dashboard from './Dashboard';

export default async function DashboardPage() {
  const session = await getSession();
  if (!session.isLoggedIn) {
    redirect('/admin');
  }

  let portfolio = [];
  let testimonials = [];
  let settings = {};
  let faqs = [];
  let heroSlides = [];
  let dbError = null;

  try {
    await ensureSchema();
    [portfolio, testimonials, settings, faqs, heroSlides] = await Promise.all([
      getPortfolioItems(),
      getAllTestimonialsAdmin(),
      getSettings(),
      getAllFaqsAdmin(),
      getHeroSlides(),
    ]);
  } catch (err) {
    dbError = 'لا يمكن الاتصال بقاعدة البيانات. تأكد من ربط Vercel Postgres وإضافة متغيرات البيئة الخاصة بها.';
  }

  return (
    <Dashboard
      initialPortfolio={portfolio}
      initialTestimonials={testimonials}
      initialSettings={settings}
      initialFaqs={faqs}
      initialHeroSlides={heroSlides}
      dbError={dbError}
    />
  );
}
