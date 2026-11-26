"use client";

import { useActionState } from "react";
import { createCapture } from "@/app/capture-actions";

export default function CaptureForm() {
  const [state, action, pending] = useActionState(createCapture, undefined);

  return (
    <form action={action} className="neu-raised flex flex-col gap-4 p-5">
      <textarea
        name="caption"
        placeholder="Caption your Capture..."
        maxLength={280}
        required
        rows={3}
        className="neu-input resize-none"
      />
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-rose-700">{state?.error}</p>
        <button disabled={pending} className="neu-btn neu-btn-primary">
          {pending ? "Capturing..." : "Capture"}
        </button>
      </div>
    </form>
  );
}