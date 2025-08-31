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
        <section className="py-20 md:py-32 lg:py-40">
          <div className="container text-center">
            <div className="mx-auto max-w-4xl space-y-6">
              <h1 className="font-headline text-5xl font-bold sm:text-6xl md:text-7xl">
                The Ultimate Platform for Modern Barbers
              </h1>
              <p className="text-lg text-muted-foreground font-sans">
                Streamline bookings, manage your team, and boost your income — all from one easy-to-use platform. Get your professional website with integrated payments and client management in seconds.
              </p>
              <Button size="lg" asChild>
                <Link href="/sign-in">
                  Get Started for Free
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="py-12 md:py-24 lg:py-32">
          <div className="container">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <h2 className="text-4xl font-bold sm:text-5xl font-headline">Everything You Need to Succeed</h2>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="text-center shadow-lg">
                  <CardHeader>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <CardTitle className="font-sans text-xl font-bold">{feature.title}</CardTitle>
                    <p className="text-muted-foreground font-sans">
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
                    <h2 className="font-headline text-4xl font-bold sm:text-5xl">Simple, Transparent Pricing</h2>
                </div>
                <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
                    <Card className="shadow-lg border-primary flex flex-col">
                        <CardHeader className="text-left">
                            <CardTitle className="font-headline text-2xl font-bold">Primary Plan</CardTitle>
                            <p className="font-sans text-4xl font-bold">$30<span className="text-lg font-normal text-muted-foreground">/month</span></p>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <ul className="space-y-3">
                                {primaryPlanFeatures.map(feature => (
                                    <li key={feature} className="flex items-center gap-2">
                                        <Check className="h-5 w-5 text-green-500" />
                                        <span className="font-sans">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <div className="p-6 pt-0">
                           <Button className="w-full" size="lg">Choose Plan</Button>
                        </div>
                    </Card>
                    <Card className="shadow-lg flex flex-col">
                        <CardHeader className="text-left">
                            <CardTitle className="font-headline text-2xl font-bold">Add-ons</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <Card>
                                <CardContent className="p-4">
                                    <h4 className="font-semibold font-sans">Additional Staff</h4>
                                    <p className="font-bold text-lg font-sans">$10<span className="text-sm font-normal text-muted-foreground">/month per member</span></p>
                                    <p className="text-sm text-muted-foreground mt-2 font-sans">Scale your team as your business grows. Add more staff members to your plan at any time.</p>
                                </CardContent>
                            </Card>
                        </CardContent>
                         <div className="p-6 pt-0">
                           <Button variant="outline" className="w-full" size="lg">Get Started</Button>
                        </div>
                    </Card>
                </div>
            </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2">NuBarber</h3>
            <p className="text-gray-300">Professional barbershop booking platform</p>
          </div>
          <div className="flex justify-center space-x-6 mb-6">
            <a href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} NuBarber. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
