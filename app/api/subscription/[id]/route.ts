import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id, 10);

    const result = await pool.query(
      `SELECT *
       FROM subscriptions
       WHERE user_id = $1
       ORDER BY subscribed_at DESC
       LIMIT 1`,
      [userId]
    );

    if (!result.rows.length) {
      return NextResponse.json({ success: false, subscription: null });
    }

    const sub = result.rows[0];

    // Remove expires_at entirely, just use status
    const subscription = {
      ...sub,
      status: sub.status || "pending",
      price: Number(sub.price),
    };

    return NextResponse.json({ success: true, subscription });
  } catch (err: any) {
    console.error("Fetch subscription error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Server error" },
      { status: 500 }
    );
  }
}
