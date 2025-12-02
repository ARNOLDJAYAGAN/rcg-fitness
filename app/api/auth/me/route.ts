import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ loggedIn: false });

    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.json({ loggedIn: true, user: payload });
  } catch (err) {
    console.error("Auth check error:", err);
    return NextResponse.json({ loggedIn: false });
  }
}
