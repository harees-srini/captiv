"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { captivations } from "@/db/schema";
import { auth } from "@/auth";

export async function toggleCaptivation(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return;

  const parsed = z.string().uuid().safeParse(formData.get("captureId"));
  if (!parsed.success) return;

  const userId = session.user.id;
  const captureId = parsed.data;

  // Try to remove first; if nothing was there, add it.
  const removed = await db
    .delete(captivations)
    .where(and(eq(captivations.userId, userId), eq(captivations.captureId, captureId)))
    .returning();

  if (removed.length === 0) {
    await db.insert(captivations).values({ userId, captureId }).onConflictDoNothing();
  }

  revalidatePath("/");
  revalidatePath(`/capture/${captureId}`);
}