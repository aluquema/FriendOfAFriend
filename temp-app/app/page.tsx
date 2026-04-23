"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const searchSongs = async () => {
    if (!query) return;
    setLoading(true);
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&videoCategoryId=10&key=AIzaSyCVjlMB-gNKP3IFc6btiBV6c034A4XxLDo`
    );
    const data = await res.json();
    setResults(data.items || []);
    setLoading(false);
  };

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

        <div className="pt-4 space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="search for a song..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchSongs()}
              className="flex-1 bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-600 px-4 py-3 text-sm focus:outline-none focus:border-white transition"
            />
            <button
              onClick={searchSongs}
              className="bg-zinc-800 text-white px-4 py-3 text-sm hover:bg-zinc-700 transition border border-zinc-700"
            >
              {loading ? "..." : "search"}
            </button>
          </div>

          {results.length > 0 && !selected && (
            <div className="border border-zinc-800 divide-y divide-zinc-800">
              {results.slice(0, 5).map((item) => (
                <div
                  key={item.id.videoId}
                  onClick={() => setSelected(item)}
                  className="flex items-center gap-3 p-3 cursor-pointer hover:bg-zinc-900 transition"
                >
                  <img
                    src={item.snippet.thumbnails.default.url}
                    alt=""
                    className="w-10 h-10 object-cover"
                  />
                  <div>
                    <p className="text-sm text-white leading-tight">{item.snippet.title}</p>
                    <p className="text-xs text-zinc-500">{item.snippet.channelTitle}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selected && (
            <div className="flex items-center gap-3 p-3 border border-zinc-600 bg-zinc-900">
              <img
                src={selected.snippet.thumbnails.default.url}
                alt=""
                className="w-10 h-10 object-cover"
              />
              <div className="flex-1">
                <p className="text-sm text-white">{selected.snippet.title}</p>
                <p className="text-xs text-zinc-500">{selected.snippet.channelTitle}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-zinc-600 text-xs">✕</button>
            </div>
          )}

          <button
           onClick={() => { if (selected) { sessionStorage.setItem("entrySong", JSON.stringify({ title: selected.snippet.title, artist: selected.snippet.channelTitle, videoId: selected.id.videoId })); router.push("/welcome"); } }}
           
            disabled={!selected}
            className="w-full bg-white text-black text-sm py-3 hover:bg-zinc-200 transition disabled:opacity-30"
          >
            enter
          </button>
        </div>
      </div>
    </main>
  );
}
