"use client";

import { useActionState } from "react";
import { addChatter } from "@/app/chatter-actions";

export default function ChatterForm({ captureId }: { captureId: string }) {
  const [state, action, pending] = useActionState(
    addChatter.bind(null, captureId),
    undefined
  );

  return (
    <form action={action} className="flex flex-col gap-2">
      <textarea
        name="body"
        placeholder="Add some chatter..."
        maxLength={280}
        required
        rows={2}
        className="rounded border p-2"
      />
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        disabled={pending}
        className="self-end rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {pending ? "Sending..." : "Chatter"}
      </button>
    </form>
  );
}