import { getSettings } from '@/lib/db';

export const metadata = {
  title: 'سياسة الخصوصية',
  robots: { index: true, follow: true },
};

export const dynamic = 'force-dynamic';

export default async function PrivacyPolicy() {
  let settings = {};
  try {
    settings = await getSettings();
  } catch {
    settings = {};
  }
  const LAST_UPDATED = settings.privacy_updated_ar || '30 يوليو 2026';

  return (
    <main className="min-h-screen bg-white px-4 py-16 sm:py-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-4xl font-black text-gray-900 mb-8">سياسة الخصوصية</h1>

        <div className="space-y-6 text-gray-600 text-sm sm:text-base leading-relaxed">
          <p>آخر تحديث: {LAST_UPDATED}</p>

          <section>
            <h2 className="text-gray-900 font-bold text-lg mb-2">١. البيانات اللي بنجمعها</h2>
            <p className="mb-3">
              لما تستخدم نموذج التواصل، بنجمع الاسم ورقم الهاتف وتفاصيل مشروعك اللي تكتبها. لو شاركتنا رأيك عن خدماتنا، بنخزن اسمك وصفتك (اختياري) ونص رأيك وتقييمك.
            </p>
            <p>
              كمان بنسجل عنوان الـ IP بتاع جهازك بشكل مؤقت عند إرسال أي نموذج، وده بس لغرض حماية الموقع من محاولات إغراق الطلبات الآلية (مش لتتبعك أو التعرف عليك).
            </p>
          </section>

          <section>
            <h2 className="text-gray-900 font-bold text-lg mb-2">٢. الكوكيز (Cookies)</h2>
            <p>
              الموقع بيستخدم كوكيز أساسية بس لتشغيله بشكل صحيح (زي حفظ جلسة تسجيل الدخول للوحة التحكم)، وممكن تُستخدم كوكيز خاصة بـ Google Analytics لو كانت مفعّلة لفهم حركة الزوار العامة. مفيش كوكيز إعلانية أو تتبع عبر مواقع تانية.
            </p>
          </section>

          <section>
            <h2 className="text-gray-900 font-bold text-lg mb-2">٣. إزاي بنستخدم البيانات دي</h2>
            <p>
              بنستخدم بيانات التواصل بس للرد على استفسارك ومناقشة مشروعك. آراء العملاء بتظهر بشكل عام على الموقع (الاسم والرأي والتقييم)، ومحدش تاني يقدر يشوف رقم هاتفك أو إيميلك.
            </p>
          </section>

          <section>
            <h2 className="text-gray-900 font-bold text-lg mb-2">٤. تعديل أو حذف رأيك</h2>
            <p>
              لو شاركت رأياً عن خدماتنا، المتصفح اللي استخدمته بيحتفظ برمز خاص يسمحلك تعدل أو تحذف رأيك في أي وقت من نفس القسم في الموقع. لو غيرت المتصفح أو مسحت بيانات التصفح، الرمز ده بيضيع ومحتاج تتواصل معانا مباشرة للحذف.
            </p>
          </section>

          <section>
            <h2 className="text-gray-900 font-bold text-lg mb-2">٥. مين بيشوف بياناتك (أطراف ثالثة)</h2>
            <p className="mb-2">بيانات الموقع بتتعامل معاها الخدمات التالية كجزء من تشغيله:</p>
            <ul className="list-disc pr-6 space-y-1">
              <li><strong>Vercel</strong> - استضافة الموقع نفسه</li>
              <li><strong>Neon</strong> - تخزين قاعدة البيانات (المشاريع، الآراء، الأسئلة الشائعة)</li>
              <li><strong>Formsubmit.co</strong> - توصيل رسائل نموذج التواصل بالإيميل (لو مفعّل)</li>
              <li><strong>Google Fonts وFont Awesome</strong> - تحميل الخطوط والأيقونات (بيوصلهم عنوان الـ IP بتاعك تلقائياً كجزء من تحميل أي موقع بيستخدم خدماتهم)</li>
              <li><strong>Google Analytics</strong> - لو مفعّل من صاحب الموقع، لفهم حركة الزوار العامة</li>
            </ul>
            <p className="mt-2">إحنا مبنبيعش ومبنأجرش بياناتك لأي طرف تالت لأغراض تسويقية.</p>
          </section>

          <section>
            <h2 className="text-gray-900 font-bold text-lg mb-2">٦. مدة الاحتفاظ بالبيانات</h2>
            <p>
              آراء العملاء المنشورة بتفضل محفوظة لحد ما تطلب حذفها بنفسك أو يحذفها صاحب الموقع. رسائل نموذج التواصل بتتبعت مباشرة بالإيميل ومش بتتخزن في قاعدة بيانات الموقع.
            </p>
          </section>

          <section>
            <h2 className="text-gray-900 font-bold text-lg mb-2">٧. حقوقك</h2>
            <p>
              تقدر في أي وقت تطلب معرفة إيه البيانات المحفوظة عنك، تصحيحها، أو حذفها بالكامل - تواصل معنا مباشرة عبر الواتساب أو الإيميل الموجودين في صفحة التواصل وهنستجيب في أقرب وقت ممكن.
            </p>
          </section>

          <section>
            <h2 className="text-gray-900 font-bold text-lg mb-2">٨. تعديلات على هذه السياسة</h2>
            <p>
              ممكن نحدّث السياسة دي من وقت للتاني عشان تعكس أي تغيير في الموقع أو الخدمات المستخدمة. تاريخ "آخر تحديث" فوق دايماً بيوضح آخر مرة اتعدلت فيها.
            </p>
          </section>

          <section>
            <h2 className="text-gray-900 font-bold text-lg mb-2">٩. تواصل معنا</h2>
            <p>لو عندك أي سؤال عن بياناتك أو عايز تحذفها، تواصل معنا عبر الواتساب أو الإيميل الموجودين في صفحة التواصل.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
