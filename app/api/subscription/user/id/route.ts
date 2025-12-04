import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const userId = context.params.id;

    const result = await pool.query(
      "SELECT * FROM subscriptions WHERE user_id = $1",
      [userId]
    );

    return NextResponse.json({
      success: true,
      subscription: result.rows[0] || null,
    });
  } catch (err: any) {
    console.error("Error fetching subscription:", err);
    return NextResponse.json({
      success: false,
      error: "Server error",
    });
  }
}
