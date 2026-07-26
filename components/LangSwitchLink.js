'use client';
import { useEffect, useState } from 'react';

export default function LangSwitchLink({ to, label, className }) {
  const [href, setHref] = useState(to);

  useEffect(() => {
    setHref(to + (window.location.hash || ''));
  }, [to]);

  return (
    <a href={href} className={className}>
      <i className="fa-solid fa-globe" /> {label}
    </a>
  );
}
