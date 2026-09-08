import { neon } from '@neondatabase/serverless';

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
      deleted_at TIMESTAMPTZ DEFAULT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  await sql`ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS pinned BOOLEAN DEFAULT FALSE;`;
  await sql`ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;`;
  await sql`ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS slug TEXT;`;
  await sql`ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS full_description TEXT;`;
  await sql`ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS client_name TEXT;`;
  await sql`ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS services TEXT;`;
  await sql`ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS project_date TEXT;`;
  await sql`ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS gallery TEXT;`;

  await sql`
    CREATE TABLE IF NOT EXISTS testimonials (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT,
      quote TEXT NOT NULL,
      rating INTEGER DEFAULT 5,
      edit_token TEXT,
      approved BOOLEAN DEFAULT TRUE,
      deleted_at TIMESTAMPTZ DEFAULT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  await sql`ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS rating INTEGER DEFAULT 5;`;
  await sql`ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS edit_token TEXT;`;
  await sql`ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT TRUE;`;
  await sql`ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;`;

  await sql`
    CREATE TABLE IF NOT EXISTS faqs (
      id SERIAL PRIMARY KEY,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      locale TEXT NOT NULL DEFAULT 'ar',
      sort_order INTEGER DEFAULT 0,
      deleted_at TIMESTAMPTZ DEFAULT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  await sql`ALTER TABLE faqs ADD COLUMN IF NOT EXISTS locale TEXT NOT NULL DEFAULT 'ar';`;
  await sql`ALTER TABLE faqs ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;`;

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
      deleted_at TIMESTAMPTZ DEFAULT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  await sql`ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;`;
  await sql`ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS category TEXT;`;
  await sql`ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;`;
  await sql`ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS author TEXT;`;

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
      deleted_at TIMESTAMPTZ DEFAULT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  await sql`ALTER TABLE content_blocks ADD COLUMN IF NOT EXISTS locale TEXT NOT NULL DEFAULT 'ar';`;
  await sql`ALTER TABLE content_blocks ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;`;

  await sql`
    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS pricing_plans (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      price TEXT,
      tagline TEXT,
      features TEXT,
      highlighted BOOLEAN DEFAULT FALSE,
      locale TEXT NOT NULL DEFAULT 'ar',
      sort_order INTEGER DEFAULT 0,
      deleted_at TIMESTAMPTZ DEFAULT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  await sql`ALTER TABLE pricing_plans ADD COLUMN IF NOT EXISTS section TEXT;`;

  if (existingPlans[0].count === 0) {
    await sql`
      INSERT INTO pricing_plans (name, price, tagline, features, highlighted, locale, sort_order) VALUES
      ('الأساسية', 'تبدأ من $XXX', 'مثالي للمهنيين وأصحاب الأعمال الصغيرة اللي عايزين حضور رقمي احترافي بسرعة.', 'موقع تعريفي احترافي متجاوب بالكامل
تصميم مخصص يعكس هويتك البصرية
نموذج تواصل وطلب استشارة مدمج
تحسين أساسي لمحركات البحث (SEO)
ربط بحسابات السوشيال ميديا
دعم فني لمدة شهر بعد التسليم', false, 'ar', 0),
      ('الاحترافية', 'تبدأ من $XXX', 'الأنسب للمتاجر الإلكترونية والشركات العقارية اللي محتاجة نظام متكامل.', 'كل مميزات الباقة الأساسية
لوحة تحكم لإدارة المحتوى بنفسك
متجر إلكتروني أو نظام عرض مشاريع متكامل
ربط بوابة دفع إلكتروني
تكامل مع أدوات التحليل (Google Analytics)
تحسين متقدم لمحركات البحث
دعم فني لمدة 3 شهور بعد التسليم', true, 'ar', 1),
      ('المتكاملة', 'حسب المشروع', 'حلول مخصصة بالكامل للشركات اللي محتاجة أنظمة أو تكاملات خاصة.', 'كل مميزات الباقة الاحترافية
تطوير أنظمة وميزات مخصصة حسب احتياجك (حجز، عضويات، تتبع طلبات)
تكامل برمجي مع أنظمة خارجية (ERP/CRM أو بوابات دفع خاصة)
إعداد بنية تحتية واستضافة متقدمة
استشارة تسويق رقمي ومحتوى
دعم فني ممتد وأولوية في الجدولة', false, 'ar', 2),
      ('Essentials', 'Starting at $XXX', 'Ideal for professionals and small businesses who want a fast, credible digital presence.', 'Fully responsive, professional profile website
Custom design reflecting your visual identity
Built-in contact & consultation request form
Basic search engine optimization (SEO)
Social media account linking
1 month of technical support after delivery', false, 'en', 0),
      ('Professional', 'Starting at $XXX', 'Best fit for e-commerce stores and real estate businesses needing a full system.', 'Everything in the Essentials package
Self-service content management dashboard
Full e-commerce store or project showcase system
Payment gateway integration
Analytics integration (Google Analytics)
Advanced search engine optimization
3 months of technical support after delivery', true, 'en', 1),
      ('Integrated', 'Project-based', 'Fully custom solutions for companies needing special systems or integrations.', 'Everything in the Professional package
Custom systems and features built for your needs (booking, memberships, order tracking)
Technical integration with external systems (ERP/CRM or special payment gateways)
Advanced infrastructure and hosting setup
Digital marketing & content consultation
Extended support with priority scheduling', false, 'en', 2);
    `;
  }

  await sql`
    CREATE TABLE IF NOT EXISTS consultations (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      company TEXT,
      website TEXT,
      current_system TEXT,
      sector TEXT,
      features TEXT,
      goal TEXT,
      budget TEXT,
      timeline TEXT,
      notes TEXT,
      contact TEXT NOT NULL,
      locale TEXT NOT NULL DEFAULT 'ar',
      source_page TEXT,
      status TEXT NOT NULL DEFAULT 'new',
      deleted_at TIMESTAMPTZ DEFAULT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
}

export async function getBlogPosts(locale = 'ar') {
  const rows = await sql`SELECT * FROM blog_posts WHERE locale = ${locale} AND published = TRUE AND deleted_at IS NULL ORDER BY featured DESC, created_at DESC;`;
  return rows;
}
export async function getAllBlogPostsAdmin() {
  const rows = await sql`SELECT * FROM blog_posts WHERE deleted_at IS NULL ORDER BY featured DESC, created_at DESC;`;
  return rows;
}
export async function getBlogPostBySlug(slug, locale = 'ar') {
  const rows = await sql`SELECT * FROM blog_posts WHERE slug = ${slug} AND locale = ${locale} AND published = TRUE AND deleted_at IS NULL;`;
  return rows[0] || null;
}
export async function addBlogPost({ slug, locale, title, excerpt, content, cover_image, published, category, featured, author }) {
  const rows = await sql`
    INSERT INTO blog_posts (slug, locale, title, excerpt, content, cover_image, published, category, featured, author)
    VALUES (${slug}, ${locale || 'ar'}, ${title}, ${excerpt}, ${content}, ${cover_image}, ${published !== undefined ? published : true}, ${category || null}, ${!!featured}, ${author || null})
    RETURNING *;
  `;
  return rows[0];
}
export async function updateBlogPost(id, { slug, title, excerpt, content, cover_image, published, category, featured, author }) {
  const rows = await sql`
    UPDATE blog_posts SET slug = ${slug}, title = ${title}, excerpt = ${excerpt}, content = ${content}, cover_image = ${cover_image},
      published = ${published !== undefined ? published : true}, category = ${category || null}, featured = ${!!featured}, author = ${author || null}
    WHERE id = ${id} RETURNING *;
  `;
  return rows[0];
}
export async function deleteBlogPost(id) {
  await sql`UPDATE blog_posts SET deleted_at = NOW() WHERE id = ${id};`;
}

export async function getContentBlocks(section, locale = 'ar') {
  const rows = await sql`SELECT * FROM content_blocks WHERE section = ${section} AND locale = ${locale} AND deleted_at IS NULL ORDER BY sort_order ASC, id ASC;`;
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
    UPDATE content_blocks SET icon = ${icon}, title = ${title}, body = ${body}, body2 = ${body2}, tag = ${tag}, sort_order = ${sort_order || 0}
    WHERE id = ${id} RETURNING *;
  `;
  return rows[0];
}
export async function deleteContentBlock(id) {
  await sql`UPDATE content_blocks SET deleted_at = NOW() WHERE id = ${id};`;
}

function parsePortfolioGallery(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
export async function getPortfolioItems() {
  const rows = await sql`SELECT * FROM portfolio_items WHERE deleted_at IS NULL ORDER BY pinned DESC, created_at DESC;`;
  return rows.map((r) => ({ ...r, gallery: parsePortfolioGallery(r.gallery) }));
}
export async function getPortfolioItemBySlug(slug) {
  const rows = await sql`SELECT * FROM portfolio_items WHERE slug = ${slug} AND deleted_at IS NULL LIMIT 1;`;
  if (!rows[0]) return null;
  return { ...rows[0], gallery: parsePortfolioGallery(rows[0].gallery) };
}
export async function addPortfolioItem({ title, description, tag, image_url, link_url, slug, full_description, client_name, services, project_date, gallery }) {
  const rows = await sql`
    INSERT INTO portfolio_items (title, description, tag, image_url, link_url, slug, full_description, client_name, services, project_date, gallery)
    VALUES (${title}, ${description}, ${tag || null}, ${image_url || null}, ${link_url || null}, ${slug || null}, ${full_description || null}, ${client_name || null}, ${services || null}, ${project_date || null}, ${JSON.stringify(gallery || [])})
    RETURNING *;
  `;
  return { ...rows[0], gallery: parsePortfolioGallery(rows[0].gallery) };
}
export async function updatePortfolioItem(id, { title, description, tag, image_url, link_url, slug, full_description, client_name, services, project_date, gallery }) {
  const rows = await sql`
    UPDATE portfolio_items SET title = ${title}, description = ${description}, tag = ${tag}, image_url = ${image_url}, link_url = ${link_url},
      slug = ${slug || null}, full_description = ${full_description || null}, client_name = ${client_name || null},
      services = ${services || null}, project_date = ${project_date || null}, gallery = ${JSON.stringify(gallery || [])}
    WHERE id = ${id} RETURNING *;
  `;
  return { ...rows[0], gallery: parsePortfolioGallery(rows[0].gallery) };
}
export async function togglePinPortfolioItem(id, pinned) {
  await sql`UPDATE portfolio_items SET pinned = ${pinned} WHERE id = ${id};`;
}
export async function deletePortfolioItem(id) {
  await sql`UPDATE portfolio_items SET deleted_at = NOW() WHERE id = ${id};`;
}

export async function getTestimonials() {
  const rows = await sql`SELECT id, name, role, quote, rating, created_at FROM testimonials WHERE approved = TRUE AND deleted_at IS NULL ORDER BY created_at DESC;`;
  return rows;
}
export async function getAllTestimonialsAdmin() {
  const rows = await sql`SELECT * FROM testimonials WHERE deleted_at IS NULL ORDER BY created_at DESC;`;
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
    UPDATE testimonials SET name = ${name}, role = ${role}, quote = ${quote}, rating = ${rating || 5}
    WHERE id = ${id} RETURNING *;
  `;
  return rows[0];
}
export async function getTestimonialByToken(token) {
  const rows = await sql`SELECT * FROM testimonials WHERE edit_token = ${token} AND deleted_at IS NULL;`;
  return rows[0] || null;
}
export async function updateTestimonialByToken(token, { name, role, quote, rating }) {
  const rows = await sql`
    UPDATE testimonials SET name = ${name}, role = ${role}, quote = ${quote}, rating = ${rating || 5}, approved = FALSE
    WHERE edit_token = ${token} RETURNING *;
  `;
  return rows[0];
}
export async function deleteTestimonialByToken(token) {
  await sql`UPDATE testimonials SET deleted_at = NOW() WHERE edit_token = ${token};`;
}
export async function deleteTestimonial(id) {
  await sql`UPDATE testimonials SET deleted_at = NOW() WHERE id = ${id};`;
}

export async function getFaqs(locale = 'ar') {
  const rows = await sql`SELECT * FROM faqs WHERE locale = ${locale} AND deleted_at IS NULL ORDER BY sort_order ASC, created_at ASC;`;
  return rows;
}
export async function getAllFaqsAdmin() {
  const rows = await sql`SELECT * FROM faqs WHERE deleted_at IS NULL ORDER BY locale ASC, sort_order ASC, created_at ASC;`;
  return rows;
}
export async function addFaq({ question, answer, locale, sort_order }) {
  const rows = await sql`
    INSERT INTO faqs (question, answer, locale, sort_order) VALUES (${question}, ${answer}, ${locale || 'ar'}, ${sort_order || 0}) RETURNING *;
  `;
  return rows[0];
}
export async function updateFaq(id, { question, answer, sort_order }) {
  const rows = await sql`
    UPDATE faqs SET question = ${question}, answer = ${answer}, sort_order = ${sort_order || 0} WHERE id = ${id} RETURNING *;
  `;
  return rows[0];
}
export async function deleteFaq(id) {
  await sql`UPDATE faqs SET deleted_at = NOW() WHERE id = ${id};`;
}

export async function getHeroSlides() {
  const rows = await sql`SELECT * FROM hero_slides ORDER BY sort_order ASC, created_at ASC;`;
  return rows;
}
export async function addHeroSlide({ image_url, sort_order }) {
  const rows = await sql`INSERT INTO hero_slides (image_url, sort_order) VALUES (${image_url}, ${sort_order || 0}) RETURNING *;`;
  return rows[0];
}
export async function deleteHeroSlide(id) {
  await sql`DELETE FROM hero_slides WHERE id = ${id};`;
}

const TRASH_TABLES = {
  portfolio: { table: 'portfolio_items' },
  testimonial: { table: 'testimonials' },
  faq: { table: 'faqs' },
  blog: { table: 'blog_posts' },
  section: { table: 'content_blocks' },
};

export async function getTrash() {
  const results = [];
  const portfolio = await sql`SELECT * FROM portfolio_items WHERE deleted_at IS NOT NULL ORDER BY deleted_at DESC;`;
  portfolio.forEach((r) => results.push({ type: 'portfolio', typeLabel: 'مشروع', id: r.id, title: r.title, deleted_at: r.deleted_at }));
  const testimonials = await sql`SELECT * FROM testimonials WHERE deleted_at IS NOT NULL ORDER BY deleted_at DESC;`;
  testimonials.forEach((r) => results.push({ type: 'testimonial', typeLabel: 'رأي عميل', id: r.id, title: `${r.name}: ${r.quote}`.slice(0, 60), deleted_at: r.deleted_at }));
  const faqs = await sql`SELECT * FROM faqs WHERE deleted_at IS NOT NULL ORDER BY deleted_at DESC;`;
  faqs.forEach((r) => results.push({ type: 'faq', typeLabel: 'سؤال شائع', id: r.id, title: r.question, deleted_at: r.deleted_at }));
  const blog = await sql`SELECT * FROM blog_posts WHERE deleted_at IS NOT NULL ORDER BY deleted_at DESC;`;
  blog.forEach((r) => results.push({ type: 'blog', typeLabel: 'مقال مدونة', id: r.id, title: r.title, deleted_at: r.deleted_at }));
  const sections = await sql`SELECT * FROM content_blocks WHERE deleted_at IS NOT NULL ORDER BY deleted_at DESC;`;
  sections.forEach((r) => results.push({ type: 'section', typeLabel: 'عنصر قسم ثابت', id: r.id, title: r.title, deleted_at: r.deleted_at }));
  results.sort((a, b) => new Date(b.deleted_at) - new Date(a.deleted_at));
  return results;
}
export async function restoreTrashItem(type, id) {
  const entry = TRASH_TABLES[type];
  if (!entry) throw new Error('نوع غير معروف');
  await sql.query(`UPDATE ${entry.table} SET deleted_at = NULL WHERE id = $1;`, [id]);
}
export async function permanentlyDeleteTrashItem(type, id) {
  const entry = TRASH_TABLES[type];
  if (!entry) throw new Error('نوع غير معروف');
  await sql.query(`DELETE FROM ${entry.table} WHERE id = $1;`, [id]);
}

const DEFAULT_SETTINGS = {
  whatsapp_number: '201000446294',
  contact_email: 'amvora.agency@gmail.com',
  price_basic: 'تبدأ من $XXX',
  price_pro: 'تبدأ من $XXX',
  price_premium: 'حسب المشروع',
  price_basic_tagline: 'مثالي للمهنيين وأصحاب الأعمال الصغيرة اللي عايزين حضور رقمي احترافي بسرعة.',
  price_basic_tagline_en: 'Ideal for professionals and small businesses who want a fast, credible digital presence.',
  price_basic_features: 'موقع تعريفي احترافي متجاوب بالكامل\nتصميم مخصص يعكس هويتك البصرية\nنموذج تواصل وطلب استشارة مدمج\nتحسين أساسي لمحركات البحث (SEO)\nربط بحسابات السوشيال ميديا\nدعم فني لمدة شهر بعد التسليم',
  price_basic_features_en: 'Fully responsive, professional profile website\nCustom design reflecting your visual identity\nBuilt-in contact & consultation request form\nBasic search engine optimization (SEO)\nSocial media account linking\n1 month of technical support after delivery',
  price_pro_tagline: 'الأنسب للمتاجر الإلكترونية والشركات العقارية اللي محتاجة نظام متكامل.',
  price_pro_tagline_en: 'Best fit for e-commerce stores and real estate businesses needing a full system.',
  price_pro_features: 'كل مميزات الباقة الأساسية\nلوحة تحكم لإدارة المحتوى بنفسك\nمتجر إلكتروني أو نظام عرض مشاريع متكامل\nربط بوابة دفع إلكتروني\nتكامل مع أدوات التحليل (Google Analytics)\nتحسين متقدم لمحركات البحث\nدعم فني لمدة 3 شهور بعد التسليم',
  price_pro_features_en: 'Everything in the Essentials package\nSelf-service content management dashboard\nFull e-commerce store or project showcase system\nPayment gateway integration\nAnalytics integration (Google Analytics)\nAdvanced search engine optimization\n3 months of technical support after delivery',
  price_premium_tagline: 'حلول مخصصة بالكامل للشركات اللي محتاجة أنظمة أو تكاملات خاصة.',
  price_premium_tagline_en: 'Fully custom solutions for companies needing special systems or integrations.',
  price_premium_features: 'كل مميزات الباقة الاحترافية\nتطوير أنظمة وميزات مخصصة حسب احتياجك (حجز، عضويات، تتبع طلبات)\nتكامل برمجي مع أنظمة خارجية (ERP/CRM أو بوابات دفع خاصة)\nإعداد بنية تحتية واستضافة متقدمة\nاستشارة تسويق رقمي ومحتوى\nدعم فني ممتد وأولوية في الجدولة',
  price_premium_features_en: 'Everything in the Professional package\nCustom systems and features built for your needs (booking, memberships, order tracking)\nTechnical integration with external systems (ERP/CRM or special payment gateways)\nAdvanced infrastructure and hosting setup\nDigital marketing & content consultation\nExtended support with priority scheduling',
  facebook_url: '', instagram_url: '', linkedin_url: '', tiktok_url: '', youtube_url: '', twitter_url: '',
  ga_measurement_id: '',
  search_console_verification: '',
  privacy_updated_ar: '30 يوليو 2026',
  privacy_updated_en: 'July 30, 2026',
  calendly_url: '',
  stat_projects: '', stat_years: '', stat_satisfaction: '', stat_support: '',
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
  for (const row of rows) settings[row.key] = row.value;
  return settings;
}
export async function updateSetting(key, value) {
  await sql`INSERT INTO site_settings (key, value) VALUES (${key}, ${value}) ON CONFLICT (key) DO UPDATE SET value = ${value};`;
}
export async function getAdminPasswordHash() {
  const rows = await sql`SELECT value FROM site_settings WHERE key = 'admin_password_hash';`;
  return rows[0] ? rows[0].value : null;
}
export function getEnvPasswordHash() {
  return process.env.ADMIN_PASSWORD_HASH || null;
}
export async function setAdminPasswordHash(hash) {
  await updateSetting('admin_password_hash', hash);
}

export async function getRawSettingsKeys(keys) {
  const rows = await sql`SELECT key, value FROM site_settings WHERE key = ANY(${keys});`;
  const result = {};
  for (const row of rows) result[row.key] = row.value;
  return result;
}

export async function addConsultation({ name, company, website, current_system, sector, features, goal, budget, timeline, notes, contact, locale, source_page }) {
  const rows = await sql`
    INSERT INTO consultations (name, company, website, current_system, sector, features, goal, budget, timeline, notes, contact, locale, source_page)
    VALUES (${name}, ${company || null}, ${website || null}, ${current_system || null}, ${sector || null}, ${features || null}, ${goal || null}, ${budget || null}, ${timeline || null}, ${notes || null}, ${contact}, ${locale || 'ar'}, ${source_page || null})
    RETURNING *;
  `;
  return rows[0];
}
export async function getConsultations() {
  const rows = await sql`SELECT * FROM consultations WHERE deleted_at IS NULL ORDER BY created_at DESC;`;
  return rows;
}
export async function updateConsultationStatus(id, status) {
  const rows = await sql`UPDATE consultations SET status = ${status} WHERE id = ${id} RETURNING *;`;
  return rows[0];
}
export async function deleteConsultation(id) {
  await sql`UPDATE consultations SET deleted_at = NOW() WHERE id = ${id};`;
}

export async function getPricingPlans(locale = 'ar') {
  const rows = await sql`SELECT * FROM pricing_plans WHERE locale = ${locale} AND deleted_at IS NULL ORDER BY sort_order ASC, id ASC;`;
  return rows;
}
export async function addPricingPlan({ name, price, tagline, features, highlighted, locale, sort_order, section }) {
  const rows = await sql`
    INSERT INTO pricing_plans (name, price, tagline, features, highlighted, locale, sort_order, section)
    VALUES (${name}, ${price || null}, ${tagline || null}, ${features || null}, ${!!highlighted}, ${locale || 'ar'}, ${sort_order ?? 0}, ${section || null})
    RETURNING *;
  `;
  return rows[0];
}
export async function updatePricingPlan(id, { name, price, tagline, features, highlighted, sort_order, section }) {
  const rows = await sql`
    UPDATE pricing_plans SET name = ${name}, price = ${price || null}, tagline = ${tagline || null},
      features = ${features || null}, highlighted = ${!!highlighted}, sort_order = ${sort_order ?? 0}, section = ${section || null}
    WHERE id = ${id} RETURNING *;
  `;
  return rows[0];
}
export async function deletePricingPlan(id) {
  await sql`UPDATE pricing_plans SET deleted_at = NOW() WHERE id = ${id};`;
}
