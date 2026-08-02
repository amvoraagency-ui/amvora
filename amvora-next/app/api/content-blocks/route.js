import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import {
  getContentBlocks,
  addContentBlock,
  updateContentBlock,
  deleteContentBlock,
  ensureSchema,
} from '@/lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const section = searchParams.get('section');
  const locale = searchParams.get('locale') || 'ar';
  if (!section) {
    return NextResponse.json({ error: 'section مطلوب' }, { status: 400 });
  }
  try {
    const items = await getContentBlocks(section, locale);
    return NextResponse.json({ items });
  } catch (err) {
    return NextResponse.json({ items: [] }, { status: 200 });
  }
}

export async function POST(request) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }
  const body = await request.json();
  await ensureSchema();
  const item = await addContentBlock(body);
  return NextResponse.json({ item });
}

export async function PUT(request) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }
  const body = await request.json();
  const item = await updateContentBlock(body.id, body);
  return NextResponse.json({ item });
}

export async function DELETE(request) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }
  const { id } = await request.json();
  await deleteContentBlock(id);
  return NextResponse.json({ ok: true });
}
