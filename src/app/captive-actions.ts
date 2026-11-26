"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { follows, users } from "@/db/schema";
import { auth } from "@/auth";

export async function toggleCaptive(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return;

  const parsed = z.string().uuid().safeParse(formData.get("userId"));
  if (!parsed.success) return;

  const followerId = session.user.id;
  const followingId = parsed.data;

  if (followerId === followingId) return; // no taking yourself captive

  const [target] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.id, followingId))
    .limit(1);
  if (!target) return;

  // Same toggle pattern as Captivations: try to remove, otherwise add.
  const removed = await db
    .delete(follows)
    .where(and(eq(follows.followerId, followerId), eq(follows.followingId, followingId)))
    .returning();

  if (removed.length === 0) {
    await db.insert(follows).values({ followerId, followingId }).onConflictDoNothing();
  }

  revalidatePath("/u/[username]", "page");
}