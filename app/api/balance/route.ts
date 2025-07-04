
import { NextResponse } from "next/server";
import { getUserFromToken } from "../read-token/route";
import { cookies } from "next/headers";

import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET!;
export async function GET() {
const cookieStore = await cookies();
const token = cookieStore.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
 try {
    // ✅ Decode token to get email
    const decoded = jwt.verify(token, JWT_SECRET) as { email?: string };

    if (!decoded.email) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const email = decoded.email;
  try {
    const res = await fetch(`http://localhost:8080/api/balance?email=${email}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch wallet" }, { status: 500 });
  }
} catch (error) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }
}
