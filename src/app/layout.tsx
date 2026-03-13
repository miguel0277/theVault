import type { Metadata } from "next";
import { Playfair_Display, Courier_Prime, Bebas_Neue } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const courierPrime = Courier_Prime({
  variable: "--font-body",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  variable: "--font-label",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Vault — Vinyl Collection Manager",
  description:
    "A personal vinyl record collection manager with AI-powered enrichment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${playfair.variable} ${courierPrime.variable} ${bebasNeue.variable} antialiased min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
