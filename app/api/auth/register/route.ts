import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({
  connectionString: process.env.NEON_DB_URL,
  ssl: { rejectUnauthorized: false },
});

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, email, role",
      [email, hashedPassword, "user"]
    );

    const user = result.rows[0];

    return NextResponse.json({ success: true, user });
  } catch (err: any) {
    console.error("Register error:", err);
    return NextResponse.json({ success: false, message: err.message });
  }
}
