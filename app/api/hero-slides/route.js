import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getHeroSlides, addHeroSlide, deleteHeroSlide, ensureSchema } from '@/lib/db';

export async function GET() {
  try {
    const items = await getHeroSlides();
    return NextResponse.json({ items });
  } catch (err) {
    return NextResponse.json({ items: [], error: 'قاعدة البيانات غير متصلة بعد' }, { status: 200 });
  }
}

export async function POST(request) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }
  const body = await request.json();
  await ensureSchema();
  const item = await addHeroSlide(body);
  return NextResponse.json({ item });
}

export async function DELETE(request) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }
  const { id } = await request.json();
  await deleteHeroSlide(id);
  return NextResponse.json({ ok: true });
}
