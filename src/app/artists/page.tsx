"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic2, Disc3, Sparkles, ChevronDown, MapPin, Calendar, Loader2 } from "lucide-react";
import Link from "next/link";
import type { ArtistInfo } from "@/app/api/artist-info/route";

interface ArtistAlbum {
  id: string;
  title: string;
  year: number | null;
  coverArt: string | null;
}

interface Artist {
  name: string;
  albums: ArtistAlbum[];
  genres: string[];
  albumCount: number;
}

type InfoState = "idle" | "loading" | "done" | "error";

export default function ArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedArtist, setExpandedArtist] = useState<string | null>(null);
  const [artistInfoMap, setArtistInfoMap] = useState<Record<string, ArtistInfo>>({});
  const [infoStateMap, setInfoStateMap] = useState<Record<string, InfoState>>({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/artists")
      .then((r) => r.json())
      .then((data) => {
        setArtists(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function fetchArtistInfo(artist: Artist) {
    if (artistInfoMap[artist.name] || infoStateMap[artist.name] === "loading") return;

    setInfoStateMap((prev) => ({ ...prev, [artist.name]: "loading" }));

    try {
      const res = await fetch("/api/artist-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artist: artist.name,
          genres: artist.genres,
          albums: artist.albums.map((a) => ({ title: a.title, year: a.year })),
        }),
      });

      if (!res.ok) throw new Error("API error");
      const info: ArtistInfo = await res.json();
      setArtistInfoMap((prev) => ({ ...prev, [artist.name]: info }));
      setInfoStateMap((prev) => ({ ...prev, [artist.name]: "done" }));
    } catch {
      setInfoStateMap((prev) => ({ ...prev, [artist.name]: "error" }));
    }
  }

  function toggleArtist(artist: Artist) {
    if (expandedArtist === artist.name) {
      setExpandedArtist(null);
    } else {
      setExpandedArtist(artist.name);
      fetchArtistInfo(artist);
    }
  }

  const filtered = artists.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <svg width="60" height="60" viewBox="0 0 60 60" className="animate-spin-vinyl-slow">
            <circle cx="30" cy="30" r="28" fill="#1a1a1a" stroke="#2a2a2a" strokeWidth="2" />
            <circle cx="30" cy="30" r="8" fill="#c9a84c" opacity="0.9" />
            <circle cx="30" cy="30" r="2" fill="#1a0a0a" />
          </svg>
          <span
            className="text-muted-foreground text-sm"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Cargando artistas...
          </span>
        </div>
      </div>
    );
  }

  if (artists.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <Mic2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" strokeWidth={1} />
        <h1
          className="text-3xl text-parchment mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Sin artistas
        </h1>
        <p className="text-muted-foreground mb-6" style={{ fontFamily: "var(--font-body)" }}>
          Agrega discos a tu colección para ver los artistas aquí.
        </p>
        <Link
          href="/vault/add"
          className="inline-block text-gold hover:underline text-sm"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Agregar mi primer disco
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Mic2 className="w-6 h-6 text-gold" strokeWidth={1.5} />
          <h1
            className="text-3xl text-parchment"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Artistas
          </h1>
        </div>
        <p
          className="text-muted-foreground text-sm"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {artists.length} artista{artists.length !== 1 ? "s" : ""} en tu colección
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar artista..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm px-4 py-2.5 bg-charcoal border border-border rounded-lg text-parchment text-sm placeholder:text-muted focus:outline-none focus:border-gold/50 transition-colors"
          style={{ fontFamily: "var(--font-body)" }}
        />
      </div>

      {/* Artist cards */}
      <div className="space-y-3">
        {filtered.map((artist, i) => {
          const isExpanded = expandedArtist === artist.name;
          const info = artistInfoMap[artist.name];
          const infoState = infoStateMap[artist.name] ?? "idle";
          const coverArt = artist.albums.find((a) => a.coverArt)?.coverArt;

          return (
            <motion.div
              key={artist.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-card border border-border rounded-lg overflow-hidden"
            >
              {/* Artist header — clickable */}
              <button
                onClick={() => toggleArtist(artist)}
                className="w-full text-left p-5 hover:bg-charcoal-light/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar — cover art or vinyl placeholder */}
                  <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-border bg-charcoal flex items-center justify-center">
                    {coverArt ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={coverArt}
                        alt={artist.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg width="40" height="40" viewBox="0 0 40 40">
                        <circle cx="20" cy="20" r="19" fill="#1a1a1a" stroke="#2a2a2a" strokeWidth="1.5" />
                        <circle cx="20" cy="20" r="6" fill="#c9a84c" opacity="0.7" />
                        <circle cx="20" cy="20" r="2" fill="#1a0a0a" />
                      </svg>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h2
                      className="text-lg text-parchment truncate"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {artist.name}
                    </h2>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {artist.genres.slice(0, 4).map((g) => (
                        <span
                          key={g}
                          className="text-xs px-2 py-0.5 bg-charcoal border border-border/50 rounded text-parchment-dim"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right hidden sm:block">
                      <p
                        className="text-gold text-lg"
                        style={{ fontFamily: "var(--font-label)" }}
                      >
                        {artist.albumCount}
                      </p>
                      <p
                        className="text-muted-foreground text-xs"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {artist.albumCount === 1 ? "disco" : "discos"}
                      </p>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-muted-foreground transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>
              </button>

              {/* Expanded content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-border/50">
                      {/* Albums in collection */}
                      <div className="p-5 pb-0">
                        <p
                          className="text-xs text-muted-foreground uppercase tracking-wider mb-3"
                          style={{ fontFamily: "var(--font-label)" }}
                        >
                          En tu colección
                        </p>
                        <div className="flex flex-wrap gap-2 mb-5">
                          {artist.albums.map((album) => (
                            <Link
                              key={album.id}
                              href={`/vault/${album.id}`}
                              className="flex items-center gap-2 px-3 py-1.5 bg-charcoal border border-border/50 rounded hover:border-gold/40 hover:text-gold transition-colors group"
                            >
                              <Disc3
                                className="w-3 h-3 text-muted-foreground group-hover:text-gold transition-colors"
                                strokeWidth={1.5}
                              />
                              <span
                                className="text-xs text-parchment-dim group-hover:text-gold transition-colors"
                                style={{ fontFamily: "var(--font-body)" }}
                              >
                                {album.title}
                                {album.year ? ` (${album.year})` : ""}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* AI Info section */}
                      <div className="px-5 pb-5">
                        {infoState === "idle" && (
                          <div className="flex items-center justify-center py-4">
                            <Loader2 className="w-5 h-5 text-gold animate-spin" />
                          </div>
                        )}

                        {infoState === "loading" && (
                          <div className="flex items-center gap-2 text-muted-foreground text-sm py-4">
                            <Loader2 className="w-4 h-4 animate-spin text-gold" />
                            <span style={{ fontFamily: "var(--font-body)" }}>
                              Consultando la IA...
                            </span>
                          </div>
                        )}

                        {infoState === "error" && (
                          <div className="text-sm text-muted-foreground py-2" style={{ fontFamily: "var(--font-body)" }}>
                            No se pudo cargar la información del artista.
                          </div>
                        )}

                        {infoState === "done" && info && (
                          <div className="space-y-4">
                            {/* Meta: origin + years */}
                            <div className="flex flex-wrap gap-4">
                              {info.origin && (
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                  <MapPin className="w-3.5 h-3.5 text-gold" />
                                  <span style={{ fontFamily: "var(--font-body)" }}>
                                    {info.origin}
                                  </span>
                                </div>
                              )}
                              {info.activeYears && (
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                  <Calendar className="w-3.5 h-3.5 text-gold" />
                                  <span style={{ fontFamily: "var(--font-body)" }}>
                                    {info.activeYears}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Biography */}
                            {info.biography && (
                              <p
                                className="text-sm text-parchment-dim leading-relaxed"
                                style={{ fontFamily: "var(--font-body)" }}
                              >
                                {info.biography}
                              </p>
                            )}

                            {/* Influence */}
                            {info.influence && (
                              <div className="border-l-2 border-gold/40 pl-3">
                                <p
                                  className="text-xs text-parchment-dim italic"
                                  style={{ fontFamily: "var(--font-body)" }}
                                >
                                  {info.influence}
                                </p>
                              </div>
                            )}

                            {/* Fun facts */}
                            {info.funFacts && info.funFacts.length > 0 && (
                              <div>
                                <div className="flex items-center gap-1.5 mb-2">
                                  <Sparkles className="w-3.5 h-3.5 text-gold" />
                                  <p
                                    className="text-xs text-muted-foreground uppercase tracking-wider"
                                    style={{ fontFamily: "var(--font-label)" }}
                                  >
                                    Datos curiosos
                                  </p>
                                </div>
                                <ul className="space-y-1.5">
                                  {info.funFacts.map((fact, fi) => (
                                    <li
                                      key={fi}
                                      className="flex items-start gap-2 text-xs text-parchment-dim"
                                      style={{ fontFamily: "var(--font-body)" }}
                                    >
                                      <span className="text-gold mt-0.5 shrink-0">·</span>
                                      {fact}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Key albums */}
                            {info.keyAlbums && info.keyAlbums.length > 0 && (
                              <div>
                                <p
                                  className="text-xs text-muted-foreground uppercase tracking-wider mb-2"
                                  style={{ fontFamily: "var(--font-label)" }}
                                >
                                  Discos clave
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {info.keyAlbums.map((album, ai) => (
                                    <span
                                      key={ai}
                                      className="text-xs px-2.5 py-1 bg-gold/5 border border-gold/20 rounded text-gold/80"
                                      style={{ fontFamily: "var(--font-body)" }}
                                    >
                                      {album}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-sm" style={{ fontFamily: "var(--font-body)" }}>
            No se encontró ningún artista con ese nombre.
          </p>
        </div>
      )}
    </div>
  );
}
