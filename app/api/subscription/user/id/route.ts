// /api/subscriptions/[userId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.pathname.split("/").pop();
  if (!userId) return NextResponse.json({ success: false, message: "Missing userId" });

  try {
    const result = await pool.query(
      `SELECT id, plan, price, status, subscribed_at
       FROM subscriptions
       WHERE user_id=$1
       ORDER BY subscribed_at DESC
       LIMIT 1`,
      [userId]
    );

    if (result.rows.length === 0) return NextResponse.json({ success: true, subscription: null });

    return NextResponse.json({ success: true, subscription: result.rows[0] });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, message: err.message });
  }
}
