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

function slugify(text) {
  return (text || '')
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^\u0621-\u064Aa-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 80);
}

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
  const slug = slugify(body.slug || body.title) || `project-${Date.now()}`;
  const item = await addPortfolioItem({ ...body, slug });
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
  const slug = slugify(body.slug || body.title) || `project-${body.id}`;
  const item = await updatePortfolioItem(body.id, { ...body, slug });
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
