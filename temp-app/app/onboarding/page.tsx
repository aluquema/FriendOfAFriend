"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://tmzcaxrqttblfrytenae.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtemNheHJxdHRibGZyeXRlbmFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4OTU5NTgsImV4cCI6MjA5MjQ3MTk1OH0.3lYKH-FZc8n-FUdnffUvKP294c72mAEzOV93iqb2rxM"
);

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [screenname, setScreenname] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const [entrySong, setEntrySong] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const cookies = document.cookie.split(";").find(c => c.trim().startsWith("entrySong="));
    if (cookies) {
      const song = decodeURIComponent(cookies.split("=").slice(1).join("="));
      setEntrySong(JSON.parse(song));
    }
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    getUser();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .insert([{ screenname, age_range: ageRange, gender, user_id: userId }])
      .select()
      .single();

    if (profileError) {
      console.error("Profile error:", profileError);
      setLoading(false);
      return;
    }

    if (entrySong && profile) {
      const saveSong = async (lat: number, lng: number) => {
        const { error: songError } = await supabase.from("songs").insert([{
          song_name: entrySong.title,
          artist: entrySong.artist,
          profile_id: profile.id,
          latitude: lat,
          longitude: lng,
          cover_art: entrySong.coverArt,
          preview_url: entrySong.previewUrl,
          spotify_id: entrySong.spotifyId,
        }]);
        if (songError) console.error("Song save error:", songError);
        document.cookie = "entrySong=; path=/; max-age=0";
        router.push("/map");
      };

      const locationPromise = new Promise<{ lat: number; lng: number }>((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          () => resolve({
            lat: 40.7128 + (Math.random() - 0.5) * 0.05,
            lng: -74.006 + (Math.random() - 0.5) * 0.05,
          }),
          { timeout: 5000 }
        );
      });

      const { lat, lng } = await locationPromise;
      await saveSong(lat, lng);
    } else {
      document.cookie = "entrySong=; path=/; max-age=0";
      router.push("/map");
    }
  };

  const accent = "#c0392b";
  const accentGlow = "rgba(192,57,43,0.4)";
  const accentDim = "rgba(192,57,43,0.2)";
  const accentFaint = "rgba(192,57,43,0.08)";

  const headlines: Record<number, string> = {
    1: "What should we call your collection?",
    2: "How old are you?",
    3: "How do you identify?",
  };

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

        .pill-input-wrapper {
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
        .pill-input-wrapper:focus-within {
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
          box-shadow: 0 0 24px ${accentGlow}, 0 0 60px rgba(192,57,43,0.15);
        }
        .pill-btn-full.inactive {
          background: transparent;
          color: rgba(192,57,43,0.3);
          cursor: default;
          border-color: rgba(192,57,43,0.15);
        }
        .pill-btn-full.active:hover {
          background: #a93226;
          box-shadow: 0 0 36px ${accentGlow};
        }

        .option-btn {
          border-radius: 999px;
          border: 1px solid rgba(192,57,43,0.25);
          background: transparent;
          color: rgba(192,57,43,0.55);
          font-family: var(--font-dm-mono), monospace;
          font-size: 0.72rem;
          letter-spacing: 0.1em;
          padding: 0.85rem 1rem;
          cursor: pointer;
          transition: all 0.2s;
          text-transform: lowercase;
        }
        .option-btn:hover {
          border-color: ${accent};
          color: ${accent};
        }
        .option-btn.selected {
          background: ${accent};
          color: #080808;
          border-color: ${accent};
          box-shadow: 0 0 16px ${accentGlow};
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
        <div style={{ width: "100%", maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>

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

          {entrySong && (
            <div className="fade-up fade-up-1" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.75rem",
              border: "1px solid " + accentDim,
              borderRadius: "999px",
              padding: "0.4rem 1rem 0.4rem 0.4rem",
              background: accentFaint,
              marginBottom: "2rem",
            }}>
              {entrySong.coverArt && (
                <img src={entrySong.coverArt} alt="" style={{ width: 32, height: 32, objectFit: "cover", borderRadius: "999px" }} />
              )}
              <div>
                <p style={{ fontSize: "0.58rem", color: "rgba(192,57,43,0.45)", letterSpacing: "0.08em", textTransform: "uppercase" }}>your entry song</p>
                <p style={{ fontSize: "0.72rem", color: accent }}>{entrySong.title} — {entrySong.artist}</p>
              </div>
            </div>
          )}

          <div style={{ width: "100%", paddingBottom: "0.2em", marginBottom: "2rem" }}>
            <h1
              className="fade-up fade-up-2"
              style={{
                fontFamily: "var(--font-playfair), serif",
                fontStyle: "italic",
                fontWeight: 400,
                lineHeight: 1.15,
                color: accent,
                textShadow: "0 0 40px " + accentGlow + ", 0 0 100px rgba(192,57,43,0.12)",
                letterSpacing: "-0.01em",
                fontSize: "clamp(1.8rem, 3.5vw, 3.8rem)",
                margin: 0,
                padding: "0 0 0.15em 0",
                overflow: "visible",
              }}
            >
              {headlines[step]}
            </h1>
          </div>

          <div className="fade-up fade-up-3" style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}>
            {step === 1 && (
              <>
                <div className="pill-input-wrapper">
                  <input
                    type="text"
                    placeholder="collection name..."
                    value={screenname}
                    onChange={(e) => setScreenname(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && screenname && setStep(2)}
                    className="pill-input"
                  />
                </div>
                <button
                  onClick={() => setStep(2)}
                  disabled={!screenname}
                  className={"pill-btn-full " + (screenname ? "active" : "inactive")}
                >
                  next →
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  {["18–24", "25–32", "33–40", "41+"].map((range) => (
                    <button
                      key={range}
                      onClick={() => setAgeRange(range)}
                      className={"option-btn " + (ageRange === range ? "selected" : "")}
                    >
                      {range}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setStep(3)}
                  disabled={!ageRange}
                  className={"pill-btn-full " + (ageRange ? "active" : "inactive")}
                >
                  next →
                </button>
              </>
            )}

            {step === 3 && (
              <>
                <p style={{ fontSize: "0.65rem", color: "rgba(192,57,43,0.35)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  optional
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  {["woman", "man", "non-binary", "prefer not to say"].map((g) => (
                    <button
                      key={g}
                      onClick={() => setGender(g)}
                      className={"option-btn " + (gender === g ? "selected" : "")}
                    >
                      {g}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={"pill-btn-full " + (!loading ? "active" : "inactive")}
                >
                  {loading ? "saving···" : "enter the neighborhood →"}
                </button>
              </>
            )}
          </div>

          <div style={{ display: "flex", gap: "0.4rem", marginTop: "2.5rem" }}>
            {[1, 2, 3].map((s) => (
              <div key={s} style={{
                width: s === step ? "1.5rem" : "0.4rem",
                height: "0.4rem",
                borderRadius: "999px",
                background: s === step ? accent : "rgba(192,57,43,0.2)",
                transition: "all 0.3s",
              }} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}