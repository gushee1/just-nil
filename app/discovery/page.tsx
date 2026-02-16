import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getReadyPrisma } from "@/lib/prisma";

export default async function DiscoveryPage() {
  const prisma = await getReadyPrisma();
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    redirect("/login");
  }

  if (user.role === "STUDENT") {
    const companies = await prisma.companyProfile.findMany({ include: { user: true } });

    return (
      <section>
        <h1 className="mb-4 text-2xl font-semibold">Discovery: Company Sponsors</h1>
        <div className="grid gap-4 md:grid-cols-2">
          {companies.map((company) => (
            <article key={company.id} className="rounded-lg border border-slate-200 bg-white p-5">
              <h2 className="text-lg font-semibold">{company.companyName}</h2>
              <p className="text-sm text-slate-600">{company.industry}</p>
              <p className="mt-2 text-sm">Target tags: {company.targetTags || "n/a"}</p>
              <Link href={`/profiles/${company.userId}`} className="mt-3 inline-block text-sm font-semibold text-brand-700">
                View company profile
              </Link>
            </article>
          ))}
        </div>
      </section>
    );
  }

  const students = await prisma.studentProfile.findMany({ include: { user: true } });

  return (
    <section>
      <h1 className="mb-4 text-2xl font-semibold">Discovery: Student Talent</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {students.map((student) => (
          <article key={student.id} className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-semibold">{student.user.name}</h2>
            <p className="text-sm text-slate-600">{student.school}</p>
            <p className="mt-2 text-sm">Tags: {student.tags || "n/a"}</p>
            <Link href={`/profiles/${student.userId}`} className="mt-3 inline-block text-sm font-semibold text-brand-700">
              View student profile
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
