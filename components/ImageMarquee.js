'use client';

const DEFAULT_BADGES_AR = ['تصميم عصري', 'سرعة وأداء عالي', 'كود مخصص 100%', 'دعم فني مستمر', 'تكامل بوابات الدفع', 'تهيئة SEO كاملة'];
const DEFAULT_BADGES_EN = ['Modern Design', 'High Performance', '100% Custom Code', 'Ongoing Support', 'Payment Integration', 'Full SEO Setup'];

export default function ImageMarquee({ items = [], locale = 'ar' }) {
  const images = items.filter((i) => i.image_url).slice(0, 12);
  const badges = locale === 'en' ? DEFAULT_BADGES_EN : DEFAULT_BADGES_AR;

  if (images.length === 0) {
    // Fallback: scrolling text badges, so the strip is never empty
    const loopBadges = [...badges, ...badges];
    return (
      <div className="bg-white border-y border-gray-200 py-4 sm:py-5 overflow-hidden">
        <div className="marquee-track flex items-center gap-3 sm:gap-4 w-max">
          {loopBadges.map((b, i) => (
            <span key={i} className="shrink-0 flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full border border-gray-200 bg-[#f6f1e6] text-[#8a6d1f] text-xs sm:text-sm font-bold whitespace-nowrap">
              <i className="fa-solid fa-star text-[10px]" />
              {b}
            </span>
          ))}
        </div>
        <style>{`
          .marquee-track { animation: marquee-scroll 32s linear infinite; }
          @keyframes marquee-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
          @media (prefers-reduced-motion: reduce) { .marquee-track { animation: none; } }
        `}</style>
      </div>
    );
  }

  const loop = [...images, ...images];

  return (
    <div className="bg-white border-y border-gray-200 py-5 sm:py-6 overflow-hidden">
      <div className="marquee-track flex items-center gap-4 sm:gap-6 w-max">
        {loop.map((item, i) => (
          <div key={i} className="shrink-0 w-40 h-24 sm:w-56 sm:h-32 rounded-2xl overflow-hidden border border-gray-200 shadow-md relative bg-gray-50">
            <img src={item.image_url} alt={item.title || ''} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
      <style>{`
        .marquee-track { animation: marquee-scroll 40s linear infinite; }
        .marquee-track:hover { animation-play-state: paused; }
        @keyframes marquee-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) { .marquee-track { animation: none; } }
      `}</style>
    </div>
  );
}
