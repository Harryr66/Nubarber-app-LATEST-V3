import Link from "next/link";
import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Film, CalendarCheck, CreditCard, Users, Contact, BarChart, Check } from "lucide-react";

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


export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Welcome to NuBarber - Premium Heat Map Calendar Now Live! 🎯
        </p>
      </div>
    </div>
  );
}
