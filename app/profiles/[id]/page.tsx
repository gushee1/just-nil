import { notFound } from "next/navigation";
import { getReadyPrisma } from "@/lib/prisma";

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const prisma = await getReadyPrisma();
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      studentProfile: true,
      companyProfile: true
    }
  });

  if (!user) {
    notFound();
  }

  if (user.role === "STUDENT" && user.studentProfile) {
    const profile = user.studentProfile;
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-semibold">{user.name}</h1>
        <p className="mt-1 text-slate-600">Student at {profile.school}</p>
        <div className="mt-4 space-y-2 text-sm">
          <p>Graduation Year: {profile.graduationYear}</p>
          <p>Bio: {profile.bio || "n/a"}</p>
          <p>Tags: {profile.tags || "n/a"}</p>
          <p>Instagram: {profile.instagram || "n/a"}</p>
          <p>TikTok: {profile.tiktok || "n/a"}</p>
          <p>YouTube: {profile.youtube || "n/a"}</p>
        </div>
      </section>
    );
  }

  if (user.role === "COMPANY" && user.companyProfile) {
    const profile = user.companyProfile;
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-semibold">{profile.companyName}</h1>
        <p className="mt-1 text-slate-600">{profile.industry}</p>
        <div className="mt-4 space-y-2 text-sm">
          <p>Contact: {user.name}</p>
          <p>Description: {profile.description || "n/a"}</p>
          <p>Target tags: {profile.targetTags || "n/a"}</p>
        </div>
      </section>
    );
  }

  notFound();
}
