export const metadata = {
  title: 'Privacy Policy',
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyEn() {
  return (
    <main className="min-h-screen bg-white px-4 py-16 sm:py-24" dir="ltr" lang="en">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-4xl font-black text-gray-900 mb-8">Privacy Policy</h1>

        <div className="space-y-6 text-gray-600 text-sm sm:text-base leading-relaxed">
          <p>Last updated: {new Date().toLocaleDateString('en-US')}</p>

          <section>
            <h2 className="text-gray-900 font-bold text-lg mb-2">1. Information We Collect</h2>
            <p>
              When you use our contact form, we collect the name, phone number, and project details you provide. If you share a review of our services, we store your name, role (optional), review text, and rating.
            </p>
          </section>

          <section>
            <h2 className="text-gray-900 font-bold text-lg mb-2">2. How We Use This Information</h2>
            <p>
              Contact information is used solely to respond to your inquiry and discuss your project. Reviews are displayed publicly on our site (name, review, and rating) — your phone number or email is never shown to anyone else.
            </p>
          </section>

          <section>
            <h2 className="text-gray-900 font-bold text-lg mb-2">3. Editing or Deleting Your Review</h2>
            <p>
              If you submit a review, your browser retains a private token that lets you edit or delete it at any time from the same section of the site. If you switch browsers or clear your browsing data, this token is lost and you&apos;ll need to contact us directly for removal.
            </p>
          </section>

          <section>
            <h2 className="text-gray-900 font-bold text-lg mb-2">4. Analytics</h2>
            <p>
              We may use Google Analytics to understand overall visitor behavior (such as most-visited pages), without directly identifying you personally.
            </p>
          </section>

          <section>
            <h2 className="text-gray-900 font-bold text-lg mb-2">5. Data Sharing</h2>
            <p>
              We do not sell or rent your data to any third party. Data is stored on trusted hosting infrastructure (Vercel) and is only shared if legally required.
            </p>
          </section>

          <section>
            <h2 className="text-gray-900 font-bold text-lg mb-2">6. Contact</h2>
            <p>If you have any questions about your data or want it removed, reach us via WhatsApp or the email on our contact page.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
