import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-black">NUBARBER</div>
          <div className="flex items-center space-x-4">
            <Link href="/sign-in">
              <button className="px-4 py-2 text-black border border-black rounded hover:bg-black hover:text-white transition-colors">
                Login
              </button>
            </Link>
            <Link href="/sign-up">
              <button className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          The Ultimate Platform for Modern Barbers
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          Streamline bookings, manage your team, and boost your income — all from one easy-to-use platform. 
          Get your professional website with integrated payments and client management in seconds.
        </p>
        <Link href="/sign-up">
          <button className="bg-black text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-colors">
            Get Started for Free
          </button>
        </Link>
      </main>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything You Need to Succeed
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-black rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">📅</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Booking System</h3>
              <p className="text-gray-600">Automated scheduling with real-time availability and instant confirmations.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-black rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">💳</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Integrated Payments</h3>
              <p className="text-gray-600">Accept deposits and payments seamlessly with Stripe integration.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-black rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Team Management</h3>
              <p className="text-gray-600">Manage staff schedules, services, and client relationships effortlessly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Simple, Transparent Pricing
          </h2>
          
          {/* Main Plan */}
          <div className="max-w-md mx-auto bg-white border-2 border-black rounded-lg p-8 text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Primary Plan</h3>
            <div className="text-4xl font-bold text-gray-900 mb-6">$29<span className="text-lg text-gray-600">/month</span></div>
            <ul className="text-left space-y-3 mb-8">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Unlimited bookings
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Custom booking page
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Payment processing
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Client management
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Up to 1 staff member
              </li>
            </ul>
            <Link href="/sign-up">
              <button className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                Start Free Trial
              </button>
            </Link>
          </div>

          {/* Add-ons */}
          <div className="max-w-md mx-auto">
            <h3 className="text-xl font-bold text-center text-gray-900 mb-6">Add-ons</h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Additional Staff</h4>
                  <p className="text-sm text-gray-600">Add more team members to your account</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">$9.99</div>
                  <div className="text-sm text-gray-600">per staff/month</div>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p>• Each additional staff member gets their own login</p>
                <p>• Individual schedules and availability</p>
                <p>• Separate client management</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">NUBARBER</h3>
              <p className="text-gray-400">The ultimate platform for modern barbers.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/privacy-policy" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="/terms-of-service" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 NUBARBER. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
