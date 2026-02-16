import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { companyProfileSchema } from "@/lib/validation";

async function ensureTagIds(tagNames: string[]) {
  const names = [...new Set(tagNames.map((name) => name.trim().toLowerCase()).filter(Boolean))];
  const tags = await Promise.all(
    names.map((name) =>
      prisma.tag.upsert({
        where: { name },
        update: {},
        create: { name }
      })
    )
  );
  return tags.map((tag) => tag.id);
}

export async function GET() {
  const user = await getCurrentUser([Role.COMPANY]);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.companyProfile.findUnique({
    where: { userId: user.id },
    include: {
      tagsWanted: { include: { tag: true } },
      documents: true
    }
  });

  return NextResponse.json({ profile });
}

export async function PUT(request: Request) {
  const user = await getCurrentUser([Role.COMPANY]);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const input = companyProfileSchema.parse(body);
    const tagIds = await ensureTagIds(input.tags);

    const profile = await prisma.companyProfile.upsert({
      where: { userId: user.id },
      update: {
        companyName: input.companyName,
        website: input.website,
        industry: input.industry,
        contactName: input.contactName,
        contactEmail: input.contactEmail,
        location: input.location,
        lookingFor: input.lookingFor,
        minBudget: input.minBudget,
        maxBudget: input.maxBudget,
        dealTypes: input.dealTypes,
        preferredPlatforms: input.preferredPlatforms
      },
      create: {
        userId: user.id,
        companyName: input.companyName,
        website: input.website,
        industry: input.industry,
        contactName: input.contactName,
        contactEmail: input.contactEmail,
        location: input.location,
        lookingFor: input.lookingFor,
        minBudget: input.minBudget,
        maxBudget: input.maxBudget,
        dealTypes: input.dealTypes,
        preferredPlatforms: input.preferredPlatforms
      }
    });

    await prisma.companyTagWanted.deleteMany({ where: { companyProfileId: profile.id } });
    if (tagIds.length > 0) {
      await prisma.companyTagWanted.createMany({
        data: tagIds.map((tagId) => ({ companyProfileId: profile.id, tagId }))
      });
    }

    const hydratedProfile = await prisma.companyProfile.findUnique({
      where: { id: profile.id },
      include: {
        tagsWanted: { include: { tag: true } },
        documents: true
      }
    });

    return NextResponse.json({ profile: hydratedProfile });
  } catch {
    return NextResponse.json({ error: "Invalid profile payload" }, { status: 400 });
  }
}
