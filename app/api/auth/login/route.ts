import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

// Create a single Postgres pool
const pool = new Pool({
  connectionString: process.env.NEON_DB_URL, // add NEON_DB_URL in .env.local
  ssl: { rejectUnauthorized: false },       // required for Neon
});

// Define a TypeScript type for the user row
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

    // Query user by email
    const result = await pool.query<UserRow>("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" });
    }

    // Compare password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ success: false, message: "Invalid password" });
    }

    // Return user info (never send password back)
    const userResponse = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    return NextResponse.json({ success: true, user: userResponse });

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ success: false, message: "Server error" });
  }
}
