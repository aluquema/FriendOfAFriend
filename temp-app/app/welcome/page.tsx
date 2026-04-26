"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://tmzcaxrqttblfrytenae.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtemNheHJxdHRibGZyeXRlbmFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4OTU5NTgsImV4cCI6MjA5MjQ3MTk1OH0.3lYKH-FZc8n-FUdnffUvKP294c72mAEzOV93iqb2rxM"
);

export default function Welcome() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
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
      const maxSize = window.innerWidth < 768 ? 48 : size - 1;
      setHeadlineFontSize(Math.min(size - 1, maxSize));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  const handleMagicLink = async () => {
    if (!email) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: "https://friend-of-a-friend-seven.vercel.app/auth/confirm" },
    });
    if (error) console.error(error);
    else setSent(true);
    setLoading(false);
  };

  const accent = "#c0392b";
  const accentGlow = "rgba(192,57,43,0.4)";

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

        .search-pill-wrapper {
          display: flex;
          align-items: center;
          border: 1px solid rgba(192,57,43,0.3);
          border-radius: 999px;
          padding: 0.6rem 0.6rem 0.6rem 1.5rem;
          min-height: 3.2rem;
          transition: border-color 0.2s, box-shadow 0.2s;
          background: transparent;
          width: 100%;
        }
        .search-pill-wrapper:focus-within {
          border-color: ${accent};
          box-shadow: 0 0 14px ${accentGlow};
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
          padding: 0.4rem 0;
        }
        .pill-input::placeholder { color: rgba(192,57,43,0.35); }

        .pill-btn-full {
          width: 100%;
          border-radius: 999px;
          border: 1px solid ${accent};
          font-family: var(--font-dm-mono), monospace;
          font-size: 0.72rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          padding: 0.9rem 1rem;
          min-height: 3.2rem;
          cursor: pointer;
          transition: all 0.25s;
        }
        .pill-btn-full.active {
          background: ${accent};
          color: #080808;
          box-shadow: 0 0 24px ${accentGlow};
        }
        .pill-btn-full.inactive {
          background: transparent;
          color: rgba(192,57,43,0.3);
          cursor: default;
          border-color: rgba(192,57,43,0.15);
        }

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
        <div ref={containerRef} style={{ width: "100%", maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>

          <div className="rule fade-up fade-up-1" />

          <p className="fade-up fade-up-1" style={{
            fontSize: "0.6rem",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: accent,
            opacity: 0.55,
            marginBottom: "1.5rem",
          }}>
            Friend of a Friend™
          </p>

          {!sent ? (
            <>
              <div style={{ width: "100%", paddingBottom: "0.2em" }}>
                <h1
                  ref={headlineRef}
                  className="fade-up fade-up-2"
                  style={{
                    fontFamily: "var(--font-playfair), serif",
                    fontStyle: "italic",
                    fontWeight: 400,
                    lineHeight: 1.15,
                    color: accent,
                    textShadow: `0 0 40px ${accentGlow}`,
                    letterSpacing: "-0.01em",
                    fontSize: `${headlineFontSize}px`,
                    margin: 0,
                    padding: "0 0 0.15em 0",
                    whiteSpace: "nowrap",
                    overflow: "visible",
                  }}
                >
                  Welcome, Friend of a Friend.
                </h1>
              </div>

              <p className="fade-up fade-up-2" style={{
                fontSize: "0.75rem",
                color: "rgba(192,57,43,0.55)",
                lineHeight: 1.85,
                letterSpacing: "0.04em",
                margin: "2rem 0",
              }}>
                Every collection starts somewhere.<br />
                Enter your email to begin yours.
              </p>

              <div className="fade-up fade-up-3" style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                width: "100%",
              }}>
                <div className="search-pill-wrapper">
                  <input
                    type="email"
                    placeholder="Your email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleMagicLink()}
                    className="pill-input"
                  />
                </div>

                <button
                  onClick={handleMagicLink}
                  disabled={loading || !email}
                  className={`pill-btn-full ${email && !loading ? "active" : "inactive"}`}
                >
                  {loading ? "Sending···" : "Send Magic Link →"}
                </button>
              </div>
            </>
          ) : (
            <div className="fade-up fade-up-2" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              <h1 style={{
                fontFamily: "var(--font-playfair), serif",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: `${headlineFontSize}px`,
                lineHeight: 1.15,
                color: accent,
                textShadow: `0 0 40px ${accentGlow}`,
                padding: "0 0 0.15em 0",
                whiteSpace: "nowrap",
              }}>
                Check Your Email.
              </h1>
              <p style={{
                fontSize: "0.75rem",
                color: "rgba(192,57,43,0.55)",
                letterSpacing: "0.04em",
                lineHeight: 1.85,
              }}>
                We sent a link to <span style={{ color: accent }}>{email}</span>.<br />
                Click it to enter.
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}