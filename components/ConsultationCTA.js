'use client';
import { useState } from 'react';

const STRINGS = {
  ar: {
    button: 'اطلب استشارة تقنية مجانية',
    title: 'طلب استشارة تقنية مجانية',
    subtitle: 'املأ البيانات دي وهنراجع مشروعك ونرد عليك في أقرب وقت.',
    name: 'الاسم الكريم / المسمى الوظيفي', namePh: 'مثال: أدهم - مدير تنفيذي',
    company: 'اسم الشركة / المشروع (لو موجود)', companyPh: 'اسم المؤسسة أو البراند - سيبها فاضية لو مشروعك شخصي',
    website: 'رابط الموقع الحالي أو حساباتكم الرقمية (اختياري)', websitePh: 'https://... أو رابط صفحة فيسبوك/إنستجرام',
    currentSystem: 'وضعك الحالي',
    currentSystemOptions: ['لا يوجد موقع - هبدأ من الصفر', 'عندي موقع حالي وعايز أطوره أو أستبدله', 'شغال بنظام يدوي (ورق / إكسل) وعايز أحوّله لنظام رقمي', 'عندي نظام قديم وعايز أدمجه مع منصة جديدة', 'مش محتاج موقع دلوقتي - بدور على تسويق وإدارة سوشيال ميديا بس'],
    sector: 'مجال / نشاط الشركة الرئيسي',
    sectorOptions: ['🏗️ مقاولات وإنشاءات', '🏢 تطوير عقاري وتسويق', '🛒 متجر إلكتروني / تجارة تجزئة', '🏥 عيادة / مركز طبي أو استشاري', '💼 خدمات وتخصصات أخرى', '❓ مش متأكد / نشاط مختلط'],
    features: 'الأنظمة والميزات المطلوبة (اختر كل ما ينطبق)',
    featuresOptions: ['نظام حجز أو مواعيد', 'بوابة دفع إلكتروني', 'متجر إلكتروني وإدارة مخزون', 'لوحة تحكم لإدارة المحتوى بنفسي', 'حسابات وعضويات للمستخدمين', 'تتبع الطلبات / الشحنات', 'إدارة محتوى وتسويق سوشيال ميديا', 'تعدد اللغات (عربي/إنجليزي)', 'تقارير وتحليلات مبيعات', 'مش متأكد - محتاج استشارة'],
    goal: 'التحدي الرئيسي أو الهدف من الاستشارة',
    goalOptions: ['بناء موقع/منظومة جديدة بكود مخصص من الصفر', 'استبدال موقع قديم/بطيء أو ووردبريس بحل أسرع وأكثر أماناً', 'أتمتة العمليات (نظام حجوزات، تتبع مشاريع، أو إدارة بيانات)', 'استشارة تقنية عامة لمعرفة الخيار الأنسب لشركتنا'],
    budget: 'الميزانية التقريبية (اختياري)', budgetOptions: ['تفضّل عدم التحديد', 'أقل من 500$', '500$ - 1500$', '1500$ - 5000$', 'أكثر من 5000$'],
    timeline: 'الجدول الزمني المطلوب (اختياري)', timelineOptions: ['تفضّل عدم التحديد', 'عاجل (خلال أسبوعين)', 'خلال شهر', 'خلال 2-3 شهور', 'مرحلة تخطيط مبدئي بس'],
    notes: 'ملاحظات إضافية (اختياري)', notesPh: 'أي تفاصيل تانية تحب تضيفها',
    contact: 'رقم واتساب أو بريد إلكتروني للتواصل', contactPh: 'مثال: 01000000000 أو name@email.com',
    notSpecified: 'غير محدد',
    summaryHeader: 'ملخص طلب استشارة جديد',
    send: 'إرسال الطلب', sending: 'جارٍ الإرسال...', close: 'إغلاق',
    successTitle: 'تم إرسال طلبك بنجاح! ✓', successBody: 'هنراجع بيانات مشروعك ونتواصل معاك في أقرب وقت.',
    errorGeneric: 'حصل خطأ أثناء الإرسال، حاول تاني أو تواصل معنا مباشرة عبر الواتساب.',
    whatsappEscape: 'مش عايز تملى كل ده دلوقتي؟', whatsappEscapeLink: 'كلمنا على الواتساب مباشرة وهنفهم مشروعك من غير أسئلة',
  },
  en: {
    button: 'Request a Free Technical Consultation',
    title: 'Free Technical Consultation Request',
    subtitle: "Fill in the details below and we'll review your project and get back to you shortly.",
    name: 'Your Name / Job Title', namePh: 'e.g. Adham - CEO',
    company: 'Company / Project Name (if any)', companyPh: 'Your organization or brand name - leave blank if personal',
    website: 'Current Website or Social Profile (optional)', websitePh: 'https://... or your Facebook/Instagram link',
    currentSystem: 'Your Current Situation',
    currentSystemOptions: ['No website yet - starting from scratch', 'I have a site and want to upgrade/replace it', 'Running on manual process (paper/Excel), want to digitize it', 'I have an old system to integrate with a new platform', "Don't need a website right now - just marketing & social media"],
    sector: "Company's Main Industry",
    sectorOptions: ['🏗️ Construction & Contracting', '🏢 Real Estate Development & Marketing', '🛒 E-commerce / Retail', '🏥 Clinic / Medical Center', '💼 Other Services', '❓ Not sure / mixed business'],
    features: 'Systems & Features Needed (select all that apply)',
    featuresOptions: ['Booking / appointments system', 'Payment gateway', 'E-commerce store & inventory management', 'CMS dashboard to self-manage content', 'User accounts / membership', 'Order / shipment tracking', 'Social media content & marketing management', 'Multi-language (Arabic/English)', 'Sales reports & analytics', "Not sure - need consultation"],
    goal: 'Main Challenge or Goal',
    goalOptions: ['Building a new website/system with custom code from scratch', 'Replacing an old/slow site or WordPress with a faster, safer solution', 'Automating processes (booking, project tracking, data management)', 'A general technical consultation'],
    budget: 'Approximate Budget (optional)', budgetOptions: ['Prefer not to say', 'Under $500', '$500 - $1,500', '$1,500 - $5,000', 'Over $5,000'],
    timeline: 'Required Timeline (optional)', timelineOptions: ['Prefer not to say', 'Urgent (within 2 weeks)', 'Within a month', 'Within 2-3 months', 'Just planning'],
    notes: 'Additional Notes (optional)', notesPh: 'Any other details',
    contact: 'WhatsApp Number or Email', contactPh: 'e.g. +201000000000 or name@email.com',
    notSpecified: 'Not specified',
    summaryHeader: 'New Consultation Request Summary',
    send: 'Send Request', sending: 'Sending...', close: 'Close',
    successTitle: 'Your request has been sent! ✓', successBody: "We'll review your project and reach out shortly.",
    errorGeneric: 'Something went wrong. Please try again or contact us on WhatsApp.',
    whatsappEscape: "Don't want to fill all this out now?", whatsappEscapeLink: "Message us on WhatsApp directly - we'll figure it out together",
  },
};

