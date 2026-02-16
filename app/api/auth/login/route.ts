import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validation";
import { setSessionCookie, verifyPassword } from "@/lib/auth";
import { logInfo } from "@/lib/logger";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = loginSchema.parse(body);

    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const validPassword = await verifyPassword(input.password, user.passwordHash);
    if (!validPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const response = NextResponse.json({ user: { id: user.id, email: user.email, role: user.role } });
    await setSessionCookie(response, user);

    logInfo("user.login", { userId: user.id, role: user.role });
    return response;
  } catch {
    return NextResponse.json({ error: "Invalid login request" }, { status: 400 });
  }
}
