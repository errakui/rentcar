import type { Metadata } from "next";
import { Syne, Outfit } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "LMG RentCar | Noleggio Auto Premium – Svizzera",
  description:
    "Noleggio auto di qualità in Svizzera. City car, SUV, luxury e van. Prenota la tua auto con preventivo immediato.",
  keywords: "noleggio auto, svizzera, rent car, luxury, SUV, city car, LMG",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" className={`${syne.variable} ${outfit.variable}`}>
      <body
        className="min-h-screen bg-[#0a0a0a] text-white antialiased"
        style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
