import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBlogPostBySlug } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  try {
    const post = await getBlogPostBySlug(params.slug, 'en');
    if (!post) return { title: 'Post not found' };
    return {
      title: post.title,
      description: post.excerpt || post.title,
    };
  } catch {
    return { title: 'Blog' };
  }
}

export default async function BlogPostEn({ params }) {
  let post = null;
  try {
    post = await getBlogPostBySlug(params.slug, 'en');
  } catch {
    post = null;
  }

  if (!post) notFound();

  const paragraphs = post.content.split('\n').filter((p) => p.trim() !== '');

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    datePublished: post.created_at,
    ...(post.cover_image ? { image: post.cover_image } : {}),
  };

  return (
    <main className="min-h-screen bg-white" dir="ltr" lang="en">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <header className="border-b border-gray-200 bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <Link href="/en" className="flex items-center gap-3">
            <Image src="/logo.png" alt="Amvora Logo" width={48} height={48} className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-full border border-[#c5a059]/40 shadow-lg bg-[#f6f1e6] p-1" />
            <span className="text-lg sm:text-xl font-black tracking-wider text-gray-900 font-mono">AMVORA<span className="text-gold">.</span></span>
          </Link>
          <Link href="/en/blog" className="text-xs sm:text-sm font-bold text-gray-500 hover:text-gold border border-gray-200 rounded-lg px-3 py-2">
            All articles
          </Link>
        </div>
      </header>

      <article className="py-16 sm:py-20 max-w-3xl mx-auto px-4 sm:px-6">
        <p className="text-gray-400 text-xs font-mono mb-3">{new Date(post.created_at).toLocaleDateString('en-US')}</p>
        <h1 className="text-2xl sm:text-4xl font-black text-gray-900 mb-8 leading-tight">{post.title}</h1>
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

        <div className="mt-16 pt-8 border-t border-gray-200 text-center">
          <Link href="/en/blog" className="text-[#8a6d1f] font-bold hover:underline">← Back to all articles</Link>
        </div>
      </article>

      <footer className="border-t border-gray-200 bg-[#ece3cf] text-gray-600 py-10 text-center text-xs">
        <p className="font-mono font-bold text-gray-900">&copy; {new Date().getFullYear()} AMVORA AGENCY.</p>
      </footer>
    </main>
  );
}
