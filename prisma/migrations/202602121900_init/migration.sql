-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'COMPANY', 'ADMIN');
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');
CREATE TYPE "InteractionType" AS ENUM ('LIKE', 'SAVE', 'INTEREST', 'REQUEST_CONTACT');

-- CreateTable
CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "role" "Role" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "StudentProfile" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "school" TEXT NOT NULL,
  "graduationYear" INTEGER NOT NULL,
  "major" TEXT NOT NULL,
  "archetype" TEXT NOT NULL,
  "location" TEXT,
  "bio" TEXT,
  "followerCount" INTEGER NOT NULL DEFAULT 0,
  "mediaUrl" TEXT,
  "categories" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "niches" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "StudentProfile_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "StudentSocial" (
  "id" TEXT NOT NULL,
  "studentProfileId" TEXT NOT NULL,
  "platform" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "followers" INTEGER NOT NULL,
  CONSTRAINT "StudentSocial_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CompanyProfile" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "companyName" TEXT NOT NULL,
  "website" TEXT,
  "industry" TEXT NOT NULL,
  "contactName" TEXT NOT NULL,
  "contactEmail" TEXT NOT NULL,
  "location" TEXT,
  "lookingFor" TEXT NOT NULL,
  "minBudget" INTEGER,
  "maxBudget" INTEGER,
  "dealTypes" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "preferredPlatforms" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CompanyProfile_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Tag" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "StudentTag" (
  "id" TEXT NOT NULL,
  "studentProfileId" TEXT NOT NULL,
  "tagId" TEXT NOT NULL,
  CONSTRAINT "StudentTag_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CompanyTagWanted" (
  "id" TEXT NOT NULL,
  "companyProfileId" TEXT NOT NULL,
  "tagId" TEXT NOT NULL,
  CONSTRAINT "CompanyTagWanted_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CompanyVerificationDocument" (
  "id" TEXT NOT NULL,
  "companyProfileId" TEXT NOT NULL,
  "fileName" TEXT NOT NULL,
  "fileUrl" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CompanyVerificationDocument_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MatchInteraction" (
  "id" TEXT NOT NULL,
  "actorUserId" TEXT NOT NULL,
  "targetUserId" TEXT NOT NULL,
  "type" "InteractionType" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MatchInteraction_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "StudentProfile_userId_key" ON "StudentProfile"("userId");
CREATE UNIQUE INDEX "CompanyProfile_userId_key" ON "CompanyProfile"("userId");
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");
CREATE UNIQUE INDEX "StudentTag_studentProfileId_tagId_key" ON "StudentTag"("studentProfileId", "tagId");
CREATE UNIQUE INDEX "CompanyTagWanted_companyProfileId_tagId_key" ON "CompanyTagWanted"("companyProfileId", "tagId");
CREATE UNIQUE INDEX "MatchInteraction_actorUserId_targetUserId_type_key" ON "MatchInteraction"("actorUserId", "targetUserId", "type");

-- Foreign keys
ALTER TABLE "StudentProfile" ADD CONSTRAINT "StudentProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "StudentSocial" ADD CONSTRAINT "StudentSocial_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CompanyProfile" ADD CONSTRAINT "CompanyProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "StudentTag" ADD CONSTRAINT "StudentTag_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "StudentTag" ADD CONSTRAINT "StudentTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CompanyTagWanted" ADD CONSTRAINT "CompanyTagWanted_companyProfileId_fkey" FOREIGN KEY ("companyProfileId") REFERENCES "CompanyProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CompanyTagWanted" ADD CONSTRAINT "CompanyTagWanted_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CompanyVerificationDocument" ADD CONSTRAINT "CompanyVerificationDocument_companyProfileId_fkey" FOREIGN KEY ("companyProfileId") REFERENCES "CompanyProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MatchInteraction" ADD CONSTRAINT "MatchInteraction_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MatchInteraction" ADD CONSTRAINT "MatchInteraction_targetUserId_fkey" FOREIGN KEY ("targetUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
