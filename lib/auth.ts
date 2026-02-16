import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { Role, User } from "@prisma/client";

const SESSION_COOKIE = "just_nil_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

type SessionPayload = {
  sub: string;
  email: string;
  role: Role;
};

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET is not set");
  }
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export async function signSessionToken(user: Pick<User, "id" | "email" | "role">) {
  return new SignJWT({ email: user.email, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getSecret());
}

export async function readSession(): Promise<SessionPayload | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, getSecret());
    return {
      sub: payload.sub as string,
      email: payload.email as string,
      role: payload.role as Role
    };
  } catch {
    return null;
  }
}

export async function setSessionCookie(response: NextResponse, user: Pick<User, "id" | "email" | "role">) {
  const token = await signSessionToken(user);

  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS
  });

  return;
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/"
  });
  return response;
}
