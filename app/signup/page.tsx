"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"STUDENT" | "COMPANY">("STUDENT");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role })
    });

    setLoading(false);
    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? "Signup failed");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="card">
      <h2>Create account</h2>
      <form onSubmit={onSubmit} className="grid">
        <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value as "STUDENT" | "COMPANY")}>
          <option value="STUDENT">Student</option>
          <option value="COMPANY">Company</option>
        </select>
        {error ? <p className="error">{error}</p> : null}
        <button disabled={loading}>{loading ? "Creating..." : "Sign up"}</button>
      </form>
    </div>
  );
}
