'use client';
import { useState, useEffect } from 'react';

const STRINGS = {
  ar: {
    positionsLabel: 'الوظيفة أو الوظايف اللي مهتم بيها',
    positions: [
      'مبرمج مواقع (Next.js / React)',
      'مصمم UI/UX',
      'مسؤول حسابات عملاء (Account Manager)',
      'دعم فني وتواصل مع العملاء',
      'تسويق رقمي وإدارة محتوى',
      'أخرى',
    ],
    name: 'الاسم بالكامل', namePh: 'الاسم الأول والأخير',
    email: 'البريد الإلكتروني', emailPh: 'you@example.com',
    phone: 'رقم الهاتف', phonePh: '01xxxxxxxxx',
    experience: 'سنوات الخبرة الفعلية (مش شهادات فريلانسر)', experiencePh: 'مثال: سنتين',
    cairoResident: 'مقيم في القاهرة؟',
    yes: 'أيوه', no: 'لأ',
    salary: 'الراتب المتوقع (اختياري)', salaryPh: 'مثال: 8000 جنيه',
    gradYear: 'سنة التخرج', gradYearPh: 'مثال: 2024',
    canStart: 'تقدر تبدأ فوراً؟',
    linkedin: 'لينكدإن أو رابط أعمالك (اختياري)', linkedinPh: 'https://linkedin.com/in/...',
    notes: 'أي حاجة تحب تضيفها (اختياري)',
    cv: 'ارفع السيرة الذاتية (CV)', cvHint: 'PDF يفضل - حد أقصى 10MB',
    submit: 'إرسال الطلب', sending: 'جارٍ الإرسال...',
    successTitle: 'تم استلام طلبك! ✓', successBody: 'هنراجع بياناتك ونتواصل معاك لو في تطابق مع احتياجنا.',
    errorGeneric: 'حصل خطأ أثناء الإرسال، حاول تاني.',
    required: 'الاسم والإيميل والسيرة الذاتية مطلوبين',
  },
  en: {
    positionsLabel: 'Position(s) you are interested in',
    positions: [
      'Web Developer (Next.js / React)',
      'UI/UX Designer',
      'Account Manager',
      'Customer Support',
      'Digital Marketing & Content',
      'Other',
    ],
    name: 'Full Name', namePh: 'First and last name',
    email: 'Email', emailPh: 'you@example.com',
    phone: 'Phone Number', phonePh: '+20 1xxxxxxxxx',
    experience: 'Years of proven experience (freelance work doesn\'t count)', experiencePh: 'e.g. 2 years',
    cairoResident: 'Are you a Cairo resident?',
    yes: 'Yes', no: 'No',
    salary: 'Expected salary (optional)', salaryPh: 'e.g. $200/mo',
    gradYear: 'Graduation Year', gradYearPh: 'e.g. 2024',
    canStart: 'Can you start immediately?',
    linkedin: 'LinkedIn or portfolio link (optional)', linkedinPh: 'https://linkedin.com/in/...',
    notes: 'Anything else you would like to add (optional)',
    cv: 'Upload your CV', cvHint: 'PDF preferred - 10MB max',
    submit: 'Send Application', sending: 'Sending...',
    successTitle: 'Application received! ✓', successBody: "We'll review your info and reach out if there's a match.",
    errorGeneric: 'Something went wrong. Please try again.',
    required: 'Name, email and CV are required',
  },
};

