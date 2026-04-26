"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://tmzcaxrqttblfrytenae.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtemNheHJxdHRibGZyeXRlbmFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4OTU5NTgsImV4cCI6MjA5MjQ3MTk1OH0.3lYKH-FZc8n-FUdnffUvKP294c72mAEzOV93iqb2rxM"
);

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [headlineFontSize, setHeadlineFontSize] = useState(64);
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

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
      const maxSize = window.innerWidth < 768 ? 52 : size - 1;
      setHeadlineFontSize(Math.min(size - 1, maxSize));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  const searchSongs = async () => {
    if (!query) return;
    setLoading(true);
    const res = await fetch(`/api/spotify?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResults(data.tracks?.items || []);
    setLoading(false);
  };

  const handleLogin = async () => {
    if (!email) return;
    setLoginLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: "https://friend-of-a-friend-seven.vercel.app/auth/confirm" },
    });
    if (!error) setSent(true);
    setLoginLoading(false);
  };

  const accent = "#c0392b";
  const accentDim = "rgba(192,57,43,0.18)";
  const accentGlow = "rgba(192,57,43,0.4)";
  const accentFaint = "rgba(192,57,43,0.08)";

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
        .fade-up-5 { animation-delay: 0.45s; }

        .search-pill-wrapper {
          display: flex;
          align-items: center;
          border: 1px solid rgba(192,57,43,0.25);
          border-radius: 999px;
          padding: 0.3rem 0.3rem 0.3rem 1.5rem;
          transition: border-color 0.2s, box-shadow 0.2s;
          background: transparent;
          width: 100%;
        }
        .search-pill-wrapper:focus-within {
          border-color: ${accent};
          box-shadow: 0 0 14px ${accentGlow}, inset 0 0 8px rgba(192,57,43,0.04);
        }

        .pill-input {
          flex: 1;
          background: transparent;
          border: none;
          color: ${accent};
          font-size: 0.78rem;
          font-family: var(--font-dm-mono), monospace;
          letter-spacing: 0.06em;
          outline: none;
          caret-color: ${accent};
          min-width: 0;
        }
        .pill-input::placeholder { color: rgba(192,57,43,0.3); }

        .pill-search-btn {
          background: ${accent};
          border: none;
          border-radius: 999px;
          color: #080808;
          padding: 0.65rem 1.4rem;
          font-size: 0.68rem;
          font-family: var(--font-dm-mono), monospace;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .pill-search-btn:hover {
          box-shadow: 0 0 18px ${accentGlow};
          background: #a93226;
        }

        .pill-btn-full {
          width: 100%;
          border-radius: 999px;
          border: 1px solid ${accent};
          font-family: var(--font-dm-mono), monospace;
          font-size: 0.72rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          padding: 0.9rem 1rem;
          cursor: pointer;
          transition: all 0.25s;
        }
        .pill-btn-full.active {
          background: ${accent};
          color: #080808;
          box-shadow: 0 0 24px ${accentGlow}, 0 0 60px rgba(192,57,43,0.12);
        }
        .pill-btn-full.inactive {
          background: transparent;
          color: rgba(192,57,43,0.25);
          cursor: default;
          border-color: rgba(192,57,43,0.15);
        }
        .pill-btn-full.active:hover {
          background: #a93226;
          box-shadow: 0 0 36px ${accentGlow}, 0 0 80px rgba(192,57,43,0.18);
        }

        .result-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.65rem 1.1rem;
          cursor: pointer;
          border-bottom: 1px solid rgba(192,57,43,0.08);
          transition: background 0.15s;
        }
        .result-row:last-child { border-bottom: none; }
        .result-row:hover { background: rgba(192,57,43,0.06); }

        .rule {
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, ${accent} 0%, transparent 100%);
          box-shadow: 0 0 8px ${accentGlow};
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

        @media (max-width: 768px) {
          .search-pill-wrapper { padding: 0.5rem 0.5rem 0.5rem 1.25rem; }
          .pill-search-btn { padding: 0.6rem 1rem; font-size: 0.62rem; }
          .pill-btn-full { padding: 0.85rem 1rem; font-size: 0.65rem; }
        }
      `}</style>

      <div className="grain" />
      <div className="light-leak" />

      <main style={{
        minHeight: "100vh",
        backgroundColor: "#060404",
        color: accent,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "3rem max(1.5rem, 5vw)",
        fontFamily: "var(--font-dm-mono), monospace",
        position: "relative",
        overflow: "hidden",
      }}>
        <div ref={containerRef} style={{ width: "100%", maxWidth: "1100px", margin: "0 auto" }}>

          <div className="rule fade-up fade-up-1" />

          <p className="fade-up fade-up-1" style={{
            fontSize: "0.6rem",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: accent,
            opacity: 0.55,
            marginBottom: "1.25rem",
          }}>
            Friend of a Friend™
          </p>

          {!showLogin ? (
            <>
              <div style={{ width: "100%", marginBottom: "2rem", paddingBottom: "0.2em" }}>
                <h1
                  ref={headlineRef}
                  className="fade-up fade-up-2"
                  style={{
                    fontFamily: "var(--font-playfair), serif",
                    fontStyle: "italic",
                    fontWeight: 400,
                    lineHeight: 1.15,
                    color: accent,
                    textShadow: `0 0 30px ${accentGlow}, 0 0 80px rgba(192,57,43,0.1)`,
                    letterSpacing: "-0.01em",
                    fontSize: `${headlineFontSize}px`,
                    margin: 0,
                    padding: "0 0 0.15em 0",
                    whiteSpace: "nowrap",
                    overflow: "visible",
                  }}
                >
                  Every neighborhood has a sound.
                </h1>
                <h1
                  className="fade-up fade-up-2"
                  style={{
                    fontFamily: "var(--font-playfair), serif",
                    fontStyle: "italic",
                    fontWeight: 400,
                    lineHeight: 1.15,
                    color: accent,
                    textShadow: `0 0 30px ${accentGlow}, 0 0 80px rgba(192,57,43,0.1)`,
                    letterSpacing: "-0.01em",
                    fontSize: `${headlineFontSize}px`,
                    margin: 0,
                    padding: "0 0 0.15em 0",
                    whiteSpace: "nowrap",
                    overflow: "visible",
                  }}
                >
                  Every person has a song.
                </h1>
              </div>

              <div className="fade-up fade-up-3" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <p style={{
                  fontSize: "0.75rem",
                  color: "rgba(192,57,43,0.45)",
                  lineHeight: 1.85,
                  letterSpacing: "0.04em",
                }}>
                  This is a place built on music — not followers, not likes. Just people and the songs that find them.<br />
                  Drop a song to get in. Find out who else is here.
                </p>

                <div className="search-pill-wrapper">
                  <input
                    type="text"
                    placeholder="Search for a song..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && searchSongs()}
                    className="pill-input"
                  />
                  <button onClick={searchSongs} className="pill-search-btn">
                    {loading ? "···" : "Search →"}
                  </button>
                </div>

                {results.length > 0 && !selected && (
                  <div style={{
                    border: `1px solid ${accentDim}`,
                    borderRadius: "16px",
                    overflow: "hidden",
                    background: "rgba(6,4,4,0.9)",
                  }}>
                    {results.slice(0, 5).map((track) => (
                      <div key={track.id} className="result-row" onClick={() => setSelected(track)}>
                        <img src={track.album.images[2]?.url} alt=""
                          style={{ width: 36, height: 36, objectFit: "cover", borderRadius: 4, opacity: 0.85 }}
                        />
                        <div>
                          <p style={{ fontSize: "0.74rem", color: accent, marginBottom: "0.1rem" }}>{track.name}</p>
                          <p style={{ fontSize: "0.63rem", color: "rgba(192,57,43,0.4)" }}>{track.artists[0].name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selected && (
                  <div style={{
                    display: "flex", alignItems: "center", gap: "0.75rem",
                    padding: "0.7rem 1rem",
                    border: `1px solid ${accent}`,
                    borderRadius: "16px",
                    boxShadow: `0 0 20px ${accentGlow}`,
                    background: accentFaint,
                  }}>
                    <img src={selected.album.images[2]?.url} alt=""
                      style={{ width: 38, height: 38, objectFit: "cover", borderRadius: 4 }}
                    />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "0.74rem", color: accent }}>{selected.name}</p>
                      <p style={{ fontSize: "0.63rem", color: "rgba(192,57,43,0.4)" }}>{selected.artists[0].name}</p>
                    </div>
                    <button onClick={() => setSelected(null)}
                      style={{ background: "none", border: "none", color: "rgba(192,57,43,0.3)", cursor: "pointer", fontSize: "0.7rem" }}
                    >✕</button>
                  </div>
                )}

                <button
                  onClick={() => {
                    if (selected) {
                      document.cookie = "entrySong=" + encodeURIComponent(JSON.stringify({
                        title: selected.name,
                        artist: selected.artists[0].name,
                        spotifyId: selected.id,
                        coverArt: selected.album.images[1]?.url,
                        previewUrl: selected.preview_url,
                      })) + "; path=/; max-age=3600";
                      router.push("/welcome");
                    }
                  }}
                  disabled={!selected}
                  className={`pill-btn-full ${selected ? "active" : "inactive"}`}
                >
                  Enter →
                </button>

                <button
                  onClick={() => setShowLogin(true)}
                  style={{
                    width: "100%", background: "none", border: "none",
                    color: "rgba(192,57,43,0.22)", fontSize: "0.62rem",
                    fontFamily: "var(--font-dm-mono), monospace",
                    letterSpacing: "0.1em", cursor: "pointer",
                    padding: "0.25rem", transition: "color 0.2s", textAlign: "center",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = accent)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(192,57,43,0.22)")}
                >
                  Returning? Sign In
                </button>
              </div>
            </>
          ) : (
            <div>
              <h1 className="fade-up fade-up-2" style={{
                fontFamily: "var(--font-playfair), serif",
                fontStyle: "italic",
                fontSize: `${headlineFontSize}px`,
                fontWeight: 400,
                color: accent,
                textShadow: `0 0 30px ${accentGlow}, 0 0 80px rgba(192,57,43,0.1)`,
                marginBottom: "1.75rem",
                lineHeight: 1.15,
                padding: "0 0 0.15em 0",
              }}>
                Welcome Back.
              </h1>

              {!sent ? (
                <div className="fade-up fade-up-3" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <p style={{ fontSize: "0.72rem", color: "rgba(192,57,43,0.45)", letterSpacing: "0.04em" }}>
                    Enter your email to get your link.
                  </p>
                  <div className="search-pill-wrapper">
                    <input
                      type="email" placeholder="Your email..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                      className="pill-input"
                    />
                  </div>
                  <button
                    onClick={handleLogin}
                    disabled={loginLoading || !email}
                    className={`pill-btn-full ${email && !loginLoading ? "active" : "inactive"}`}
                  >
                    {loginLoading ? "Sending···" : "Send Magic Link →"}
                  </button>
                  <button
                    onClick={() => setShowLogin(false)}
                    style={{
                      background: "none", border: "none", color: "rgba(192,57,43,0.22)",
                      fontSize: "0.62rem", fontFamily: "var(--font-dm-mono), monospace",
                      letterSpacing: "0.1em", cursor: "pointer", padding: "0.5rem", transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = accent)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(192,57,43,0.22)")}
                  >
                    ← Back
                  </button>
                </div>
              ) : (
                <div className="fade-up fade-up-3">
                  <p style={{ fontSize: "0.9rem", color: accent, marginBottom: "0.75rem" }}>Check Your Email.</p>
                  <p style={{ fontSize: "0.72rem", color: "rgba(192,57,43,0.45)", letterSpacing: "0.04em" }}>
                    We sent a link to <span style={{ color: accent }}>{email}</span>. Click it to enter.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}