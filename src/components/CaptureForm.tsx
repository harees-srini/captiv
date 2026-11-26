"use client";

import { useActionState } from "react";
import { createCapture } from "@/app/capture-actions";

export default function CaptureForm() {
  const [state, action, pending] = useActionState(createCapture, undefined);

  return (
    <form action={action} className="flex flex-col gap-2">
      <textarea
        name="caption"
        placeholder="Caption your Capture..."
        maxLength={280}
        required
        rows={3}
        className="rounded border p-2"
      />
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        disabled={pending}
        className="self-end rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {pending ? "Capturing..." : "Capture"}
      </button>
    </form>
  );
}