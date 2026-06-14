import { NextRequest, NextResponse } from "next/server";
const FLASK = process.env.FLASK_AUTH_URL ?? "http://localhost:5001";
export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const res = await fetch(`${FLASK}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    return NextResponse.json({ error: "Auth service unavailable" }, { status: 503 });
  }
}
