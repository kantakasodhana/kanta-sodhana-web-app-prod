import { NextRequest, NextResponse } from "next/server";

// The specific routes (login, register, logout, me) are handled by their
// own route files. This catch-all returns 404 for anything else.

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  return NextResponse.json({ error: `Unknown auth route: ${slug.join("/")}` }, { status: 404 });
}

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  return NextResponse.json({ error: `Unknown auth route: ${slug.join("/")}` }, { status: 404 });
}
