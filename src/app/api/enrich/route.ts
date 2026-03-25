import { NextRequest, NextResponse } from "next/server";
import { enrichRecord } from "@/lib/claude";
import { GEMINI_MODELS } from "@/lib/gemini-models";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.artist || !body.title) {
      return NextResponse.json(
        { error: "Artist and title are required" },
        { status: 400 }
      );
    }

    // Validate model if provided
    const modelEndpoint = body.model
      ? GEMINI_MODELS.find((m) => m.id === body.model)?.endpoint
      : undefined;

    const enriched = await enrichRecord(
      body.artist,
      body.title,
      body.year,
      body.label,
      body.catalogNumber,
      modelEndpoint
    );

    return NextResponse.json(enriched);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Enrichment error:", msg);

    // Detect quota/rate limit errors
    const isQuotaError =
      msg.toLowerCase().includes("429") ||
      msg.toLowerCase().includes("quota") ||
      msg.toLowerCase().includes("rate");

    return NextResponse.json(
      {
        error: msg,
        quotaExhausted: isQuotaError,
      },
      { status: isQuotaError ? 429 : 500 }
    );
  }
}
