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
      <button className={`neu-btn ${isCaptive ? "" : "neu-btn-primary"}`}>
        {isCaptive ? "Set Free" : "Take Captive"}
      </button>
    </form>
  );
}