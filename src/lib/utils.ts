import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseJsonField<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export const CONDITIONS: Record<string, { label: string; color: string }> = {
  NM: { label: "Near Mint", color: "#22c55e" },
  "VG+": { label: "Very Good Plus", color: "#84cc16" },
  VG: { label: "Very Good", color: "#c9a84c" },
  G: { label: "Good", color: "#f97316" },
  P: { label: "Poor", color: "#ef4444" },
};

export const GENRES = [
  "Rock",
  "Jazz",
  "Blues",
  "Soul",
  "Funk",
  "R&B",
  "Hip-Hop",
  "Electronic",
  "Classical",
  "Country",
  "Folk",
  "Reggae",
  "Punk",
  "Metal",
  "Pop",
  "Latin",
  "World",
  "Experimental",
  "Ambient",
  "Soundtrack",
];
