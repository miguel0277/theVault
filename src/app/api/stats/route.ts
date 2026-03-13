import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const records = await prisma.record.findMany();

  const totalRecords = records.length;
  const artists = new Set(records.map((r) => r.artist));
  const totalArtists = artists.size;

  const years = records.map((r) => r.year).filter((y): y is number => y !== null);
  const yearRange =
    years.length > 0
      ? { min: Math.min(...years), max: Math.max(...years) }
      : null;

  // Genre breakdown
  const genreCounts: Record<string, number> = {};
  records.forEach((r) => {
    r.genre.forEach((g) => {
      genreCounts[g] = (genreCounts[g] || 0) + 1;
    });
  });

  const genreBreakdown = Object.entries(genreCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Decade breakdown
  const decadeCounts: Record<string, number> = {};
  years.forEach((y) => {
    const decade = `${Math.floor(y / 10) * 10}s`;
    decadeCounts[decade] = (decadeCounts[decade] || 0) + 1;
  });

  const decadeBreakdown = Object.entries(decadeCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => a.name.localeCompare(b.name));

  // Label counts
  const labelCounts: Record<string, number> = {};
  records.forEach((r) => {
    if (r.label) {
      labelCounts[r.label] = (labelCounts[r.label] || 0) + 1;
    }
  });

  const topLabels = Object.entries(labelCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  // Country counts
  const countryCounts: Record<string, number> = {};
  records.forEach((r) => {
    if (r.country) {
      countryCounts[r.country] = (countryCounts[r.country] || 0) + 1;
    }
  });

  const topCountries = Object.entries(countryCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  // Random recommendation
  const randomRecord =
    records.length > 0
      ? records[Math.floor(Math.random() * records.length)]
      : null;

  return NextResponse.json({
    totalRecords,
    totalArtists,
    yearRange,
    genreBreakdown,
    decadeBreakdown,
    topLabels,
    topCountries,
    randomRecord,
  });
}
