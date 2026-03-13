"use client";

import { useState } from "react";
import { Loader2, Sparkles, Check, Edit3, ChevronDown, ChevronUp } from "lucide-react";
import type { EnrichedRecord } from "@/lib/claude";
import { Tracklist } from "@/components/tracklist/tracklist";

interface EnrichmentReviewProps {
  data: EnrichedRecord;
  onConfirm: (data: EnrichedRecord) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function EnrichmentReview({
  data,
  onConfirm,
  onCancel,
  isSubmitting = false,
}: EnrichmentReviewProps) {
  const [editedData, setEditedData] = useState<EnrichedRecord>(data);
  const [showCredits, setShowCredits] = useState(false);

  const updateField = <K extends keyof EnrichedRecord>(
    key: K,
    value: EnrichedRecord[K]
  ) => {
    setEditedData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <Sparkles className="w-5 h-5 text-gold" />
        <h3
          className="text-xl text-parchment"
          style={{ fontFamily: "var(--font-display)" }}
        >
          AI-Enriched Sleeve Notes
        </h3>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-wider" style={{ fontFamily: "var(--font-label)" }}>
            Title
          </label>
          <input
            className="w-full mt-1 bg-charcoal-light border border-border rounded px-3 py-2 text-parchment text-sm"
            style={{ fontFamily: "var(--font-body)" }}
            value={editedData.full_title}
            onChange={(e) => updateField("full_title", e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-wider" style={{ fontFamily: "var(--font-label)" }}>
            Artist
          </label>
          <input
            className="w-full mt-1 bg-charcoal-light border border-border rounded px-3 py-2 text-parchment text-sm"
            style={{ fontFamily: "var(--font-body)" }}
            value={editedData.artist}
            onChange={(e) => updateField("artist", e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-wider" style={{ fontFamily: "var(--font-label)" }}>
            Year
          </label>
          <input
            className="w-full mt-1 bg-charcoal-light border border-border rounded px-3 py-2 text-parchment text-sm"
            style={{ fontFamily: "var(--font-body)" }}
            type="number"
            value={editedData.year || ""}
            onChange={(e) =>
              updateField("year", e.target.value ? parseInt(e.target.value) : null)
            }
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-wider" style={{ fontFamily: "var(--font-label)" }}>
            Label
          </label>
          <input
            className="w-full mt-1 bg-charcoal-light border border-border rounded px-3 py-2 text-parchment text-sm"
            style={{ fontFamily: "var(--font-body)" }}
            value={editedData.label || ""}
            onChange={(e) => updateField("label", e.target.value || null)}
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-wider" style={{ fontFamily: "var(--font-label)" }}>
            Producer
          </label>
          <input
            className="w-full mt-1 bg-charcoal-light border border-border rounded px-3 py-2 text-parchment text-sm"
            style={{ fontFamily: "var(--font-body)" }}
            value={editedData.producer || ""}
            onChange={(e) => updateField("producer", e.target.value || null)}
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-wider" style={{ fontFamily: "var(--font-label)" }}>
            Country
          </label>
          <input
            className="w-full mt-1 bg-charcoal-light border border-border rounded px-3 py-2 text-parchment text-sm"
            style={{ fontFamily: "var(--font-body)" }}
            value={editedData.release_country || ""}
            onChange={(e) => updateField("release_country", e.target.value || null)}
          />
        </div>
      </div>

      {/* Genres */}
      <div>
        <label className="text-xs text-muted-foreground uppercase tracking-wider" style={{ fontFamily: "var(--font-label)" }}>
          Genres
        </label>
        <div className="flex flex-wrap gap-2 mt-2">
          {editedData.genre.map((g, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-gold/10 border border-gold/30 rounded text-gold text-xs"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {g}
            </span>
          ))}
        </div>
      </div>

      {/* Tracklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Tracklist side="A" tracks={editedData.side_a_tracks} />
        <Tracklist side="B" tracks={editedData.side_b_tracks} />
      </div>

      {/* Fun Facts */}
      {editedData.fun_facts.length > 0 && (
        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-wider" style={{ fontFamily: "var(--font-label)" }}>
            Fun Facts
          </label>
          <div className="mt-2 space-y-2">
            {editedData.fun_facts.map((fact, i) => (
              <div
                key={i}
                className="px-4 py-3 bg-charcoal-light/50 border-l-2 border-gold/40 text-sm text-parchment-dim"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {fact}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Credits toggle */}
      {editedData.personnel_credits.length > 0 && (
        <div>
          <button
            onClick={() => setShowCredits(!showCredits)}
            className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider hover:text-parchment transition-colors"
            style={{ fontFamily: "var(--font-label)" }}
          >
            Personnel Credits ({editedData.personnel_credits.length})
            {showCredits ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>
          {showCredits && (
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1">
              {editedData.personnel_credits.map((credit, i) => (
                <div
                  key={i}
                  className="text-xs text-muted-foreground"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  <span className="text-parchment-dim">{credit.name}</span>
                  {" — "}
                  {credit.role}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Similar Albums */}
      {editedData.recommended_if_you_like.length > 0 && (
        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-wider" style={{ fontFamily: "var(--font-label)" }}>
            If You Like This, Try
          </label>
          <div className="flex flex-wrap gap-2 mt-2">
            {editedData.recommended_if_you_like.map((album, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-charcoal-light border border-border rounded text-xs text-parchment-dim"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {album}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4 border-t border-border">
        <button
          onClick={() => onConfirm(editedData)}
          disabled={isSubmitting}
          className="flex items-center gap-2 px-6 py-2.5 bg-gold/20 border border-gold/40 rounded text-gold hover:bg-gold/30 transition-colors disabled:opacity-50"
          style={{ fontFamily: "var(--font-label)", letterSpacing: "0.1em" }}
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Check className="w-4 h-4" />
          )}
          SAVE TO VAULT
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-2.5 text-muted-foreground hover:text-parchment transition-colors text-sm"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Start over
        </button>
      </div>
    </div>
  );
}
