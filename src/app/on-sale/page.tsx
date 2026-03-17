"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Globe, Instagram, ChevronDown, Tag, Music } from "lucide-react";

interface Store {
  id: string;
  name: string;
  city: string;
  neighborhood: string;
  type: "tienda" | "mercado" | "online" | "mixto";
  description: string;
  specialty: string[];
  priceRange: string;
  instagram?: string;
  website?: string;
  tips: string;
  open: string;
}

interface VinylListing {
  artist: string;
  title: string;
  year: number;
  genre: string;
  price: string;
  condition: string;
  storeId: string;
  notes: string;
}

const STORES: Store[] = [
  {
    id: "el-virrey",
    name: "Discos El Virrey",
    city: "Bogotá",
    neighborhood: "Centro Histórico",
    type: "tienda",
    description:
      "Una de las tiendas de discos más emblemáticas y longevas de Bogotá. Lleva décadas siendo punto de referencia para coleccionistas. Mezcla de LPs nacionales e importados, con secciones dedicadas a cumbia, vallenato, salsa y rock clásico.",
    specialty: ["Salsa", "Cumbia", "Rock Clásico", "Vallenato", "Bolero"],
    priceRange: "$15.000 – $120.000 COP",
    instagram: "@discosdelvirrey",
    tips:
      "Llega temprano los fines de semana. El dueño conoce cada disco y puede ayudarte a encontrar prensajes específicos.",
    open: "Lun–Sáb 9am–6pm",
  },
  {
    id: "luma",
    name: "Luma Records",
    city: "Bogotá",
    neighborhood: "Chapinero / La Macarena",
    type: "tienda",
    description:
      "Tienda moderna con curaduría enfocada en jazz, soul, rock alternativo y música electrónica. Buen stock de importados europeos y japoneses. Espacio agradable para escuchar antes de comprar.",
    specialty: ["Jazz", "Soul", "Rock Alternativo", "Electrónica", "Hip-Hop"],
    priceRange: "$40.000 – $250.000 COP",
    instagram: "@lumarecordsbogota",
    tips:
      "Tienen sesiones de escucha los sábados por la tarde. Ideal para encontrar prensajes japoneses audiófilos.",
    open: "Mar–Dom 11am–7pm",
  },
  {
    id: "san-alejo",
    name: "Mercado de las Pulgas San Alejo",
    city: "Bogotá",
    neighborhood: "Carrera 7 con Calle 24",
    type: "mercado",
    description:
      "El mercado de pulgas más grande y antiguo de Bogotá. Cada primer domingo del mes encontrarás entre 5 y 10 puestos de discos de vinilo con precios muy accesibles. El paraíso del crate digger. Hay que llegar antes de las 9am para las mejores piezas.",
    specialty: ["Todo", "Rock", "Pop Latino", "Salsa", "Clásica", "Balada"],
    priceRange: "$5.000 – $60.000 COP",
    tips:
      "Solo el primer domingo de cada mes. Llega muy temprano (7–8am). Negocia con respeto, los precios son flexibles.",
    open: "1er domingo del mes, 7am–3pm",
  },
  {
    id: "vinilico",
    name: "Vinílico",
    city: "Medellín",
    neighborhood: "Laureles / El Poblado",
    type: "tienda",
    description:
      "Tienda dedicada exclusivamente al vinilo en Medellín. Excelente selección de rock latinoamericano, vallenato clásico y soul. El dueño es coleccionista con décadas de experiencia y puede orientarte sobre prensajes colombianos originales.",
    specialty: ["Rock Latinoamericano", "Vallenato", "Soul", "Funk", "Porro"],
    priceRange: "$20.000 – $180.000 COP",
    instagram: "@vinilico.mde",
    tips:
      "Pregunta por los prensajes colombianos originales, tienen rarezas locales difíciles de conseguir en otro lado.",
    open: "Lun–Sáb 10am–6:30pm",
  },
  {
    id: "parque-periodista",
    name: "Zona del Parque del Periodista",
    city: "Medellín",
    neighborhood: "El Centro",
    type: "mercado",
    description:
      "El barrio alternativo de Medellín concentra varios puestos de discos en la calle y pequeñas tiendas de segunda mano. Ideal para encontrar discos de rock, punk, metal y nueva ola a precios populares. Ambiente bohemio y cultural.",
    specialty: ["Rock", "Punk", "Metal", "Nueva Ola", "Alternativo"],
    priceRange: "$10.000 – $50.000 COP",
    tips:
      "Recorre la zona completa antes de comprar. Los puestos de calle suelen tener las mejores sorpresas sin limpiar.",
    open: "Jue–Dom 10am–7pm (variable)",
  },
  {
    id: "galeria-cafe",
    name: "Galería Café Libro",
    city: "Bogotá",
    neighborhood: "La Candelaria",
    type: "mixto",
    description:
      "Espacio cultural que combina café, librería y una pequeña pero bien curada sección de vinilos. Foco en jazz, bossa nova, tango y música del mundo. Organizan noches de vinilo y tertulias musicales frecuentemente.",
    specialty: ["Jazz", "Bossa Nova", "Tango", "World Music", "Clásica"],
    priceRange: "$35.000 – $150.000 COP",
    instagram: "@galeriacafelibro",
    tips:
      "Ven en la noche cuando hay eventos: el ambiente es inigualable y a veces venden discos de colección de los artistas invitados.",
    open: "Lun–Sáb 9am–9pm",
  },
  {
    id: "musiquero",
    name: "Musiquero Colombia",
    city: "Online",
    neighborhood: "Envíos a todo el país",
    type: "online",
    description:
      "Tienda online con uno de los catálogos más amplios de Colombia. Especializada en música colombiana y latinoamericana en vinilo. Tienen sección de importados y ofrecen vinilo nuevo y de segunda mano. Excelente para conseguir cumbia, gaita y champeta en vinilo.",
    specialty: ["Cumbia", "Gaita", "Champeta", "Salsa", "Música colombiana"],
    priceRange: "$25.000 – $200.000 COP + envío",
    instagram: "@musiquero.col",
    website: "musiquero.co",
    tips:
      "Revisa su Instagram con frecuencia, suben novedades constantemente. El envío llega bien empacado.",
    open: "Pedidos online 24/7 / Atención Lun–Vie",
  },
  {
    id: "la-tienda-musica",
    name: "La Tienda de la Música",
    city: "Cali",
    neighborhood: "San Antonio",
    type: "tienda",
    description:
      "En la ciudad de la salsa no podía faltar una tienda de referencia. Especializada en salsa caleña, guaracha cubana y música tropical. Encontrarás prensajes originales de Fruko y sus Tesos, La Sonora Matancera y discos de Discos Fuentes.",
    specialty: ["Salsa Caleña", "Guaracha", "Tropical", "Cumbia", "Fania"],
    priceRange: "$20.000 – $160.000 COP",
    instagram: "@latiendadelamusica.cali",
    tips:
      "Los prensajes de Discos Fuentes (sello bogotano) son los más buscados. Pregunta específicamente por ellos.",
    open: "Lun–Sáb 9am–7pm",
  },
];

