"use client";
import { useState } from "react";
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

  const handleSubmit = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .insert([{ screenname, age_range: ageRange, gender }]);

    if (error) {
      console.error(error);
      setLoading(false);
    } else {
      router.push("/map");
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      <div className="max-w-xl w-full space-y-8">
        <h1 className="text-sm tracking-widest text-zinc-400 uppercase">
          friend of a friend
        </h1>

        {step === 1 && (
          <div className="space-y-6">
            <p className="text-3xl font-light">What should we call you?</p>
            <input
              type="text"
              placeholder="screenname..."
              value={screenname}
              onChange={(e) => setScreenname(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-600 px-4 py-3 text-sm focus:outline-none focus:border-white transition"
            />
            <button
              onClick={() => setStep(2)}
              disabled={!screenname}
              className="w-full bg-white text-black text-sm py-3 hover:bg-zinc-200 transition disabled:opacity-30"
            >
              next
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <p className="text-3xl font-light">How old are you?</p>
            <div className="grid grid-cols-2 gap-3">
              {["18–24", "25–32", "33–40", "41+"].map((range) => (
                <button
                  key={range}
                  onClick={() => setAgeRange(range)}
                  className={`py-3 text-sm border transition ${ageRange === range ? "bg-white text-black border-white" : "border-zinc-700 text-zinc-400 hover:border-white hover:text-white"}`}
                >
                  {range}
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(3)}
              disabled={!ageRange}
              className="w-full bg-white text-black text-sm py-3 hover:bg-zinc-200 transition disabled:opacity-30"
            >
              next
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <p className="text-3xl font-light">How do you identify?</p>
            <p className="text-zinc-500 text-sm">optional</p>
            <div className="grid grid-cols-2 gap-3">
              {["woman", "man", "non-binary", "prefer not to say"].map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`py-3 text-sm border transition ${gender === g ? "bg-white text-black border-white" : "border-zinc-700 text-zinc-400 hover:border-white hover:text-white"}`}
                >
                  {g}
                </button>
              ))}
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-white text-black text-sm py-3 hover:bg-zinc-200 transition disabled:opacity-30"
            >
              {loading ? "saving..." : "enter the map"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
