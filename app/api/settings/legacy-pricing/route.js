import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getRawSettingsKeys } from '@/lib/db';

const LEGACY_KEYS = [
  'price_basic', 'price_pro', 'price_premium',
  'price_basic_tagline', 'price_basic_tagline_en', 'price_basic_features', 'price_basic_features_en',
  'price_pro_tagline', 'price_pro_tagline_en', 'price_pro_features', 'price_pro_features_en',
  'price_premium_tagline', 'price_premium_tagline_en', 'price_premium_features', 'price_premium_features_en',
];

export async function GET() {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }
  try {
    const raw = await getRawSettingsKeys(LEGACY_KEYS);
    // Only counts as "real legacy data" if the admin actually saved a tagline/features value before -
    // price_basic/pro/premium alone are excluded here since they still power other harmless fallbacks.
    const hasRealData = Boolean(
      raw.price_basic_tagline || raw.price_basic_features ||
      raw.price_pro_tagline || raw.price_pro_features ||
      raw.price_premium_tagline || raw.price_premium_features
    );
    return NextResponse.json({ hasLegacyData: hasRealData, raw: hasRealData ? raw : null });
  } catch {
    return NextResponse.json({ hasLegacyData: false, raw: null });
  }
}
