import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import {
  getPortfolioItems,
  addPortfolioItem,
  updatePortfolioItem,
  togglePinPortfolioItem,
  deletePortfolioItem,
  ensureSchema,
} from '@/lib/db';

export async function GET() {
  try {
    const items = await getPortfolioItems();
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
  const item = await addPortfolioItem(body);
  return NextResponse.json({ item });
}

export async function PUT(request) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }
  const body = await request.json();
  if (body.action === 'pin') {
    await togglePinPortfolioItem(body.id, body.pinned);
    return NextResponse.json({ ok: true });
  }
  const item = await updatePortfolioItem(body.id, body);
  return NextResponse.json({ item });
}

export async function DELETE(request) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }
  const { id } = await request.json();
  await deletePortfolioItem(id);
  return NextResponse.json({ ok: true });
}
