import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-4 text-center">
      <div>
        <p className="text-gold font-black text-6xl sm:text-8xl mb-4 font-mono">404</p>
        <h1 className="text-xl sm:text-2xl font-black text-gray-900 mb-3">الصفحة مش موجودة</h1>
        <p className="text-gray-500 text-sm sm:text-base mb-8">يمكن الرابط اتغيّر أو الصفحة اتشالت.</p>
        <Link href="/" className="inline-block gold-bg-gradient text-black font-black px-6 py-3 rounded-xl hover:opacity-90 transition-all">
          الرجوع للصفحة الرئيسية
        </Link>
      </div>
    </main>
  );
}
