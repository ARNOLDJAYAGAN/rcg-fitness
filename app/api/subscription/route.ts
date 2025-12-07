import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { user_id, plan, price, phone, name } = await req.json();

    // Validate required fields
    if (!user_id || !plan || !price || !phone || !name) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert pending subscription
    const result = await pool.query(
      `INSERT INTO subscriptions 
        (user_id, plan, price, phone, name, status, subscribed_at)
       VALUES ($1, $2, $3, $4, $5, 'pending', NOW())
       RETURNING id, user_id, plan, price, phone, name, status, subscribed_at`,
      [parseInt(user_id, 10), plan, parseFloat(price), phone, name]
    );

    return NextResponse.json({
      success: true,
      message: "Subscription created successfully",
      subscription: result.rows[0], // return the created subscription
    });
  } catch (err: any) {
    console.error("Subscription API error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Server error" },
      { status: 500 }
    );
  }
}
