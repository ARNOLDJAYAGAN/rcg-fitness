import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const bodyText = await req.text();

    let data;
    try {
      data = JSON.parse(bodyText);
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { user_id, plan, price, name, phone } = data;

    if (!user_id || !plan || !price || !name || !phone) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Here you could add actual payment logic if needed (e.g., Stripe), 
    // but for now, we just insert the subscription as pending
    await pool.query(
      `INSERT INTO subscriptions (user_id, plan, price, name, phone, status)
       VALUES ($1, $2, $3, $4, $5, 'pending')`,
      [user_id, plan, parseFloat(price), name, phone]
    );

    return NextResponse.json({
      success: true,
      message: "Payment processed, subscription is pending",
    });
  } catch (err: any) {
    console.error("Payment API error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Server error" },
      { status: 500 }
    );
  }
}
