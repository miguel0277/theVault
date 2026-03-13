import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const genre = searchParams.get("genre") || "";
  const condition = searchParams.get("condition") || "";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { artist: { contains: search, mode: "insensitive" } },
      { label: { contains: search, mode: "insensitive" } },
    ];
  }

  if (condition) {
    where.condition = condition;
  }

  if (genre) {
    where.genre = { has: genre };
  }

  const records = await prisma.record.findMany({
    where: where as never,
    orderBy: { [sortBy]: sortOrder },
  });

  return NextResponse.json(records);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const record = await prisma.record.create({
    data: {
      title: body.title,
      artist: body.artist,
      year: body.year || null,
      label: body.label || null,
      catalogNumber: body.catalogNumber || null,
      genre: body.genre || [],
      condition: body.condition || "VG",
      coverArt: body.coverArt || null,
      spotifyAlbumId: body.spotifyAlbumId || null,
      spotifyUrl: body.spotifyUrl || null,
      sideATracks: body.sideATracks || null,
      sideBTracks: body.sideBTracks || null,
      producer: body.producer || null,
      studios: body.studios || [],
      country: body.country || null,
      pressingInfo: body.pressingInfo || null,
      funFacts: body.funFacts || [],
      credits: body.credits || null,
      similarAlbums: body.similarAlbums || [],
      userNotes: body.userNotes || null,
    },
  });

  return NextResponse.json(record, { status: 201 });
}
