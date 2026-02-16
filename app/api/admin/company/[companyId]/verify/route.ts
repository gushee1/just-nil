import { Role, VerificationStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  status: z.nativeEnum(VerificationStatus)
});

export async function PATCH(request: Request, { params }: { params: { companyId: string } }) {
  const user = await getCurrentUser([Role.ADMIN]);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const input = bodySchema.parse(body);

    const profile = await prisma.companyProfile.update({
      where: { id: params.companyId },
      data: { verificationStatus: input.status }
    });

    return NextResponse.json({ profile });
  } catch {
    return NextResponse.json({ error: "Failed to update verification status" }, { status: 400 });
  }
}
