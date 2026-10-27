import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import {
  addJobApplication,
  getJobApplications,
  updateJobApplicationStatus,
  deleteJobApplication,
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
    const items = await getJobApplications();
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

  // Honeypot
  if (body.website_url) {
    return NextResponse.json({ ok: true });
  }

  if (!body.name || !body.email) {
    return NextResponse.json({ error: 'الاسم والإيميل مطلوبين' }, { status: 400 });
  }

  recordSubmission(ip);

  try {
    await ensureSchema();
    const item = await addJobApplication({
      name: body.name,
      email: body.email,
      phone: body.phone,
      positions: Array.isArray(body.positions) ? body.positions.join(' | ') : body.positions,
      experience_years: body.experience_years,
      cairo_resident: body.cairo_resident,
      expected_salary: body.expected_salary,
      graduation_year: body.graduation_year,
      can_start_immediately: body.can_start_immediately,
      linkedin: body.linkedin,
      notes: body.notes,
      locale: body.locale || 'ar',
    });
    return NextResponse.json({ item });
  } catch {
    return NextResponse.json({ ok: true, warning: 'db_unavailable' });
  }
}

export async function PATCH(request) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }
  const { id, status } = await request.json();
  const item = await updateJobApplicationStatus(id, status);
  return NextResponse.json({ item });
}

export async function DELETE(request) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }
  const { id } = await request.json();
  await deleteJobApplication(id);
  return NextResponse.json({ ok: true });
}
