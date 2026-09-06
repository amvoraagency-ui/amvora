import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getTrash, restoreTrashItem, permanentlyDeleteTrashItem, ensureSchema } from '@/lib/db';

export async function GET() {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  try {
    await ensureSchema();
    const items = await getTrash();
    return NextResponse.json({ items });
  } catch (err) {
    return NextResponse.json({ items: [], error: 'تعذر تحميل سلة المهملات' }, { status: 200 });
  }
}

export async function POST(request) {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  const { type, id } = await request.json();
  try {
    await restoreTrashItem(type, id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'تعذر الاسترجاع' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  const { type, id } = await request.json();
  try {
    await permanentlyDeleteTrashItem(type, id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'تعذر الحذف النهائي' }, { status: 500 });
  }
}
