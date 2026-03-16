export interface EnrichedRecord {
  full_title: string;
  artist: string;
  year: number | null;
  label: string | null;
  catalog_number: string | null;
  genre: string[];
  side_a_tracks: { position: string; title: string; duration: string }[];
  side_b_tracks: { position: string; title: string; duration: string }[];
  producer: string | null;
  recording_studios: string[];
  release_country: string | null;
  pressing_info: string | null;
  fun_facts: string[];
  personnel_credits: { name: string; role: string }[];
  recommended_if_you_like: string[];
}

export async function enrichRecord(
  artist: string,
  title: string,
  year?: number | null,
  label?: string | null,
  catalogNumber?: string | null
): Promise<EnrichedRecord> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

  const userMessage = [
    `Artist: ${artist}`,
    `Album: ${title}`,
    year ? `Year: ${year}` : null,
    label ? `Label: ${label}` : null,
    catalogNumber ? `Catalog Number: ${catalogNumber}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const prompt = `Eres un experto en discos de vinilo e historiador musical. Con la información del álbum proporcionada, devuelve un objeto JSON con: full_title, artist, year, label, catalog_number, genre (array en español, ej: "Rock", "Jazz", "Salsa"), side_a_tracks (array de {position, title, duration}), side_b_tracks (igual), producer, recording_studios (array), release_country (en español, ej: "Estados Unidos"), pressing_info (en español), fun_facts (array de 3-5 datos fascinantes en español sobre la grabación, producción o impacto cultural), personnel_credits (array de {name, role} con el rol en español, ej: "Guitarra", "Bajo", "Productor"), recommended_if_you_like (array de 3 álbumes similares como "Artista - Álbum"). Sé específico y históricamente preciso. Devuelve ÚNICAMENTE JSON válido, sin formato markdown.\n\n${userMessage}`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 8192 },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error: ${err}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

  // Strip markdown code fences if present
  let cleaned = text.replace(/```json\s*\n?/g, "").replace(/```\s*$/g, "").trim();

  // Extract only the JSON object (from first { to last })
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start !== -1 && end !== -1) {
    cleaned = cleaned.slice(start, end + 1);
  }

  return JSON.parse(cleaned) as EnrichedRecord;
}
