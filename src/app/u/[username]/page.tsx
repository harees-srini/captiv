import Link from "next/link";
import { notFound } from "next/navigation";
import { eq, sql } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getCaptures } from "@/lib/captures";
import CaptureCard from "@/components/CaptureCard";
import CaptiveButton from "@/components/CaptiveButton";
import SiteHeader from "@/components/SiteHeader";

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
    <>
      <SiteHeader />
      <main className="mx-auto flex max-w-xl flex-col gap-6 px-5 pb-16">
        <section className="neu-raised p-6">
          <div className="flex items-center gap-4">
            <div className="neu-pressed flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-2xl font-extrabold text-viola-900">
              {(profile.username ?? "?")[0].toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-2xl font-extrabold text-viola-900">
                @{profile.username}
              </h1>
              {isMe && <p className="text-sm text-viola-700">This is your Cell.</p>}
            </div>
            {viewerId && !isMe && (
              <CaptiveButton userId={profile.id} isCaptive={profile.isCaptive} />
            )}
            {!viewerId && (
              <Link href="/check-in" className="neu-btn text-sm">
                Check In to take captive
              </Link>
            )}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Captives", value: profile.captiveCount },
              { label: "Captors", value: profile.captorCount },
              { label: "Captures", value: profile.captureCount },
              { label: "Captivations", value: profile.captivationsReceived },
            ].map((s) => (
              <div key={s.label} className="neu-pressed p-3 text-center">
                <p className="text-xl font-extrabold text-viola-900">{s.value}</p>
                <p className="text-xs text-viola-700">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-5">
          {theirCaptures.length === 0 && (
            <p className="neu-pressed p-5 text-center text-viola-700">No Captures yet.</p>
          )}
          {theirCaptures.map((c) => (
            <CaptureCard key={c.id} capture={c} viewerId={viewerId} />
          ))}
        </section>
      </main>
    </>
  );
}