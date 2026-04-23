"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  "https://tmzcaxrqttblfrytenae.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtemNheHJxdHRibGZyeXRlbmFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4OTU5NTgsImV4cCI6MjA5MjQ3MTk1OH0.3lYKH-FZc8n-FUdnffUvKP294c72mAEzOV93iqb2rxM"
);

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [songs, setSongs] = useState<any[]>([]);

  useEffect(() => {
    const loadProfile = async () => {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1);

      if (profiles && profiles[0]) {
        setProfile(profiles[0]);
        const { data: songData } = await supabase
          .from("songs")
          .select("*")
          .eq("profile_id", profiles[0].id);
        setSongs(songData || []);
      }
    };
    loadProfile();
  }, []);

  if (!profile) return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <p className="text-zinc-500 text-sm">loading...</p>
    </main>
  );

  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-xl mx-auto space-y-10">
        <div className="flex items-center justify-between">
          <h1 className="text-sm tracking-widest text-zinc-400 uppercase">
            friend of a friend
          </h1>
          <Link href="/map" className="text-xs text-zinc-500 hover:text-white transition">
            back to map
          </Link>
        </div>

        <div className="space-y-2">
          <p className="text-3xl font-light">{profile.screenname}</p>
          <p className="text-zinc-500 text-sm">{profile.age_range} · {profile.gender}</p>
        </div>

        <div className="space-y-4">
          <p className="text-xs tracking-widest text-zinc-500 uppercase">your songs</p>
          {songs.length === 0 ? (
            <p className="text-zinc-600 text-sm">no songs yet</p>
          ) : (
            <div className="space-y-3">
              {songs.map((song) => (
                <div key={song.id} className="flex items-center gap-4 p-4 border border-zinc-800 bg-zinc-900">
                  <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center border-2 border-zinc-600">
                    <div className="w-2 h-2 rounded-full bg-zinc-400" />
                  </div>
                  <div>
                    <p className="text-sm text-white">{song.song_name}</p>
                    <p className="text-xs text-zinc-500">{song.artist}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <p className="text-xs tracking-widest text-zinc-500 uppercase">disc collection</p>
          <p className="text-zinc-600 text-sm">songs you collect from the map will appear here</p>
          <div className="grid grid-cols-3 gap-3">
            {[1,2,3].map((i) => (
              <div key={i} className="aspect-square border border-zinc-800 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-zinc-700" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}