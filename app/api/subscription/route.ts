import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { user_id, email, name, phone, plan, price } = await req.json();

    // Basic validation
    if (!user_id || !plan || !price) {
      return NextResponse.json({ success: false, message: "Missing required fields" });
    }

    // Insert subscription with status "pending"
    await pool.query(
      `INSERT INTO subscriptions (user_id, email, name, phone, plan, price, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending')`,
      [user_id, email, name, phone, plan, price]
    );

    return NextResponse.json({ success: true, message: "Subscription created successfully!" });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Server error", error: err.message });
  }
}
