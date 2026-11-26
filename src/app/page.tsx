import Link from "next/link";
import { auth, signOut } from "@/auth";
import { getCaptures } from "@/lib/captures";
import CaptureForm from "@/components/CaptureForm";
import CaptureCard from "@/components/CaptureCard";

export default async function Home() {
  const session = await auth();
  const userId = session?.user?.id;
  const lineup = await getCaptures({ viewerId: userId });

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col gap-6 p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Captiv</h1>
        {session?.user ? (
          <div className="flex items-center gap-2">
            <Link href={`/@${session.user.name}`} className="rounded border px-3 py-2">
              My Cell
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/check-in" });
              }}
            >
              <button className="rounded border px-3 py-2">Escape</button>
            </form>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link href="/get-captured" className="rounded bg-black px-3 py-2 text-white">Get Captured</Link>
            <Link href="/check-in" className="rounded border px-3 py-2">Check In</Link>
          </div>
        )}
      </header>

      {session?.user && <CaptureForm />}

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">The Lineup</h2>
        {lineup.length === 0 && (
          <p className="text-gray-500">Nobody&apos;s been captured yet. Be the first.</p>
        )}
        {lineup.map((c) => (
          <CaptureCard key={c.id} capture={c} viewerId={userId} />
        ))}
      </section>
    </main>
  );
}