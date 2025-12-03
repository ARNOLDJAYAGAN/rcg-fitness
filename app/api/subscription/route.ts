import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { user_id, plan, price, phone, name } = await req.json();

    if (!user_id || !plan || !price) {
      return NextResponse.json({ success: false, message: "Missing required fields" });
    }

    // Insert pending subscription
    await pool.query(
      `INSERT INTO subscriptions (user_id, plan, price, phone, name, status, subscribed_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
      [user_id, plan, price, phone || "", name || "", "pending"]
    );

    return NextResponse.json({ success: true, message: "Subscription created successfully" });
  } catch (err: any) {
    console.error("Subscription API error:", err);
    return NextResponse.json({ success: false, message: "Server error" });
  }
}
