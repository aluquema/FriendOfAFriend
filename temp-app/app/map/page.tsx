"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://tmzcaxrqttblfrytenae.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtemNheHJxdHRibGZyeXRlbmFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4OTU5NTgsImV4cCI6MjA5MjQ3MTk1OH0.3lYKH-FZc8n-FUdnffUvKP294c72mAEzOV93iqb2rxM");

mapboxgl.accessToken = "pk.eyJ1IjoiYWx1cXVlbWEiLCJhIjoiY21vYnVhdDdyMDVudTJyb3BwbHU2bnJkdCJ9.fkJLuwvSZ12xkYpgyld0dA";

const ACCENT = "#c0392b";
const ACCENT_DIM = "rgba(192,57,43,0.2)";
const ACCENT_GLOW = "rgba(192,57,43,0.4)";
const ACCENT_FAINT = "rgba(192,57,43,0.08)";
const snapToIntersection = (coord: number, precision: number = 0.005) => {
  return Math.round(coord / precision) * precision;
};

export default function Map() {
  const router = useRouter();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [showDrop, setShowDrop] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [note, setNote] = useState("");
  const [searching, setSearching] = useState(false);
  const [dropping, setDropping] = useState(false);

  useEffect(() => {
    (window as any).collectSong = async (songId: number) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .limit(1);
      if (profiles && profiles[0]) {
        await supabase.from("collections").insert([{
          profile_id: profiles[0].id,
          song_id: songId,
        }]);
        alert("Song Collected!");
      }
    };
  }, []);

  useEffect(() => {
    if (map.current) return;

    const initMap = (lng: number, lat: number, zoom: number) => {
      map.current = new mapboxgl.Map({
        container: mapContainer.current!,
        style: "mapbox://styles/aluquema/cmogb5mmw000o01pfhtrxajwd",
        center: [lng, lat],
        zoom: zoom,
      });

      map.current.on("load", async () => {
        const { data: songs } = await supabase.from("songs").select("*, profiles(id, screenname)");
        if (songs) {
          songs.forEach((song) => {
            const popup = new mapboxgl.Popup({ offset: 25, maxWidth: "200px" }).setHTML(
              '<div style="background:#0a0404;color:#c0392b;font-family:monospace;width:180px;border:1px solid rgba(192,57,43,0.3);">' +
              (song.cover_art ? '<img src="' + song.cover_art + '" style="width:100%;height:180px;object-fit:cover;display:block;opacity:0.9;" />' : '') +
              '<div style="padding:10px;">' +
              '<a href="/collection/' + song.profiles?.id + '" style="font-size:9px;color:rgba(192,57,43,0.5);margin:0 0 4px;text-transform:uppercase;letter-spacing:0.1em;text-decoration:none;display:block;">' + (song.profiles?.screenname || "Anonymous") + ' -&gt;</a>' +
              '<p style="font-size:12px;margin:4px 0 2px;color:#c0392b;">' + song.song_name + '</p>' +
              '<p style="font-size:10px;color:rgba(192,57,43,0.5);margin:0 0 6px">' + song.artist + '</p>' +
              (song.note ? '<p style="font-size:10px;color:rgba(192,57,43,0.7);font-style:italic;margin:0 0 10px;border-top:1px solid rgba(192,57,43,0.15);padding-top:6px;">&ldquo;' + song.note + '&rdquo;</p>' : '<div style="margin-bottom:10px;"></div>') +
              '<button onclick="window.collectSong(' + song.id + ')" style="width:100%;background:#c0392b;color:#080808;border:none;padding:7px 0;font-size:10px;cursor:pointer;letter-spacing:0.1em;font-family:monospace;text-transform:uppercase;border-radius:999px;">Collect</button>' +
              '</div>' +
              '</div>'
            );
            const el = document.createElement("div");
            el.style.width = "8px";
            el.style.height = "8px";
            el.style.borderRadius = "50%";
            el.style.backgroundColor = ACCENT;
            el.style.boxShadow = "0 0 8px " + ACCENT_GLOW + ", 0 0 16px " + ACCENT_GLOW;
            el.style.cursor = "pointer";
            new mapboxgl.Marker(el).setLngLat([song.longitude, song.latitude]).setPopup(popup).addTo(map.current!);
          });
        }
      });
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => initMap(pos.coords.longitude, pos.coords.latitude, 14),
      () => initMap(-74.006, 40.7128, 11)
    );
  }, []);

  const searchSongs = async () => {
    if (!query) return;
    setSearching(true);
    const res = await fetch("/api/spotify?q=" + encodeURIComponent(query));
    const data = await res.json();
    setResults(data.tracks?.items || []);
    setSearching(false);
  };

  const dropSong = async () => {
    if (!selected) return;
    setDropping(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setDropping(false); return; }

    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, screenname")
      .eq("user_id", user.id)
      .limit(1);

    if (!profiles || !profiles[0]) { setDropping(false); return; }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = snapToIntersection(pos.coords.latitude);
      const lng = snapToIntersection(pos.coords.longitude);

      const { data: song } = await supabase.from("songs").insert([{
        song_name: selected.name,
        artist: selected.artists[0].name,
        profile_id: profiles[0].id,
        latitude: lat,
        longitude: lng,
        cover_art: selected.album.images[1]?.url,
        spotify_id: selected.id,
        note: note.trim() || null,
      }]).select().single();

      if (song && map.current) {
        const popup = new mapboxgl.Popup({ offset: 25, maxWidth: "200px" }).setHTML(
          '<div style="background:#0a0404;color:#c0392b;font-family:monospace;width:180px;border:1px solid rgba(192,57,43,0.3);">' +
          (song.cover_art ? '<img src="' + song.cover_art + '" style="width:100%;height:180px;object-fit:cover;display:block;opacity:0.9;" />' : '') +
          '<div style="padding:10px;">' +
          '<a href="/collection/' + profiles[0].id + '" style="font-size:9px;color:rgba(192,57,43,0.5);text-transform:uppercase;letter-spacing:0.1em;text-decoration:none;display:block;margin-bottom:4px;">' + profiles[0].screenname + ' -&gt;</a>' +
          '<p style="font-size:12px;margin:4px 0 2px;color:#c0392b;">' + song.song_name + '</p>' +
          '<p style="font-size:10px;color:rgba(192,57,43,0.5);margin:0 0 6px">' + song.artist + '</p>' +
          (note.trim() ? '<p style="font-size:10px;color:rgba(192,57,43,0.7);font-style:italic;margin:0 0 10px;border-top:1px solid rgba(192,57,43,0.15);padding-top:6px;">&ldquo;' + note.trim() + '&rdquo;</p>' : '<div style="margin-bottom:10px;"></div>') +
          '</div>' +
          '</div>'
        );
        const el = document.createElement("div");
        el.style.width = "8px";
        el.style.height = "8px";
        el.style.borderRadius = "50%";
        el.style.backgroundColor = ACCENT;
        el.style.boxShadow = "0 0 8px " + ACCENT_GLOW + ", 0 0 16px " + ACCENT_GLOW;
        el.style.cursor = "pointer";
        new mapboxgl.Marker(el).setLngLat([lng, lat]).setPopup(popup).addTo(map.current);
      }

      setShowDrop(false);
      setSelected(null);
      setQuery("");
      setResults([]);
      setNote("");
      setDropping(false);
    }, () => setDropping(false));
  };

  return (
    <>
      <style>{`
        .map-pill-wrapper {
          display: flex;
          align-items: center;
          border: 1px solid rgba(192,57,43,0.3);
          border-radius: 999px;
          padding: 0.4rem 0.4rem 0.4rem 1rem;
          min-height: 2.8rem;
          background: rgba(6,4,4,0.9);
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .map-pill-wrapper:focus-within {
          border-color: #c0392b;
          box-shadow: 0 0 12px rgba(192,57,43,0.4);
        }
        .map-pill-input {
          flex: 1;
          background: transparent;
          border: none;
          color: #c0392b;
          font-size: 0.72rem;
          font-family: var(--font-dm-mono), monospace;
          letter-spacing: 0.05em;
          outline: none;
          caret-color: #c0392b;
          min-width: 0;
        }
        .map-pill-input::placeholder { color: rgba(192,57,43,0.3); }
        .map-pill-search-btn {
          background: #c0392b;
          border: none;
          border-radius: 999px;
          color: #080808;
          padding: 0.45rem 0.9rem;
          font-size: 0.62rem;
          font-family: var(--font-dm-mono), monospace;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .map-result-row {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.5rem 0.75rem;
          cursor: pointer;
          border-bottom: 1px solid rgba(192,57,43,0.08);
          transition: background 0.15s;
        }
        .map-result-row:last-child { border-bottom: none; }
        .map-result-row:hover { background: rgba(192,57,43,0.06); }
        .note-input {
          width: 100%;
          background: transparent;
          border: 1px solid rgba(192,57,43,0.2);
          border-radius: 12px;
          color: #c0392b;
          font-size: 0.68rem;
          font-family: var(--font-dm-mono), monospace;
          letter-spacing: 0.04em;
          outline: none;
          caret-color: #c0392b;
          padding: 0.6rem 0.75rem;
          resize: none;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }
        .note-input::placeholder { color: rgba(192,57,43,0.25); }
        .note-input:focus { border-color: #c0392b; }
        .grain {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 9999;
          opacity: 0.06;
          mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }
      `}</style>

      <div className="grain" />

      <main style={{ width: "100%", height: "100dvh", position: "relative", backgroundColor: "#060404" }}>

        <div style={{
          position: "absolute",
          top: "1.5rem",
          left: "1.5rem",
          zIndex: 10,
        }}>
          <p style={{
            fontFamily: "var(--font-playfair), serif",
            fontStyle: "italic",
            fontSize: "clamp(1rem, 3vw, 1.8rem)",
            fontWeight: 400,
            color: ACCENT,
            textShadow: "0 0 20px rgba(192,57,43,0.4)",
            lineHeight: 1,
            marginBottom: "0.25rem",
          }}>
            Friend of a Friend
          </p>
          <p style={{
            fontFamily: "var(--font-dm-mono), monospace",
            fontSize: "0.6rem",
            color: "rgba(192,57,43,0.35)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}>
            The Neighborhood
          </p>
        </div>

        <div style={{
          position: "absolute",
          bottom: "1.5rem",
          right: "1.5rem",
          zIndex: 10,
          display: "flex",
          gap: "0.75rem",
          fontFamily: "var(--font-dm-mono), monospace",
        }}>
          <button
            onClick={() => setShowDrop(true)}
            style={{
              background: ACCENT,
              color: "#080808",
              border: "none",
              borderRadius: "999px",
              padding: "0.65rem 1.25rem",
              fontSize: "0.65rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase" as const,
              cursor: "pointer",
              boxShadow: "0 0 20px " + ACCENT_GLOW,
              fontFamily: "var(--font-dm-mono), monospace",
            }}
          >
            Drop a Song
          </button>
          <button
            onClick={() => router.push("/collection")}
            style={{
              background: "rgba(6,4,4,0.85)",
              border: "1px solid " + ACCENT_DIM,
              color: ACCENT,
              borderRadius: "999px",
              padding: "0.65rem 1.25rem",
              fontSize: "0.65rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase" as const,
              fontFamily: "var(--font-dm-mono), monospace",
              cursor: "pointer",
            }}
          >
            My Collection
          </button>
        </div>

        {showDrop && (
          <div style={{
            position: "absolute",
            bottom: "5rem",
            right: "1.5rem",
            zIndex: 20,
            width: "min(320px, calc(100vw - 3rem))",
            background: "rgba(6,4,4,0.95)",
            border: "1px solid " + ACCENT_DIM,
            borderRadius: "16px",
            padding: "1.25rem",
            backdropFilter: "blur(12px)",
            boxShadow: "0 0 40px rgba(192,57,43,0.15)",
            fontFamily: "var(--font-dm-mono), monospace",
            maxHeight: "calc(100dvh - 8rem)",
            overflowY: "auto",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <p style={{ fontSize: "0.65rem", color: ACCENT, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                Drop a Song Here
              </p>
              <button
                onClick={() => { setShowDrop(false); setSelected(null); setResults([]); setQuery(""); setNote(""); }}
                style={{ background: "none", border: "none", color: "rgba(192,57,43,0.35)", cursor: "pointer", fontSize: "0.75rem" }}
              >
                ✕
              </button>
            </div>

            {!selected ? (
              <>
                <div className="map-pill-wrapper" style={{ marginBottom: "0.75rem" }}>
                  <input
                    type="text"
                    placeholder="Search for a song..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && searchSongs()}
                    className="map-pill-input"
                  />
                  <button onClick={searchSongs} className="map-pill-search-btn">
                    {searching ? "···" : "Go"}
                  </button>
                </div>

                {results.length > 0 && (
                  <div style={{
                    border: "1px solid rgba(192,57,43,0.15)",
                    borderRadius: "12px",
                    overflow: "hidden",
                    background: "rgba(10,4,4,0.9)",
                    maxHeight: "200px",
                    overflowY: "auto",
                  }}>
                    {results.slice(0, 5).map((track) => (
                      <div key={track.id} className="map-result-row" onClick={() => setSelected(track)}>
                        <img src={track.album.images[2]?.url} alt="" style={{ width: 32, height: 32, objectFit: "cover", borderRadius: 4, opacity: 0.85 }} />
                        <div>
                          <p style={{ fontSize: "0.7rem", color: ACCENT, marginBottom: "0.1rem" }}>{track.name}</p>
                          <p style={{ fontSize: "0.6rem", color: "rgba(192,57,43,0.4)" }}>{track.artists[0].name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  padding: "0.6rem 0.75rem",
                  border: "1px solid " + ACCENT,
                  borderRadius: "12px",
                  background: ACCENT_FAINT,
                  boxShadow: "0 0 12px " + ACCENT_GLOW,
                }}>
                  <img src={selected.album.images[2]?.url} alt="" style={{ width: 32, height: 32, objectFit: "cover", borderRadius: 4 }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "0.7rem", color: ACCENT }}>{selected.name}</p>
                    <p style={{ fontSize: "0.6rem", color: "rgba(192,57,43,0.4)" }}>{selected.artists[0].name}</p>
                  </div>
                  <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "rgba(192,57,43,0.3)", cursor: "pointer", fontSize: "0.65rem" }}>✕</button>
                </div>

                <textarea
                  className="note-input"
                  placeholder="Add a note... (optional)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  maxLength={120}
                />

                <button
                  onClick={dropSong}
                  disabled={dropping}
                  style={{
                    width: "100%",
                    background: dropping ? "transparent" : ACCENT,
                    border: "1px solid " + ACCENT,
                    color: dropping ? "rgba(192,57,43,0.4)" : "#080808",
                    borderRadius: "999px",
                    padding: "0.75rem",
                    fontSize: "0.65rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase" as const,
                    cursor: dropping ? "default" : "pointer",
                    fontFamily: "var(--font-dm-mono), monospace",
                    boxShadow: dropping ? "none" : "0 0 20px " + ACCENT_GLOW,
                    transition: "all 0.2s",
                  }}
                >
                  {dropping ? "Dropping···" : "Pin It Here"}
                </button>
              </div>
            )}
          </div>
        )}

        <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
      </main>
    </>
  );
}