import Link from "next/link";

export default function LandingPage() {
  return (
    <section>
      <div className="card">
        <h1>Find your next NIL partnership</h1>
        <p>
          Just NIL connects student talent with brands ready to sponsor creators, athletes, and campus leaders.
          Build your profile, discover matches, and express interest in one place.
        </p>
        <div className="row">
          <Link href="/signup" style={{ textDecoration: "none", width: "100%" }}>
            <button>Create account</button>
          </Link>
          <Link href="/login" style={{ textDecoration: "none", width: "100%" }}>
            <button className="secondary">Log in</button>
          </Link>
        </div>
      </div>
      <div className="grid two">
        <article className="card">
          <h3>For students</h3>
          <p>Showcase your niche, social reach, and goals. Get ranked recommendations from sponsor companies.</p>
        </article>
        <article className="card">
          <h3>For companies</h3>
          <p>Define your audience, budget, and deal types. Review recommended students and request contact.</p>
        </article>
      </div>
    </section>
  );
}
