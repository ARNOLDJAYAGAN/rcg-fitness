// app/api/subscriptions/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user_id, plan, price, name, phone } = body;

    // Validate fields
    if (!user_id || !plan || !price || !name || !phone) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert into DB
    await pool.query(
      `INSERT INTO subscriptions (user_id, plan, price, name, phone, status)
       VALUES ($1, $2, $3, $4, $5, 'pending')`,
      [user_id, plan, parseFloat(price), name, phone]
    );

    return NextResponse.json({ success: true, message: "Subscription created" });
  } catch (err: any) {
    console.error("Subscription create error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Server error" },
      { status: 500 }
    );
  }
}
