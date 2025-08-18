export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  // For now, return mock data to avoid build-time Firebase issues
  // This will be replaced with actual Firebase calls once the app is deployed
  if (type === "clients") {
    return NextResponse.json([
      {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        phone: "+1234567890",
        joinDate: "2024-01-15",
        totalAppointments: 12,
        lastVisit: "2024-08-10"
      },
      {
        id: "2", 
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "+1234567891",
        joinDate: "2024-02-20",
        totalAppointments: 8,
        lastVisit: "2024-08-05"
      }
    ]);
  }
  
  if (type === "staff") {
    return NextResponse.json([
      {
        id: "1",
        name: "Mike Johnson",
        role: "Senior Barber",
        email: "mike@nubarber.com",
        phone: "+1234567892",
        hireDate: "2023-06-01",
        status: "Active"
      }
    ]);
  }
  
  if (type === "services") {
    return NextResponse.json([
      {
        id: "1",
        name: "Haircut",
        description: "Professional haircut service",
        duration: 30,
        price: 25.00,
        category: "Hair"
      },
      {
        id: "2",
        name: "Beard Trim",
        description: "Beard shaping and trimming",
        duration: 20,
        price: 15.00,
        category: "Beard"
      }
    ]);
  }
  
  if (type === "appointments") {
    return NextResponse.json([
      {
        id: "1",
        clientName: "John Doe",
        serviceName: "Haircut",
        staffName: "Mike Johnson",
        date: "2024-08-20",
        time: "14:00",
        status: "Confirmed"
      }
    ]);
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
} 