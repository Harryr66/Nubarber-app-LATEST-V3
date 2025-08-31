export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gray-900 text-white px-6 py-8">
            <h1 className="text-3xl font-bold">Privacy Policy for Nubarber</h1>
            <p className="text-gray-300 mt-2">Effective Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          {/* Content */}
          <div className="px-6 py-8 prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6">
              Nubarber ("we," "us," or "our") respects your privacy and is committed to protecting your personal data. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
            
            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">a. Account Information</h3>
            <p className="text-gray-700 mb-4">
              When barbers or clients create an account, we collect:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4 space-y-1">
              <li>Full name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Business name (for barbers)</li>
              <li>Booking preferences</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">b. Booking Data</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4 space-y-1">
              <li>Appointment details (e.g., date, time, service)</li>
              <li>Deposit/payment information (if applicable)</li>
              <li>Communication history</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">c. Payment Data</h3>
            <p className="text-gray-700 mb-4">
              We use third-party payment processors. Payment details (e.g., card numbers) are processed and stored by them 
              (e.g., Stripe, PayPal). We do not store sensitive card information.
            </p>

            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">d. Usage Data</h3>
            <p className="text-gray-700 mb-4">We collect anonymous usage data like:</p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4 space-y-1">
              <li>IP address</li>
              <li>Browser type</li>
              <li>Access times</li>
              <li>Device info</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">We use your information to:</p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4 space-y-1">
              <li>Provide and maintain the booking platform</li>
              <li>Facilitate appointments and transactions</li>
              <li>Customize user experiences (e.g., white-labeled landing pages)</li>
              <li>Send updates, confirmations, and promotional messages (opt-in)</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Sharing Your Information</h2>
            <p className="text-gray-700 mb-4">
              We do not sell your personal information. We may share data with:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4 space-y-1">
              <li>Payment processors</li>
              <li>Hosting and IT providers</li>
              <li>Law enforcement (if required)</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Data Retention</h2>
            <p className="text-gray-700 mb-4">
              We retain your data for as long as your account is active or as needed for legal and operational purposes.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Your Rights</h2>
            <p className="text-gray-700 mb-4">You have the right to:</p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4 space-y-1">
              <li>Access or correct your data</li>
              <li>Request data deletion</li>
              <li>Withdraw consent for marketing</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Email <a href="mailto:privacy@nubarber.com" className="text-blue-600 hover:text-blue-800">privacy@nubarber.com</a> to exercise your rights.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Cookies and Tracking</h2>
            <p className="text-gray-700 mb-4">
              We use cookies to improve performance and analyze traffic. You can control cookies through your browser settings.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Third-Party Links</h2>
            <p className="text-gray-700 mb-4">
              Nubarber may contain links to third-party websites. We are not responsible for their privacy practices.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Children's Privacy</h2>
            <p className="text-gray-700 mb-4">
              Nubarber is not intended for users under 13. We do not knowingly collect personal data from children.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. Changes to This Policy</h2>
            <p className="text-gray-700 mb-4">
              We may update this policy from time to time. You will be notified of significant changes via email or through the app.
            </p>

            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Contact Us</h3>
              <p className="text-gray-700">
                If you have any questions about this Privacy Policy, please contact us at{' '}
                <a href="mailto:privacy@nubarber.com" className="text-blue-600 hover:text-blue-800">privacy@nubarber.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 