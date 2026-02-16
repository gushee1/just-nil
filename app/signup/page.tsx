"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type Role = "STUDENT" | "COMPANY";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("STUDENT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role })
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? "Signup failed");
      setLoading(false);
      return;
    }

    await signIn("credentials", { email, password, redirect: false });
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <section className="mx-auto max-w-md rounded-lg border border-slate-200 bg-white p-6">
      <h1 className="text-2xl font-semibold">Create your JustNIL account</h1>
      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <input
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2"
          required
        />
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
          placeholder="Password (8+ chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2"
          minLength={8}
          required
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          className="w-full rounded-md border border-slate-300 px-3 py-2"
        >
          <option value="STUDENT">Student</option>
          <option value="COMPANY">Company</option>
        </select>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <button disabled={loading} className="w-full rounded-md bg-brand-700 px-4 py-2 font-semibold text-white">
          {loading ? "Creating account..." : "Sign up"}
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-600">
        Already registered? <Link href="/login" className="text-brand-700">Log in</Link>
      </p>
    </section>
  );
}
