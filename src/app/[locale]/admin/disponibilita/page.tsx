"use client";

import { useEffect, useState } from "react";
import { CalendarOff, Plus, Loader2, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function AdminAvailabilityPage() {
  const t = useTranslations("admin");
  const [blocks, setBlocks] = useState<any[]>([]);
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    carId: "",
    startDate: "",
    endDate: "",
    reason: "MAINTENANCE",
    note: "",
  });

  const reasonLabels: Record<string, string> = {
    MAINTENANCE: t("maintenance"),
    RESERVED: t("reserved"),
    OTHER: t("other"),
  };

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/availability").then((r) => r.json()),
      fetch("/api/admin/cars").then((r) => r.json()),
    ]).then(([b, c]) => {
      setBlocks(b);
      setCars(c);
      setLoading(false);
    });
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const data = await res.json();
      setBlocks((prev) => [data, ...prev]);
      setShowForm(false);
      setForm({ carId: "", startDate: "", endDate: "", reason: "MAINTENANCE", note: "" });
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("deleteBlock"))) return;
    const res = await fetch("/api/admin/availability", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="heading-2">{t("availability")}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {t("availabilitySubtitle")}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" /> {t("newBlock")}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="card p-6 mb-8 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            <div className="lg:col-span-2">
              <label className="label-field">{t("selectCar")} *</label>
              <select
                value={form.carId}
                onChange={(e) => setForm({ ...form, carId: e.target.value })}
                className="select-field"
                required
              >
                <option value="">{t("selectCar")}</option>
                {cars.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.brand} {c.model} {c.trim || ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-field">{t("startDate")} *</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="label-field">{t("endDate")} *</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="label-field">{t("reason")}</label>
              <select
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                className="select-field"
              >
                <option value="MAINTENANCE">{t("maintenance")}</option>
                <option value="RESERVED">{t("reserved")}</option>
                <option value="OTHER">{t("other")}</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="label-field">{t("internalNotes")}</label>
            <input
              type="text"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              className="input-field"
              placeholder={t("optionalPlaceholder")}
            />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary text-sm flex items-center gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {t("save")}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-ghost text-sm">
              {t("cancel")}
            </button>
          </div>
        </form>
      )}

      {blocks.length === 0 ? (
        <div className="card p-12 text-center">
          <CalendarOff className="w-10 h-10 mx-auto mb-3 text-gray-600" />
          <p className="text-gray-500">{t("noBlocks")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {blocks.map((b) => (
            <div key={b.id} className="card p-5 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      b.reason === "MAINTENANCE"
                        ? "bg-yellow-500"
                        : b.reason === "RESERVED"
                        ? "bg-blue-500"
                        : "bg-gray-500"
                    }`}
                  />
                  <span className="text-sm font-medium">
                    {b.car?.brand} {b.car?.model}
                  </span>
                </div>
                <span className="text-xs text-gray-500 px-2 py-1 rounded-md bg-white/[0.04]">
                  {reasonLabels[b.reason] || b.reason}
                </span>
                <span className="text-sm text-gray-400">
                  {new Date(b.startDate).toLocaleDateString("it-CH")} →{" "}
                  {new Date(b.endDate).toLocaleDateString("it-CH")}
                </span>
                {b.note && (
                  <span className="text-xs text-gray-500 italic">{b.note}</span>
                )}
              </div>
              <button
                onClick={() => handleDelete(b.id)}
                className="p-2 text-gray-600 hover:text-red-400 transition-colors rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
