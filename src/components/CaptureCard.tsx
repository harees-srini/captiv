import Link from "next/link";
import CaptivateButton from "@/components/CaptivateButton";
import ReleaseButton from "@/components/ReleaseButton";
import { releaseCapture } from "@/app/release-actions";
import type { CaptureCardData } from "@/lib/captures";

export default function CaptureCard({
  capture: c,
  viewerId,
}: {
  capture: CaptureCardData;
  viewerId?: string;
}) {
  return (
    <article className="rounded border p-3">
      <Link href={`/@${c.username}`} className="text-sm font-semibold hover:underline">
        @{c.username}
      </Link>
      <p className="mt-1 whitespace-pre-wrap">{c.caption}</p>
      <p className="mt-2 text-xs text-gray-500">{c.createdAt.toLocaleString()}</p>
      <div className="mt-3 flex items-center gap-4">
        <CaptivateButton
          captureId={c.id}
          captivated={c.captivated}
          count={c.captivationCount}
          signedIn={!!viewerId}
        />
        <Link href={`/capture/${c.id}`} className="text-sm underline">
          Chatter · {c.chatterCount}
        </Link>
        {c.authorId === viewerId && (
          <ReleaseButton action={releaseCapture} id={c.id} what="Capture" />
        )}
      </div>
    </article>
  );
}