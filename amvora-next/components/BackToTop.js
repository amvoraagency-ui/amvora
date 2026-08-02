'use client';
import { useState, useEffect } from 'react';

export default function BackToTop({ side = 'right' }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  const sideClass = side === 'left' ? 'left-6' : 'right-6';

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="الرجوع لأعلى الصفحة"
      className={`fixed bottom-6 ${sideClass} z-40 w-12 h-12 rounded-full gold-bg-gradient text-black shadow-2xl flex items-center justify-center text-lg hover:opacity-90 transition-all focus-visible:ring-4 focus-visible:ring-gold/50 focus-visible:outline-none`}
    >
      <i className="fa-solid fa-arrow-up" />
    </button>
  );
}
