"use client";

interface Track {
  position: string;
  title: string;
  duration: string;
}

interface TracklistProps {
  side: "A" | "B";
  tracks: Track[];
}

export function Tracklist({ side, tracks }: TracklistProps) {
  if (!tracks || tracks.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="vintage-separator">Side {side}</div>
      <div className="space-y-1">
        {tracks.map((track, i) => (
          <div
            key={i}
            className="flex items-baseline justify-between py-1.5 border-b border-border/30 last:border-0 group"
          >
            <div className="flex items-baseline gap-3 min-w-0">
              <span
                className="text-gold text-sm w-6 shrink-0"
                style={{ fontFamily: "var(--font-label)" }}
              >
                {track.position}
              </span>
              <span
                className="text-parchment text-sm truncate"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {track.title}
              </span>
            </div>
            <span
              className="text-muted-foreground text-xs ml-4 shrink-0"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {track.duration}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
