export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getFirestore } from "firebase/firestore";
import { app } from "../../../firebase"; // Adjust path if needed
import { collection, getDocs } from "firebase/firestore";

const db = getFirestore(app);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  // Simulate data or use runtime Firebase
  if (type === "clients") {
    // Replace with actual runtime Firebase call if needed, but avoid build-time
    return NextResponse.json([]); // Placeholder
  }
  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
} 