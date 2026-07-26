'use client';
import { useEffect } from 'react';

export default function LangSetter() {
  useEffect(() => {
    const html = document.documentElement;
    const prevLang = html.lang;
    const prevDir = html.dir;
    html.lang = 'en';
    html.dir = 'ltr';
    return () => {
      html.lang = prevLang;
      html.dir = prevDir;
    };
  }, []);
  return null;
}
