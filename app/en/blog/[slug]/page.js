import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBlogPostBySlug, getBlogPosts, getSettings } from '@/lib/db';
import { fetchSiteContent } from '@/lib/content';
import { readingTime } from '@/lib/readingTime';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import BackToTop from '@/components/BackToTop';
import ConsultationCTA from '@/components/ConsultationCTA';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  try {
    const post = await getBlogPostBySlug(params.slug, 'en');
    if (!post) return { title: 'Post not found' };
    return {
      title: post.title,
      description: post.excerpt || post.title,
      alternates: { canonical: `/en/blog/${params.slug}` },
    };
  } catch {
    return { title: 'Blog' };
  }
}

export default async function BlogPostEn({ params }) {
  let post = null;
  let settings = {};
  try {
    post = await getBlogPostBySlug(params.slug, 'en');
  } catch {
    post = null;
  }
  try {
    settings = await getSettings();
  } catch {
    settings = {};
  }
  const { wa } = await fetchSiteContent('en');

  if (!post) notFound();

  let related = [];
  try {
    const allPosts = await getBlogPosts('en');
    related = allPosts
      .filter((p) => p.id !== post.id && p.category && p.category === post.category)
      .slice(0, 3);
    if (related.length === 0) {
      related = allPosts.filter((p) => p.id !== post.id).slice(0, 3);
    }
  } catch {
    related = [];
  }

  const paragraphs = post.content.split('\n').filter((p) => p.trim() !== '');

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    datePublished: post.created_at,
    author: { '@type': 'Person', name: post.author || 'Amvora Team' },
    publisher: { '@type': 'Organization', name: 'Amvora', logo: { '@type': 'ImageObject', url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://amvora.vercel.app'}/logo.png` } },
    ...(post.cover_image ? { image: post.cover_image } : {}),
  };

  return (
    <main className="min-h-screen bg-white" dir="ltr" lang="en">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <SiteHeader locale="en" wa={wa} />

      <article className="py-16 sm:py-20 max-w-3xl mx-auto px-4 sm:px-6">
        {post.category && (
          <Link href="/en/blog" className="inline-block text-gold text-xs font-bold uppercase tracking-wider mb-3 hover:underline">{post.category}</Link>
        )}
        <h1 className="text-2xl sm:text-4xl font-black text-gray-900 mb-4 leading-tight">{post.title}</h1>
        <p className="text-gray-400 text-xs font-mono mb-8">
          {post.author && <span>{post.author} · </span>}
          {new Date(post.created_at).toLocaleDateString('en-US')} · {readingTime(post.content, 'en')}
        </p>
        {post.cover_image && (
          <div className="relative w-full h-56 sm:h-80 rounded-3xl overflow-hidden mb-10">
            <Image src={post.cover_image} alt={post.title} fill className="object-cover" />
          </div>
        )}
        <div className="space-y-5 text-gray-700 text-base sm:text-lg leading-relaxed">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="mt-16 premium-card-bg border border-gray-200 rounded-3xl p-6 sm:p-10 text-center">
          <h2 className="text-lg sm:text-2xl font-black text-gray-900 mb-4">Want to apply this to your website?</h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 gold-bg-gradient text-black font-black px-5 sm:px-6 py-3 rounded-xl hover-lift">
              <i className="fa-brands fa-whatsapp" /> Quick chat
            </a>
            <ConsultationCTA locale="en" wa={wa} email={settings.contact_email || 'amvora.agency@gmail.com'} className="inline-flex items-center gap-2 border-2 border-gold text-[#8a6d1f] font-black px-5 sm:px-6 py-3 rounded-xl hover:bg-gold/10" />
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-gray-900 font-black text-lg sm:text-xl mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link key={r.id} href={`/en/blog/${r.slug}`} className="premium-card-bg border border-gray-200 rounded-2xl overflow-hidden hover:border-gold/50 transition-all hover-lift block">
                  {r.cover_image && (
                    <div className="relative w-full h-28">
                      <Image src={r.cover_image} alt={r.title} fill className="object-cover" />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-gray-900 font-bold text-sm leading-snug">{r.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 pt-8 border-t border-gray-200 text-center">
          <Link href="/en/blog" className="text-[#8a6d1f] font-bold hover:underline">← Back to all articles</Link>
        </div>
      </article>

      <SiteFooter locale="en" settings={settings} wa={wa} />
      <a href={wa} target="_blank" rel="noopener noreferrer" aria-label="Contact us on WhatsApp" className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#25D366] text-white shadow-2xl flex items-center justify-center text-2xl hover:scale-110 transition-transform focus-visible:ring-4 focus-visible:ring-[#25D366]/50 focus-visible:outline-none">
        <i className="fa-brands fa-whatsapp" />
      </a>
      <BackToTop side="left" />
    </main>
  );
}
