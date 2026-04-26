"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://tmzcaxrqttblfrytenae.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtemNheHJxdHRibGZyeXRlbmFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4OTU5NTgsImV4cCI6MjA5MjQ3MTk1OH0.3lYKH-FZc8n-FUdnffUvKP294c72mAEzOV93iqb2rxM"
);

const ACCENT = "#c0392b";
const ACCENT_DIM = "rgba(192,57,43,0.2)";
const ACCENT_GLOW = "rgba(192,57,43,0.4)";
const ACCENT_FAINT = "rgba(192,57,43,0.08)";

export default function Collection() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [songs, setSongs] = useState<any[]>([]);
  const [collected, setCollected] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const [headlineFontSize, setHeadlineFontSize] = useState(64);

  useEffect(() => {
    const fit = () => {
      if (!containerRef.current || !headlineRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      let size = 16;
      headlineRef.current.style.fontSize = size + "px";
      while (headlineRef.current.scrollWidth <= containerWidth && size < 200) {
        size++;
        headlineRef.current.style.fontSize = size + "px";
      }
      setHeadlineFontSize(size - 1);
    };
    if (profile) {
      fit();
      window.addEventListener("resize", fit);
      return () => window.removeEventListener("resize", fit);
    }
  }, [profile]);

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .limit(1);

      if (profiles && profiles[0]) {
        setProfile(profiles[0]);

        const { data: songData } = await supabase
          .from("songs")
          .select("*")
          .eq("profile_id", profiles[0].id);
        setSongs(songData || []);

        const { data: collectionData } = await supabase
          .from("collections")
          .select("*, songs(*)")
          .eq("profile_id", profiles[0].id);
        setCollected(collectionData || []);
      }
    };
    loadProfile();
  }, []);

  if (!profile) return (
    <>
      <style>{`
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
      <main style={{
        minHeight: "100vh",
        backgroundColor: "#060404",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-dm-mono), monospace",
      }}>
        <p style={{ color: "rgba(192,57,43,0.4)", fontSize: "0.75rem", letterSpacing: "0.1em" }}>loading...</p>
      </main>
    </>
  );

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.7s ease both; }
        .fade-up-1 { animation-delay: 0.05s; }
        .fade-up-2 { animation-delay: 0.15s; }
        .fade-up-3 { animation-delay: 0.25s; }
        .fade-up-4 { animation-delay: 0.35s; }

        .song-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.85rem 1rem;
          border: 1px solid rgba(192,57,43,0.12);
          border-radius: 12px;
          background: rgba(192,57,43,0.04);
          transition: border-color 0.2s, background 0.2s;
        }
        .song-row:hover {
          border-color: rgba(192,57,43,0.3);
          background: rgba(192,57,43,0.07);
        }

        .collection-card {
          aspect-ratio: 1;
          border: 1px solid rgba(192,57,43,0.12);
          border-radius: 12px;
          background: rgba(192,57,43,0.04);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0.75rem;
          text-align: center;
          transition: border-color 0.2s, background 0.2s;
          cursor: default;
        }
        .collection-card:hover {
          border-color: rgba(192,57,43,0.3);
          background: rgba(192,57,43,0.07);
        }

        .rule {
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, ${ACCENT} 0%, transparent 100%);
          box-shadow: 0 0 8px ${ACCENT_GLOW};
          margin-bottom: 2rem;
        }

        .grain {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 9999;
          opacity: 0.06;
          mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        .light-leak {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background:
            radial-gradient(ellipse 50% 55% at -5% 100%, rgba(160,30,15,0.45) 0%, transparent 65%),
            radial-gradient(ellipse 35% 35% at 105% 0%, rgba(140,20,10,0.3) 0%, transparent 60%);
        }

        .section-label {
          font-size: 0.58rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(192,57,43,0.4);
          margin-bottom: 1rem;
        }
      `}</style>

      <div className="grain" />
      <div className="light-leak" />

      <main style={{
        minHeight: "100vh",
        backgroundColor: "#060404",
        color: ACCENT,
        fontFamily: "var(--font-dm-mono), monospace",
        padding: "3rem 5vw",
        position: "relative",
        overflowY: "auto",
      }}>
        <div ref={containerRef} style={{ width: "100%", maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>

          {/* Top rule */}
          <div className="rule fade-up fade-up-1" />

          {/* Nav row */}
          <div className="fade-up fade-up-1" style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.5rem",
          }}>
            <p style={{
              fontSize: "0.6rem",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: ACCENT,
              opacity: 0.55,
            }}>
              Friend of a Friend™
            </p>
            <button
              onClick={() => router.push("/map")}
              style={{
                background: "none",
                border: "none",
                color: "rgba(192,57,43,0.35)",
                fontSize: "0.62rem",
                fontFamily: "var(--font-dm-mono), monospace",
                letterSpacing: "0.1em",
                cursor: "pointer",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = ACCENT)}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(192,57,43,0.35)")}
            >
              ← the neighborhood
            </button>
          </div>

          {/* Headline — fitted to container */}
          <div style={{ width: "100%", paddingBottom: "0.2em", marginBottom: "0.75rem" }}>
            <h1
              ref={headlineRef}
              className="fade-up fade-up-2"
              style={{
                fontFamily: "var(--font-playfair), serif",
                fontStyle: "italic",
                fontWeight: 400,
                lineHeight: 1.1,
                color: ACCENT,
                textShadow: "0 0 40px " + ACCENT_GLOW + ", 0 0 100px rgba(192,57,43,0.12)",
                letterSpacing: "-0.01em",
                fontSize: headlineFontSize + "px",
                margin: 0,
                padding: "0 0 0.15em 0",
                whiteSpace: "nowrap",
                overflow: "visible",
              }}
            >
              {profile.screenname}
            </h1>
          </div>

          {/* Profile meta */}
          <p className="fade-up fade-up-2" style={{
            fontSize: "0.7rem",
            color: "rgba(192,57,43,0.4)",
            letterSpacing: "0.08em",
            marginBottom: "3rem",
          }}>
            {profile.age_range}{profile.age_range && profile.gender ? " · " : ""}{profile.gender}
          </p>

          {/* Songs dropped */}
          <div className="fade-up fade-up-3" style={{ marginBottom: "3rem" }}>
            <p className="section-label">songs you've dropped</p>
            {songs.length === 0 ? (
              <p style={{ fontSize: "0.72rem", color: "rgba(192,57,43,0.3)", letterSpacing: "0.04em" }}>
                no songs dropped yet
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {songs.map((song) => (
                  <div key={song.id} className="song-row">
                    {song.cover_art ? (
                      <img src={song.cover_art} alt="" style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 6, opacity: 0.85, flexShrink: 0 }} />
                    ) : (
                      <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(192,57,43,0.1)", border: "1px solid " + ACCENT_DIM, flexShrink: 0 }} />
                    )}
                    <div>
                      <p style={{ fontSize: "0.78rem", color: ACCENT, marginBottom: "0.15rem" }}>{song.song_name}</p>
                      <p style={{ fontSize: "0.65rem", color: "rgba(192,57,43,0.4)" }}>{song.artist}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Collection */}
          <div className="fade-up fade-up-4" style={{ marginBottom: "3rem" }}>
            <p className="section-label">your collection</p>
            {collected.length === 0 ? (
              <p style={{ fontSize: "0.72rem", color: "rgba(192,57,43,0.3)", letterSpacing: "0.04em" }}>
                collect songs from the neighborhood to fill your collection
              </p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "0.75rem" }}>
                {collected.map((item) => (
                  <div key={item.id} className="collection-card">
                    {item.songs?.cover_art ? (
                      <img src={item.songs.cover_art} alt="" style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 6, marginBottom: "0.6rem", opacity: 0.85 }} />
                    ) : (
                      <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(192,57,43,0.1)", border: "1px solid " + ACCENT_DIM, marginBottom: "0.6rem" }} />
                    )}
                    <p style={{ fontSize: "0.68rem", color: ACCENT, lineHeight: 1.3, marginBottom: "0.2rem", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>
                      {item.songs?.song_name}
                    </p>
                    <p style={{ fontSize: "0.6rem", color: "rgba(192,57,43,0.4)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "100%" }}>
                      {item.songs?.artist}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sign out */}
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = "/";
            }}
            style={{
              background: "none",
              border: "none",
              color: "rgba(192,57,43,0.25)",
              fontSize: "0.62rem",
              fontFamily: "var(--font-dm-mono), monospace",
              letterSpacing: "0.1em",
              cursor: "pointer",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = ACCENT)}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(192,57,43,0.25)")}
          >
            sign out
          </button>

        </div>
      </main>
    </>
  );
}