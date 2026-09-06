'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import imageCompression from 'browser-image-compression';

const TABS = [
  { id: 'content', label: 'محتوى الموقع' },
  { id: 'sections', label: 'الأقسام الثابتة' },
  { id: 'leads', label: 'طلبات العملاء' },
  { id: 'pricing', label: 'الباقات' },
  { id: 'portfolio', label: 'أعمالنا' },
  { id: 'testimonials', label: 'آراء العملاء' },
  { id: 'faqs', label: 'الأسئلة الشائعة' },
  { id: 'blog', label: 'المدونة' },
  { id: 'trash', label: 'سلة المهملات' },
  { id: 'hero', label: 'صور الغلاف' },
  { id: 'settings', label: 'الإعدادات' },
  { id: 'security', label: 'الأمان' },
];

export default function Dashboard({ initialPortfolio, initialTestimonials, initialSettings, initialFaqs, initialHeroSlides, dbError }) {
  const [tab, setTab] = useState('content');
  const [portfolio, setPortfolio] = useState(initialPortfolio || []);
  const [testimonials, setTestimonials] = useState(initialTestimonials || []);
  const [settings, setSettings] = useState(initialSettings || {});
  const [faqs, setFaqs] = useState(initialFaqs || []);
  const [heroSlides, setHeroSlides] = useState(initialHeroSlides || []);
  const router = useRouter();

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin');
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-white px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl sm:text-2xl font-black text-gray-900">لوحة تحكم Amvora</h1>
          <div className="flex items-center gap-2">
            <a href="/" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm text-gray-500 hover:text-gold border border-gray-300 rounded-lg px-4 py-2 flex items-center gap-2">
              <i className="fa-solid fa-arrow-up-right-from-square" /> شاهد الموقع
            </a>
            <button onClick={logout} className="text-xs sm:text-sm text-gray-500 hover:text-red-600 border border-gray-300 rounded-lg px-4 py-2">
              تسجيل الخروج
            </button>
          </div>
        </div>

        {dbError && <div className="bg-red-50 border border-red-300 text-red-700 text-sm rounded-xl p-4 mb-8">{dbError}</div>}

        <div className="flex gap-2 mb-8 border-b border-gray-200 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${
                tab === t.id ? 'border-[#c5a059] text-[#8a6d1f]' : 'border-transparent text-gray-400 hover:text-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'content' && <ContentTab settings={settings} setSettings={setSettings} />}
        {tab === 'sections' && <SectionsTab />}
        {tab === 'leads' && <LeadsTab />}
        {tab === 'pricing' && <PricingPlansTab />}
        {tab === 'portfolio' && <PortfolioTab items={portfolio} setItems={setPortfolio} />}
        {tab === 'testimonials' && <TestimonialsTab items={testimonials} setItems={setTestimonials} />}
        {tab === 'faqs' && <FaqsTab items={faqs} setItems={setFaqs} />}
        {tab === 'blog' && <BlogTab />}
        {tab === 'trash' && <TrashTab />}
        {tab === 'hero' && <HeroTab items={heroSlides} setItems={setHeroSlides} />}
        {tab === 'settings' && <SettingsTab settings={settings} setSettings={setSettings} />}
        {tab === 'security' && <SecurityTab />}
      </div>
    </main>
  );
}

/* ============ shared bits ============ */
function Field({ label, value, onChange, textarea, rows = 2 }) {
  return (
    <div>
      <label className="text-gray-500 text-xs block mb-1">{label}</label>
      {textarea ? (
        <textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900" />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900" />
      )}
    </div>
  );
}

async function saveSettings(updates) {
  await fetch('/api/settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
}

function ImageUploadField({ label, value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: file.type,
      });
      const formData = new FormData();
      formData.append('file', compressed, file.name);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'فشل الرفع');
      onChange(data.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="text-gray-500 text-xs block mb-1">{label}</label>
      <div className="flex gap-2">
        <input placeholder="رابط صورة (أو ارفع من جهازك)" value={value} onChange={(e) => onChange(e.target.value)} className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900" />
        <label className="shrink-0 border border-gray-300 rounded-lg px-3 py-2 text-xs font-bold text-gray-600 cursor-pointer hover:bg-gray-50 flex items-center gap-1">
          <i className="fa-solid fa-upload" />
          {uploading ? 'جارٍ الضغط والرفع...' : 'رفع صورة'}
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" disabled={uploading} />
        </label>
      </div>
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
      {value && <img src={value} alt="" className="mt-2 h-20 rounded-lg object-cover border border-gray-200" />}
    </div>
  );
}

