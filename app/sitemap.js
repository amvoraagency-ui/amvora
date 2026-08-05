import { getBlogPosts } from '@/lib/db';

export default async function sitemap() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://amvora.vercel.app';

  const staticPages = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/en`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${siteUrl}/en/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${siteUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/en/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/en/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  let blogPages = [];
  try {
    const [arPosts, enPosts] = await Promise.all([getBlogPosts('ar'), getBlogPosts('en')]);
    blogPages = [
      ...arPosts.map((p) => ({
        url: `${siteUrl}/blog/${p.slug}`,
        lastModified: new Date(p.created_at),
        changeFrequency: 'monthly',
        priority: 0.6,
      })),
      ...enPosts.map((p) => ({
        url: `${siteUrl}/en/blog/${p.slug}`,
        lastModified: new Date(p.created_at),
        changeFrequency: 'monthly',
        priority: 0.5,
      })),
    ];
  } catch {
    blogPages = [];
  }

  return [...staticPages, ...blogPages];
}
