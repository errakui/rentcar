"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Car,
  Users,
  DoorOpen,
  Briefcase,
  Cog,
  Fuel,
  Gauge,
  MapPin,
  Calendar,
  Clock,
  Shield,
  Package,
  ChevronLeft,
  ChevronRight,
  Check,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import {
  formatCHF,
  getCategoryLabel,
  getFuelLabel,
  getTransmissionLabel,
  getDrivetrainLabel,
  calculateDays,
  buildWhatsAppUrl,
} from "@/lib/utils";

interface RatePlan {
  id: string;
  dailyPrice: number;
  weeklyPrice: number | null;
  monthlyPrice: number | null;
  discount3Days: number | null;
  discount7Days: number | null;
  discount30Days: number | null;
  kmIncluded: number;
  extraKmPrice: number;
  unlimitedKm: boolean;
  deposit: number;
  depositNotes: string | null;
}

interface CarImage {
  id: string;
  url: string;
  altText: string | null;
  order: number;
}

interface CarData {
  id: string;
  slug: string;
  brand: string;
  model: string;
  trim: string | null;
  year: number;
  category: string;
  transmission: string;
  fuelType: string;
  drivetrain: string;
  seats: number;
  doors: number;
  luggage: number;
  powerKw: number | null;
  powerHp: number | null;
  minAge: number;
  minLicenseYears: number;
  baseFranchise: number | null;
  kmPerDay: number;
  baseInsurance: boolean;
  coverImage: string | null;
  location: { id: string; name: string; city: string } | null;
  ratePlans: RatePlan[];
  images: CarImage[];
}

interface ExtraItem {
  id: string;
  name: string;
  description: string | null;
  priceType: string;
  price: number;
  maxQuantity: number;
}

interface InsuranceItem {
  id: string;
  name: string;
  description: string | null;
  pricePerDay: number;
  franchise: number;
}

interface LocationItem {
  id: string;
  name: string;
  city: string;
}

