import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase, hashPassword } from "@/lib/auth-server";

export async function POST(req: NextRequest) {
  try {
    const { username, email, password, phone, purpose } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json({ error: "Username, email, and password required" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const supabase = getServerSupabase();

    // Check if email or username already exists
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .or(`email.eq.${email},username.eq.${username}`)
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json({ error: "Email or username already taken" }, { status: 409 });
    }

    const hashed = hashPassword(password);
    const { error } = await supabase.from("users").insert({
      username,
      email,
      password: hashed,
      phone: phone || null,
      purpose: purpose || null,
      is_admin: false,
      is_approved: false,
    });

    if (error) {
      console.error("Registration error:", error);
      return NextResponse.json({ error: "Registration failed" }, { status: 500 });
    }

    return NextResponse.json({ message: "Registration successful. Awaiting admin approval." });
  } catch {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
