"use client";

import { useEffect, useState, useMemo } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { RecordCard } from "@/components/record-card/record-card";
import { EmptyCrate } from "@/components/empty-crate";
import { CONDITIONS, GENRES } from "@/lib/utils";

interface RecordData {
  id: string;
  title: string;
  artist: string;
  year: number | null;
  label: string | null;
  condition: string;
  coverArt: string | null;
  spotifyUrl: string | null;
  genre: string[];
}

export default function VaultPage() {
  const [records, setRecords] = useState<RecordData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [conditionFilter, setConditionFilter] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, []);

  async function fetchRecords() {
    try {
      const res = await fetch("/api/records");
      const data = await res.json();
      setRecords(data);
    } catch (err) {
      console.error("Failed to fetch records:", err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    let result = [...records];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.artist.toLowerCase().includes(q) ||
          (r.label && r.label.toLowerCase().includes(q))
      );
    }

    if (genreFilter) {
      result = result.filter((r) =>
        r.genre.some((g) =>
          g.toLowerCase().includes(genreFilter.toLowerCase())
        )
      );
    }

    if (conditionFilter) {
      result = result.filter((r) => r.condition === conditionFilter);
    }

    result.sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "artist") return a.artist.localeCompare(b.artist);
      if (sortBy === "year") return (b.year || 0) - (a.year || 0);
      return 0; // default: createdAt (already sorted from API)
    });

    return result;
  }, [records, search, genreFilter, conditionFilter, sortBy]);

  const hasActiveFilters = genreFilter || conditionFilter;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <svg
            width="60"
            height="60"
            viewBox="0 0 60 60"
            className="animate-spin-vinyl-slow"
          >
            <circle cx="30" cy="30" r="28" fill="#1a1a1a" stroke="#2a2a2a" strokeWidth="2" />
            <circle cx="30" cy="30" r="8" fill="#c9a84c" opacity="0.9" />
            <circle cx="30" cy="30" r="2" fill="#1a0a0a" />
          </svg>
          <span className="text-muted-foreground text-sm" style={{ fontFamily: "var(--font-body)" }}>
            Opening the vault...
          </span>
        </div>
      </div>
    );
  }

  if (records.length === 0) {
    return <EmptyCrate />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-3xl text-parchment mb-1"
          style={{ fontFamily: "var(--font-display)" }}
        >
          The Vault
        </h1>
        <p className="text-muted-foreground text-sm" style={{ fontFamily: "var(--font-body)" }}>
          {records.length} record{records.length !== 1 ? "s" : ""} in your collection
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="mb-6 space-y-3">
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by title, artist, or label..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-charcoal border border-border rounded-lg text-parchment text-sm placeholder:text-muted focus:outline-none focus:border-gold/50 transition-colors"
              style={{ fontFamily: "var(--font-body)" }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-parchment"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm transition-colors ${
              hasActiveFilters
                ? "border-gold/40 text-gold bg-gold/10"
                : "border-border text-muted-foreground hover:text-parchment hover:border-border"
            }`}
            style={{ fontFamily: "var(--font-body)" }}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Expanded Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-3 p-4 bg-charcoal border border-border rounded-lg">
                {/* Genre */}
                <div>
                  <label
                    className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5"
                    style={{ fontFamily: "var(--font-label)" }}
                  >
                    Genre
                  </label>
                  <select
                    value={genreFilter}
                    onChange={(e) => setGenreFilter(e.target.value)}
                    className="bg-charcoal-light border border-border rounded px-3 py-1.5 text-sm text-parchment"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    <option value="">All Genres</option>
                    {GENRES.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Condition */}
                <div>
                  <label
                    className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5"
                    style={{ fontFamily: "var(--font-label)" }}
                  >
                    Condition
                  </label>
                  <select
                    value={conditionFilter}
                    onChange={(e) => setConditionFilter(e.target.value)}
                    className="bg-charcoal-light border border-border rounded px-3 py-1.5 text-sm text-parchment"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    <option value="">All Conditions</option>
                    {Object.entries(CONDITIONS).map(([key, val]) => (
                      <option key={key} value={key}>
                        {key} — {val.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <label
                    className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5"
                    style={{ fontFamily: "var(--font-label)" }}
                  >
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-charcoal-light border border-border rounded px-3 py-1.5 text-sm text-parchment"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    <option value="createdAt">Recently Added</option>
                    <option value="title">Title</option>
                    <option value="artist">Artist</option>
                    <option value="year">Year</option>
                  </select>
                </div>

                {/* Clear */}
                {hasActiveFilters && (
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setGenreFilter("");
                        setConditionFilter("");
                      }}
                      className="text-xs text-gold hover:text-parchment transition-colors px-3 py-1.5"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results count when filtered */}
      {(search || hasActiveFilters) && (
        <p className="text-muted-foreground text-xs mb-4" style={{ fontFamily: "var(--font-body)" }}>
          Showing {filtered.length} of {records.length} records
        </p>
      )}

      {/* Grid */}
      {filtered.length > 0 ? (
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.05 } },
          }}
        >
          {filtered.map((record) => (
            <motion.div
              key={record.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <RecordCard record={record} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-20">
          <p className="text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
            No records match your search.
          </p>
        </div>
      )}
    </div>
  );
}
