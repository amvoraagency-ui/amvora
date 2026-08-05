import { neon } from '@neondatabase/serverless';

// نستخدم رابط وهمي شكلياً فقط لو POSTGRES_URL لسه مش متظبط، عشان البناء (build) ينجح
// حتى قبل ربط قاعدة البيانات. أي استعلام فعلي هيفشل برسالة واضحة يلتقطها try/catch
// في كل مكان بيستخدم الدالة دي، مش هيوقف الموقع كله.
const sql = neon(process.env.POSTGRES_URL || 'postgresql://placeholder:placeholder@localhost/placeholder');

export async function ensureSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS portfolio_items (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      tag TEXT,
      image_url TEXT,
      link_url TEXT,
      pinned BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  await sql`ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS pinned BOOLEAN DEFAULT FALSE;`;

  await sql`
    CREATE TABLE IF NOT EXISTS testimonials (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT,
      quote TEXT NOT NULL,
      rating INTEGER DEFAULT 5,
      edit_token TEXT,
      approved BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  await sql`ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS rating INTEGER DEFAULT 5;`;
  await sql`ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS edit_token TEXT;`;
  await sql`ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT TRUE;`;

  await sql`
    CREATE TABLE IF NOT EXISTS faqs (
      id SERIAL PRIMARY KEY,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      locale TEXT NOT NULL DEFAULT 'ar',
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  await sql`ALTER TABLE faqs ADD COLUMN IF NOT EXISTS locale TEXT NOT NULL DEFAULT 'ar';`;

  await sql`
    CREATE TABLE IF NOT EXISTS hero_slides (
      id SERIAL PRIMARY KEY,
      image_url TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id SERIAL PRIMARY KEY,
      slug TEXT NOT NULL,
      locale TEXT NOT NULL DEFAULT 'ar',
      title TEXT NOT NULL,
      excerpt TEXT,
      content TEXT NOT NULL,
      cover_image TEXT,
      published BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS content_blocks (
      id SERIAL PRIMARY KEY,
      section TEXT NOT NULL,
      locale TEXT NOT NULL DEFAULT 'ar',
      icon TEXT,
      title TEXT NOT NULL,
      body TEXT,
      body2 TEXT,
      tag TEXT,
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  await sql`ALTER TABLE content_blocks ADD COLUMN IF NOT EXISTS locale TEXT NOT NULL DEFAULT 'ar';`;

  await sql`
    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `;
}

/* ---------------- Blog ---------------- */
export async function getBlogPosts(locale = 'ar') {
  const rows = await sql`
    SELECT * FROM blog_posts WHERE locale = ${locale} AND published = TRUE ORDER BY created_at DESC;
  `;
  return rows;
}
export async function getAllBlogPostsAdmin() {
  const rows = await sql`SELECT * FROM blog_posts ORDER BY created_at DESC;`;
  return rows;
}
export async function getBlogPostBySlug(slug, locale = 'ar') {
  const rows = await sql`SELECT * FROM blog_posts WHERE slug = ${slug} AND locale = ${locale} AND published = TRUE;`;
  return rows[0] || null;
}
export async function addBlogPost({ slug, locale, title, excerpt, content, cover_image, published }) {
  const rows = await sql`
    INSERT INTO blog_posts (slug, locale, title, excerpt, content, cover_image, published)
    VALUES (${slug}, ${locale || 'ar'}, ${title}, ${excerpt}, ${content}, ${cover_image}, ${published !== undefined ? published : true})
    RETURNING *;
  `;
  return rows[0];
}
export async function updateBlogPost(id, { slug, title, excerpt, content, cover_image, published }) {
  const rows = await sql`
    UPDATE blog_posts
    SET slug = ${slug}, title = ${title}, excerpt = ${excerpt}, content = ${content}, cover_image = ${cover_image}, published = ${published !== undefined ? published : true}
    WHERE id = ${id}
    RETURNING *;
  `;
  return rows[0];
}
export async function deleteBlogPost(id) {
  await sql`DELETE FROM blog_posts WHERE id = ${id};`;
}

/* ---------------- Content Blocks (editable static marketing sections) ---------------- */
export async function getContentBlocks(section, locale = 'ar') {
  const rows = await sql`
    SELECT * FROM content_blocks WHERE section = ${section} AND locale = ${locale} ORDER BY sort_order ASC, id ASC;
  `;
  return rows;
}
export async function addContentBlock({ section, locale, icon, title, body, body2, tag, sort_order }) {
  const rows = await sql`
    INSERT INTO content_blocks (section, locale, icon, title, body, body2, tag, sort_order)
    VALUES (${section}, ${locale || 'ar'}, ${icon}, ${title}, ${body}, ${body2}, ${tag}, ${sort_order || 0})
    RETURNING *;
  `;
  return rows[0];
}
export async function updateContentBlock(id, { icon, title, body, body2, tag, sort_order }) {
  const rows = await sql`
    UPDATE content_blocks
    SET icon = ${icon}, title = ${title}, body = ${body}, body2 = ${body2}, tag = ${tag}, sort_order = ${sort_order || 0}
    WHERE id = ${id}
    RETURNING *;
  `;
  return rows[0];
}
export async function deleteContentBlock(id) {
  await sql`DELETE FROM content_blocks WHERE id = ${id};`;
}

/* ---------------- Portfolio ---------------- */
export async function getPortfolioItems() {
  const rows = await sql`SELECT * FROM portfolio_items ORDER BY pinned DESC, created_at DESC;`;
  return rows;
}
export async function addPortfolioItem({ title, description, tag, image_url, link_url }) {
  const rows = await sql`
    INSERT INTO portfolio_items (title, description, tag, image_url, link_url)
    VALUES (${title}, ${description}, ${tag}, ${image_url}, ${link_url})
    RETURNING *;
  `;
  return rows[0];
}
export async function updatePortfolioItem(id, { title, description, tag, image_url, link_url }) {
  const rows = await sql`
    UPDATE portfolio_items
    SET title = ${title}, description = ${description}, tag = ${tag}, image_url = ${image_url}, link_url = ${link_url}
    WHERE id = ${id}
    RETURNING *;
  `;
  return rows[0];
}
export async function togglePinPortfolioItem(id, pinned) {
  await sql`UPDATE portfolio_items SET pinned = ${pinned} WHERE id = ${id};`;
}
export async function deletePortfolioItem(id) {
  await sql`DELETE FROM portfolio_items WHERE id = ${id};`;
}

/* ---------------- Testimonials ---------------- */
export async function getTestimonials() {
  const rows = await sql`
    SELECT id, name, role, quote, rating, created_at
    FROM testimonials WHERE approved = TRUE ORDER BY created_at DESC;
  `;
  return rows;
}
export async function getAllTestimonialsAdmin() {
  const rows = await sql`SELECT * FROM testimonials ORDER BY created_at DESC;`;
  return rows;
}
export async function addTestimonial({ name, role, quote, rating, edit_token, approved }) {
  const rows = await sql`
    INSERT INTO testimonials (name, role, quote, rating, edit_token, approved)
    VALUES (${name}, ${role}, ${quote}, ${rating || 5}, ${edit_token}, ${approved !== undefined ? approved : true})
    RETURNING *;
  `;
  return rows[0];
}
export async function approveTestimonial(id, approved) {
  await sql`UPDATE testimonials SET approved = ${approved} WHERE id = ${id};`;
}
export async function updateTestimonialAdmin(id, { name, role, quote, rating }) {
  const rows = await sql`
    UPDATE testimonials
    SET name = ${name}, role = ${role}, quote = ${quote}, rating = ${rating || 5}
    WHERE id = ${id}
    RETURNING *;
  `;
  return rows[0];
}
export async function getTestimonialByToken(token) {
  const rows = await sql`SELECT * FROM testimonials WHERE edit_token = ${token};`;
  return rows[0] || null;
}
export async function updateTestimonialByToken(token, { name, role, quote, rating }) {
  const rows = await sql`
    UPDATE testimonials
    SET name = ${name}, role = ${role}, quote = ${quote}, rating = ${rating || 5}, approved = FALSE
    WHERE edit_token = ${token}
    RETURNING *;
  `;
  return rows[0];
}
export async function deleteTestimonialByToken(token) {
  await sql`DELETE FROM testimonials WHERE edit_token = ${token};`;
}
export async function deleteTestimonial(id) {
  await sql`DELETE FROM testimonials WHERE id = ${id};`;
}

/* ---------------- FAQs ---------------- */
export async function getFaqs(locale = 'ar') {
  const rows = await sql`SELECT * FROM faqs WHERE locale = ${locale} ORDER BY sort_order ASC, created_at ASC;`;
  return rows;
}
export async function getAllFaqsAdmin() {
  const rows = await sql`SELECT * FROM faqs ORDER BY locale ASC, sort_order ASC, created_at ASC;`;
  return rows;
}
export async function addFaq({ question, answer, locale, sort_order }) {
  const rows = await sql`
    INSERT INTO faqs (question, answer, locale, sort_order)
    VALUES (${question}, ${answer}, ${locale || 'ar'}, ${sort_order || 0})
    RETURNING *;
  `;
  return rows[0];
}
export async function updateFaq(id, { question, answer, sort_order }) {
  const rows = await sql`
    UPDATE faqs SET question = ${question}, answer = ${answer}, sort_order = ${sort_order || 0}
    WHERE id = ${id}
    RETURNING *;
  `;
  return rows[0];
}
export async function deleteFaq(id) {
  await sql`DELETE FROM faqs WHERE id = ${id};`;
}

/* ---------------- Hero Slides ---------------- */
export async function getHeroSlides() {
  const rows = await sql`SELECT * FROM hero_slides ORDER BY sort_order ASC, created_at ASC;`;
  return rows;
}
export async function addHeroSlide({ image_url, sort_order }) {
  const rows = await sql`
    INSERT INTO hero_slides (image_url, sort_order)
    VALUES (${image_url}, ${sort_order || 0})
    RETURNING *;
  `;
  return rows[0];
}
export async function deleteHeroSlide(id) {
  await sql`DELETE FROM hero_slides WHERE id = ${id};`;
}

/* ---------------- Settings (key-value, holds all editable text + config) ---------------- */
const DEFAULT_SETTINGS = {
  whatsapp_number: '201000446294',
  contact_email: '',
  price_basic: 'تبدأ من $XXX',
  price_pro: 'تبدأ من $XXX',
  price_premium: 'حسب المشروع',
  facebook_url: '',
  instagram_url: '',
  linkedin_url: '',
  ga_measurement_id: '',
  search_console_verification: '',
  privacy_updated_ar: '30 يوليو 2026',
  privacy_updated_en: 'July 30, 2026',
  calendly_url: '',
  stat_projects: '',
  stat_years: '',
  stat_satisfaction: '',
  stat_support: '',
  ticker_text: 'استشارة أولية مجانية عبر الواتساب  •  دعم فني بعد التسليم  •  تكامل بوابات الدفع والتقسيط  •  تصميم متجاوب بالكامل',
  ticker_text_en: 'Free initial consultation on WhatsApp  •  Post-delivery support  •  Payment gateway integration  •  Fully responsive design',
  vip_title: 'نادي عملاء Amvora VIP',
  vip_text: 'شركاؤنا الدائمون والمرشحون من عملائنا يحصلون على أولوية في جدول استلام وتنفيذ المشاريع، بالإضافة إلى استشارات فنية ممتدة.',
  hero_title: 'نهندس المنصات الرقمية المخصصة باستقرار برمجي كامل.',
  hero_subtitle: 'في وكالة Amvora، نبني بنيات برمجية مخصصة كلياً بكود نظيف، مصممة تقنياً لتوفير تجربة تصفح سريعة تضمن استقرار ونمو أعمالكم الرقمية.',
  hero_subtitle2: 'موقعك هو أول انطباع يأخذه عميلك عنك قبل ما يكلمك - خليه يعكس مستوى شغلك الحقيقي.',
  about_title: 'وكالة ناشئة، بمعايير احترافية من أول مشروع',
  about_text1: 'Amvora وكالة رقمية بدأت لتقديم حل حقيقي لمشكلة واضحة: أغلب المنصات الجاهزة بتضحي بالسرعة والاستقرار مقابل السهولة. إحنا بنركز كل مشروع على بنية تقنية نظيفة من الأول، مع إدارة كاملة للمتطلبات من فهم الفكرة لحد التسليم والدعم الفني.',
  about_text2: 'نتعامل مع كل مشروع كشراكة طويلة المدى، مش مجرد تسليم وخلاص.',
};

export async function getSettings() {
  const rows = await sql`SELECT key, value FROM site_settings;`;
  const settings = { ...DEFAULT_SETTINGS };
  for (const row of rows) {
    settings[row.key] = row.value;
  }
  return settings;
}

export async function updateSetting(key, value) {
  await sql`
    INSERT INTO site_settings (key, value)
    VALUES (${key}, ${value})
    ON CONFLICT (key) DO UPDATE SET value = ${value};
  `;
}

/* ---------------- Admin password (stored in DB so it's editable from the dashboard) ---------------- */
export async function getAdminPasswordHash() {
  const rows = await sql`SELECT value FROM site_settings WHERE key = 'admin_password_hash';`;
  return rows[0] ? rows[0].value : null;
}

// يستخدم كـ"مفتاح احتياطي" دايماً شغال حتى لو غيّرت كلمة السر من اللوحة - علشان لو نسيت كلمة السر الجديدة تقدر تدخل بالقيمة الأصلية اللي في متغيرات Vercel
export function getEnvPasswordHash() {
  return process.env.ADMIN_PASSWORD_HASH || null;
}

export async function setAdminPasswordHash(hash) {
  await updateSetting('admin_password_hash', hash);
}
