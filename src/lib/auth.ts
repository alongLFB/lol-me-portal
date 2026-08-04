/**
 * JWT-based authentication for Admin dashboard.
 * Uses `jose` library (Edge and Server Action compatible).
 */

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const getSecretKey = () => {
  const secret = process.env.JWT_SECRET || "lol_me_portal_default_jwt_secret_2026";
  return new TextEncoder().encode(secret);
};

const COOKIE_NAME = "lol_me_portal_session";
const EXPIRES_IN = "7d";

export interface SessionPayload {
  role: "admin";
  iat?: number;
  exp?: number;
}

export async function signToken(payload: { role: "admin" }): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(EXPIRES_IN)
    .sign(getSecretKey());
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function getServerSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function requireAuth(): Promise<SessionPayload> {
  const session = await getServerSession();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}

export const AUTH_COOKIE_NAME = COOKIE_NAME;
