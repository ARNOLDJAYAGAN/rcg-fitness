import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { user_id, plan, price, phoneNumber, location } = await req.json();

    await pool.query(
      `INSERT INTO subscriptions (user_id, plan, price, phone_number, location, status) 
       VALUES ($1, $2, $3, $4, $5, 'pending')
       ON CONFLICT (user_id) 
       DO UPDATE SET plan = EXCLUDED.plan, price = EXCLUDED.price, phone_number = EXCLUDED.phone_number, location = EXCLUDED.location, status='pending'`,
      [user_id, plan, price, phoneNumber, location]
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message });
  }
}
