import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LogoutButton } from "@/components/LogoutButton";

export async function NavBar() {
  const session = await getServerSession(authOptions);

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold text-brand-700">
          JustNIL
        </Link>

        <nav className="flex items-center gap-4 text-sm font-medium text-slate-700">
          <Link href="/discovery" className="hover:text-brand-700">
            Discovery
          </Link>
          <Link href="/dashboard" className="hover:text-brand-700">
            Dashboard
          </Link>
          {session ? (
            <>
              <span className="hidden text-slate-500 sm:inline">{session.user.email}</span>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-brand-700">
                Login
              </Link>
              <Link href="/signup" className="rounded-md bg-brand-700 px-3 py-2 text-white hover:bg-brand-500">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
