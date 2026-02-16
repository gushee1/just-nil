import Link from "next/link";

export default function LandingPage() {
  return (
    <section className="space-y-8">
      <div className="rounded-xl bg-gradient-to-r from-brand-900 to-brand-700 p-10 text-white">
        <p className="text-sm uppercase tracking-widest text-brand-100">Two-sided NIL marketplace</p>
        <h1 className="mt-2 text-4xl font-bold">Connect student creators with brand sponsors</h1>
        <p className="mt-4 max-w-2xl text-brand-50">
          JustNIL helps students showcase their audience and helps companies find aligned ambassadors quickly.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/signup" className="rounded-md bg-white px-4 py-2 font-semibold text-brand-900">
            Create account
          </Link>
          <Link href="/login" className="rounded-md border border-brand-100 px-4 py-2 font-semibold text-white">
            Log in
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="font-semibold">Student Profiles</h2>
          <p className="mt-2 text-sm text-slate-600">Share your school, platforms, and niche.</p>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="font-semibold">Company Preferences</h2>
          <p className="mt-2 text-sm text-slate-600">Define target tags and discover matching talent.</p>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="font-semibold">Discovery Feed</h2>
          <p className="mt-2 text-sm text-slate-600">Students and companies get relevant recommendations.</p>
        </article>
      </div>
    </section>
  );
}
