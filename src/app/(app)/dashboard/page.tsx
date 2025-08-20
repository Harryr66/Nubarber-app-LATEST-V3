"use client";

import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign, CalendarDays, Users, Scissors, CalendarOff } from "lucide-react";
import BookingsChart from "./bookings-chart";

export const dynamic = "force-dynamic";

const stats = [
    {
        icon: DollarSign,
        title: "Total Revenue",
        value: "$0.00",
        description: "All-time revenue from paid bookings",
    },
    {
        icon: CalendarDays,
        title: "Bookings this Month",
        value: "+0",
        description: "In the current calendar month",
    },
    {
        icon: Users,
        title: "New Clients this Month",
        value: "+0",
        description: "First-time customers this month",
    },
    {
        icon: Scissors,
        title: "Most Booked Service",
        value: "N/A",
        description: "This calendar month",
    },
]

export default function Dashboard() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('Dashboard: auth state:', { isAuthenticated, user, isLoading });
    
    if (!isLoading && !isAuthenticated) {
      console.log('Dashboard: user not authenticated, redirecting to sign-in');
      router.push('/sign-in');
    }
  }, [isAuthenticated, user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="space-y-4 md:space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold font-heading">Loading...</h1>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="space-y-4 md:space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold font-heading">Redirecting to sign-in...</h1>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold font-heading">Overview</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Welcome back, {user?.shopName}!
        </p>
      </div>
      
      <div className="space-y-4 md:space-y-6">
        <Card>
          <CardHeader className="pb-3 md:pb-6">
            <CardTitle className="text-lg md:text-xl">Today's Appointments</CardTitle>
            <CardDescription className="text-sm md:text-base">
              Your schedule for today is clear
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center text-center py-8 md:py-12">
              <CalendarOff className="h-8 w-8 md:h-12 md:w-12 text-muted-foreground" />
              <h3 className="mt-3 md:mt-4 text-base md:text-lg font-semibold">No appointments scheduled for today</h3>
              <p className="mt-1 md:mt-2 text-xs md:text-sm text-muted-foreground">Your schedule for today is clear. Enjoy the downtime!</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-3 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Card key={i} className="p-3 md:p-6">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground leading-tight">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-3 md:pb-6">
            <CardTitle className="text-lg md:text-xl">Bookings Overview</CardTitle>
            <CardDescription className="text-sm md:text-base">
              A chart showing total bookings per month for the last 6 months.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="min-w-[600px] md:min-w-0">
                <BookingsChart />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}