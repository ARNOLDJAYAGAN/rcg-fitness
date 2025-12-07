import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(
      `SELECT *
       FROM subscriptions
       ORDER BY subscribed_at DESC`
    );

    const subscriptions = result.rows.map((sub) => ({
      ...sub,
      status: sub.status || "pending",
      price: Number(sub.price),
      expires_at: sub.expires_at || null,
    }));

    return NextResponse.json({ success: true, subscriptions });
  } catch (err: any) {
    console.error("Admin GET error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Server error" },
      { status: 500 }
    );
  }
}
