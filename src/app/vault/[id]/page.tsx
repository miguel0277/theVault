"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
  ImagePlus,
  X,
  Loader2,
  Save,
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

  // Edit modal state
  const [showEdit, setShowEdit] = useState(false);
  const [editCoverPreview, setEditCoverPreview] = useState<string | null>(null);
  const [editCoverFile, setEditCoverFile] = useState<File | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [editCondition, setEditCondition] = useState("");
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (params.id) {
      fetch(`/api/records/${params.id}`)
        .then((r) => r.json())
        .then((data) => {
          setRecord(data);
          setEditNotes(data.userNotes || "");
          setEditCondition(data.condition || "VG");
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [params.id]);

  async function handleDelete() {
    if (!confirm("¿Seguro que quieres eliminar este disco de tu colección?")) return;
    setDeleting(true);
    await fetch(`/api/records/${params.id}`, { method: "DELETE" });
    router.push("/vault");
  }

  function openEdit() {
    setEditCoverPreview(null);
    setEditCoverFile(null);
    setShowEdit(true);
  }

  function handleEditCoverSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditCoverFile(file);
    setEditCoverPreview(URL.createObjectURL(file));
  }

  async function handleSaveEdit() {
    if (!record) return;
    setSaving(true);

    try {
      let coverArtUrl = record.coverArt;

      // Upload new cover if selected
      if (editCoverFile) {
        const formData = new FormData();
        formData.append("file", editCoverFile);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          coverArtUrl = uploadData.url;
        }
      }

      const res = await fetch(`/api/records/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coverArt: coverArtUrl,
          userNotes: editNotes || null,
          condition: editCondition,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setRecord(updated);
        setShowEdit(false);
        if (editCoverPreview) URL.revokeObjectURL(editCoverPreview);
        setEditCoverPreview(null);
        setEditCoverFile(null);
      }
    } finally {
      setSaving(false);
    }
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
          <div className="relative aspect-square bg-charcoal-light rounded-lg overflow-hidden border-double-rule group">
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
            {/* Edit cover overlay */}
            <button
              onClick={openEdit}
              className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <div className="flex flex-col items-center gap-2 text-parchment">
                <ImagePlus className="w-8 h-8" />
                <span className="text-sm" style={{ fontFamily: "var(--font-label)" }}>
                  Cambiar carátula
                </span>
              </div>
            </button>
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
              <span className="text-3xl text-gold" style={{ fontFamily: "var(--font-label)" }}>
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
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: conditionInfo.color }} />
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
                Notas personales
              </p>
              <p className="text-sm text-parchment-dim" style={{ fontFamily: "var(--font-body)" }}>
                {record.userNotes}
              </p>
            </div>
          )}
        </div>

        {/* RIGHT PANEL — Liner Notes */}
        <div className="p-8 space-y-8 overflow-y-auto max-h-[calc(100vh-8rem)]">
          {(sideA.length > 0 || sideB.length > 0) && (
            <div className="space-y-6">
              <h2 className="text-lg text-parchment uppercase tracking-wider" style={{ fontFamily: "var(--font-label)" }}>
                Tracklist
              </h2>
              <Tracklist side="A" tracks={sideA} />
              <Tracklist side="B" tracks={sideB} />
            </div>
          )}

          {(record.producer || studios.length > 0 || record.country) && (
            <div className="space-y-3">
              <h2 className="text-lg text-parchment uppercase tracking-wider" style={{ fontFamily: "var(--font-label)" }}>
                Grabación
              </h2>
              {record.producer && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-3.5 h-3.5 text-gold" />
                  <span className="text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
                    Producido por <span className="text-parchment-dim">{record.producer}</span>
                  </span>
                </div>
              )}
              {studios.length > 0 && (
                <div className="flex items-start gap-2 text-sm">
                  <Building className="w-3.5 h-3.5 text-gold mt-0.5" />
                  <span className="text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
                    Grabado en <span className="text-parchment-dim">{studios.join(", ")}</span>
                  </span>
                </div>
              )}
              {record.country && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-3.5 h-3.5 text-gold" />
                  <span className="text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
                    Lanzado en <span className="text-parchment-dim">{record.country}</span>
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

          {credits.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg text-parchment uppercase tracking-wider" style={{ fontFamily: "var(--font-label)" }}>
                Personal
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {credits.map((c, i) => (
                  <div key={i} className="text-xs text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
                    <span className="text-parchment-dim">{c.name}</span> — {c.role}
                  </div>
                ))}
              </div>
            </div>
          )}

          {funFacts.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg text-parchment uppercase tracking-wider" style={{ fontFamily: "var(--font-label)" }}>
                La Historia
              </h2>
              {funFacts.map((fact, i) => (
                <div key={i} className="flex gap-3 p-4 bg-charcoal-light/30 border-l-2 border-gold/30 rounded-r">
                  <Quote className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                  <p className="text-sm text-parchment-dim leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                    {fact}
                  </p>
                </div>
              ))}
            </div>
          )}

          {similarAlbums.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg text-parchment uppercase tracking-wider" style={{ fontFamily: "var(--font-label)" }}>
                Si te gusta esto
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
              Abrir en Spotify
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={openEdit}
            className="flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/30 rounded text-gold text-sm hover:bg-gold/20 transition-colors"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <Edit3 className="w-4 h-4" />
            Editar
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 px-4 py-2 text-rust hover:text-red-400 transition-colors text-sm"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <Trash2 className="w-4 h-4" />
            Eliminar
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEdit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) setShowEdit(false); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-lg p-6 w-full max-w-md space-y-5"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-parchment text-lg" style={{ fontFamily: "var(--font-display)" }}>
                  Editar disco
                </h2>
                <button onClick={() => setShowEdit(false)} className="text-muted-foreground hover:text-parchment">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cover Art */}
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-label)" }}>
                  Carátula
                </p>
                <div className="flex items-start gap-4">
                  {/* Preview */}
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-charcoal-light border border-border shrink-0">
                    {editCoverPreview ? (
                      <Image src={editCoverPreview} alt="Preview" fill className="object-cover" />
                    ) : record.coverArt ? (
                      <Image src={record.coverArt} alt="Cover" fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <VinylSpinner size={50} spinning={false} />
                      </div>
                    )}
                  </div>
                  {/* Upload button */}
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2 bg-charcoal border border-border rounded text-parchment text-sm hover:border-gold/40 transition-colors"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      <ImagePlus className="w-4 h-4" />
                      {editCoverFile ? "Cambiar imagen" : "Subir carátula"}
                    </button>
                    {editCoverFile && (
                      <p className="text-xs text-muted-foreground truncate max-w-[160px]">
                        {editCoverFile.name}
                      </p>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleEditCoverSelect}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Condition */}
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-label)" }}>
                  Condición del vinilo
                </p>
                <select
                  value={editCondition}
                  onChange={(e) => setEditCondition(e.target.value)}
                  className="w-full bg-charcoal border border-border rounded-lg px-4 py-2.5 text-parchment text-sm focus:outline-none focus:border-gold/50"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {Object.entries(CONDITIONS).map(([key, val]) => (
                    <option key={key} value={key}>
                      {key} — {val.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-label)" }}>
                  Notas personales
                </p>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={3}
                  className="w-full bg-charcoal border border-border rounded-lg px-4 py-2.5 text-parchment text-sm focus:outline-none focus:border-gold/50 resize-none"
                  style={{ fontFamily: "var(--font-body)" }}
                  placeholder="Donde lo encontraste, qué significa para ti..."
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={handleSaveEdit}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gold/15 border border-gold/40 rounded text-gold hover:bg-gold/25 transition-colors text-sm disabled:opacity-50"
                  style={{ fontFamily: "var(--font-label)", letterSpacing: "0.05em" }}
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? "Guardando..." : "Guardar cambios"}
                </button>
                <button
                  onClick={() => setShowEdit(false)}
                  className="px-4 py-2.5 border border-border rounded text-muted-foreground hover:text-parchment transition-colors text-sm"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
