import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { addTestimonial, getSettings, ensureSchema } from '@/lib/db';

const recentSubmissions = new Map();
const WINDOW_MS = 60 * 1000;
const MAX_PER_WINDOW = 3;

function isRateLimited(ip) {
  const now = Date.now();
  const timestamps = (recentSubmissions.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  timestamps.push(now);
  recentSubmissions.set(ip, timestamps);
  return timestamps.length > MAX_PER_WINDOW;
}

async function notifyOwner(email, item) {
  if (!email) return;
  try {
    await fetch(`https://formsubmit.co/ajax/${email}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        _subject: 'New review awaiting approval on Amvora',
        Name: item.name,
        Rating: item.rating,
        Review: item.quote,
        Note: 'Log in to the dashboard \u2192 Testimonials tab to approve or reject.',
      }),
    });
  } catch {
    // best-effort only, submission itself should not fail if the notification fails
  }
}

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'محاولات كتيرة جداً، حاول تاني بعد دقيقة' }, { status: 429 });
  }

  const { name, role, quote, rating } = await request.json();

  if (!name || !quote) {
    return NextResponse.json({ error: 'الاسم والرأي مطلوبين' }, { status: 400 });
  }
  const safeRating = Math.min(5, Math.max(1, parseInt(rating, 10) || 5));

  try {
    await ensureSchema();
    const edit_token = crypto.randomBytes(20).toString('hex');
    const item = await addTestimonial({ name, role, quote, rating: safeRating, edit_token, approved: false });

    const settings = await getSettings().catch(() => ({}));
    notifyOwner(settings.contact_email, item);

    // the visitor still sees their own pending review immediately (via the token), everyone else sees it only after approval
    return NextResponse.json({ item, edit_token, pending: true });
  } catch (err) {
    return NextResponse.json({ error: 'تعذر حفظ رأيك حالياً، حاول لاحقاً' }, { status: 500 });
  }
}
