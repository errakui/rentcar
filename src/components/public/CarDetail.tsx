"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Car, Users, DoorOpen, Briefcase, Cog, Fuel, Gauge, MapPin, Calendar,
  Clock, Shield, Package, ChevronLeft, ChevronRight, Check, MessageCircle,
} from "lucide-react";
import { formatCHF, calculateDays, buildWhatsAppUrl } from "@/lib/utils";

interface RatePlan {
  id: string; dailyPrice: number; weeklyPrice: number | null; monthlyPrice: number | null;
  discount3Days: number | null; discount7Days: number | null; discount30Days: number | null;
  kmIncluded: number; extraKmPrice: number; unlimitedKm: boolean; deposit: number; depositNotes: string | null;
}
interface CarImage { id: string; url: string; altText: string | null; order: number; }
interface CarData {
  id: string; slug: string; brand: string; model: string; trim: string | null; year: number;
  category: string; transmission: string; fuelType: string; drivetrain: string;
  seats: number; doors: number; luggage: number; powerKw: number | null; powerHp: number | null;
  minAge: number; minLicenseYears: number; baseFranchise: number | null; kmPerDay: number;
  baseInsurance: boolean; coverImage: string | null;
  location: { id: string; name: string; city: string } | null;
  ratePlans: RatePlan[]; images: CarImage[];
}
interface ExtraItem { id: string; name: string; description: string | null; priceType: string; price: number; maxQuantity: number; }
interface InsuranceItem { id: string; name: string; description: string | null; pricePerDay: number; franchise: number; }
interface LocationItem { id: string; name: string; city: string; }

