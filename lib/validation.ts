import { Role } from "@prisma/client";
import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.nativeEnum(Role)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const studentProfileSchema = z.object({
  name: z.string().min(2),
  school: z.string().min(2),
  graduationYear: z.number().int().min(2025).max(2100),
  major: z.string().min(2),
  archetype: z.string().min(2),
  location: z.string().optional(),
  bio: z.string().optional(),
  followerCount: z.number().int().nonnegative().default(0),
  mediaUrl: z.string().url().optional(),
  categories: z.array(z.string()).default([]),
  niches: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  socials: z
    .array(
      z.object({
        platform: z.string().min(2),
        url: z.string().url(),
        followers: z.number().int().nonnegative()
      })
    )
    .default([])
});

export const companyProfileSchema = z.object({
  companyName: z.string().min(2),
  website: z.string().url().optional(),
  industry: z.string().min(2),
  contactName: z.string().min(2),
  contactEmail: z.string().email(),
  location: z.string().optional(),
  lookingFor: z.string().min(5),
  minBudget: z.number().int().nonnegative().optional(),
  maxBudget: z.number().int().nonnegative().optional(),
  dealTypes: z.array(z.string()).default([]),
  preferredPlatforms: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([])
});
