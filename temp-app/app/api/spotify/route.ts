import { NextRequest, NextResponse } from "next/server";

async function getYouTubeId(query: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&key=AIzaSyCVjlMB-gNKP3IFc6btiBV6c034A4XxLDo&maxResults=1`
    );
    const data = await res.json();
    return data.items?.[0]?.id?.videoId || null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) return NextResponse.json({ error: "no query" }, { status: 400 });

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + Buffer.from(clientId + ":" + clientSecret).toString("base64"),
    },
    body: "grant_type=client_credentials",
  });

  const tokenData = await tokenRes.json();
  const token = tokenData.access_token;

  const searchRes = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`,
    { headers: { Authorization: "Bearer " + token } }
  );

  const searchData = await searchRes.json();
  return NextResponse.json(searchData);
}

export async function POST(request: NextRequest) {
  const { songName, artist } = await request.json();
  const youtubeId = await getYouTubeId(`${songName} ${artist} official audio`);
  return NextResponse.json({ youtubeId });
}