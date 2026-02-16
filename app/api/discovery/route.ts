import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { scoreCompanyForStudent, scoreStudentForCompany } from "@/lib/scoring";

function asArray(value: string | null) {
  if (!value) {
    return [];
  }
  return value
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

export async function GET(request: Request) {
  const user = await getCurrentUser([Role.STUDENT, Role.COMPANY]);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const filterTags = asArray(searchParams.get("tags"));
  const location = searchParams.get("location")?.toLowerCase() ?? null;
  const minFollowers = Number(searchParams.get("minFollowers") ?? 0);

  if (user.role === Role.STUDENT) {
    const student = await prisma.studentProfile.findUnique({
      where: { userId: user.id },
      include: { tags: { include: { tag: true } } }
    });

    if (!student) {
      return NextResponse.json({ items: [] });
    }

    const companies = await prisma.companyProfile.findMany({
      where: {
        ...(location ? { location: { contains: location, mode: "insensitive" } } : {})
      },
      include: {
        tagsWanted: { include: { tag: true } }
      }
    });

    const ranked = companies
      .map((company) => {
        const tagsWanted = company.tagsWanted.map((entry) => entry.tag.name);
        const score = scoreCompanyForStudent(
          {
            id: student.id,
            userId: student.userId,
            name: student.name,
            location: student.location,
            followerCount: student.followerCount,
            tags: student.tags.map((entry) => entry.tag.name),
            categories: student.categories,
            niches: student.niches
          },
          {
            id: company.id,
            userId: company.userId,
            companyName: company.companyName,
            location: company.location,
            minBudget: company.minBudget,
            maxBudget: company.maxBudget,
            tagsWanted,
            preferredPlatforms: company.preferredPlatforms,
            dealTypes: company.dealTypes
          }
        );

        return {
          id: company.id,
          userId: company.userId,
          title: company.companyName,
          subtitle: `${company.industry} | ${company.location ?? "Remote"}`,
          tags: tagsWanted,
          score,
          budgetRange: [company.minBudget, company.maxBudget]
        };
      })
      .filter((item) => (filterTags.length ? filterTags.some((tag) => item.tags.includes(tag)) : true))
      .sort((a, b) => b.score - a.score);

    return NextResponse.json({ items: ranked });
  }

  const company = await prisma.companyProfile.findUnique({
    where: { userId: user.id },
    include: { tagsWanted: { include: { tag: true } } }
  });

  if (!company) {
    return NextResponse.json({ items: [] });
  }

  const students = await prisma.studentProfile.findMany({
    where: {
      followerCount: { gte: minFollowers },
      ...(location ? { location: { contains: location, mode: "insensitive" } } : {})
    },
    include: {
      tags: { include: { tag: true } }
    }
  });

  const ranked = students
    .map((student) => {
      const score = scoreStudentForCompany(
        {
          id: company.id,
          userId: company.userId,
          companyName: company.companyName,
          location: company.location,
          minBudget: company.minBudget,
          maxBudget: company.maxBudget,
          tagsWanted: company.tagsWanted.map((entry) => entry.tag.name),
          preferredPlatforms: company.preferredPlatforms,
          dealTypes: company.dealTypes
        },
        {
          id: student.id,
          userId: student.userId,
          name: student.name,
          location: student.location,
          followerCount: student.followerCount,
          tags: student.tags.map((entry) => entry.tag.name),
          categories: student.categories,
          niches: student.niches
        }
      );

      return {
        id: student.id,
        userId: student.userId,
        title: student.name,
        subtitle: `${student.school} | ${student.archetype}`,
        tags: student.tags.map((entry) => entry.tag.name),
        score,
        followers: student.followerCount
      };
    })
    .filter((item) => (filterTags.length ? filterTags.some((tag) => item.tags.includes(tag)) : true))
    .sort((a, b) => b.score - a.score);

  return NextResponse.json({ items: ranked });
}
