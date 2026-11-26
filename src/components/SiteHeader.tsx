import Link from "next/link";
import { auth, signOut } from "@/auth";

export default async function SiteHeader() {
  const session = await auth();

  return (
    <header className="mx-auto flex max-w-xl items-center justify-between px-5 py-7">
      <Link href="/" className="text-3xl font-extrabold tracking-tight text-viola-900">
        Capti<span className="text-gold">v</span>
      </Link>

      {session?.user ? (
        <nav className="flex items-center gap-3">
          <Link href={`/@${session.user.name}`} className="neu-btn">
            My Cell
          </Link>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/check-in" });
            }}
          >
            <button className="neu-btn">Escape</button>
          </form>
        </nav>
      ) : (
        <nav className="flex items-center gap-3">
          <Link href="/check-in" className="neu-btn">
            Check In
          </Link>
          <Link href="/get-captured" className="neu-btn neu-btn-primary">
            Get Captured
          </Link>
        </nav>
      )}
    </header>
  );
}