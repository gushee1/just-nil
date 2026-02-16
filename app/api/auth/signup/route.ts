import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, setSessionCookie } from "@/lib/auth";
import { signupSchema } from "@/lib/validation";
import { logInfo } from "@/lib/logger";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = signupSchema.parse(body);

    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const user = await prisma.user.create({
      data: {
        email: input.email,
        passwordHash: await hashPassword(input.password),
        role: input.role
      }
    });

    const response = NextResponse.json({ user: { id: user.id, email: user.email, role: user.role } }, { status: 201 });
    await setSessionCookie(response, user);

    logInfo("user.signup", { userId: user.id, role: user.role });
    return response;
  } catch (error) {
    return NextResponse.json({ error: "Invalid signup request" }, { status: 400 });
  }
}
