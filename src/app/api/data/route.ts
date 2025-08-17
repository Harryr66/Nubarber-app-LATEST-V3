import { NextResponse } from "next/server";
import { getFirestore } from "firebase/firestore";
import { app } from "../../../firebase"; // Adjust path if needed
import { collection, getDocs } from "firebase/firestore";

const db = getFirestore(app);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  try {
    if (type === "clients") {
      const snapshot = await getDocs(collection(db, "clients"));
      const data = snapshot.docs.map(doc => doc.data());
      return NextResponse.json(data);
    } // Add similar for staff, services, appointments, etc.
    // e.g., if (type === "staff") { ... }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
} 