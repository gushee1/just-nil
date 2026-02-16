# JustNIL Prototype

JustNIL is a prototype two-sided marketplace that connects students seeking NIL sponsorships with companies that want to sponsor them.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Prisma ORM
- SQLite
- NextAuth.js (Credentials provider)

## Features in this prototype

- Landing page
- Signup with role selection (Student or Company)
- Login with email/password
- Role-aware dashboard
- Discovery feed
- Profile pages for students and companies
- Navbar + logout
- Seeded demo data

## Data models

- `User`
  - id, email, passwordHash, role, name, createdAt
- `StudentProfile`
  - id, userId, school, graduationYear, bio, tags, instagram, tiktok, youtube
- `CompanyProfile`
  - id, userId, companyName, industry, description, targetTags

## Local development

1. Install dependencies:

```bash
npm install
```

2. Generate Prisma client:

```bash
npx prisma generate
```

3. Run migrations:

```bash
npx prisma migrate dev
```

4. Seed demo data:

```bash
npm run prisma:seed
```

5. Start dev server:

```bash
npm run dev
```

## Seed/demo credentials

Students:

- `student1@justnil.dev` / `student123`
- `student2@justnil.dev` / `student123`
- `student3@justnil.dev` / `student123`

Companies:

- `company1@justnil.dev` / `company123`
- `company2@justnil.dev` / `company123`
- `company3@justnil.dev` / `company123`

## Deployment (Vercel only)

1. Push this repo to GitHub.
2. Import the repo into Vercel.
3. Set environment variables in Vercel Project Settings:
   - `DATABASE_URL=file:/tmp/dev.db`
   - `NEXTAUTH_URL` to your Vercel URL
   - `NEXTAUTH_SECRET` to a long random value
4. Deploy.

No Terraform, AWS provisioning, or infrastructure-as-code is required.

## Notes

- SQLite is suitable for this prototype.
- On Vercel, SQLite should use `/tmp`, and data is ephemeral.
- The app bootstraps tables at runtime for SQLite deployments if the DB file is empty.
