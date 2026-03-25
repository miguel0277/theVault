import { NextResponse } from "next/server";
import { GEMINI_MODELS, type ModelStatus } from "@/lib/gemini-models";

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not set" },
      { status: 500 }
    );
  }

  // Check each model availability in parallel with a minimal request
  const checks = GEMINI_MODELS.map(async (model): Promise<ModelStatus> => {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model.endpoint}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: "Responde solo: ok" }] }],
            generationConfig: { maxOutputTokens: 5 },
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const errorMessage = err?.error?.message || "";
        // 429 = rate limited / quota exhausted
        const isQuotaError =
          res.status === 429 ||
          errorMessage.toLowerCase().includes("quota") ||
          errorMessage.toLowerCase().includes("rate");
        const isNotFound = res.status === 404;

        return {
          id: model.id,
          name: model.name,
          description: model.description,
          available: !isQuotaError && !isNotFound,
        };
      }

      return {
        id: model.id,
        name: model.name,
        description: model.description,
        available: true,
      };
    } catch {
      return {
        id: model.id,
        name: model.name,
        description: model.description,
        available: false,
      };
    }
  });

  const results = await Promise.all(checks);
  return NextResponse.json(results);
}
