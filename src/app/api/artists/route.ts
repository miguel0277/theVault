import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const records = await prisma.record.findMany({
    select: {
      id: true,
      artist: true,
      title: true,
      year: true,
      genre: true,
      coverArt: true,
    },
    orderBy: { artist: "asc" },
  });

  // Group by artist name
  const artistMap = new Map<
    string,
    {
      name: string;
      albums: { id: string; title: string; year: number | null; coverArt: string | null }[];
      genres: Set<string>;
    }
  >();

  for (const record of records) {
    const existing = artistMap.get(record.artist);
    if (existing) {
      existing.albums.push({
        id: record.id,
        title: record.title,
        year: record.year,
        coverArt: record.coverArt,
      });
      record.genre.forEach((g) => existing.genres.add(g));
    } else {
      artistMap.set(record.artist, {
        name: record.artist,
        albums: [{ id: record.id, title: record.title, year: record.year, coverArt: record.coverArt }],
        genres: new Set(record.genre),
      });
    }
  }

  const artists = Array.from(artistMap.values()).map((a) => ({
    name: a.name,
    albums: a.albums.sort((x, y) => (x.year ?? 0) - (y.year ?? 0)),
    genres: Array.from(a.genres),
    albumCount: a.albums.length,
  }));

  return NextResponse.json(artists);
}
