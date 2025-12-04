import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json(); // parse JSON safely
    const { user_id, plan, price, name, phone } = data;

    // Validate required fields
    if (!user_id || !plan || !price || !name || !phone) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("Create subscription body:", data);

    // Insert subscription
    const result = await pool.query(
      `INSERT INTO subscriptions 
       (user_id, plan, price, name, phone, status, subscribed_at)
       VALUES ($1, $2, $3, $4, $5, 'pending', NOW())
       RETURNING *`,
      [user_id, plan, parseFloat(price), name, phone]
    );

    console.log("Inserted subscription:", result.rows[0]);

    return NextResponse.json({ success: true, subscription: result.rows[0] });
  } catch (err: any) {
    console.error("Create subscription error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Server error" },
      { status: 500 }
    );
  }
}
