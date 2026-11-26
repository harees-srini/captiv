import Link from "next/link";
import { desc, eq, sql } from "drizzle-orm";
import { auth, signOut } from "@/auth";
import { db } from "@/db";
import { captures, captivations, comments, users } from "@/db/schema";
import CaptureForm from "@/components/CaptureForm";
import CaptivateButton from "@/components/CaptivateButton";
import ReleaseButton from "@/components/ReleaseButton";
import { releaseCapture } from "@/app/release-actions";

export default async function Home() {
  const session = await auth();
  const userId = session?.user?.id;

  const lineup = await db
    .select({
      id: captures.id,
      caption: captures.caption,
      createdAt: captures.createdAt,
      username: users.username,
      authorId: captures.userId,
      captivationCount: sql<number>`(select count(*) from ${captivations} where ${captivations.captureId} = ${captures.id})`.mapWith(Number),
      chatterCount: sql<number>`(select count(*) from ${comments} where ${comments.captureId} = ${captures.id})`.mapWith(Number),
      captivated: userId
        ? sql<boolean>`exists (select 1 from ${captivations} where ${captivations.captureId} = ${captures.id} and ${captivations.userId} = ${userId})`
        : sql<boolean>`false`,
    })
    .from(captures)
    .innerJoin(users, eq(captures.userId, users.id))
    .orderBy(desc(captures.createdAt))
    .limit(50);

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col gap-6 p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Captiv</h1>
        {session?.user ? (
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/check-in" });
            }}
          >
            <button className="rounded border px-3 py-2">Escape</button>
          </form>
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
          <article key={c.id} className="rounded border p-3">
            <p className="text-sm font-semibold">@{c.username}</p>
            <p className="mt-1 whitespace-pre-wrap">{c.caption}</p>
            <p className="mt-2 text-xs text-gray-500">{c.createdAt.toLocaleString()}</p>
            <div className="mt-3 flex items-center gap-4">
              <CaptivateButton
                captureId={c.id}
                captivated={c.captivated}
                count={c.captivationCount}
                signedIn={!!userId}
              />
              <Link href={`/capture/${c.id}`} className="text-sm underline">
                Chatter · {c.chatterCount}
              </Link>
              {c.authorId === userId && (
                <ReleaseButton action={releaseCapture} id={c.id} what="Capture" />
              )}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}