"use client";
import { useEffect, useState, use } from "react";
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

export default function OtherCollection({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [songs, setSongs] = useState<any[]>([]);
  const [collected, setCollected] = useState<any[]>([]);
  const [collecting, setCollecting] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (profileData) {
        setProfile(profileData);

        const { data: songData } = await supabase
          .from("songs")
          .select("*")
          .eq("profile_id", profileData.id);
        setSongs(songData || []);

        const { data: collectionData } = await supabase
          .from("collections")
          .select("*, songs(*)")
          .eq("profile_id", profileData.id);
        setCollected(collectionData || []);
      }
    };
    load();
  }, [id]);

  const collectSong = async (songId: number) => {
    setCollecting(songId);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setCollecting(null); return; }

    const { data: myProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", user.id)
      .limit(1)
      .single();

    if (myProfile) {
      await supabase.from("collections").insert([{
        profile_id: myProfile.id,
        song_id: songId,
      }]);
    }
    setCollecting(null);
    alert("Song Collected!");
  };

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
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .fade-up { animation: fadeUp 0.7s ease both; }
        .fade-up-1 { animation-delay: 0.05s; }
        .fade-up-2 { animation-delay: 0.15s; }
        .fade-up-3 { animation-delay: 0.25s; }
        .fade-up-4 { animation-delay: 0.35s; }

        .disc-card {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.6rem;
          cursor: default;
        }

        .disc-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 1;
        }

        .disc-vinyl {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: radial-gradient(circle at 50% 50%,
            #1a1a1a 0%,
            #111 20%,
            #1a1a1a 21%,
            #111 35%,
            #1a1a1a 36%,
            #111 50%,
            #1a1a1a 51%,
            #111 65%,
            #1a1a1a 66%,
            #111 80%,
            #1a1a1a 81%,
            #111 100%
          );
          box-shadow: 0 0 20px rgba(0,0,0,0.8), 0 0 8px rgba(166,38,33,0.2);
          transition: transform 0.6s ease;
        }

        .disc-card:hover .disc-vinyl {
          animation: spin 4s linear infinite;
        }

        .disc-label {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 38%;
          aspect-ratio: 1;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid rgba(166,38,33,0.3);
        }

        .disc-label img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .disc-hole {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 6%;
          aspect-ratio: 1;
          border-radius: 50%;
          background: #060404;
          border: 1px solid rgba(166,38,33,0.2);
          z-index: 2;
        }

        .collect-btn {
          background: transparent;
          border: 1px solid rgba(166,38,33,0.45);
          border-radius: 999px;
          color: rgba(166,38,33,0.65);
          font-family: var(--font-dm-mono), monospace;
          font-size: 0.58rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.3rem 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .collect-btn:hover {
          border-color: ${ACCENT};
          color: ${ACCENT};
          box-shadow: 0 0 10px ${ACCENT_GLOW};
        }
        .collect-btn:disabled {
          opacity: 0.3;
          cursor: default;
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

          {/* Meta */}
          <p className="fade-up fade-up-1" style={{
            fontSize: "0.7rem",
            color: "rgba(166,38,33,0.65)",
            letterSpacing: "0.08em",
            marginBottom: "3rem",
          }}>
            {profile.age_range}{profile.age_range && profile.gender ? " · " : ""}{profile.gender}
          </p>

          {/* Songs dropped as discs */}
          <div className="fade-up fade-up-2" style={{ marginBottom: "3rem", width: "100%" }}>
            <p className="section-label">Songs Dropped</p>
            {songs.length === 0 ? (
              <p style={{ fontSize: "0.72rem", color: "rgba(166,38,33,0.55)", letterSpacing: "0.04em" }}>
                No songs dropped yet.
              </p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "1.5rem" }}>
                {songs.map((song) => (
                  <div key={song.id} className="disc-card">
                    <div className="disc-wrapper">
                      <div className="disc-vinyl" />
                      <div className="disc-label">
                        {song.cover_art ? (
                          <img src={song.cover_art} alt="" />
                        ) : (
                          <div style={{ width: "100%", height: "100%", background: "rgba(166,38,33,0.15)" }} />
                        )}
                      </div>
                      <div className="disc-hole" />
                    </div>
                    <p style={{ fontSize: "0.68rem", color: ACCENT, lineHeight: 1.3, marginBottom: "0.1rem", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>
                      {song.song_name}
                    </p>
                    <p style={{ fontSize: "0.58rem", color: "rgba(166,38,33,0.65)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "100%", marginBottom: "0.4rem" }}>
                      {song.artist}
                    </p>
                    <button
                      onClick={() => collectSong(song.id)}
                      disabled={collecting === song.id}
                      className="collect-btn"
                    >
                      {collecting === song.id ? "···" : "Collect"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Their collection as discs */}
          <div className="fade-up fade-up-3" style={{ marginBottom: "3rem", width: "100%" }}>
            <p className="section-label">Their Collection</p>
            {collected.length === 0 ? (
              <p style={{ fontSize: "0.72rem", color: "rgba(166,38,33,0.55)", letterSpacing: "0.04em" }}>
                Nothing collected yet.
              </p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "1.5rem" }}>
                {collected.map((item) => (
                  <div key={item.id} className="disc-card">
                    <div className="disc-wrapper">
                      <div className="disc-vinyl" />
                      <div className="disc-label">
                        {item.songs?.cover_art ? (
                          <img src={item.songs.cover_art} alt="" />
                        ) : (
                          <div style={{ width: "100%", height: "100%", background: "rgba(166,38,33,0.15)" }} />
                        )}
                      </div>
                      <div className="disc-hole" />
                    </div>
                    <p style={{ fontSize: "0.68rem", color: ACCENT, lineHeight: 1.3, marginBottom: "0.1rem", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>
                      {item.songs?.song_name}
                    </p>
                    <p style={{ fontSize: "0.58rem", color: "rgba(166,38,33,0.65)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "100%", marginBottom: "0.4rem" }}>
                      {item.songs?.artist}
                    </p>
                    <button
                      onClick={() => collectSong(item.songs?.id)}
                      className="collect-btn"
                    >
                      Collect
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Back button */}
          <button
            onClick={() => router.push("/map")}
            className="fade-up fade-up-4"
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

        </div>
      </main>
    </>
  );
}