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
    <article className="neu-raised p-5">
      <div className="flex items-center gap-3">
        <div className="neu-pressed flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-extrabold text-viola-900">
          {(c.username ?? "?")[0].toUpperCase()}
        </div>
        <div className="min-w-0">
          <Link
            href={`/@${c.username}`}
            className="block truncate font-bold text-viola-900 hover:text-viola-700"
          >
            @{c.username}
          </Link>
          <p className="text-xs text-viola-700/70">{c.createdAt.toLocaleString()}</p>
        </div>
      </div>

      <p className="mt-4 whitespace-pre-wrap text-lg leading-snug">{c.caption}</p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <CaptivateButton
          captureId={c.id}
          captivated={c.captivated}
          count={c.captivationCount}
          signedIn={!!viewerId}
        />
        <Link href={`/capture/${c.id}`} className="neu-btn">
          Chatter · {c.chatterCount}
        </Link>
        {c.authorId === viewerId && (
          <div className="ml-auto">
            <ReleaseButton action={releaseCapture} id={c.id} what="Capture" />
          </div>
        )}
      </div>
    </article>
  );
}