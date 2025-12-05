// app/api/delete-account/route.ts
import { NextResponse } from "next/server";
import { pool } from "@/lib/db"; // your PostgreSQL client

export async function DELETE(req: Request) {
  try {
    // Example: get user ID from a cookie or session (not Clerk)
    const userId = req.headers.get("x-user-id");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Delete dependent data first
    await pool.query("DELETE FROM subscriptions WHERE user_id = $1", [userId]);
    await pool.query("DELETE FROM users WHERE id = $1", [userId]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}
