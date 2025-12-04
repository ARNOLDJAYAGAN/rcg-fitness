import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { user_id, plan, price, name, phone } = await req.json();

    // Validate required fields
    if (!user_id || !plan || !price || !name || !phone) {
      return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
    }

    // Ensure price is a number
    const numericPrice = parseFloat(price);

    await pool.query(
      `INSERT INTO subscriptions (user_id, plan, price, name, phone, status)
       VALUES ($1, $2, $3, $4, $5, 'pending')`,
      [user_id, plan, numericPrice, name, phone]
    );

    return NextResponse.json({ success: true, message: "Subscription created" });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, message: err.message || "Server error" }, { status: 500 });
  }
}
