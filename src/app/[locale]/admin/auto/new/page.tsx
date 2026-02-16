"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowLeft, Save, Loader2, Upload, X, ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function NewCarPage() {
  const router = useRouter();
  const t = useTranslations("admin");
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    brand: "",
    model: "",
    trim: "",
    year: new Date().getFullYear().toString(),
    category: "SEDAN",
    transmission: "AUTOMATIC",
    fuelType: "PETROL",
    drivetrain: "FWD",
    seats: "5",
    doors: "4",
    luggage: "2",
    powerKw: "",
    powerHp: "",
    plateNumber: "",
    internalId: "",
    locationId: "",
    minAge: "21",
    minLicenseYears: "1",
    baseFranchise: "",
    kmPerDay: "100",
    baseInsurance: true,
    status: "ACTIVE",
    coverImage: "",
  });

  useEffect(() => {
    fetch("/api/admin/locations")
      .then((r) => r.json())
      .then(setLocations);
  }, []);

  const handleUpload = async (file: File, type: "cover" | "gallery") => {
    if (type === "cover") setUploading(true);
    else setGalleryUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        if (type === "cover") {
          setForm((prev) => ({ ...prev, coverImage: data.url }));
        } else {
          setGalleryImages((prev) => [...prev, data.url]);
        }
      }
    } catch (err) {
      console.error("Upload error:", err);
    }

    if (type === "cover") setUploading(false);
    else setGalleryUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, galleryImages }),
      });

      if (res.ok) {
        router.push("/admin/auto");
      }
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/auto" className="p-2 text-gray-500 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="heading-2">{t("newCar")}</h1>
          <p className="text-sm text-gray-500 mt-1">{t("fillData")}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
        {/* Basic Info */}
        <div className="card p-6">
          <h3 className="text-sm font-semibold mb-4">{t("basicInfo")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label-field">{t("brand")} *</label>
              <input type="text" value={form.brand} onChange={(e) => updateField("brand", e.target.value)} className="input-field" required placeholder="es. BMW" />
            </div>
            <div>
              <label className="label-field">{t("model")} *</label>
              <input type="text" value={form.model} onChange={(e) => updateField("model", e.target.value)} className="input-field" required placeholder="es. Serie 3" />
            </div>
            <div>
              <label className="label-field">{t("trim")}</label>
              <input type="text" value={form.trim} onChange={(e) => updateField("trim", e.target.value)} className="input-field" placeholder="es. M Sport" />
            </div>
            <div>
              <label className="label-field">{t("year")} *</label>
              <input type="number" value={form.year} onChange={(e) => updateField("year", e.target.value)} className="input-field" required />
            </div>
            <div>
              <label className="label-field">{t("category")} *</label>
              <select value={form.category} onChange={(e) => updateField("category", e.target.value)} className="select-field">
                {["CITY", "SEDAN", "SUV", "LUXURY", "VAN", "SPORTS", "CONVERTIBLE", "WAGON"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-field">{t("status")}</label>
              <select value={form.status} onChange={(e) => updateField("status", e.target.value)} className="select-field">
                <option value="ACTIVE">{t("status_active")}</option>
                <option value="UNAVAILABLE">{t("status_inactive")}</option>
                <option value="MAINTENANCE">{t("status_maintenance")}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Technical */}
        <div className="card p-6">
          <h3 className="text-sm font-semibold mb-4">{t("technical")}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="label-field">{t("transmission")} *</label>
              <select value={form.transmission} onChange={(e) => updateField("transmission", e.target.value)} className="select-field">
                <option value="AUTOMATIC">{t("automatic")}</option>
                <option value="MANUAL">{t("manual")}</option>
              </select>
            </div>
            <div>
              <label className="label-field">{t("fuel")} *</label>
              <select value={form.fuelType} onChange={(e) => updateField("fuelType", e.target.value)} className="select-field">
                <option value="PETROL">{t("petrol")}</option>
                <option value="DIESEL">{t("diesel")}</option>
                <option value="HYBRID">{t("hybrid")}</option>
                <option value="ELECTRIC">{t("electric")}</option>
              </select>
            </div>
            <div>
              <label className="label-field">{t("drivetrain")} *</label>
              <select value={form.drivetrain} onChange={(e) => updateField("drivetrain", e.target.value)} className="select-field">
                <option value="FWD">{t("fwd")}</option>
                <option value="RWD">{t("rwd")}</option>
                <option value="AWD">{t("awd")}</option>
              </select>
            </div>
            <div>
              <label className="label-field">{t("seats")} *</label>
              <input type="number" value={form.seats} onChange={(e) => updateField("seats", e.target.value)} className="input-field" required />
            </div>
            <div>
              <label className="label-field">{t("doors")} *</label>
              <input type="number" value={form.doors} onChange={(e) => updateField("doors", e.target.value)} className="input-field" required />
            </div>
            <div>
              <label className="label-field">{t("luggage")} *</label>
              <input type="number" value={form.luggage} onChange={(e) => updateField("luggage", e.target.value)} className="input-field" required />
            </div>
            <div>
              <label className="label-field">{t("powerKw")}</label>
              <input type="number" value={form.powerKw} onChange={(e) => updateField("powerKw", e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="label-field">{t("powerHp")}</label>
              <input type="number" value={form.powerHp} onChange={(e) => updateField("powerHp", e.target.value)} className="input-field" />
            </div>
          </div>
        </div>

        {/* Internal & Location */}
        <div className="card p-6">
          <h3 className="text-sm font-semibold mb-4">{t("locationAndInternal")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label-field">{t("location")}</label>
              <select value={form.locationId} onChange={(e) => updateField("locationId", e.target.value)} className="select-field">
                <option value="">{t("none")}</option>
                {locations.map((l: any) => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-field">{t("plates")}</label>
              <input type="text" value={form.plateNumber} onChange={(e) => updateField("plateNumber", e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="label-field">{t("internalId")}</label>
              <input type="text" value={form.internalId} onChange={(e) => updateField("internalId", e.target.value)} className="input-field" />
            </div>
          </div>
        </div>

        {/* Policies */}
        <div className="card p-6">
          <h3 className="text-sm font-semibold mb-4">{t("policies")}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="label-field">{t("minAge")}</label>
              <input type="number" value={form.minAge} onChange={(e) => updateField("minAge", e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="label-field">{t("minLicenseYears")}</label>
              <input type="number" value={form.minLicenseYears} onChange={(e) => updateField("minLicenseYears", e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="label-field">{t("baseFranchise")}</label>
              <input type="number" value={form.baseFranchise} onChange={(e) => updateField("baseFranchise", e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="label-field">{t("kmPerDay")}</label>
              <input type="number" value={form.kmPerDay} onChange={(e) => updateField("kmPerDay", e.target.value)} className="input-field" />
            </div>
          </div>
          <label className="flex items-center gap-3 mt-4 cursor-pointer">
            <input type="checkbox" checked={form.baseInsurance} onChange={(e) => updateField("baseInsurance", e.target.checked)} className="accent-white" />
            <span className="text-sm text-gray-400">{t("baseInsuranceIncluded")}</span>
          </label>
        </div>

        {/* Cover Image Upload */}
        <div className="card p-6">
          <h3 className="text-sm font-semibold mb-4">{t("coverImage")}</h3>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file, "cover");
            }}
          />
          {form.coverImage ? (
            <div className="relative w-full max-w-md aspect-[16/10] rounded-xl overflow-hidden border border-white/10">
              <Image src={form.coverImage} alt="Cover" fill className="object-cover" />
              <button
                type="button"
                onClick={() => updateField("coverImage", "")}
                className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-lg hover:bg-black/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              disabled={uploading}
              className="w-full max-w-md aspect-[16/10] rounded-xl border-2 border-dashed border-white/10 hover:border-white/20 flex flex-col items-center justify-center gap-2 transition-colors"
            >
              {uploading ? (
                <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
              ) : (
                <>
                  <Upload className="w-6 h-6 text-gray-500" />
                  <span className="text-sm text-gray-500">{t("uploadCover")}</span>
                  <span className="text-xs text-gray-600">{t("uploadFormat")}</span>
                </>
              )}
            </button>
          )}
          <div className="mt-3">
            <label className="label-field">{t("orEnterUrl")}</label>
            <input
              type="url"
              value={form.coverImage}
              onChange={(e) => updateField("coverImage", e.target.value)}
              className="input-field"
              placeholder="https://..."
            />
          </div>
        </div>

        {/* Gallery Images Upload */}
        <div className="card p-6">
          <h3 className="text-sm font-semibold mb-4">{t("gallery")}</h3>
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              const files = e.target.files;
              if (files) {
                Array.from(files).forEach((file) => handleUpload(file, "gallery"));
              }
            }}
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {galleryImages.map((url, i) => (
              <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-white/10">
                <Image src={url} alt={`Gallery ${i + 1}`} fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => setGalleryImages((prev) => prev.filter((_, idx) => idx !== i))}
                  className="absolute top-1.5 right-1.5 p-1 bg-black/60 rounded-lg hover:bg-black/80 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              disabled={galleryUploading}
              className="aspect-[4/3] rounded-xl border-2 border-dashed border-white/10 hover:border-white/20 flex flex-col items-center justify-center gap-1.5 transition-colors"
            >
              {galleryUploading ? (
                <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
              ) : (
                <>
                  <ImageIcon className="w-5 h-5 text-gray-500" />
                  <span className="text-xs text-gray-500">{t("addImage")}</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {t("saveCar")}
          </button>
          <Link href="/admin/auto" className="btn-secondary">
            {t("cancel")}
          </Link>
        </div>
      </form>
    </div>
  );
}
