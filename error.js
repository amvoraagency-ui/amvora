'use client';

export default function Error({ reset }) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-4 text-center">
      <div>
        <i className="fa-solid fa-triangle-exclamation text-gold text-5xl mb-4" />
        <h1 className="text-xl sm:text-2xl font-black text-gray-900 mb-3">حصل خطأ غير متوقع</h1>
        <p className="text-gray-500 text-sm sm:text-base mb-8">حاول تاني، ولو المشكلة استمرت تواصل معانا.</p>
        <button onClick={() => reset()} className="inline-block gold-bg-gradient text-black font-black px-6 py-3 rounded-xl hover:opacity-90 transition-all">
          حاول تاني
        </button>
      </div>
    </main>
  );
}
