import { NextRequest, NextResponse } from "next/server";

export interface ArtistInfo {
  origin: string;
  activeYears: string;
  biography: string;
  funFacts: string[];
  keyAlbums: string[];
  influence: string;
}

export async function POST(req: NextRequest) {
  const { artist, genres, albums } = await req.json();

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GEMINI_API_KEY no configurado" }, { status: 500 });
  }

  const albumList = (albums as { title: string; year: number | null }[])
    .map((a) => `"${a.title}" (${a.year ?? "??"})`)
    .join(", ");

  const prompt = `Eres un experto en historia musical. Para el artista "${artist}" (géneros: ${genres.join(", ")}), del cual el usuario tiene en su colección los siguientes álbumes: ${albumList}, devuelve un JSON con:
- origin: ciudad y país de origen del artista (en español)
- activeYears: años activos, ej "1965–presente" o "1970–1995"
- biography: biografía concisa de 3-4 oraciones en español, destacando lo más importante
- funFacts: array de exactamente 4 datos curiosos y fascinantes en español, que no sean obvios
- keyAlbums: array de 3 álbumes fundamentales del artista (puede incluir los que tiene el usuario)
- influence: una oración sobre la influencia o legado del artista en la música

Devuelve ÚNICAMENTE JSON válido, sin markdown ni texto adicional.`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 2048 },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: `Gemini error: ${err}` }, { status: 500 });
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

  let cleaned = text.replace(/```json\s*\n?/g, "").replace(/```\s*$/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start !== -1 && end !== -1) {
    cleaned = cleaned.slice(start, end + 1);
  }

  try {
    const info = JSON.parse(cleaned) as ArtistInfo;
    return NextResponse.json(info);
  } catch {
    return NextResponse.json({ error: "Error al parsear respuesta de IA" }, { status: 500 });
  }
}
