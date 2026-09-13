export default function TickerBar({ text }) {
  if (!text) return null;
  const single = Array(20).fill(text);
  const doubled = [...single, ...single];
  return (
    <div className="bg-navy text-[#f8e9c2] text-sm sm:text-base font-bold py-2.5 overflow-hidden whitespace-nowrap border-b border-black/20 tracking-wide" dir="ltr">
      <div className="ticker-track inline-flex w-max">
        {doubled.map((t, i) => (
          <span key={i} className="mx-8">{t}</span>
        ))}
      </div>
      <style>{`
        .ticker-track {
          animation: ticker-scroll 220s linear infinite;
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
