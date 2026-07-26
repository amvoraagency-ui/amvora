export const metadata = {
  title: 'Terms of Service',
  robots: { index: true, follow: true },
};

export default function TermsOfServiceEn() {
  return (
    <main className="min-h-screen bg-white px-4 py-16 sm:py-24" dir="ltr" lang="en">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-4xl font-black text-gray-900 mb-8">Terms of Service</h1>

        <div className="space-y-6 text-gray-600 text-sm sm:text-base leading-relaxed">
          <p>Last updated: {new Date().toLocaleDateString('en-US')}</p>

          <section>
            <h2 className="text-gray-900 font-bold text-lg mb-2">1. Scope of Service</h2>
            <p>
              We provide custom digital platform engineering services (websites, e-commerce stores, and technical integrations) based on requirements agreed in writing with the client before work begins. Any significant change to scope after work has started may require a review of price and timeline.
            </p>
          </section>

          <section>
            <h2 className="text-gray-900 font-bold text-lg mb-2">2. Payment</h2>
            <p>
              The project value and payment schedule (typically a deposit at kickoff, with the remainder due at delivery or at agreed milestones) are agreed explicitly before work begins. Work does not start until the agreed initial deposit is received.
            </p>
          </section>

          <section>
            <h2 className="text-gray-900 font-bold text-lg mb-2">3. Cancellation & Refunds</h2>
            <p>
              If a client cancels a project after work has begun, payment is due for work actually completed up to the cancellation date. The initial deposit is non-refundable once work has started.
            </p>
          </section>

          <section>
            <h2 className="text-gray-900 font-bold text-lg mb-2">4. Code Ownership & Delivery</h2>
            <p>
              Upon full payment, ownership of the final delivered code transfers entirely to the client. Any internal tools or libraries we use generally across multiple projects remain our property and are not included in delivery unless otherwise agreed in writing.
            </p>
          </section>

          <section>
            <h2 className="text-gray-900 font-bold text-lg mb-2">5. Post-Delivery Support</h2>
            <p>
              We provide a limited support window after delivery to fix technical issues arising from the development itself. Any additional development or new features requested after the support window ends are treated as a new, separate engagement.
            </p>
          </section>

          <section>
            <h2 className="text-gray-900 font-bold text-lg mb-2">6. Content Responsibility</h2>
            <p>
              The client is responsible for the accuracy and legality of any content (text, images, data) they request us to publish on their platform. We are not liable for content that violates intellectual property rights or applicable laws when that content was supplied directly by the client.
            </p>
          </section>

          <section>
            <h2 className="text-gray-900 font-bold text-lg mb-2">7. Contact</h2>
            <p>For any questions about these terms, reach us via WhatsApp or the email listed on our contact page.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
