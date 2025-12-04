import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { user_id, plan, price, name, phone } = await req.json();

    if (!user_id || !plan || !price || !name || !phone) {
      return NextResponse.json({ success: false, message: "Missing fields" });
    }

    // Create subscription with status 'pending'
    await pool.query(
      `INSERT INTO subscriptions (user_id, plan, price, name, phone, status)
       VALUES ($1, $2, $3, $4, $5, 'pending')`,
      [user_id, plan, price, name, phone]
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, message: err.message || "Server error" });
  }
}
