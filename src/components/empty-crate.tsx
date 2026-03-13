"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

export function EmptyCrate() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-4"
    >
      {/* Record Crate SVG */}
      <svg
        width="200"
        height="180"
        viewBox="0 0 200 180"
        fill="none"
        className="mb-8 opacity-60"
      >
        {/* Crate body */}
        <rect
          x="20"
          y="60"
          width="160"
          height="100"
          rx="4"
          stroke="#c9a84c"
          strokeWidth="2"
          fill="none"
          strokeDasharray="4 2"
        />
        {/* Crate slats */}
        <line x1="20" y1="90" x2="180" y2="90" stroke="#c9a84c" strokeWidth="1" opacity="0.4" />
        <line x1="20" y1="120" x2="180" y2="120" stroke="#c9a84c" strokeWidth="1" opacity="0.4" />

        {/* Records sticking out */}
        <rect x="45" y="30" width="3" height="40" rx="1" fill="#3d2f2a" />
        <rect x="55" y="25" width="3" height="45" rx="1" fill="#4d3f3a" />
        <rect x="65" y="35" width="3" height="35" rx="1" fill="#3d2f2a" />

        {/* Handle */}
        <path d="M 70 60 Q 100 40 130 60" stroke="#c9a84c" strokeWidth="2" fill="none" />

        {/* Label */}
        <rect x="60" y="100" width="80" height="30" rx="2" fill="#c9a84c" opacity="0.15" />
        <text x="100" y="120" textAnchor="middle" fill="#c9a84c" fontSize="10" fontFamily="var(--font-label)" letterSpacing="0.2em">
          EMPTY
        </text>
      </svg>

      <h2
        className="text-2xl text-parchment mb-2"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Your collection is waiting...
      </h2>
      <p
        className="text-muted-foreground text-sm mb-8 text-center max-w-md"
        style={{ fontFamily: "var(--font-body)" }}
      >
        Every great collection starts with a single record. Add your first vinyl
        and let the AI uncover its hidden stories.
      </p>

      <Link
        href="/vault/add"
        className="flex items-center gap-2 px-6 py-3 bg-gold/10 border-2 border-gold/40 rounded-lg text-gold hover:bg-gold/20 hover:border-gold/60 transition-all text-base"
        style={{ fontFamily: "var(--font-label)", letterSpacing: "0.1em" }}
      >
        <Plus className="w-5 h-5" />
        ADD YOUR FIRST RECORD
      </Link>
    </motion.div>
  );
}
