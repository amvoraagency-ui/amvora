import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPortfolioItemBySlug, getSettings } from '@/lib/db';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import BackToTop from '@/components/BackToTop';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  try {
    const item = await getPortfolioItemBySlug(params.slug);
    if (!item) return { title: 'المشروع غير موجود' };
    return {
      title: item.title,
      description: item.description || item.title,
      alternates: { canonical: `/portfolio/${params.slug}` },
    };
  } catch {
    return { title: 'أعمالنا' };
  }
}

export default async function PortfolioDetail({ params }) {
  let item = null;
  let settings = {};
  try {
    item = await getPortfolioItemBySlug(params.slug);
  } catch {
    item = null;
  }
  try {
    settings = await getSettings();
  } catch {
    settings = {};
  }

  if (!item) notFound();

  const services = (item.services || '').split(',').map((s) => s.trim()).filter(Boolean);
  const paragraphs = (item.full_description || item.description || '').split('\n').filter((p) => p.trim() !== '');
  const gallery = [item.image_url, ...(item.gallery || [])].filter(Boolean);
  const wa = `https://wa.me/${settings.whatsapp_number || '201000446294'}?text=${encodeURIComponent(`مهتم بمشروع مشابه لـ ${item.title}`)}`;

  const workSchema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: item.title,
    description: item.description,
    ...(item.image_url ? { image: item.image_url } : {}),
    ...(item.created_at ? { dateCreated: item.created_at } : {}),
  };

  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(workSchema) }} />
      <SiteHeader locale="ar" wa={wa} />

      <article className="py-16 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6">
        {item.tag && <span className="text-gold font-bold text-xs sm:text-sm uppercase tracking-wider block mb-3 font-mono">// {item.tag}</span>}
        <h1 className="text-2xl sm:text-4xl font-black text-gray-900 mb-6 leading-tight">{item.title}</h1>

        <div className="flex flex-wrap gap-4 mb-10 text-xs sm:text-sm">
          {item.client_name && (
            <span className="bg-gray-100 text-gray-700 rounded-full px-4 py-2 font-bold">
              <i className="fa-solid fa-building ml-2" />العميل: {item.client_name}
            </span>
          )}
          {item.project_date && (
            <span className="bg-gray-100 text-gray-700 rounded-full px-4 py-2 font-bold">
              <i className="fa-solid fa-calendar ml-2" />{item.project_date}
            </span>
          )}
          {services.map((s) => (
            <span key={s} className="bg-[#f6f1e6] text-[#8a6d1f] rounded-full px-4 py-2 font-bold border border-gold/30">{s}</span>
          ))}
        </div>

        {gallery.length > 0 && (
          <div className={`grid gap-3 mb-10 ${gallery.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {gallery.map((src, i) => (
              <div key={i} className={`relative w-full rounded-2xl overflow-hidden ${i === 0 && gallery.length > 1 ? 'col-span-2 h-64 sm:h-96' : 'h-48 sm:h-64'}`}>
                <Image src={src} alt={`${item.title} ${i + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        )}

        <div className="space-y-5 text-gray-700 text-base sm:text-lg leading-relaxed mb-12">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="premium-card-bg border border-gray-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-700 font-bold text-sm sm:text-base text-center sm:text-right">عايز مشروع يشبه ده؟ تواصل معانا دلوقتي.</p>
          <div className="flex gap-3">
            {item.link_url && (
              <a href={item.link_url} target="_blank" rel="noopener noreferrer" className="border border-gray-300 hover:border-gold/50 text-gray-700 font-bold px-5 py-3 rounded-xl text-sm whitespace-nowrap">
                زيارة الموقع ↗
              </a>
            )}
            <a href={wa} target="_blank" rel="noopener noreferrer" className="gold-bg-gradient text-black font-black px-5 py-3 rounded-xl text-sm whitespace-nowrap flex items-center gap-2">
              <i className="fa-brands fa-whatsapp" /> اطلب استشارة
            </a>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-200 text-center">
          <Link href="/portfolio" className="text-[#8a6d1f] font-bold hover:underline">← الرجوع لكل الأعمال</Link>
        </div>
      </article>

      <SiteFooter locale="ar" settings={settings} wa={wa} />
      <BackToTop />
    </main>
  );
}
