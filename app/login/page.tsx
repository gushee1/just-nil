"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false
    });

    setLoading(false);
    if (!result || result.error) {
      setError("Invalid email or password");
      return;
    }

    router.push((params.get("callbackUrl") || "/dashboard") as "/dashboard");
    router.refresh();
  }

  return (
    <section className="mx-auto max-w-md rounded-lg border border-slate-200 bg-white p-6">
      <h1 className="text-2xl font-semibold">Log in</h1>
      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2"
          required
        />
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <button disabled={loading} className="w-full rounded-md bg-brand-700 px-4 py-2 font-semibold text-white">
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-600">
        No account? <Link href="/signup" className="text-brand-700">Create one</Link>
      </p>
    </section>
  );
}
