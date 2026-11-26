import { toggleCaptive } from "@/app/captive-actions";

export default function CaptiveButton({
  userId,
  isCaptive,
}: {
  userId: string;
  isCaptive: boolean;
}) {
  return (
    <form action={toggleCaptive}>
      <input type="hidden" name="userId" value={userId} />
      <button
        className={`rounded border px-4 py-2 text-sm ${
          isCaptive ? "" : "bg-black text-white"
        }`}
      >
        {isCaptive ? "Set Free" : "Take Captive"}
      </button>
    </form>
  );
}