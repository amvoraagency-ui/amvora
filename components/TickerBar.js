export default function TickerBar({ text }) {
  if (!text) return null;
  const repeated = Array(8).fill(text);
  return (
    <div className="bg-navy text-[#f3e1b9] text-xs sm:text-sm py-2 overflow-hidden whitespace-nowrap border-b border-black/20">
      <div className="ticker-track inline-flex w-max">
        <span className="inline-flex shrink-0">
          {repeated.map((t, i) => (
            <span key={`a-${i}`} className="mx-8">{t}</span>
          ))}
        </span>
        <span className="inline-flex shrink-0" aria-hidden="true">
          {repeated.map((t, i) => (
            <span key={`b-${i}`} className="mx-8">{t}</span>
          ))}
        </span>
      </div>
      <style>{`
        .ticker-track {
          animation: ticker-scroll 224s linear infinite;
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