export default function CarDetail({ car, extras, insurances, locations }: { car: CarData; extras: ExtraItem[]; insurances: InsuranceItem[]; locations: LocationItem[]; }) {
  const t = useTranslations("carDetail");
  const tc = useTranslations("common");

  const catLabel = (c: string) => tc(`cat_${c}` as any) || c;
  const fuelLabel = (f: string) => tc(`fuel_${f}` as any) || f;
  const transLabel = (tr: string) => tc(`trans_${tr}` as any) || tr;
  const driveLabel = (d: string) => tc(`drive_${d}` as any) || d;

  const [currentImage, setCurrentImage] = useState(0);
  const allImages = car.coverImage
    ? [{ url: car.coverImage, altText: `${car.brand} ${car.model}` }, ...car.images]
    : car.images;

  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("09:00");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("09:00");
  const [pickupLocation, setPickupLocation] = useState(car.location?.id || "");
  const [returnLocation, setReturnLocation] = useState("");
  const [selectedExtras, setSelectedExtras] = useState<Record<string, number>>({});
  const [selectedInsurance, setSelectedInsurance] = useState("");
  const [kmOption, setKmOption] = useState<"included" | "unlimited">("included");

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
    let dailyRate = rate.dailyPrice;
    if (days >= 30 && rate.discount30Days) dailyRate *= (1 - rate.discount30Days / 100);
    else if (days >= 7 && rate.discount7Days) dailyRate *= (1 - rate.discount7Days / 100);
    else if (days >= 3 && rate.discount3Days) dailyRate *= (1 - rate.discount3Days / 100);
    let basePrice = dailyRate * days;
    if (days >= 30 && rate.monthlyPrice) {
      const m = Math.floor(days / 30), r = days - m * 30;
      const mt = m * rate.monthlyPrice + r * dailyRate;
      if (mt < basePrice) basePrice = mt;
    } else if (days >= 7 && rate.weeklyPrice) {
      const w = Math.floor(days / 7), r = days - w * 7;
      const wt = w * rate.weeklyPrice + r * dailyRate;
      if (wt < basePrice) basePrice = wt;
    }
    let kmSurcharge = 0;
    if (kmOption === "unlimited" && !rate.unlimitedKm) kmSurcharge = 15 * days;
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
    let insuranceTotal = 0, insuranceName = "";
    if (selectedInsurance) {
      const ins = insurances.find((i) => i.id === selectedInsurance);
      if (ins) { insuranceTotal = ins.pricePerDay * days; insuranceName = ins.name; }
    }
    const total = basePrice + kmSurcharge + extrasTotal + insuranceTotal;
    return { days, dailyRate, basePrice, kmSurcharge, extrasTotal, extrasBreakdown, insuranceTotal, insuranceName, subtotal: total, total, deposit: rate.deposit };
  }, [pickupDate, pickupTime, returnDate, returnTime, rate, kmOption, selectedExtras, extras, selectedInsurance, insurances]);

  const toggleExtra = (extraId: string) => {
    setSelectedExtras((prev) => ({ ...prev, [extraId]: (prev[extraId] || 0) > 0 ? 0 : 1 }));
  };

  const canSubmit = quote && customerName && customerPhone && acceptTerms && acceptPrivacy;

  const handleWhatsApp = () => {
    if (!quote || !canSubmit) return;
    const pickupLoc = locations.find((l) => l.id === pickupLocation);
    const returnLoc = locations.find((l) => l.id === returnLocation) || pickupLoc;
    const message = `🚗 *${t("confirmWhatsApp").toUpperCase()}*\n\n*${t("seatsLabel")}:* ${car.brand} ${car.model}${car.trim ? ` ${car.trim}` : ""} (${car.year})\n*ID:* ${car.slug}\n*${t("drivetrainLabel")}:* ${catLabel(car.category)}\n\n📅 *${t("pickupDate")}:* ${pickupDate} ${pickupTime}\n📅 *${t("returnDate")}:* ${returnDate} ${returnTime}\n📍 *${t("pickupLocation")}:* ${pickupLoc?.name || "—"}\n📍 *${t("returnLocation")}:* ${returnLoc?.name || t("sameLocation")}\n\n💰 *${t("summary")}:*\n${t("basePrice")} (${quote.days} ${t("days")}): ${formatCHF(quote.basePrice)}\n${quote.kmSurcharge > 0 ? `${t("unlimited")}: ${formatCHF(quote.kmSurcharge)}\n` : ""}${quote.extrasBreakdown.map((e) => `${e.name}: ${formatCHF(e.total)}`).join("\n")}\n${quote.insuranceName ? `${t("insuranceOptions")} (${quote.insuranceName}): ${formatCHF(quote.insuranceTotal)}\n` : ""}\n*${t("total")}: ${formatCHF(quote.total)}*\n${t("deposit")}: ${formatCHF(quote.deposit)}\n\n👤 *${t("contactForm")}:*\n${t("fullName")}: ${customerName}\n${t("phone")}: ${customerPhone}\n${customerEmail ? `Email: ${customerEmail}\n` : ""}${notes ? `${t("notes")}: ${notes}` : ""}`;
    fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ carId: car.id, customerName, customerPhone, customerEmail, pickupDate: `${pickupDate}T${pickupTime}`, returnDate: `${returnDate}T${returnTime}`, pickupLocation: pickupLoc?.name || "", returnLocation: returnLoc?.name || pickupLoc?.name || "", quoteSnapshot: quote, totalEstimate: quote.total, extras: JSON.stringify(selectedExtras), insurance: selectedInsurance }),
    }).catch(() => {});
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "41XXXXXXXXX";
    window.open(buildWhatsAppUrl(whatsappNumber, message), "_blank");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/auto" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-white transition-colors mb-6">
        <ChevronLeft className="w-4 h-4" /> {tc("back")}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Car info */}
        <div className="lg:col-span-3 space-y-6">
          <div className="card overflow-hidden">
            <div className="aspect-[16/10] bg-[#0d0d0d] relative rounded-t-2xl overflow-hidden">
              {allImages.length > 0 ? (
                <Image src={allImages[currentImage]?.url || ""} alt={allImages[currentImage]?.altText || `${car.brand} ${car.model}`} fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center"><Car className="w-24 h-24 text-gray-800" /></div>
              )}
              {allImages.length > 1 && (
                <>
                  <button onClick={() => setCurrentImage((p) => (p - 1 + allImages.length) % allImages.length)} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 p-2 rounded-full transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                  <button onClick={() => setCurrentImage((p) => (p + 1) % allImages.length)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 p-2 rounded-full transition-colors"><ChevronRight className="w-5 h-5" /></button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">{allImages.map((_, i) => (<button key={i} onClick={() => setCurrentImage(i)} className={`w-2 h-2 rounded-full transition-colors ${i === currentImage ? "bg-white" : "bg-white/30"}`} />))}</div>
                </>
              )}
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="badge text-[10px] mb-2">{catLabel(car.category)}</span>
                <h1 className="heading-2 mt-1">{car.brand} {car.model}</h1>
                {car.trim && <p className="text-gray-500 mt-1">{car.trim}</p>}
              </div>
              <span className="text-gray-500">{car.year}</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {[
                { icon: Users, label: t("seatsLabel"), value: car.seats },
                { icon: DoorOpen, label: t("doorsLabel"), value: car.doors },
                { icon: Briefcase, label: t("luggageLabel"), value: car.luggage },
                { icon: Cog, label: t("transmissionLabel"), value: transLabel(car.transmission) },
                { icon: Fuel, label: t("fuelLabel"), value: fuelLabel(car.fuelType) },
                { icon: Gauge, label: t("drivetrainLabel"), value: driveLabel(car.drivetrain) },
                ...(car.powerHp ? [{ icon: Gauge, label: t("powerLabel"), value: `${car.powerHp} HP` }] : []),
                ...(car.location ? [{ icon: MapPin, label: t("locationLabel"), value: car.location.name }] : []),
              ].map((spec, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <spec.icon className="w-4 h-4 text-gray-500 shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">{spec.label}</p>
                    <p className="text-sm font-medium">{spec.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="divider mt-6 pt-4">
              <h3 className="text-sm font-semibold mb-3">{t("requirements")}</h3>
              <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                <span>{t("minAge")}: {car.minAge} {t("years")}</span>
                <span>{t("minLicense")} {car.minLicenseYears} {t("years")}</span>
                {car.baseFranchise && <span>{t("franchise")}: {formatCHF(car.baseFranchise)}</span>}
                <span>{car.kmPerDay} {t("kmPerDay")}</span>
                {car.baseInsurance && <span className="text-green-400">✓ {t("baseInsurance")}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Quote builder */}
        <div className="lg:col-span-2 space-y-6">
          {rate && (
            <div className="card p-6">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>{formatCHF(rate.dailyPrice)}</span>
                <span className="text-gray-500 text-sm">{tc("perDay")}</span>
              </div>
              {rate.weeklyPrice && (
                <p className="text-xs text-gray-500">
                  {formatCHF(rate.weeklyPrice)}/week · {t("deposit")}: {formatCHF(rate.deposit)}
                </p>
              )}
            </div>
          )}

          <div className="card p-6">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" /> {t("rental")}
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label-field">{t("pickupDate")}</label><input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} min={new Date().toISOString().split("T")[0]} className="input-field text-sm" /></div>
                <div><label className="label-field">{t("pickupTime")}</label><input type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className="input-field text-sm" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label-field">{t("returnDate")}</label><input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} min={pickupDate || new Date().toISOString().split("T")[0]} className="input-field text-sm" /></div>
                <div><label className="label-field">{t("returnTime")}</label><input type="time" value={returnTime} onChange={(e) => setReturnTime(e.target.value)} className="input-field text-sm" /></div>
              </div>
              <div>
                <label className="label-field">{t("pickupLocation")}</label>
                <select value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} className="select-field text-sm">
                  <option value="">—</option>
                  {locations.map((l) => <option key={l.id} value={l.id}>{l.name} – {l.city}</option>)}
                </select>
              </div>
              <div>
                <label className="label-field">{t("returnLocation")}</label>
                <select value={returnLocation} onChange={(e) => setReturnLocation(e.target.value)} className="select-field text-sm">
                  <option value="">{t("sameLocation")}</option>
                  {locations.map((l) => <option key={l.id} value={l.id}>{l.name} – {l.city}</option>)}
                </select>
              </div>
            </div>
          </div>

          {rate && (
            <div className="card p-6">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><Clock className="w-4 h-4 text-gray-500" /> {t("mileage")}</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 border border-white/[0.06] hover:border-white/[0.12] rounded-xl transition-colors cursor-pointer">
                  <input type="radio" name="km" checked={kmOption === "included"} onChange={() => setKmOption("included")} className="accent-white" />
                  <div><p className="text-sm font-medium">{rate.kmIncluded} {t("kmPerDay")}</p><p className="text-xs text-gray-500">Extra: {formatCHF(rate.extraKmPrice)}/km</p></div>
                </label>
                <label className="flex items-center gap-3 p-3 border border-white/[0.06] hover:border-white/[0.12] rounded-xl transition-colors cursor-pointer">
                  <input type="radio" name="km" checked={kmOption === "unlimited"} onChange={() => setKmOption("unlimited")} className="accent-white" />
                  <div><p className="text-sm font-medium">{t("unlimited")}</p><p className="text-xs text-gray-500">+ CHF 15{tc("perDay")}</p></div>
                </label>
              </div>
            </div>
          )}

          {extras.length > 0 && (
            <div className="card p-6">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><Package className="w-4 h-4 text-gray-500" /> {t("extras")}</h3>
              <div className="space-y-2">
                {extras.map((extra) => (
                  <label key={extra.id} className="flex items-center justify-between gap-3 p-3 border border-white/[0.06] hover:border-white/[0.12] rounded-xl transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" checked={(selectedExtras[extra.id] || 0) > 0} onChange={() => toggleExtra(extra.id)} className="accent-white" />
                      <div><p className="text-sm font-medium">{extra.name}</p>{extra.description && <p className="text-xs text-gray-500">{extra.description}</p>}</div>
                    </div>
                    <span className="text-sm text-gray-400 whitespace-nowrap">{formatCHF(extra.price)}{extra.priceType === "PER_DAY" ? tc("perDayShort") : ""}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {insurances.length > 0 && (
            <div className="card p-6">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><Shield className="w-4 h-4 text-gray-500" /> {t("insuranceOptions")}</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 border border-white/[0.06] hover:border-white/[0.12] rounded-xl transition-colors cursor-pointer">
                  <input type="radio" name="insurance" checked={selectedInsurance === ""} onChange={() => setSelectedInsurance("")} className="accent-white" />
                  <div><p className="text-sm font-medium">{t("noInsurance")}</p></div>
                </label>
                {insurances.map((ins) => (
                  <label key={ins.id} className="flex items-center justify-between gap-3 p-3 border border-white/[0.06] hover:border-white/[0.12] rounded-xl transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input type="radio" name="insurance" checked={selectedInsurance === ins.id} onChange={() => setSelectedInsurance(ins.id)} className="accent-white" />
                      <div><p className="text-sm font-medium">{ins.name}</p><p className="text-xs text-gray-500">{ins.description} · {t("franchise")}: {formatCHF(ins.franchise)}</p></div>
                    </div>
                    <span className="text-sm text-gray-400 whitespace-nowrap">{formatCHF(ins.pricePerDay)}{tc("perDayShort")}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {quote && (
            <div className="card p-6 border-white/[0.12]">
              <h3 className="text-sm font-semibold mb-4">{t("summary")}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-400">{t("basePrice")} ({quote.days} {t("days")})</span><span>{formatCHF(quote.basePrice)}</span></div>
                {quote.kmSurcharge > 0 && <div className="flex justify-between"><span className="text-gray-400">{t("unlimited")}</span><span>{formatCHF(quote.kmSurcharge)}</span></div>}
                {quote.extrasBreakdown.map((e, i) => <div key={i} className="flex justify-between"><span className="text-gray-400">{e.name}</span><span>{formatCHF(e.total)}</span></div>)}
                {quote.insuranceTotal > 0 && <div className="flex justify-between"><span className="text-gray-400">{t("insuranceOptions")} ({quote.insuranceName})</span><span>{formatCHF(quote.insuranceTotal)}</span></div>}
                <div className="divider pt-3 mt-3 flex justify-between font-bold text-base"><span>{t("total")}</span><span>{formatCHF(quote.total)}</span></div>
                <p className="text-xs text-gray-500 mt-2">{t("deposit")}: {formatCHF(quote.deposit)}</p>
              </div>
            </div>
          )}

          <div className="card p-6">
            <h3 className="text-sm font-semibold mb-4">{t("contactForm")}</h3>
            <div className="space-y-4">
              <div><label className="label-field">{t("fullName")} *</label><input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="input-field" /></div>
              <div><label className="label-field">{t("phone")} *</label><input type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="+41 79 123 45 67" className="input-field" /></div>
              <div><label className="label-field">{t("email")}</label><input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className="input-field" /></div>
              <div><label className="label-field">{t("notes")}</label><textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="input-field resize-none" /></div>
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} className="accent-white mt-0.5" />
                  <span className="text-xs text-gray-400">{t("acceptTerms")} *</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={acceptPrivacy} onChange={(e) => setAcceptPrivacy(e.target.checked)} className="accent-white mt-0.5" />
                  <span className="text-xs text-gray-400">{t("acceptPrivacy")} *</span>
                </label>
              </div>
              <button onClick={handleWhatsApp} disabled={!canSubmit} className="btn-whatsapp w-full flex items-center justify-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed">
                <MessageCircle className="w-5 h-5" /> {t("confirmWhatsApp")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
