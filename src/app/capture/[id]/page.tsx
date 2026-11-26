import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/db";
import { captures, captivations, comments, users } from "@/db/schema";
import CaptivateButton from "@/components/CaptivateButton";
import ChatterForm from "@/components/ChatterForm";
import ReleaseButton from "@/components/ReleaseButton";
import { releaseCapture, releaseChatter } from "@/app/release-actions";
import SiteHeader from "@/components/SiteHeader"

export default async function CapturePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) notFound();

  const session = await auth();
  const userId = session?.user?.id;

  const [capture] = await db
    .select({
      id: captures.id,
      caption: captures.caption,
      createdAt: captures.createdAt,
      username: users.username,
      authorId: captures.userId,
      captivationCount:
        sql<number>`(select count(*) from ${captivations} where ${captivations.captureId} = ${captures.id})`.mapWith(
          Number,
        ),
      captivated: userId
        ? sql<boolean>`exists (select 1 from ${captivations} where ${captivations.captureId} = ${captures.id} and ${captivations.userId} = ${userId})`
        : sql<boolean>`false`,
    })
    .from(captures)
    .innerJoin(users, eq(captures.userId, users.id))
    .where(eq(captures.id, id))
    .limit(1);

  if (!capture) notFound();

  const chatter = await db
    .select({
      id: comments.id,
      body: comments.body,
      createdAt: comments.createdAt,
      username: users.username,
      authorId: comments.userId,
    })
    .from(comments)
    .innerJoin(users, eq(comments.userId, users.id))
    .where(eq(comments.captureId, id))
    .orderBy(asc(comments.createdAt));

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex max-w-xl flex-col gap-6 px-5 pb-16">
        <article className="neu-raised p-5">
          <div className="flex items-center gap-3">
            <div className="neu-pressed flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-extrabold text-viola-900">
              {(capture.username ?? "?")[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <Link
                href={`/@${capture.username}`}
                className="block truncate font-bold text-viola-900 hover:text-viola-700"
              >
                @{capture.username}
              </Link>
              <p className="text-xs text-viola-700/70">{capture.createdAt.toLocaleString()}</p>
            </div>
          </div>

          <p className="mt-4 whitespace-pre-wrap text-lg leading-snug">{capture.caption}</p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <CaptivateButton
              captureId={capture.id}
              captivated={capture.captivated}
              count={capture.captivationCount}
              signedIn={!!userId}
            />
            {capture.authorId === userId && (
              <div className="ml-auto">
                <ReleaseButton action={releaseCapture} id={capture.id} what="Capture" />
              </div>
            )}
          </div>
        </article>

        {userId ? (
          <ChatterForm captureId={capture.id} />
        ) : (
          <p className="neu-pressed p-4 text-center text-sm text-viola-700">
            <Link href="/check-in" className="font-bold text-viola-900 hover:underline">
              Check In
            </Link>{" "}
            to join the chatter.
          </p>
        )}

        <section className="flex flex-col gap-4">
          <h2 className="px-1 text-xl font-extrabold text-viola-900">Chatter</h2>
          {chatter.length === 0 && (
            <p className="neu-pressed p-4 text-center text-viola-700">Quiet in here.</p>
          )}
          {chatter.map((c) => (
            <div key={c.id} className="neu-raised-sm p-4">
              <div className="flex items-baseline justify-between gap-3">
                <Link
                  href={`/@${c.username}`}
                  className="font-bold text-viola-900 hover:text-viola-700"
                >
                  @{c.username}
                </Link>
                <span className="text-xs text-viola-700/70">{c.createdAt.toLocaleString()}</span>
              </div>
              <p className="mt-2 whitespace-pre-wrap">{c.body}</p>
              {c.authorId === userId && (
                <div className="mt-3">
                  <ReleaseButton action={releaseChatter} id={c.id} what="Chatter" />
                </div>
              )}
            </div>
          ))}
        </section>
      </main>
    </>
  );
}
