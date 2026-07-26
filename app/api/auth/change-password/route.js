import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getSession } from '@/lib/session';
import { setAdminPasswordHash } from '@/lib/db';

export async function POST(request) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  const { newPassword } = await request.json();
  if (!newPassword || newPassword.length < 8) {
    return NextResponse.json({ error: 'كلمة السر لازم تكون 8 أحرف على الأقل' }, { status: 400 });
  }

  const hash = bcrypt.hashSync(newPassword, 10);
  await setAdminPasswordHash(hash);

  return NextResponse.json({ ok: true });
}
