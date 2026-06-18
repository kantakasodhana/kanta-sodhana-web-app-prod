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

export function hashPassword(plain: string): string {
  const salt = randomBytes(16).toString("hex");
  const derived = pbkdf2Sync(plain, salt, DEFAULT_ITERATIONS, 32, "sha256").toString("hex");
  return `pbkdf2:sha256:${DEFAULT_ITERATIONS}\$${salt}\$${derived}`;
}

// --- Session cookie helpers ---
const SESSION_COOKIE = "ks_session";
const SESSION_TIMEOUT = 30 * 60; // 30 minutes in seconds

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "SESSION_SECRET env var is required in production. " +
      "Generate one with: node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\""
    );
  }
  return "kantaka_dev_secret_DO_NOT_USE_IN_PROD";
}

function sign(value: string): string {
  const sig = createHmac("sha256", getSecret()).update(value).digest("hex");
  return `${value}.${sig}`;
}

function unsign(signed: string): string | null {
  const idx = signed.lastIndexOf(".");
  if (idx === -1) return null;
  const value = signed.slice(0, idx);
  const sig = signed.slice(idx + 1);
  const expected = createHmac("sha256", getSecret()).update(value).digest("hex");
  if (sig.length !== expected.length) return null;
  if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  return value;
}

export async function setSessionCookie(userId: number) {
  const payload = `${userId}:${Math.floor(Date.now() / 1000)}`;
  const jar = await cookies();
  jar.set(SESSION_COOKIE, sign(payload), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TIMEOUT,
  });
}

export async function getSessionUserId(): Promise<number | null> {
  const jar = await cookies();
  const cookie = jar.get(SESSION_COOKIE);
  if (!cookie) return null;
  const payload = unsign(cookie.value);
  if (!payload) return null;
  const parts = payload.split(":");
  if (parts.length !== 2) return null;
  const id = parseInt(parts[0], 10);
  const timestamp = parseInt(parts[1], 10);
  if (isNaN(id) || isNaN(timestamp)) return null;
  const now = Math.floor(Date.now() / 1000);
  if (now - timestamp > SESSION_TIMEOUT) {
    await clearSessionCookie();
    return null;
  }
  return id;
}

export async function refreshSession(userId: number) {
  await setSessionCookie(userId);
}

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

// --- CSRF helpers ---
const CSRF_COOKIE = "ks_csrf";

export async function setCsrfToken(): Promise<string> {
  const token = randomBytes(32).toString("hex");
  const jar = await cookies();
  jar.set(CSRF_COOKIE, token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_TIMEOUT,
  });
  return token;
}

export async function validateCsrfToken(headerToken: string | null): Promise<boolean> {
  if (!headerToken) return false;
  const jar = await cookies();
  const cookie = jar.get(CSRF_COOKIE);
  if (!cookie) return false;
  if (headerToken.length !== cookie.value.length) return false;
  return timingSafeEqual(Buffer.from(headerToken), Buffer.from(cookie.value));
}
