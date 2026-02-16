const bcrypt = require("bcryptjs");
const { PrismaClient, Role } = require("@prisma/client");

const prisma = new PrismaClient();

const STUDENT_PASSWORD = "student123";
const COMPANY_PASSWORD = "company123";

async function createStudent(index) {
  const email = `student${index}@justnil.dev`;
  const name = ["Maya Brooks", "Jordan Kim", "Riley Patel"][index - 1] || `Student ${index}`;
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      passwordHash: await bcrypt.hash(STUDENT_PASSWORD, 10),
      role: Role.STUDENT,
      name
    }
  });

  await prisma.studentProfile.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      school: ["UCLA", "University of Texas", "Ohio State"][index - 1] || "State University",
      graduationYear: 2026 + index,
      bio:
        [
          "Division I sprinter and student creator focused on fitness.",
          "Campus influencer sharing college life and study routines.",
          "Academic standout producing STEM education content."
        ][index - 1] || "Student NIL candidate.",
      tags: ["athlete,fitness", "influencer,lifestyle", "academic,education"][index - 1] || "athlete",
      instagram: `https://instagram.com/student${index}`,
      tiktok: `https://tiktok.com/@student${index}`,
      youtube: `https://youtube.com/@student${index}`
    }
  });
}

async function createCompany(index) {
  const email = `company${index}@justnil.dev`;
  const name = ["PeakFuel Labs", "Campus Threads", "StudyFlow AI"][index - 1] || `Company ${index}`;
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      passwordHash: await bcrypt.hash(COMPANY_PASSWORD, 10),
      role: Role.COMPANY,
      name
    }
  });

  await prisma.companyProfile.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      companyName: name,
      industry: ["Nutrition", "Apparel", "Education Tech"][index - 1] || "Consumer",
      description:
        [
          "Sports nutrition brand sponsoring student athletes.",
          "Lifestyle apparel for campus ambassadors.",
          "EdTech startup partnering with academic creators."
        ][index - 1] || "Brand seeking NIL collaborations.",
      targetTags: ["athlete,fitness", "influencer,lifestyle", "academic,education"][index - 1] || "influencer"
    }
  });
}

async function main() {
  for (let i = 1; i <= 3; i += 1) {
    await createStudent(i);
    await createCompany(i);
  }

  console.log("Seed complete");
  console.log("Student accounts: student1..3@justnil.dev / student123");
  console.log("Company accounts: company1..3@justnil.dev / company123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
