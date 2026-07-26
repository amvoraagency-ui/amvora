import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getSession } from '@/lib/session';
import { getAdminPasswordHash, ensureSchema } from '@/lib/db';

// حماية أساسية best-effort من محاولات تخمين كلمة السر المتكررة
const attempts = new Map();
const WINDOW_MS = 10 * 60 * 1000; // 10 دقايق
const MAX_ATTEMPTS = 5;

function isLockedOut(ip) {
  const now = Date.now();
  const timestamps = (attempts.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  return timestamps.length >= MAX_ATTEMPTS;
}
function recordAttempt(ip) {
  const now = Date.now();
  const timestamps = (attempts.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  timestamps.push(now);
  attempts.set(ip, timestamps);
}

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  if (isLockedOut(ip)) {
    return NextResponse.json({ error: 'محاولات دخول كتيرة جداً، حاول تاني بعد ١٠ دقايق' }, { status: 429 });
  }

  const { username, password } = await request.json();

  const validUsername = process.env.ADMIN_USERNAME;
  if (!validUsername) {
    return NextResponse.json(
      { error: 'الخادم غير مهيأ بعد. تأكد من إضافة ADMIN_USERNAME في إعدادات Vercel.' },
      { status: 500 }
    );
  }

  let validPasswordHash;
  try {
    await ensureSchema();
    validPasswordHash = await getAdminPasswordHash();
  } catch (err) {
    return NextResponse.json(
      { error: 'تعذر الاتصال بقاعدة البيانات. تأكد من ربط Vercel Postgres.' },
      { status: 500 }
    );
  }

  if (!validPasswordHash) {
    return NextResponse.json(
      { error: 'لم يتم تعيين كلمة سر بعد. أضف ADMIN_PASSWORD_HASH في إعدادات Vercel أولاً.' },
      { status: 500 }
    );
  }

  if (username !== validUsername) {
    recordAttempt(ip);
    return NextResponse.json({ error: 'بيانات الدخول غير صحيحة' }, { status: 401 });
  }

  const passwordMatches = await bcrypt.compare(password, validPasswordHash);
  if (!passwordMatches) {
    recordAttempt(ip);
    return NextResponse.json({ error: 'بيانات الدخول غير صحيحة' }, { status: 401 });
  }

  const session = await getSession();
  session.isLoggedIn = true;
  session.username = username;
  await session.save();

  return NextResponse.json({ ok: true });
}
