import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  if (user.role === "STUDENT") {
    redirect("/dashboard/student");
  }

  if (user.role === "COMPANY") {
    redirect("/dashboard/company");
  }

  return (
    <div className="card">
      <h2>Admin dashboard</h2>
      <p>Use admin API endpoints to moderate company verification status.</p>
    </div>
  );
}
