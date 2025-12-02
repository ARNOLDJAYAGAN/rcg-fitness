import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.NEON_DB_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await pool.query(
      "SELECT * FROM subscriptions WHERE user_id = $1",
      [params.id]
    );

    const subscription = result.rows[0] || null;
    return NextResponse.json({ success: true, subscription });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Server error" });
  }
}
