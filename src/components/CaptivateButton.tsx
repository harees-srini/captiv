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
    return <span className="neu-chip">♥ {count}</span>;
  }

  return (
    <form action={toggleCaptivation}>
      <input type="hidden" name="captureId" value={captureId} />
      <button className={`neu-btn ${captivated ? "neu-btn-on" : ""}`}>
        <span className={captivated ? "text-viola-400" : ""}>♥</span>
        {captivated ? "Captivated" : "Captivate"} · {count}
      </button>
    </form>
  );
}