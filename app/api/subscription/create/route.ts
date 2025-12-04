// app/api/subscriptions/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    // Log that the route was called
    console.log("POST /subscriptions/create called");

    // Parse JSON safely
    let data: any;
    try {
      data = await req.json();
      console.log("Request body:", data);
    } catch (err) {
      console.error("Invalid JSON body:", err);
      return NextResponse.json(
        { success: false, message: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { user_id, plan, price, name, phone } = data;

    // Validate fields
    if (!user_id || !plan || !price || !name || !phone) {
      console.warn("Missing fields in request body");
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert into DB
    let result;
    try {
      result = await pool.query(
        `INSERT INTO subscriptions (user_id, plan, price, name, phone, status, subscribed_at)
         VALUES ($1, $2, $3, $4, $5, 'pending', NOW())
         RETURNING *`,
        [user_id, plan, parseFloat(price), name, phone]
      );
      console.log("Insert result:", result.rows[0]);
    } catch (dbErr: any) {
  console.error("Database error:", dbErr);
  return NextResponse.json(
    { success: false, message: dbErr.message || "Database error" },
    { status: 500 }
  );
}


    // Respond with success
    return NextResponse.json({ success: true, subscription: result.rows[0] });
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Server error" },
      { status: 500 }
    );
  }
}
