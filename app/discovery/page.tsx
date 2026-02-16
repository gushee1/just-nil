import { redirect } from "next/navigation";
import { DiscoveryFeed } from "@/components/DiscoveryFeed";
import { LogoutButton } from "@/components/LogoutButton";
import { getCurrentUser } from "@/lib/current-user";

export default async function DiscoveryPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <section>
      <div className="card row" style={{ justifyContent: "space-between" }}>
        <div>
          <h2>Discovery feed</h2>
          <p className="small">Recommendations are ranked by shared tags, niche overlap, and audience/budget alignment.</p>
        </div>
        <LogoutButton />
      </div>
      <DiscoveryFeed />
    </section>
  );
}
