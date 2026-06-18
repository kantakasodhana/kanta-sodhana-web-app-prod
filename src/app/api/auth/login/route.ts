import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase, verifyPassword, setSessionCookie, setCsrfToken } from "@/lib/auth-server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const supabase = getServerSupabase();
    const { data: user, error } = await supabase
      .from("users")
      .select("id, username, email, password, is_admin, is_approved")
      .eq("email", email)
      .single();

    if (error || !user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    if (!verifyPassword(password, user.password)) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    if (!user.is_approved) {
      return NextResponse.json({ error: "Account pending approval" }, { status: 403 });
    }

    await setSessionCookie(user.id);
    await setCsrfToken();

    return NextResponse.json({
      id: user.id,
      username: user.username,
      email: user.email,
      is_admin: user.is_admin,
      is_approved: user.is_approved,
    });
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
