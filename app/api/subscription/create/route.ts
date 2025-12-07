import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { user_id, plan, price, name, phone, email } = data;

    if (!user_id || !plan || !price || !name || !phone) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert subscription
    const result = await pool.query(
      `INSERT INTO subscriptions
        (user_id, plan, price, name, phone, email, status, subscribed_at, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending', NOW(), NULL)
       RETURNING *`,
      [parseInt(user_id, 10), plan, parseFloat(price), name, phone, email || null]
    );

    return NextResponse.json({
      success: true,
      message: "Subscription created and pending",
      subscription: result.rows[0],
    });
  } catch (err: any) {
    console.error("Subscription create error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Server error" },
      { status: 500 }
    );
  }
}
