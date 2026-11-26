import Link from "next/link";
import { notFound } from "next/navigation";
import { eq, sql } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getCaptures } from "@/lib/captures";
import CaptureCard from "@/components/CaptureCard";
import CaptiveButton from "@/components/CaptiveButton";

export default async function CellPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const session = await auth();
  const viewerId = session?.user?.id;

  const [profile] = await db
    .select({
      id: users.id,
      username: users.username,
      captureCount: sql<number>`(select count(*) from "capture" where "capture"."userId" = "user"."id")`.mapWith(Number),
      captivationsReceived: sql<number>`(select count(*) from "captivation" inner join "capture" on "captivation"."captureId" = "capture"."id" where "capture"."userId" = "user"."id")`.mapWith(Number),
      captiveCount: sql<number>`(select count(*) from "follow" where "follow"."followerId" = "user"."id")`.mapWith(Number),
      captorCount: sql<number>`(select count(*) from "follow" where "follow"."followingId" = "user"."id")`.mapWith(Number),
      isCaptive: viewerId
        ? sql<boolean>`exists (select 1 from "follow" where "follow"."followerId" = ${viewerId} and "follow"."followingId" = "user"."id")`
        : sql<boolean>`false`,
    })
    .from(users)
    .where(eq(users.username, username.toLowerCase()))
    .limit(1);

  if (!profile) notFound();

  const theirCaptures = await getCaptures({ viewerId, authorId: profile.id });
  const isMe = viewerId === profile.id;

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col gap-6 p-6">
      <Link href="/" className="text-sm underline">← Back to The Lineup</Link>

      <header className="rounded border p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">@{profile.username}</h1>
            {isMe && <p className="text-sm text-gray-500">This is your Cell.</p>}
          </div>
          {viewerId && !isMe && (
            <CaptiveButton userId={profile.id} isCaptive={profile.isCaptive} />
          )}
          {!viewerId && (
            <Link href="/check-in" className="rounded border px-4 py-2 text-sm">
              Check In to take captive
            </Link>
          )}
        </div>
        <p className="mt-3 text-sm">
          <strong>{profile.captiveCount}</strong> Captives ·{" "}
          <strong>{profile.captorCount}</strong> Captors
        </p>
        <p className="mt-1 text-sm text-gray-500">
          {profile.captureCount} Captures · {profile.captivationsReceived} Captivations received
        </p>
      </header>

      <section className="flex flex-col gap-3">
        {theirCaptures.length === 0 && <p className="text-gray-500">No Captures yet.</p>}
        {theirCaptures.map((c) => (
          <CaptureCard key={c.id} capture={c} viewerId={viewerId} />
        ))}
      </section>
    </main>
  );
}