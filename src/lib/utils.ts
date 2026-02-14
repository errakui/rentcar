import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCHF(amount: number): string {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function calculateDays(start: Date, end: Date): number {
  const diffMs = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return Math.max(diffDays, 1);
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
}

export function getCategoryLabel(cat: string): string {
  const labels: Record<string, string> = {
    CITY: "City Car",
    SEDAN: "Berlina",
    SUV: "SUV",
    LUXURY: "Luxury",
    VAN: "Van",
    SPORTS: "Sportiva",
    CONVERTIBLE: "Cabrio",
    WAGON: "Station Wagon",
  };
  return labels[cat] || cat;
}

export function getFuelLabel(fuel: string): string {
  const labels: Record<string, string> = {
    PETROL: "Benzina",
    DIESEL: "Diesel",
    HYBRID: "Ibrido",
    ELECTRIC: "Elettrica",
  };
  return labels[fuel] || fuel;
}

export function getTransmissionLabel(t: string): string {
  return t === "AUTOMATIC" ? "Automatico" : "Manuale";
}

export function getDrivetrainLabel(d: string): string {
  const labels: Record<string, string> = {
    FWD: "Trazione anteriore",
    RWD: "Trazione posteriore",
    AWD: "Integrale",
  };
  return labels[d] || d;
}
