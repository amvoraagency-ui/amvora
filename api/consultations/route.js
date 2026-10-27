import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import {
  addConsultation,
  getConsultations,
  updateConsultationStatus,
  deleteConsultation,
  ensureSchema,
} from '@/lib/db';

// حماية أساسية best-effort من إغراق الفورم (spam) من نفس الـ IP
const submissions = new Map();
const WINDOW_MS = 60 * 60 * 1000; // ساعة
const MAX_SUBMISSIONS = 8;

function isRateLimited(ip) {
  const now = Date.now();
  const timestamps = (submissions.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  return timestamps.length >= MAX_SUBMISSIONS;
}
function recordSubmission(ip) {
  const now = Date.now();
  const timestamps = (submissions.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  timestamps.push(now);
  submissions.set(ip, timestamps);
}

export async function GET() {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }
  try {
    const items = await getConsultations();
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: [], error: 'قاعدة البيانات غير متصلة بعد' }, { status: 200 });
  }
}

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'طلبات كتيرة جداً، حاول تاني بعد شوية' }, { status: 429 });
  }

  const body = await request.json();

  // Honeypot: حقل مخفي عن العين البشرية، لو اتملأ فده بوت
  if (body.website_url) {
    // نرد بنجاح وهمي عشان البوت ميعرفش إنه اتكشف، من غير ما نخزن حاجة
    return NextResponse.json({ ok: true });
  }

  if (!body.name || !body.contact) {
    return NextResponse.json({ error: 'الاسم ووسيلة التواصل مطلوبين' }, { status: 400 });
  }

  recordSubmission(ip);

  try {
    await ensureSchema();
    const item = await addConsultation({
      name: body.name,
      company: body.company,
      website: body.website,
      current_system: body.current_system,
      sector: body.sector,
      features: Array.isArray(body.features) ? body.features.join(' | ') : body.features,
      goal: body.goal,
      budget: body.budget,
      timeline: body.timeline,
      notes: body.notes,
      contact: body.contact,
      locale: body.locale || 'ar',
      source_page: body.source_page,
    });
    return NextResponse.json({ item });
  } catch {
    // حتى لو قاعدة البيانات مش متصلة، منمنعش الإرسال عبر الإيميل من الفشل
    return NextResponse.json({ ok: true, warning: 'db_unavailable' });
  }
}

export async function PATCH(request) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }
  const { id, status } = await request.json();
  const item = await updateConsultationStatus(id, status);
  return NextResponse.json({ item });
}

export async function DELETE(request) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }
  const { id } = await request.json();
  await deleteConsultation(id);
  return NextResponse.json({ ok: true });
}
