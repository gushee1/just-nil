import { redirect } from "next/navigation";
import { CompanyProfileForm } from "@/components/CompanyProfileForm";
import { LogoutButton } from "@/components/LogoutButton";
import { getCurrentUser } from "@/lib/current-user";

export default async function CompanyDashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  if (user.role !== "COMPANY") {
    redirect("/dashboard");
  }

  return (
    <>
      <div className="card row" style={{ justifyContent: "space-between" }}>
        <p className="small">Signed in as {user.email}</p>
        <LogoutButton />
      </div>
      <CompanyProfileForm />
    </>
  );
}
