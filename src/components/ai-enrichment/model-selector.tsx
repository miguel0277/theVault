"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Sparkles, Loader2, AlertCircle, Check, Zap } from "lucide-react";
import type { ModelStatus } from "@/lib/gemini-models";

interface ModelSelectorProps {
  onEnrich: (modelId: string) => void;
  disabled?: boolean;
}

export function ModelSelector({ onEnrich, disabled }: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const [models, setModels] = useState<ModelStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>("gemini-2.5-flash");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function fetchModels() {
    if (models.length > 0) return; // Already fetched
    setLoading(true);
    try {
      const res = await fetch("/api/models");
      if (res.ok) {
        const data = await res.json();
        setModels(data);
      }
    } catch {
      // Silently fail — models list will be empty and user can still use default
    } finally {
      setLoading(false);
    }
  }

  function handleToggle() {
    if (!open) {
      fetchModels();
    }
    setOpen(!open);
  }

  function handleSelect(modelId: string) {
    setSelectedModel(modelId);
    setOpen(false);
  }

  function handleEnrich() {
    onEnrich(selectedModel);
  }

  const selectedModelName =
    models.find((m) => m.id === selectedModel)?.name || "Gemini 2.5 Flash";

  return (
    <div className="flex items-stretch gap-0" ref={dropdownRef}>
      {/* Main enrich button */}
      <button
        type="button"
        onClick={handleEnrich}
        disabled={disabled}
        className="flex items-center justify-center gap-3 px-6 py-3 bg-gold/15 border-2 border-r-0 border-gold/40 rounded-l-lg text-gold hover:bg-gold/25 hover:border-gold/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ fontFamily: "var(--font-label)", letterSpacing: "0.1em" }}
      >
        <Sparkles className="w-5 h-5" />
        ENRICH WITH AI
      </button>

      {/* Dropdown toggle */}
      <div className="relative">
        <button
          type="button"
          onClick={handleToggle}
          disabled={disabled}
          className="flex items-center justify-center px-3 py-3 h-full bg-gold/15 border-2 border-gold/40 rounded-r-lg text-gold hover:bg-gold/25 hover:border-gold/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          title="Seleccionar modelo de IA"
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {/* Dropdown menu */}
        {open && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-charcoal border border-border rounded-lg shadow-2xl z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <p
                className="text-xs text-muted-foreground uppercase tracking-wider"
                style={{ fontFamily: "var(--font-label)" }}
              >
                Seleccionar modelo
              </p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center gap-2 py-6">
                <Loader2 className="w-4 h-4 animate-spin text-gold" />
                <span
                  className="text-sm text-muted-foreground"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Verificando disponibilidad...
                </span>
              </div>
            ) : (
              <div className="py-1">
                {models.map((model) => (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() => model.available && handleSelect(model.id)}
                    disabled={!model.available}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      model.available
                        ? "hover:bg-gold/10 cursor-pointer"
                        : "opacity-40 cursor-not-allowed"
                    } ${selectedModel === model.id ? "bg-gold/10" : ""}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-medium ${
                            model.available ? "text-parchment" : "text-muted-foreground line-through"
                          }`}
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {model.name}
                        </span>
                        {selectedModel === model.id && model.available && (
                          <Check className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                        )}
                      </div>
                      <span
                        className="text-xs text-muted-foreground"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {model.description}
                      </span>
                    </div>

                    {/* Status indicator */}
                    <div className="flex-shrink-0">
                      {model.available ? (
                        <span className="flex items-center gap-1 text-xs text-emerald-400">
                          <Zap className="w-3 h-3" />
                          Disponible
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-rust">
                          <AlertCircle className="w-3 h-3" />
                          Sin tokens
                        </span>
                      )}
                    </div>
                  </button>
                ))}

                {models.length === 0 && !loading && (
                  <div className="px-4 py-4 text-center">
                    <p
                      className="text-sm text-muted-foreground"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      No se pudo verificar los modelos.
                    </p>
                    <p
                      className="text-xs text-muted-foreground mt-1"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      Se usará el modelo por defecto.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Footer with selected model info */}
            {models.length > 0 && (
              <div className="px-4 py-2.5 border-t border-border bg-charcoal-light/30">
                <p
                  className="text-xs text-muted-foreground"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Modelo activo: <span className="text-gold">{selectedModelName}</span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
