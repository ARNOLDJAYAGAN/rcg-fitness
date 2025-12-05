import { NextResponse, NextRequest } from "next/server";
import { pool } from "@/lib/db";

// This function securely deletes the logged-in user
export async function DELETE(req: NextRequest) {
  try {
    // Get userId from your session cookie (replace 'userId' with your cookie key)
    const userId = req.cookies.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete subscription first (FK dependency)
    await pool.query("DELETE FROM subscriptions WHERE user_id = $1", [userId]);
    // Delete user account
    await pool.query("DELETE FROM users WHERE id = $1", [userId]);

    // Optionally, clear the cookie
    const response = NextResponse.json({ success: true });
    response.cookies.delete("userId"); // remove session cookie
    return response;
  } catch (err) {
    console.error("Delete account error:", err);
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}
