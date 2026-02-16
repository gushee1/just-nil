import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const prisma = getPrisma();
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      studentProfile: true,
      companyProfile: true
    }
  });

  if (!user) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  return NextResponse.json({ user });
}
