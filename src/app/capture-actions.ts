"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { captures } from "@/db/schema";
import { auth } from "@/auth";

export type CaptureState = { error?: string } | undefined;

const captureSchema = z.object({
  caption: z
    .string()
    .trim()
    .min(1, "A Capture needs a caption")
    .max(280, "Captions max out at 280 characters"),
});

export async function createCapture(
  _prev: CaptureState,
  formData: FormData
): Promise<CaptureState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Check in to capture something." };

  const parsed = captureSchema.safeParse({ caption: formData.get("caption") });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await db.insert(captures).values({
    userId: session.user.id,
    caption: parsed.data.caption,
  });

  revalidatePath("/");
}