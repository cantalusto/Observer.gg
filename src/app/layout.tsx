import type { Metadata } from "next";
import { Instrument_Sans, Syne, Playfair_Display } from "next/font/google";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "OBSERVER.GG - Domine o Rift, Eleve seu Elo",
  description:
    "Analise suas partidas de League of Legends com IA avancada. Identifique erros, aprenda com os pros e transforme suas derrotas em vitorias.",
  keywords: [
    "League of Legends",
    "LoL",
    "coaching",
    "analise de partidas",
    "melhorar elo",
    "rankeds",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${instrumentSans.variable} ${syne.variable} ${playfair.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
