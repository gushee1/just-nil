import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  dbBootstrapPromise?: Promise<void>;
};

export function getPrisma() {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"]
    });
  }
  return globalForPrisma.prisma;
}

async function bootstrapSqlite(prisma: PrismaClient) {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "User" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "email" TEXT NOT NULL,
      "passwordHash" TEXT NOT NULL,
      "role" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "StudentProfile" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "userId" TEXT NOT NULL,
      "school" TEXT NOT NULL,
      "graduationYear" INTEGER NOT NULL,
      "bio" TEXT NOT NULL,
      "tags" TEXT NOT NULL,
      "instagram" TEXT,
      "tiktok" TEXT,
      "youtube" TEXT,
      CONSTRAINT "StudentProfile_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "User" ("id")
        ON DELETE CASCADE ON UPDATE CASCADE
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "CompanyProfile" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "userId" TEXT NOT NULL,
      "companyName" TEXT NOT NULL,
      "industry" TEXT NOT NULL,
      "description" TEXT NOT NULL,
      "targetTags" TEXT NOT NULL,
      CONSTRAINT "CompanyProfile_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "User" ("id")
        ON DELETE CASCADE ON UPDATE CASCADE
    );
  `);

  await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");`);
  await prisma.$executeRawUnsafe(
    `CREATE UNIQUE INDEX IF NOT EXISTS "StudentProfile_userId_key" ON "StudentProfile"("userId");`
  );
  await prisma.$executeRawUnsafe(
    `CREATE UNIQUE INDEX IF NOT EXISTS "CompanyProfile_userId_key" ON "CompanyProfile"("userId");`
  );

  const userCount = await prisma.user.count();
  if (userCount > 0) {
    return;
  }

  const studentPasswordHash = await bcrypt.hash("student123", 10);
  const companyPasswordHash = await bcrypt.hash("company123", 10);

  const students = [
    {
      name: "Maya Brooks",
      email: "student1@justnil.dev",
      school: "UCLA",
      graduationYear: 2027,
      bio: "Division I sprinter and student creator focused on fitness.",
      tags: "athlete,fitness"
    },
    {
      name: "Jordan Kim",
      email: "student2@justnil.dev",
      school: "University of Texas",
      graduationYear: 2028,
      bio: "Campus influencer sharing college life and study routines.",
      tags: "influencer,lifestyle"
    },
    {
      name: "Riley Patel",
      email: "student3@justnil.dev",
      school: "Ohio State",
      graduationYear: 2029,
      bio: "Academic standout producing STEM education content.",
      tags: "academic,education"
    }
  ];

  const companies = [
    {
      name: "PeakFuel Labs",
      email: "company1@justnil.dev",
      companyName: "PeakFuel Labs",
      industry: "Nutrition",
      description: "Sports nutrition brand sponsoring student athletes.",
      targetTags: "athlete,fitness"
    },
    {
      name: "Campus Threads",
      email: "company2@justnil.dev",
      companyName: "Campus Threads",
      industry: "Apparel",
      description: "Lifestyle apparel for campus ambassadors.",
      targetTags: "influencer,lifestyle"
    },
    {
      name: "StudyFlow AI",
      email: "company3@justnil.dev",
      companyName: "StudyFlow AI",
      industry: "Education Tech",
      description: "EdTech startup partnering with academic creators.",
      targetTags: "academic,education"
    }
  ];

  for (const student of students) {
    await prisma.user.create({
      data: {
        name: student.name,
        email: student.email,
        passwordHash: studentPasswordHash,
        role: Role.STUDENT,
        studentProfile: {
          create: {
            school: student.school,
            graduationYear: student.graduationYear,
            bio: student.bio,
            tags: student.tags,
            instagram: `https://instagram.com/${student.email.split("@")[0]}`,
            tiktok: `https://tiktok.com/@${student.email.split("@")[0]}`,
            youtube: `https://youtube.com/@${student.email.split("@")[0]}`
          }
        }
      }
    });
  }

  for (const company of companies) {
    await prisma.user.create({
      data: {
        name: company.name,
        email: company.email,
        passwordHash: companyPasswordHash,
        role: Role.COMPANY,
        companyProfile: {
          create: {
            companyName: company.companyName,
            industry: company.industry,
            description: company.description,
            targetTags: company.targetTags
          }
        }
      }
    });
  }
}

export async function getReadyPrisma() {
  const prisma = getPrisma();
  const databaseUrl = process.env.DATABASE_URL ?? "";

  if (!databaseUrl.startsWith("file:")) {
    return prisma;
  }

  if (!globalForPrisma.dbBootstrapPromise) {
    globalForPrisma.dbBootstrapPromise = bootstrapSqlite(prisma).catch((error) => {
      globalForPrisma.dbBootstrapPromise = undefined;
      throw error;
    });
  }

  await globalForPrisma.dbBootstrapPromise;
  return prisma;
}
