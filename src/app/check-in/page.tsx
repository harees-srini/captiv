"use client";

import { useActionState } from "react";
import Link from "next/link";
import { checkIn } from "@/app/auth-actions";

export default function CheckInPage() {
  const [state, action, pending] = useActionState(checkIn, undefined);

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-4 p-6">
      <h1 className="text-3xl font-bold">Check In</h1>
      <form action={action} className="flex flex-col gap-3">
        <input name="email" type="email" placeholder="Email" required className="rounded border p-2" />
        <input name="password" type="password" placeholder="Password" required className="rounded border p-2" />
        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
        <button disabled={pending} className="rounded bg-black p-2 text-white disabled:opacity-50">
          {pending ? "Checking in..." : "Check In"}
        </button>
      </form>
      <p className="text-sm">
        New here? <Link href="/get-captured" className="underline">Get Captured</Link>
      </p>
    </main>
  );
}