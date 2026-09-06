'use client';

const DEFAULT_BADGES_AR = ['تصميم عصري', 'سرعة وأداء عالي', 'كود مخصص 100%', 'دعم فني مستمر', 'تكامل بوابات الدفع', 'تهيئة SEO كاملة'];
const DEFAULT_BADGES_EN = ['Modern Design', 'High Performance', '100% Custom Code', 'Ongoing Support', 'Payment Integration', 'Full SEO Setup'];

export default function ImageMarquee({ items = [], locale = 'ar' }) {
  const images = items.filter((i) => i.image_url).slice(0, 12);
  const badges = locale === 'en' ? DEFAULT_BADGES_EN : DEFAULT_BADGES_AR;

  if (images.length === 0) {
    // Fallback: scrolling text badges, repeated enough times per block so the loop never shows a gap
    const block = Array(3).fill(badges).flat();
    return (
      <div className="bg-white border-y border-gray-200 py-4 sm:py-5 overflow-hidden">
        <div className="marquee-track flex items-center w-max">
          <span className="flex items-center gap-3 sm:gap-4 shrink-0 pr-3 sm:pr-4">
            {block.map((b, i) => (
              <span key={`a-${i}`} className="shrink-0 flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full border border-gray-200 bg-[#f6f1e6] text-[#8a6d1f] text-xs sm:text-sm font-bold whitespace-nowrap">
                <i className="fa-solid fa-star text-[10px]" />
                {b}
              </span>
            ))}
          </span>
          <span className="flex items-center gap-3 sm:gap-4 shrink-0 pr-3 sm:pr-4" aria-hidden="true">
            {block.map((b, i) => (
              <span key={`b-${i}`} className="shrink-0 flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full border border-gray-200 bg-[#f6f1e6] text-[#8a6d1f] text-xs sm:text-sm font-bold whitespace-nowrap">
                <i className="fa-solid fa-star text-[10px]" />
                {b}
              </span>
            ))}
          </span>
        </div>
        <style>{`
          .marquee-track { animation: marquee-scroll 32s linear infinite; }
          @keyframes marquee-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
          @media (prefers-reduced-motion: reduce) { .marquee-track { animation: none; } }
        `}</style>
      </div>
    );
  }

  const block = Array(3).fill(images).flat();

  return (
    <div className="bg-white border-y border-gray-200 py-5 sm:py-6 overflow-hidden">
      <div className="marquee-track flex items-center w-max">
        <span className="flex items-center gap-4 sm:gap-6 shrink-0 pr-4 sm:pr-6">
          {block.map((item, i) => (
            <span key={`a-${i}`} className="shrink-0 w-40 h-24 sm:w-56 sm:h-32 rounded-2xl overflow-hidden border border-gray-200 shadow-md relative bg-gray-50 block">
              <img src={item.image_url} alt={item.title || ''} className="w-full h-full object-cover" />
            </span>
          ))}
        </span>
        <span className="flex items-center gap-4 sm:gap-6 shrink-0 pr-4 sm:pr-6" aria-hidden="true">
          {block.map((item, i) => (
            <span key={`b-${i}`} className="shrink-0 w-40 h-24 sm:w-56 sm:h-32 rounded-2xl overflow-hidden border border-gray-200 shadow-md relative bg-gray-50 block">
              <img src={item.image_url} alt="" className="w-full h-full object-cover" />
            </span>
          ))}
        </span>
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
