import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

// Create a single Postgres pool
const pool = new Pool({
  connectionString: process.env.NEON_DB_URL, // set this in .env.local
  ssl: { rejectUnauthorized: false },
});

// Define TypeScript type for the user row
interface UserRow {
  id: number;
  email: string;
  password: string;
  role: string;
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email and password are required" });
    }

    // Check if user already exists
    const existing = await pool.query<UserRow>("SELECT * FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return NextResponse.json({ success: false, message: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const result = await pool.query<UserRow>(
      "INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role",
      [email, hashedPassword, "user"]
    );

    const newUser = result.rows[0];

    return NextResponse.json({ success: true, user: newUser });

  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ success: false, message: "Server error" });
  }
}
