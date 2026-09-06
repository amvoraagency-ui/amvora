export function readingTime(text, locale = 'ar') {
  const words = (text || '').trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 180));
  return locale === 'en' ? `${minutes} min read` : `${minutes} ${minutes === 1 ? 'دقيقة قراءة' : 'دقايق قراءة'}`;
}
