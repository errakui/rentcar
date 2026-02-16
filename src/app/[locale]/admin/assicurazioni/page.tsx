"use client";

import { useEffect, useState } from "react";
import { Shield, Plus, Loader2, Trash2, Save, Pencil } from "lucide-react";
import { useTranslations } from "next-intl";
import { formatCHF } from "@/lib/utils";

export default function AdminInsurancePage() {
  const t = useTranslations("admin");
  const tCommon = useTranslations("common");
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    pricePerDay: "",
    franchise: "",
    active: true,
  });

  useEffect(() => {
    fetch("/api/admin/insurance")
      .then((r) => r.json())
      .then((data) => {
        setPlans(data);
        setLoading(false);
      });
  }, []);

  const resetForm = () => {
    setForm({ name: "", description: "", pricePerDay: "", franchise: "", active: true });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const method = editingId ? "PUT" : "POST";
    const body = editingId
      ? { ...form, id: editingId }
      : form;

    const res = await fetch("/api/admin/insurance", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const data = await res.json();
      if (editingId) {
        setPlans((prev) => prev.map((p) => (p.id === editingId ? data : p)));
      } else {
        setPlans((prev) => [...prev, data]);
      }
      resetForm();
    }
    setSaving(false);
  };

  const handleEdit = (plan: any) => {
    setForm({
      name: plan.name,
      description: plan.description || "",
      pricePerDay: plan.pricePerDay.toString(),
      franchise: plan.franchise.toString(),
      active: plan.active,
    });
    setEditingId(plan.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("deletePlan"))) return;
    const res = await fetch("/api/admin/insurance", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setPlans((prev) => prev.filter((p) => p.id !== id));
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
          <h1 className="heading-2">{t("insurancePlans")}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {t("insuranceSubtitle")}
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" /> {t("addPlan")}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="card p-6 mb-8 animate-fadeIn space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-field">{t("planName")} *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-field"
                required
                placeholder="es. Premium, Gold, Basic"
              />
            </div>
            <div>
              <label className="label-field">{t("pricePerDayLabel")} (CHF) *</label>
              <input
                type="number"
                step="0.01"
                value={form.pricePerDay}
                onChange={(e) => setForm({ ...form, pricePerDay: e.target.value })}
                className="input-field"
                required
                placeholder="es. 25.00"
              />
            </div>
            <div>
              <label className="label-field">{t("franchiseLabel")} (CHF) *</label>
              <input
                type="number"
                value={form.franchise}
                onChange={(e) => setForm({ ...form, franchise: e.target.value })}
                className="input-field"
                required
                placeholder="es. 500"
              />
            </div>
            <div>
              <label className="label-field">{t("description")}</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="input-field"
                placeholder="Breve descrizione del piano..."
              />
            </div>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
              className="accent-white"
            />
            <span className="text-sm text-gray-400">{t("planActive")}</span>
          </label>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary text-sm flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {editingId ? t("updatePlan") : t("createPlan")}
            </button>
            <button type="button" onClick={resetForm} className="btn-ghost text-sm">
              {t("cancel")}
            </button>
          </div>
        </form>
      )}

      {plans.length === 0 && !showForm ? (
        <div className="card p-12 text-center">
          <Shield className="w-10 h-10 mx-auto mb-3 text-gray-600" />
          <p className="text-gray-500">{t("noPlan")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div key={plan.id} className="card p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/[0.04] border border-white/[0.08]">
                    <Shield className="w-4 h-4 text-gray-400" />
                  </div>
                  <h3 className="font-semibold text-sm">{plan.name}</h3>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full ${
                    plan.active
                      ? "bg-green-500/10 text-green-400"
                      : "bg-gray-500/10 text-gray-500"
                  }`}
                >
                  {plan.active ? t("activeStatus") : t("disabledStatus")}
                </span>
              </div>
              {plan.description && (
                <p className="text-xs text-gray-500 mb-4">{plan.description}</p>
              )}
              <div className="flex gap-6 mb-4">
                <div>
                  <p className="text-xs text-gray-600 mb-0.5">{t("perDayShort")}</p>
                  <p className="text-sm font-bold">{formatCHF(plan.pricePerDay)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-0.5">{t("franchise")}</p>
                  <p className="text-sm font-bold">{formatCHF(plan.franchise)}</p>
                </div>
              </div>
              <div className="flex gap-2 border-t border-white/[0.06] pt-3">
                <button
                  onClick={() => handleEdit(plan)}
                  className="flex-1 px-3 py-1.5 text-xs text-gray-400 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Pencil className="w-3 h-3" /> {tCommon("edit")}
                </button>
                <button
                  onClick={() => handleDelete(plan.id)}
                  className="p-1.5 text-gray-600 hover:text-red-400 transition-colors rounded-lg border border-white/10 hover:border-red-500/30"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
