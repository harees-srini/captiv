import Link from "next/link";
import { auth, signOut } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-4 p-6">
      <h1 className="text-4xl font-bold">Captiv</h1>
      {session?.user ? (
        <>
          <p>Welcome back, {session.user.name}. You&apos;re captured.</p>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/check-in" });
            }}
          >
            <button className="rounded border px-3 py-2">Escape</button>
          </form>
        </>
      ) : (
        <div className="flex gap-3">
          <Link href="/get-captured" className="rounded bg-black px-3 py-2 text-white">Get Captured</Link>
          <Link href="/check-in" className="rounded border px-3 py-2">Check In</Link>
        </div>
      )}
    </main>
  );
}