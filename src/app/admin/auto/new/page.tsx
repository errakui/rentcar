"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";

export default function NewCarPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState<any[]>([]);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
          <h1 className="heading-2">Nuova auto</h1>
          <p className="text-sm text-gray-500 mt-1">Compila i dati del veicolo</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
        {/* Basic Info */}
        <div className="card p-6">
          <h3 className="text-sm font-semibold mb-4">Informazioni base</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label-field">Marca *</label>
              <input
                type="text"
                value={form.brand}
                onChange={(e) => updateField("brand", e.target.value)}
                className="input-field"
                required
                placeholder="es. BMW"
              />
            </div>
            <div>
              <label className="label-field">Modello *</label>
              <input
                type="text"
                value={form.model}
                onChange={(e) => updateField("model", e.target.value)}
                className="input-field"
                required
                placeholder="es. Serie 3"
              />
            </div>
            <div>
              <label className="label-field">Allestimento</label>
              <input
                type="text"
                value={form.trim}
                onChange={(e) => updateField("trim", e.target.value)}
                className="input-field"
                placeholder="es. M Sport"
              />
            </div>
            <div>
              <label className="label-field">Anno *</label>
              <input
                type="number"
                value={form.year}
                onChange={(e) => updateField("year", e.target.value)}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="label-field">Categoria *</label>
              <select value={form.category} onChange={(e) => updateField("category", e.target.value)} className="select-field">
                {["CITY", "SEDAN", "SUV", "LUXURY", "VAN", "SPORTS", "CONVERTIBLE", "WAGON"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-field">Stato</label>
              <select value={form.status} onChange={(e) => updateField("status", e.target.value)} className="select-field">
                <option value="ACTIVE">Attiva</option>
                <option value="UNAVAILABLE">Non disponibile</option>
                <option value="MAINTENANCE">Manutenzione</option>
              </select>
            </div>
          </div>
        </div>

        {/* Technical */}
        <div className="card p-6">
          <h3 className="text-sm font-semibold mb-4">Dati tecnici</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="label-field">Cambio *</label>
              <select value={form.transmission} onChange={(e) => updateField("transmission", e.target.value)} className="select-field">
                <option value="AUTOMATIC">Automatico</option>
                <option value="MANUAL">Manuale</option>
              </select>
            </div>
            <div>
              <label className="label-field">Carburante *</label>
              <select value={form.fuelType} onChange={(e) => updateField("fuelType", e.target.value)} className="select-field">
                <option value="PETROL">Benzina</option>
                <option value="DIESEL">Diesel</option>
                <option value="HYBRID">Ibrido</option>
                <option value="ELECTRIC">Elettrica</option>
              </select>
            </div>
            <div>
              <label className="label-field">Trazione *</label>
              <select value={form.drivetrain} onChange={(e) => updateField("drivetrain", e.target.value)} className="select-field">
                <option value="FWD">Anteriore (FWD)</option>
                <option value="RWD">Posteriore (RWD)</option>
                <option value="AWD">Integrale (AWD)</option>
              </select>
            </div>
            <div>
              <label className="label-field">Posti *</label>
              <input type="number" value={form.seats} onChange={(e) => updateField("seats", e.target.value)} className="input-field" required />
            </div>
            <div>
              <label className="label-field">Porte *</label>
              <input type="number" value={form.doors} onChange={(e) => updateField("doors", e.target.value)} className="input-field" required />
            </div>
            <div>
              <label className="label-field">Bagagli *</label>
              <input type="number" value={form.luggage} onChange={(e) => updateField("luggage", e.target.value)} className="input-field" required />
            </div>
            <div>
              <label className="label-field">Potenza kW</label>
              <input type="number" value={form.powerKw} onChange={(e) => updateField("powerKw", e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="label-field">Potenza HP</label>
              <input type="number" value={form.powerHp} onChange={(e) => updateField("powerHp", e.target.value)} className="input-field" />
            </div>
          </div>
        </div>

        {/* Internal & Location */}
        <div className="card p-6">
          <h3 className="text-sm font-semibold mb-4">Sede e dati interni</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label-field">Sede</label>
              <select value={form.locationId} onChange={(e) => updateField("locationId", e.target.value)} className="select-field">
                <option value="">Nessuna</option>
                {locations.map((l: any) => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-field">Targa (interna)</label>
              <input type="text" value={form.plateNumber} onChange={(e) => updateField("plateNumber", e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="label-field">ID interno</label>
              <input type="text" value={form.internalId} onChange={(e) => updateField("internalId", e.target.value)} className="input-field" />
            </div>
          </div>
        </div>

        {/* Policies */}
        <div className="card p-6">
          <h3 className="text-sm font-semibold mb-4">Policy & Requisiti</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="label-field">Età minima</label>
              <input type="number" value={form.minAge} onChange={(e) => updateField("minAge", e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="label-field">Anni patente min.</label>
              <input type="number" value={form.minLicenseYears} onChange={(e) => updateField("minLicenseYears", e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="label-field">Franchigia base (CHF)</label>
              <input type="number" value={form.baseFranchise} onChange={(e) => updateField("baseFranchise", e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="label-field">Km inclusi/giorno</label>
              <input type="number" value={form.kmPerDay} onChange={(e) => updateField("kmPerDay", e.target.value)} className="input-field" />
            </div>
          </div>
          <label className="flex items-center gap-3 mt-4 cursor-pointer">
            <input
              type="checkbox"
              checked={form.baseInsurance}
              onChange={(e) => updateField("baseInsurance", e.target.checked)}
              className="accent-white"
            />
            <span className="text-sm text-gray-400">Assicurazione base inclusa</span>
          </label>
        </div>

        {/* Cover image */}
        <div className="card p-6">
          <h3 className="text-sm font-semibold mb-4">Immagine copertina</h3>
          <div>
            <label className="label-field">URL immagine</label>
            <input
              type="url"
              value={form.coverImage}
              onChange={(e) => updateField("coverImage", e.target.value)}
              className="input-field"
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Salva auto
          </button>
          <Link href="/admin/auto" className="btn-secondary">
            Annulla
          </Link>
        </div>
      </form>
    </div>
  );
}
