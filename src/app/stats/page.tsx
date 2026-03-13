"use client";

import { useEffect, useState } from "react";
import { Disc3, Users, Calendar, Shuffle } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface StatsData {
  totalRecords: number;
  totalArtists: number;
  yearRange: { min: number; max: number } | null;
  genreBreakdown: { name: string; value: number }[];
  decadeBreakdown: { name: string; value: number }[];
  topLabels: { name: string; value: number }[];
  topCountries: { name: string; value: number }[];
  randomRecord: { id: string; title: string; artist: string; year: number | null } | null;
}

const CHART_COLORS = [
  "#c9a84c",
  "#b45309",
  "#9a3412",
  "#7f1d1d",
  "#a88a3a",
  "#d4c4a0",
  "#78716c",
  "#f5e6c8",
  "#fef3e2",
  "#292524",
];

export default function StatsPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function refreshRandom() {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => setStats(data));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="text-muted-foreground text-sm" style={{ fontFamily: "var(--font-body)" }}>
          Crunching the numbers...
        </span>
      </div>
    );
  }

  if (!stats || stats.totalRecords === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1
          className="text-3xl text-parchment mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Stats
        </h1>
        <p className="text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
          Add some records to your vault to see your collection stats.
        </p>
        <Link
          href="/vault/add"
          className="inline-block mt-6 text-gold hover:underline text-sm"
        >
          Add your first record
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1
        className="text-3xl text-parchment mb-8"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Collection Stats
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-lg p-6 text-center"
        >
          <Disc3 className="w-6 h-6 text-gold mx-auto mb-2" />
          <p
            className="text-4xl text-parchment"
            style={{ fontFamily: "var(--font-label)" }}
          >
            {stats.totalRecords}
          </p>
          <p className="text-xs text-muted-foreground mt-1" style={{ fontFamily: "var(--font-body)" }}>
            Total Records
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-lg p-6 text-center"
        >
          <Users className="w-6 h-6 text-gold mx-auto mb-2" />
          <p
            className="text-4xl text-parchment"
            style={{ fontFamily: "var(--font-label)" }}
          >
            {stats.totalArtists}
          </p>
          <p className="text-xs text-muted-foreground mt-1" style={{ fontFamily: "var(--font-body)" }}>
            Artists
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-lg p-6 text-center"
        >
          <Calendar className="w-6 h-6 text-gold mx-auto mb-2" />
          <p
            className="text-4xl text-parchment"
            style={{ fontFamily: "var(--font-label)" }}
          >
            {stats.yearRange
              ? `${stats.yearRange.min}-${stats.yearRange.max}`
              : "—"}
          </p>
          <p className="text-xs text-muted-foreground mt-1" style={{ fontFamily: "var(--font-body)" }}>
            Year Range
          </p>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* Genre Breakdown */}
        {stats.genreBreakdown.length > 0 && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h2
              className="text-lg text-parchment uppercase tracking-wider mb-4"
              style={{ fontFamily: "var(--font-label)" }}
            >
              Genres
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.genreBreakdown.slice(0, 8)}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {stats.genreBreakdown.slice(0, 8).map((_, i) => (
                      <Cell
                        key={i}
                        fill={CHART_COLORS[i % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1c1917",
                      border: "1px solid #3d2f2a",
                      borderRadius: "8px",
                      fontFamily: "var(--font-body)",
                      fontSize: "12px",
                      color: "#f5e6c8",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {stats.genreBreakdown.slice(0, 8).map((g, i) => (
                <span
                  key={g.name}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                    }}
                  />
                  {g.name} ({g.value})
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Decades */}
        {stats.decadeBreakdown.length > 0 && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h2
              className="text-lg text-parchment uppercase tracking-wider mb-4"
              style={{ fontFamily: "var(--font-label)" }}
            >
              By Decade
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.decadeBreakdown}>
                  <XAxis
                    dataKey="name"
                    tick={{
                      fill: "#a8a29e",
                      fontSize: 11,
                      fontFamily: "var(--font-label)",
                    }}
                    axisLine={{ stroke: "#3d2f2a" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{
                      fill: "#a8a29e",
                      fontSize: 11,
                      fontFamily: "var(--font-label)",
                    }}
                    axisLine={{ stroke: "#3d2f2a" }}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1c1917",
                      border: "1px solid #3d2f2a",
                      borderRadius: "8px",
                      fontFamily: "var(--font-body)",
                      fontSize: "12px",
                      color: "#f5e6c8",
                    }}
                  />
                  <Bar dataKey="value" fill="#c9a84c" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Labels */}
        {stats.topLabels.length > 0 && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h2
              className="text-lg text-parchment uppercase tracking-wider mb-4"
              style={{ fontFamily: "var(--font-label)" }}
            >
              Top Labels
            </h2>
            <div className="space-y-2">
              {stats.topLabels.slice(0, 5).map((l, i) => (
                <div key={l.name} className="flex items-center justify-between">
                  <span className="text-sm text-parchment-dim truncate" style={{ fontFamily: "var(--font-body)" }}>
                    {l.name}
                  </span>
                  <span
                    className="text-gold text-lg"
                    style={{ fontFamily: "var(--font-label)" }}
                  >
                    {l.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Countries */}
        {stats.topCountries.length > 0 && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h2
              className="text-lg text-parchment uppercase tracking-wider mb-4"
              style={{ fontFamily: "var(--font-label)" }}
            >
              Pressing Countries
            </h2>
            <div className="space-y-2">
              {stats.topCountries.slice(0, 5).map((c) => (
                <div key={c.name} className="flex items-center justify-between">
                  <span className="text-sm text-parchment-dim" style={{ fontFamily: "var(--font-body)" }}>
                    {c.name}
                  </span>
                  <span
                    className="text-gold text-lg"
                    style={{ fontFamily: "var(--font-label)" }}
                  >
                    {c.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Random Pick */}
        {stats.randomRecord && (
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-lg text-parchment uppercase tracking-wider"
                style={{ fontFamily: "var(--font-label)" }}
              >
                Listening Mood
              </h2>
              <button
                onClick={refreshRandom}
                className="text-gold hover:text-parchment transition-colors"
                title="Shuffle"
              >
                <Shuffle className="w-4 h-4" />
              </button>
            </div>
            <Link
              href={`/vault/${stats.randomRecord.id}`}
              className="block group"
            >
              <p className="text-muted-foreground text-xs mb-3" style={{ fontFamily: "var(--font-body)" }}>
                Why not spin this one tonight?
              </p>
              <p
                className="text-parchment text-lg group-hover:text-gold transition-colors"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {stats.randomRecord.title}
              </p>
              <p className="text-parchment-dim text-sm" style={{ fontFamily: "var(--font-body)" }}>
                {stats.randomRecord.artist}
                {stats.randomRecord.year ? ` (${stats.randomRecord.year})` : ""}
              </p>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
