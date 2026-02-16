import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { studentProfileSchema } from "@/lib/validation";

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
  const user = await getCurrentUser([Role.STUDENT]);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.studentProfile.findUnique({
    where: { userId: user.id },
    include: {
      socials: true,
      tags: { include: { tag: true } }
    }
  });

  return NextResponse.json({ profile });
}

export async function PUT(request: Request) {
  const user = await getCurrentUser([Role.STUDENT]);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const input = studentProfileSchema.parse(body);
    const tagIds = await ensureTagIds(input.tags);

    const profile = await prisma.studentProfile.upsert({
      where: { userId: user.id },
      update: {
        name: input.name,
        school: input.school,
        graduationYear: input.graduationYear,
        major: input.major,
        archetype: input.archetype,
        location: input.location,
        bio: input.bio,
        followerCount: input.followerCount,
        mediaUrl: input.mediaUrl,
        categories: input.categories,
        niches: input.niches
      },
      create: {
        userId: user.id,
        name: input.name,
        school: input.school,
        graduationYear: input.graduationYear,
        major: input.major,
        archetype: input.archetype,
        location: input.location,
        bio: input.bio,
        followerCount: input.followerCount,
        mediaUrl: input.mediaUrl,
        categories: input.categories,
        niches: input.niches
      }
    });

    await prisma.$transaction([
      prisma.studentSocial.deleteMany({ where: { studentProfileId: profile.id } }),
      prisma.studentTag.deleteMany({ where: { studentProfileId: profile.id } })
    ]);

    if (input.socials.length > 0) {
      await prisma.studentSocial.createMany({
        data: input.socials.map((social) => ({
          studentProfileId: profile.id,
          platform: social.platform,
          url: social.url,
          followers: social.followers
        }))
      });
    }

    if (tagIds.length > 0) {
      await prisma.studentTag.createMany({
        data: tagIds.map((tagId) => ({ studentProfileId: profile.id, tagId }))
      });
    }

    const hydratedProfile = await prisma.studentProfile.findUnique({
      where: { id: profile.id },
      include: {
        socials: true,
        tags: { include: { tag: true } }
      }
    });

    return NextResponse.json({ profile: hydratedProfile });
  } catch {
    return NextResponse.json({ error: "Invalid profile payload" }, { status: 400 });
  }
}
