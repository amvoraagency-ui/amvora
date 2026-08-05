'use client';
import { useState } from 'react';
import Image from 'next/image';
import Reveal from '@/components/Reveal';

export default function PortfolioGrid({ items, locale = 'ar' }) {
  const tags = Array.from(new Set(items.map((i) => i.tag).filter(Boolean)));
  const [activeTag, setActiveTag] = useState(null);

  const filtered = activeTag ? items.filter((i) => i.tag === activeTag) : items;

  const t = locale === 'en'
    ? { all: 'All', empty: "Your project could be here", emptyBody: "We're currently delivering a set of projects, and they'll be added here as soon as they're complete.", pinned: 'Featured', visit: 'Visit project →' }
    : { all: 'الكل', empty: 'مشروعك القادم هنا', emptyBody: 'نحن حالياً بصدد تسليم مجموعة من المشاريع، وسيتم إضافتها هنا فور اكتمالها.', pinned: 'مميز', visit: 'زيارة المشروع →' };

  return (
    <div>
      {tags.length > 1 && (
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <button
            onClick={() => setActiveTag(null)}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-full border transition-all ${!activeTag ? 'gold-bg-gradient text-black border-gold' : 'border-gray-300 text-gray-600 hover:border-gold/50'}`}
          >
            {t.all}
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-full border transition-all ${activeTag === tag ? 'gold-bg-gradient text-black border-gold' : 'border-gray-300 text-gray-600 hover:border-gold/50'}`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filtered.length === 0 && (
          <div className="premium-card-bg border border-dashed border-gray-300 rounded-3xl p-8 sm:p-10 flex flex-col items-center justify-center text-center min-h-[280px] md:col-span-3">
            <i className="fa-solid fa-hourglass-half text-3xl text-gold/60 mb-4" />
            <h3 className="text-gray-900 font-bold text-lg mb-2">{t.empty}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{t.emptyBody}</p>
          </div>
        )}
        {filtered.map((item, idx) => (
          <Reveal key={item.id} delay={Math.min(idx, 5) * 80}>
            <div className="premium-card-bg border border-gray-200 rounded-3xl overflow-hidden hover:border-gold/50 transition-all shadow-lg relative h-full hover-lift">
              {item.pinned && (
                <span className={`absolute top-3 ${locale === 'en' ? 'right-3' : 'left-3'} bg-gold text-black text-[10px] font-black px-2 py-1 rounded-full z-10`}>
                  <i className="fa-solid fa-thumbtack mx-1" /> {t.pinned}
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
                    {t.visit}
                  </a>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
