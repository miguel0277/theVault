import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

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
  const userMessage = [
    `Artist: ${artist}`,
    `Album: ${title}`,
    year ? `Year: ${year}` : null,
    label ? `Label: ${label}` : null,
    catalogNumber ? `Catalog Number: ${catalogNumber}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    system:
      "You are a vinyl record expert and music historian. Given the album info provided, return a JSON object with: full_title, artist, year, label, catalog_number, genre (array), side_a_tracks (array of {position, title, duration}), side_b_tracks (same), producer, recording_studios (array), release_country, pressing_info, fun_facts (array of 3-5 fascinating facts about the recording, production, or cultural impact), personnel_credits (array of {name, role}), recommended_if_you_like (array of 3 similar albums as strings like 'Artist - Album'). Be specific and historically accurate. Return ONLY valid JSON, no markdown formatting.",
    messages: [{ role: "user", content: userMessage }],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";

  // Strip markdown code fences if present
  const cleaned = text.replace(/```json\s*\n?/g, "").replace(/```\s*$/g, "").trim();

  return JSON.parse(cleaned) as EnrichedRecord;
}
