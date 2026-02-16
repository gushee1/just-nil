import "./globals.css";
import Link from "next/link";
import { ReactNode } from "react";

export const metadata = {
  title: "Just NIL",
  description: "Connect students and sponsors for NIL opportunities"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main>
          <header className="card row" style={{ justifyContent: "space-between" }}>
            <Link href="/" style={{ fontWeight: 700, textDecoration: "none" }}>
              Just NIL
            </Link>
            <div className="row">
              <Link href="/login">Login</Link>
              <Link href="/signup">Sign up</Link>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/discovery">Discovery</Link>
            </div>
          </header>
          {children}
        </main>
      </body>
    </html>
  );
}
