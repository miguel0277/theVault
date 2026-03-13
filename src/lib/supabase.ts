import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error("Supabase URL and anon key are required for storage uploads");
    }
    _supabase = createClient(url, key);
  }
  return _supabase;
}

export async function uploadCoverArt(
  file: Buffer,
  filename: string,
  contentType: string
): Promise<string | null> {
  const supabase = getSupabase();

  const { data, error } = await supabase.storage
    .from("covers")
    .upload(filename, file, {
      contentType,
      upsert: true,
    });

  if (error) {
    console.error("Supabase storage upload error:", error);
    return null;
  }

  const { data: urlData } = supabase.storage
    .from("covers")
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}