/* ============ Content Tab (every editable text on the site) ============ */
function ContentTab({ settings, setSettings }) {
  const [form, setForm] = useState({
    hero_title: settings.hero_title || '',
    hero_subtitle: settings.hero_subtitle || '',
    hero_subtitle2: settings.hero_subtitle2 || '',
    about_title: settings.about_title || '',
    about_text1: settings.about_text1 || '',
    about_text2: settings.about_text2 || '',
    vip_title: settings.vip_title || '',
    vip_text: settings.vip_text || '',
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save(e) {
    e.preventDefault();
    setLoading(true);
    setSaved(false);
    await saveSettings(form);
    setSettings({ ...settings, ...form });
    setLoading(false);
    setSaved(true);
  }

  return (
    <form onSubmit={save} className="space-y-8 max-w-2xl">
      <div className="premium-card-bg border border-gray-200 rounded-2xl p-6 space-y-4">
        <h2 className="text-gray-900 font-bold">قسم الهيرو (أعلى الصفحة)</h2>
        <Field label="العنوان الرئيسي" value={form.hero_title} onChange={(v) => setForm({ ...form, hero_title: v })} textarea />
        <Field label="الجملة الأولى تحت العنوان" value={form.hero_subtitle} onChange={(v) => setForm({ ...form, hero_subtitle: v })} textarea />
        <Field label="الجملة الثانية (الذهبية)" value={form.hero_subtitle2} onChange={(v) => setForm({ ...form, hero_subtitle2: v })} textarea />
      </div>

      <div className="premium-card-bg border border-gray-200 rounded-2xl p-6 space-y-4">
        <h2 className="text-gray-900 font-bold">قسم "من نحن"</h2>
        <Field label="العنوان" value={form.about_title} onChange={(v) => setForm({ ...form, about_title: v })} />
        <Field label="الفقرة الأولى" value={form.about_text1} onChange={(v) => setForm({ ...form, about_text1: v })} textarea rows={4} />
        <Field label="الفقرة الثانية" value={form.about_text2} onChange={(v) => setForm({ ...form, about_text2: v })} textarea />
      </div>

      <div className="premium-card-bg border border-gray-200 rounded-2xl p-6 space-y-4">
        <h2 className="text-gray-900 font-bold">قسم نادي VIP</h2>
        <Field label="العنوان" value={form.vip_title} onChange={(v) => setForm({ ...form, vip_title: v })} />
        <Field label="النص" value={form.vip_text} onChange={(v) => setForm({ ...form, vip_text: v })} textarea rows={3} />
      </div>

      {saved && <p className="text-emerald-600 text-xs">تم الحفظ بنجاح</p>}
      <button disabled={loading} className="gold-bg-gradient text-black font-bold py-3 px-8 rounded-lg disabled:opacity-50">
        {loading ? 'جارٍ الحفظ...' : 'حفظ كل التعديلات'}
      </button>
    </form>
  );
}

/* ============ Pricing Plans Tab ============ */
function PricingPlansTab() {
  const [locale, setLocale] = useState('ar');
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const emptyForm = { name: '', price: '', tagline: '', features: '', highlighted: false };
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  async function load(loc) {
    setLoaded(false);
    const res = await fetch(`/api/pricing-plans?locale=${loc}`);
    const data = await res.json();
    setItems(data.items || []);
    setLoaded(true);
  }

  useEffect(() => { load(locale); }, [locale]);

  async function submit(e) {
    e.preventDefault();
    setError('');
    const payload = { ...form, locale, sort_order: editingId ? undefined : items.length };
    try {
      if (editingId) {
        const res = await fetch('/api/pricing-plans', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...payload }),
        });
        const data = await res.json();
        setItems((prev) => prev.map((i) => (i.id === editingId ? data.item : i)));
      } else {
        const res = await fetch('/api/pricing-plans', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        setItems((prev) => [...prev, data.item]);
      }
      setForm(emptyForm);
      setEditingId(null);
    } catch {
      setError('حصل خطأ، حاول تاني');
    }
  }

  function edit(item) {
    setEditingId(item.id);
    setForm({ name: item.name, price: item.price || '', tagline: item.tagline || '', features: item.features || '', highlighted: item.highlighted });
  }

  async function removeItem(id) {
    if (!confirm('متأكد من حذف الباقة دي؟')) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
    await fetch('/api/pricing-plans', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
  }

  async function move(id, dir) {
    const idx = items.findIndex((i) => i.id === id);
    const swapWith = dir === 'up' ? idx - 1 : idx + 1;
    if (swapWith < 0 || swapWith >= items.length) return;
    const reordered = [...items];
    [reordered[idx], reordered[swapWith]] = [reordered[swapWith], reordered[idx]];
    setItems(reordered);
    await Promise.all(reordered.map((item, i) => fetch('/api/pricing-plans', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...item, sort_order: i }),
    })));
  }

  return (
    <div>
      <div className="bg-blue-50 border border-blue-300 text-blue-800 text-xs sm:text-sm rounded-xl p-4 mb-6 leading-relaxed">
        الباقات دي بتظهر في صفحة /pricing. تقدر تضيف أي عدد باقات أو تمسح أي باقة، والترتيب هنا هو نفسه ترتيبها في الموقع.
      </div>

      <div className="flex gap-2 mb-6">
        <button onClick={() => setLocale('ar')} className={`text-xs font-bold px-3 py-1.5 rounded-full border ${locale === 'ar' ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-300 text-gray-600'}`}>عربي</button>
        <button onClick={() => setLocale('en')} className={`text-xs font-bold px-3 py-1.5 rounded-full border ${locale === 'en' ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-300 text-gray-600'}`}>English</button>
      </div>

      <form onSubmit={submit} className="premium-card-bg border border-gray-200 rounded-2xl p-5 mb-8 space-y-3">
        <input required placeholder="اسم الباقة" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900" />
        <input placeholder="السعر (مثال: تبدأ من $XXX)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900" />
        <input placeholder="وصف مختصر - لمين الباقة دي" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900" />
        <textarea placeholder="المميزات - كل ميزة في سطر لوحده" rows="6" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900" />
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={form.highlighted} onChange={(e) => setForm({ ...form, highlighted: e.target.checked })} className="accent-gold w-4 h-4" />
          مميزة (الأكثر طلباً) - هتظهر بشكل مختلف وأبرز
        </label>
        {error && <p className="text-red-600 text-xs">{error}</p>}
        <div className="flex gap-2">
          <button type="submit" className="gold-bg-gradient text-black font-bold px-5 py-2 rounded-lg text-sm">{editingId ? 'حفظ التعديل' : 'إضافة باقة'}</button>
          {editingId && <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} className="text-gray-500 text-sm">إلغاء</button>}
        </div>
      </form>

      {!loaded && <p className="text-gray-400 text-sm">جارٍ التحميل...</p>}
      {loaded && items.length === 0 && <p className="text-gray-400 text-sm">مفيش باقات لسه باللغة دي.</p>}

      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={item.id} className="border border-gray-200 rounded-2xl p-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-gray-900 text-sm">{item.name}</span>
                {item.highlighted && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold/20 text-[#8a6d1f] border border-gold/40">مميزة</span>}
              </div>
              <p className="text-gold text-sm font-mono mt-1">{item.price}</p>
              {item.tagline && <p className="text-gray-500 text-xs mt-1">{item.tagline}</p>}
            </div>
            <div className="flex flex-col gap-1.5 shrink-0 text-xs items-end">
              <div className="flex gap-1">
                <button onClick={() => move(item.id, 'up')} disabled={idx === 0} className="text-gray-400 hover:text-gray-700 disabled:opacity-30 w-6 h-6"><i className="fa-solid fa-arrow-up" /></button>
                <button onClick={() => move(item.id, 'down')} disabled={idx === items.length - 1} className="text-gray-400 hover:text-gray-700 disabled:opacity-30 w-6 h-6"><i className="fa-solid fa-arrow-down" /></button>
              </div>
              <button onClick={() => edit(item)} className="text-gray-600 hover:underline">تعديل</button>
              <button onClick={() => removeItem(item.id)} className="text-red-600 hover:underline">حذف</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============ Leads Tab (طلبات الاستشارة) ============ */
const LEAD_STATUSES = {
  new: { label: 'جديد', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  contacted: { label: 'تم التواصل', color: 'bg-amber-100 text-amber-700 border-amber-300' },
  won: { label: 'اتحول لعميل', color: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
  closed: { label: 'مغلق', color: 'bg-gray-100 text-gray-600 border-gray-300' },
};

function LeadsTab() {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetch('/api/consultations')
      .then((res) => res.json())
      .then((data) => { setItems(data.items || []); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, []);

  async function setStatus(id, status) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
    await fetch('/api/consultations', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
  }

  async function removeItem(id) {
    if (!confirm('متأكد من حذف الطلب ده؟')) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
    await fetch('/api/consultations', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
  }

  const filtered = filter === 'all' ? items : items.filter((i) => (i.status || 'new') === filter);
  const counts = items.reduce((acc, i) => { const s = i.status || 'new'; acc[s] = (acc[s] || 0) + 1; return acc; }, {});

  if (!loaded) return <p className="text-gray-400 text-sm">جارٍ التحميل...</p>;

  return (
    <div>
      <div className="bg-blue-50 border border-blue-300 text-blue-800 text-xs sm:text-sm rounded-xl p-4 mb-6 leading-relaxed">
        كل طلبات "اطلب استشارة" اللي بتوصل من الموقع بتتحفظ هنا تلقائياً كنسخة احتياطية، بالإضافة للإيميل اللي بيوصلك فوراً.
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setFilter('all')} className={`text-xs font-bold px-3 py-1.5 rounded-full border ${filter === 'all' ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-300 text-gray-600'}`}>
          الكل ({items.length})
        </button>
        {Object.entries(LEAD_STATUSES).map(([key, def]) => (
          <button key={key} onClick={() => setFilter(key)} className={`text-xs font-bold px-3 py-1.5 rounded-full border ${filter === key ? def.color : 'border-gray-200 text-gray-400'}`}>
            {def.label} ({counts[key] || 0})
          </button>
        ))}
      </div>

      {filtered.length === 0 && <p className="text-gray-400 text-sm">مفيش طلبات {filter !== 'all' ? 'بالحالة دي' : 'لسه'}.</p>}

      <div className="space-y-3">
        {filtered.map((lead) => {
          const st = LEAD_STATUSES[lead.status || 'new'] || LEAD_STATUSES.new;
          const isOpen = expandedId === lead.id;
          return (
            <div key={lead.id} className="border border-gray-200 rounded-2xl overflow-hidden">
              <button onClick={() => setExpandedId(isOpen ? null : lead.id)} className="w-full flex items-center justify-between gap-3 p-4 text-right hover:bg-gray-50">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-gray-900 text-sm">{lead.name}</span>
                    {lead.company && <span className="text-gray-400 text-xs">- {lead.company}</span>}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${st.color}`}>{st.label}</span>
                  </div>
                  <p className="text-gray-400 text-xs mt-1">{lead.contact} · {new Date(lead.created_at).toLocaleString('ar-EG')}</p>
                </div>
                <i className={`fa-solid fa-chevron-down text-gray-400 text-xs transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="border-t border-gray-100 p-4 space-y-2 text-sm bg-gray-50">
                  {lead.website && <p><span className="font-bold text-gray-600">الموقع/الحسابات:</span> <span className="text-gray-800">{lead.website}</span></p>}
                  {lead.current_system && <p><span className="font-bold text-gray-600">الوضع الحالي:</span> <span className="text-gray-800">{lead.current_system}</span></p>}
                  {lead.sector && <p><span className="font-bold text-gray-600">المجال:</span> <span className="text-gray-800">{lead.sector}</span></p>}
                  {lead.features && <p><span className="font-bold text-gray-600">الميزات المطلوبة:</span> <span className="text-gray-800">{lead.features}</span></p>}
                  {lead.goal && <p><span className="font-bold text-gray-600">الهدف:</span> <span className="text-gray-800">{lead.goal}</span></p>}
                  {lead.budget && <p><span className="font-bold text-gray-600">الميزانية:</span> <span className="text-gray-800">{lead.budget}</span></p>}
                  {lead.timeline && <p><span className="font-bold text-gray-600">الجدول الزمني:</span> <span className="text-gray-800">{lead.timeline}</span></p>}
                  {lead.notes && <p><span className="font-bold text-gray-600">ملاحظات:</span> <span className="text-gray-800">{lead.notes}</span></p>}
                  {lead.source_page && <p><span className="font-bold text-gray-600">من صفحة:</span> <span className="text-gray-800" dir="ltr">{lead.source_page}</span></p>}
                  <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-200">
                    {Object.entries(LEAD_STATUSES).map(([key, def]) => (
                      <button key={key} onClick={() => setStatus(lead.id, key)} className={`text-[11px] font-bold px-3 py-1.5 rounded-full border ${(lead.status || 'new') === key ? def.color : 'border-gray-200 text-gray-400 hover:border-gray-400'}`}>
                        {def.label}
                      </button>
                    ))}
                    <button onClick={() => removeItem(lead.id)} className="text-[11px] font-bold px-3 py-1.5 rounded-full border border-red-200 text-red-500 hover:bg-red-50 mr-auto">
                      حذف
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============ Gallery Upload Field (multiple images) ============ */
function GalleryUploadField({ label, value, onChange }) {
  const images = value || [];
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: file.type,
      });
      const formData = new FormData();
      formData.append('file', compressed, file.name);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'فشل الرفع');
      onChange([...images, data.url]);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  function remove(idx) {
    onChange(images.filter((_, i) => i !== idx));
  }

  return (
    <div>
      <label className="text-gray-500 text-xs block mb-1">{label}</label>
      <label className="inline-flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 text-xs font-bold text-gray-600 cursor-pointer hover:bg-gray-50">
        <i className="fa-solid fa-upload" />
        {uploading ? 'جارٍ الضغط والرفع...' : 'إضافة صورة للمعرض'}
        <input type="file" accept="image/*" onChange={handleFile} className="hidden" disabled={uploading} />
      </label>
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {images.map((src, i) => (
            <div key={i} className="relative">
              <img src={src} alt="" className="h-16 w-16 object-cover rounded-lg border border-gray-200" />
              <button type="button" onClick={() => remove(i)} className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full w-5 h-5 text-[10px] flex items-center justify-center">✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============ Portfolio Tab ============ */
function PortfolioTab({ items, setItems }) {
  const emptyForm = { title: '', description: '', tag: '', image_url: '', link_url: '', slug: '', full_description: '', client_name: '', services: '', project_date: '', gallery: [] };
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (editingId) {
        const res = await fetch('/api/portfolio', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...form }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'فشل الحفظ');
        setItems(items.map((i) => (i.id === editingId ? data.item : i)));
      } else {
        const res = await fetch('/api/portfolio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'فشل الحفظ');
        setItems([data.item, ...items]);
      }
      setForm(emptyForm);
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function edit(item) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      description: item.description,
      tag: item.tag || '',
      image_url: item.image_url || '',
      link_url: item.link_url || '',
      slug: item.slug || '',
      full_description: item.full_description || '',
      client_name: item.client_name || '',
      services: item.services || '',
      project_date: item.project_date || '',
      gallery: item.gallery || [],
    });
  }

  async function removeItem(id) {
    if (!confirm('حذف هذا المشروع؟')) return;
    await fetch('/api/portfolio', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setItems(items.filter((i) => i.id !== id));
  }

  async function togglePin(item) {
    await fetch('/api/portfolio', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'pin', id: item.id, pinned: !item.pinned }),
    });
    setItems(items.map((i) => (i.id === item.id ? { ...i, pinned: !i.pinned } : i)));
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="premium-card-bg border border-gray-200 rounded-2xl p-6">
        <h2 className="text-gray-900 font-bold mb-4">{editingId ? 'تعديل مشروع' : 'إضافة مشروع جديد'}</h2>
        <form onSubmit={submit} className="space-y-3">
          <input required placeholder="اسم المشروع" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900" />
          <textarea required placeholder="وصف مختصر (بيظهر في كارت المشروع)" rows="2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900" />
          <input placeholder="تصنيف (مثال: عقارات)" value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900" />
          <ImageUploadField label="الصورة الرئيسية للمشروع" value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} />
          <input placeholder="رابط المشروع (اختياري)" value={form.link_url} onChange={(e) => setForm({ ...form, link_url: e.target.value })} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900" />

          <div className="pt-3 border-t border-gray-100 space-y-3">
            <p className="text-gray-400 text-[11px] font-bold">تفاصيل صفحة المشروع (اختياري لكن يحسّن العرض)</p>
            <input placeholder="رابط الصفحة (اتركه فاضي ليتولد تلقائياً من الاسم)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900" dir="ltr" />
            <textarea placeholder="الوصف الكامل للمشروع (بيظهر في صفحة التفاصيل، ممكن كذا فقرة)" rows="4" value={form.full_description} onChange={(e) => setForm({ ...form, full_description: e.target.value })} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900" />
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="اسم العميل" value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900" />
              <input placeholder="تاريخ التسليم" value={form.project_date} onChange={(e) => setForm({ ...form, project_date: e.target.value })} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900" />
            </div>
            <input placeholder="الخدمات المقدمة (افصل بينها بفاصلة: تصميم, برمجة, SEO)" value={form.services} onChange={(e) => setForm({ ...form, services: e.target.value })} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900" />
            <GalleryUploadField label="معرض صور إضافي للمشروع" value={form.gallery} onChange={(v) => setForm({ ...form, gallery: v })} />
          </div>
          {error && <p className="text-red-600 text-xs">{error}</p>}
          <div className="flex gap-2">
            <button disabled={loading} className="flex-1 gold-bg-gradient text-black font-bold py-2 rounded-lg disabled:opacity-50">
              {loading ? 'جارٍ الحفظ...' : editingId ? 'حفظ التعديل' : 'إضافة'}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} className="px-4 text-gray-500 text-sm">
                إلغاء
              </button>
            )}
          </div>
        </form>
      </div>
      <div className="space-y-3">
        {items.length === 0 && <p className="text-gray-400 text-sm">لا توجد مشاريع مضافة بعد.</p>}
        {items.map((item) => (
          <div key={item.id} className="premium-card-bg border border-gray-200 rounded-xl p-4 flex justify-between items-start gap-3">
            <div>
              <p className="text-gray-900 font-bold text-sm">{item.title} {item.pinned && <span className="text-[#8a6d1f]">★ مميز</span>}</p>
              <p className="text-gray-500 text-xs mt-1">{item.description}</p>
            </div>
            <div className="flex flex-col gap-2 shrink-0 text-xs">
              {item.slug && (
                <a href={`/portfolio/${item.slug}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:underline">شاهد الصفحة ↗</a>
              )}
              <button onClick={() => togglePin(item)} className="text-[#8a6d1f] hover:underline">{item.pinned ? 'إلغاء التمييز' : 'تثبيت كمميز'}</button>
              <button onClick={() => edit(item)} className="text-gray-600 hover:underline">تعديل</button>
              <button onClick={() => removeItem(item.id)} className="text-red-600 hover:underline">حذف</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============ Testimonials Tab (admin can also add/edit/delete any review) ============ */
function TestimonialsTab({ items, setItems }) {
  const emptyForm = { name: '', role: '', quote: '', rating: 5 };
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (editingId) {
        const res = await fetch('/api/testimonials', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...form, keepApproval: true }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'فشل الحفظ');
        setItems(items.map((i) => (i.id === editingId ? data.item : i)));
      } else {
        const res = await fetch('/api/testimonials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'فشل الحفظ');
        setItems([data.item, ...items]);
      }
      setForm(emptyForm);
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function edit(item) {
    setEditingId(item.id);
    setForm({ name: item.name, role: item.role || '', quote: item.quote, rating: item.rating || 5 });
  }

  async function removeItem(id) {
    if (!confirm('حذف هذا الرأي؟')) return;
    await fetch('/api/testimonials', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setItems(items.filter((i) => i.id !== id));
  }

  async function setApproved(id, approved) {
    await fetch('/api/testimonials', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, approved, approvalOnly: true }) });
    setItems(items.map((i) => (i.id === id ? { ...i, approved } : i)));
  }

  const pending = items.filter((i) => i.approved === false);
  const approved = items.filter((i) => i.approved !== false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="premium-card-bg border border-gray-200 rounded-2xl p-6">
        <h2 className="text-gray-900 font-bold mb-4">{editingId ? 'تعديل رأي عميل' : 'إضافة رأي عميل يدوياً'}</h2>
        <form onSubmit={submit} className="space-y-3">
          <input required placeholder="اسم العميل" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900" />
          <input placeholder="الصفة" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900" />
          <textarea required placeholder="نص الرأي" rows="3" value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900" />
          <select value={form.rating} onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value, 10) })} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900">
            {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} نجوم</option>)}
          </select>
          {error && <p className="text-red-600 text-xs">{error}</p>}
          <div className="flex gap-2">
            <button disabled={loading} className="flex-1 gold-bg-gradient text-black font-bold py-2 rounded-lg disabled:opacity-50">
              {loading ? 'جارٍ الحفظ...' : editingId ? 'حفظ التعديل' : 'إضافة'}
            </button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} className="px-4 text-gray-500 text-sm">إلغاء</button>}
          </div>
          {!editingId && <p className="text-gray-400 text-xs">الآراء اللي تضيفها إنت من هنا بتظهر فوراً من غير مراجعة.</p>}
        </form>
      </div>

      <div className="space-y-8">
        {pending.length > 0 && (
          <div>
            <h3 className="text-amber-700 font-bold text-sm mb-3 flex items-center gap-2">
              <i className="fa-solid fa-clock" /> بانتظار الموافقة ({pending.length})
            </h3>
            <div className="space-y-3">
              {pending.map((item) => (
                <div key={item.id} className="bg-amber-50 border border-amber-300 rounded-xl p-4">
                  <p className="text-gray-900 font-bold text-sm">{item.name} · {'★'.repeat(item.rating || 5)}</p>
                  <p className="text-gray-600 text-xs mt-1">{item.quote}</p>
                  <div className="flex gap-3 mt-3 text-xs">
                    <button onClick={() => setApproved(item.id, true)} className="text-emerald-700 font-bold hover:underline">✓ موافقة ونشر</button>
                    <button onClick={() => edit(item)} className="text-gray-600 font-bold hover:underline">✎ تعديل</button>
                    <button onClick={() => removeItem(item.id)} className="text-red-600 font-bold hover:underline">✕ رفض وحذف</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-gray-500 font-bold text-sm mb-3">منشورة على الموقع ({approved.length})</h3>
          <div className="space-y-3">
            {approved.length === 0 && <p className="text-gray-400 text-sm">لا توجد آراء منشورة بعد.</p>}
            {approved.map((item) => (
              <div key={item.id} className="premium-card-bg border border-gray-200 rounded-xl p-4 flex justify-between items-start gap-3">
                <div>
                  <p className="text-gray-900 font-bold text-sm">{item.name} · {'★'.repeat(item.rating || 5)}</p>
                  <p className="text-gray-500 text-xs mt-1">{item.quote}</p>
                </div>
                <div className="flex flex-col gap-2 shrink-0 text-xs">
                  <button onClick={() => setApproved(item.id, false)} className="text-amber-700 hover:underline">إخفاء</button>
                  <button onClick={() => edit(item)} className="text-gray-600 hover:underline">تعديل</button>
                  <button onClick={() => removeItem(item.id)} className="text-red-600 hover:underline">حذف</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============ FAQs Tab ============ */
function FaqsTab({ items, setItems }) {
  const [locale, setLocale] = useState('ar');
  const emptyForm = { question: '', answer: '' };
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const visibleItems = items.filter((i) => (i.locale || 'ar') === locale);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    const payload = { ...form, locale };
    if (editingId) {
      const res = await fetch('/api/faqs', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editingId, ...payload }) });
      const data = await res.json();
      setItems(items.map((i) => (i.id === editingId ? data.item : i)));
    } else {
      const res = await fetch('/api/faqs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      setItems([...items, data.item]);
    }
    setForm(emptyForm);
    setEditingId(null);
    setLoading(false);
  }

  async function removeItem(id) {
    if (!confirm('حذف هذا السؤال؟')) return;
    await fetch('/api/faqs', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setItems(items.filter((i) => i.id !== id));
  }

  return (
    <div>
      <div className="flex gap-2 mb-6">
        <button onClick={() => { setLocale('ar'); setEditingId(null); setForm(emptyForm); }} className={`px-4 py-2 text-xs font-bold rounded-lg border ${locale === 'ar' ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-300 text-gray-600'}`}>
          🇪🇬 النسخة العربية
        </button>
        <button onClick={() => { setLocale('en'); setEditingId(null); setForm(emptyForm); }} className={`px-4 py-2 text-xs font-bold rounded-lg border ${locale === 'en' ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-300 text-gray-600'}`}>
          🌐 English Version
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="premium-card-bg border border-gray-200 rounded-2xl p-6">
        <h2 className="text-gray-900 font-bold mb-4">{editingId ? 'تعديل سؤال' : 'إضافة سؤال جديد'}</h2>
        <form onSubmit={submit} className="space-y-3">
          <input required placeholder="السؤال" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900" />
          <textarea required placeholder="الإجابة" rows="3" value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900" />
          <div className="flex gap-2">
            <button disabled={loading} className="flex-1 gold-bg-gradient text-black font-bold py-2 rounded-lg disabled:opacity-50">
              {loading ? 'جارٍ الحفظ...' : editingId ? 'حفظ التعديل' : 'إضافة'}
            </button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} className="px-4 text-gray-500 text-sm">إلغاء</button>}
          </div>
        </form>
      </div>
      <div className="space-y-3">
        {visibleItems.length === 0 && <p className="text-gray-400 text-sm">لا توجد أسئلة بعد في اللغة دي.</p>}
        {visibleItems.map((item) => (
          <div key={item.id} className="premium-card-bg border border-gray-200 rounded-xl p-4 flex justify-between items-start gap-3">
            <div>
              <p className="text-gray-900 font-bold text-sm">{item.question}</p>
              <p className="text-gray-500 text-xs mt-1">{item.answer}</p>
            </div>
            <div className="flex flex-col gap-2 shrink-0 text-xs">
              <button onClick={() => { setEditingId(item.id); setForm({ question: item.question, answer: item.answer }); }} className="text-gray-600 hover:underline">تعديل</button>
              <button onClick={() => removeItem(item.id)} className="text-red-600 hover:underline">حذف</button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}

/* ============ Hero Slides Tab ============ */
/* ============ Blog Tab ============ */
function BlogTab() {
  const [locale, setLocale] = useState('ar');
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const emptyForm = { title: '', excerpt: '', content: '', cover_image: '', slug: '', published: true, category: '', featured: false, author: '' };
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function loadAll() {
    setLoaded(false);
    const res = await fetch('/api/blog?all=1');
    const data = await res.json();
    setItems(data.items || []);
    setLoaded(true);
  }

  useEffect(() => { loadAll(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const visibleItems = items.filter((i) => (i.locale || 'ar') === locale);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (editingId) {
        const res = await fetch('/api/blog', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editingId, ...form }) });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'فشل الحفظ');
        setItems(items.map((i) => (i.id === editingId ? data.item : i)));
      } else {
        const res = await fetch('/api/blog', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, locale }) });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'فشل الحفظ');
        setItems([data.item, ...items]);
      }
      setForm(emptyForm);
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function edit(item) {
    setEditingId(item.id);
    setLocale(item.locale || 'ar');
    setForm({ title: item.title, excerpt: item.excerpt || '', content: item.content, cover_image: item.cover_image || '', slug: item.slug, published: item.published !== false, category: item.category || '', featured: !!item.featured, author: item.author || '' });
  }

  async function removeItem(id) {
    if (!confirm('حذف هذا المقال نهائياً؟')) return;
    await fetch('/api/blog', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setItems(items.filter((i) => i.id !== id));
  }

  return (
    <div>
      <div className="flex gap-2 mb-6">
        <button onClick={() => { setLocale('ar'); setEditingId(null); setForm(emptyForm); }} className={`px-4 py-2 text-xs font-bold rounded-lg border ${locale === 'ar' ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-300 text-gray-600'}`}>
          🇪🇬 النسخة العربية
        </button>
        <button onClick={() => { setLocale('en'); setEditingId(null); setForm(emptyForm); }} className={`px-4 py-2 text-xs font-bold rounded-lg border ${locale === 'en' ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-300 text-gray-600'}`}>
          🌐 English Version
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="premium-card-bg border border-gray-200 rounded-2xl p-6">
          <h2 className="text-gray-900 font-bold mb-4">{editingId ? 'تعديل مقال' : 'كتابة مقال جديد'}</h2>
          <form onSubmit={submit} className="space-y-3">
            <input required placeholder="عنوان المقال" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900" />
            <input placeholder="رابط مخصص (اختياري - هيتولد تلقائياً من العنوان لو فاضي)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900" />
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="التصنيف (مثال: تسويق رقمي)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900" />
              <input placeholder="اسم الكاتب (اختياري)" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900" />
            </div>
            <textarea placeholder="ملخص قصير يظهر في صفحة كل المقالات (اختياري)" rows="2" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900" />
            <ImageUploadField label="صورة الغلاف (اختياري)" value={form.cover_image} onChange={(v) => setForm({ ...form, cover_image: v })} />
            <textarea required placeholder="محتوى المقال - افصل بين الفقرات بسطر جديد" rows="10" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900" />
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
              منشور (ظاهر للزوار)
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
              مقال مميز (يظهر بشكل أبرز في أول صفحة المدونة)
            </label>
            {error && <p className="text-red-600 text-xs">{error}</p>}
            <div className="flex gap-2">
              <button disabled={loading} className="flex-1 gold-bg-gradient text-black font-bold py-2 rounded-lg disabled:opacity-50">
                {loading ? 'جارٍ الحفظ...' : editingId ? 'حفظ التعديل' : 'نشر المقال'}
              </button>
              {editingId && <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} className="px-4 text-gray-500 text-sm">إلغاء</button>}
            </div>
          </form>
        </div>

        <div className="space-y-3">
          {!loaded && <p className="text-gray-400 text-sm">جارٍ التحميل...</p>}
          {loaded && visibleItems.length === 0 && <p className="text-gray-400 text-sm">لا توجد مقالات بهذه اللغة بعد.</p>}
          {visibleItems.map((item) => (
            <div key={item.id} className="premium-card-bg border border-gray-200 rounded-xl p-4 flex justify-between items-start gap-3">
              <div>
                <p className="text-gray-900 font-bold text-sm">
                  {item.title} {!item.published && <span className="text-amber-600 text-xs">(مسودة)</span>} {item.featured && <span className="text-gold text-xs">★ مميز</span>}
                </p>
                {item.category && <span className="inline-block mt-1 text-[10px] font-bold text-[#8a6d1f] bg-gold/10 rounded-full px-2 py-0.5">{item.category}</span>}
                <p className="text-gray-500 text-xs mt-1">{item.excerpt || item.content.slice(0, 80)}</p>
              </div>
              <div className="flex flex-col gap-2 shrink-0 text-xs">
                <button onClick={() => edit(item)} className="text-gray-600 hover:underline">تعديل</button>
                <button onClick={() => removeItem(item.id)} className="text-red-600 hover:underline">حذف</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============ Trash Tab (recycle bin) ============ */
function TrashTab() {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  async function load() {
    setLoaded(false);
    const res = await fetch('/api/trash');
    const data = await res.json();
    setItems(data.items || []);
    setLoaded(true);
  }

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function restore(type, id) {
    await fetch('/api/trash', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type, id }) });
    setItems(items.filter((i) => !(i.type === type && i.id === id)));
  }

  async function permanentDelete(type, id) {
    if (!confirm('حذف نهائي - مش هينفع ترجعه تاني. متأكد؟')) return;
    await fetch('/api/trash', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type, id }) });
    setItems(items.filter((i) => !(i.type === type && i.id === id)));
  }

  return (
    <div>
      <div className="bg-amber-50 border border-amber-300 text-amber-800 text-xs sm:text-sm rounded-xl p-4 mb-6 leading-relaxed">
        <i className="fa-solid fa-trash-can ml-1" />
        أي حاجة تحذفها (مشروع، رأي عميل، سؤال شائع، مقال، عنصر من الأقسام الثابتة) بتيجي هنا الأول بدل ما تتمسح نهائي. تقدر ترجعها في أي وقت، أو تمسحها نهائي لو متأكد.
      </div>
      {!loaded && <p className="text-gray-400 text-sm">جارٍ التحميل...</p>}
      {loaded && items.length === 0 && <p className="text-gray-400 text-sm">سلة المهملات فاضية.</p>}
      <div className="space-y-3">
        {items.map((item) => (
          <div key={`${item.type}-${item.id}`} className="premium-card-bg border border-gray-200 rounded-xl p-4 flex justify-between items-start gap-3">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase">{item.typeLabel}</span>
              <p className="text-gray-900 font-bold text-sm mt-1">{item.title}</p>
              <p className="text-gray-400 text-xs mt-1">اتحذف: {new Date(item.deleted_at).toLocaleString('ar-EG')}</p>
            </div>
            <div className="flex flex-col gap-2 shrink-0 text-xs">
              <button onClick={() => restore(item.type, item.id)} className="text-emerald-700 font-bold hover:underline">↺ استرجاع</button>
              <button onClick={() => permanentDelete(item.type, item.id)} className="text-red-600 font-bold hover:underline">حذف نهائي</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroTab({ items, setItems }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  async function addSlide(e) {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    const res = await fetch('/api/hero-slides', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image_url: url }) });
    const data = await res.json();
    setItems([...items, data.item]);
    setUrl('');
    setLoading(false);
  }

  async function removeItem(id) {
    await fetch('/api/hero-slides', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setItems(items.filter((i) => i.id !== id));
  }

  return (
    <div className="max-w-xl">
      <div className="premium-card-bg border border-gray-200 rounded-2xl p-6 mb-6">
        <h2 className="text-gray-900 font-bold mb-4">إضافة صورة غلاف متنقلة</h2>
        <p className="text-gray-500 text-xs mb-3">الصور بتتناوب تلقائياً كخلفية شفافة خلف قسم الهيرو. لو مفيش صور، بيظهر التدرج الذهبي الافتراضي.</p>
        <ImageUploadField label="صورة الغلاف" value={url} onChange={setUrl} />
        <button onClick={addSlide} disabled={loading || !url} className="mt-3 gold-bg-gradient text-black font-bold px-5 py-2 rounded-lg disabled:opacity-50">
          {loading ? 'جارٍ الإضافة...' : 'إضافة للكاروسيل'}
        </button>
      </div>
      <div className="space-y-3">
        {items.length === 0 && <p className="text-gray-400 text-sm">لا توجد صور مضافة - الخلفية الافتراضية شغالة.</p>}
        {items.map((item) => (
          <div key={item.id} className="premium-card-bg border border-gray-200 rounded-xl p-3 flex items-center justify-between gap-3">
            <img src={item.image_url} alt="" className="w-16 h-16 object-cover rounded-lg" />
            <button onClick={() => removeItem(item.id)} className="text-red-600 text-xs hover:underline">حذف</button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============ Sections Tab (Reality Matrix, Strategic Value, Specialties, Process) ============ */
const SECTION_TYPES = [
  { id: 'reality', label: 'تشريح المنصات (المشكلة/الحل)', fields: ['icon', 'title', 'body', 'body2'], bodyLabel: 'المشكلة (الجانب السلبي)', body2Label: 'الحل (الجانب الإيجابي)' },
  { id: 'strategic_value', label: 'ليه موقعك مهم', fields: ['icon', 'title', 'body'], bodyLabel: 'الوصف' },
  { id: 'specialties', label: 'تخصصاتنا / خدماتنا', fields: ['icon', 'title', 'body', 'tag'], bodyLabel: 'الوصف' },
  { id: 'process', label: 'خطوات العمل', fields: ['title', 'body'], bodyLabel: 'الوصف' },
];

function SectionsTab() {
  const [locale, setLocale] = useState('ar');
  const [sectionId, setSectionId] = useState('reality');
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const emptyForm = { icon: '', title: '', body: '', body2: '', tag: '' };
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const sectionDef = SECTION_TYPES.find((s) => s.id === sectionId);

  async function loadSection(id, loc) {
    setLoaded(false);
    const res = await fetch(`/api/content-blocks?section=${id}&locale=${loc}`);
    const data = await res.json();
    setItems(data.items || []);
    setLoaded(true);
  }

  function selectSection(id) {
    setSectionId(id);
    setEditingId(null);
    setForm(emptyForm);
    loadSection(id, locale);
  }

  function selectLocale(loc) {
    setLocale(loc);
    setEditingId(null);
    setForm(emptyForm);
    loadSection(sectionId, loc);
  }

  // load on first render
  useEffect(() => { loadSection(sectionId, locale); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    const payload = { section: sectionId, locale, ...form };
    if (editingId) {
      const res = await fetch('/api/content-blocks', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editingId, ...payload }) });
      const data = await res.json();
      setItems(items.map((i) => (i.id === editingId ? data.item : i)));
    } else {
      const res = await fetch('/api/content-blocks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      setItems([...items, data.item]);
    }
    setForm(emptyForm);
    setEditingId(null);
    setLoading(false);
  }

  async function removeItem(id) {
    if (!confirm('حذف هذا العنصر؟ لو ده آخر عنصر في القسم، هيرجع الموقع يعرض المحتوى الافتراضي بدل ما يفضل فاضي.')) return;
    await fetch('/api/content-blocks', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setItems(items.filter((i) => i.id !== id));
  }

  function edit(item) {
    setEditingId(item.id);
    setForm({ icon: item.icon || '', title: item.title || '', body: item.body || '', body2: item.body2 || '', tag: item.tag || '' });
  }

  return (
    <div>
      <div className="bg-amber-50 border border-amber-300 text-amber-800 text-xs sm:text-sm rounded-xl p-4 mb-6 leading-relaxed">
        <i className="fa-solid fa-circle-info ml-1" />
        الأقسام دي بتظهر بمحتوى افتراضي جاهز من غير ما تلمسها. لو ضفت أو عدّلت أي عنصر هنا، النسخة اللي انت كتبتها هي اللي هتظهر بدل الافتراضية.
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={() => selectLocale('ar')} className={`px-4 py-2 text-xs font-bold rounded-lg border ${locale === 'ar' ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-300 text-gray-600'}`}>
          🇪🇬 النسخة العربية
        </button>
        <button onClick={() => selectLocale('en')} className={`px-4 py-2 text-xs font-bold rounded-lg border ${locale === 'en' ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-300 text-gray-600'}`}>
          🌐 English Version
        </button>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {SECTION_TYPES.map((s) => (
          <button
            key={s.id}
            onClick={() => selectSection(s.id)}
            className={`px-3 py-2 text-xs font-bold rounded-lg border ${
              sectionId === s.id ? 'bg-gold text-black border-gold' : 'border-gray-300 text-gray-600'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="premium-card-bg border border-gray-200 rounded-2xl p-6">
          <h2 className="text-gray-900 font-bold mb-4">{editingId ? 'تعديل عنصر' : 'إضافة عنصر جديد'}</h2>
          <form onSubmit={submit} className="space-y-3">
            {sectionDef.fields.includes('icon') && (
              <div>
                <input placeholder="اسم أيقونة Font Awesome (مثال: fa-city)" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900" />
                <p className="text-gray-400 text-[11px] mt-1">اختياري - اسم أيقونة من موقع fontawesome.com (زي fa-city، fa-bag-shopping)</p>
              </div>
            )}
            <input required placeholder="العنوان" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900" />
            <textarea required placeholder={sectionDef.bodyLabel} rows="3" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900" />
            {sectionDef.fields.includes('body2') && (
              <textarea required placeholder={sectionDef.body2Label} rows="3" value={form.body2} onChange={(e) => setForm({ ...form, body2: e.target.value })} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900" />
            )}
            {sectionDef.fields.includes('tag') && (
              <input placeholder="تصنيف صغير (اختياري، مثال: Real Estate //)" value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900" />
            )}
            <div className="flex gap-2">
              <button disabled={loading} className="flex-1 gold-bg-gradient text-black font-bold py-2 rounded-lg disabled:opacity-50">
                {loading ? 'جارٍ الحفظ...' : editingId ? 'حفظ التعديل' : 'إضافة'}
              </button>
              {editingId && <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} className="px-4 text-gray-500 text-sm">إلغاء</button>}
            </div>
          </form>
        </div>

        <div className="space-y-3">
          {!loaded && <p className="text-gray-400 text-sm">جارٍ التحميل...</p>}
          {loaded && items.length === 0 && (
            <p className="text-gray-400 text-sm">مفيش عناصر مخصصة لسه - الموقع بيعرض المحتوى الافتراضي الجاهز لحد ما تضيف عناصر هنا.</p>
          )}
          {items.map((item) => (
            <div key={item.id} className="premium-card-bg border border-gray-200 rounded-xl p-4 flex justify-between items-start gap-3">
              <div>
                <p className="text-gray-900 font-bold text-sm">{item.title}</p>
                <p className="text-gray-500 text-xs mt-1">{item.body}</p>
              </div>
              <div className="flex flex-col gap-2 shrink-0 text-xs">
                <button onClick={() => edit(item)} className="text-gray-600 hover:underline">تعديل</button>
                <button onClick={() => removeItem(item.id)} className="text-red-600 hover:underline">حذف</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============ Settings Tab ============ */
function SettingsTab({ settings, setSettings }) {
  const [form, setForm] = useState({
    whatsapp_number: settings.whatsapp_number || '',
    contact_email: settings.contact_email || '',
    price_basic: settings.price_basic || '',
    price_pro: settings.price_pro || '',
    price_premium: settings.price_premium || '',
    facebook_url: settings.facebook_url || '',
    instagram_url: settings.instagram_url || '',
    linkedin_url: settings.linkedin_url || '',
    tiktok_url: settings.tiktok_url || '',
    youtube_url: settings.youtube_url || '',
    twitter_url: settings.twitter_url || '',
    ga_measurement_id: settings.ga_measurement_id || '',
    search_console_verification: settings.search_console_verification || '',
    privacy_updated_ar: settings.privacy_updated_ar || '',
    privacy_updated_en: settings.privacy_updated_en || '',
    calendly_url: settings.calendly_url || '',
    stat_projects: settings.stat_projects || '',
    stat_years: settings.stat_years || '',
    stat_satisfaction: settings.stat_satisfaction || '',
    stat_support: settings.stat_support || '',
    ticker_text: settings.ticker_text || '',
    ticker_text_en: settings.ticker_text_en || '',
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save(e) {
    e.preventDefault();
    setLoading(true);
    setSaved(false);
    await saveSettings(form);
    setSettings({ ...settings, ...form });
    setLoading(false);
    setSaved(true);
  }

  return (
    <form onSubmit={save} className="space-y-6 max-w-xl">
      <div className="premium-card-bg border border-gray-200 rounded-2xl p-6 space-y-4">
        <h2 className="text-gray-900 font-bold">التواصل</h2>
        <Field label="رقم واتساب (بدون + مثال: 201000446294)" value={form.whatsapp_number} onChange={(v) => setForm({ ...form, whatsapp_number: v })} />
        <Field label="إيميل استقبال نموذج التواصل" value={form.contact_email} onChange={(v) => setForm({ ...form, contact_email: v })} />
        <p className="text-gray-400 text-xs">أسعار وتفاصيل الباقات بقى ليها تبويب مستقل "الباقات" في القائمة الجانبية.</p>
      </div>

      <div className="premium-card-bg border border-gray-200 rounded-2xl p-6 space-y-4">
        <h2 className="text-gray-900 font-bold">روابط التواصل الاجتماعي</h2>
        <Field label="رابط فيسبوك" value={form.facebook_url} onChange={(v) => setForm({ ...form, facebook_url: v })} />
        <Field label="رابط إنستجرام" value={form.instagram_url} onChange={(v) => setForm({ ...form, instagram_url: v })} />
        <Field label="رابط لينكد إن" value={form.linkedin_url} onChange={(v) => setForm({ ...form, linkedin_url: v })} />
        <Field label="رابط تيك توك" value={form.tiktok_url} onChange={(v) => setForm({ ...form, tiktok_url: v })} />
        <Field label="رابط يوتيوب" value={form.youtube_url} onChange={(v) => setForm({ ...form, youtube_url: v })} />
        <Field label="رابط تويتر / X" value={form.twitter_url} onChange={(v) => setForm({ ...form, twitter_url: v })} />
      </div>

      <div className="premium-card-bg border border-gray-200 rounded-2xl p-6 space-y-4">
        <h2 className="text-gray-900 font-bold">التتبع والإعلانات</h2>
        <Field label="معرف Google Analytics (مثال: G-XXXXXXX)" value={form.ga_measurement_id} onChange={(v) => setForm({ ...form, ga_measurement_id: v })} />
        <p className="text-gray-400 text-xs">هتلاقيه من Google Analytics تحت Admin → Data Streams → Measurement ID.</p>
        <Field label="كود تحقق Google Search Console" value={form.search_console_verification} onChange={(v) => setForm({ ...form, search_console_verification: v })} />
        <p className="text-gray-400 text-xs">من search.google.com/search-console → إضافة ملكية → HTML tag، انسخ بس القيمة اللي جوه content="..." هنا.</p>
      </div>

      <div className="premium-card-bg border border-gray-200 rounded-2xl p-6 space-y-4">
        <h2 className="text-gray-900 font-bold">الشريط المتحرك أعلى الموقع</h2>
        <Field label="النص المتحرك (النسخة العربية)" value={form.ticker_text} onChange={(v) => setForm({ ...form, ticker_text: v })} textarea rows={2} />
        <Field label="النص المتحرك (English Version)" value={form.ticker_text_en} onChange={(v) => setForm({ ...form, ticker_text_en: v })} textarea rows={2} />
      </div>

      <div className="premium-card-bg border border-gray-200 rounded-2xl p-6 space-y-4">
        <h2 className="text-gray-900 font-bold">قسم الأرقام والإنجازات</h2>
        <p className="text-amber-700 text-xs bg-amber-50 border border-amber-300 rounded-lg p-3">⚠️ القسم ده مختفي تماماً من الموقع لحد ما تملا رقم واحد على الأقل هنا. متحطش غير أرقام حقيقية.</p>
        <Field label="عدد المشاريع (مثال: 12+)" value={form.stat_projects} onChange={(v) => setForm({ ...form, stat_projects: v })} />
        <Field label="سنوات الخبرة (مثال: 2)" value={form.stat_years} onChange={(v) => setForm({ ...form, stat_years: v })} />
        <Field label="نسبة رضا العملاء (مثال: 95%)" value={form.stat_satisfaction} onChange={(v) => setForm({ ...form, stat_satisfaction: v })} />
        <Field label="الدعم الفني (مثال: 24/7)" value={form.stat_support} onChange={(v) => setForm({ ...form, stat_support: v })} />
      </div>

      <div className="premium-card-bg border border-gray-200 rounded-2xl p-6 space-y-4">
        <h2 className="text-gray-900 font-bold">حجز مكالمة مباشر (اختياري)</h2>
        <Field label="رابط حجز موعد (مثال: من Calendly أو أي أداة حجز)" value={form.calendly_url} onChange={(v) => setForm({ ...form, calendly_url: v })} />
        <p className="text-gray-400 text-xs">لو حطيت رابط هنا، هيظهر زرار "احجز مكالمة" إضافي جنب زرار الواتساب في الموقع. سيبها فاضية لو مش عايز الميزة دي.</p>
      </div>

      <div className="premium-card-bg border border-gray-200 rounded-2xl p-6 space-y-4">
        <h2 className="text-gray-900 font-bold">سياسة الخصوصية</h2>
        <Field label="تاريخ آخر تحديث (عربي - مثال: 30 يوليو 2026)" value={form.privacy_updated_ar} onChange={(v) => setForm({ ...form, privacy_updated_ar: v })} />
        <Field label="Last Updated Date (English - e.g. July 30, 2026)" value={form.privacy_updated_en} onChange={(v) => setForm({ ...form, privacy_updated_en: v })} />
        <p className="text-gray-400 text-xs">حدّث التاريخ ده كل ما تغيّر أي حاجة في محتوى سياسة الخصوصية بنفسك، بدون ما تحتاج تكلمني.</p>
      </div>

      {saved && <p className="text-emerald-600 text-xs">تم الحفظ بنجاح</p>}
      <button disabled={loading} className="gold-bg-gradient text-black font-bold py-3 px-8 rounded-lg disabled:opacity-50">
        {loading ? 'جارٍ الحفظ...' : 'حفظ كل التعديلات'}
      </button>
    </form>
  );
}

/* ============ Security Tab (change password + DB connection guidance) ============ */
function SecurityTab() {
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  async function changePassword(e) {
    e.preventDefault();
    setError('');
    setMsg('');
    if (newPassword !== confirm) {
      setError('كلمة السر وتأكيدها مش متطابقين');
      return;
    }
    setLoading(true);
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newPassword }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || 'حدث خطأ');
      return;
    }
    setMsg('تم تغيير كلمة السر بنجاح. استخدمها في الدخول القادم.');
    setNewPassword('');
    setConfirm('');
  }

  return (
    <div className="max-w-xl space-y-8">
      <div className="premium-card-bg border border-gray-200 rounded-2xl p-6">
        <h2 className="text-gray-900 font-bold mb-4">تغيير كلمة السر</h2>
        <form onSubmit={changePassword} className="space-y-3">
          <input type="password" required placeholder="كلمة السر الجديدة" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900" />
          <input type="password" required placeholder="تأكيد كلمة السر" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900" />
          {error && <p className="text-red-600 text-xs">{error}</p>}
          {msg && <p className="text-emerald-600 text-xs">{msg}</p>}
          <button disabled={loading} className="gold-bg-gradient text-black font-bold py-2 px-6 rounded-lg disabled:opacity-50">
            {loading ? 'جارٍ الحفظ...' : 'تغيير كلمة السر'}
          </button>
        </form>
      </div>

      <div className="premium-card-bg border border-gray-200 rounded-2xl p-6">
        <h2 className="text-gray-900 font-bold mb-2">نسخة احتياطية من بياناتك</h2>
        <p className="text-gray-500 text-xs mb-4">حمّل نسخة من كل بياناتك (المشاريع، الآراء، الأسئلة الشائعة، الإعدادات) كملف على جهازك - احتياطاً لو حصلت أي مشكلة في قاعدة البيانات. كلمة السر نفسها مش موجودة في الملف (محفوظة مشفرة في مكانها فقط).</p>
        <a href="/api/export" download className="inline-block gold-bg-gradient text-black font-bold py-2 px-6 rounded-lg">
          <i className="fa-solid fa-download ml-1" /> تحميل نسخة احتياطية
        </a>
      </div>

      <div className="bg-amber-50 border border-amber-300 text-amber-800 text-xs sm:text-sm rounded-xl p-5 leading-relaxed">
        <i className="fa-solid fa-database ml-1" />
        <strong> عن ربط قاعدة البيانات:</strong> رابط قاعدة البيانات (POSTGRES_URL) لازم يتحط أول مرة من إعدادات Vercel (Environment Variables) - ده الخطوة الوحيدة اللي مينفعش تتم من جوه اللوحة، لأن الموقع محتاج "يعرف" فين قاعدة البيانات قبل ما يقدر يخزن أي حاجة تانية من جواها. بعد الربط الأول، كل حاجة تانية (كلمة السر، المحتوى، الأسعار...) بتتغير من هنا مباشرة. التفاصيل في ملف README.md.
      </div>

      <div className="bg-blue-50 border border-blue-300 text-blue-800 text-xs sm:text-sm rounded-xl p-5 leading-relaxed">
        <i className="fa-solid fa-key ml-1" />
        <strong> مفتاح احتياطي لو نسيت كلمة السر:</strong> كلمة السر الأصلية اللي حطيتها في `ADMIN_PASSWORD_HASH` بإعدادات Vercel بتفضل شغالة دايماً للدخول، حتى لو غيّرت كلمة السر من هنا. يعني لو نسيت كلمة السر الجديدة، ترجع تدخل بالكلمة الأصلية اللي في Vercel، وبعدين تقدر تغيّرها تاني من هنا.
      </div>
    </div>
  );
}
