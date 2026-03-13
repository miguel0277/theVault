"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Disc3, BarChart3, Settings, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/vault", label: "The Vault", icon: Disc3 },
  { href: "/stats", label: "Stats", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Navigation() {
  const pathname = usePathname();

  return (
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

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || pathname?.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded text-sm transition-colors",
                    "hover:bg-charcoal-light hover:text-parchment",
                    isActive
                      ? "text-gold bg-charcoal-light"
                      : "text-muted-foreground"
                  )}
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}

            <Link
              href="/vault/add"
              className="ml-2 flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/30 rounded text-gold hover:bg-gold/20 transition-colors text-sm"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Record</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
