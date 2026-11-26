"use client";

export default function ReleaseButton({
  action,
  id,
  what,
}: {
  action: (formData: FormData) => Promise<void>;
  id: string;
  what: string; // "Capture" or "Chatter"
}) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <button
        onClick={(e) => {
          if (!confirm(`Release this ${what}? This can't be undone.`)) {
            e.preventDefault();
          }
        }}
        className="text-sm font-semibold text-rose-700/80 hover:text-rose-700"
      >
        Release
      </button>
    </form>
  );
}