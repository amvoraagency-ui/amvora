import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getTestimonials, getAllTestimonialsAdmin, addTestimonial, deleteTestimonial, approveTestimonial, updateTestimonialAdmin, ensureSchema } from '@/lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  try {
    if (searchParams.get('all') === '1') {
      const session = await getSession();
      if (!session.isLoggedIn) {
        return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
      }
      const items = await getAllTestimonialsAdmin();
      return NextResponse.json({ items });
    }
    const items = await getTestimonials();
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
  const item = await addTestimonial(body);
  return NextResponse.json({ item });
}

export async function PUT(request) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }
  const body = await request.json();
  if (body.approvalOnly) {
    await approveTestimonial(body.id, body.approved);
    return NextResponse.json({ ok: true });
  }
  const item = await updateTestimonialAdmin(body.id, body);
  return NextResponse.json({ item });
}

export async function DELETE(request) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }
  const { id } = await request.json();
  await deleteTestimonial(id);
  return NextResponse.json({ ok: true });
}
