// app/api/subscriptions/admin/route.ts
import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const result = await pool.query("SELECT * FROM subscriptions ORDER BY subscribed_at DESC");
    return NextResponse.json({ success: true, subscriptions: result.rows });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Server error" });
  }
}
