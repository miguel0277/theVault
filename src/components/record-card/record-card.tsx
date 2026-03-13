"use client";

import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { VinylSpinner } from "@/components/vinyl-spinner/vinyl-spinner";
import { CONDITIONS } from "@/lib/utils";

interface RecordCardProps {
  record: {
    id: string;
    title: string;
    artist: string;
    year: number | null;
    label: string | null;
    condition: string;
    coverArt: string | null;
    spotifyUrl: string | null;
    genre: string[];
  };
}

export function RecordCard({ record }: RecordCardProps) {
  const genres = record.genre;
  const conditionInfo = CONDITIONS[record.condition] || CONDITIONS["VG"];

  return (
    <Link href={`/vault/${record.id}`}>
      <motion.div
        className="group relative bg-card border border-border rounded-lg overflow-hidden cursor-pointer"
        whileHover={{
          y: -8,
          scale: 1.02,
          boxShadow: "0 20px 40px rgba(201, 168, 76, 0.1)",
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Cover Art */}
        <div className="relative aspect-square bg-charcoal-light overflow-hidden">
          {record.coverArt ? (
            <Image
              src={record.coverArt}
              alt={`${record.artist} - ${record.title}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <VinylSpinner
                size={100}
                label={record.artist}
                spinning={false}
              />
            </div>
          )}

          {/* Vinyl peeking out on hover */}
          <div className="absolute -right-12 top-1/2 -translate-y-1/2 transition-transform duration-500 group-hover:translate-x-[-20px]">
            <VinylSpinner
              size={140}
              spinning
              className="opacity-0 group-hover:opacity-80 transition-opacity duration-500"
            />
          </div>

          {/* Spotify badge */}
          {record.spotifyUrl && (
            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <ExternalLink className="w-3.5 h-3.5 text-green-400" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3
                className="text-parchment font-semibold truncate text-base leading-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {record.title}
              </h3>
              <p
                className="text-parchment-dim text-sm truncate mt-0.5"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {record.artist}
              </p>
            </div>
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0 mt-1.5"
              style={{ backgroundColor: conditionInfo.color }}
              title={`${record.condition} — ${conditionInfo.label}`}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {record.year && (
                <span
                  className="text-gold text-lg leading-none"
                  style={{ fontFamily: "var(--font-label)" }}
                >
                  {record.year}
                </span>
              )}
              {record.label && (
                <span className="text-muted-foreground text-xs truncate max-w-[120px]">
                  {record.label}
                </span>
              )}
            </div>
          </div>

          {genres.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {genres.slice(0, 2).map((g) => (
                <span
                  key={g}
                  className="text-xs px-2 py-0.5 bg-charcoal-light border border-border rounded text-muted-foreground"
                >
                  {g}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
