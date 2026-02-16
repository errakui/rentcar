"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { DollarSign, Plus, Loader2 } from "lucide-react";
import { formatCHF } from "@/lib/utils";

export default function AdminTariffePage() {
  const t = useTranslations("admin");
  const [ratePlans, setRatePlans] = useState<any[]>([]);
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    carId: "",
    dailyPrice: "",
    weeklyPrice: "",
    monthlyPrice: "",
    discount3Days: "",
    discount7Days: "",
    discount30Days: "",
    kmIncluded: "100",
    extraKmPrice: "0.50",
    unlimitedKm: false,
    deposit: "1000",
    depositNotes: "",
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/rate-plans").then((r) => r.json()),
      fetch("/api/admin/cars").then((r) => r.json()),
    ]).then(([rp, c]) => {
      setRatePlans(rp);
      setCars(c);
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/rate-plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const data = await res.json();
      setRatePlans((prev) => [data, ...prev]);
      setShowForm(false);
    }
    setSaving(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="heading-2">{t("rates")}</h1>
          <p className="text-sm text-gray-500 mt-1">{t("ratesSubtitle")}</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> {t("newRate")}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card p-6 mb-6 animate-fadeIn space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label-field">{t("car")} *</label>
              <select value={form.carId} onChange={(e) => setForm({ ...form, carId: e.target.value })} className="select-field" required>
                <option value="">{t("selectCar")}</option>
                {cars.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.brand} {c.model} ({c.year})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-field">{t("dailyPriceLabel")} *</label>
              <input type="number" step="0.01" value={form.dailyPrice} onChange={(e) => setForm({ ...form, dailyPrice: e.target.value })} className="input-field" required />
            </div>
            <div>
              <label className="label-field">{t("weeklyPrice")}</label>
              <input type="number" step="0.01" value={form.weeklyPrice} onChange={(e) => setForm({ ...form, weeklyPrice: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="label-field">{t("monthlyPrice")}</label>
              <input type="number" step="0.01" value={form.monthlyPrice} onChange={(e) => setForm({ ...form, monthlyPrice: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="label-field">{t("discount3Days")}</label>
              <input type="number" value={form.discount3Days} onChange={(e) => setForm({ ...form, discount3Days: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="label-field">{t("discount7Days")}</label>
              <input type="number" value={form.discount7Days} onChange={(e) => setForm({ ...form, discount7Days: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="label-field">{t("kmIncluded")}</label>
              <input type="number" value={form.kmIncluded} onChange={(e) => setForm({ ...form, kmIncluded: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="label-field">{t("extraKmPrice")}</label>
              <input type="number" step="0.01" value={form.extraKmPrice} onChange={(e) => setForm({ ...form, extraKmPrice: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="label-field">{t("deposit")}</label>
              <input type="number" value={form.deposit} onChange={(e) => setForm({ ...form, deposit: e.target.value })} className="input-field" />
            </div>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.unlimitedKm} onChange={(e) => setForm({ ...form, unlimitedKm: e.target.checked })} className="accent-white" />
            <span className="text-sm text-gray-400">{t("unlimitedKm")}</span>
          </label>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary text-sm flex items-center gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />} {t("saveRate")}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-ghost text-sm">{t("cancel")}</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="card p-16 text-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="table-container">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-header">{t("car")}</th>
                  <th className="table-header">{t("day")}</th>
                  <th className="table-header">{t("week")}</th>
                  <th className="table-header">{t("kmIncludedCol")}</th>
                  <th className="table-header">{t("depositCol")}</th>
                  <th className="table-header">{t("statusLabel")}</th>
                </tr>
              </thead>
              <tbody>
                {ratePlans.map((rp) => (
                  <tr key={rp.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="table-cell font-medium">{rp.car?.brand} {rp.car?.model}</td>
                    <td className="table-cell">{formatCHF(rp.dailyPrice)}</td>
                    <td className="table-cell">{rp.weeklyPrice ? formatCHF(rp.weeklyPrice) : "—"}</td>
                    <td className="table-cell">{rp.unlimitedKm ? t("unlimited") : `${rp.kmIncluded} km`}</td>
                    <td className="table-cell">{formatCHF(rp.deposit)}</td>
                    <td className="table-cell">
                      <span className={rp.active ? "badge-success" : "badge-danger"}>
                        {rp.active ? t("status_active") : t("status_disabled")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
