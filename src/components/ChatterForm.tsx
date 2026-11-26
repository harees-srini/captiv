"use client";

import { useActionState } from "react";
import { addChatter } from "@/app/chatter-actions";

export default function ChatterForm({ captureId }: { captureId: string }) {
  const [state, action, pending] = useActionState(
    addChatter.bind(null, captureId),
    undefined
  );

  return (
    <form action={action} className="neu-raised flex flex-col gap-4 p-5">
      <textarea
        name="body"
        placeholder="Add some chatter..."
        maxLength={280}
        required
        rows={2}
        className="neu-input resize-none"
      />
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-rose-700">{state?.error}</p>
        <button disabled={pending} className="neu-btn neu-btn-primary">
          {pending ? "Sending..." : "Chatter"}
        </button>
      </div>
    </form>
  );
}