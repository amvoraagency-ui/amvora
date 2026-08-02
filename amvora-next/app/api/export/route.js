import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import {
  getPortfolioItems,
  getAllTestimonialsAdmin,
  getSettings,
  getAllFaqsAdmin,
  getHeroSlides,
  getContentBlocks,
} from '@/lib/db';

export async function GET() {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  try {
    const [portfolio, testimonials, settings, faqs, heroSlides, reality, strategicValue, specialties, process_, realityEn, strategicValueEn, specialtiesEn, processEn] = await Promise.all([
      getPortfolioItems(),
      getAllTestimonialsAdmin(),
      getSettings(),
      getAllFaqsAdmin(),
      getHeroSlides(),
      getContentBlocks('reality', 'ar'),
      getContentBlocks('strategic_value', 'ar'),
      getContentBlocks('specialties', 'ar'),
      getContentBlocks('process', 'ar'),
      getContentBlocks('reality', 'en'),
      getContentBlocks('strategic_value', 'en'),
      getContentBlocks('specialties', 'en'),
      getContentBlocks('process', 'en'),
    ]);

    const backup = {
      exported_at: new Date().toISOString(),
      note: 'نسخة احتياطية من بيانات موقع Amvora - لا تحتوي على كلمة السر (مشفرة ومحفوظة بأمان في قاعدة البيانات فقط)',
      portfolio,
      testimonials,
      settings: { ...settings, admin_password_hash: undefined },
      faqs,
      heroSlides,
      contentBlocks: { reality, strategicValue, specialties, process: process_, realityEn, strategicValueEn, specialtiesEn, processEn },
    };

    return new NextResponse(JSON.stringify(backup, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="amvora-backup-${new Date().toISOString().slice(0, 10)}.json"`,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: 'تعذر إنشاء النسخة الاحتياطية' }, { status: 500 });
  }
}
