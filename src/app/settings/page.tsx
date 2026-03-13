"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Music, CheckCircle, XCircle, ExternalLink, Key } from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto px-4 py-8"><p className="text-muted-foreground text-sm">Loading settings...</p></div>}>
      <SettingsContent />
    </Suspense>
  );
}

function SettingsContent() {
  const searchParams = useSearchParams();
  const spotifyStatus = searchParams.get("spotify");
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/spotify?action=status")
      .then((r) => r.json())
      .then((data) => {
        setConnected(data.connected);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function connectSpotify() {
    const res = await fetch("/api/spotify?action=auth-url");
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1
        className="text-3xl text-parchment mb-8"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Settings
      </h1>

      {/* Notification */}
      {spotifyStatus === "connected" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-green-900/20 border border-green-700/30 rounded-lg flex items-center gap-3"
        >
          <CheckCircle className="w-5 h-5 text-green-400" />
          <p className="text-sm text-green-400" style={{ fontFamily: "var(--font-body)" }}>
            Spotify connected successfully!
          </p>
        </motion.div>
      )}
      {spotifyStatus === "error" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-rust/10 border border-rust/30 rounded-lg flex items-center gap-3"
        >
          <XCircle className="w-5 h-5 text-rust" />
          <p className="text-sm text-parchment" style={{ fontFamily: "var(--font-body)" }}>
            Failed to connect Spotify. Please try again.
          </p>
        </motion.div>
      )}

      {/* Spotify Section */}
      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Music className="w-5 h-5 text-green-400" />
          <h2
            className="text-xl text-parchment"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Spotify Integration
          </h2>
        </div>

        <p className="text-sm text-muted-foreground mb-6" style={{ fontFamily: "var(--font-body)" }}>
          Connect your Spotify account to automatically fetch album artwork,
          embed preview players, and link records to streaming. This is optional
          — your vault works perfectly without it.
        </p>

        {loading ? (
          <p className="text-sm text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
            Checking connection...
          </p>
        ) : connected ? (
          <div className="flex items-center gap-3 p-4 bg-green-900/10 border border-green-700/20 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-sm text-green-400" style={{ fontFamily: "var(--font-body)" }}>
              Spotify is connected
            </span>
          </div>
        ) : (
          <button
            onClick={connectSpotify}
            className="flex items-center gap-3 px-6 py-3 bg-green-900/20 border border-green-700/30 rounded-lg text-green-400 hover:bg-green-900/30 transition-colors"
            style={{ fontFamily: "var(--font-label)", letterSpacing: "0.05em" }}
          >
            <Music className="w-5 h-5" />
            CONNECT SPOTIFY
            <ExternalLink className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* API Key Info */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Key className="w-5 h-5 text-gold" />
          <h2
            className="text-xl text-parchment"
            style={{ fontFamily: "var(--font-display)" }}
          >
            AI Enrichment
          </h2>
        </div>

        <p className="text-sm text-muted-foreground mb-4" style={{ fontFamily: "var(--font-body)" }}>
          Record enrichment is powered by Claude AI. Set your API key in the{" "}
          <code className="px-1.5 py-0.5 bg-charcoal-light rounded text-xs text-parchment">.env</code>{" "}
          file:
        </p>

        <div className="p-4 bg-charcoal-light rounded-lg">
          <code className="text-xs text-gold" style={{ fontFamily: "var(--font-body)" }}>
            ANTHROPIC_API_KEY=sk-ant-...
          </code>
        </div>
      </div>
    </div>
  );
}
