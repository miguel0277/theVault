"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Disc3, BarChart3, Plus, Store, Mic2 } from "lucide-react";
import { cn } from "@/lib/utils";
import * as Tooltip from "@radix-ui/react-tooltip";

const navItems = [
  { href: "/vault", label: "Mi Colección", icon: Disc3 },
  { href: "/on-sale", label: "En Venta", icon: Store },
  { href: "/stats", label: "Estadísticas", icon: BarChart3 },
  { href: "/artists", label: "Artistas", icon: Mic2 },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <Tooltip.Provider delayDuration={300}>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-burgundy/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/vault" className="flex items-center gap-3 group">
              <div className="relative">
                <Disc3
                  className="w-8 h-8 text-gold group-hover:animate-spin-vinyl"
                  strokeWidth={1.5}
                />
              </div>
              <span
                className="text-2xl tracking-wider text-parchment"
                style={{ fontFamily: "var(--font-label)" }}
              >
                THE VAULT
              </span>
            </Link>

            {/* Nav Links — icons only with tooltips */}
            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname?.startsWith(item.href + "/");
                return (
                  <Tooltip.Root key={item.href}>
                    <Tooltip.Trigger asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center justify-center w-10 h-10 rounded transition-colors",
                          "hover:bg-charcoal-light hover:text-parchment",
                          isActive
                            ? "text-gold bg-charcoal-light"
                            : "text-muted-foreground"
                        )}
                        aria-label={item.label}
                      >
                        <item.icon className="w-5 h-5" strokeWidth={1.5} />
                      </Link>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content
                        sideOffset={8}
                        className="z-50 rounded px-3 py-1.5 text-xs text-parchment bg-charcoal border border-border shadow-lg"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {item.label}
                        <Tooltip.Arrow className="fill-charcoal" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                );
              })}

              {/* Add Record */}
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <Link
                    href="/vault/add"
                    className="ml-2 flex items-center justify-center w-10 h-10 bg-gold/10 border border-gold/30 rounded text-gold hover:bg-gold/20 transition-colors"
                    aria-label="Agregar disco"
                  >
                    <Plus className="w-5 h-5" strokeWidth={1.5} />
                  </Link>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    sideOffset={8}
                    className="z-50 rounded px-3 py-1.5 text-xs text-parchment bg-charcoal border border-border shadow-lg"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Agregar disco
                    <Tooltip.Arrow className="fill-charcoal" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </div>
          </div>
        </div>
      </nav>
    </Tooltip.Provider>
  );
}
