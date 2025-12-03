import { NextResponse } from "next/server"
import { pool } from "@/lib/db"

export async function GET() {
  try {
    const result = await pool.query(
      "SELECT id, email, plan, price, status, subscribed_at FROM subscriptions WHERE status = 'pending' ORDER BY subscribed_at DESC"
    )
    return NextResponse.json({ success: true, subscriptions: result.rows })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ success: false, error: err.message })
  }
}
