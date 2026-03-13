import { NextRequest, NextResponse } from "next/server";
import { getSpotifyAuthUrl, searchSpotifyAlbum, isSpotifyConnected } from "@/lib/spotify";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");

  if (action === "auth-url") {
    return NextResponse.json({ url: getSpotifyAuthUrl() });
  }

  if (action === "status") {
    const connected = await isSpotifyConnected();
    return NextResponse.json({ connected });
  }

  if (action === "search") {
    const artist = searchParams.get("artist") || "";
    const album = searchParams.get("album") || "";
    const result = await searchSpotifyAlbum(artist, album);
    return NextResponse.json({ result });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
