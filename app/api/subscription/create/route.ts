// app/api/subscriptions/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { user_id, plan, price, phone, name, status } = await req.json();
    if (!user_id || !plan) {
      return NextResponse.json({ success: false, message: "Missing fields" });
    }

    await pool.query(
      `INSERT INTO subscriptions (user_id, plan, price, phone, name, status)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [user_id, plan, price, phone, name, status]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Server error" });
  }
}
