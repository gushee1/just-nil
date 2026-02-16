# Just NIL

Prototype full-stack web app that matches students seeking NIL sponsorships with companies ready to sponsor them.

## 1) Architecture

- Frontend: Next.js (App Router) + TypeScript
- Backend API: Next.js Route Handlers (`app/api/*`) running as Vercel serverless functions
- Database: PostgreSQL + Prisma ORM + migrations
- Auth: Email/password, JWT session cookie, role-based access (`STUDENT`, `COMPANY`, `ADMIN`)
- File uploads: Signed S3 upload URL flow for company verification docs
- Matching: Server-side scoring endpoint (`/api/discovery`) based on tag overlap + niche + location + budget/follower heuristics
- IaC/Deployment: Terraform with Vercel provider (project, env vars, domain)

## 2) Core data models

Defined in `prisma/schema.prisma`:

- `User`
  - `email`, `passwordHash`, `role`
- `StudentProfile`
  - `name`, `school`, `graduationYear`, `major`, `archetype`, `followerCount`, `categories`, `niches`, `mediaUrl`
- `StudentSocial`
  - per-platform social links + follower stats
- `CompanyProfile`
  - `companyName`, `industry`, `contact*`, `lookingFor`, `minBudget`, `maxBudget`, `dealTypes`, `preferredPlatforms`, `verificationStatus`
- `Tag`, `StudentTag`, `CompanyTagWanted`
  - normalized tagging for discovery and matching
- `CompanyVerificationDocument`
  - uploaded document metadata
- `MatchInteraction`
  - `LIKE`, `SAVE`, `INTEREST`, `REQUEST_CONTACT`

## 3) Starter MVP happy path implemented

- Landing page: `/`
- Signup/Login: `/signup`, `/login`
- Role-based dashboards:
  - Student: `/dashboard/student` (profile editor)
  - Company: `/dashboard/company` (profile editor + verification upload)
- Discovery feed: `/discovery`
  - Filters for tags/location/follower range
  - Ranked results + actions (`like/save/interest/request contact`)
- Admin endpoint for verification:
  - `PATCH /api/admin/company/:companyId/verify`

## Local development

1. Copy environment file:
   - `cp .env.example .env`
2. Start Postgres:
   - `docker compose up -d`
3. Install dependencies:
   - `npm install`
4. Generate Prisma client + run migrations:
   - `npm run prisma:generate`
   - `npm run prisma:migrate`
5. Seed demo data:
   - `npm run prisma:seed`
6. Run app:
   - `npm run dev`

Seeded accounts:

- Student: `student@example.com` / `password123`
- Company: `company@example.com` / `password123`
- Admin: `admin@example.com` / `password123`

## Terraform + Vercel deployment

Terraform config lives in `terraform/`.

### What Terraform manages

- `vercel_project`
- `vercel_project_environment_variable`
- `vercel_project_domain`

### Steps

1. Copy vars file:
   - `cp terraform/terraform.tfvars.example terraform/terraform.tfvars`
2. Fill in:
   - `vercel_api_token`
   - `vercel_team_id` (optional for personal account)
   - `domain` (optional)
   - `environment_variables` map (`DATABASE_URL`, `SESSION_SECRET`, S3 vars)
3. Apply:
   - `cd terraform`
   - `terraform init`
   - `terraform plan`
   - `terraform apply`

Then connect the Vercel project to your Git repo (or configure via Vercel UI/CLI), and trigger deployment.

## Matching logic

Implemented in `lib/scoring.ts`.

Score combines:

- tag overlap (`student.tags` vs `company.tagsWanted`)
- niche overlap
- category/deal type overlap
- same-location boost
- budget and follower thresholds

Endpoint:

- `GET /api/discovery`

## Tests

- Unit tests for scoring and password hashing in `tests/`
- Run: `npm test`

## Notes / production hardening

- OAuth not enabled in this MVP (email/password implemented)
- Add CSRF protection/rate limiting before production
- Add object access controls and malware scanning for uploads
- Add structured audit trail for admin verification actions
