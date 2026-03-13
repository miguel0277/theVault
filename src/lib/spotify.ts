import { prisma } from "./prisma";

const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize";
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_API_URL = "https://api.spotify.com/v1";

export function getSpotifyAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: process.env.SPOTIFY_CLIENT_ID || "",
    response_type: "code",
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI || "",
    scope: "user-read-private",
  });
  return `${SPOTIFY_AUTH_URL}?${params.toString()}`;
}

export async function exchangeCodeForToken(code: string) {
  const res = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI || "",
    }),
  });

  const data = await res.json();

  await prisma.spotifyToken.upsert({
    where: { id: "default" },
    create: {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: new Date(Date.now() + data.expires_in * 1000),
    },
    update: {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: new Date(Date.now() + data.expires_in * 1000),
    },
  });

  return data;
}

async function getAccessToken(): Promise<string | null> {
  const token = await prisma.spotifyToken.findUnique({
    where: { id: "default" },
  });

  if (!token) return null;

  if (token.expiresAt < new Date()) {
    const res = await fetch(SPOTIFY_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      }),
    });

    const data = await res.json();

    await prisma.spotifyToken.update({
      where: { id: "default" },
      data: {
        accessToken: data.access_token,
        expiresAt: new Date(Date.now() + data.expires_in * 1000),
        ...(data.refresh_token
          ? { refreshToken: data.refresh_token }
          : {}),
      },
    });

    return data.access_token;
  }

  return token.accessToken;
}

export async function searchSpotifyAlbum(
  artist: string,
  album: string
): Promise<{
  id: string;
  url: string;
  coverArt: string;
  name: string;
} | null> {
  const accessToken = await getAccessToken();
  if (!accessToken) return null;

  const query = encodeURIComponent(`album:${album} artist:${artist}`);
  const res = await fetch(
    `${SPOTIFY_API_URL}/search?q=${query}&type=album&limit=1`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!res.ok) return null;

  const data = await res.json();
  const items = data.albums?.items;

  if (!items || items.length === 0) return null;

  const spotifyAlbum = items[0];
  return {
    id: spotifyAlbum.id,
    url: spotifyAlbum.external_urls.spotify,
    coverArt: spotifyAlbum.images[0]?.url || "",
    name: spotifyAlbum.name,
  };
}

export async function isSpotifyConnected(): Promise<boolean> {
  const token = await prisma.spotifyToken.findUnique({
    where: { id: "default" },
  });
  return !!token;
}