export default function CarDetail({
  car,
  extras,
  insurances,
  locations,
}: {
  car: CarData;
  extras: ExtraItem[];
  insurances: InsuranceItem[];
  locations: LocationItem[];
}) {
  const [currentImage, setCurrentImage] = useState(0);
  const allImages = car.coverImage
    ? [{ url: car.coverImage, altText: `${car.brand} ${car.model}` }, ...car.images]
    : car.images;

  // Quote state
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("09:00");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("09:00");
  const [pickupLocation, setPickupLocation] = useState(car.location?.id || "");
  const [returnLocation, setReturnLocation] = useState("");
  const [selectedExtras, setSelectedExtras] = useState<Record<string, number>>({});
  const [selectedInsurance, setSelectedInsurance] = useState("");
  const [kmOption, setKmOption] = useState<"included" | "unlimited">("included");

  // Contact
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);

  const rate = car.ratePlans[0];

  const quote = useMemo(() => {
    if (!pickupDate || !returnDate || !rate) return null;

    const start = new Date(`${pickupDate}T${pickupTime}`);
    const end = new Date(`${returnDate}T${returnTime}`);
    if (end <= start) return null;

    const days = calculateDays(start, end);

    // Base price with discounts
    let dailyRate = rate.dailyPrice;
    if (days >= 30 && rate.discount30Days) {
      dailyRate = dailyRate * (1 - rate.discount30Days / 100);
    } else if (days >= 7 && rate.discount7Days) {
      dailyRate = dailyRate * (1 - rate.discount7Days / 100);
    } else if (days >= 3 && rate.discount3Days) {
      dailyRate = dailyRate * (1 - rate.discount3Days / 100);
    }

    // Use weekly/monthly if cheaper
    let basePrice = dailyRate * days;
    if (days >= 30 && rate.monthlyPrice) {
      const months = Math.floor(days / 30);
      const remainDays = days - months * 30;
      const monthlyTotal = months * rate.monthlyPrice + remainDays * dailyRate;
      if (monthlyTotal < basePrice) basePrice = monthlyTotal;
    } else if (days >= 7 && rate.weeklyPrice) {
      const weeks = Math.floor(days / 7);
      const remainDays = days - weeks * 7;
      const weeklyTotal = weeks * rate.weeklyPrice + remainDays * dailyRate;
      if (weeklyTotal < basePrice) basePrice = weeklyTotal;
    }

    // Km surcharge for unlimited
    let kmSurcharge = 0;
    if (kmOption === "unlimited" && !rate.unlimitedKm) {
      kmSurcharge = 15 * days; // CHF 15/day for unlimited
    }

    // Extras
    let extrasTotal = 0;
    const extrasBreakdown: { name: string; total: number }[] = [];
    Object.entries(selectedExtras).forEach(([extraId, qty]) => {
      if (qty <= 0) return;
      const extra = extras.find((e) => e.id === extraId);
      if (!extra) return;
      const total = extra.priceType === "PER_DAY" ? extra.price * days * qty : extra.price * qty;
      extrasTotal += total;
      extrasBreakdown.push({ name: extra.name, total });
    });

    // Insurance
    let insuranceTotal = 0;
    let insuranceName = "";
    if (selectedInsurance) {
      const ins = insurances.find((i) => i.id === selectedInsurance);
      if (ins) {
        insuranceTotal = ins.pricePerDay * days;
        insuranceName = ins.name;
      }
    }

    // IVA not typically applied in Switzerland for car rental, but we show subtotal
    const subtotal = basePrice + kmSurcharge + extrasTotal + insuranceTotal;
    const total = subtotal;

    return {
      days,
      dailyRate,
      basePrice,
      kmSurcharge,
      extrasTotal,
      extrasBreakdown,
      insuranceTotal,
      insuranceName,
      subtotal,
      total,
      deposit: rate.deposit,
    };
  }, [pickupDate, pickupTime, returnDate, returnTime, rate, kmOption, selectedExtras, extras, selectedInsurance, insurances]);

  const toggleExtra = (extraId: string) => {
    setSelectedExtras((prev) => {
      const current = prev[extraId] || 0;
      return { ...prev, [extraId]: current > 0 ? 0 : 1 };
    });
  };

  const canSubmit = quote && customerName && customerPhone && acceptTerms && acceptPrivacy;

  const handleWhatsApp = () => {
    if (!quote || !canSubmit) return;

    const pickupLoc = locations.find((l) => l.id === pickupLocation);
    const returnLoc = locations.find((l) => l.id === returnLocation) || pickupLoc;

    const message = `🚗 *RICHIESTA NOLEGGIO*

*Auto:* ${car.brand} ${car.model}${car.trim ? ` ${car.trim}` : ""} (${car.year})
*ID:* ${car.slug}
*Categoria:* ${getCategoryLabel(car.category)}

📅 *Ritiro:* ${pickupDate} ore ${pickupTime}
📅 *Riconsegna:* ${returnDate} ore ${returnTime}
📍 *Sede ritiro:* ${pickupLoc?.name || "Da definire"}
📍 *Sede riconsegna:* ${returnLoc?.name || "Come ritiro"}

💰 *Preventivo:*
Prezzo base (${quote.days} giorni): ${formatCHF(quote.basePrice)}
${quote.kmSurcharge > 0 ? `Km illimitati: ${formatCHF(quote.kmSurcharge)}\n` : ""}${quote.extrasBreakdown.map((e) => `${e.name}: ${formatCHF(e.total)}`).join("\n")}
${quote.insuranceName ? `Assicurazione (${quote.insuranceName}): ${formatCHF(quote.insuranceTotal)}\n` : ""}
*TOTALE: ${formatCHF(quote.total)}*
Deposito cauzionale: ${formatCHF(quote.deposit)}

👤 *Cliente:*
Nome: ${customerName}
Tel: ${customerPhone}
${customerEmail ? `Email: ${customerEmail}\n` : ""}${notes ? `Note: ${notes}` : ""}`;

    // Also submit lead to API
    fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        carId: car.id,
        customerName,
        customerPhone,
        customerEmail,
        pickupDate: `${pickupDate}T${pickupTime}`,
        returnDate: `${returnDate}T${returnTime}`,
        pickupLocation: pickupLoc?.name || "",
        returnLocation: returnLoc?.name || pickupLoc?.name || "",
        quoteSnapshot: quote,
        totalEstimate: quote.total,
        extras: JSON.stringify(selectedExtras),
        insurance: selectedInsurance,
      }),
    }).catch(() => {});

    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "41XXXXXXXXX";
    const url = buildWhatsAppUrl(whatsappNumber, message);
    window.open(url, "_blank");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <Link
        href="/auto"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-white transition-colors mb-6"
      >
        <ChevronLeft className="w-4 h-4" /> Torna alla flotta
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Car info */}
        <div className="lg:col-span-3 space-y-6">
          {/* Gallery */}
          <div className="card overflow-hidden">
            <div className="aspect-[16/10] bg-[#0d0d0d] relative">
              {allImages.length > 0 ? (
                <Image
                  src={allImages[currentImage]?.url || ""}
                  alt={allImages[currentImage]?.altText || `${car.brand} ${car.model}`}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Car className="w-24 h-24 text-gray-800" />
                </div>
              )}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImage((p) => (p - 1 + allImages.length) % allImages.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 p-2 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentImage((p) => (p + 1) % allImages.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 p-2 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {allImages.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentImage(i)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          i === currentImage ? "bg-white" : "bg-white/30"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Car info */}
          <div className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="badge text-[10px] mb-2">{getCategoryLabel(car.category)}</span>
                <h1 className="heading-2 mt-1">
                  {car.brand} {car.model}
                </h1>
                {car.trim && <p className="text-gray-500 mt-1">{car.trim}</p>}
              </div>
              <span className="text-gray-500">{car.year}</span>
            </div>

            {/* Specs grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {[
                { icon: Users, label: "Posti", value: car.seats },
                { icon: DoorOpen, label: "Porte", value: car.doors },
                { icon: Briefcase, label: "Bagagli", value: car.luggage },
                { icon: Cog, label: "Cambio", value: getTransmissionLabel(car.transmission) },
                { icon: Fuel, label: "Carburante", value: getFuelLabel(car.fuelType) },
                { icon: Gauge, label: "Trazione", value: getDrivetrainLabel(car.drivetrain) },
                ...(car.powerHp ? [{ icon: Gauge, label: "Potenza", value: `${car.powerHp} HP` }] : []),
                ...(car.location ? [{ icon: MapPin, label: "Sede", value: car.location.name }] : []),
              ].map((spec, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/[0.04]">
                  <spec.icon className="w-4 h-4 text-gray-500 shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">{spec.label}</p>
                    <p className="text-sm font-medium">{spec.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Policies */}
            <div className="divider mt-6 pt-4">
              <h3 className="text-sm font-semibold mb-3">Requisiti</h3>
              <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                <span>Età minima: {car.minAge} anni</span>
                <span>Patente da almeno {car.minLicenseYears} {car.minLicenseYears === 1 ? "anno" : "anni"}</span>
                {car.baseFranchise && <span>Franchigia base: {formatCHF(car.baseFranchise)}</span>}
                <span>Km inclusi: {car.kmPerDay} km/giorno</span>
                {car.baseInsurance && <span className="text-green-400">✓ Assicurazione base inclusa</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Quote builder */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pricing */}
          {rate && (
            <div className="card p-6">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                  {formatCHF(rate.dailyPrice)}
                </span>
                <span className="text-gray-500 text-sm">/ giorno</span>
              </div>
              {rate.weeklyPrice && (
                <p className="text-xs text-gray-500">
                  Settimanale: {formatCHF(rate.weeklyPrice)} · Deposito: {formatCHF(rate.deposit)}
                </p>
              )}
            </div>
          )}

          {/* Date picker */}
          <div className="card p-6">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" /> Periodo noleggio
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label-field">Data ritiro</label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="input-field text-sm"
                  />
                </div>
                <div>
                  <label className="label-field">Ora ritiro</label>
                  <input
                    type="time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="input-field text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label-field">Data riconsegna</label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    min={pickupDate || new Date().toISOString().split("T")[0]}
                    className="input-field text-sm"
                  />
                </div>
                <div>
                  <label className="label-field">Ora riconsegna</label>
                  <input
                    type="time"
                    value={returnTime}
                    onChange={(e) => setReturnTime(e.target.value)}
                    className="input-field text-sm"
                  />
                </div>
              </div>

              {/* Locations */}
              <div>
                <label className="label-field">Sede ritiro</label>
                <select
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="select-field text-sm"
                >
                  <option value="">Seleziona sede</option>
                  {locations.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} – {l.city}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-field">Sede riconsegna (opzionale)</label>
                <select
                  value={returnLocation}
                  onChange={(e) => setReturnLocation(e.target.value)}
                  className="select-field text-sm"
                >
                  <option value="">Stessa sede di ritiro</option>
                  {locations.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} – {l.city}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Km option */}
          {rate && (
            <div className="card p-6">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" /> Chilometraggio
              </h3>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 border border-white/[0.06] hover:border-white/[0.12] transition-colors cursor-pointer">
                  <input
                    type="radio"
                    name="km"
                    checked={kmOption === "included"}
                    onChange={() => setKmOption("included")}
                    className="accent-white"
                  />
                  <div>
                    <p className="text-sm font-medium">{rate.kmIncluded} km/giorno inclusi</p>
                    <p className="text-xs text-gray-500">Extra: {formatCHF(rate.extraKmPrice)}/km</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 border border-white/[0.06] hover:border-white/[0.12] transition-colors cursor-pointer">
                  <input
                    type="radio"
                    name="km"
                    checked={kmOption === "unlimited"}
                    onChange={() => setKmOption("unlimited")}
                    className="accent-white"
                  />
                  <div>
                    <p className="text-sm font-medium">Km illimitati</p>
                    <p className="text-xs text-gray-500">+ CHF 15/giorno</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Extras */}
          {extras.length > 0 && (
            <div className="card p-6">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Package className="w-4 h-4 text-gray-500" /> Extra
              </h3>
              <div className="space-y-2">
                {extras.map((extra) => (
                  <label
                    key={extra.id}
                    className="flex items-center justify-between gap-3 p-3 border border-white/[0.06] hover:border-white/[0.12] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={(selectedExtras[extra.id] || 0) > 0}
                        onChange={() => toggleExtra(extra.id)}
                        className="accent-white"
                      />
                      <div>
                        <p className="text-sm font-medium">{extra.name}</p>
                        {extra.description && (
                          <p className="text-xs text-gray-500">{extra.description}</p>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-gray-400 whitespace-nowrap">
                      {formatCHF(extra.price)}
                      {extra.priceType === "PER_DAY" ? "/gg" : ""}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Insurance */}
          {insurances.length > 0 && (
            <div className="card p-6">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-gray-500" /> Assicurazione
              </h3>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 border border-white/[0.06] hover:border-white/[0.12] transition-colors cursor-pointer">
                  <input
                    type="radio"
                    name="insurance"
                    checked={selectedInsurance === ""}
                    onChange={() => setSelectedInsurance("")}
                    className="accent-white"
                  />
                  <div>
                    <p className="text-sm font-medium">Base (inclusa)</p>
                    <p className="text-xs text-gray-500">Copertura standard</p>
                  </div>
                </label>
                {insurances.map((ins) => (
                  <label
                    key={ins.id}
                    className="flex items-center justify-between gap-3 p-3 border border-white/[0.06] hover:border-white/[0.12] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="insurance"
                        checked={selectedInsurance === ins.id}
                        onChange={() => setSelectedInsurance(ins.id)}
                        className="accent-white"
                      />
                      <div>
                        <p className="text-sm font-medium">{ins.name}</p>
                        <p className="text-xs text-gray-500">
                          {ins.description} · Franchigia: {formatCHF(ins.franchise)}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-400 whitespace-nowrap">
                      {formatCHF(ins.pricePerDay)}/gg
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Quote summary */}
          {quote && (
            <div className="card p-6 border-white/[0.12]">
              <h3 className="text-sm font-semibold mb-4">Riepilogo preventivo</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">
                    Prezzo base ({quote.days} {quote.days === 1 ? "giorno" : "giorni"})
                  </span>
                  <span>{formatCHF(quote.basePrice)}</span>
                </div>
                {quote.kmSurcharge > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Km illimitati</span>
                    <span>{formatCHF(quote.kmSurcharge)}</span>
                  </div>
                )}
                {quote.extrasBreakdown.map((e, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-gray-400">{e.name}</span>
                    <span>{formatCHF(e.total)}</span>
                  </div>
                ))}
                {quote.insuranceTotal > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Assicurazione ({quote.insuranceName})</span>
                    <span>{formatCHF(quote.insuranceTotal)}</span>
                  </div>
                )}
                <div className="divider pt-3 mt-3 flex justify-between font-bold text-base">
                  <span>Totale stimato</span>
                  <span>{formatCHF(quote.total)}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Deposito cauzionale: {formatCHF(quote.deposit)} (da versare al ritiro)
                </p>
              </div>
            </div>
          )}

          {/* Contact form */}
          <div className="card p-6">
            <h3 className="text-sm font-semibold mb-4">I tuoi dati</h3>
            <div className="space-y-4">
              <div>
                <label className="label-field">Nome e cognome *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Mario Rossi"
                  className="input-field"
                />
              </div>
              <div>
                <label className="label-field">Telefono *</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+41 79 123 45 67"
                  className="input-field"
                />
              </div>
              <div>
                <label className="label-field">Email (opzionale)</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="mario@esempio.ch"
                  className="input-field"
                />
              </div>
              <div>
                <label className="label-field">Note (opzionale)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Richieste particolari..."
                  className="input-field resize-none"
                />
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="accent-white mt-0.5"
                  />
                  <span className="text-xs text-gray-400">
                    Accetto le condizioni generali di noleggio *
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptPrivacy}
                    onChange={(e) => setAcceptPrivacy(e.target.checked)}
                    className="accent-white mt-0.5"
                  />
                  <span className="text-xs text-gray-400">
                    Acconsento al trattamento dei dati personali (Privacy Policy) *
                  </span>
                </label>
              </div>

              {/* WhatsApp CTA */}
              <button
                onClick={handleWhatsApp}
                disabled={!canSubmit}
                className="btn-whatsapp w-full flex items-center justify-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <MessageCircle className="w-5 h-5" />
                Conferma su WhatsApp
              </button>

              {!quote && (
                <p className="text-xs text-gray-500 text-center">
                  Seleziona le date per calcolare il preventivo
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
