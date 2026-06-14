import { NextRequest, NextResponse } from "next/server";
const FLASK = process.env.FLASK_AUTH_URL ?? "http://localhost:5001";
export async function POST(req: NextRequest) {
  try {
    const res = await fetch(`${FLASK}/api/auth/logout`, {
      method: "POST",
      headers: { cookie: req.headers.get("cookie") || "" },
    });
    const data = await res.json();
    const r = NextResponse.json(data, { status: res.status });
    res.headers.getSetCookie?.().forEach((c) => r.headers.append("Set-Cookie", c));
    return r;
  } catch {
    return NextResponse.json({ error: "Logout failed" }, { status: 503 });
  }
}
