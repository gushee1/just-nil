import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const profile =
    user.role === "STUDENT"
      ? await prisma.studentProfile.findUnique({ where: { userId: user.id } })
      : user.role === "COMPANY"
        ? await prisma.companyProfile.findUnique({ where: { userId: user.id } })
        : null;

  return NextResponse.json({ user, profile });
}
