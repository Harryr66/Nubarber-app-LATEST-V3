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
        lastAppointment: "2024-08-10",
        preferences: "Likes a fade on the sides, but keep the top longer. Prefers using American Crew products.",
        pastServices: ["Classic Haircut", "Beard Trim"]
      },
      {
        id: "2", 
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "+1234567891",
        lastAppointment: "2024-08-05",
        preferences: "Sensitive scalp, prefers gentle products. Likes a clean and sharp beard line.",
        pastServices: ["Beard Trim"]
      },
      {
        id: "3",
        name: "Mike Williams",
        email: "mike.williams@example.com",
        phone: "+1234567892",
        lastAppointment: "2024-08-01",
        preferences: "Enjoys the hot towel treatment and a very close shave.",
        pastServices: ["Hot Towel Shave"]
      },
      {
        id: "4",
        name: "Sarah Brown",
        email: "sarah.brown@example.com",
        phone: "+1234567893",
        lastAppointment: "2024-07-28",
        preferences: "Looking for low-maintenance styles. Interested in subtle color changes.",
        pastServices: ["Coloring", "Classic Haircut"]
      }
    ]);
  }
  
  if (type === "staff") {
    return NextResponse.json([
      {
        id: "1",
        name: "Alex Johnson",
        specialty: "Fades & Classic Cuts",
        availability: "Mon-Fri, 9am-5pm",
        avatarUrl: "https://placehold.co/100x100.png"
      },
      {
        id: "2",
        name: "Maria Garcia",
        specialty: "Beard Sculpting & Styling",
        availability: "Tue-Sat, 10am-6pm",
        avatarUrl: "https://placehold.co/100x100.png"
      },
      {
        id: "3",
        name: "Chloe Davis",
        specialty: "Color & Modern Styles",
        availability: "Wed-Sun, 11am-7pm",
        avatarUrl: "https://placehold.co/100x100.png"
      }
    ]);
  }
  
  if (type === "services") {
    return NextResponse.json([
      {
        id: "1",
        name: "Classic Haircut",
        description: "A timeless haircut tailored to your preferences.",
        duration: 30,
        price: 35,
        category: "Hair"
      },
      {
        id: "2",
        name: "Beard Trim",
        description: "Shape and clean up your beard to perfection.",
        duration: 20,
        price: 20,
        category: "Beard"
      },
      {
        id: "3",
        name: "Hot Towel Shave",
        description: "A luxurious and close shave with hot towels and premium products.",
        duration: 45,
        price: 45,
        category: "Shave"
      },
      {
        id: "4",
        name: "Coloring",
        description: "From subtle changes to bold new looks.",
        duration: 60,
        price: 75,
        category: "Color"
      },
      {
        id: "5",
        name: "Kids Cut",
        description: "A patient and fun haircut experience for the little ones.",
        duration: 25,
        price: 25,
        category: "Hair"
      },
      {
        id: "6",
        name: "Haircut & Beard Trim Combo",
        description: "The complete package for a sharp look.",
        duration: 50,
        price: 50,
        category: "Combo"
      }
    ]);
  }
  
  if (type === "appointments") {
    return NextResponse.json([
      {
        id: "1",
        clientName: "John Doe",
        service: "Classic Haircut",
        staff: "Alex Johnson",
        startTime: "2024-08-20T14:00:00",
        endTime: "2024-08-20T14:30:00",
        status: "Confirmed"
      },
      {
        id: "2",
        clientName: "Jane Smith",
        service: "Beard Trim",
        staff: "Maria Garcia",
        startTime: "2024-08-21T15:30:00",
        endTime: "2024-08-21T15:50:00",
        status: "Confirmed"
      },
      {
        id: "3",
        clientName: "Mike Williams",
        service: "Hot Towel Shave",
        staff: "Alex Johnson",
        startTime: "2024-08-22T10:00:00",
        endTime: "2024-08-22T10:45:00",
        status: "Confirmed"
      }
    ]);
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
} 