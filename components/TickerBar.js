export default function TickerBar({ text }) {
  if (!text) return null;
  return (
    <div className="bg-[#1a1a2e] text-[#f3e1b9] text-xs sm:text-sm py-2 overflow-hidden whitespace-nowrap border-b border-black/20">
      <div className="ticker-track inline-block">
        <span className="mx-8">{text}</span>
        <span className="mx-8">{text}</span>
      </div>
      <style>{`
        .ticker-track {
          animation: ticker-scroll 28s linear infinite;
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