const LISTINGS: VinylListing[] = [
  {
    artist: "Fruko y sus Tesos",
    title: "El Preso",
    year: 1975,
    genre: "Salsa",
    price: "$35.000",
    condition: "VG",
    storeId: "la-tienda-musica",
    notes: "Prensaje colombiano original Discos Fuentes. Etiqueta naranja primera edición.",
  },
  {
    artist: "Los Corraleros de Majagual",
    title: "El Negro Bembón",
    year: 1968,
    genre: "Cumbia / Porro",
    price: "$45.000",
    condition: "VG+",
    storeId: "el-virrey",
    notes: "Clásico indispensable de la cumbia colombiana. Difícil de encontrar en buen estado.",
  },
  {
    artist: "Miles Davis",
    title: "Kind of Blue",
    year: 1959,
    genre: "Jazz",
    price: "$120.000",
    condition: "VG+",
    storeId: "luma",
    notes: "Reedición 180g de alta calidad. Sonido excepcional.",
  },
  {
    artist: "Carlos Vives",
    title: "Clásicos de la Provincia",
    year: 1993,
    genre: "Vallenato Rock",
    price: "$55.000",
    condition: "NM",
    storeId: "vinilico",
    notes: "El disco que cambió el vallenato. Prensaje colombiano original. Muy buen estado.",
  },
  {
    artist: "Soda Stereo",
    title: "Signos",
    year: 1986,
    genre: "Rock",
    price: "$80.000",
    condition: "VG+",
    storeId: "san-alejo",
    notes: "Prensaje argentino original. Icono del rock en español.",
  },
  {
    artist: "La Sonora Matancera",
    title: "Canta Celia Cruz",
    year: 1957,
    genre: "Son / Guaracha",
    price: "$70.000",
    condition: "VG",
    storeId: "la-tienda-musica",
    notes: "Disco histórico. La Guarachera de Cuba en su máximo esplendor.",
  },
  {
    artist: "Aterciopelados",
    title: "El Dorado",
    year: 1995,
    genre: "Rock Alternativo",
    price: "$65.000",
    condition: "VG+",
    storeId: "vinilico",
    notes: "El álbum más representativo del rock colombiano de los 90. Prensaje nacional.",
  },
  {
    artist: "John Coltrane",
    title: "A Love Supreme",
    year: 1965,
    genre: "Jazz",
    price: "$145.000",
    condition: "NM",
    storeId: "luma",
    notes: "Reedición audiófila Impulse!. Masterización impecable.",
  },
  {
    artist: "Niche",
    title: "Con el Corazón Abierto",
    year: 1990,
    genre: "Salsa",
    price: "$50.000",
    condition: "VG",
    storeId: "la-tienda-musica",
    notes: "Prensaje colombiano del Grupo Niche. Muy solicitado por los caleños.",
  },
  {
    artist: "Shakira",
    title: "Pies Descalzos",
    year: 1995,
    genre: "Pop / Rock",
    price: "$90.000",
    condition: "NM",
    storeId: "el-virrey",
    notes: "Prensaje colombiano original. Muy difícil de conseguir en vinilo. Estado impecable.",
  },
  {
    artist: "Los Visconti",
    title: "El Mapalé",
    year: 1970,
    genre: "Cumbia",
    price: "$40.000",
    condition: "VG",
    storeId: "san-alejo",
    notes: "Clásico del baile nacional colombiano. Encontrado en mercado de las pulgas.",
  },
  {
    artist: "Celia Cruz",
    title: "Azúcar Negra",
    year: 1993,
    genre: "Salsa",
    price: "$60.000",
    condition: "VG+",
    storeId: "musiquero",
    notes: "Disponible en tienda online. Envío a todo Colombia.",
  },
];

