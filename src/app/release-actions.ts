"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { captures, comments } from "@/db/schema";
import { auth } from "@/auth";

const idSchema = z.string().uuid();

export async function releaseCapture(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return;

  const id = idSchema.safeParse(formData.get("id"));
  if (!id.success) return;

  // The userId condition is what makes this safe: you can only delete your own.
  await db
    .delete(captures)
    .where(and(eq(captures.id, id.data), eq(captures.userId, session.user.id)));

  revalidatePath("/");
  redirect("/"); // also covers releasing from the Capture's own page
}

export async function releaseChatter(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return;

  const id = idSchema.safeParse(formData.get("id"));
  if (!id.success) return;

  const [removed] = await db
    .delete(comments)
    .where(and(eq(comments.id, id.data), eq(comments.userId, session.user.id)))
    .returning({ captureId: comments.captureId });

  if (removed) {
    revalidatePath("/");
    revalidatePath(`/capture/${removed.captureId}`);
  }
}