export default function JobApplicationForm({ locale = 'ar', email }) {
  const t = STRINGS[locale] || STRINGS.ar;
  const [positions, setPositions] = useState([]);
  const [honey, setHoney] = useState('');
  const [status, setStatus] = useState('idle');
  const [nextUrl, setNextUrl] = useState('');

  useEffect(() => {
    const path = locale === 'en' ? '/en/careers?submitted=1' : '/careers?submitted=1';
    setNextUrl(window.location.origin + path);
  }, [locale]);

  function togglePosition(opt) {
    setPositions((prev) => (prev.includes(opt) ? prev.filter((x) => x !== opt) : [...prev, opt]));
  }

  async function handleSubmit(e) {
    if (honey) {
      e.preventDefault();
      return;
    }
    setStatus('sending');
    const form = e.target;
    const data = new FormData(form);

    // نحفظ نسخة منظمة (من غير ملف السيرة الذاتية) في قاعدة بياناتنا بالتوازي،
    // من غير ما نعطّل إرسال الفورم الأصلي اللي بيبعت الإيميل مع المرفق
    fetch('/api/job-applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.get('name'),
        email: data.get('email'),
        phone: data.get('phone'),
        positions,
        experience_years: data.get('experience_years'),
        cairo_resident: data.get('cairo_resident'),
        expected_salary: data.get('expected_salary'),
        graduation_year: data.get('graduation_year'),
        can_start_immediately: data.get('can_start_immediately'),
        linkedin: data.get('linkedin'),
        notes: data.get('notes'),
        locale,
      }),
    }).catch(() => null);

    // الفورم الأصلي بيكمل إرساله الطبيعي (multipart مع ملف الـ CV) من غير preventDefault
  }

  return (
    <form
      action={`https://formsubmit.co/${email}`}
      method="POST"
      encType="multipart/form-data"
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <input type="hidden" name="_subject" value="طلب توظيف جديد - موقع Amvora" />
      <input type="hidden" name="_template" value="box" />
      <input type="hidden" name="_captcha" value="false" />
      {nextUrl && <input type="hidden" name="_next" value={nextUrl} />}

      {/* Honeypot */}
      <div style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }} aria-hidden="true">
        <label htmlFor="ja-website-url">اتركه فاضي</label>
        <input id="ja-website-url" type="text" name="website_url" tabIndex={-1} autoComplete="off" value={honey} onChange={(e) => setHoney(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-gray-600 text-xs font-bold block mb-1">{t.name} *</label>
          <input required name="name" placeholder={t.namePh} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900" />
        </div>
        <div>
          <label className="text-gray-600 text-xs font-bold block mb-1">{t.email} *</label>
          <input required type="email" name="email" placeholder={t.emailPh} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900" />
        </div>
      </div>

      <div>
        <label className="text-gray-600 text-xs font-bold block mb-1">{t.phone}</label>
        <input name="phone" placeholder={t.phonePh} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900" />
      </div>

      <div>
        <label className="text-gray-600 text-xs font-bold block mb-2">{t.positionsLabel}</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {t.positions.map((opt) => (
            <label key={opt} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 cursor-pointer hover:border-gold/50">
              <input type="checkbox" checked={positions.includes(opt)} onChange={() => togglePosition(opt)} className="accent-gold w-4 h-4 shrink-0" />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-gray-600 text-xs font-bold block mb-1">{t.experience}</label>
          <input name="experience_years" placeholder={t.experiencePh} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900" />
        </div>
        <div>
          <label className="text-gray-600 text-xs font-bold block mb-1">{t.gradYear}</label>
          <input name="graduation_year" placeholder={t.gradYearPh} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-gray-600 text-xs font-bold block mb-2">{t.cairoResident}</label>
          <div className="flex gap-3">
            <label className="flex items-center gap-2 text-sm text-gray-700"><input type="radio" name="cairo_resident" value={t.yes} className="accent-gold" /> {t.yes}</label>
            <label className="flex items-center gap-2 text-sm text-gray-700"><input type="radio" name="cairo_resident" value={t.no} className="accent-gold" /> {t.no}</label>
          </div>
        </div>
        <div>
          <label className="text-gray-600 text-xs font-bold block mb-2">{t.canStart}</label>
          <div className="flex gap-3">
            <label className="flex items-center gap-2 text-sm text-gray-700"><input type="radio" name="can_start_immediately" value={t.yes} className="accent-gold" /> {t.yes}</label>
            <label className="flex items-center gap-2 text-sm text-gray-700"><input type="radio" name="can_start_immediately" value={t.no} className="accent-gold" /> {t.no}</label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-gray-600 text-xs font-bold block mb-1">{t.salary}</label>
          <input name="expected_salary" placeholder={t.salaryPh} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900" />
        </div>
        <div>
          <label className="text-gray-600 text-xs font-bold block mb-1">{t.linkedin}</label>
          <input name="linkedin" placeholder={t.linkedinPh} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900" dir="ltr" />
        </div>
      </div>

      <div>
        <label className="text-gray-600 text-xs font-bold block mb-1">{t.notes}</label>
        <textarea name="notes" rows="3" className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900" />
      </div>

      <div>
        <label className="text-gray-600 text-xs font-bold block mb-1">{t.cv} *</label>
        <input required type="file" name="resume" accept=".pdf,.doc,.docx" className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 file:ml-3 file:px-3 file:py-1.5 file:rounded-md file:border-0 file:bg-gold/20 file:text-[#8a6d1f] file:font-bold file:text-xs" />
        <p className="text-gray-400 text-[11px] mt-1">{t.cvHint}</p>
      </div>

      <button type="submit" className="w-full gold-bg-gradient hover:opacity-90 text-black font-black py-3.5 rounded-xl transition-all shadow-lg">
        {status === 'sending' ? t.sending : t.submit}
      </button>
    </form>
  );
}
