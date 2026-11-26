"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { comments } from "@/db/schema";
import { auth } from "@/auth";

export type ChatterState = { error?: string } | undefined;

const bodySchema = z
  .string()
  .trim()
  .min(1, "Say something first")
  .max(280, "Chatter maxes out at 280 characters");

export async function addChatter(
  captureId: string,
  _prev: ChatterState,
  formData: FormData
): Promise<ChatterState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Check in to join the chatter." };

  if (!z.string().uuid().safeParse(captureId).success) {
    return { error: "That Capture doesn't exist." };
  }

  const parsed = bodySchema.safeParse(formData.get("body"));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await db.insert(comments).values({
    captureId,
    userId: session.user.id,
    body: parsed.data,
  });

  revalidatePath("/");
  revalidatePath(`/capture/${captureId}`);
}