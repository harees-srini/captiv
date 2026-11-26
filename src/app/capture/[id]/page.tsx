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
    <main className="mx-auto flex min-h-screen max-w-xl flex-col gap-6 p-6">
      <Link href="/" className="text-sm underline">
        ← Back to The Lineup
      </Link>

      <article className="rounded border p-3">
        <Link
          href={`/@${capture.username}`}
          className="text-sm font-semibold hover:underline"
        >
          @{capture.username}
        </Link>
        <p className="mt-1 whitespace-pre-wrap">{capture.caption}</p>
        <p className="mt-2 text-xs text-gray-500">
          {capture.createdAt.toLocaleString()}
        </p>
        <div className="mt-3">
          <CaptivateButton
            captureId={capture.id}
            captivated={capture.captivated}
            count={capture.captivationCount}
            signedIn={!!userId}
          />
          {capture.authorId === userId && (
            <ReleaseButton
              action={releaseCapture}
              id={capture.id}
              what="Capture"
            />
          )}
        </div>
      </article>

      {userId ? (
        <ChatterForm captureId={capture.id} />
      ) : (
        <p className="text-sm">
          <Link href="/check-in" className="underline">
            Check In
          </Link>{" "}
          to join the chatter.
        </p>
      )}

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Chatter</h2>
        {chatter.length === 0 && (
          <p className="text-gray-500">Quiet in here.</p>
        )}
        {chatter.map((c) => (
          <div key={c.id} className="rounded border p-3">
            <Link
              href={`/@${capture.username}`}
              className="text-sm font-semibold hover:underline"
            >
              @{capture.username}
            </Link>
            <p className="mt-1 whitespace-pre-wrap">{c.body}</p>
            <p className="mt-2 text-xs text-gray-500">
              {c.createdAt.toLocaleString()}
            </p>
            {c.authorId === userId && (
              <div className="mt-2">
                <ReleaseButton
                  action={releaseChatter}
                  id={c.id}
                  what="Chatter"
                />
              </div>
            )}
          </div>
        ))}
      </section>
    </main>
  );
}
