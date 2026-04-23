"use client";
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://tmzcaxrqttblfrytenae.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtemNheHJxdHRibGZyeXRlbmFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4OTU5NTgsImV4cCI6MjA5MjQ3MTk1OH0.3lYKH-FZc8n-FUdnffUvKP294c72mAEzOV93iqb2rxM");

mapboxgl.accessToken = "pk.eyJ1IjoiYWx1cXVlbWEiLCJhIjoiY21vYnVhdDdyMDVudTJyb3BwbHU2bnJkdCJ9.fkJLuwvSZ12xkYpgyld0dA";

export default function Map() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-74.006, 40.7128],
      zoom: 11,
    });

    map.current.on("load", async () => {
      const { data: songs } = await supabase.from("songs").select("*, profiles(screenname)");
      if (songs) {
        songs.forEach((song) => {
          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
            '<div style="background:#111;color:#fff;padding:8px;font-family:sans-serif;">' +
            '<p style="font-size:11px;color:#999;margin:0">' + (song.profiles?.screenname || "anonymous") + '</p>' +
            '<p style="font-size:13px;margin:4px 0 0">' + song.song_name + '</p>' +
            '<p style="font-size:11px;color:#999;margin:2px 0 0">' + song.artist + '</p>' +
            '</div>'
          );
          const el = document.createElement("div");
          el.style.width = "10px";
          el.style.height = "10px";
          el.style.borderRadius = "50%";
          el.style.backgroundColor = "white";
          el.style.cursor = "pointer";
          new mapboxgl.Marker(el).setLngLat([song.longitude, song.latitude]).setPopup(popup).addTo(map.current!);
        });
      }
    });
  }, []);

  return (
    <main className="w-full h-screen relative">
      <div className="absolute top-6 left-6 z-10">
        <h1 className="text-sm tracking-widest text-zinc-400 uppercase">friend of a friend</h1>
        <p className="text-zinc-600 text-xs mt-1">new york city</p>
      </div>
      <div className="absolute bottom-6 right-6 z-10">
        <a href="/profile" className="bg-black border border-zinc-700 text-white text-xs px-4 py-2">profile</a>
      </div>
      <div ref={mapContainer} className="w-full h-full" />
    </main>
  );
}
