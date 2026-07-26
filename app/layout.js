import './globals.css';
import { getSettings } from '@/lib/db';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://amvora.vercel.app';

export async function generateMetadata() {
  let verificationCode = '';
  try {
    const settings = await getSettings();
    verificationCode = settings.search_console_verification || '';
  } catch {
    verificationCode = '';
  }

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: 'Amvora | هندسة المنصات الرقمية المخصصة',
      template: '%s | Amvora',
    },
    description:
      'وكالة Amvora تبني بنيات برمجية مخصصة كلياً بكود نظيف: مواقع تعريفية للمهنيين وأصحاب الأعمال (أطباء، مهندسين، مطاعم)، عقارات، متاجر إلكترونية، وتكامل بوابات دفع - بأداء سريع واستقرار كامل.',
    keywords: ['تصميم مواقع', 'برمجة مواقع', 'موقع تعريفي', 'متاجر إلكترونية', 'وكالة رقمية', 'Amvora', 'تطوير ويب مصر'],
    openGraph: {
      title: 'Amvora | هندسة المنصات الرقمية المخصصة',
      description: 'نهندس المنصات الرقمية المخصصة باستقرار برمجي كامل.',
      url: siteUrl,
      siteName: 'Amvora',
      locale: 'ar_EG',
      type: 'website',
      images: [
        {
          url: 'https://cdn.phototourl.com/free/2026-06-24-0aa1f689-c330-4cb3-aea7-37a383ae0fb7.png',
          width: 512,
          height: 512,
          alt: 'Amvora',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Amvora | هندسة المنصات الرقمية المخصصة',
      description: 'نهندس المنصات الرقمية المخصصة باستقرار برمجي كامل.',
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: siteUrl,
      languages: {
        'ar-EG': siteUrl,
        en: `${siteUrl}/en`,
        'x-default': siteUrl,
      },
    },
    ...(verificationCode ? { verification: { google: verificationCode } } : {}),
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=El+Messiri:wght@500;700;800;900&family=Almarai:wght@400;700;800&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      </head>
      <body className="font-body text-gray-800 antialiased overflow-x-hidden bg-white">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:right-2 focus:z-[100] focus:bg-gold focus:text-black focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold">
          تخطَّ إلى المحتوى الرئيسي
        </a>
        {children}
      </body>
    </html>
  );
}
