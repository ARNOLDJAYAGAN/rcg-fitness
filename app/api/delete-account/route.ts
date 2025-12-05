import { NextResponse, NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = getAuth(req); // ✅ Now TypeScript is happy

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete subscription first
    await db.query("DELETE FROM subscriptions WHERE user_id = $1", [userId]);

    // Delete user
    await db.query("DELETE FROM users WHERE id = $1", [userId]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}
