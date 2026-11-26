"use client";

import { useActionState } from "react";
import Link from "next/link";
import { getCaptured } from "@/app/auth-actions";

export default function GetCapturedPage() {
  const [state, action, pending] = useActionState(getCaptured, undefined);

  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <div className="neu-raised w-full max-w-sm p-8">
        <Link href="/" className="text-3xl font-extrabold tracking-tight text-viola-900">
          Capti<span className="text-gold">v</span>
        </Link>
        <h1 className="mt-6 text-2xl font-extrabold text-viola-900">Get Captured</h1>
        <p className="mt-1 text-sm text-viola-700">Join the Lineup.</p>

        <form action={action} className="mt-6 flex flex-col gap-4">
          <input name="username" placeholder="Username" required className="neu-input" />
          <input name="email" type="email" placeholder="Email" required className="neu-input" />
          <input name="password" type="password" placeholder="Password (8+ chars)" required className="neu-input" />
          {state?.error && <p className="text-sm text-rose-700">{state.error}</p>}
          <button disabled={pending} className="neu-btn neu-btn-primary mt-2">
            {pending ? "Capturing..." : "Get Captured"}
          </button>
        </form>

        <p className="mt-6 text-sm text-viola-700">
          Already captured?{" "}
          <Link href="/check-in" className="font-bold text-viola-900 hover:underline">
            Check In
          </Link>
        </p>
      </div>
    </main>
  );
}