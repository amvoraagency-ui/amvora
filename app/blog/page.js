import Image from 'next/image';
import Link from 'next/link';
import { getBlogPosts, getSettings } from '@/lib/db';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'المدونة',
  description: 'مقالات ونصائح من فريق Amvora عن تصميم المواقع، التسويق الرقمي، والهوية الرقمية للأعمال.',
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

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="Amvora Logo" width={48} height={48} className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-full border border-[#c5a059]/40 shadow-lg bg-[#f6f1e6] p-1" />
            <span className="text-lg sm:text-xl font-black tracking-wider text-gray-900 font-mono">AMVORA<span className="text-gold">.</span></span>
          </Link>
          <Link href="/" className="text-xs sm:text-sm font-bold text-gray-500 hover:text-gold border border-gray-200 rounded-lg px-3 py-2">
            الرجوع للموقع
          </Link>
        </div>
      </header>

      <section className="py-16 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="premium-card-bg border border-gray-200 rounded-3xl overflow-hidden hover:border-gold/50 transition-all shadow-lg hover-lift block">
              {post.cover_image && (
                <div className="relative w-full h-44">
                  <Image src={post.cover_image} alt={post.title} fill className="object-cover" />
                </div>
              )}
              <div className="p-6">
                <p className="text-gray-400 text-xs font-mono mb-2">{new Date(post.created_at).toLocaleDateString('ar-EG')}</p>
                <h2 className="text-gray-900 font-black text-lg mb-2">{post.title}</h2>
                {post.excerpt && <p className="text-gray-500 text-sm leading-relaxed">{post.excerpt}</p>}
                <span className="inline-block mt-4 text-[#8a6d1f] text-sm font-bold">اقرأ المزيد ←</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="border-t border-gray-200 bg-[#ece3cf] text-gray-600 py-10 text-center text-xs">
        <p className="font-mono font-bold text-gray-900">&copy; {new Date().getFullYear()} AMVORA AGENCY.</p>
        <p className="mt-2">
          <a href={`https://wa.me/${settings.whatsapp_number || '201000446294'}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gold">تواصل معنا</a>
        </p>
      </footer>
    </main>
  );
}
