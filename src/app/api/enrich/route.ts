import { NextRequest, NextResponse } from "next/server";
import { enrichRecord } from "@/lib/claude";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.artist || !body.title) {
      return NextResponse.json(
        { error: "Artist and title are required" },
        { status: 400 }
      );
    }

    const enriched = await enrichRecord(
      body.artist,
      body.title,
      body.year,
      body.label,
      body.catalogNumber
    );

    return NextResponse.json(enriched);
  } catch (error) {
    console.error("Enrichment error:", error);
    return NextResponse.json(
      { error: "Failed to enrich record. Check your API key." },
      { status: 500 }
    );
  }
}
