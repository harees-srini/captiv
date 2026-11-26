import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { captures, captivations, comments, users } from "@/db/schema";

export async function getCaptures({
  viewerId,
  authorId,
  limit = 50,
}: {
  viewerId?: string;
  authorId?: string;
  limit?: number;
}) {
  return db
    .select({
      id: captures.id,
      caption: captures.caption,
      createdAt: captures.createdAt,
      username: users.username,
      authorId: captures.userId,
      captivationCount: sql<number>`(select count(*) from ${captivations} where ${captivations.captureId} = ${captures.id})`.mapWith(Number),
      chatterCount: sql<number>`(select count(*) from ${comments} where ${comments.captureId} = ${captures.id})`.mapWith(Number),
      captivated: viewerId
        ? sql<boolean>`exists (select 1 from ${captivations} where ${captivations.captureId} = ${captures.id} and ${captivations.userId} = ${viewerId})`
        : sql<boolean>`false`,
    })
    .from(captures)
    .innerJoin(users, eq(captures.userId, users.id))
    .where(authorId ? eq(captures.userId, authorId) : undefined)
    .orderBy(desc(captures.createdAt))
    .limit(limit);
}

export type CaptureCardData = Awaited<ReturnType<typeof getCaptures>>[number];