export default function ConsultationCTA({ locale = 'ar', email, wa, className }) {
  const t = STRINGS[locale] || STRINGS.ar;
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('idle');
  const [form, setForm] = useState({
    name: '', company: '', website: '', currentSystem: t.currentSystemOptions[0], sector: t.sectorOptions[0],
    features: [], goal: t.goalOptions[0], budget: t.budgetOptions[0], timeline: t.timelineOptions[0],
    notes: '', contact: '', website_url: '',
  });
  function update(field, value) { setForm((f) => ({ ...f, [field]: value })); }
  function toggleFeature(opt) {
    setForm((f) => ({
      ...f,
      features: f.features.includes(opt) ? f.features.filter((x) => x !== opt) : [...f.features, opt],
    }));
  }

  async function submit(e) {
    e.preventDefault();
    setStatus('sending');

    // Honeypot: لو البوت ملأ الحقل المخفي، منكملش
    if (form.website_url) {
      setStatus('success');
      return;
    }

    const na = t.notSpecified;
    const featuresList = form.features.length > 0
      ? form.features.map((f) => `   • ${f}`).join('\n')
      : `   • ${na}`;

    const summary = locale === 'en'
      ? [
        `📋 ${t.summaryHeader}`,
        '',
        `👤 Name: ${form.name}`,
        `🏢 Company: ${form.company || 'Individual / personal project'}`,
        `🌐 Current site/socials: ${form.website || na}`,
        '',
        `📊 Current situation: ${form.currentSystem}`,
        `🏗️ Industry: ${form.sector}`,
        '',
        `✅ Systems & features needed:`,
        featuresList,
        '',
        `🎯 Main goal: ${form.goal}`,
        `💰 Budget: ${form.budget}`,
        `⏱️ Timeline: ${form.timeline}`,
        '',
        `📝 Notes: ${form.notes || na}`,
        '',
        `📞 Preferred contact: ${form.contact}`,
      ].join('\n')
      : [
        `📋 ${t.summaryHeader}`,
        '',
        `👤 الاسم: ${form.name}`,
        `🏢 الشركة: ${form.company || 'مشروع شخصي / لا يوجد'}`,
        `🌐 الموقع/الحسابات الحالية: ${form.website || na}`,
        '',
        `📊 الوضع الحالي: ${form.currentSystem}`,
        `🏗️ المجال: ${form.sector}`,
        '',
        `✅ الأنظمة والميزات المطلوبة:`,
        featuresList,
        '',
        `🎯 الهدف الرئيسي: ${form.goal}`,
        `💰 الميزانية: ${form.budget}`,
        `⏱️ الجدول الزمني: ${form.timeline}`,
        '',
        `📝 ملاحظات: ${form.notes || na}`,
        '',
        `📞 وسيلة التواصل المفضّلة: ${form.contact}`,
      ].join('\n');

    // نبعت بالتوازي: نسخة تتخزن في قاعدة البيانات (كـ Lead) + إيميل فوري للإشعار
    const dbSave = fetch('/api/consultations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name, company: form.company, website: form.website,
        current_system: form.currentSystem, sector: form.sector, features: form.features,
        goal: form.goal, budget: form.budget, timeline: form.timeline, notes: form.notes,
        contact: form.contact, locale, source_page: typeof window !== 'undefined' ? window.location.pathname : '',
        website_url: form.website_url,
      }),
    }).catch(() => null);

    const emailSend = fetch(`https://formsubmit.co/ajax/${email}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        _subject: `طلب استشارة تقنية جديد - ${form.company || form.name}`,
        _template: 'box',
        [t.summaryHeader]: summary,
      }),
    }).catch(() => null);

    const [dbRes, emailRes] = await Promise.all([dbSave, emailSend]);

    if ((dbRes && dbRes.ok) || (emailRes && emailRes.ok)) {
      setStatus('success');
    } else {
      setStatus('error');
    }
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className={className}>{t.button}</button>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8" onClick={(e) => e.stopPropagation()} dir={locale === 'en' ? 'ltr' : 'rtl'}>
            {status === 'success' ? (
              <div className="text-center py-8">
                <i className="fa-solid fa-circle-check text-5xl text-emerald-500 mb-4" />
                <h3 className="text-xl font-black text-gray-900 mb-2">{t.successTitle}</h3>
                <p className="text-gray-500 text-sm mb-6">{t.successBody}</p>
                <button onClick={() => { setOpen(false); setStatus('idle'); }} className="gold-bg-gradient text-black font-bold py-2 px-6 rounded-lg">{t.close}</button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-black text-gray-900">{t.title}</h3>
                    <p className="text-gray-500 text-sm mt-1">{t.subtitle}</p>
                  </div>
                  <button type="button" onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-700 text-xl leading-none">✕</button>
                </div>
                {wa && (
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#25D366]/10 border border-[#25D366]/30 text-[#1a8a4a] text-xs sm:text-sm font-bold rounded-xl px-3 py-2.5 hover:bg-[#25D366]/20 transition-colors">
                    <i className="fa-brands fa-whatsapp text-base shrink-0" />
                    <span>{t.whatsappEscape} <span className="underline">{t.whatsappEscapeLink}</span></span>
                  </a>
                )}
                <div><label className="text-gray-600 text-xs font-bold block mb-1">{t.name}</label>
                  <input required placeholder={t.namePh} value={form.name} onChange={(e) => update('name', e.target.value)} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900" /></div>
                {/* Honeypot - مخفي عن البشر، البوتات بتميل تملأه */}
                <div style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }} aria-hidden="true">
                  <label htmlFor="cc-website-url">اتركه فاضي</label>
                  <input id="cc-website-url" type="text" name="website_url" tabIndex={-1} autoComplete="off" value={form.website_url} onChange={(e) => update('website_url', e.target.value)} />
                </div>
                <div><label className="text-gray-600 text-xs font-bold block mb-1">{t.company}</label>
                  <input placeholder={t.companyPh} value={form.company} onChange={(e) => update('company', e.target.value)} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900" /></div>
                <div><label className="text-gray-600 text-xs font-bold block mb-1">{t.website}</label>
                  <input placeholder={t.websitePh} value={form.website} onChange={(e) => update('website', e.target.value)} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900" /></div>
                <div><label className="text-gray-600 text-xs font-bold block mb-1">{t.currentSystem}</label>
                  <select value={form.currentSystem} onChange={(e) => update('currentSystem', e.target.value)} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900">
                    {t.currentSystemOptions.map((o) => <option key={o} value={o}>{o}</option>)}</select></div>
                <div><label className="text-gray-600 text-xs font-bold block mb-1">{t.sector}</label>
                  <select value={form.sector} onChange={(e) => update('sector', e.target.value)} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900">
                    {t.sectorOptions.map((o) => <option key={o} value={o}>{o}</option>)}</select></div>
                <div>
                  <label className="text-gray-600 text-xs font-bold block mb-2">{t.features}</label>
                  <div className="grid grid-cols-2 gap-2">
                    {t.featuresOptions.map((opt) => (
                      <label key={opt} className="flex items-center gap-2 text-xs text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-2 cursor-pointer hover:border-gold/50">
                        <input type="checkbox" checked={form.features.includes(opt)} onChange={() => toggleFeature(opt)} className="accent-gold w-3.5 h-3.5 shrink-0" />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div><label className="text-gray-600 text-xs font-bold block mb-1">{t.goal}</label>
                  <select value={form.goal} onChange={(e) => update('goal', e.target.value)} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900">
                    {t.goalOptions.map((o) => <option key={o} value={o}>{o}</option>)}</select></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-gray-600 text-xs font-bold block mb-1">{t.budget}</label>
                    <select value={form.budget} onChange={(e) => update('budget', e.target.value)} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900">
                      {t.budgetOptions.map((o) => <option key={o} value={o}>{o}</option>)}</select></div>
                  <div><label className="text-gray-600 text-xs font-bold block mb-1">{t.timeline}</label>
                    <select value={form.timeline} onChange={(e) => update('timeline', e.target.value)} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900">
                      {t.timelineOptions.map((o) => <option key={o} value={o}>{o}</option>)}</select></div>
                </div>
                <div><label className="text-gray-600 text-xs font-bold block mb-1">{t.notes}</label>
                  <textarea rows="2" placeholder={t.notesPh} value={form.notes} onChange={(e) => update('notes', e.target.value)} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900" /></div>
                <div><label className="text-gray-600 text-xs font-bold block mb-1">{t.contact}</label>
                  <input required placeholder={t.contactPh} value={form.contact} onChange={(e) => update('contact', e.target.value)} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900" /></div>
                {status === 'error' && <p className="text-red-600 text-xs">{t.errorGeneric}</p>}
                <button type="submit" disabled={status === 'sending'} className="w-full gold-bg-gradient text-black font-black py-3 rounded-xl disabled:opacity-50">
                  {status === 'sending' ? t.sending : t.send}</button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
