import { getSettings } from '@/lib/db';

export const metadata = {
  title: 'Privacy Policy',
  robots: { index: true, follow: true },
};

export const dynamic = 'force-dynamic';

export default async function PrivacyPolicyEn() {
  let settings = {};
  try {
    settings = await getSettings();
  } catch {
    settings = {};
  }
  const LAST_UPDATED = settings.privacy_updated_en || 'July 30, 2026';

  return (
    <main className="min-h-screen bg-white px-4 py-16 sm:py-24" dir="ltr" lang="en">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-4xl font-black text-gray-900 mb-8">Privacy Policy</h1>

        <div className="space-y-6 text-gray-600 text-sm sm:text-base leading-relaxed">
          <p>Last updated: {LAST_UPDATED}</p>

          <section>
            <h2 className="text-gray-900 font-bold text-lg mb-2">1. Information We Collect</h2>
            <p className="mb-3">
              When you use our contact form, we collect the name, phone number, and project details you provide. If you share a review of our services, we store your name, role (optional), review text, and rating.
            </p>
            <p>
              We also temporarily log your device&apos;s IP address when you submit any form, solely to protect the site against automated spam and abuse (not to track or identify you).
            </p>
          </section>

          <section>
            <h2 className="text-gray-900 font-bold text-lg mb-2">2. Cookies</h2>
            <p>
              The site uses essential cookies only to function correctly (such as keeping the admin dashboard login session active), and may use Google Analytics cookies if enabled to understand general visitor traffic. We do not use advertising or cross-site tracking cookies.
            </p>
          </section>

          <section>
            <h2 className="text-gray-900 font-bold text-lg mb-2">3. How We Use This Information</h2>
            <p>
              Contact information is used solely to respond to your inquiry and discuss your project. Reviews are displayed publicly on our site (name, review, and rating) — your phone number or email is never shown to anyone else.
            </p>
          </section>

          <section>
            <h2 className="text-gray-900 font-bold text-lg mb-2">4. Editing or Deleting Your Review</h2>
            <p>
              If you submit a review, your browser retains a private token that lets you edit or delete it at any time from the same section of the site. If you switch browsers or clear your browsing data, this token is lost and you&apos;ll need to contact us directly for removal.
            </p>
          </section>

          <section>
            <h2 className="text-gray-900 font-bold text-lg mb-2">5. Who Sees Your Data (Third Parties)</h2>
            <p className="mb-2">The following services are involved in running this site:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Vercel</strong> - hosts the website itself</li>
              <li><strong>Neon</strong> - stores our database (projects, reviews, FAQs)</li>
              <li><strong>Formsubmit.co</strong> - delivers contact form messages by email (if enabled)</li>
              <li><strong>Google Fonts and Font Awesome</strong> - load fonts and icons (your IP address is automatically sent to them as part of loading any site that uses these services)</li>
              <li><strong>Google Analytics</strong> - if enabled by the site owner, to understand general visitor traffic</li>
            </ul>
            <p className="mt-2">We do not sell or rent your data to any third party for marketing purposes.</p>
          </section>

          <section>
            <h2 className="text-gray-900 font-bold text-lg mb-2">6. Data Retention</h2>
            <p>
              Published reviews remain stored until you request their removal or the site owner removes them. Contact form messages are sent directly by email and are not stored in the site&apos;s database.
            </p>
          </section>

          <section>
            <h2 className="text-gray-900 font-bold text-lg mb-2">7. Your Rights</h2>
            <p>
              You can request to know what data we hold about you, correct it, or have it fully deleted at any time — reach us via WhatsApp or the email on our contact page and we&apos;ll respond as soon as possible.
            </p>
          </section>

          <section>
            <h2 className="text-gray-900 font-bold text-lg mb-2">8. Changes to This Policy</h2>
            <p>
              We may update this policy from time to time to reflect changes to the site or the services it uses. The &quot;Last updated&quot; date above always reflects the most recent revision.
            </p>
          </section>

          <section>
            <h2 className="text-gray-900 font-bold text-lg mb-2">9. Contact</h2>
            <p>If you have any questions about your data or want it removed, reach us via WhatsApp or the email on our contact page.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
