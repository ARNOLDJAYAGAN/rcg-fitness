import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db"; // make sure this uses NEON_DB_URL

export async function POST(req: NextRequest) {
  try {
    const { user_id, plan, price, name, phone } = await req.json();

    // Validate required fields
    if (!user_id || !plan || !price || !name || !phone) {
      return NextResponse.json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Insert the subscription as pending
    await pool.query(
      `INSERT INTO subscriptions (user_id, plan, price, name, phone, status)
       VALUES ($1, $2, $3, $4, $5, 'pending')`,
      [user_id, plan, price, name, phone]
    );

    return NextResponse.json({
      success: true,
      message: "Subscription created. Status = pending",
    });
  } catch (err: any) {
    console.error("Payment API error:", err);
    return NextResponse.json({
      success: false,
      message: "Server error",
    });
  }
}
