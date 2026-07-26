export const metadata = {
  title: 'الشروط والأحكام',
  robots: { index: true, follow: true },
};

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-white px-4 py-16 sm:py-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-4xl font-black text-gray-900 mb-8">الشروط والأحكام</h1>

        <div className="space-y-6 text-gray-600 text-sm sm:text-base leading-relaxed">
          <p>آخر تحديث: {new Date().toLocaleDateString('ar-EG')}</p>

          <section>
            <h2 className="text-gray-900 font-bold text-lg mb-2">١. نطاق الخدمة</h2>
            <p>
              نقدم خدمات هندسة وتطوير منصات رقمية مخصصة (مواقع، متاجر إلكترونية، وتكاملات برمجية) بناءً على المتطلبات المتفق عليها مع العميل كتابةً قبل بدء العمل. أي تعديل جوهري على النطاق بعد البدء قد يستلزم مراجعة السعر والمدة.
            </p>
          </section>

          <section>
            <h2 className="text-gray-900 font-bold text-lg mb-2">٢. الدفع</h2>
            <p>
              يتم الاتفاق على قيمة المشروع وجدول الدفعات (عادةً دفعة مقدمة عند البدء، والباقي عند التسليم أو على مراحل متفق عليها) بشكل صريح قبل بدء التنفيذ. لا يبدأ العمل الفعلي إلا بعد استلام الدفعة الأولى المتفق عليها.
            </p>
          </section>

          <section>
            <h2 className="text-gray-900 font-bold text-lg mb-2">٣. الإلغاء والاسترجاع</h2>
            <p>
              في حال رغب العميل في إلغاء المشروع بعد بدء العمل، تُستحق الدفعات مقابل الأعمال المنجزة فعلياً حتى تاريخ الإلغاء، ولا تُسترد الدفعة المقدمة إذا كان العمل قد بدأ بالفعل.
            </p>
          </section>

          <section>
            <h2 className="text-gray-900 font-bold text-lg mb-2">٤. ملكية الكود والتسليم</h2>
            <p>
              بعد سداد كامل قيمة المشروع، تنتقل ملكية الكود المُسلَّم النهائي للعميل بالكامل. أي أدوات أو مكتبات داخلية نستخدمها بشكل عام عبر مشاريع متعددة تظل ملكاً لنا، ولا تُمنح كجزء من التسليم إلا إذا اتُفق على غير ذلك كتابةً.
            </p>
          </section>

          <section>
            <h2 className="text-gray-900 font-bold text-lg mb-2">٥. الدعم الفني بعد التسليم</h2>
            <p>
              نوفر فترة دعم فني محدودة بعد التسليم لإصلاح أي مشكلة تقنية ناتجة عن التطوير نفسه. أي تطوير أو ميزات إضافية بعد انتهاء فترة الدعم تُعامل كمشروع أو طلب جديد منفصل.
            </p>
          </section>

          <section>
            <h2 className="text-gray-900 font-bold text-lg mb-2">٦. مسؤولية المحتوى</h2>
            <p>
              العميل مسؤول عن دقة وقانونية أي محتوى (نصوص، صور، بيانات) يطلب منا نشره على منصته. لا نتحمل مسؤولية أي محتوى يخالف حقوق ملكية فكرية أو قوانين معمول بها ويكون العميل قد قدمه لنا مباشرة.
            </p>
          </section>

          <section>
            <h2 className="text-gray-900 font-bold text-lg mb-2">٧. التواصل</h2>
            <p>لأي استفسار حول هذه الشروط، تواصل معنا عبر الواتساب أو الإيميل الموجودين في صفحة التواصل.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
