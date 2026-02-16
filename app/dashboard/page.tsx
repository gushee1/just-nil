import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rankCompaniesForStudent, rankStudentsForCompany } from "@/lib/recommendations";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { studentProfile: true, companyProfile: true }
  });

  if (!user) {
    redirect("/login");
  }

  if (user.role === "STUDENT" && user.studentProfile) {
    const companies = await prisma.companyProfile.findMany({ include: { user: true } });
    const recommended = rankCompaniesForStudent(user.studentProfile, companies).slice(0, 5);

    return (
      <section className="space-y-4">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h1 className="text-2xl font-semibold">Student Dashboard</h1>
          <p className="mt-2 text-slate-600">Welcome, {user.name}. Here are recommended sponsors for you.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {recommended.map(({ company, score }) => (
            <article key={company.id} className="rounded-lg border border-slate-200 bg-white p-5">
              <h2 className="text-lg font-semibold">{company.companyName}</h2>
              <p className="text-sm text-slate-600">{company.industry}</p>
              <p className="mt-2 text-sm">{company.description}</p>
              <p className="mt-3 text-sm text-brand-700">Match score: {score}</p>
              <Link href={`/profiles/${company.userId}`} className="mt-3 inline-block text-sm font-semibold text-brand-700">
                View profile
              </Link>
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (user.role === "COMPANY" && user.companyProfile) {
    const students = await prisma.studentProfile.findMany({ include: { user: true } });
    const recommended = rankStudentsForCompany(user.companyProfile, students).slice(0, 5);

    return (
      <section className="space-y-4">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h1 className="text-2xl font-semibold">Company Dashboard</h1>
          <p className="mt-2 text-slate-600">Welcome, {user.name}. Here are recommended student partners.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {recommended.map(({ student, score }) => (
            <article key={student.id} className="rounded-lg border border-slate-200 bg-white p-5">
              <h2 className="text-lg font-semibold">{student.user.name}</h2>
              <p className="text-sm text-slate-600">{student.school}</p>
              <p className="mt-2 text-sm">{student.bio}</p>
              <p className="mt-3 text-sm text-brand-700">Match score: {score}</p>
              <Link href={`/profiles/${student.userId}`} className="mt-3 inline-block text-sm font-semibold text-brand-700">
                View profile
              </Link>
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6">
      <h1 className="text-xl font-semibold">Profile setup needed</h1>
      <p className="mt-2 text-slate-600">Your account was created, but profile data is missing. Run the seed script for demo data.</p>
    </section>
  );
}
