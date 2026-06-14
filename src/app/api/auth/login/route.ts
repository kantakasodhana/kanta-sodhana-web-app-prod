import { NextRequest, NextResponse } from "next/server";
const FLASK = process.env.FLASK_AUTH_URL ?? "http://localhost:5001";
export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const res = await fetch(`${FLASK}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", cookie: req.headers.get("cookie") || "" },
      body,
    });
    const data = await res.json();
    const r = NextResponse.json(data, { status: res.status });
    res.headers.getSetCookie?.().forEach((c) => r.headers.append("Set-Cookie", c));
    return r;
  } catch (e) {
    return NextResponse.json({ error: "Auth service unavailable" }, { status: 503 });
  }
}
