"use client";

import { useActionState } from "react";
import Link from "next/link";
import { checkIn } from "@/app/auth-actions";

export default function CheckInPage() {
  const [state, action, pending] = useActionState(checkIn, undefined);

  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <div className="neu-raised w-full max-w-sm p-8">
        <Link href="/" className="text-3xl font-extrabold tracking-tight text-viola-900">
          Capti<span className="text-gold">v</span>
        </Link>
        <h1 className="mt-6 text-2xl font-extrabold text-viola-900">Check In</h1>
        <p className="mt-1 text-sm text-viola-700">Welcome back.</p>

        <form action={action} className="mt-6 flex flex-col gap-4">
          <input name="email" type="email" placeholder="Email" required className="neu-input" />
          <input name="password" type="password" placeholder="Password" required className="neu-input" />
          {state?.error && <p className="text-sm text-rose-700">{state.error}</p>}
          <button disabled={pending} className="neu-btn neu-btn-primary mt-2">
            {pending ? "Checking in..." : "Check In"}
          </button>
        </form>

        <p className="mt-6 text-sm text-viola-700">
          New here?{" "}
          <Link href="/get-captured" className="font-bold text-viola-900 hover:underline">
            Get Captured
          </Link>
        </p>
      </div>
    </main>
  );
}