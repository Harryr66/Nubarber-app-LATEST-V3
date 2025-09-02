import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Film, CalendarCheck, CreditCard, Users, Contact, BarChart, Check, Calendar } from "lucide-react";

const features = [
  {
    icon: Film,
    title: "Professional Website",
    description: "A beautiful, modern website to showcase your barbershop and attract new clients.",
  },
  {
    icon: CalendarCheck,
    title: "Smart Booking System",
    description: "An intuitive booking system that lets clients schedule appointments 24/7.",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description: "Accept online payments securely. No more cash-only hassles.",
  },
  {
    icon: Users,
    title: "Staff Management",
    description: "Manage your team's schedules, services, and permissions all in one place.",
  },
  {
    icon: Contact,
    title: "Client Management",
    description: "Keep track of client history, preferences, and notes to provide personalized service.",
  },
  {
    icon: BarChart,
    title: "Analytics",
    description: "Gain insights into your business with powerful analytics and reporting tools.",
  },
];

const primaryPlanFeatures = [
    "Professional Website",
    "Smart Booking System",
    "Secure Payments",
    "Staff Management (1 user)",
    "Client Management",
    "Analytics"
]

export default function LandingPage() {
  // Check if this is a subdomain request
  const headersList = headers();
  const host = headersList.get('host') || '';
  
  // Handle dynamic subdomains for barbershops
  if (host.includes('.nubarber.com') && !host.startsWith('www.')) {
    const subdomain = host.split('.')[0];
    
    // Skip reserved subdomains
    if (!['www', 'api', 'admin', 'app', 'dashboard', 'auth', 'login', 'signup'].includes(subdomain)) {
      // Check if this is a valid business slug
      if (subdomain && subdomain.length > 2) {
        // Redirect to the public page with the business slug
        redirect(`/public/${subdomain}`);
      }
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo />
          <div className="flex items-center space-x-4">
            <Link href="/sign-in">
              <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white">
                Login
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button className="bg-black text-white hover:bg-gray-800">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
            The Ultimate Platform for Modern Barbers
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Streamline bookings, manage your team, and boost your income — all from one easy-to-use platform. 
            Get your professional website with integrated payments and client management in seconds.
          </p>
          <Link href="/sign-in">
            <Button size="lg" className="bg-black text-white hover:bg-gray-800 text-lg px-8 py-3">
              Get Started for Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">
            Everything You Need to Succeed
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">
            Simple, Transparent Pricing
          </h2>
          <div className="max-w-md mx-auto">
            <Card className="border-2 border-black shadow-xl">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl text-gray-900">Primary Plan</CardTitle>
                <div className="text-4xl font-bold text-gray-900">$29<span className="text-lg text-gray-600">/month</span></div>
                <p className="text-gray-600">Perfect for most barbershops</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {primaryPlanFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
                <div className="pt-6">
                  <Link href="/sign-in">
                    <Button className="w-full bg-black text-white hover:bg-gray-800">
                      Start Free Trial
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Add-ons</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold text-gray-900">Additional Staff</h4>
                  <p className="text-sm text-gray-600">Add team members to your account</p>
                </div>
                <span className="font-bold text-gray-900">$10/month each</span>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold text-gray-900">Custom Domain</h4>
                  <p className="text-sm text-gray-600">Use your own domain name</p>
                </div>
                <span className="font-bold text-gray-900">$5/month</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Logo />
              <p className="mt-4 text-gray-400">
                The ultimate platform for modern barbers. Streamline your business and grow your income.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/features" className="hover:text-white">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/demo" className="hover:text-white">Demo</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link href="/status" className="hover:text-white">Status</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms-of-service" className="hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 NuBarber. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
