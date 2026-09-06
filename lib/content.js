import {
  getPortfolioItems,
  getTestimonials,
  getSettings,
  getFaqs,
  getHeroSlides,
  getContentBlocks,
  getPricingPlans,
} from '@/lib/db';

export { readingTime } from '@/lib/readingTime';

export async function safe(fn, fallback) {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export const DEFAULT_REALITY = [
  { icon: 'fa-city', title: 'في قطاع العقارات والإنشاءات:', body: 'الاعتماد على نصوص عشوائية دون إبراز للمشاريع بشكل منظم برمجياً، مما يجعل واجهة الموقع تبدو غير احترافية ولا تعكس جودة عمل الشركة على أرض الواقع.', body2: 'نهندس واجهات رقمية مخصصة تستعرض المشاريع الإنشائية بانسيابية فنية عالية، مما يعطي انطباعاً فورياً بالموثوقية العالية والجدية التقنية أمام العملاء والمستثمرين.' },
  { icon: 'fa-bag-shopping', title: 'في قطاع المتاجر والبراندات:', body: 'موقع مثقل بقوالب برمجية تجارية مكررة وبطيئة التحميل، تؤدي إلى تشتيت الزوار وتقليل معدلات الشراء الفورية بسبب انعدام السلاسة الفنية.', body2: 'بناء برمجي مستقل وسريع يمنع ارتداد الزائر، مع تصميم واجهات تبرز المنتجات بشكل احترافي مريح لتجربة مستخدم متكاملة تزيد من استجابة العميل لإتمام الطلب.' },
  { icon: 'fa-user-doctor', title: 'في المهن الحرة والاستشارية:', body: 'الاعتماد الكامل على صفحات التواصل الاجتماعي فقط، وهو ما يحد من مصداقيتك أمام عميل يبحث عنك بالاسم ولا يجد موقعاً رسمياً يوثّق خبرتك ومؤهلاتك.', body2: 'موقع تعريفي مخصص يعرض خبراتك ومؤهلاتك وأسلوب تواصلك بشكل منظم، ويكون أول ما يظهر لأي عميل يبحث عن اسمك أو تخصصك.' },
];

export const DEFAULT_STRATEGIC_VALUE = [
  { icon: 'fa-clock', title: 'متاح على مدار اليوم', body: 'موقعك الإلكتروني متاح على مدار الساعة، مما يسمح للعملاء المحتملين بالتعرف على خدماتك ومنتجاتك والوصول إليك في أي وقت ومن أي مكان.' },
  { icon: 'fa-shield-heart', title: 'بناء الموثوقية والثقة', body: 'يمنح الموقع المحترف والمنظم انطباعاً إيجابياً وفخماً فورياً عن مؤسستك، مما يعزز من مصداقية عملك ويزيد من ثقة وولاء العملاء بك.' },
  { icon: 'fa-images', title: 'استعراض شامل وتفاعلي', body: 'يمكنك عرض باقة منتجاتك وخدماتك بكافة تفاصيلها الفنية بشكل منظم كلياً، مدعومة بالصور الحية ومقاطع الفيديو التوضيحية الجذابة.' },
  { icon: 'fa-headset', title: 'قناة مركزية للدعم', body: 'يمكن استخدام منصتك الرقمية كقناة مباشرة وفعالة للرد على كافة استفسارات العملاء، وتلقي الطلبات، وتقديم الدعم الفني السريع بمرونة تامة.' },
  { icon: 'fa-bullseye', title: 'قلب الاستراتيجية التسويقية', body: 'يعتبر الموقع الوجهة الأساسية التي يتم توجيه الزوار المهتمين والمستثمرين إليها من مختلف الحملات الإعلانية الممولة لتحويلهم إلى صفقات فعلية.' },
  { icon: 'fa-cart-shopping', title: 'قناة بيع جديدة ومستمرة', body: 'يفتح المتجر الإلكتروني المخصص للبراند منافذ تعاقدات ومبيعات متجددة تعمل بكفاءة على مدار الساعة لضمان نمو واستدامة حركة التدفق النقدي.' },
];

export const DEFAULT_SPECIALTIES = [
  { icon: 'fa-city', title: 'الأبراج العقارية والإنشائية', body: 'نهندس لشركات التطوير العقاري والمقاولات واجهات رقمية تعكس جودة ومقاييس مشاريعكم على أرض الواقع، مع استعراض منظم للمشاريع ونماذج طلب استشارة مجهزة لاستقبال بيانات المهتمين بدقة.', tag: 'Real Estate & Towers //' },
  { icon: 'fa-bag-shopping', title: 'المتاجر الإلكترونية المخصصة', body: 'نبني متاجر متكاملة تركز على سرعة التحميل والاستجابة لتقليل ارتداد الزوار، مقتدين بالمقاييس التقنية المعتمدة في كبرى المنصات العالمية لزيادة معدلات التحويل.', tag: 'High-Conversion E-Commerce //' },
  { icon: 'fa-address-card', title: 'المواقع التعريفية للمهنيين وأصحاب الأعمال', body: 'مهما كان مجال عملك - طبيب، مهندس، مكتب استشاري، مطعم، كافيه، محل تجاري، أو حتى علامتك الشخصية - نصمم لك موقعاً تعريفياً احترافياً يعرض خبرتك وخدماتك بشكل منظم، ويكون أول ما يظهر لأي عميل يبحث عن اسمك أو تخصصك.', tag: 'Professional Profile Sites //' },
  { icon: 'fa-code-branch', title: 'التكامل والربط البرمجي', body: 'نوفر تكاملاً برمجياً مخصصاً لربط بوابات الدفع والتقسيط الإقليمية مع إعداد متطور لأنظمة التتبع والتحليل الرقمي، لضمان دقة تدفق البيانات وثبات أداء المنصة.', tag: 'Custom API Integrations //' },
  { icon: 'fa-bullhorn', title: 'إدارة وتسويق المحتوى', body: 'ندير صفحاتك على السوشيال ميديا (فيسبوك، إنستجرام) بمحتوى مخطط له استراتيجياً يعكس هوية علامتك التجارية، ويكمّل موقعك الإلكتروني بحضور رقمي متكامل بدل ما يفضل الموقع لوحده.', tag: 'Content & Social Media //' },
];

export const DEFAULT_PROCESS = [
  { title: 'استشارة مبدئية', body: 'نسمع فكرتك ومتطلبات مشروعك عبر الواتساب ونحدد الأنسب لك.' },
  { title: 'تصميم وعرض', body: 'نجهز تصور مبدئي لشكل المنصة قبل البدء في البناء الفعلي.' },
  { title: 'بناء وربط تقني', body: 'هندسة الكود، وربط بوابات الدفع وأدوات التحليل حسب مشروعك.' },
  { title: 'تسليم ودعم فني', body: 'تسليم المنصة مع فترة دعم فني مكفولة للتأكد من استقرارها.' },
];

export const DEFAULT_REALITY_EN = [
  { icon: 'fa-city', title: 'In real estate & construction:', body: 'Relying on generic text without a properly engineered project showcase makes the site feel unprofessional and undersells the quality of real work.', body2: 'We engineer custom digital interfaces that present construction projects with high production polish, giving investors and clients an instant sense of credibility.' },
  { icon: 'fa-bag-shopping', title: 'In retail & brands:', body: 'A site loaded with repetitive, slow commercial templates distracts visitors and lowers instant purchase rates due to poor technical fluidity.', body2: 'An independent, fast build prevents bounce, with interfaces that showcase products professionally for a smooth experience that increases order completion.' },
  { icon: 'fa-user-doctor', title: 'In consulting & independent professions:', body: 'Relying entirely on social media pages limits your credibility when a client searches for you by name and finds no official site documenting your experience.', body2: 'A dedicated profile site presents your experience, qualifications, and communication style in an organized way, and becomes the first thing that appears when anyone searches your name.' },
];

export const DEFAULT_STRATEGIC_VALUE_EN = [
  { icon: 'fa-clock', title: 'Available Around the Clock', body: 'Your website is available 24/7, letting potential clients discover your services and reach you anytime, from anywhere.' },
  { icon: 'fa-shield-heart', title: 'Builds Trust & Credibility', body: 'A professional, organized website gives an instant premium impression of your business, boosting credibility and client loyalty.' },
  { icon: 'fa-images', title: 'Comprehensive Interactive Showcase', body: 'Display your full product and service lineup in complete organized detail, supported by live photos and compelling explainer videos.' },
  { icon: 'fa-headset', title: 'A Central Support Channel', body: 'Your digital platform can serve as a direct, effective channel to answer client inquiries, take orders, and provide fast technical support.' },
  { icon: 'fa-bullseye', title: 'The Heart of Your Marketing Strategy', body: 'Your website is the primary destination interested visitors and investors are directed to from paid campaigns, converting them into real deals.' },
  { icon: 'fa-cart-shopping', title: 'A New, Continuous Sales Channel', body: 'A dedicated online store opens up recurring sales channels that operate efficiently around the clock, ensuring growth and steady cash flow.' },
];

export const DEFAULT_SPECIALTIES_EN = [
  { icon: 'fa-city', title: 'Real Estate & Construction Towers', body: 'We engineer digital interfaces for developers and contractors that reflect the real quality of your projects, with organized project showcases and consultation forms ready to capture investor interest accurately.', tag: 'Real Estate & Towers //' },
  { icon: 'fa-bag-shopping', title: 'Custom E-Commerce Stores', body: 'We build fully integrated stores focused on load speed and responsiveness to reduce bounce rates, following the technical standards of major global platforms to boost conversion rates.', tag: 'High-Conversion E-Commerce //' },
  { icon: 'fa-address-card', title: 'Professional Profile Sites', body: "Whatever your field - doctor, engineer, consultant, restaurant, cafe, retail shop, or personal brand - we design a professional profile site that organizes your experience and services, and becomes the first thing a client finds when they search your name or specialty.", tag: 'Professional Profile Sites //' },
  { icon: 'fa-code-branch', title: 'Custom API Integrations', body: 'We provide custom technical integration for regional payment and installment gateways, with advanced tracking and analytics setup to ensure accurate data flow and stable platform performance.', tag: 'Custom API Integrations //' },
  { icon: 'fa-bullhorn', title: 'Content & Social Media Management', body: 'We manage your Facebook and Instagram pages with strategically planned content that reflects your brand identity, complementing your website with a complete digital presence.', tag: 'Content & Social Media //' },
];

export const DEFAULT_PROCESS_EN = [
  { title: 'Initial Consultation', body: 'We hear your idea and project requirements over WhatsApp and define the best fit for you.' },
  { title: 'Design & Preview', body: "We prepare an initial preview of the platform's look before actual development begins." },
  { title: 'Build & Technical Integration', body: 'Engineering the code, integrating payment gateways and analytics tools per your project.' },
  { title: 'Delivery & Support', body: 'Delivering the platform with a guaranteed support period to ensure it runs smoothly.' },
];

export async function fetchSiteContent(locale = 'ar') {
  const [portfolioItems, testimonialItems, settings, faqs, heroSlides, realityDb, strategicDb, specialtiesDb, processDb, pricingPlans] = await Promise.all([
    safe(getPortfolioItems, []),
    safe(getTestimonials, []),
    safe(getSettings, {}),
    safe(() => getFaqs(locale), []),
    safe(getHeroSlides, []),
    safe(() => getContentBlocks('reality', locale), []),
    safe(() => getContentBlocks('strategic_value', locale), []),
    safe(() => getContentBlocks('specialties', locale), []),
    safe(() => getContentBlocks('process', locale), []),
    safe(() => getPricingPlans(locale), []),
  ]);

  const isEn = locale === 'en';
  const reality = realityDb.length > 0 ? realityDb : (isEn ? DEFAULT_REALITY_EN : DEFAULT_REALITY);
  const strategicValue = strategicDb.length > 0 ? strategicDb : (isEn ? DEFAULT_STRATEGIC_VALUE_EN : DEFAULT_STRATEGIC_VALUE);
  const specialties = specialtiesDb.length > 0 ? specialtiesDb : (isEn ? DEFAULT_SPECIALTIES_EN : DEFAULT_SPECIALTIES);
  const processSteps = processDb.length > 0 ? processDb : (isEn ? DEFAULT_PROCESS_EN : DEFAULT_PROCESS);

  const waMessage = encodeURIComponent(isEn ? "Hi 👋, I saw the Amvora website and I'd like to ask about your services." : 'مرحباً 👋، شايف موقع Amvora وحابب أستفسر عن خدماتكم.');
  const wa = `https://wa.me/${settings.whatsapp_number || '201000446294'}?text=${waMessage}`;

  return { portfolioItems, testimonialItems, settings, faqs, heroSlides, reality, strategicValue, specialties, processSteps, pricingPlans, wa };
}
