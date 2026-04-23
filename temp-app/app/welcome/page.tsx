import Link from "next/link";

export default function Welcome() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      <div className="max-w-xl w-full space-y-8">
        <h1 className="text-sm tracking-widest text-zinc-400 uppercase">
          friend of a friend
        </h1>

        <p className="text-4xl font-light leading-snug">
          Welcome.
        </p>

        <p className="text-zinc-400 text-base leading-relaxed">
          You're in. This is a place built on music — not followers, not likes. 
          Just people and the songs that find them.
        </p>

        <p className="text-zinc-400 text-base">
          Let's set up your profile.
        </p>

        <Link href="/onboarding">
          <button className="mt-3 w-full bg-white text-black text-sm py-3 hover:bg-zinc-200 transition">
            get started
          </button>
        </Link>
      </div>
    </main>
  );
}

