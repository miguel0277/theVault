"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Sparkles, ArrowLeft, ImagePlus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { EnrichmentReview } from "@/components/ai-enrichment/enrichment-review";
import type { EnrichedRecord } from "@/lib/claude";
import { CONDITIONS } from "@/lib/utils";

interface AddRecordForm {
  artist: string;
  title: string;
  year?: number;
  label?: string;
  catalogNumber?: string;
  condition: string;
  userNotes?: string;
}

const addRecordSchema = z.object({
  artist: z.string().min(1, "Artist is required"),
  title: z.string().min(1, "Album title is required"),
  year: z.union([z.number().int().min(1900).max(2030), z.nan()]).optional(),
  label: z.string().optional(),
  catalogNumber: z.string().optional(),
  condition: z.string(),
  userNotes: z.string().optional(),
});

export default function AddRecordPage() {
  const router = useRouter();
  const [step, setStep] = useState<"input" | "enriching" | "review">("input");
  const [enrichedData, setEnrichedData] = useState<EnrichedRecord | null>(null);
  const [formValues, setFormValues] = useState<AddRecordForm | null>(null);
  const [enrichError, setEnrichError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);

  function handleCoverSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  }

  function removeCover() {
    setCoverFile(null);
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverPreview(null);
  }

  async function uploadCover(): Promise<string | null> {
    if (!coverFile) return null;
    setUploadingCover(true);
    try {
      const formData = new FormData();
      formData.append("file", coverFile);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) return null;
      const data = await res.json();
      return data.url;
    } catch {
      return null;
    } finally {
      setUploadingCover(false);
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddRecordForm>({
    resolver: zodResolver(addRecordSchema),
    defaultValues: { condition: "VG" },
  });

  async function onSubmit(data: AddRecordForm) {
    setFormValues(data);
    setStep("enriching");
    setEnrichError(null);

    try {
      const res = await fetch("/api/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artist: data.artist,
          title: data.title,
          year: data.year && !isNaN(data.year) ? data.year : undefined,
          label: data.label || undefined,
          catalogNumber: data.catalogNumber || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error("Enrichment failed");
      }

      const enriched = await res.json();
      setEnrichedData(enriched);
      setStep("review");
    } catch (err) {
      setEnrichError(
        "AI enrichment failed. You can save with basic info or try again."
      );
      setStep("input");
    }
  }

  async function handleConfirm(data: EnrichedRecord) {
    if (!formValues) return;
    setIsSubmitting(true);

    try {
      // Upload cover art if provided
      const uploadedCoverUrl = await uploadCover();

      // Try Spotify search
      let spotifyData = null;
      try {
        const spotRes = await fetch(
          `/api/spotify?action=search&artist=${encodeURIComponent(data.artist)}&album=${encodeURIComponent(data.full_title)}`
        );
        const spotJson = await spotRes.json();
        spotifyData = spotJson.result;
      } catch {
        // Spotify not connected or failed, that's fine
      }

      // User upload takes priority, then Spotify, then null
      const finalCoverArt = uploadedCoverUrl || spotifyData?.coverArt || null;

      const res = await fetch("/api/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.full_title,
          artist: data.artist,
          year: data.year,
          label: data.label,
          catalogNumber: data.catalog_number,
          genre: data.genre,
          condition: formValues.condition,
          coverArt: finalCoverArt,
          spotifyAlbumId: spotifyData?.id || null,
          spotifyUrl: spotifyData?.url || null,
          sideATracks: data.side_a_tracks,
          sideBTracks: data.side_b_tracks,
          producer: data.producer,
          studios: data.recording_studios,
          country: data.release_country,
          pressingInfo: data.pressing_info,
          funFacts: data.fun_facts,
          credits: data.personnel_credits,
          similarAlbums: data.recommended_if_you_like,
          userNotes: formValues.userNotes || null,
        }),
      });

      if (!res.ok) throw new Error("Save failed");

      const record = await res.json();
      router.push(`/vault/${record.id}`);
    } catch (err) {
      console.error("Save error:", err);
      setIsSubmitting(false);
    }
  }

  async function handleSaveBasic() {
    if (!formValues) return;
    await handleSaveBasicWithData(formValues);
  }

  async function handleSaveBasicWithData(data: AddRecordForm) {
    setIsSubmitting(true);
    try {
      const uploadedCoverUrl = await uploadCover();

      const res = await fetch("/api/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          artist: data.artist,
          year: data.year && !isNaN(data.year) ? data.year : null,
          label: data.label || null,
          catalogNumber: data.catalogNumber || null,
          condition: data.condition,
          coverArt: uploadedCoverUrl || null,
          userNotes: data.userNotes || null,
        }),
      });

      if (!res.ok) throw new Error("Save failed");
      const record = await res.json();
      router.push(`/vault/${record.id}`);
    } catch (err) {
      console.error("Save error:", err);
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back link */}
      <Link
        href="/vault"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-parchment transition-colors text-sm mb-6"
        style={{ fontFamily: "var(--font-body)" }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to The Vault
      </Link>

      <h1
        className="text-3xl text-parchment mb-8"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Add a Record
      </h1>

      <AnimatePresence mode="wait">
        {/* Step 1: Input Form */}
        {step === "input" && (
          <motion.div
            key="input"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {enrichError && (
              <div className="mb-6 p-4 bg-rust/10 border border-rust/30 rounded-lg">
                <p className="text-sm text-parchment" style={{ fontFamily: "var(--font-body)" }}>
                  {enrichError}
                </p>
                <button
                  onClick={handleSaveBasic}
                  disabled={isSubmitting}
                  className="mt-2 text-sm text-gold hover:underline"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Save with basic info only
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Artist */}
                <div>
                  <label
                    className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5"
                    style={{ fontFamily: "var(--font-label)" }}
                  >
                    Artist *
                  </label>
                  <input
                    {...register("artist")}
                    className="w-full bg-charcoal border border-border rounded-lg px-4 py-2.5 text-parchment text-sm focus:outline-none focus:border-gold/50"
                    style={{ fontFamily: "var(--font-body)" }}
                    placeholder="e.g. Miles Davis"
                  />
                  {errors.artist && (
                    <p className="text-xs text-rust mt-1">{errors.artist.message}</p>
                  )}
                </div>

                {/* Title */}
                <div>
                  <label
                    className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5"
                    style={{ fontFamily: "var(--font-label)" }}
                  >
                    Album Title *
                  </label>
                  <input
                    {...register("title")}
                    className="w-full bg-charcoal border border-border rounded-lg px-4 py-2.5 text-parchment text-sm focus:outline-none focus:border-gold/50"
                    style={{ fontFamily: "var(--font-body)" }}
                    placeholder="e.g. Kind of Blue"
                  />
                  {errors.title && (
                    <p className="text-xs text-rust mt-1">{errors.title.message}</p>
                  )}
                </div>

                {/* Year */}
                <div>
                  <label
                    className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5"
                    style={{ fontFamily: "var(--font-label)" }}
                  >
                    Year
                  </label>
                  <input
                    {...register("year", { valueAsNumber: true })}
                    type="number"
                    className="w-full bg-charcoal border border-border rounded-lg px-4 py-2.5 text-parchment text-sm focus:outline-none focus:border-gold/50"
                    style={{ fontFamily: "var(--font-body)" }}
                    placeholder="e.g. 1959"
                  />
                </div>

                {/* Label */}
                <div>
                  <label
                    className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5"
                    style={{ fontFamily: "var(--font-label)" }}
                  >
                    Record Label
                  </label>
                  <input
                    {...register("label")}
                    className="w-full bg-charcoal border border-border rounded-lg px-4 py-2.5 text-parchment text-sm focus:outline-none focus:border-gold/50"
                    style={{ fontFamily: "var(--font-body)" }}
                    placeholder="e.g. Columbia Records"
                  />
                </div>

                {/* Catalog Number */}
                <div>
                  <label
                    className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5"
                    style={{ fontFamily: "var(--font-label)" }}
                  >
                    Catalog Number
                  </label>
                  <input
                    {...register("catalogNumber")}
                    className="w-full bg-charcoal border border-border rounded-lg px-4 py-2.5 text-parchment text-sm focus:outline-none focus:border-gold/50"
                    style={{ fontFamily: "var(--font-body)" }}
                    placeholder="e.g. CL 1355"
                  />
                </div>

                {/* Condition */}
                <div>
                  <label
                    className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5"
                    style={{ fontFamily: "var(--font-label)" }}
                  >
                    Vinyl Condition
                  </label>
                  <select
                    {...register("condition")}
                    className="w-full bg-charcoal border border-border rounded-lg px-4 py-2.5 text-parchment text-sm focus:outline-none focus:border-gold/50"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {Object.entries(CONDITIONS).map(([key, val]) => (
                      <option key={key} value={key}>
                        {key} — {val.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Cover Art Upload */}
              <div>
                <label
                  className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5"
                  style={{ fontFamily: "var(--font-label)" }}
                >
                  Cover Art
                </label>
                {coverPreview ? (
                  <div className="relative w-48 h-48 rounded-lg overflow-hidden border border-border group">
                    <Image
                      src={coverPreview}
                      alt="Cover preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeCover}
                      className="absolute top-2 right-2 p-1 bg-black/70 rounded-full text-parchment opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/90"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-48 h-48 bg-charcoal border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-gold/40 hover:bg-charcoal-light transition-colors">
                    <ImagePlus className="w-8 h-8 text-muted-foreground mb-2" />
                    <span
                      className="text-xs text-muted-foreground"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      Upload album cover
                    </span>
                    <span
                      className="text-xs text-muted mt-1"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      JPG, PNG, WebP (max 10MB)
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleCoverSelect}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Notes */}
              <div>
                <label
                  className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5"
                  style={{ fontFamily: "var(--font-label)" }}
                >
                  Personal Notes
                </label>
                <textarea
                  {...register("userNotes")}
                  rows={3}
                  className="w-full bg-charcoal border border-border rounded-lg px-4 py-2.5 text-parchment text-sm focus:outline-none focus:border-gold/50 resize-none"
                  style={{ fontFamily: "var(--font-body)" }}
                  placeholder="Where you found it, what it means to you..."
                />
              </div>

              {/* Submit buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="flex items-center justify-center gap-3 px-8 py-3 bg-gold/15 border-2 border-gold/40 rounded-lg text-gold hover:bg-gold/25 hover:border-gold/60 transition-all"
                  style={{ fontFamily: "var(--font-label)", letterSpacing: "0.1em" }}
                >
                  <Sparkles className="w-5 h-5" />
                  ENRICH WITH AI & ADD
                </button>
                <button
                  type="button"
                  onClick={handleSubmit(async (data) => {
                    setFormValues(data);
                    await handleSaveBasicWithData(data);
                  })}
                  disabled={isSubmitting || uploadingCover}
                  className="flex items-center justify-center gap-2 px-8 py-3 bg-charcoal border border-border rounded-lg text-muted-foreground hover:text-parchment hover:border-border/80 transition-all disabled:opacity-50"
                  style={{ fontFamily: "var(--font-label)", letterSpacing: "0.1em" }}
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  SAVE WITHOUT AI
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Step 2: Enriching */}
        {step === "enriching" && (
          <motion.div
            key="enriching"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <svg
              width="80"
              height="80"
              viewBox="0 0 80 80"
              className="animate-spin-vinyl mb-6"
            >
              <circle cx="40" cy="40" r="38" fill="#1a1a1a" stroke="#2a2a2a" strokeWidth="2" />
              {Array.from({ length: 6 }).map((_, i) => (
                <circle
                  key={i}
                  cx="40"
                  cy="40"
                  r={14 + i * 4}
                  fill="none"
                  stroke="#222"
                  strokeWidth="0.5"
                  opacity={0.6}
                />
              ))}
              <circle cx="40" cy="40" r="12" fill="#c9a84c" opacity="0.9" />
              <circle cx="40" cy="40" r="2" fill="#1a0a0a" />
            </svg>
            <p
              className="text-parchment text-lg mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Consulting the archives...
            </p>
            <p className="text-muted-foreground text-sm" style={{ fontFamily: "var(--font-body)" }}>
              AI is researching your record&apos;s history and details
            </p>
          </motion.div>
        )}

        {/* Step 3: Review */}
        {step === "review" && enrichedData && (
          <motion.div
            key="review"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-charcoal border border-border rounded-lg p-6"
          >
            <EnrichmentReview
              data={enrichedData}
              onConfirm={handleConfirm}
              onCancel={() => {
                setStep("input");
                setEnrichedData(null);
              }}
              isSubmitting={isSubmitting}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
