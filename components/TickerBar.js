export default function TickerBar({ text }) {
  if (!text) return null;
  const single = Array(10).fill(text);
  const doubled = [...single, ...single];
  return (
    <div className="bg-navy text-[#f3e1b9] text-xs sm:text-sm py-2 overflow-hidden whitespace-nowrap border-b border-black/20">
      <div className="ticker-track inline-flex w-max" dir="ltr">
        {doubled.map((t, i) => (
          <span key={i} className="mx-8">{t}</span>
        ))}
      </div>
      <style>{`
        .ticker-track {
          animation: ticker-scroll 90s linear infinite;
        }
        @keyframes ticker-scroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ticker-track {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
