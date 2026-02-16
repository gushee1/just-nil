import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/LogoutButton";
import { StudentProfileForm } from "@/components/StudentProfileForm";
import { getCurrentUser } from "@/lib/current-user";

export default async function StudentDashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  if (user.role !== "STUDENT") {
    redirect("/dashboard");
  }

  return (
    <>
      <div className="card row" style={{ justifyContent: "space-between" }}>
        <p className="small">Signed in as {user.email}</p>
        <LogoutButton />
      </div>
      <StudentProfileForm />
    </>
  );
}
