import { NextResponse } from "next/server";
import { getServerSupabase, getSessionUserId } from "@/lib/auth-server";

export async function GET() {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const supabase = getServerSupabase();
    const { data: user, error } = await supabase
      .from("users")
      .select("id, username, email, is_admin, is_approved")
      .eq("id", userId)
      .single();

    if (error || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    // Return user object directly (AuthProvider expects this shape)
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
}
