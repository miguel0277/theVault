import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const record = await prisma.record.findUnique({ where: { id } });

  if (!record) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(record);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const record = await prisma.record.update({
    where: { id },
    data: {
      title: body.title,
      artist: body.artist,
      year: body.year || null,
      label: body.label || null,
      catalogNumber: body.catalogNumber || null,
      genre: body.genre ?? undefined,
      condition: body.condition,
      coverArt: body.coverArt,
      spotifyAlbumId: body.spotifyAlbumId,
      spotifyUrl: body.spotifyUrl,
      sideATracks: body.sideATracks ?? undefined,
      sideBTracks: body.sideBTracks ?? undefined,
      producer: body.producer,
      studios: body.studios ?? undefined,
      country: body.country,
      pressingInfo: body.pressingInfo,
      funFacts: body.funFacts ?? undefined,
      credits: body.credits ?? undefined,
      similarAlbums: body.similarAlbums ?? undefined,
      userNotes: body.userNotes,
    },
  });

  return NextResponse.json(record);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.record.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
