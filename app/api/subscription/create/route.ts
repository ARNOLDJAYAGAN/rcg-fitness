import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { user_id, plan, price, name, phone } = await req.json();

    if (!user_id || !plan || !price || !name || !phone) {
      return NextResponse.json({ success: false, message: "Missing fields" });
    }

    const result = await pool.query(
      `INSERT INTO subscriptions (user_id, plan, price, name, phone, status, subscribed_at)
       VALUES ($1, $2, $3, $4, $5, 'pending', NOW())
       RETURNING id`,
      [user_id, plan, price, name, phone]
    );

    return NextResponse.json({ success: true, id: result.rows[0].id });

  } catch (err: any) {
    console.error("SERVER ERROR:", err);  // THIS WILL SHOW THE REAL ERROR
    return NextResponse.json({
      success: false,
      message: err.message || "Server error",
    });
  }
}
