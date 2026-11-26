import { toggleCaptivation } from "@/app/captivation-actions";

export default function CaptivateButton({
  captureId,
  captivated,
  count,
  signedIn,
}: {
  captureId: string;
  captivated: boolean;
  count: number;
  signedIn: boolean;
}) {
  if (!signedIn) {
    return <span className="text-sm text-gray-500">{count} captivated</span>;
  }

  return (
    <form action={toggleCaptivation}>
      <input type="hidden" name="captureId" value={captureId} />
      <button
        className={`rounded border px-3 py-1 text-sm ${
          captivated ? "bg-black text-white" : ""
        }`}
      >
        {captivated ? "Captivated" : "Captivate"} · {count}
      </button>
    </form>
  );
}