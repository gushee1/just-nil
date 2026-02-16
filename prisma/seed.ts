import { PrismaClient, Role } from "@prisma/client";
import { hashPassword } from "../lib/auth";

const prisma = new PrismaClient();

async function upsertTag(name: string) {
  return prisma.tag.upsert({
    where: { name },
    update: {},
    create: { name }
  });
}

async function main() {
  const tags = await Promise.all(
    ["basketball", "fitness", "tech", "gaming", "campus-life", "fashion", "study-tips"].map(upsertTag)
  );

  const studentUser = await prisma.user.upsert({
    where: { email: "student@example.com" },
    update: {},
    create: {
      email: "student@example.com",
      passwordHash: await hashPassword("password123"),
      role: Role.STUDENT
    }
  });

  const companyUser = await prisma.user.upsert({
    where: { email: "company@example.com" },
    update: {},
    create: {
      email: "company@example.com",
      passwordHash: await hashPassword("password123"),
      role: Role.COMPANY
    }
  });

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      passwordHash: await hashPassword("password123"),
      role: Role.ADMIN
    }
  });

  const student = await prisma.studentProfile.upsert({
    where: { userId: studentUser.id },
    update: {},
    create: {
      userId: studentUser.id,
      name: "Ari Carter",
      school: "State University",
      graduationYear: 2027,
      major: "Marketing",
      archetype: "athlete",
      location: "Austin, TX",
      bio: "Guard on the basketball team and campus creator.",
      followerCount: 24000,
      categories: ["sports", "lifestyle"],
      niches: ["basketball", "fitness"]
    }
  });

  await prisma.studentSocial.createMany({
    data: [
      { studentProfileId: student.id, platform: "Instagram", url: "https://instagram.com/ari", followers: 18000 },
      { studentProfileId: student.id, platform: "TikTok", url: "https://tiktok.com/@ari", followers: 6000 }
    ],
    skipDuplicates: true
  });

  await prisma.studentTag.createMany({
    data: tags.slice(0, 2).map((tag) => ({ studentProfileId: student.id, tagId: tag.id })),
    skipDuplicates: true
  });

  const company = await prisma.companyProfile.upsert({
    where: { userId: companyUser.id },
    update: {},
    create: {
      userId: companyUser.id,
      companyName: "PeakFuel Nutrition",
      website: "https://peakfuel.example",
      industry: "Health",
      contactName: "Morgan Lee",
      contactEmail: "morgan@peakfuel.example",
      location: "Dallas, TX",
      lookingFor: "Student creators in fitness and basketball",
      minBudget: 1000,
      maxBudget: 7000,
      dealTypes: ["sponsored-post", "event-appearance"],
      preferredPlatforms: ["Instagram", "TikTok"]
    }
  });

  await prisma.companyTagWanted.createMany({
    data: [tags[0], tags[1], tags[2]].map((tag) => ({ companyProfileId: company.id, tagId: tag.id })),
    skipDuplicates: true
  });

  console.log("Seed complete", { studentUser: studentUser.email, companyUser: companyUser.email, adminUser: adminUser.email });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
