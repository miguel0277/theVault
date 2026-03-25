export interface GeminiModel {
  id: string;
  name: string;
  description: string;
  endpoint: string;
}

export const GEMINI_MODELS: GeminiModel[] = [
  {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    description: "Rápido y eficiente",
    endpoint: "gemini-2.5-flash",
  },
  {
    id: "gemini-2.5-flash-lite",
    name: "Gemini 2.5 Flash Lite",
    description: "Ultra ligero",
    endpoint: "gemini-2.5-flash-lite",
  },
  {
    id: "gemini-3-flash",
    name: "Gemini 3 Flash",
    description: "Última generación",
    endpoint: "gemini-3-flash",
  },
  {
    id: "gemini-3.1-pro",
    name: "Gemini 3.1 Pro",
    description: "Mayor precisión",
    endpoint: "gemini-3.1-pro",
  },
  {
    id: "gemini-3.1-flash-lite",
    name: "Gemini 3.1 Flash Lite",
    description: "Ligero y rápido",
    endpoint: "gemini-3.1-flash-lite",
  },
];

export interface ModelStatus {
  id: string;
  name: string;
  description: string;
  available: boolean;
}
