import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth-server";

export async function POST() {
  try {
    await clearSessionCookie();
    return NextResponse.json({ message: "Logged out" });
  } catch {
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
