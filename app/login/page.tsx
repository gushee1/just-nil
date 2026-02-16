"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("student@example.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    setLoading(false);
    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? "Login failed");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="card">
      <h2>Log in</h2>
      <form onSubmit={onSubmit} className="grid">
        <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error ? <p className="error">{error}</p> : null}
        <button disabled={loading}>{loading ? "Signing in..." : "Log in"}</button>
      </form>
    </div>
  );
}
