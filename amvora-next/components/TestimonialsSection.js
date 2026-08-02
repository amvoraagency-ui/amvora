'use client';
import { useState, useEffect } from 'react';

const STRINGS = {
  ar: {
    empty: 'لسه معندناش آراء - كن أول من يشاركنا رأيه',
    editMine: 'تعديل رأيي',
    deleteMine: 'حذف رأيي',
    shareYours: 'شاركنا رأيك',
    editYours: 'تعديل رأيك',
    namePh: 'اسمك',
    rolePh: 'الصفة (اختياري)',
    quotePh: 'رأيك',
    saving: 'جارٍ الحفظ...',
    saveEdit: 'حفظ التعديل',
    send: 'إرسال',
    cancel: 'إلغاء',
    confirmDelete: 'متأكد إنك عايز تحذف رأيك؟',
    genericError: 'حدث خطأ',
    pending: 'قيد المراجعة - هيظهر للزوار بعد الموافقة',
  },
  en: {
    empty: 'No reviews yet — be the first to share your experience',
    editMine: 'Edit my review',
    deleteMine: 'Delete my review',
    shareYours: 'Share your review',
    editYours: 'Edit your review',
    namePh: 'Your name',
    rolePh: 'Role (optional)',
    quotePh: 'Your review',
    saving: 'Saving...',
    saveEdit: 'Save changes',
    send: 'Submit',
    cancel: 'Cancel',
    confirmDelete: 'Are you sure you want to delete your review?',
    genericError: 'Something went wrong',
    pending: 'Pending review \u2014 will be visible to others once approved',
  },
};

function Stars({ rating, onChange, size = 'text-lg' }) {
  return (
    <div className={`flex gap-1 ${size}`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!onChange}
          onClick={() => onChange && onChange(n)}
          className={n <= rating ? 'text-[#c5a059]' : 'text-gray-300'}
        >
          <i className="fa-solid fa-star" />
        </button>
      ))}
    </div>
  );
}

function getMyReviews() {
  try {
    return JSON.parse(localStorage.getItem('amvora_my_reviews') || '{}');
  } catch {
    return {};
  }
}
function saveMyReview(id, token) {
  const map = getMyReviews();
  map[id] = token;
  localStorage.setItem('amvora_my_reviews', JSON.stringify(map));
}
function removeMyReview(id) {
  const map = getMyReviews();
  delete map[id];
  localStorage.setItem('amvora_my_reviews', JSON.stringify(map));
}

export default function TestimonialsSection({ initialItems, locale = 'ar' }) {
  const t = STRINGS[locale] || STRINGS.ar;
  const [items, setItems] = useState(initialItems || []);
  const [myReviews, setMyReviews] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', role: '', quote: '', rating: 5 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setMyReviews(getMyReviews());
  }, []);

  function startEdit(item) {
    setEditingId(item.id);
    setForm({ name: item.name, role: item.role || '', quote: item.quote, rating: item.rating || 5 });
    setShowForm(true);
  }

  function startNew() {
    setEditingId(null);
    setForm({ name: '', role: '', quote: '', rating: 5 });
    setShowForm(true);
  }

  async function submitReview(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (editingId) {
        const token = myReviews[editingId];
        const res = await fetch('/api/testimonials/token', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, ...form }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || t.genericError);
        setItems(items.map((i) => (i.id === editingId ? data.item : i)));
      } else {
        const res = await fetch('/api/testimonials/public', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || t.genericError);
        saveMyReview(data.item.id, data.edit_token);
        setMyReviews(getMyReviews());
        setItems([data.item, ...items]);
      }
      setShowForm(false);
      setEditingId(null);
      setForm({ name: '', role: '', quote: '', rating: 5 });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteReview(id) {
    if (!confirm(t.confirmDelete)) return;
    const token = myReviews[id];
    await fetch('/api/testimonials/token', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    removeMyReview(id);
    setMyReviews(getMyReviews());
    setItems(items.filter((i) => i.id !== id));
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-10">
        {items.length === 0 && (
          <div className="premium-card-bg border border-dashed border-gray-300 rounded-3xl p-8 flex flex-col items-center justify-center text-center min-h-[200px] md:col-span-3">
            <i className="fa-solid fa-quote-left text-2xl text-[#c5a059]/60 mb-3" />
            <p className="text-gray-500 text-sm">{t.empty}</p>
          </div>
        )}
        {items.map((item) => (
          <div key={item.id} className="premium-card-bg border border-gray-200 rounded-3xl p-6 shadow-lg">
            <Stars rating={item.rating || 5} size="text-sm" />
            <p className="text-gray-600 text-sm leading-relaxed my-3">{item.quote}</p>
            <p className="text-gray-900 font-bold text-sm">{item.name}</p>
            {item.role && <p className="text-gray-500 text-xs">{item.role}</p>}
            {item.approved === false && (
              <p className="text-amber-600 text-xs mt-2 font-bold"><i className="fa-solid fa-clock mr-1" />{t.pending}</p>
            )}
            {myReviews[item.id] && (
              <div className="flex gap-3 mt-3 pt-3 border-t border-gray-200 text-xs">
                <button onClick={() => startEdit(item)} className="text-[#8a6d1f] hover:underline font-bold">
                  {t.editMine}
                </button>
                <button onClick={() => deleteReview(item.id)} className="text-red-600 hover:underline font-bold">
                  {t.deleteMine}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {!showForm && (
        <div className="text-center">
          <button
            onClick={startNew}
            className="border border-[#c5a059]/50 text-[#8a6d1f] font-bold px-6 py-3 rounded-xl hover:bg-[#c5a059]/10 transition-all"
          >
            {t.shareYours}
          </button>
        </div>
      )}

      {showForm && (
        <form onSubmit={submitReview} className="max-w-md mx-auto premium-card-bg border border-gray-200 rounded-2xl p-6 space-y-4">
          <h3 className="text-gray-900 font-bold text-center mb-2">{editingId ? t.editYours : t.shareYours}</h3>
          <div className="flex justify-center">
            <Stars rating={form.rating} onChange={(r) => setForm({ ...form, rating: r })} />
          </div>
          <input
            required
            placeholder={t.namePh}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900"
          />
          <input
            placeholder={t.rolePh}
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900"
          />
          <textarea
            required
            rows="3"
            placeholder={t.quotePh}
            value={form.quote}
            onChange={(e) => setForm({ ...form, quote: e.target.value })}
            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900"
          />
          {error && <p className="text-red-600 text-xs">{error}</p>}
          <div className="flex gap-3">
            <button disabled={loading} className="flex-1 gold-bg-gradient text-black font-bold py-2 rounded-lg disabled:opacity-50">
              {loading ? t.saving : editingId ? t.saveEdit : t.send}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 text-gray-500 text-sm">
              {t.cancel}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
