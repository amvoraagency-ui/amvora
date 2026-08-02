import { NextResponse } from 'next/server';
import { getTestimonialByToken, updateTestimonialByToken, deleteTestimonialByToken } from '@/lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  if (!token) return NextResponse.json({ error: 'رمز غير صالح' }, { status: 400 });
  const item = await getTestimonialByToken(token);
  if (!item) return NextResponse.json({ error: 'لم يتم العثور على الرأي' }, { status: 404 });
  return NextResponse.json({ item });
}

export async function PUT(request) {
  const { token, name, role, quote, rating } = await request.json();
  if (!token) return NextResponse.json({ error: 'رمز غير صالح' }, { status: 400 });
  const existing = await getTestimonialByToken(token);
  if (!existing) return NextResponse.json({ error: 'لم يتم العثور على الرأي' }, { status: 404 });
  const safeRating = Math.min(5, Math.max(1, parseInt(rating, 10) || 5));
  const item = await updateTestimonialByToken(token, { name, role, quote, rating: safeRating });
  return NextResponse.json({ item });
}

export async function DELETE(request) {
  const { token } = await request.json();
  if (!token) return NextResponse.json({ error: 'رمز غير صالح' }, { status: 400 });
  const existing = await getTestimonialByToken(token);
  if (!existing) return NextResponse.json({ error: 'لم يتم العثور على الرأي' }, { status: 404 });
  await deleteTestimonialByToken(token);
  return NextResponse.json({ ok: true });
}
