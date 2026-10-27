import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import {
  getBlogPosts,
  getAllBlogPostsAdmin,
  addBlogPost,
  updateBlogPost,
  deleteBlogPost,
  ensureSchema,
} from '@/lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  try {
    if (searchParams.get('all') === '1') {
      const session = await getSession();
      if (!session.isLoggedIn) {
        return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
      }
      const items = await getAllBlogPostsAdmin();
      return NextResponse.json({ items });
    }
    const locale = searchParams.get('locale') || 'ar';
    const items = await getBlogPosts(locale);
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
  if (!body.title || !body.content) {
    return NextResponse.json({ error: 'العنوان والمحتوى مطلوبين' }, { status: 400 });
  }
  const slug = (body.slug || body.title)
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^\u0621-\u064Aa-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 80);
  await ensureSchema();
  const item = await addBlogPost({ ...body, slug: slug || `post-${Date.now()}` });
  return NextResponse.json({ item });
}

export async function PUT(request) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }
  const body = await request.json();
  const item = await updateBlogPost(body.id, body);
  return NextResponse.json({ item });
}

export async function DELETE(request) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }
  const { id } = await request.json();
  await deleteBlogPost(id);
  return NextResponse.json({ ok: true });
}
