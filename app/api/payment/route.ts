import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { user_id, plan } = await req.json();

    if (!user_id || !plan) {
      return NextResponse.json({ success: false, message: "Missing fields" });
    }

    // Example price lookup
    const priceLookup: Record<string, number> = {
      Basic: 999,
      Premium: 1999,
    };

    const price = priceLookup[plan] ?? null;
    if (!price) {
      return NextResponse.json({ success: false, message: "Invalid plan" });
    }

    // Insert fake payment (pending)
    await pool.query(
      `INSERT INTO subscriptions (user_id, plan, price, status)
        VALUES ($1, $2, $3, 'pending')`,
      [user_id, plan, price / 100]
    );

    return NextResponse.json({
      success: true,
      message: "Fake payment created. Status = pending",
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Server error" });
  }
}
