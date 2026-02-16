# JustNIL Prototype

JustNIL is a two-sided marketplace prototype connecting students seeking NIL sponsorships with companies looking to sponsor them.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- NextAuth.js (Credentials)
- Prisma ORM
- PostgreSQL

## What changed for production reliability

- SQLite was removed to avoid ephemeral serverless file-storage issues on Vercel.
- Prisma now uses PostgreSQL via `DATABASE_URL`.
- Vercel build runs migrations before building the app:
  - `prisma migrate deploy && next build`

## Data models

- `User`
  - id, email, passwordHash, role, name, createdAt
- `StudentProfile`
  - id, userId, school, graduationYear, bio, tags, instagram, tiktok, youtube
- `CompanyProfile`
  - id, userId, companyName, industry, description, targetTags

## Environment variables

Required in local and Vercel:

- `DATABASE_URL` (PostgreSQL connection string)
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

See `.env.example`.

## Local development

1. Install dependencies:

```bash
npm install
```

2. Copy envs:

```bash
cp .env.example .env
```

3. Ensure your local Postgres is running and `DATABASE_URL` points to it.

4. Run migrations:

```bash
npx prisma migrate dev
```

5. Seed demo data:

```bash
npm run prisma:seed
```

6. Start dev server:

```bash
npm run dev
```

## Demo accounts

Students:

- `student1@justnil.dev` / `student123`
- `student2@justnil.dev` / `student123`
- `student3@justnil.dev` / `student123`

Companies:

- `company1@justnil.dev` / `company123`
- `company2@justnil.dev` / `company123`
- `company3@justnil.dev` / `company123`

## Vercel deployment (Git push only)

1. Push repo to GitHub.
2. Import into Vercel.
3. Attach Vercel Postgres (recommended) or provide any Postgres URL.
4. Set environment variables in Vercel Project Settings:
   - `DATABASE_URL` = your Postgres connection string
   - `NEXTAUTH_SECRET` = long random secret
   - `NEXTAUTH_URL` = your deployed app URL (for example `https://your-app.vercel.app`)
5. Deploy.

The build script automatically runs:

- `prisma migrate deploy`
- `next build`

## Dev-only DB inspection endpoint

- Route: `GET /api/dev/users`
- Behavior:
  - Returns recent users (`id`, `email`, `role`, `createdAt`) in development
  - Requires authenticated session
  - Returns `404` in production

## Smoke test checklist

1. Open deployed app.
2. Sign up as `Student` with a new email.
3. Log out and log in with that email/password.
4. Confirm dashboard loads and discovery page works.
5. Confirm profile page loads from discovery links.
6. (Local dev only) call `GET /api/dev/users` while logged in and verify the new user row exists.
7. Check Vercel build logs show successful `prisma migrate deploy` before `next build`.
