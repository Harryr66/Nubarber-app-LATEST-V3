export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gray-900 text-white px-6 py-8">
            <h1 className="text-3xl font-bold">Terms of Service for Nubarber</h1>
            <p className="text-gray-300 mt-2">Effective Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          {/* Content */}
          <div className="px-6 py-8 prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6">
              Welcome to Nubarber. These Terms of Service ("Terms") govern your access and use of our online booking platform ("Service").
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-4">
              By using Nubarber, you agree to these Terms. If you do not agree, do not use the Service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Eligibility</h2>
            <p className="text-gray-700 mb-4">
              You must be at least 18 years old to create a barber account. Clients under 18 must have parental consent.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Description of Service</h2>
            <p className="text-gray-700 mb-4">Nubarber provides:</p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4 space-y-1">
              <li>Barbers with customizable booking pages</li>
              <li>Clients with a means to book appointments</li>
              <li>Optional payment/deposit collection tools</li>
              <li>Appointment reminders and business analytics</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. User Accounts</h2>
            
            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">a. Barber Accounts</h3>
            <p className="text-gray-700 mb-4">
              Barbers may create profiles, set availability, and customize their booking page. You are responsible for all activity under your account.
            </p>

            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">b. Client Accounts</h3>
            <p className="text-gray-700 mb-4">
              Clients may book appointments, make payments (if required), and receive notifications.
              You must provide accurate and complete information. Keep your login credentials secure.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Payments and Fees</h2>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4 space-y-1">
              <li>Nubarber may charge a platform fee or collect transaction fees (clearly disclosed during signup or upgrade).</li>
              <li>Deposits and service charges are set by barbers.</li>
              <li>Payment processing is handled by third-party providers. We are not liable for payment issues.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Cancellations and Refunds</h2>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4 space-y-1">
              <li>Barber-specific cancellation/refund policies apply to each appointment.</li>
              <li>Nubarber does not directly issue refunds; barbers are responsible for refund handling.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. License and Restrictions</h2>
            <p className="text-gray-700 mb-4">
              You are granted a limited, non-exclusive, non-transferable license to use the Service.
            </p>
            <p className="text-gray-700 mb-4">You may not:</p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4 space-y-1">
              <li>Use Nubarber for unlawful purposes</li>
              <li>Reverse-engineer or exploit the platform</li>
              <li>Send spam or abuse the messaging system</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Termination</h2>
            <p className="text-gray-700 mb-4">We reserve the right to suspend or terminate accounts that:</p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4 space-y-1">
              <li>Violate these Terms</li>
              <li>Are involved in fraudulent or abusive behavior</li>
            </ul>
            <p className="text-gray-700 mb-4">You may also cancel your account at any time.</p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. Intellectual Property</h2>
            <p className="text-gray-700 mb-4">
              All content, trademarks, and software are the property of Nubarber or its licensors. 
              You may not copy or reuse any part of the platform without permission.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">10. Disclaimer of Warranties</h2>
            <p className="text-gray-700 mb-4">
              The service is provided "as is" without warranties of any kind, either express or implied. 
              We do not guarantee continuous availability or error-free operation.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">11. Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">Nubarber is not liable for:</p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4 space-y-1">
              <li>Missed or canceled appointments</li>
              <li>Disputes between barbers and clients</li>
              <li>Loss of data or revenue</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Our maximum liability is limited to the fees paid to us in the past 3 months.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">12. Governing Law</h2>
            <p className="text-gray-700 mb-4">
              These Terms are governed by the laws of the United Kingdom. Disputes shall be resolved in the courts of the United Kingdom.
            </p>

            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Contact Us</h3>
              <p className="text-gray-700">
                For questions about these Terms, email: <a href="mailto:support@nubarber.com" className="text-blue-600 hover:text-blue-800">support@nubarber.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 