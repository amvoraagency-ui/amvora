'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'حدث خطأ');
        setLoading(false);
        return;
      }
      router.push('/admin/dashboard');
      router.refresh();
    } catch (err) {
      setError('تعذر الاتصال بالخادم');
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="premium-card-bg border border-gray-200 rounded-3xl p-8 sm:p-10 w-full max-w-sm shadow-2xl">
        <h1 className="text-xl sm:text-2xl font-black text-gray-900 mb-1 text-center">لوحة تحكم Amvora</h1>
        <p className="text-gray-500 text-xs text-center mb-8">دخول خاص بالشركة فقط</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="sr-only" htmlFor="admin-username">اسم المستخدم</label>
          <input
            id="admin-username"
            type="text"
            placeholder="اسم المستخدم"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-gold focus:outline-none"
          />
          <label className="sr-only" htmlFor="admin-password">كلمة السر</label>
          <input
            id="admin-password"
            type="password"
            placeholder="كلمة السر"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-gold focus:outline-none"
          />
          {error && <p className="text-red-600 text-xs">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full gold-bg-gradient text-black font-black py-3 rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
          >
            {loading ? 'جارٍ الدخول...' : 'دخول'}
          </button>
        </form>
      </div>
    </main>
  );
}
