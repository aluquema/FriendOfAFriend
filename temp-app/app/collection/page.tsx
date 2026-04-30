"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://tmzcaxrqttblfrytenae.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtemNheHJxdHRibGZyeXRlbmFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4OTU5NTgsImV4cCI6MjA5MjQ3MTk1OH0.3lYKH-FZc8n-FUdnffUvKP294c72mAEzOV93iqb2rxM"
);

const ACCENT = "#a62621";
const ACCENT_DIM = "rgba(166,38,33,0.2)";
const ACCENT_GLOW = "rgba(166,38,33,0.4)";
const ACCENT_FAINT = "rgba(166,38,33,0.08)";

export default function Collection() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [songs, setSongs] = useState<any[]>([]);
  const [collected, setCollected] = useState<any[]>([]);

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
          opacity: 0.12;
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
        <p style={{ color: "rgba(166,38,33,0.55)", fontSize: "0.75rem", letterSpacing: "0.1em" }}>Loading...</p>
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
          border: 1px solid rgba(166,38,33,0.25);
          border-radius: 12px;
          background: rgba(166,38,33,0.04);
          transition: border-color 0.2s, background 0.2s;
        }
        .song-row:hover {
          border-color: rgba(166,38,33,0.45);
          background: rgba(166,38,33,0.08);
        }

        .collection-card {
          aspect-ratio: 1;
          border: 1px solid rgba(166,38,33,0.25);
          border-radius: 12px;
          background: rgba(166,38,33,0.04);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0.75rem;
          text-align: center;
          transition: border-color 0.2s, background 0.2s;
        }
        .collection-card:hover {
          border-color: rgba(166,38,33,0.45);
          background: rgba(166,38,33,0.08);
        }

        .section-label {
          font-size: 0.58rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(166,38,33,0.55);
          margin-bottom: 1rem;
        }

        .grain {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 9999;
          opacity: 0.12;
          mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        .light-leak {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background:
            radial-gradient(ellipse 50% 55% at -5% 100%, rgba(140,30,25,0.45) 0%, transparent 65%),
            radial-gradient(ellipse 35% 35% at 105% 0%, rgba(120,20,15,0.3) 0%, transparent 60%);
        }
      `}</style>

      <div className="grain" />
      <div className="light-leak" />

      {/* Logo fixed top left */}
      <div style={{
        position: "fixed",
        top: "1.5rem",
        left: "max(1.5rem, 5vw)",
        zIndex: 10,
      }}>
        <img
          src="/LogoTransparent.png"
          alt="Friend of a Friend"
          style={{
            width: "clamp(80px, 10vw, 130px)",
            height: "auto",
            display: "block",
          }}
        />
      </div>

      <main style={{
        minHeight: "100vh",
        backgroundColor: "#060404",
        color: ACCENT,
        fontFamily: "var(--font-dm-mono), monospace",
        paddingTop: "8rem",
        paddingBottom: "3rem",
        paddingLeft: "max(1.5rem, 5vw)",
        paddingRight: "max(1.5rem, 5vw)",
        position: "relative",
        overflowY: "auto",
      }}>
        <div style={{
          width: "100%",
          maxWidth: "600px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}>

          {/* Headline */}
          <div className="fade-up fade-up-1" style={{ marginBottom: "0.5rem", width: "100%" }}>
            <h1 style={{
              fontFamily: "var(--font-playfair), serif",
              fontStyle: "italic",
              fontWeight: 700,
              lineHeight: 1.1,
              color: ACCENT,
              letterSpacing: "-0.01em",
              fontSize: "clamp(2.5rem, 4.2vw, 4.5rem)",
              margin: 0,
              padding: 0,
              textShadow: "0 0 30px rgba(166,38,33,0.4)",
            }}>
              {profile.screenname}
            </h1>
          </div>

          {/* Profile meta */}
          <p className="fade-up fade-up-1" style={{
            fontSize: "0.7rem",
            color: "rgba(166,38,33,0.65)",
            letterSpacing: "0.08em",
            marginBottom: "3rem",
          }}>
            {profile.age_range}{profile.age_range && profile.gender ? " · " : ""}{profile.gender}
          </p>

          {/* Songs dropped */}
          <div className="fade-up fade-up-2" style={{ marginBottom: "3rem", width: "100%" }}>
            <p className="section-label">Songs You've Dropped</p>
            {songs.length === 0 ? (
              <p style={{ fontSize: "0.72rem", color: "rgba(166,38,33,0.55)", letterSpacing: "0.04em" }}>
                No songs dropped yet.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {songs.map((song) => (
                  <div key={song.id} className="song-row">
                    {song.cover_art ? (
                      <img src={song.cover_art} alt="" style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 6, opacity: 0.85, flexShrink: 0 }} />
                    ) : (
                      <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(166,38,33,0.1)", border: "1px solid " + ACCENT_DIM, flexShrink: 0 }} />
                    )}
                    <div style={{ textAlign: "left" }}>
                      <p style={{ fontSize: "0.78rem", color: ACCENT, marginBottom: "0.15rem" }}>{song.song_name}</p>
                      <p style={{ fontSize: "0.65rem", color: "rgba(166,38,33,0.65)" }}>{song.artist}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Collection */}
          <div className="fade-up fade-up-3" style={{ marginBottom: "3rem", width: "100%" }}>
            <p className="section-label">Your Collection</p>
            {collected.length === 0 ? (
              <p style={{ fontSize: "0.72rem", color: "rgba(166,38,33,0.55)", letterSpacing: "0.04em" }}>
                Collect songs from the neighborhood to fill your collection.
              </p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "0.75rem" }}>
                {collected.map((item) => (
                  <div key={item.id} className="collection-card">
                    {item.songs?.cover_art ? (
                      <img src={item.songs.cover_art} alt="" style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 6, marginBottom: "0.6rem", opacity: 0.85 }} />
                    ) : (
                      <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(166,38,33,0.1)", border: "1px solid " + ACCENT_DIM, marginBottom: "0.6rem" }} />
                    )}
                    <p style={{ fontSize: "0.68rem", color: ACCENT, lineHeight: 1.3, marginBottom: "0.2rem", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>
                      {item.songs?.song_name}
                    </p>
                    <p style={{ fontSize: "0.6rem", color: "rgba(166,38,33,0.65)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "100%" }}>
                      {item.songs?.artist}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Nav + Sign out */}
          <div className="fade-up fade-up-4" style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
            <button
              onClick={() => router.push("/map")}
              style={{
                background: "none", border: "none",
                color: "rgba(166,38,33,0.55)", fontSize: "0.65rem",
                fontFamily: "var(--font-dm-mono), monospace",
                letterSpacing: "0.1em", cursor: "pointer", transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = ACCENT)}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(166,38,33,0.55)")}
            >
              ← The Neighborhood
            </button>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = "/";
              }}
              style={{
                background: "none", border: "none",
                color: "rgba(166,38,33,0.55)", fontSize: "0.65rem",
                fontFamily: "var(--font-dm-mono), monospace",
                letterSpacing: "0.1em", cursor: "pointer", transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = ACCENT)}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(166,38,33,0.55)")}
            >
              Sign Out
            </button>
          </div>

        </div>
      </main>
    </>
  );
}