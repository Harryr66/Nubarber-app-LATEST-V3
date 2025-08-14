"use client";

import { Bar, BarChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { month: "January", bookings: 186 },
  { month: "February", bookings: 305 },
  { month: "March", bookings: 237 },
  { month: "April", bookings: 73 },
  { month: "May", bookings: 209 },
  { month: "June", bookings: 214 },
];

const chartConfig = {
  bookings: {
    label: "Bookings",
    color: "hsl(var(--primary))",
  },
};

export default function BookingsChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar dataKey="bookings" fill="var(--color-bookings)" radius={8} />
      </BarChart>
    </ChartContainer>
  );
}