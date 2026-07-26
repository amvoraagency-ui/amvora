export const metadata = {
  title: 'سياسة الخصوصية',
  robots: { index: true, follow: true },
};

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-white px-4 py-16 sm:py-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-4xl font-black text-gray-900 mb-8">سياسة الخصوصية</h1>

        <div className="space-y-6 text-gray-600 text-sm sm:text-base leading-relaxed">
          <p>آخر تحديث: {new Date().toLocaleDateString('ar-EG')}</p>

          <section>
            <h2 className="text-gray-900 font-bold text-lg mb-2">١. البيانات اللي بنجمعها</h2>
            <p>
              لما تستخدم نموذج التواصل، بنجمع الاسم ورقم الهاتف وتفاصيل مشروعك اللي تكتبها. لو شاركتنا رأيك عن خدماتنا، بنخزن اسمك وصفتك (اختياري) ونص رأيك وتقييمك.
            </p>
          </section>

          <section>
            <h2 className="text-gray-900 font-bold text-lg mb-2">٢. إزاي بنستخدم البيانات دي</h2>
            <p>
              بنستخدم بيانات التواصل بس للرد على استفسارك ومناقشة مشروعك. آراء العملاء بتظهر بشكل عام على الموقع (الاسم والرأي والتقييم)، ومحدش تاني يقدر يشوف رقم هاتفك أو إيميلك.
            </p>
          </section>

          <section>
            <h2 className="text-gray-900 font-bold text-lg mb-2">٣. تعديل أو حذف رأيك</h2>
            <p>
              لو شاركت رأياً عن خدماتنا، المتصفح اللي استخدمته بيحتفظ برمز خاص يسمحلك تعدل أو تحذف رأيك في أي وقت من نفس القسم في الموقع. لو غيرت المتصفح أو مسحت بيانات التصفح، الرمز ده بيضيع ومحتاج تتواصل معانا مباشرة للحذف.
            </p>
          </section>

          <section>
            <h2 className="text-gray-900 font-bold text-lg mb-2">٤. أدوات التحليل (Analytics)</h2>
            <p>
              ممكن نستخدم Google Analytics لفهم عدد الزوار وسلوكهم العام على الموقع (زي الصفحات الأكثر زيارة)، من غير ما يحدد هويتك الشخصية بشكل مباشر.
            </p>
          </section>

          <section>
            <h2 className="text-gray-900 font-bold text-lg mb-2">٥. مشاركة البيانات</h2>
            <p>
              إحنا مبنبيعش أو مبنأجرش بياناتك لأي طرف تالت. البيانات بتتخزن على خدمات استضافة موثوقة (Vercel) وما بتتشاركش إلا لو طلب منا ده بشكل قانوني.
            </p>
          </section>

          <section>
            <h2 className="text-gray-900 font-bold text-lg mb-2">٦. تواصل معنا</h2>
            <p>لو عندك أي سؤال عن بياناتك أو عايز تحذفها، تواصل معنا عبر الواتساب أو الإيميل الموجودين في صفحة التواصل.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
