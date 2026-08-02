'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function HeroCarousel({ slides }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!slides || slides.length < 2) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides]);

  if (!slides || slides.length === 0) return null;

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === index ? 1 : 0 }}
        >
          <Image src={slide.image_url} alt="" fill className="object-cover" priority={i === 0} />
          <div className="absolute inset-0 bg-white/80" />
        </div>
      ))}
    </div>
  );
}
