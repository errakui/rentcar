"use client";

import { useEffect, useState } from "react";
import { Settings, Save, Loader2 } from "lucide-react";

const DEFAULT_SETTINGS = [
  { key: "whatsapp_number", label: "Numero WhatsApp", placeholder: "+41791234567" },
  { key: "currency", label: "Valuta", placeholder: "CHF" },
  { key: "vat_rate", label: "Aliquota IVA (%)", placeholder: "0" },
  { key: "company_name", label: "Nome azienda", placeholder: "RentCar SA" },
  { key: "company_email", label: "Email azienda", placeholder: "info@rentcar.ch" },
  { key: "company_phone", label: "Telefono azienda", placeholder: "+41..." },
  { key: "min_rental_hours", label: "Minimo noleggio (ore)", placeholder: "24" },
  { key: "terms_url", label: "URL Condizioni generali", placeholder: "https://..." },
  { key: "privacy_url", label: "URL Privacy Policy", placeholder: "https://..." },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        const map: Record<string, string> = {};
        data.forEach((s: any) => {
          map[s.key] = s.value;
        });
        setSettings(map);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="heading-2">Impostazioni</h1>
          <p className="text-sm text-gray-500 mt-1">Configurazione generale del portale</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 text-sm">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saved ? "Salvato ✓" : "Salva impostazioni"}
        </button>
      </div>

      {loading ? (
        <div className="card p-16 text-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <div className="card p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DEFAULT_SETTINGS.map((s) => (
              <div key={s.key}>
                <label className="label-field">{s.label}</label>
                <input
                  type="text"
                  value={settings[s.key] || ""}
                  onChange={(e) => setSettings({ ...settings, [s.key]: e.target.value })}
                  className="input-field"
                  placeholder={s.placeholder}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
