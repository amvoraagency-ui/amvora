import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getSettings, updateSetting, ensureSchema } from '@/lib/db';

export async function GET() {
  try {
    const settings = await getSettings();
    return NextResponse.json({ settings });
  } catch (err) {
    return NextResponse.json({ settings: {} }, { status: 200 });
  }
}

export async function POST(request) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }
  const updates = await request.json();
  await ensureSchema();
  for (const [key, value] of Object.entries(updates)) {
    await updateSetting(key, value);
  }
  return NextResponse.json({ ok: true });
}
