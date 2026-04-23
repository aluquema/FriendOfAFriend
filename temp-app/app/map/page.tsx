"use client";
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

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
  }, []);

  return (
    <main className="w-full h-screen relative">
      <div className="absolute top-6 left-6 z-10">
        <h1 className="text-sm tracking-widest text-zinc-400 uppercase">
          friend of a friend
        </h1>
        <p className="text-zinc-600 text-xs mt-1">new york city</p>
      </div>
      <div ref={mapContainer} className="w-full h-full" />
    </main>
  );
}
