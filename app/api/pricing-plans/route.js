import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import {
  getPricingPlans,
  addPricingPlan,
  updatePricingPlan,
  deletePricingPlan,
  ensureSchema,
} from '@/lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'ar';
  try {
    const items = await getPricingPlans(locale);
    return NextResponse.json({ items });
  } catch {
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
  const item = await addPricingPlan(body);
  return NextResponse.json({ item });
}

export async function PUT(request) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }
  const body = await request.json();
  const item = await updatePricingPlan(body.id, body);
  return NextResponse.json({ item });
}

export async function DELETE(request) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }
  const { id } = await request.json();
  await deletePricingPlan(id);
  return NextResponse.json({ ok: true });
}
