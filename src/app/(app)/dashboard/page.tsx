import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign, CalendarDays, Users, Scissors, CalendarOff } from "lucide-react";
import BookingsChart from "./bookings-chart";

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
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Overview</h1>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Today's Appointments</CardTitle>
            <CardDescription>
              Your schedule for today is clear
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center text-center py-12">
              <CalendarOff className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No appointments scheduled for today</h3>
              <p className="mt-2 text-sm text-muted-foreground">Your schedule for today is clear. Enjoy the downtime!</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Bookings Overview</CardTitle>
            <CardDescription>
              A chart showing total bookings per month for the last 6 months.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BookingsChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}