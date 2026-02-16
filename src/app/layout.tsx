import type { Metadata, Viewport } from "next";
import { Urbanist, Plus_Jakarta_Sans } from "next/font/google";
import PWARegister from "@/components/PWARegister";
import "./globals.css";

const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#0a0a0a",
};

export const metadata: Metadata = {
  title: "LMG RentCar | Premium Car Rental – Switzerland",
  description:
    "Premium car rental in Switzerland. City cars, SUVs, luxury and vans. Book your car with instant quote.",
  keywords:
    "car rental, switzerland, rent car, luxury, SUV, city car, LMG, noleggio, location voiture, autovermietung",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "LMG RentCar",
    startupImage: [
      { url: "/icon-512x512.png" },
    ],
  },
};

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale?: string }>;
}) {
  return (
    <html className={`${urbanist.variable} ${jakarta.variable}`} suppressHydrationWarning>
      <body
        className="min-h-screen bg-[#0a0a0a] text-white antialiased"
        style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
      >
        <PWARegister />
        {children}
      </body>
    </html>
  );
}
