import { auth } from "@/auth";
import { getCaptures } from "@/lib/captures";
import SiteHeader from "@/components/SiteHeader";
import CaptureForm from "@/components/CaptureForm";
import CaptureCard from "@/components/CaptureCard";

export default async function Home() {
  const session = await auth();
  const userId = session?.user?.id;
  const lineup = await getCaptures({ viewerId: userId });

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex max-w-xl flex-col gap-6 px-5 pb-16">
        {userId ? (
          <CaptureForm />
        ) : (
          <section className="neu-raised p-8 text-center">
            <h1 className="text-3xl font-extrabold text-viola-900">Get captured.</h1>
            <p className="mt-2 text-viola-700">
              Post Captures, captivate others, and take captives of your own.
            </p>
          </section>
        )}

        <section className="flex flex-col gap-5">
          <h2 className="px-1 text-xl font-extrabold text-viola-900">The Lineup</h2>
          {lineup.length === 0 && (
            <p className="neu-pressed p-5 text-center text-viola-700">
              Nobody&apos;s been captured yet. Be the first.
            </p>
          )}
          {lineup.map((c) => (
            <CaptureCard key={c.id} capture={c} viewerId={userId} />
          ))}
        </section>
      </main>
    </>
  );
}