import crypto from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "love-memory-admin";
function secret() {
  const value = process.env.ADMIN_SECRET;
  if (!value) throw new Error("ADMIN_SECRET is not configured.");
  return value;
}

function sign(value: string) {
  return crypto.createHmac("sha256", secret()).update(value).digest("hex");
}

export function createAdminToken() {
  const payload = `admin.${Date.now()}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminToken(token: string | undefined) {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== "admin") return false;

  const payload = `${parts[0]}.${parts[1]}`;
  const expected = sign(payload);
  const received = parts[2];
  if (received.length !== expected.length) return false;

  const valid = crypto.timingSafeEqual(Buffer.from(received), Buffer.from(expected));
  if (!valid) return false;

  const issuedAt = Number(parts[1]);
  return Number.isFinite(issuedAt) && Date.now() - issuedAt < 1000 * 60 * 60 * 24 * 7;
}

export async function isAdmin() {
  const cookieStore = await cookies();
  return verifyAdminToken(cookieStore.get(COOKIE_NAME)?.value);
}

export const adminCookie = COOKIE_NAME;
