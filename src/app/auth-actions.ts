"use server";

import { z } from "zod";
import { hash } from "@node-rs/argon2";
import { eq, or } from "drizzle-orm";
import { AuthError } from "next-auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { signIn } from "@/auth";

export type FormState = { error?: string } | undefined;

const signUpSchema = z.object({
  username: z
    .string()
    .min(3, "Username needs at least 3 characters")
    .max(20, "Username can be at most 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Letters, numbers and underscores only"),
  email: z.string().email("That doesn't look like an email"),
  password: z.string().min(8, "Password needs at least 8 characters").max(100),
});

export async function getCaptured(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = signUpSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const username = parsed.data.username.toLowerCase();
  const email = parsed.data.email.toLowerCase();
  const { password } = parsed.data;

  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(or(eq(users.email, email), eq(users.username, username)))
    .limit(1);
  if (existing.length > 0) {
    return { error: "That email or username is already captured." };
  }

  await db.insert(users).values({
    name: username,
    username,
    email,
    passwordHash: await hash(password),
  });

  // Log them straight in. signIn throws a redirect on success, so don't catch it.
  try {
    await signIn("credentials", { email, password, redirectTo: "/" });
  } catch (e) {
    if (e instanceof AuthError) return { error: "Captured, but check-in failed. Try Check In." };
    throw e;
  }
}

export async function checkIn(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    await signIn("credentials", {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      redirectTo: "/",
    });
  } catch (e) {
    if (e instanceof AuthError) return { error: "Wrong email or password." };
    throw e; // lets the success redirect through
  }
}