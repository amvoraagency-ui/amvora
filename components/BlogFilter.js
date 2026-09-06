'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { readingTime } from '@/lib/readingTime';

export default function BlogFilter({ posts, categories, locale = 'ar' }) {
  const [active, setActive] = useState(null);
  const filtered = active ? posts.filter((p) => p.category === active) : posts;
  const allLabel = locale === 'en' ? 'All' : 'الكل';
  const readMore = locale === 'en' ? 'Read more →' : 'اقرأ المزيد ←';
  const base = locale === 'en' ? '/en/blog' : '/blog';
  const localeCode = locale === 'en' ? 'en-US' : 'ar-EG';

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        <button
          onClick={() => setActive(null)}
          className={`text-xs font-bold px-4 py-2 rounded-full border transition-colors ${!active ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-300 text-gray-500 hover:border-gold/50'}`}
        >
          {allLabel} ({posts.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`text-xs font-bold px-4 py-2 rounded-full border transition-colors ${active === cat ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-300 text-gray-500 hover:border-gold/50'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
        {filtered.map((post) => (
          <Link key={post.id} href={`${base}/${post.slug}`} className="premium-card-bg border border-gray-200 rounded-3xl overflow-hidden hover:border-gold/50 transition-all shadow-lg hover-lift block">
            {post.cover_image && (
              <div className="relative w-full h-44">
                <Image src={post.cover_image} alt={post.title} fill className="object-cover" />
              </div>
            )}
            <div className="p-6">
              {post.category && <span className="inline-block text-[10px] font-bold text-[#8a6d1f] bg-gold/10 rounded-full px-2 py-0.5 mb-2">{post.category}</span>}
              <p className="text-gray-400 text-xs font-mono mb-2">{new Date(post.created_at).toLocaleDateString(localeCode)} · {readingTime(post.content, locale)}</p>
              <h2 className="text-gray-900 font-black text-lg mb-2">{post.title}</h2>
              {post.excerpt && <p className="text-gray-500 text-sm leading-relaxed">{post.excerpt}</p>}
              <span className="inline-block mt-4 text-[#8a6d1f] text-sm font-bold">{readMore}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
