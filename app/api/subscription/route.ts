import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

// GET subscription by user_id
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.pathname.split("/").pop(); // get last part of URL
    if (!userId) throw new Error("Missing user_id in URL");

    const result = await pool.query(
      "SELECT * FROM subscriptions WHERE user_id = $1",
      [userId]
    );

    return NextResponse.json({ success: true, subscriptions: result.rows });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message });
  }
}

// POST new subscription
export async function POST(req: Request) {
  try {
    const { user_id, plan, price } = await req.json();

    const result = await pool.query(
      "INSERT INTO subscriptions (user_id, plan, price) VALUES ($1, $2, $3) RETURNING *",
      [user_id, plan, price]
    );

    return NextResponse.json({ success: true, subscription: result.rows[0] });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message });
  }
}

// PUT update subscription by user_id
export async function PUT(req: Request) {
  try {
    const { user_id, plan, price } = await req.json();

    const result = await pool.query(
      "UPDATE subscriptions SET plan = $1, price = $2 WHERE user_id = $3 RETURNING *",
      [plan, price, user_id]
    );

    return NextResponse.json({ success: true, subscription: result.rows[0] });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message });
  }
}

// DELETE subscription by user_id
export async function DELETE(req: Request) {
  try {
    const { user_id } = await req.json();

    const result = await pool.query(
      "DELETE FROM subscriptions WHERE user_id = $1 RETURNING *",
      [user_id]
    );

    return NextResponse.json({ success: true, deleted: result.rows[0] });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message });
  }
}
