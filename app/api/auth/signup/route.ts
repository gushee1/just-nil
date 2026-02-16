import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum([Role.STUDENT, Role.COMPANY])
});

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid signup data" }, { status: 400 });
  }

  const { name, email, password, role } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role,
      studentProfile:
        role === Role.STUDENT
          ? {
              create: {
                school: "",
                graduationYear: new Date().getFullYear() + 1,
                bio: "",
                tags: "",
                instagram: "",
                tiktok: "",
                youtube: ""
              }
            }
          : undefined,
      companyProfile:
        role === Role.COMPANY
          ? {
              create: {
                companyName: `${name} Company`,
                industry: "",
                description: "",
                targetTags: ""
              }
            }
          : undefined
    }
  });

  return NextResponse.json({ id: user.id, email: user.email, role: user.role }, { status: 201 });
}
