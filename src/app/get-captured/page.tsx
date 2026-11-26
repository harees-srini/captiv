"use client";

import { useActionState } from "react";
import Link from "next/link";
import { getCaptured } from "@/app/auth-actions";

export default function GetCapturedPage() {
  const [state, action, pending] = useActionState(getCaptured, undefined);

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-4 p-6">
      <h1 className="text-3xl font-bold">Get Captured</h1>
      <form action={action} className="flex flex-col gap-3">
        <input name="username" placeholder="Username" required className="rounded border p-2" />
        <input name="email" type="email" placeholder="Email" required className="rounded border p-2" />
        <input name="password" type="password" placeholder="Password (8+ chars)" required className="rounded border p-2" />
        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
        <button disabled={pending} className="rounded bg-black p-2 text-white disabled:opacity-50">
          {pending ? "Capturing..." : "Get Captured"}
        </button>
      </form>
      <p className="text-sm">
        Already captured? <Link href="/check-in" className="underline">Check In</Link>
      </p>
    </main>
  );
}