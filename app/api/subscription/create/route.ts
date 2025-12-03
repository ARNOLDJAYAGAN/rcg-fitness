import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { user_id, plan, price, phone, name } = await req.json();

    if (!user_id || !plan || !price) 
      return NextResponse.json({ success: false, message: "Missing fields" });

    await pool.query(
      `INSERT INTO subscriptions (user_id, plan, price, phone, name, status)
       VALUES ($1, $2, $3, $4, $5, 'pending')`,
      [user_id, plan, price, phone, name]
    );

    return NextResponse.json({ success: true, message: "Subscription pending" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Server error" });
  }
}
