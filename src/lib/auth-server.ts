/**
 * Server-side auth helpers.
 *
 * Password hashes stored in Supabase use Werkzeug's PBKDF2 format:
 *   pbkdf2:sha256:<iterations>$<salt>$<hex-hash>
 *
 * We verify and create hashes using Node.js built-in crypto so
 * there is no dependency on Flask anymore.
 */

import { pbkdf2Sync, randomBytes, timingSafeEqual, createHmac } from "crypto";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

// --- Supabase (server-only) ---
function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Missing Supabase env vars");
  return createClient(url, key);
}

export { getServerSupabase };

// --- Password helpers (Werkzeug-compatible PBKDF2) ---
const DEFAULT_ITERATIONS = 600_000;

/** Verify a plain-text password against a Werkzeug PBKDF2 hash. */
export function verifyPassword(plain: string, hash: string): boolean {
  const match = hash.match(/^pbkdf2:sha256:(\d+)\$([^$]+)\$([0-9a-f]+)$/);
  if (!match) return false;

  const iterations = parseInt(match[1], 10);
  const salt = match[2];
  const expected = match[3];

  const keyLen = Buffer.from(expected, "hex").length;
  const derived = pbkdf2Sync(plain, salt, iterations, keyLen, "sha256").toString("hex");

  const a = Buffer.from(derived, "hex");
  const b = Buffer.from(expected, "hex");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Create a Werkzeug-compatible PBKDF2 hash for a new password. */
export function hashPassword(plain: string): string {
  const salt = randomBytes(16).toString("hex");
  const derived = pbkdf2Sync(plain, salt, DEFAULT_ITERATIONS, 32, "sha256").toString("hex");
  return `pbkdf2:sha256:${DEFAULT_ITERATIONS}$${salt}$${derived}`;
}

// --- Session cookie helpers ---
const SESSION_COOKIE = "ks_session";
const SECRET = process.env.SESSION_SECRET || "kantaka_dev_secret_2024";

function sign(value: string): string {
  const sig = createHmac("sha256", SECRET).update(value).digest("hex");
  return `${value}.${sig}`;
}

function unsign(signed: string): string | null {
  const idx = signed.lastIndexOf(".");
  if (idx === -1) return null;
  const value = signed.slice(0, idx);
  const sig = signed.slice(idx + 1);
  const expected = createHmac("sha256", SECRET).update(value).digest("hex");
  if (sig.length !== expected.length) return null;
  if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  return value;
}

/** Set a session cookie with the user ID. */
export async function setSessionCookie(userId: number) {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, sign(String(userId)), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

/** Read the session cookie and return the user ID, or null. */
export async function getSessionUserId(): Promise<number | null> {
  const jar = await cookies();
  const cookie = jar.get(SESSION_COOKIE);
  if (!cookie) return null;
  const value = unsign(cookie.value);
  if (!value) return null;
  const id = parseInt(value, 10);
  return isNaN(id) ? null : id;
}

/** Clear the session cookie (logout). */
export async function clearSessionCookie() {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
