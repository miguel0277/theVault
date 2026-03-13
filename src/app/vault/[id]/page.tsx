"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Edit3,
  Trash2,
  ExternalLink,
  Music,
  MapPin,
  Building,
  User,
  Disc3,
  Quote,
} from "lucide-react";
import { Tracklist } from "@/components/tracklist/tracklist";
import { VinylSpinner } from "@/components/vinyl-spinner/vinyl-spinner";
import { CONDITIONS } from "@/lib/utils";

interface RecordDetail {
  id: string;
  title: string;
  artist: string;
  year: number | null;
  label: string | null;
  catalogNumber: string | null;
  genre: string[];
  condition: string;
  coverArt: string | null;
  spotifyAlbumId: string | null;
  spotifyUrl: string | null;
  sideATracks: { position: string; title: string; duration: string }[] | null;
  sideBTracks: { position: string; title: string; duration: string }[] | null;
  producer: string | null;
  studios: string[];
  country: string | null;
  pressingInfo: string | null;
  funFacts: string[];
  credits: { name: string; role: string }[] | null;
  similarAlbums: string[];
  userNotes: string | null;
  createdAt: string;
}

export default function RecordDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [record, setRecord] = useState<RecordDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetch(`/api/records/${params.id}`)
        .then((r) => r.json())
        .then((data) => {
          setRecord(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [params.id]);

  async function handleDelete() {
    if (!confirm("Are you sure you want to remove this record from your vault?"))
      return;
    setDeleting(true);
    await fetch(`/api/records/${params.id}`, { method: "DELETE" });
    router.push("/vault");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <VinylSpinner size={60} spinning label="Loading" />
      </div>
    );
  }

  if (!record) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
          Record not found.
        </p>
        <Link href="/vault" className="text-gold hover:underline text-sm mt-4 inline-block">
          Back to The Vault
        </Link>
      </div>
    );
  }

  const genres = record.genre;
  const sideA = (record.sideATracks as { position: string; title: string; duration: string }[]) || [];
  const sideB = (record.sideBTracks as { position: string; title: string; duration: string }[]) || [];
  const studios = record.studios;
  const funFacts = record.funFacts;
  const credits = (record.credits as { name: string; role: string }[]) || [];
  const similarAlbums = record.similarAlbums;
  const conditionInfo = CONDITIONS[record.condition] || CONDITIONS["VG"];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <Link
        href="/vault"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-parchment transition-colors text-sm mb-6"
        style={{ fontFamily: "var(--font-body)" }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to The Vault
      </Link>

      {/* Gatefold Layout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-card border border-border rounded-lg overflow-hidden"
      >
        {/* LEFT PANEL */}
        <div className="p-8 border-b lg:border-b-0 lg:border-r border-border space-y-6">
          {/* Cover Art */}
          <div className="relative aspect-square bg-charcoal-light rounded-lg overflow-hidden border-double-rule">
            {record.coverArt ? (
              <Image
                src={record.coverArt}
                alt={`${record.artist} - ${record.title}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <VinylSpinner size={200} label={record.artist} />
              </div>
            )}
          </div>

          {/* Title & Artist */}
          <div>
            <h1
              className="text-3xl text-parchment leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {record.title}
            </h1>
            <p
              className="text-xl text-parchment-dim mt-1"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {record.artist}
            </p>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4">
            {record.year && (
              <span
                className="text-3xl text-gold"
                style={{ fontFamily: "var(--font-label)" }}
              >
                {record.year}
              </span>
            )}
            {record.label && (
              <span className="text-sm text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
                {record.label}
              </span>
            )}
            {record.catalogNumber && (
              <span
                className="text-xs text-muted px-2 py-0.5 border border-border rounded"
                style={{ fontFamily: "var(--font-label)" }}
              >
                {record.catalogNumber}
              </span>
            )}
          </div>

          {/* Condition badge */}
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: conditionInfo.color }}
            />
            <span className="text-sm text-parchment-dim" style={{ fontFamily: "var(--font-body)" }}>
              {record.condition} — {conditionInfo.label}
            </span>
          </div>

          {/* Genres */}
          {genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {genres.map((g) => (
                <span
                  key={g}
                  className="px-3 py-1 bg-gold/10 border border-gold/30 rounded text-gold text-xs"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {g}
                </span>
              ))}
            </div>
          )}

          {/* Spotify embed */}
          {record.spotifyAlbumId && (
            <div className="pt-2">
              <iframe
                src={`https://open.spotify.com/embed/album/${record.spotifyAlbumId}?theme=0`}
                width="100%"
                height="152"
                allow="encrypted-media"
                className="rounded-lg"
                style={{ border: 0 }}
              />
            </div>
          )}

          {/* User notes */}
          {record.userNotes && (
            <div className="p-4 bg-charcoal-light/50 border-l-2 border-amber rounded">
              <p className="text-xs text-muted-foreground uppercase mb-1" style={{ fontFamily: "var(--font-label)" }}>
                Personal Notes
              </p>
              <p className="text-sm text-parchment-dim" style={{ fontFamily: "var(--font-body)" }}>
                {record.userNotes}
              </p>
            </div>
          )}
        </div>

        {/* RIGHT PANEL — Liner Notes */}
        <div className="p-8 space-y-8 overflow-y-auto max-h-[calc(100vh-8rem)]">
          {/* Tracklist */}
          {(sideA.length > 0 || sideB.length > 0) && (
            <div className="space-y-6">
              <h2
                className="text-lg text-parchment uppercase tracking-wider"
                style={{ fontFamily: "var(--font-label)" }}
              >
                Tracklist
              </h2>
              <Tracklist side="A" tracks={sideA} />
              <Tracklist side="B" tracks={sideB} />
            </div>
          )}

          {/* Recording Info */}
          {(record.producer || studios.length > 0 || record.country) && (
            <div className="space-y-3">
              <h2
                className="text-lg text-parchment uppercase tracking-wider"
                style={{ fontFamily: "var(--font-label)" }}
              >
                Recording
              </h2>
              {record.producer && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-3.5 h-3.5 text-gold" />
                  <span className="text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
                    Produced by{" "}
                    <span className="text-parchment-dim">{record.producer}</span>
                  </span>
                </div>
              )}
              {studios.length > 0 && (
                <div className="flex items-start gap-2 text-sm">
                  <Building className="w-3.5 h-3.5 text-gold mt-0.5" />
                  <span className="text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
                    Recorded at{" "}
                    <span className="text-parchment-dim">{studios.join(", ")}</span>
                  </span>
                </div>
              )}
              {record.country && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-3.5 h-3.5 text-gold" />
                  <span className="text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
                    Released in{" "}
                    <span className="text-parchment-dim">{record.country}</span>
                  </span>
                </div>
              )}
              {record.pressingInfo && (
                <div className="flex items-center gap-2 text-sm">
                  <Disc3 className="w-3.5 h-3.5 text-gold" />
                  <span className="text-parchment-dim" style={{ fontFamily: "var(--font-body)" }}>
                    {record.pressingInfo}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Personnel Credits */}
          {credits.length > 0 && (
            <div className="space-y-3">
              <h2
                className="text-lg text-parchment uppercase tracking-wider"
                style={{ fontFamily: "var(--font-label)" }}
              >
                Personnel
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {credits.map((c, i) => (
                  <div
                    key={i}
                    className="text-xs text-muted-foreground"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    <span className="text-parchment-dim">{c.name}</span> — {c.role}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fun Facts — "The Story" */}
          {funFacts.length > 0 && (
            <div className="space-y-4">
              <h2
                className="text-lg text-parchment uppercase tracking-wider"
                style={{ fontFamily: "var(--font-label)" }}
              >
                The Story
              </h2>
              {funFacts.map((fact, i) => (
                <div
                  key={i}
                  className="flex gap-3 p-4 bg-charcoal-light/30 border-l-2 border-gold/30 rounded-r"
                >
                  <Quote className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                  <p
                    className="text-sm text-parchment-dim leading-relaxed"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {fact}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Similar Albums */}
          {similarAlbums.length > 0 && (
            <div className="space-y-3">
              <h2
                className="text-lg text-parchment uppercase tracking-wider"
                style={{ fontFamily: "var(--font-label)" }}
              >
                If You Like This
              </h2>
              <div className="flex flex-wrap gap-2">
                {similarAlbums.map((album, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-charcoal-light border border-border rounded text-xs text-parchment-dim"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {album}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Action Bar */}
      <div className="flex items-center justify-between mt-6 py-4 border-t border-border">
        <div className="flex items-center gap-3">
          {record.spotifyUrl && (
            <a
              href={record.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-green-900/20 border border-green-700/30 rounded text-green-400 text-sm hover:bg-green-900/30 transition-colors"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <Music className="w-4 h-4" />
              Open in Spotify
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 px-4 py-2 text-rust hover:text-red-400 transition-colors text-sm"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
