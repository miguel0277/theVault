import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForToken } from "@/lib/spotify";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(
      new URL("/settings?spotify=error", req.url)
    );
  }

  try {
    await exchangeCodeForToken(code);
    return NextResponse.redirect(
      new URL("/settings?spotify=connected", req.url)
    );
  } catch (err) {
    console.error("Spotify callback error:", err);
    return NextResponse.redirect(
      new URL("/settings?spotify=error", req.url)
    );
  }
}
