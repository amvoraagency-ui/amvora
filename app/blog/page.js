import Image from 'next/image';
import Link from 'next/link';
import { getBlogPosts, getSettings } from '@/lib/db';
import { fetchSiteContent } from '@/lib/content';
import { readingTime } from '@/lib/readingTime';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import BackToTop from '@/components/BackToTop';
import BlogFilter from '@/components/BlogFilter';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'المدونة',
  description: 'مقالات ونصائح من فريق Amvora عن تصميم المواقع، التسويق الرقمي، والهوية الرقمية للأعمال.',
  alternates: { canonical: '/blog' },
};

export default async function BlogIndex() {
  let posts = [];
  let settings = {};
  try {
    posts = await getBlogPosts('ar');
  } catch {
    posts = [];
  }
  try {
    settings = await getSettings();
  } catch {
    settings = {};
  }
  const { wa } = await fetchSiteContent('ar');

  const featured = posts.find((p) => p.featured) || null;
  const rest = posts.filter((p) => p.id !== featured?.id);
  const categories = Array.from(new Set(posts.map((p) => p.category).filter(Boolean)));

  return (
    <main className="min-h-screen bg-white">
      <SiteHeader locale="ar" wa={wa} />

      <section className="py-16 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-gold font-bold text-xs sm:text-sm uppercase tracking-wider block mb-2 font-mono">// BLOG</span>
          <h1 className="text-3xl sm:text-5xl font-black text-gray-900 mb-4">المدونة</h1>
          <p className="text-gray-500 max-w-xl mx-auto">مقالات ونصائح عملية عن تصميم المواقع والتواجد الرقمي لعملك.</p>
        </div>

        {posts.length === 0 && (
          <div className="premium-card-bg border border-dashed border-gray-300 rounded-3xl p-10 text-center">
            <i className="fa-solid fa-pen-nib text-3xl text-gold/60 mb-4" />
            <p className="text-gray-500 text-sm">لسه معملناش مقالات - قريباً.</p>
          </div>
        )}

        {featured && (
          <Link href={`/blog/${featured.slug}`} className="block premium-card-bg border-2 border-gold/40 rounded-3xl overflow-hidden hover:border-gold transition-all shadow-xl glow-gold mb-10 group">
            <div className="grid grid-cols-1 sm:grid-cols-2">
              {featured.cover_image && (
                <div className="relative w-full h-56 sm:h-full min-h-[220px]">
                  <Image src={featured.cover_image} alt={featured.title} fill className="object-cover" />
                </div>
              )}
              <div className="p-6 sm:p-8 flex flex-col justify-center">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-black bg-gold rounded-full px-3 py-1 w-fit mb-4">
                  <i className="fa-solid fa-star" /> مقال مميز
                </span>
                {featured.category && <span className="text-gold text-xs font-bold uppercase tracking-wider mb-2">{featured.category}</span>}
                <h2 className="text-gray-900 font-black text-xl sm:text-2xl mb-3 group-hover:text-[#8a6d1f] transition-colors">{featured.title}</h2>
                {featured.excerpt && <p className="text-gray-500 text-sm leading-relaxed mb-4">{featured.excerpt}</p>}
                <p className="text-gray-400 text-xs font-mono">
                  {new Date(featured.created_at).toLocaleDateString('ar-EG')} · {readingTime(featured.content, 'ar')}
                </p>
              </div>
            </div>
          </Link>
        )}

        {categories.length > 0 ? (
          <BlogFilter posts={rest} categories={categories} locale="ar" />
        ) : (
          rest.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {rest.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="premium-card-bg border border-gray-200 rounded-3xl overflow-hidden hover:border-gold/50 transition-all shadow-lg hover-lift block">
                  {post.cover_image && (
                    <div className="relative w-full h-44">
                      <Image src={post.cover_image} alt={post.title} fill className="object-cover" />
                    </div>
                  )}
                  <div className="p-6">
                    <p className="text-gray-400 text-xs font-mono mb-2">{new Date(post.created_at).toLocaleDateString('ar-EG')} · {readingTime(post.content, 'ar')}</p>
                    <h2 className="text-gray-900 font-black text-lg mb-2">{post.title}</h2>
                    {post.excerpt && <p className="text-gray-500 text-sm leading-relaxed">{post.excerpt}</p>}
                    <span className="inline-block mt-4 text-[#8a6d1f] text-sm font-bold">اقرأ المزيد ←</span>
                  </div>
                </Link>
              ))}
            </div>
          )
        )}
      </section>

      <SiteFooter locale="ar" settings={settings} wa={wa} />
      <a href={wa} target="_blank" rel="noopener noreferrer" aria-label="تواصل عبر واتساب" className="fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full bg-[#25D366] text-white shadow-2xl flex items-center justify-center text-2xl hover:scale-110 transition-transform focus-visible:ring-4 focus-visible:ring-[#25D366]/50 focus-visible:outline-none">
        <i className="fa-brands fa-whatsapp" />
      </a>
      <BackToTop />
    </main>
  );
}