const TYPE_LABELS: Record<Store["type"], string> = {
  tienda: "Tienda",
  mercado: "Mercado / Pulgas",
  online: "Online",
  mixto: "Mixto (Café/Tienda)",
};

const TYPE_COLORS: Record<Store["type"], string> = {
  tienda: "#c9a84c",
  mercado: "#9a3412",
  online: "#4a7c59",
  mixto: "#6b5a8a",
};

const CONDITION_COLORS: Record<string, string> = {
  NM: "#22c55e",
  "VG+": "#84cc16",
  VG: "#c9a84c",
  G: "#f97316",
  P: "#ef4444",
};

const ALL_CITIES = ["Todas las ciudades", ...Array.from(new Set(STORES.map((s) => s.city)))];
const ALL_GENRES_SALE = [
  "Todos los géneros",
  ...Array.from(new Set(LISTINGS.map((l) => l.genre))),
];

export default function OnSalePage() {
  const [cityFilter, setCityFilter] = useState("Todas las ciudades");
  const [genreFilter, setGenreFilter] = useState("Todos los géneros");
  const [expandedStore, setExpandedStore] = useState<string | null>(null);

  const filteredStores = STORES.filter(
    (s) => cityFilter === "Todas las ciudades" || s.city === cityFilter
  );

  const filteredListings = LISTINGS.filter((l) => {
    const store = STORES.find((s) => s.id === l.storeId);
    const cityMatch =
      cityFilter === "Todas las ciudades" || store?.city === cityFilter;
    const genreMatch =
      genreFilter === "Todos los géneros" || l.genre.includes(genreFilter.split(" / ")[0]);
    return cityMatch && genreMatch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Tag className="w-6 h-6 text-gold" strokeWidth={1.5} />
          <h1
            className="text-3xl text-parchment"
            style={{ fontFamily: "var(--font-display)" }}
          >
            En Venta en Colombia
          </h1>
        </div>
        <p
          className="text-muted-foreground text-sm max-w-2xl"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Directorio de tiendas, mercados y canales para conseguir vinilos en Colombia.
          Precios de referencia aproximados — siempre verificar disponibilidad directamente con cada tienda.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div>
          <label
            className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5"
            style={{ fontFamily: "var(--font-label)" }}
          >
            Ciudad
          </label>
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="bg-charcoal border border-border rounded px-3 py-1.5 text-sm text-parchment focus:outline-none focus:border-gold/50"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {ALL_CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5"
            style={{ fontFamily: "var(--font-label)" }}
          >
            Género
          </label>
          <select
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            className="bg-charcoal border border-border rounded px-3 py-1.5 text-sm text-parchment focus:outline-none focus:border-gold/50"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {ALL_GENRES_SALE.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stores Section */}
      <section className="mb-12">
        <h2
          className="text-xl text-parchment uppercase tracking-wider mb-5"
          style={{ fontFamily: "var(--font-label)" }}
        >
          Tiendas y Mercados ({filteredStores.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStores.map((store, i) => (
            <motion.div
              key={store.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-border rounded-lg overflow-hidden"
            >
              {/* Store header */}
              <button
                onClick={() =>
                  setExpandedStore(expandedStore === store.id ? null : store.id)
                }
                className="w-full text-left p-5 hover:bg-charcoal-light/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-xs px-2 py-0.5 rounded"
                        style={{
                          backgroundColor: TYPE_COLORS[store.type] + "22",
                          color: TYPE_COLORS[store.type],
                          fontFamily: "var(--font-label)",
                        }}
                      >
                        {TYPE_LABELS[store.type]}
                      </span>
                    </div>
                    <h3
                      className="text-lg text-parchment mb-1"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {store.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                      <MapPin className="w-3 h-3" />
                      <span style={{ fontFamily: "var(--font-body)" }}>
                        {store.city} — {store.neighborhood}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span
                      className="text-gold text-xs"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {store.priceRange}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-muted-foreground transition-transform ${
                        expandedStore === store.id ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>

                {/* Specialty tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {store.specialty.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 bg-charcoal border border-border/50 rounded text-parchment-dim"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </button>

              {/* Expanded details */}
              <AnimatePresence>
                {expandedStore === store.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 space-y-3 border-t border-border/50 pt-4">
                      <p
                        className="text-sm text-parchment-dim leading-relaxed"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {store.description}
                      </p>

                      {/* Tip */}
                      <div className="bg-gold/5 border border-gold/20 rounded p-3">
                        <p
                          className="text-xs text-gold/80 uppercase tracking-wider mb-1"
                          style={{ fontFamily: "var(--font-label)" }}
                        >
                          Tip del coleccionista
                        </p>
                        <p
                          className="text-xs text-parchment-dim"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {store.tips}
                        </p>
                      </div>

                      {/* Hours & links */}
                      <div className="flex items-center justify-between">
                        <span
                          className="text-xs text-muted-foreground"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {store.open}
                        </span>
                        <div className="flex items-center gap-3">
                          {store.instagram && (
                            <span
                              className="flex items-center gap-1 text-xs text-muted-foreground"
                              style={{ fontFamily: "var(--font-body)" }}
                            >
                              <Instagram className="w-3 h-3" />
                              {store.instagram}
                            </span>
                          )}
                          {store.website && (
                            <span
                              className="flex items-center gap-1 text-xs text-muted-foreground"
                              style={{ fontFamily: "var(--font-body)" }}
                            >
                              <Globe className="w-3 h-3" />
                              {store.website}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Listings Section */}
      <section>
        <div className="flex items-center gap-3 mb-5">
          <Music className="w-5 h-5 text-gold" strokeWidth={1.5} />
          <h2
            className="text-xl text-parchment uppercase tracking-wider"
            style={{ fontFamily: "var(--font-label)" }}
          >
            LPs Destacados ({filteredListings.length})
          </h2>
        </div>
        <p
          className="text-xs text-muted-foreground mb-5"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Selección curada de discos representativos que circulan en el mercado colombiano. Precios y disponibilidad son de referencia.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredListings.map((listing, i) => {
            const store = STORES.find((s) => s.id === listing.storeId);
            return (
              <motion.div
                key={`${listing.artist}-${listing.title}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-card border border-border rounded-lg p-4 hover:border-gold/30 transition-colors"
              >
                {/* Condition badge */}
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded"
                    style={{
                      color: CONDITION_COLORS[listing.condition],
                      backgroundColor: CONDITION_COLORS[listing.condition] + "22",
                      fontFamily: "var(--font-label)",
                    }}
                  >
                    {listing.condition}
                  </span>
                  <span
                    className="text-gold text-sm font-bold"
                    style={{ fontFamily: "var(--font-label)" }}
                  >
                    {listing.price}
                  </span>
                </div>

                <p
                  className="text-parchment text-sm font-bold mb-0.5"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {listing.title}
                </p>
                <p
                  className="text-parchment-dim text-xs mb-1"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {listing.artist} · {listing.year}
                </p>
                <span
                  className="inline-block text-xs px-2 py-0.5 bg-charcoal border border-border/50 rounded text-muted-foreground mb-3"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {listing.genre}
                </span>

                <p
                  className="text-xs text-muted-foreground leading-relaxed mb-3"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {listing.notes}
                </p>

                {store && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground border-t border-border/40 pt-2">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span style={{ fontFamily: "var(--font-body)" }}>
                      {store.name} · {store.city}
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {filteredListings.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-sm" style={{ fontFamily: "var(--font-body)" }}>
              No hay listados para los filtros seleccionados.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
