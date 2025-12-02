import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.NEON_DB_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT s.id, s.plan, s.price, s.status, s.subscribed_at AS "subscribedAt", u.email
      FROM subscriptions s
      JOIN users u ON s.user_id = u.id
      ORDER BY s.id DESC
    `);

    return NextResponse.json({ success: true, subscriptions: result.rows });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Server error" });
  }
}
