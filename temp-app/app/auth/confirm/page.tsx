"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://tmzcaxrqttblfrytenae.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtemNheHJxdHRibGZyeXRlbmFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4OTU5NTgsImV4cCI6MjA5MjQ3MTk1OH0.3lYKH-FZc8n-FUdnffUvKP294c72mAEzOV93iqb2rxM"
);

export default function AuthConfirm() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id")
          .eq("user_id", session.user.id)
          .limit(1);

        if (profiles && profiles.length > 0) {
          router.push("/map");
        } else {
          router.push("/onboarding");
        }
      } else {
        // Listen for auth state change — magic link token gets exchanged async
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (event === "SIGNED_IN" && session?.user) {
              subscription.unsubscribe();
              const { data: profiles } = await supabase
                .from("profiles")
                .select("id")
                .eq("user_id", session.user.id)
                .limit(1);

              if (profiles && profiles.length > 0) {
                router.push("/map");
              } else {
                router.push("/onboarding");
              }
            }
          }
        );

        // Fallback timeout
        setTimeout(() => {
          subscription.unsubscribe();
          router.push("/");
        }, 5000);
      }
    };

    handleAuth();
  }, []);

  return (
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
        .light-leak {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background:
            radial-gradient(ellipse 50% 55% at -5% 100%, rgba(160,30,15,0.45) 0%, transparent 65%),
            radial-gradient(ellipse 35% 35% at 105% 0%, rgba(140,20,10,0.3) 0%, transparent 60%);
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>
      <div className="grain" />
      <div className="light-leak" />
      <main style={{
        minHeight: "100vh",
        backgroundColor: "#060404",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-dm-mono), monospace",
      }}>
        <p style={{
          color: "#c0392b",
          fontSize: "0.75rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          animation: "pulse 1.5s ease infinite",
        }}>
          logging you in···
        </p>
      </main>
    </>
  );
}