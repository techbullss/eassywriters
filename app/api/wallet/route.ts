
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    const { txId, amount,payerEmail } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { sub: string; email: string };

    const  userEmail = decoded.email || decoded.sub;

    // Forward to Spring Boot
    await fetch("http://localhost:8080/wallet/paypal-success", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        txId,
        amount,
        userEmail,
        payerEmail
      }),
    });

    return NextResponse.json({ status: "Transaction recorded" });
  } catch (error) {
    console.error("PayPal success error:", error);
    return NextResponse.json({ error: "Failed to record payment" }, { status: 500 });
  }
}
