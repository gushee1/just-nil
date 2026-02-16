import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { getVerificationUploadUrl } from "@/lib/s3";

const bodySchema = z.object({
  fileName: z.string().min(1),
  mimeType: z.string().min(1)
});

export async function POST(request: Request) {
  const user = await getCurrentUser([Role.COMPANY]);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const companyProfile = await prisma.companyProfile.findUnique({ where: { userId: user.id } });
  if (!companyProfile) {
    return NextResponse.json({ error: "Create company profile first" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const input = bodySchema.parse(body);
    const key = `verification/${companyProfile.id}/${Date.now()}-${input.fileName}`;
    const { uploadUrl, fileUrl } = await getVerificationUploadUrl(key, input.mimeType);

    await prisma.companyVerificationDocument.create({
      data: {
        companyProfileId: companyProfile.id,
        fileName: input.fileName,
        mimeType: input.mimeType,
        fileUrl
      }
    });

    return NextResponse.json({ uploadUrl, fileUrl });
  } catch {
    return NextResponse.json({ error: "Unable to create upload URL" }, { status: 400 });
  }
}
