'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import imageCompression from 'browser-image-compression';

const TABS = [
  { id: 'content', label: 'محتوى الموقع' },
  { id: 'sections', label: 'الأقسام الثابتة' },
  { id: 'portfolio', label: 'أعمالنا' },
  { id: 'testimonials', label: 'آراء العملاء' },
  { id: 'faqs', label: 'الأسئلة الشائعة' },
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
        {tab === 'portfolio' && <PortfolioTab items={portfolio} setItems={setPortfolio} />}
        {tab === 'testimonials' && <TestimonialsTab items={testimonials} setItems={setTestimonials} />}
        {tab === 'faqs' && <FaqsTab items={faqs} setItems={setFaqs} />}
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

/* ============ Portfolio Tab ============ */
function PortfolioTab({ items, setItems }) {
  const emptyForm = { title: '', description: '', tag: '', image_url: '', link_url: '' };
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
    setForm({ title: item.title, description: item.description, tag: item.tag || '', image_url: item.image_url || '', link_url: item.link_url || '' });
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
          <textarea required placeholder="وصف مختصر" rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900" />
          <input placeholder="تصنيف" value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900" />
          <ImageUploadField label="صورة المشروع" value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} />
          <input placeholder="رابط المشروع" value={form.link_url} onChange={(e) => setForm({ ...form, link_url: e.target.value })} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900" />
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
    ga_measurement_id: settings.ga_measurement_id || '',
    search_console_verification: settings.search_console_verification || '',
    privacy_updated_ar: settings.privacy_updated_ar || '',
    privacy_updated_en: settings.privacy_updated_en || '',
    calendly_url: settings.calendly_url || '',
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
        <h2 className="text-gray-900 font-bold">التواصل والأسعار</h2>
        <Field label="رقم واتساب (بدون + مثال: 201000446294)" value={form.whatsapp_number} onChange={(v) => setForm({ ...form, whatsapp_number: v })} />
        <Field label="إيميل استقبال نموذج التواصل" value={form.contact_email} onChange={(v) => setForm({ ...form, contact_email: v })} />
        <Field label="سعر الباقة الأساسية" value={form.price_basic} onChange={(v) => setForm({ ...form, price_basic: v })} />
        <Field label="سعر الباقة الاحترافية" value={form.price_pro} onChange={(v) => setForm({ ...form, price_pro: v })} />
        <Field label="سعر الباقة المتكاملة" value={form.price_premium} onChange={(v) => setForm({ ...form, price_premium: v })} />
      </div>

      <div className="premium-card-bg border border-gray-200 rounded-2xl p-6 space-y-4">
        <h2 className="text-gray-900 font-bold">روابط التواصل الاجتماعي</h2>
        <Field label="رابط فيسبوك" value={form.facebook_url} onChange={(v) => setForm({ ...form, facebook_url: v })} />
        <Field label="رابط إنستجرام" value={form.instagram_url} onChange={(v) => setForm({ ...form, instagram_url: v })} />
        <Field label="رابط لينكد إن" value={form.linkedin_url} onChange={(v) => setForm({ ...form, linkedin_url: v })} />
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
