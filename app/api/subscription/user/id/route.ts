import { NextResponse } from "next/server";
import { pool } from "@/lib/db"; // make sure your pool connects to Neon

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const result = await pool.query(
      "SELECT * FROM subscriptions WHERE user_id = $1",
      [params.id]
    );

    const subscription = result.rows[0] || null;
    return NextResponse.json({ success: true, subscription });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message });
  }
}
