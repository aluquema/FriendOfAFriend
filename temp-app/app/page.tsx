export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      <div className="max-w-xl w-full space-y-8">
        <h1 className="text-sm tracking-widest text-zinc-400 uppercase">
          friend of a friend
        </h1>

        <p className="text-3xl font-light leading-snug">
          Every neighborhood has a sound.<br />
          Every person has a song.
        </p>

        <p className="text-zinc-400 text-base">
          Drop a song to get in. Find out who else is here.
        </p>

        <div className="pt-4">
          <input
            type="text"
            placeholder="paste a song link or type a song name..."
            className="w-full bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-600 px-4 py-3 rounded-none text-sm focus:outline-none focus:border-white transition"
          />
          <button className="mt-3 w-full bg-white text-black text-sm py-3 hover:bg-zinc-200 transition">
            enter
          </button>
        </div>
      </div>
    </main>
  );
}
