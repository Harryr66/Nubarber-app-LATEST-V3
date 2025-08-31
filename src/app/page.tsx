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
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex items-center">
            <Logo />
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Button variant="outline" asChild>
                <Link href="/sign-in">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/sign-in">Get Started</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Professional Barbershop
              <span className="block text-blue-200">Booking Platform</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Transform your barbershop with a modern, professional booking system. 
              White-label solutions, customer management, and seamless payments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/sign-up"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-200 inline-block"
              >
                Get Started Free
              </Link>
              <Link
                href="/sign-in"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-200 inline-block"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-blue-900 mb-16">
              Everything Your Barbershop Needs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="text-center p-6">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-blue-900 mb-3">Smart Booking System</h3>
                <p className="text-blue-700">
                  Professional booking calendar with real-time availability, automated confirmations, and customer reminders.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="text-center p-6">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-blue-900 mb-3">Customer Management</h3>
                <p className="text-blue-700">
                  Complete customer profiles, booking history, and communication tools to build lasting relationships.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="text-center p-6">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-blue-900 mb-3">Payment Integration</h3>
                <p className="text-blue-700">
                  Secure payment processing with Stripe, deposit collection, and automated invoicing.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-blue-900 mb-6">
              Ready to Transform Your Barbershop?
            </h2>
            <p className="text-xl text-blue-700 mb-8 max-w-2xl mx-auto">
              Join hundreds of barbershops already using NuBarber to streamline their business and delight their customers.
            </p>
            <Link
              href="/sign-up"
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-lg text-xl font-semibold transition-colors duration-200 inline-block"
            >
              Start Your Free Trial
            </Link>
          </div>
        </section>

        <section id="features" className="py-12 md:py-24 lg:py-32">
          <div className="container">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <h2 className="text-4xl font-bold sm:text-5xl font-headline text-blue-900">Everything You Need to Succeed</h2>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="text-center shadow-lg">
                  <CardHeader>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                      <feature.icon className="h-6 w-6 text-blue-600" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <CardTitle className="font-sans text-xl font-bold text-blue-900">{feature.title}</CardTitle>
                    <p className="text-blue-700 font-sans">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="py-12 md:py-24 lg:py-32">
            <div className="container">
                <div className="mx-auto mb-12 max-w-3xl text-center">
                    <h2 className="font-headline text-4xl font-bold sm:text-5xl text-blue-900">Simple, Transparent Pricing</h2>
                </div>
                <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
                    <Card className="shadow-lg border-blue-600 flex flex-col">
                        <CardHeader className="text-left">
                            <CardTitle className="font-headline text-2xl font-bold text-blue-900">Primary Plan</CardTitle>
                            <p className="font-sans text-4xl font-bold text-blue-900">$30<span className="text-lg font-normal text-blue-600">/month</span></p>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <ul className="space-y-3">
                                {primaryPlanFeatures.map(feature => (
                                    <li key={feature} className="flex items-center gap-2">
                                        <Check className="h-5 w-5 text-green-500" />
                                        <span className="font-sans text-blue-900">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <div className="p-6 pt-0">
                           <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg">Choose Plan</Button>
                        </div>
                    </Card>
                    <Card className="shadow-lg flex flex-col">
                        <CardHeader className="text-left">
                            <CardTitle className="font-headline text-2xl font-bold text-blue-900">Add-ons</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <Card>
                                <CardContent className="p-4">
                                    <h4 className="font-semibold font-sans text-blue-900">Additional Staff</h4>
                                    <p className="font-bold text-lg font-sans text-blue-900">$10<span className="text-sm font-normal text-blue-600">/month per member</span></p>
                                    <p className="text-sm text-blue-700 mt-2 font-sans">Scale your team as your business grows. Add more staff members to your plan at any time.</p>
                                </CardContent>
                            </Card>
                        </CardContent>
                         <div className="p-6 pt-0">
                           <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white" size="lg">Get Started</Button>
                        </div>
                    </Card>
                </div>
            </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2">NuBarber</h3>
            <p className="text-blue-200">Professional barbershop booking platform</p>
          </div>
          <div className="flex justify-center space-x-6 mb-6">
            <a href="/privacy-policy" className="text-blue-300 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="/terms-of-service" className="text-blue-300 hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
          <p className="text-blue-300 text-sm">
            © {new Date().getFullYear()} NuBarber. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
