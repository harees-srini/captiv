import Link from "next/link";
import { notFound } from "next/navigation";
import { eq, sql } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { users, captures, captivations } from "@/db/schema";
import { getCaptures } from "@/lib/captures";
import CaptureCard from "@/components/CaptureCard";

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
        <h1 className="text-3xl font-bold">@{profile.username}</h1>
        {isMe && <p className="text-sm text-gray-500">This is your Cell.</p>}
        <p className="mt-2 text-sm">
          {profile.captureCount} Captures · {profile.captivationsReceived} Captivations received
        </p>
      </header>

      <section className="flex flex-col gap-3">
        {theirCaptures.length === 0 && (
          <p className="text-gray-500">No Captures yet.</p>
        )}
        {theirCaptures.map((c) => (
          <CaptureCard key={c.id} capture={c} viewerId={viewerId} />
        ))}
      </section>
    </main>
  );
}