// app/api/subscriptions/[userId]/route.ts
import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(req: Request, { params }: { params: { userId: string } }) {
  try {
    const result = await pool.query(
      "SELECT * FROM subscriptions WHERE user_id = $1",
      [params.userId]
    );

    const subscription = result.rows[0] || null;
    return NextResponse.json({ success: true, subscription });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message });
  }
}
