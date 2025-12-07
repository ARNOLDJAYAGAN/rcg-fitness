// /api/subscriptions/admin/approve/route.ts
import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    if (!id)
      return NextResponse.json({
        success: false,
        message: "Missing subscription ID",
      });

    // Update status + set expiration 30 days ahead
    const result = await pool.query(
      `
      UPDATE subscriptions
      SET status = 'active',
          expires_at = NOW() + INTERVAL '30 days'
      WHERE id = $1
      RETURNING *;
      `,
      [id]
    );

    if (!result.rows.length) {
      return NextResponse.json({
        success: false,
        message: "Subscription not found",
      });
    }

    return NextResponse.json({ success: true, subscription: result.rows[0] });
  } catch (err: any) {
    console.error("APPROVE ERROR:", err);
    return NextResponse.json({ success: false, message: err.message });
  }
}
